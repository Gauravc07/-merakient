import { createClient } from "@supabase/supabase-js"

const looksBogus = (val?: string | null) =>
  !val ||
  val.includes("Ej8Ej8") || // placeholder anon key
  val.includes("SERVICE_ROLE_KEY_HERE") // placeholder service key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Treat bogus keys as absent
const anonKeyValid = !looksBogus(supabaseAnonKey)
const adminKeyValid = !looksBogus(supabaseRoleKey)

if (!supabaseUrl || !anonKeyValid) {
  console.warn("⚠️  Supabase public credentials missing or invalid – falling back to mock data.")
}

/*  Public client – used in the browser  */
export const supabase = supabaseUrl && anonKeyValid ? createClient(supabaseUrl, supabaseAnonKey!) : null

/*  Admin client – server-only operations (service role key REQUIRED) */
export const supabaseAdmin =
  supabaseUrl && adminKeyValid
    ? createClient(supabaseUrl, supabaseRoleKey!, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null

// Database types
export interface Table {
  id: string
  name: string
  category: "Diamond" | "Platinum" | "Gold" | "Silver"
  pax: string
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
