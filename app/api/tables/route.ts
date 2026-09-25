import { NextResponse } from "next/server"
import { supabase, supabaseAdmin, allowMockFallback, DB_UNAVAILABLE_MESSAGE } from "@/lib/supabase"
import { mockTables } from "@/lib/mock-tables"

// Local dev: sample tables so the UI still renders. Deployed: a clear 503, never fake data.
function unavailable(reason: string) {
  if (allowMockFallback) return NextResponse.json({ tables: mockTables, fallback: true, error: reason })
  return NextResponse.json({ tables: [], error: DB_UNAVAILABLE_MESSAGE }, { status: 503 })
}

export async function GET() {
  if (!supabase && !supabaseAdmin) {
    console.error("/api/tables: Supabase credentials are not configured")
    return unavailable("Supabase credentials are not configured")
  }

  try {
    const client = supabaseAdmin || supabase
    const { data: tables, error, status } = await client!
      .from("tables")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("Supabase error (tables):", error.message, "Status:", status)
      return unavailable(error.message)
    }

    return NextResponse.json({
      tables: tables || [],
      timestamp: new Date().toISOString(),
      count: tables?.length || 0,
    })
  } catch (err) {
    console.error("Unexpected error in /api/tables:", err)
    return unavailable("Unexpected error")
  }
}
