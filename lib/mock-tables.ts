import type { Table } from "@/lib/supabase"
import { LAYOUT_TABLES, TABLE_PRICES, BIDDABLE_TABLE_IDS } from "@/lib/bidding-constants"

/**
 * Local fallback data used when Supabase credentials are not provided/reachable.
 * Only the tables in BIDDABLE_TABLE_IDS (XC1-6, A1-6) are biddable — this mirrors the
 * real API's `is_active = true` filter, so the fallback path matches production exactly.
 */
export const mockTables: Table[] = LAYOUT_TABLES.filter((t) => BIDDABLE_TABLE_IDS.includes(t.id)).map((t, index) => ({
  id: t.id,
  name: t.id,
  category: t.zone === "KEY_CLUB" ? "KEY_CLUB" : (t.zone as Table["category"]),
  pax: "4-6",
  sort_order: index + 1,
  base_price: TABLE_PRICES[t.id],
  current_bid: TABLE_PRICES[t.id],
  highest_bidder_username: undefined,
  bid_count: 0,
  version: 1,
  is_active: true,
  bidding_starts_at: new Date(Date.now() - 3600_000).toISOString(),
  bidding_ends_at: new Date(Date.now() + 3 * 24 * 3600_000).toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}))
