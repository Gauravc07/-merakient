import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

// Deployment diagnostics. Shows whether each setting is present (yes/no) and which Supabase
// project the URL points at — never the key itself.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  let supabaseHost: string | null = null
  try {
    supabaseHost = url ? new URL(url).host : null
  } catch {
    supabaseHost = "INVALID URL"
  }

  const settings = {
    NEXT_PUBLIC_SUPABASE_URL: url ? "set" : "MISSING",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey ? `set (${anonKey.length} characters)` : "MISSING",
    supabaseProject: supabaseHost,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
  }

  if (!supabase) {
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "not configured",
        settings,
        fix: "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel → Settings → Environment Variables (tick Production), then redeploy.",
      },
      { status: 500 },
    )
  }

  const { error } = await supabase.from("tables").select("id").limit(1)
  if (error) {
    return NextResponse.json(
      { status: "unhealthy", database: "unreachable", error: error.message, settings, timestamp: new Date().toISOString() },
      { status: 500 },
    )
  }

  return NextResponse.json({ status: "healthy", database: "connected", settings, timestamp: new Date().toISOString() })
}
