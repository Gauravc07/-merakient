// Emergency script to start the event immediately
// Run with: node scripts/start-event-now.js

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

// Load environment variables at the start of the script
loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if Supabase credentials are valid
if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey.includes("SERVICE_ROLE_KEY_HERE")) {
  console.error("\n❌ Missing or invalid Supabase credentials!")
  console.error(
    "Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are correctly set in your .env.local file.",
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function startEventNow() {
  try {
    console.log("🚀 Starting event immediately...")

    const now = new Date()
    const endTime = new Date(now.getTime() + 5 * 60 * 60 * 1000) // 5 hours from now

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
  } catch (error) {
    console.error("❌ Error starting event:", error.message)
  }
}

startEventNow()
