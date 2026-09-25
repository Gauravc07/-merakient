// The one place the app reads its Supabase connection settings.
// The key is Supabase's public "publishable" (anon) key — safe in the browser by design.
// Both names are accepted: Supabase's dashboard now calls it the publishable key.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ""

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
