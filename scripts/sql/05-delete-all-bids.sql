-- 05 · DELETE ALL BIDS AND RESET TABLES  ⚠ DESTRUCTIVE — CANNOT BE UNDONE ⚠
--
-- Permanently deletes every bid, and puts every table back to its starting price with no
-- highest bidder. Use it to start a completely fresh round. Record any winners first.
--
-- (04-reset-for-new-event.sql is the gentler option: it resets the tables but keeps the
--  old bids in the database.)

BEGIN;

DELETE FROM bids;

UPDATE tables SET
  current_bid = base_price,
  highest_bidder_id = NULL,
  highest_bidder_username = NULL,
  bid_count = 0,
  version = 1,
  round_started_at = NOW();

COMMIT;

-- Check: 0 bids, and every open table at its starting price with no bidder
SELECT (SELECT count(*) FROM bids) AS bids_left;
SELECT id, base_price, current_bid, highest_bidder_username, bid_count
FROM tables WHERE is_active ORDER BY sort_order;
