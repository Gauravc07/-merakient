// Script to verify your complete setup
// Run with: node scripts/verify-setup.js

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

async function verifySetup() {
  console.log("🔍 Verifying Meraki Entertainment Live Bidding Setup...")
  console.log("=".repeat(50)) // Fixed: Use .repeat() for string repetition

  // Check environment variables
  console.log("\n1. 🔑 Environment Variables:")
  const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]

  let envOk = true
  requiredVars.forEach((varName) => {
    const value = process.env[varName]
    if (
      value &&
      !value.includes("your-") &&
      !value.includes("placeholder") &&
      !value.includes("SERVICE_ROLE_KEY_HERE")
    ) {
      console.log(`   ✅ ${varName}: Found`)
    } else {
      console.log(`   ❌ ${varName}: Missing or placeholder`)
      envOk = false
    }
  })

  if (!envOk) {
    console.log("\n❌ Environment setup incomplete!")
    console.log("Please run: ./setup-env.sh")
    return
  }

  // Test database connection
  console.log("\n2. 🗄️  Database Connection:")
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    const { data, error } = await supabase.from("tables").select("count").limit(1)

    if (error) throw error
    console.log("   ✅ Database connection successful")
  } catch (error) {
    console.log(`   ❌ Database connection failed: ${error.message}`)
    return
  }

  // Check tables exist
  console.log("\n3. 📊 Database Tables:")
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    const { data: tables } = await supabase.from("tables").select("*").limit(1)
    const { data: users } = await supabase.from("users").select("*").limit(1)
    const { data: bids } = await supabase.from("bids").select("*").limit(1)

    console.log(`   ✅ Tables: ${tables && tables.length > 0 ? "Found" : "Missing"}`)
    console.log(`   ✅ Users: ${users && users.length > 0 ? "Found" : "Missing"}`)
    console.log(`   ✅ Bids: ${bids && bids.length > 0 ? "Found" : "Missing"}`)
  } catch (error) {
    console.log(`   ❌ Tables check failed: ${error.message}`)
    console.log("   💡 Please run the SQL script in Supabase dashboard")
    return
  }

  // Check event times
  console.log("\n4. ⏰ Event Configuration:")
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Fetch one table to get event times
    const { data: eventTables, error: eventTablesError } = await supabase
      .from("tables")
      .select("bidding_starts_at, bidding_ends_at")
      .limit(1)

    if (eventTablesError) {
      throw eventTablesError
    }

    if (eventTables && eventTables.length > 0) {
      const firstTable = eventTables[0]
      const startTime = new Date(firstTable.bidding_starts_at)
      const endTime = new Date(firstTable.bidding_ends_at)

      console.log(`   📅 Event Start: ${startTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`)
      console.log(`   📅 Event End: ${endTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`)

      // Check for placeholder year (2024 was the default in create-tables-v2.sql before July 2025 update)
      if (startTime.getFullYear() === 2024 && startTime.getMonth() === 0) {
        console.log("   ⚠️  Event times appear to be placeholder values (e.g., from 2024).")
        console.log("   💡 Update with: node scripts/update-event-times.js")
      } else if (endTime.getFullYear() === 2025 && endTime.getMonth() === 6 && endTime.getDate() === 30) {
        console.log("   ✅ Event times configured (set to July 30, 2025).")
      } else {
        console.log("   ✅ Event times configured.")
      }
    } else {
      console.log("   ⚠️  No active tables found to check event times.")
      console.log("   💡 Ensure tables are active and run the SQL script if needed.")
    }
  } catch (error) {
    console.log(`   ❌ Event times check failed: ${error.message}`)
    console.log("   💡 This might indicate an issue with table data or the database function.")
  }

  // Check file structure
  console.log("\n5. 📁 File Structure:")
  const requiredFiles = ["package.json", ".env.local", "scripts/update-event-times.js", "app/bidding/page.tsx"]

  requiredFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}`)
    } else {
      console.log(`   ❌ ${file}`)
    }
  })

  console.log("\n" + "=".repeat(50)) // Fixed: Use .repeat() for string repetition
  console.log("🎉 Setup verification complete!")
  console.log("\n📋 Next steps:")
  console.log("1. Update event times: node scripts/update-event-times.js")
  console.log("2. Test locally: npm run dev")
  console.log("3. Deploy: vercel --prod")
  console.log("4. Test with multiple users")
}

verifySetup().catch(console.error)
