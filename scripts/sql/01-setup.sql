-- 01 · SETUP — schema, bid function, security rules, realtime, and the 38 tables.
--
-- When:  once, on a fresh Supabase project (SQL Editor → paste → Run).
-- Safe:  yes, re-runnable. It never changes existing rows: missing tables are added,
--        existing tables/bids/users are left exactly as they are.
-- Avoid: running it while bidding is live — it briefly locks the tables while it
--        re-creates triggers and policies.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tables (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN
    ('DJ_BOOTH', 'LEVEL_01', 'DANCE_FLOOR', 'FLOOR_SIDE', 'FRONT_ROW', 'BALCONY', 'KEY_CLUB', 'RESERVED')),
  pax VARCHAR(10) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  base_price INTEGER NOT NULL DEFAULT 0,
  current_bid INTEGER NOT NULL DEFAULT 0,
  highest_bidder_id INTEGER REFERENCES users(id),
  highest_bidder_username VARCHAR(50),
  bid_count INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  bidding_starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bidding_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '3 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- For databases created from the older v3 script
ALTER TABLE tables ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- When the current round of bidding began for each table. The bid history only shows bids
-- placed since then. It's set when a table is created and by 04-reset-for-new-event.sql —
-- moving the bidding window (03) does NOT change it, so earlier bids stay in the history.
ALTER TABLE tables ADD COLUMN IF NOT EXISTS round_started_at TIMESTAMP WITH TIME ZONE;
UPDATE tables SET round_started_at = created_at WHERE round_started_at IS NULL;
ALTER TABLE tables ALTER COLUMN round_started_at SET DEFAULT NOW();
ALTER TABLE tables ALTER COLUMN round_started_at SET NOT NULL;

