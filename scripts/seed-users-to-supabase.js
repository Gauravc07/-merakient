import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"
import { USERS } from "../lib/users.mjs" // Adjust path if necessary

// Ensure these environment variables are set in your Vercel project or .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) must be set.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
})

async function seedUsersToSupabase() {
  try {
    console.log("Starting user seeding process...")

    // 1. Delete all existing users from the public.users table
    console.log("Deleting existing users from public.users table...")
    // Use a condition that always evaluates to true to delete all rows
    const { error: deleteError } = await supabase.from("users").delete().neq("username", "non_existent_user")

    if (deleteError) {
      console.error("Error deleting existing users:", deleteError.message)
      return
    }
    console.log("Existing users deleted successfully.")

    // 2. Prepare new users with hashed passwords
    const usersToInsert = []
    const saltRounds = 10 // Cost factor for hashing

    for (const user of USERS) {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds)
      usersToInsert.push({
        username: user.username,
        password_hash: hashedPassword, // matches the `password_hash` column in create-tables-v4.sql
      })
    }

    // 3. Insert new users
    console.log(`Inserting ${usersToInsert.length} new users into public.users table...`)
    const { error: insertError } = await supabase.from("users").insert(usersToInsert)

    if (insertError) {
      console.error("Error inserting new users:", insertError.message)
    } else {
      console.log("New users inserted successfully!")
    }
  } catch (error) {
    console.error("An unexpected error occurred during user seeding:", error.message)
  } finally {
    console.log("User seeding process finished.")
  }
}

seedUsersToSupabase()
