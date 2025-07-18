import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { tableId: string } }) {
  try {
    const { data: bids, error } = await supabase
      .from("bids")
      .select("*")
      .eq("table_id", params.tableId)
      .order("bid_time", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching table bids:", error)
      return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 })
    }

    return NextResponse.json({ bids })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
