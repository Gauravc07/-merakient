import { NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  /* ──────────────────────────────────────────────────────────────
     1. Fast exit when the public client isn’t initialised at all
  ────────────────────────────────────────────────────────────── */
  if (!supabase && !supabaseAdmin) {
    console.warn("⚠️  Supabase keys missing; serving mock tables.")
    const mockTables = [
      {
        id: "vip1",
        name: "VIP 1",
        category: "VIP",
        pax: "6-8",
        base_price: 40000,
        current_bid: 40000,
        highest_bidder_username: "Anonymous",
        bid_count: 0,
        version: 1,
        is_active: true,
        bidding_starts_at: new Date(Date.now() - 3600000).toISOString(),
        bidding_ends_at: new Date(Date.now() + 3600000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "standing1",
        name: "Standing 1",
        category: "Standing",
        pax: "5",
        base_price: 25000,
        current_bid: 25000,
        highest_bidder_username: "Anonymous",
        bid_count: 0,
        version: 1,
        is_active: true,
        bidding_starts_at: new Date(Date.now() - 3600000).toISOString(),
        bidding_ends_at: new Date(Date.now() + 3600000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    return NextResponse.json({ tables: mockTables, fallback: true })
  }

  try {
    const client = supabaseAdmin || supabase
    console.log(`API /api/tables: Using ${supabaseAdmin ? "supabaseAdmin" : "supabase"} client.`)

    console.log("API /api/tables: Attempting to fetch tables with category 'Standing' or 'VIP'.")
    const {
      data: tables,
      error,
      status,
    } = await client
      .from("tables")
      .select("*")
      .in("category", ["Standing", "VIP"]) // Changed from .eq("is_active", true)
      .order("id")

    if (error) {
      console.error("Supabase error (tables):", error.message, "Status:", status)
      // Keep the existing fallback logic here

      /* ────────────────────────────────────────────────────────────
         2. Auth / key problems → fallback + **warning**, not error
      ──────────────────────────────────────────────────────────── */
      if (
        error ||
        status === 400 ||
        status === 401 ||
        status === 403 ||
        (error && error.message?.toLowerCase().includes("invalid api key"))
      ) {
        console.error("Supabase error (tables):", error?.message || status)
        console.warn("API /api/tables: Falling back to mock data due to Supabase error.")
        const mockTables = [
          {
            id: "vip1",
            name: "VIP 1",
            category: "VIP",
            pax: "6-8",
            base_price: 40000,
            current_bid: 40000,
            highest_bidder_username: "Anonymous",
            bid_count: 0,
            version: 1,
            is_active: true,
            bidding_starts_at: new Date(Date.now() - 3600000).toISOString(),
            bidding_ends_at: new Date(Date.now() + 3600000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "standing1",
            name: "Standing 1",
            category: "Standing",
            pax: "5",
            base_price: 25000,
            current_bid: 25000,
            highest_bidder_username: "Anonymous",
            bid_count: 0,
            version: 1,
            is_active: true,
            bidding_starts_at: new Date(Date.now() - 3600000).toISOString(),
            bidding_ends_at: new Date(Date.now() + 3600000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]
        return NextResponse.json({ tables: mockTables, fallback: true })
      }
    } else {
      console.log("API /api/tables: Raw data from Supabase:", tables)
      console.log("API /api/tables: Number of active tables fetched:", tables?.length || 0)
    }

    // Add timestamp to help with debugging
    const response = {
      tables: tables || [],
      timestamp: new Date().toISOString(),
      count: tables?.length || 0,
    }

    console.log("Tables API response:", response)
    return NextResponse.json(response)
  } catch (err) {
    /* Any other unexpected failure → fallback as well            */
    console.error("Unexpected error in /api/tables:", err)
    return NextResponse.json({
      tables: [],
      fallback: true,
      error: "Unexpected error",
    })
  }
}
