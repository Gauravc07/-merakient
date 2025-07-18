"use server"

import { cookies } from "next/headers"

const SESSION_COOKIE_NAME = "meraki_session"
const SPECTATOR_COOKIE_NAME = "meraki_spectator_session" // New cookie for spectators
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 // 24 hours

export interface AuthUser {
  id: number
  username: string
  email?: string
}

export async function authenticateUser(username: string, password: string): Promise<AuthUser | null> {
  try {
    // Simple authentication for demo - check against user1-user40 pattern
    const userNumber = username.replace("user", "")
    const expectedPassword = `password${userNumber}`

    if (
      password === expectedPassword &&
      userNumber.match(/^\d+$/) &&
      Number.parseInt(userNumber) >= 1 &&
      Number.parseInt(userNumber) <= 40
    ) {
      return {
        id: Number.parseInt(userNumber),
        username: username,
        email: `${username}@demo.com`,
      }
    }

    return null
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
    // Await cookies() before calling .get()
    return (await cookies()).get(SESSION_COOKIE_NAME)?.value
  } catch (error) {
    console.error("Error getting session cookie:", error)
    return undefined
  }
}

export async function isSpectatorSession(): Promise<boolean> {
  try {
    // Await cookies() before calling .has()
    return (await cookies()).has(SPECTATOR_COOKIE_NAME)
  } catch (error) {
    console.error("Error checking spectator session cookie:", error)
    return false
  }
}

export async function deleteSessionCookie() {
  try {
    // Await cookies() before calling .delete()
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)
    cookieStore.delete(SPECTATOR_COOKIE_NAME) // Delete spectator cookie too
  } catch (error) {
    console.error("Error deleting session cookie:", error)
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const userId = await getSessionUserId() // Await the async function
  if (!userId) return null

  try {
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
