-- Add bidding time control at the top of the file
-- ============================================
-- BIDDING TIME CONFIGURATION
-- Change these values to control when bidding starts and ends
-- Times are in IST (Indian Standard Time)
-- ============================================

-- Set bidding start and end times (CHANGE THESE FOR YOUR EVENT)
-- Format: 'YYYY-MM-DD HH:MM:SS+05:30' (IST timezone)
-- Example: '2024-01-15 19:00:00+05:30' for Jan 15, 2024 at 7:00 PM IST

-- Enhanced database schema with conflict resolution and constraints

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS tables CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table with proper password hashing
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Replace the existing tables creation with enhanced version that includes bidding times
CREATE TABLE tables (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('Diamond', 'Platinum', 'Gold', 'Silver', 'VIP', 'Standing')),
  pax VARCHAR(10) NOT NULL,
  base_price INTEGER NOT NULL DEFAULT 0,
  current_bid INTEGER NOT NULL DEFAULT 0,
  highest_bidder_id INTEGER REFERENCES users(id),
  highest_bidder_username VARCHAR(50),
  bid_count INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1, -- For optimistic locking
  is_active BOOLEAN DEFAULT true,
  -- *** CHANGE THESE TIMES FOR YOUR LIVE EVENT ***
  bidding_starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Event start time in IST
  bidding_ends_at TIMESTAMP WITH TIME ZONE DEFAULT '2025-07-30 23:59:59+05:30',   -- Event end time in IST
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bid history table with proper constraints
CREATE TABLE bids (
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

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;
CREATE INDEX idx_tables_active ON tables(is_active) WHERE is_active = true;
CREATE INDEX idx_tables_current_bid ON tables(current_bid DESC);
CREATE INDEX idx_tables_category ON tables(category);
CREATE INDEX idx_bids_table_id ON bids(table_id);
CREATE INDEX idx_bids_user_id ON bids(user_id);
CREATE INDEX idx_bids_time ON bids(bid_time DESC);
CREATE INDEX idx_bids_winning ON bids(is_winning) WHERE is_winning = true;
CREATE INDEX idx_bids_table_time ON bids(table_id, bid_time DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tables_updated_at BEFORE UPDATE ON tables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update the place_bid function to check bidding times
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
    v_result JSON;
BEGIN
    -- Get current time in IST
    v_current_time := NOW() AT TIME ZONE 'Asia/Kolkata';
    
    -- Lock the table row for update
    SELECT * INTO v_table_record 
    FROM tables 
    WHERE id = p_table_id AND is_active = true 
    FOR UPDATE;
    
    -- Check if table exists
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Table not found or inactive',
            'error_code', 'TABLE_NOT_FOUND'
        );
    END IF;
    
    -- Check if bidding has not started yet
    IF v_current_time < v_table_record.bidding_starts_at THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Bidding has not started yet. Please wait for the event to begin.',
            'error_code', 'BIDDING_NOT_STARTED',
            'starts_at', v_table_record.bidding_starts_at
        );
    END IF;
    
    -- Check if bidding has ended
    IF v_current_time > v_table_record.bidding_ends_at THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Bidding has ended for this table',
            'error_code', 'BIDDING_ENDED',
            'ended_at', v_table_record.bidding_ends_at
        );
    END IF;
    
    -- Check version for optimistic locking (if provided)
    IF p_expected_version IS NOT NULL AND v_table_record.version != p_expected_version THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Table has been updated by another user. Please refresh and try again.',
            'error_code', 'VERSION_CONFLICT',
            'current_version', v_table_record.version,
            'current_bid', v_table_record.current_bid
        );
    END IF;
    
    -- Calculate minimum bid (current bid + 1000)
    v_minimum_bid := v_table_record.current_bid + 1000;
    
    -- Validate bid amount
    IF p_bid_amount < v_minimum_bid THEN
        RETURN json_build_object(
            'success', false,
            'error', format('Bid must be at least ₹%s', v_minimum_bid),
            'error_code', 'INSUFFICIENT_BID',
            'minimum_bid', v_minimum_bid,
            'current_bid', v_table_record.current_bid
        );
    END IF;
    
    -- Check if user is trying to outbid themselves
    IF v_table_record.highest_bidder_username = p_username THEN
        RETURN json_build_object(
            'success', false,
            'error', 'You are already the highest bidder on this table',
            'error_code', 'SELF_OUTBID'
        );
    END IF;
    
    -- Mark previous winning bids as not winning
    UPDATE bids 
    SET is_winning = false 
    WHERE table_id = p_table_id AND is_winning = true;
    
    -- Insert new bid
    INSERT INTO bids (
        table_id, user_id, username, bid_amount, previous_bid, 
        is_winning, ip_address, user_agent, session_id
    ) VALUES (
        p_table_id, p_user_id, p_username, p_bid_amount, v_table_record.current_bid,
        true, p_ip_address, p_user_agent, p_session_id
    ) RETURNING id INTO v_bid_id;
    
    -- Update table with new highest bid
    UPDATE tables 
    SET 
        current_bid = p_bid_amount,
        highest_bidder_id = p_user_id,
        highest_bidder_username = p_username,
        bid_count = bid_count + 1,
        version = version + 1
    WHERE id = p_table_id;
    
    -- Return success response
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
        RETURN json_build_object(
            'success', false,
            'error', 'An unexpected error occurred: ' || SQLERRM,
            'error_code', 'INTERNAL_ERROR'
        );
