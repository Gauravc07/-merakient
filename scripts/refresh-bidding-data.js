// Script to force refresh all bidding data
// Run with: node scripts/refresh-bidding-data.js

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

async function refreshBiddingData() {
  console.log("🔄 Refreshing bidding data...")

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials!")
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // 1. Clean up orphaned bids
    console.log("\n1. 🧹 Cleaning orphaned bids...")

    const { data: orphanedBids, error: orphanError } = await supabase
      .from("bids")
      .select("id, table_id")
      .not("table_id", "in", `(SELECT id FROM tables WHERE is_active = true)`)

    if (orphanError) {
      console.error("Error finding orphaned bids:", orphanError.message)
    } else {
      console.log(`Found ${orphanedBids?.length || 0} orphaned bids`)

      if (orphanedBids && orphanedBids.length > 0) {
        const { error: deleteError } = await supabase
          .from("bids")
          .delete()
          .in(
            "id",
            orphanedBids.map((b) => b.id),
          )

        if (deleteError) {
          console.error("Error deleting orphaned bids:", deleteError.message)
        } else {
          console.log(`✅ Deleted ${orphanedBids.length} orphaned bids`)
        }
      }
    }

    // 2. Reset table versions to trigger updates
    console.log("\n2. 🔄 Updating table versions...")

    const { data: updatedTables, error: updateError } = await supabase
      .from("tables")
      .update({
        version: supabase.raw("version + 1"),
        updated_at: new Date().toISOString(),
      })
      .eq("is_active", true)
      .select()

    if (updateError) {
      console.error("Error updating tables:", updateError.message)
    } else {
      console.log(`✅ Updated ${updatedTables?.length || 0} tables`)
    }

    // 3. Get current data summary
    console.log("\n3. 📊 Current data summary:")

    const { data: tables } = await supabase.from("tables").select("*").eq("is_active", true).order("id")

    const { data: bids } = await supabase.from("bids").select("*").order("bid_time", { ascending: false }).limit(10)

    console.log(`Tables: ${tables?.length || 0}`)
    console.log(`Recent bids: ${bids?.length || 0}`)

    if (tables) {
      console.log("\nActive tables:")
      tables.forEach((table) => {
        console.log(`  ${table.id}: ₹${table.current_bid} (v${table.version})`)
      })
    }

    console.log("\n✅ Bidding data refreshed successfully!")
    console.log("\n📋 Next steps:")
    console.log("1. Refresh your browser")
    console.log("2. Check if bids are updating properly")
    console.log("3. Try placing a test bid")
  } catch (error) {
    console.error("💥 Error refreshing data:", error.message)
  }
}

refreshBiddingData()
