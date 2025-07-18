// Quick script to debug bidding issues
// Run with: node scripts/quick-debug-bidding.js

const { createClient } = require("@supabase/supabase-js")
const path = require("path")
const fs = require("fs")

// Load environment variables
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

async function debugBiddingIssues() {
  console.log("🔍 Debugging bidding issues...")
  console.log("=" * 50)

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials!")
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // 1. Check database connection
    console.log("\n1. 🗄️ Testing database connection...")
    const { data: testData, error: testError } = await supabase.from("tables").select("count").limit(1)

    if (testError) {
      console.error("❌ Database connection failed:", testError.message)
      return
    }
    console.log("✅ Database connection successful")

    // 2. Check event times
    console.log("\n2. ⏰ Checking event times...")
    const { data: tables, error: tablesError } = await supabase
      .from("tables")
      .select("id, name, bidding_starts_at, bidding_ends_at, is_active")
      .limit(3)

    if (tablesError) {
      console.error("❌ Error fetching tables:", tablesError.message)
      return
    }

    const now = new Date()
    console.log(`Current time: ${now.toISOString()}`)

    tables.forEach((table) => {
      const start = new Date(table.bidding_starts_at)
      const end = new Date(table.bidding_ends_at)
      const status = now < start ? "NOT STARTED" : now > end ? "ENDED" : "LIVE"

      console.log(`${table.name}: ${status}`)
      console.log(`  Starts: ${start.toISOString()}`)
      console.log(`  Ends: ${end.toISOString()}`)
    })

    // 3. Check if event is live
    const firstTable = tables[0]
    const start = new Date(firstTable.bidding_starts_at)
    const end = new Date(firstTable.bidding_ends_at)

    if (now < start) {
      console.log("\n🚨 ISSUE FOUND: Event has not started yet!")
      console.log("💡 SOLUTION: Run 'node scripts/start-event-now.js' to start immediately")
      return
    }

    if (now > end) {
      console.log("\n🚨 ISSUE FOUND: Event has ended!")
      console.log("💡 SOLUTION: Run 'node scripts/extend-event.js 2' to extend by 2 hours")
      return
    }

    console.log("\n✅ Event is currently LIVE")

    // 4. Check table data
    console.log("\n3. 📊 Checking table data...")
    const { data: fullTables, error: fullError } = await supabase
      .from("tables")
      .select("*")
      .eq("is_active", true)
      .limit(5)

    if (fullError) {
      console.error("❌ Error fetching full table data:", fullError.message)
      return
    }

    console.log(`Found ${fullTables.length} active tables`)
    fullTables.forEach((table) => {
      console.log(`${table.name}: ₹${table.current_bid} (${table.highest_bidder_username || "No bidder"})`)
    })

    // 5. Test API endpoints
    console.log("\n4. 🌐 Testing API endpoints...")

    // Test tables API
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/tables?select=*&is_active=eq.true&limit=1`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        },
      )

      if (response.ok) {
        console.log("✅ Tables API endpoint working")
      } else {
        console.log("❌ Tables API endpoint failed:", response.status)
      }
    } catch (error) {
      console.log("❌ Tables API test failed:", error.message)
    }

    console.log("\n" + "=" * 50)
    console.log("🎯 DIAGNOSIS COMPLETE")

    console.log("\n📋 Next steps to try:")
    console.log("1. Refresh your browser page")
    console.log("2. Check browser console for errors (F12)")
    console.log("3. Try logging out and back in")
    console.log("4. Try a different browser/incognito window")
    console.log("5. Check network connection")
  } catch (error) {
    console.error("💥 Unexpected error:", error.message)
  }
}

debugBiddingIssues()
