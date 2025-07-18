"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSessionDebugInfo, clearAllSessions } from "@/lib/auth-debug"

interface DebugPanelProps {
  currentUser?: string
}

export default function DebugPanel({ currentUser }: DebugPanelProps) {
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Multiple checks to ensure this never shows in production
  const isDevelopment = process.env.NODE_ENV === "development"
  const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost"
  const showDebugPanel = isDevelopment && isLocalhost

  if (!showDebugPanel) {
    return null
  }

  const showDebugInfo = () => {
    setDebugInfo(getSessionDebugInfo())
  }

  const handleClearSessions = () => {
    clearAllSessions()
    window.location.reload()
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-gray-900 border-gray-700 z-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-yellow-400">Debug Panel (DEV ONLY)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs text-gray-300">
          Current User: <span className="text-yellow-400">{currentUser || "Not logged in"}</span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={showDebugInfo} className="text-xs bg-transparent">
            Debug Info
          </Button>
          <Button size="sm" variant="destructive" onClick={handleClearSessions} className="text-xs">
            Clear Session
          </Button>
        </div>

        {debugInfo && (
          <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-800 rounded">
            <div>
              Browser:{" "}
              {debugInfo.userAgent.includes("Chrome")
                ? "Chrome"
                : debugInfo.userAgent.includes("Firefox")
                  ? "Firefox"
                  : "Other"}
            </div>
            <div>Cookies: {debugInfo.cookieCount}</div>
            <div>Time: {new Date(debugInfo.timestamp).toLocaleTimeString()}</div>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-2">
          💡 Use different browsers or incognito windows for multi-user testing
        </div>
      </CardContent>
    </Card>
  )
}
