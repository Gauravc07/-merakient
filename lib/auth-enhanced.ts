"use server"

import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config"

type AuthDatabase = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          username: string
          email: string | null
          password_hash: string
          is_active: boolean | null
        }
        Insert: {
          id?: number
          username: string
          email?: string | null
          password_hash: string
          is_active?: boolean | null
        }
        Update: {
          id?: number
          username?: string
          email?: string | null
          password_hash?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
    }
  }
}

let supabase: ReturnType<typeof createClient<AuthDatabase>> | null = null

function getSupabaseClient() {
  const supabaseUrl = SUPABASE_URL
  const supabaseAnonKey = SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  if (!supabase) {
    supabase = createClient<AuthDatabase>(supabaseUrl, supabaseAnonKey)
  }

  return supabase
}

const SESSION_COOKIE_NAME = "meraki_session"
const SPECTATOR_COOKIE_NAME = "meraki_spectator_session"
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 // 24 hours

export interface AuthUser {
  id: number
  username: string
  email?: string
}

export async function authenticateUser(username: string, password: string): Promise<AuthUser | null> {
  try {
    const client = getSupabaseClient()
    if (!client) {
      console.error("Authentication unavailable: Supabase credentials are not configured")
      return null
    }

    // Fetch user with matching username from Supabase
    const { data, error } = await client
      .from("users")
      .select("id, username, email, password_hash, is_active")
      .eq("username", username)
      .single()

    if (error || !data) {
      console.error("Supabase fetch error:", error)
      return null
    }

    // Users removed from the list but kept for their bid history are deactivated
    if (data.is_active === false) return null

    // Compare provided password with bcrypt hash
    const isMatch = await bcrypt.compare(password, data.password_hash)
    if (!isMatch) return null

    return {
      id: data.id,
      username: data.username,
      email: data.email ?? undefined,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function setSessionCookie(userId: string) {
  try {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_EXPIRATION_SECONDS,
      path: "/",
      sameSite: "lax",
    })
  } catch (error) {
    console.error("Error setting session cookie:", error)
  }
}

export async function setSpectatorSessionCookie() {
  try {
    const cookieStore = await cookies()
    cookieStore.set(SPECTATOR_COOKIE_NAME, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_EXPIRATION_SECONDS,
      path: "/",
      sameSite: "lax",
    })
  } catch (error) {
    console.error("Error setting spectator session cookie:", error)
  }
}

export async function getSessionUserId(): Promise<string | undefined> {
  try {
    return (await cookies()).get(SESSION_COOKIE_NAME)?.value
  } catch (error) {
    console.error("Error getting session cookie:", error)
    return undefined
  }
}

export async function isSpectatorSession(): Promise<boolean> {
  try {
    return (await cookies()).has(SPECTATOR_COOKIE_NAME)
  } catch (error) {
    console.error("Error checking spectator session cookie:", error)
    return false
  }
}

export async function deleteSessionCookie() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)
    cookieStore.delete(SPECTATOR_COOKIE_NAME)
  } catch (error) {
    console.error("Error deleting session cookie:", error)
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const username = await getSessionUserId()
  if (!username) return null

  try {
    const client = getSupabaseClient()
    if (!client) {
      console.error("User lookup unavailable: Supabase credentials are not configured")
      return null
    }

    // The session cookie only stores the username, so look up the real numeric id
    // per request instead of guessing it from the string (usernames aren't "userN").
    const { data, error } = await client
      .from("users")
      .select("id, username, email, is_active")
      .eq("username", username)
      .single()

    if (error || !data) {
      console.error("Error fetching current user from Supabase:", error)
      return null
    }

    // Deleted or deactivated users lose access immediately, even with an existing session
    if (data.is_active === false) return null

    return {
      id: data.id,
      username: data.username,
      email: data.email ?? undefined,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
