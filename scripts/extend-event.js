// Script to extend the event by specified hours
// Run with: node scripts/extend-event.js 2 (extends by 2 hours)

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

async function extendEvent() {
  const hoursToExtend = Number.parseInt(process.argv[2]) || 1

  try {
    console.log(`⏰ Extending event by ${hoursToExtend} hour(s)...`)

    // Attempt to call the RPC function first
    const { data, error } = await supabase.rpc("extend_event", {
      hours_to_extend: hoursToExtend,
    })

    if (error) {
      // If RPC function doesn't exist or fails, fall back to direct update
      console.warn(
        `⚠️ RPC function 'extend_event' failed or not found: ${error.message}. Falling back to direct update.`,
      )

      const { data: tables, error: fetchError } = await supabase
        .from("tables")
        .select("bidding_ends_at")
        .eq("is_active", true)
        .limit(1)
        .single()

      if (fetchError) throw fetchError

      const currentEndTime = new Date(tables.bidding_ends_at)
      const newEndTime = new Date(currentEndTime.getTime() + hoursToExtend * 60 * 60 * 1000)

      const { error: updateError } = await supabase
        .from("tables")
        .update({ bidding_ends_at: newEndTime.toISOString() })
        .eq("is_active", true)

      if (updateError) throw updateError
    }

    console.log("✅ Event extended successfully!")
    console.log(`📊 Extended by ${hoursToExtend} hour(s)`)
  } catch (error) {
    console.error("❌ Error extending event:", error.message)
    process.exit(1) // Exit with error code
  }
}

extendEvent()
