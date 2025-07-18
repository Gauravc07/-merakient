// Emergency script to start the event immediately with debug info
// Run with: node scripts/start-event-now-debug.js

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function startEventNowWithDebug() {
  try {
    console.log("🚀 Starting event immediately with debug info...")

    const now = new Date()
    const endTime = new Date(now.getTime() + 5 * 60 * 60 * 1000) // 5 hours from now

    console.log("⏰ Current time:", now.toISOString())
    console.log("⏰ Event will end at:", endTime.toISOString())

    // First, check current table status
    const { data: currentTables, error: fetchError } = await supabase.from("tables").select("*").eq("is_active", true)

    if (fetchError) {
      console.error("❌ Error fetching current tables:", fetchError)
      return
    }

    console.log("📊 Current tables status:")
    currentTables.forEach((table) => {
      console.log(`  - ${table.name}: starts ${table.bidding_starts_at}, ends ${table.bidding_ends_at}`)
    })

    // Update the times
    const { data, error } = await supabase
      .from("tables")
      .update({
        bidding_starts_at: now.toISOString(),
        bidding_ends_at: endTime.toISOString(),
      })
      .eq("is_active", true)
      .select()

    if (error) throw error

    console.log("✅ Event started successfully!")
    console.log(`📊 Updated ${data.length} tables`)
    console.log(`⏰ Event will end at: ${endTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`)

    // Verify the update
    console.log("🔍 Verifying updates:")
    data.forEach((table) => {
      console.log(`  ✅ ${table.name}: ${table.bidding_starts_at} → ${table.bidding_ends_at}`)
    })
  } catch (error) {
    console.error("❌ Error starting event:", error.message)
  }
}

startEventNowWithDebug()
