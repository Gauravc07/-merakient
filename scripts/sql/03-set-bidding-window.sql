-- 03 · SET THE BIDDING WINDOW (IST)
--
-- When:  before each event, or to extend/shorten tonight's window.
-- Safe:  yes — only changes the start/end time of the tables open for bidding.
--        Bids and standings are untouched.
--
-- Edit the two times below (keep the +05:30 — that's IST), then Run.
-- Same thing from a terminal: node scripts/set-specific-event-time.js 17:25 19:00

UPDATE tables
SET bidding_starts_at = '2026-09-26 19:00:00+05:30',
    bidding_ends_at   = '2026-09-26 19:30:00+05:30'

WHERE is_active = true;

-- Check: every open table should show the new window.
SELECT id,
       bidding_starts_at AT TIME ZONE 'Asia/Kolkata' AS starts_ist,
       bidding_ends_at   AT TIME ZONE 'Asia/Kolkata' AS ends_ist
FROM tables
WHERE is_active = true
ORDER BY sort_order;
