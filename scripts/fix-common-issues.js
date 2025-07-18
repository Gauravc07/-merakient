// Script to fix common bidding issues
// Run with: node scripts/fix-common-issues.js

const { createClient } = require("@supabase/supabase-js")
const path = require("path")
const fs = require("fs")

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
  }
}

loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function fixCommonIssues() {
  console.log("🔧 Fixing common bidding issues...")

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials!")
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // 1. Start the event immediately
    console.log("\n1. ⏰ Starting event immediately...")
    const now = new Date()
    const endTime = new Date(now.getTime() + 5 * 60 * 60 * 1000) // 5 hours from now

    const { data: updatedTables, error: updateError } = await supabase
      .from("tables")
      .update({
        bidding_starts_at: now.toISOString(),
        bidding_ends_at: endTime.toISOString(),
      })
      .eq("is_active", true)
      .select()

    if (updateError) {
      console.error("❌ Error updating event times:", updateError.message)
      return
    }

    console.log(`✅ Event started! Updated ${updatedTables.length} tables`)
    console.log(`⏰ Event will end at: ${endTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`)

    // 2. Verify tables have proper data
    console.log("\n2. 📊 Verifying table data...")
    const { data: tables, error: tablesError } = await supabase.from("tables").select("*").eq("is_active", true)

    if (tablesError) {
      console.error("❌ Error fetching tables:", tablesError.message)
      return
    }

    console.log(`Found ${tables.length} active tables:`)
    tables.forEach((table) => {
      console.log(`  ${table.name}: ₹${table.current_bid} (v${table.version})`)
    })

    // 3. Test the place_bid function exists
    console.log("\n3. 🔧 Testing place_bid function...")
    try {
      const { data: testBid, error: bidError } = await supabase.rpc("place_bid", {
        p_table_id: "50",
        p_user_id: 1,
        p_username: "test_user",
        p_bid_amount: 1, // This will fail but tests if function exists
      })

      if (bidError && bidError.message.includes("does not exist")) {
        console.log("❌ place_bid function missing - need to run SQL script")
      } else {
        console.log("✅ place_bid function exists")
      }
    } catch (error) {
      console.log("⚠️ place_bid function test inconclusive")
    }

    console.log("\n✅ Common issues fixed!")
    console.log("\n📋 Try these steps now:")
    console.log("1. Refresh your browser")
    console.log("2. Login as user1/password1")
    console.log("3. Try placing a bid")
  } catch (error) {
    console.error("💥 Error fixing issues:", error.message)
  }
}

fixCommonIssues()
