import { NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"
import { mockTables } from "@/lib/mock-tables"

export async function GET() {
  if (!supabase && !supabaseAdmin) {
    console.warn("⚠️  Supabase keys missing; serving mock tables.")
    return NextResponse.json({ tables: mockTables, fallback: true })
  }

  try {
    const client = supabaseAdmin || supabase
    const { data: tables, error, status } = await client
      .from("tables")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("Supabase error (tables):", error.message, "Status:", status)

      if (status === 400 || status === 401 || status === 403 || error.message?.toLowerCase().includes("invalid api key")) {
        console.warn("API /api/tables: Falling back to mock data due to Supabase error.")
        return NextResponse.json({ tables: mockTables, fallback: true })
      }

      return NextResponse.json({ tables: mockTables, fallback: true, error: error.message })
    }

    return NextResponse.json({
      tables: tables || [],
      timestamp: new Date().toISOString(),
      count: tables?.length || 0,
    })
  } catch (err) {
    console.error("Unexpected error in /api/tables:", err)
    return NextResponse.json({ tables: mockTables, fallback: true, error: "Unexpected error" })
  }
}