END;
$$ LANGUAGE plpgsql;

-- Insert 40 test users with bcrypt hashed passwords
-- Note: In production, these should be properly hashed
INSERT INTO users (username, password_hash, email) VALUES
('user1', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash1', 'user1@test.com'),
('user2', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash2', 'user2@test.com'),
('user3', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash3', 'user3@test.com'),
('user4', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash4', 'user4@test.com'),
('user5', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash5', 'user5@test.com'),
('user6', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash6', 'user6@test.com'),
('user7', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash7', 'user7@test.com'),
('user8', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash8', 'user8@test.com'),
('user9', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash9', 'user9@test.com'),
('user10', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash10', 'user10@test.com'),
('user11', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash11', 'user11@test.com'),
('user12', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash12', 'user12@test.com'),
('user13', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash13', 'user13@test.com'),
('user14', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash14', 'user14@test.com'),
('user15', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash15', 'user15@test.com'),
('user16', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash16', 'user16@test.com'),
('user17', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash17', 'user17@test.com'),
('user18', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash18', 'user18@test.com'),
('user19', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash19', 'user19@test.com'),
('user20', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash20', 'user20@test.com'),
('user21', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash21', 'user21@test.com'),
('user22', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash22', 'user22@test.com'),
('user23', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash23', 'user23@test.com'),
('user24', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash24', 'user24@test.com'),
('user25', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash25', 'user25@test.com'),
('user26', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash26', 'user26@test.com'),
('user27', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash27', 'user27@test.com'),
('user28', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash28', 'user28@test.com'),
('user29', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash29', 'user29@test.com'),
('user30', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash30', 'user30@test.com'),
('user31', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash31', 'user31@test.com'),
('user32', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash32', 'user32@test.com'),
('user33', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash33', 'user33@test.com'),
('user34', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash34', 'user34@test.com'),
('user35', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash35', 'user35@test.com'),
('user36', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash36', 'user36@test.com'),
('user37', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash37', 'user37@test.com'),
('user38', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash38', 'user38@test.com'),
('user39', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash39', 'user39@test.com'),
('user40', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu.hash40', 'user40@test.com')
ON CONFLICT (username) DO NOTHING;

-- Update the INSERT statement for tables to include the new bidding times
-- *** CHANGE THESE TIMES FOR YOUR LIVE EVENT ***
INSERT INTO tables (id, name, category, pax, base_price, current_bid, highest_bidder_username, bidding_starts_at, bidding_ends_at) VALUES
('vip1', 'VIP 1', 'VIP', '6-8', 30000, 30000, 'Anonymous', NOW(), '2025-07-30 23:59:59+05:30'),
('standing2', 'Standing 2', 'Standing', '5', 25000, 25000, 'Anonymous', NOW(), '2025-07-30 23:59:59+05:30'),
('standing3', 'Standing 3', 'Standing', '5', 25000, 25000, 'Anonymous', NOW(), '2025-07-30 23:59:59+05:30'),
('vip2', 'VIP 2', 'VIP', '6-8', 30000, 30000, 'Anonymous', NOW(), '2025-07-30 23:59:59+05:30'),
('vip3', 'VIP 3', 'VIP', '6-8', 30000, 30000, 'Anonymous', NOW(), '2025-07-30 23:59:59+05:30'),
('vip7', 'VIP 7', 'VIP', '6-8', 30000, 30000, 'Anonymous', NOW(), '2025-07-30 23:59:59+05:30'),
('vip5', 'VIP 5', 'VIP', '6-8', 30000, 30000, 'Anonymous', NOW(), '2025-07-30 23:59:59+05:30'),
('vip6', 'VIP 6', 'VIP', '6-8', 30000, 30000, 'Anonymous', NOW(), '2025-07-30 23:59:59+05:30'),
('standing1', 'Standing 1', 'Standing', '5', 25000, 25000, 'Anonymous', NOW(), '2025-07-30 23:59:59+05:30'),
('vip4', 'VIP 4', 'VIP', '6-8', 30000, 30000, 'Anonymous', NOW(), '2025-07-30 23:59:59+05:30'),
('vip8', 'VIP 8', 'VIP', '6-8', 30000, 30000, 'Anonymous', NOW(), '2025-07-30 23:59:59+05:30'),
('standing4', 'Standing 4', 'Standing', '5', 25000, 25000, 'Anonymous', NOW(), '2025-07-30 23:59:59+05:30')
ON CONFLICT (id) DO UPDATE SET
  bidding_starts_at = EXCLUDED.bidding_starts_at,
  bidding_ends_at = EXCLUDED.bidding_ends_at,
  category = EXCLUDED.category,
  pax = EXCLUDED.pax,
  base_price = EXCLUDED.base_price;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we're handling auth in the app layer)
CREATE POLICY "Allow public read access to tables" ON tables FOR SELECT USING (true);
CREATE POLICY "Allow public read access to bids" ON bids FOR SELECT USING (true);
CREATE POLICY "Allow public read access to users" ON users FOR SELECT USING (true);

-- Allow inserts and updates through the application
CREATE POLICY "Allow authenticated updates to tables" ON tables FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated inserts to bids" ON bids FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated updates to users" ON users FOR UPDATE USING (true);
