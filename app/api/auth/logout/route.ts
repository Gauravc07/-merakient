import { NextResponse } from "next/server"
import { deleteSessionCookie } from "@/lib/auth-enhanced"

export async function POST() {
  try {
    deleteSessionCookie()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
