"use server"

import { authenticateUser, setSessionCookie, deleteSessionCookie, setSpectatorSessionCookie } from "@/lib/auth-enhanced"
import { redirect } from "next/navigation"
import { supabaseConfigured } from "@/lib/supabase-config"

/**
 * Login Server Action - Updated to use enhanced auth
 */
export async function login(_prevState: { error?: string } | null, formData: FormData) {
  const username = (formData.get("username") ?? "").toString().trim()
  const password = (formData.get("password") ?? "").toString().trim()

  if (!username || !password) {
    return { error: "Username and password are required" }
  }

  // Without database settings every login would fail as "invalid" — say what's actually wrong.
  if (!supabaseConfigured) {
    console.error("login: Supabase URL / publishable key are not set")
    return { error: "Login is unavailable right now — the site isn't connected to its database. Please contact the organiser." }
  }

  // Use the enhanced authentication system
  const user = await authenticateUser(username, password)

  if (!user) {
    return { error: "Invalid username or password" }
  }

  // Success ‒ create a session cookie and redirect to /bidding
  await setSessionCookie(user.username)
  redirect("/bidding") // do NOT wrap in try/catch
}

/**
 * Logout Server Action
 */
export async function logout() {
  await deleteSessionCookie() // This will now delete both bidder and spectator cookies
  redirect("/") // do NOT wrap in try/catch
}

/**
 * Spectator Login Server Action
 */
export async function spectatorLogin() {
  await setSpectatorSessionCookie()
  redirect("/bidding")
}
