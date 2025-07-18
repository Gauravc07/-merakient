import type { Table } from "@/lib/supabase"

/**
 * Local fallback data used when Supabase credentials are not provided.
 * All 8 VIP tables start at ₹30 000, all 4 Standing tables at ₹25 000.
 */
export const mockTables: Table[] = [
  // VIP tables
  ...Array.from({ length: 8 }, (_, i) => {
    const id = `vip${i + 1}`
    return {
      id,
      name: `VIP ${i + 1}`,
      category: "VIP",
      pax: "6-8",
      base_price: 30_000,
      current_bid: 30_000,
      highest_bidder_username: null,
      bid_count: 0,
      version: 1,
      is_active: true,
      bidding_starts_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      bidding_ends_at: "2025-07-30T23:59:59+05:30", // July 30th, 2025
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as unknown as Table
  }),

  // Standing tables
  ...Array.from({ length: 4 }, (_, i) => {
    const id = `standing${i + 1}`
    return {
      id,
      name: `Standing ${i + 1}`,
      category: "Standing",
      pax: "5", // Updated to '5' as requested
      base_price: 25_000,
      current_bid: 25_000,
      highest_bidder_username: null,
      bid_count: 0,
      version: 1,
      is_active: true,
      bidding_starts_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      bidding_ends_at: "2025-07-30T23:59:59+05:30", // July 30th, 2025
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as unknown as Table
  }),
]
