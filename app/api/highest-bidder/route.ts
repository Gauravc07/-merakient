import { NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    const client = supabaseAdmin || supabase

    if (!client) {
      console.warn("⚠️ Supabase client not initialized; serving mock highest bidder.")
      return NextResponse.json({
        highestBidder: {
          username: "MockUser",
          bid_amount: 99999,
          table_id: "VIP1",
        },
        fallback: true,
      })
    }

    const { data: tables, error } = await client
      .from("tables")
      .select("highest_bidder_username, current_bid, id")
      .eq("is_active", true)
      .order("current_bid", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error fetching highest bidder:", error)
      return NextResponse.json({ error: "Failed to fetch highest bidder" }, { status: 500 })
    }

    const highestBidder = tables && tables.length > 0 ? tables[0] : null

    return NextResponse.json({ highestBidder })
  } catch (error) {
    console.error("Unexpected error in /api/highest-bidder:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
  