CREATE TABLE IF NOT EXISTS bids (
  id SERIAL PRIMARY KEY,
  table_id VARCHAR(10) NOT NULL REFERENCES tables(id),
  user_id INTEGER REFERENCES users(id),
  username VARCHAR(50) NOT NULL,
  bid_amount INTEGER NOT NULL CHECK (bid_amount > 0),
  previous_bid INTEGER NOT NULL DEFAULT 0,
  bid_increment INTEGER GENERATED ALWAYS AS (bid_amount - previous_bid) STORED,
  bid_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_winning BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_tables_active ON tables(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_tables_current_bid ON tables(current_bid DESC);
CREATE INDEX IF NOT EXISTS idx_tables_category ON tables(category);
CREATE INDEX IF NOT EXISTS idx_tables_sort_order ON tables(sort_order);
CREATE INDEX IF NOT EXISTS idx_bids_table_id ON bids(table_id);
CREATE INDEX IF NOT EXISTS idx_bids_user_id ON bids(user_id);
CREATE INDEX IF NOT EXISTS idx_bids_time ON bids(bid_time DESC);
CREATE INDEX IF NOT EXISTS idx_bids_winning ON bids(is_winning) WHERE is_winning = true;
CREATE INDEX IF NOT EXISTS idx_bids_table_time ON bids(table_id, bid_time DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tables_updated_at ON tables;
CREATE TRIGGER update_tables_updated_at BEFORE UPDATE ON tables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- place_bid(): atomic bid placement — row lock + optimistic version check.
-- v_bid_increment must match BID_INCREMENT in lib/bidding-constants.ts.
CREATE OR REPLACE FUNCTION place_bid(
    p_table_id VARCHAR(10),
    p_user_id INTEGER,
    p_username VARCHAR(50),
    p_bid_amount INTEGER,
    p_expected_version INTEGER DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_session_id VARCHAR(255) DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_table_record RECORD;
    v_minimum_bid INTEGER;
    v_bid_id INTEGER;
    v_current_time TIMESTAMP WITH TIME ZONE;
    v_bid_increment CONSTANT INTEGER := 1000;
BEGIN
    -- Plain NOW(). `NOW() AT TIME ZONE 'Asia/Kolkata'` returns an IST wall-clock with no
    -- zone, which Postgres re-reads as UTC — shifting "now" 5.5h ahead.
    v_current_time := NOW();

    SELECT * INTO v_table_record
    FROM tables
    WHERE id = p_table_id AND is_active = true
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Table not found or inactive', 'error_code', 'TABLE_NOT_FOUND');
    END IF;

    IF v_current_time < v_table_record.bidding_starts_at THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Bidding has not started yet. Please wait for the event to begin.',
            'error_code', 'BIDDING_NOT_STARTED',
            'starts_at', v_table_record.bidding_starts_at
        );
    END IF;

    IF v_current_time > v_table_record.bidding_ends_at THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Bidding has ended for this table',
            'error_code', 'BIDDING_ENDED',
            'ended_at', v_table_record.bidding_ends_at
        );
    END IF;

    IF p_expected_version IS NOT NULL AND v_table_record.version != p_expected_version THEN
        RETURN json_build_object(
            'success', false,
            'error', format('Someone just outbid you — table is now ₹%s', v_table_record.current_bid),
            'error_code', 'VERSION_CONFLICT',
            'current_version', v_table_record.version,
            'current_bid', v_table_record.current_bid,
            'minimum_bid', v_table_record.current_bid + v_bid_increment
        );
    END IF;

    v_minimum_bid := v_table_record.current_bid + v_bid_increment;

    IF p_bid_amount < v_minimum_bid THEN
        RETURN json_build_object(
            'success', false,
            'error', format('Bid must be at least ₹%s', v_minimum_bid),
            'error_code', 'INSUFFICIENT_BID',
            'minimum_bid', v_minimum_bid,
            'current_bid', v_table_record.current_bid
        );
    END IF;

    UPDATE bids SET is_winning = false WHERE table_id = p_table_id AND is_winning = true;

    INSERT INTO bids (table_id, user_id, username, bid_amount, previous_bid, is_winning, ip_address, user_agent, session_id)
    VALUES (p_table_id, p_user_id, p_username, p_bid_amount, v_table_record.current_bid, true, p_ip_address, p_user_agent, p_session_id)
    RETURNING id INTO v_bid_id;

    UPDATE tables
    SET current_bid = p_bid_amount,
        highest_bidder_id = p_user_id,
        highest_bidder_username = p_username,
        bid_count = bid_count + 1,
        version = version + 1
    WHERE id = p_table_id;

    RETURN json_build_object(
        'success', true,
        'bid_id', v_bid_id,
        'new_bid', p_bid_amount,
        'previous_bid', v_table_record.current_bid,
        'new_version', v_table_record.version + 1,
        'time_remaining', EXTRACT(EPOCH FROM (v_table_record.bidding_ends_at - v_current_time)),
        'message', 'Bid placed successfully'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'An unexpected error occurred: ' || SQLERRM, 'error_code', 'INTERNAL_ERROR');
END;
$$ LANGUAGE plpgsql;

-- The 38 tables from the Xclusive poster, in poster order. Only XC1-XC6 and A1-A6 are
-- open for bidding (is_active = true). ON CONFLICT DO NOTHING: existing tables are
-- never touched — use 04-reset-for-new-event.sql to reset prices and standings.
INSERT INTO tables (id, name, category, pax, sort_order, base_price, current_bid, is_active) VALUES
('XC1', 'XC1', 'DJ_BOOTH', '6-8', 1, 100000, 100000, true),
('XC2', 'XC2', 'DJ_BOOTH', '6-8', 2, 100000, 100000, true),
('XC3', 'XC3', 'DJ_BOOTH', '6-8', 3, 100000, 100000, true),
('XC4', 'XC4', 'DJ_BOOTH', '6-8', 4, 100000, 100000, true),
('XC5', 'XC5', 'DJ_BOOTH', '6-8', 5, 100000, 100000, true),
('XC6', 'XC6', 'DJ_BOOTH', '6-8', 6, 100000, 100000, true),
('E1', 'E1', 'LEVEL_01', '4-6', 7, 10000, 10000, false),
('E2', 'E2', 'LEVEL_01', '4-6', 8, 10000, 10000, false),
('E3', 'E3', 'LEVEL_01', '4-6', 9, 10000, 10000, false),
('T1', 'T1', 'RESERVED', '2-4', 10, 10000, 10000, false),
('D1', 'D1', 'DANCE_FLOOR', '4', 11, 10000, 10000, false),
('D2', 'D2', 'DANCE_FLOOR', '4', 12, 10000, 10000, false),
('D3', 'D3', 'DANCE_FLOOR', '4', 13, 10000, 10000, false),
('D4', 'D4', 'DANCE_FLOOR', '4', 14, 10000, 10000, false),
('D5', 'D5', 'DANCE_FLOOR', '4', 15, 10000, 10000, false),
('D6', 'D6', 'DANCE_FLOOR', '4', 16, 10000, 10000, false),
('D7', 'D7', 'DANCE_FLOOR', '4', 17, 10000, 10000, false),
('D8', 'D8', 'DANCE_FLOOR', '4', 18, 10000, 10000, false),
('D9', 'D9', 'DANCE_FLOOR', '4', 19, 10000, 10000, false),
('D10', 'D10', 'DANCE_FLOOR', '4', 20, 10000, 10000, false),
('F1', 'F1', 'FLOOR_SIDE', '4', 21, 10000, 10000, false),
('F2', 'F2', 'FLOOR_SIDE', '4', 22, 10000, 10000, false),
('F3', 'F3', 'FLOOR_SIDE', '4', 23, 10000, 10000, false),
('F4', 'F4', 'FLOOR_SIDE', '4', 24, 10000, 10000, false),
('F5', 'F5', 'FLOOR_SIDE', '4', 25, 10000, 10000, false),
('A1', 'A1', 'FRONT_ROW', '6-8', 26, 100000, 100000, true),
('A2', 'A2', 'FRONT_ROW', '6-8', 27, 100000, 100000, true),
('A3', 'A3', 'FRONT_ROW', '6-8', 28, 100000, 100000, true),
('A4', 'A4', 'FRONT_ROW', '6-8', 29, 80000, 80000, true),
('A5', 'A5', 'FRONT_ROW', '6-8', 30, 80000, 80000, true),
('A6', 'A6', 'FRONT_ROW', '6-8', 31, 80000, 80000, true),
('B1', 'B1', 'BALCONY', '4-6', 32, 10000, 10000, false),
('B2', 'B2', 'BALCONY', '4-6', 33, 10000, 10000, false),
('B3', 'B3', 'BALCONY', '4-6', 34, 10000, 10000, false),
('KC1', 'KC1', 'KEY_CLUB', '8-10', 35, 10000, 10000, false),
('KC2', 'KC2', 'KEY_CLUB', '8-10', 36, 10000, 10000, false),
('T2', 'T2', 'RESERVED', '2-4', 37, 10000, 10000, false),
('T3', 'T3', 'RESERVED', '2-4', 38, 10000, 10000, false)
ON CONFLICT (id) DO NOTHING;

-- Row-level security. Access is enforced by the app and place_bid(), so the rules are
-- open; they must exist because the app connects with the publishable (anon) key.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to tables" ON tables;
DROP POLICY IF EXISTS "Allow public read access to bids" ON bids;
DROP POLICY IF EXISTS "Allow public read access to users" ON users;
DROP POLICY IF EXISTS "Allow authenticated updates to tables" ON tables;
DROP POLICY IF EXISTS "Allow authenticated inserts to bids" ON bids;
DROP POLICY IF EXISTS "Allow authenticated updates to users" ON users;
DROP POLICY IF EXISTS "Allow authenticated inserts to users" ON users;
DROP POLICY IF EXISTS "Allow authenticated deletes to users" ON users;

CREATE POLICY "Allow public read access to tables" ON tables FOR SELECT USING (true);
CREATE POLICY "Allow public read access to bids" ON bids FOR SELECT USING (true);
CREATE POLICY "Allow public read access to users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow authenticated updates to tables" ON tables FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated inserts to bids" ON bids FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated updates to users" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated inserts to users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated deletes to users" ON users FOR DELETE USING (true);

-- Realtime push for bids. A fresh project's supabase_realtime publication is empty;
-- without this the site still works (it polls every 3s) but updates aren't instant.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'tables') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE tables;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'bids') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE bids;
  END IF;
END $$;
