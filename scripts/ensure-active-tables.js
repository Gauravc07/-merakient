// Script to ensure all tables are active and have valid bidding times
// Run with: node scripts/ensure-active-tables.js

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
    console.log("⚠️  .env.local file not found, ensure environment variables are set in your deployment environment.")
  }
}

// Load environment variables
loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey.includes("SERVICE_ROLE_KEY_HERE")) {
  console.error("\n❌ Missing or invalid Supabase credentials!")
  console.error("Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are correctly set.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function ensureActiveTables() {
  try {
    console.log("🔄 Ensuring all tables are active and have valid bidding times...")

    const now = new Date()
    // Set end time to July 30th, 2025, 11:59:59 PM IST
    const futureEndTime = "2025-07-30T23:59:59+05:30"

    const { data, error } = await supabase
      .from("tables")
      .update({
        is_active: true,
        bidding_starts_at: now.toISOString(),
        bidding_ends_at: futureEndTime,
        updated_at: now.toISOString(),
      })
      .eq("is_active", true)
      .select()

    if (error) {
      throw error
    }

    console.log("\n✅ Tables updated successfully!")
    console.log(`📊 Updated ${data.length} tables to be active and bidable until ${futureEndTime}`)

    // Verify the update
    console.log("\n📋 Verifying updated tables:")
    data.forEach((table) => {
      console.log(
        `   ${table.name} (ID: ${table.id}): Active: ${table.is_active}, Starts: ${new Date(table.bidding_starts_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}, Ends: ${new Date(table.bidding_ends_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
      )
    })
  } catch (error) {
    console.error("\n❌ Error ensuring active tables:", error.message)
    if (error.message.includes("JWT")) {
      console.error("🔑 This looks like an authentication error. Please check your SUPABASE_SERVICE_ROLE_KEY.")
    }
    process.exit(1)
  }
}

ensureActiveTables()
