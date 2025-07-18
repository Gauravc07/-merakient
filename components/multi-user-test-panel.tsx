"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Play, Square } from "lucide-react"

interface TestUser {
  username: string
  isActive: boolean
  lastBid?: number
  tableId?: string
}

export default function MultiUserTestPanel() {
  const [testUsers, setTestUsers] = useState<TestUser[]>(
    Array.from({ length: 10 }, (_, i) => ({
      username: `user${i + 1}`,
      isActive: false,
    })),
  )
  const [isRunning, setIsRunning] = useState(false)
  const [testInterval, setTestInterval] = useState(5000)

  const simulateBid = async (username: string, tableId: string, amount: number) => {
    try {
      // This would simulate a bid from a specific user
      const response = await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Test-User": username,
        },
        body: JSON.stringify({
          table_id: tableId,
          bid_amount: amount,
        }),
      })

      return response.ok
    } catch (error) {
      console.error(`Error simulating bid for ${username}:`, error)
      return false
    }
  }

  const startSimulation = () => {
    setIsRunning(true)

    const interval = setInterval(() => {
      const activeUsers = testUsers.filter((u) => u.isActive)
      if (activeUsers.length === 0) return

      const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)]
      const tables = ["50", "51", "52", "53", "43/44", "82", "72", "81", "71"]
      const randomTable = tables[Math.floor(Math.random() * tables.length)]
      const bidAmount = Math.floor(Math.random() * 5000) + 15000

      simulateBid(randomUser.username, randomTable, bidAmount)

      setTestUsers((prev) =>
        prev.map((u) => (u.username === randomUser.username ? { ...u, lastBid: bidAmount, tableId: randomTable } : u)),
      )
    }, testInterval)

    return () => clearInterval(interval)
  }

  const stopSimulation = () => {
    setIsRunning(false)
  }

  const toggleUser = (username: string) => {
    setTestUsers((prev) => prev.map((u) => (u.username === username ? { ...u, isActive: !u.isActive } : u)))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card-overlay border-black-charcoal">
      <CardHeader>
        <CardTitle className="text-platinum-gradient flex items-center gap-2">
          <Users className="h-5 w-5" />
          Multi-User Testing Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-foreground">Interval (ms):</label>
            <Input
              type="number"
              value={testInterval}
              onChange={(e) => setTestInterval(Number(e.target.value))}
              className="w-24"
              min="1000"
              step="1000"
            />
          </div>
          <Button
            onClick={isRunning ? stopSimulation : startSimulation}
            className={isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isRunning ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop Simulation
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Simulation
              </>
            )}
          </Button>
        </div>

        {/* User Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {testUsers.map((user) => (
            <div
              key={user.username}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                user.isActive ? "border-green-500 bg-green-500/10" : "border-gray-600 bg-background"
              }`}
              onClick={() => toggleUser(user.username)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{user.username}</span>
                <Badge className={user.isActive ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              {user.lastBid && (
                <div className="text-xs text-muted-foreground">
                  Last: ₹{user.lastBid.toLocaleString()} on {user.tableId}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-background/50 p-4 rounded-lg">
          <h4 className="font-semibold text-foreground mb-2">Testing Instructions:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Click on users to activate/deactivate them for simulation</li>
            <li>• Set the interval for automatic bid placement</li>
            <li>• Start simulation to see real-time bidding from multiple users</li>
            <li>• Open multiple browser tabs/devices to test concurrent bidding</li>
            <li>• Monitor the database for conflict resolution and proper bid recording</li>
          </ul>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{testUsers.filter((u) => u.isActive).length}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{testUsers.filter((u) => u.lastBid).length}</div>
            <div className="text-sm text-muted-foreground">Users with Bids</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{isRunning ? "Running" : "Stopped"}</div>
            <div className="text-sm text-muted-foreground">Simulation Status</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
