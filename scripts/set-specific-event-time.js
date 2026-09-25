// Set the bidding window (IST) for all active tables.
//
// Usage (from the project root, works in PowerShell or bash):
//   node scripts/set-specific-event-time.js 17:25 19:00                 -> today, 5:25 PM to 7:00 PM IST
//   node scripts/set-specific-event-time.js 2026-09-26 21:00 00:00       -> that date, 9 PM to midnight IST
//
// If the end time is earlier than the start time, it's treated as the next day.

import { createClient } from "@supabase/supabase-js"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env.local")
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2]
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local")
  process.exit(1)
}

const args = process.argv.slice(2)
const todayIST = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date())
const [date, start, end] = args.length === 3 ? args : [todayIST, ...args]

const TIME = /^([01]?\d|2[0-3]):[0-5]\d$/
if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !TIME.test(start ?? "") || !TIME.test(end ?? "")) {
  console.error("Usage: node scripts/set-specific-event-time.js [YYYY-MM-DD] HH:MM HH:MM   (24-hour, IST)")
  process.exit(1)
}

const pad = (t) => t.padStart(5, "0")
const startsAt = new Date(`${date}T${pad(start)}:00+05:30`)
let endsAt = new Date(`${date}T${pad(end)}:00+05:30`)
if (endsAt <= startsAt) endsAt = new Date(endsAt.getTime() + 24 * 3600_000)

const fmt = (d) => d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })
const minutes = Math.round((endsAt - startsAt) / 60_000)
console.log(`Setting bidding window: ${fmt(startsAt)} -> ${fmt(endsAt)} IST (${Math.floor(minutes / 60)}h ${minutes % 60}m)`)

const supabase = createClient(url, key, { auth: { persistSession: false } })
const { data, error } = await supabase
  .from("tables")
  .update({ bidding_starts_at: startsAt.toISOString(), bidding_ends_at: endsAt.toISOString() })
  .eq("is_active", true)
  .select("id")

if (error) {
  console.error("Failed to update bidding window:", error.message)
  process.exit(1)
}
console.log(`Updated ${data.length} active tables: ${data.map((t) => t.id).join(", ")}`)
