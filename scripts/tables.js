

import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with service role key for elevated permissions
const supabaseUrl ="https://bwahisugrcfrtbmufhcw.supabase.co"
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3YWhpc3VncmNmcnRibXVmaGN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk1NDIyNCwiZXhwIjoyMDY3NTMwMjI0fQ.P0rYG3aQoJFHQ7rjhfRt5wRMhYr6N_SFMzoTksEhTKU"

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set.")
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

async function setTablesLiveIST() {
  const now = new Date()

  // Calculate 6 AM IST for today or tomorrow
  // IST is UTC+5:30. So 6 AM IST is 00:30 UTC.
  const targetHourUTC = 0 // 00:00 UTC
  const targetMinuteUTC = 30 // 00:30 UTC

  const endTime = new Date(now)
  endTime.setUTCHours(targetHourUTC, targetMinuteUTC, 0, 0) // Set to 00:30 UTC

  // If 00:30 UTC has already passed today, set it for tomorrow
  if (endTime.getTime() <= now.getTime()) {
    endTime.setDate(endTime.getDate() + 1)
  }

  const startTimeISO = now.toISOString()
  const endTimeISO = endTime.toISOString()

  // For logging, display in IST
  const istOptions = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }
  const displayStartTimeIST = now.toLocaleString("en-IN", istOptions)
  const displayEndTimeIST = endTime.toLocaleString("en-IN", istOptions)

  console.log(`Setting all active tables to be live from:`)
  console.log(`  Start Time (IST): ${displayStartTimeIST}`)
  console.log(`  End Time (IST):   ${displayEndTimeIST}`)
  console.log(`  (Stored as UTC: ${startTimeISO} to ${endTimeISO})`)

  try {
    // Update all tables that are not already 'ended'
    const { data, error } = await supabaseAdmin
      .from("tables")
      .update({
        bidding_starts_at: startTimeISO,
        bidding_ends_at: endTimeISO,
        //status: "active", // CRITICAL: Explicitly set status to 'active' to enable bidding
        is_active: true, // Ensure is_active is also true
      })
      .neq("is_active", false) // Only update tables that are not already ended
      .select("id, name")

    if (error) {
      console.error("Error updating tables:", error.message)
      return
    }

    if (data && data.length > 0) {
      console.log(`Successfully updated ${data.length} tables:`)
      data.forEach((table) => console.log(`- Table ID: ${table.id}, Name: ${table.name}`))
    } else {
      console.log("No tables found or updated (perhaps all are already ended).")
    }
  } catch (err) {
    console.error("An unexpected error occurred:", err.message)
  }
}

setTablesLiveIST()
