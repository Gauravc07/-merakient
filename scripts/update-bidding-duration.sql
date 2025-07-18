-- SQL script to make all active tables bidable until July 30th, 2025
-- Run this query in your Supabase SQL Editor.

UPDATE tables
SET
  bidding_starts_at = NOW(), -- Set start time to current time
  bidding_ends_at = '2025-07-30 23:59:59+05:30' -- Set end time to July 30th, 2025, 11:59:59 PM IST
WHERE is_active = true;

-- Optional: Verify the updated times
SELECT id, name, bidding_starts_at, bidding_ends_at, is_active
FROM tables
WHERE is_active = true
LIMIT 5;
