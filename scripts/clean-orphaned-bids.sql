-- Clean up orphaned bids that reference deleted tables
-- Run this after deleting table rows

-- First, check which bids are orphaned
SELECT b.*, t.id as table_exists 
FROM bids b 
LEFT JOIN tables t ON b.table_id = t.id 
WHERE t.id IS NULL;

-- Delete orphaned bids
DELETE FROM bids 
WHERE table_id NOT IN (SELECT id FROM tables WHERE is_active = true);

-- Reset bid history for existing tables (optional - if you want fresh start)
-- UNCOMMENT the lines below if you want to clear all bid history
-- DELETE FROM bids WHERE table_id IN (SELECT id FROM tables WHERE is_active = true);

-- Update tables to reset bid counts and versions
UPDATE tables 
SET bid_count = 0, 
    version = version + 1,
    updated_at = NOW()
WHERE is_active = true;

-- Verify cleanup
SELECT 'Tables' as type, COUNT(*) as count FROM tables WHERE is_active = true
UNION ALL
SELECT 'Bids' as type, COUNT(*) as count FROM bids
UNION ALL
SELECT 'Orphaned Bids' as type, COUNT(*) as count 
FROM bids b 
LEFT JOIN tables t ON b.table_id = t.id 
WHERE t.id IS NULL;
