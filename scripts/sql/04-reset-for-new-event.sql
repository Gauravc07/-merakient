-- 04 · RESET FOR A NEW EVENT  ⚠ DESTRUCTIVE ⚠
--
-- This WIPES the current standings: every table open for bidding goes back to its
-- starting price with no highest bidder. Never run it during or right after an event
-- before the winners have been recorded.
--
-- When:  before a new event, to start a fresh round.
-- Keeps: the bid history rows. Each table's round_started_at is set to now, and the
--        site's bid history only shows bids placed after that — so the previous round
--        drops out of the timeline straight away, while the rows stay in the database.
--
-- To change which tables are open or their starting prices, edit the list below
-- (and TABLE_PRICES in lib/bidding-constants.ts to match).

BEGIN;

UPDATE tables SET
  base_price = prices.base_price,
  current_bid = prices.base_price,
  highest_bidder_id = NULL,
  highest_bidder_username = NULL,
  bid_count = 0,
  version = 1,
  is_active = true,
  round_started_at = NOW()
FROM (VALUES
  ('XC1', 100000), ('XC2', 100000), ('XC3', 100000), ('XC4', 100000), ('XC5', 100000), ('XC6', 100000),
  ('A1', 100000), ('A2', 100000), ('A3', 100000),
  ('A4', 80000), ('A5', 80000), ('A6', 80000)
) AS prices(id, base_price)
WHERE tables.id = prices.id;

UPDATE tables SET is_active = false
WHERE id NOT IN ('XC1','XC2','XC3','XC4','XC5','XC6','A1','A2','A3','A4','A5','A6');

UPDATE bids SET is_winning = false WHERE is_winning = true;

COMMIT;

-- Check
SELECT id, base_price, current_bid, bid_count, is_active FROM tables WHERE is_active ORDER BY sort_order;
