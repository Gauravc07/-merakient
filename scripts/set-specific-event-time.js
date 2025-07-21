// Script to set specific event times for bidding
// Run with: node scripts/set-specific-event-time.js

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

async function setSpecificEventTimes() {
  try {
    // Define the specific start and end times for July 23rd, 2025, in IST
    // Note: Dates are parsed as UTC by default if no timezone is specified.
    // We construct them carefully to represent IST.

    // July 23rd, 2025, 7:00:00 PM IST
    const startDate = new Date(Date.UTC(2025, 6, 23, 13, 30, 0)) // UTC 13:30 is IST 19:00 (7 PM)
    const startTime = startDate.toISOString().replace("Z", "+05:30")

    // July 23rd, 2025, 8:00:00 PM IST
    const endDate = new Date(Date.UTC(2025, 6, 23, 14, 30, 0)) // UTC 14:30 is IST 20:00 (8 PM)
    const endTime = endDate.toISOString().replace("Z", "+05:30")

    console.log("\n🕐 Setting specific event times...")
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
    console.error("\n❌ Error setting event times:", error.message)

    if (error.message.includes("JWT")) {
      console.error("🔑 This looks like an authentication error. Please check your SUPABASE_SERVICE_ROLE_KEY")
    }

    process.exit(1)
  }
}

// Run the update
setSpecificEventTimes()
