-- Create tables for the bidding system

-- Users table (for the 40 bidding users)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tables/Seats available for bidding
CREATE TABLE IF NOT EXISTS tables (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('Diamond', 'Platinum', 'Gold', 'Silver')),
  pax VARCHAR(10) NOT NULL,
  base_price INTEGER NOT NULL DEFAULT 0,
  current_bid INTEGER NOT NULL DEFAULT 0,
  highest_bidder_id INTEGER REFERENCES users(id),
  highest_bidder_username VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bid history table
CREATE TABLE IF NOT EXISTS bids (
  id SERIAL PRIMARY KEY,
  table_id VARCHAR(10) REFERENCES tables(id),
  user_id INTEGER REFERENCES users(id),
  username VARCHAR(50) NOT NULL,
  bid_amount INTEGER NOT NULL,
  previous_bid INTEGER NOT NULL DEFAULT 0,
  bid_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_winning BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bids_table_id ON bids(table_id);
CREATE INDEX IF NOT EXISTS idx_bids_user_id ON bids(user_id);
CREATE INDEX IF NOT EXISTS idx_bids_time ON bids(bid_time DESC);
CREATE INDEX IF NOT EXISTS idx_tables_current_bid ON tables(current_bid DESC);

-- Insert initial users (user1 to user40 with password1 to password40)
INSERT INTO users (username, password_hash) VALUES
('user1', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu'), -- This would be bcrypt hash of 'password1'
('user2', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu'),
('user3', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu'),
('user4', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu'),
('user5', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu')
-- Add more users as needed
ON CONFLICT (username) DO NOTHING;

-- Insert initial tables data
INSERT INTO tables (id, name, category, pax, base_price, current_bid, highest_bidder_username) VALUES
('50', 'Diamond 50', 'Diamond', '10-13', 15000, 15000, 'Anonymous'),
('51', 'Diamond 51', 'Diamond', '10-13', 12000, 12000, 'User5'),
('52', 'Diamond 52', 'Diamond', '10-13', 18000, 18000, 'User12'),
('53', 'Diamond 53', 'Diamond', '10-13', 14000, 14000, 'User8'),
('43/44', 'Platinum 43/44', 'Platinum', '10-13', 10000, 10000, 'User3'),
('82', 'Table 82', 'Gold', '6-8', 8000, 8000, 'User15'),
('72', 'Table 72', 'Gold', '6-8', 7000, 7000, 'User22'),
('81', 'Table 81', 'Gold', '6-8', 6000, 6000, 'User7'),
('71', 'Table 71', 'Gold', '6-8', 9000, 9000, 'User18'),
('80', 'Table 80', 'Silver', '4-6', 4000, 4000, 'User25'),
('70', 'Table 70', 'Silver', '4-6', 5000, 5000, 'User11'),
('41', 'Table 41', 'Silver', '4-5', 3000, 3000, 'User30'),
('40', 'Table 40', 'Silver', '4-6', 3500, 3500, 'User19'),
('62', 'Table 62', 'Silver', '2-3', 2000, 2000, 'User33'),
('63', 'Table 63', 'Silver', '3-4', 2500, 2500, 'User28'),
('64', 'Table 64', 'Silver', '2-4', 2200, 2200, 'User35')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Create policies for tables (everyone can read, only authenticated users can update)
CREATE POLICY "Tables are viewable by everyone" ON tables FOR SELECT USING (true);
CREATE POLICY "Tables can be updated by authenticated users" ON tables FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for bids (everyone can read, only authenticated users can insert)
CREATE POLICY "Bids are viewable by everyone" ON bids FOR SELECT USING (true);
CREATE POLICY "Authenticated users can place bids" ON bids FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policies for users (users can only see their own data)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
