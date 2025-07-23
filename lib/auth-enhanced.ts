"use server"

import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcrypt"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
    // Fetch user with matching username from Supabase
    const { data, error } = await supabase
      .from("users")
      .select("id, username, email, password_hash")
      .eq("username", username)
      .single()

    if (error || !data) {
      console.error("Supabase fetch error:", error)
      return null
    }

    // Compare provided password with bcrypt hash
    const isMatch = await bcrypt.compare(password, data.password_hash)
    if (!isMatch) return null

    return {
      id: data.id,
      username: data.username,
      email: data.email,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function setSessionCookie(userId: string) {
  try {
    cookies().set(SESSION_COOKIE_NAME, userId, {
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
    cookies().set(SPECTATOR_COOKIE_NAME, "true", {
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
  const userId = await getSessionUserId()
  if (!userId) return null

  try {
    // Optionally you can fetch full user info from Supabase if needed
    const userNumber = userId.replace("user", "")
    return {
      id: Number.parseInt(userNumber) || 1,
      username: userId,
      email: `${userId}@demo.com`,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
