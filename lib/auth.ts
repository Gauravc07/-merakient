import { cookies } from "next/headers"

const SESSION_COOKIE_NAME = "meraki_session"
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 // 24 hours

export function setSessionCookie(userId: string) {
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

export function getSessionUserId(): string | undefined {
  try {
    return cookies().get(SESSION_COOKIE_NAME)?.value
  } catch (error) {
    console.error("Error getting session cookie:", error)
    return undefined
  }
}

export function deleteSessionCookie() {
  try {
    cookies().delete(SESSION_COOKIE_NAME)
  } catch (error) {
    console.error("Error deleting session cookie:", error)
  }
}
