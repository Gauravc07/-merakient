import { createClient } from "@supabase/supabase-js"

const looksBogus = (val?: string | null) =>
  !val ||
  val.includes("Ej8Ej8") || // placeholder anon key
  val.includes("SERVICE_ROLE_KEY_HERE") // placeholder service key

import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config"

const supabaseUrl = SUPABASE_URL
const supabaseAnonKey = SUPABASE_ANON_KEY
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Treat bogus keys as absent
const anonKeyValid = !looksBogus(supabaseAnonKey)
const adminKeyValid = !looksBogus(supabaseRoleKey)

/**
 * Sample tables / simulated bids are only for local development. On a deployed site a
 * missing or broken database connection must show an error — never fake "live" tables or
 * a fake "bid placed" confirmation.
 */
export const allowMockFallback = process.env.NODE_ENV !== "production"

export const DB_UNAVAILABLE_MESSAGE =
  "Bidding is temporarily unavailable — the site can't reach its database. Please try again shortly."

if (!supabaseUrl || !anonKeyValid) {
  console.warn(
    allowMockFallback
      ? "⚠️  Supabase credentials missing or invalid – using local sample data."
      : "❌ Supabase credentials missing or invalid – set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the hosting environment.",
  )
}

/*  Public client – used in the browser  */
export const supabase = supabaseUrl && anonKeyValid ? createClient(supabaseUrl, supabaseAnonKey!) : null

/*
 * Admin client – server-only operations. Prefers the service role key; falls back to the
 * anon/publishable key when no service role key is configured. This is safe here because
 * the RLS policies in scripts/create-tables-v4.sql already allow all reads/writes
 * (enforcement happens in the place_bid() RPC and the app layer, not RLS).
 */
export const supabaseAdmin =
  supabaseUrl && adminKeyValid
    ? createClient(supabaseUrl, supabaseRoleKey!, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : supabaseUrl && anonKeyValid
      ? createClient(supabaseUrl, supabaseAnonKey!, {
          auth: { autoRefreshToken: false, persistSession: false },
        })
      : null

// Database types
export type TableCategory =
  | "DJ_BOOTH"
  | "LEVEL_01"
  | "DANCE_FLOOR"
  | "FLOOR_SIDE"
  | "FRONT_ROW"
  | "BALCONY"
  | "KEY_CLUB"
  | "RESERVED"

export interface Table {
  id: string
  name: string
  category: TableCategory
  pax: string
  sort_order: number
  base_price: number
  current_bid: number
  highest_bidder_id?: number
  highest_bidder_username?: string
  bid_count: number
  version: number
  is_active: boolean
  bidding_starts_at: string
  bidding_ends_at: string
  created_at: string
  updated_at: string
}

export interface Bid {
  id: number
  table_id: string
  user_id: number
  username: string
  bid_amount: number
  previous_bid: number
  bid_time: string
  is_winning: boolean
}

export interface User {
  id: number
  username: string
  email?: string
  created_at: string
  updated_at: string
}
