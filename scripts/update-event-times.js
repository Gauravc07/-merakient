// Script to easily update event times
// Run with: node scripts/update-event-times.js

const { createClient } = require("@supabase/supabase-js")
const path = require("path")
const fs = require("fs")

// Function to load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env.local")

  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf8")
    const envLines = envFile.split("\n")

    envLines.forEach((line) => {
      const [key, ...valueParts] = line.split("=")
      if (key && valueParts.length > 0) {
        const value = valueParts.join("=").trim()
        process.env[key.trim()] = value
      }
    })

    console.log("✅ Loaded environment variables from .env.local")
  } else {
    console.log("⚠️  .env.local file not found, using system environment variables")
  }
}

// Load environment variables
loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log("🔍 Checking environment variables...")
console.log(`Supabase URL: ${supabaseUrl ? "✅ Found" : "❌ Missing"}`)
console.log(`Service Key: ${supabaseServiceKey ? "✅ Found" : "❌ Missing"}`)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("\n❌ Missing Supabase credentials!")
  console.error("\n📋 Please ensure you have either:")
  console.error("1. A .env.local file in your project root with:")
  console.error("   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co")
  console.error("   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key")
  console.error("\n2. Or set these as system environment variables")
  console.error("\n💡 You can find these values in your Supabase dashboard:")
  console.error("   Settings → API → Project URL and Service Role Key")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateEventTimes() {
  try {
    // Set bidding to start now
    const startTime = new Date().toISOString()

    // Calculate 12 PM today in IST
    const nowInIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    nowInIST.setHours(12, 0, 0, 0) // Set to 12:00:00.000 PM IST

    // If 12 PM today has already passed, set it for 12 PM tomorrow
    if (nowInIST.getTime() < new Date().getTime()) {
      nowInIST.setDate(nowInIST.getDate() + 1)
    }

    const endTime = nowInIST.toISOString().replace("Z", "+05:30") // Format to ISO with IST offset

    console.log("\n🕐 Updating event times...")
    console.log(`📅 Start Time: ${startTime}`)
    console.log(`📅 End Time: ${endTime}`)

    const { data, error } = await supabase
      .from("tables")
      .update({
        bidding_starts_at: startTime,
        bidding_ends_at: endTime,
      })
      .eq("is_active", true)
      .select()

    if (error) {
      throw error
    }

    console.log("\n✅ Event times updated successfully!")
    console.log(`📊 Updated ${data.length} tables`)

    // Display updated times for verification
    console.log("\n📋 Updated tables:")
    data.forEach((table) => {
      console.log(
        `   ${table.name}: ${new Date(table.bidding_starts_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} → ${new Date(table.bidding_ends_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
      )
    })
  } catch (error) {
    console.error("\n❌ Error updating event times:", error.message)

    if (error.message.includes("JWT")) {
      console.error("🔑 This looks like an authentication error. Please check your SUPABASE_SERVICE_ROLE_KEY")
    }

    process.exit(1)
  }
}

// Run the update
updateEventTimes()
