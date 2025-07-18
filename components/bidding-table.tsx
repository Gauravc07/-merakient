"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock table data with initial bids (fallback when database is not available)
const initialTables = [
  { id: "50", name: "Diamond 50", category: "Diamond", pax: "10-13", currentBid: 15000, highestBidder: "Anonymous" },
  { id: "51", name: "Diamond 51", category: "Diamond", pax: "10-13", currentBid: 12000, highestBidder: "User5" },
  { id: "52", name: "Diamond 52", category: "Diamond", pax: "10-13", currentBid: 18000, highestBidder: "User12" },
  { id: "53", name: "Diamond 53", category: "Diamond", pax: "10-13", currentBid: 14000, highestBidder: "User8" },
  {
    id: "43/44",
    name: "Platinum 43/44",
    category: "Platinum",
    pax: "10-13",
    currentBid: 10000,
    highestBidder: "User3",
  },
  { id: "82", name: "Table 82", category: "Gold", pax: "6-8", currentBid: 8000, highestBidder: "User15" },
  { id: "72", name: "Table 72", category: "Gold", pax: "6-8", currentBid: 7000, highestBidder: "User22" },
  { id: "81", name: "Table 81", category: "Gold", pax: "6-8", currentBid: 6000, highestBidder: "User7" },
  { id: "71", name: "Table 71", category: "Gold", pax: "6-8", currentBid: 9000, highestBidder: "User18" },
  { id: "80", name: "Table 80", category: "Silver", pax: "4-6", currentBid: 4000, highestBidder: "User25" },
  { id: "70", name: "Table 70", category: "Silver", pax: "4-6", currentBid: 5000, highestBidder: "User11" },
  { id: "41", name: "Table 41", category: "Silver", pax: "4-5", currentBid: 3000, highestBidder: "User30" },
  { id: "40", name: "Table 40", category: "Silver", pax: "4-6", currentBid: 3500, highestBidder: "User19" },
  { id: "62", name: "Table 62", category: "Silver", pax: "2-3", currentBid: 2000, highestBidder: "User33" },
  { id: "63", name: "Table 63", category: "Silver", pax: "3-4", currentBid: 2500, highestBidder: "User28" },
  { id: "64", name: "Table 64", category: "Silver", pax: "2-4", currentBid: 2200, highestBidder: "User35" },
]

interface BiddingTableProps {
  currentUser?: string
}

export default function BiddingTable({ currentUser = "user1" }: BiddingTableProps) {
  const [tables, setTables] = useState(initialTables)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [hoveredTable, setHoveredTable] = useState<string | null>(null)
  const [customBid, setCustomBid] = useState<string>("")
  const [bidError, setBidError] = useState<string>("")
  const [bidHistory, setBidHistory] = useState<
    Array<{
      tableId: string
      bidder: string
      amount: number
      timestamp: Date
    }>
  >([])

  // Simulate live bidding updates (mock data for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update some table bids to simulate live bidding
      if (Math.random() > 0.7) {
        const randomTableIndex = Math.floor(Math.random() * tables.length)
        const randomUser = `user${Math.floor(Math.random() * 40) + 1}`

        setTables((prev) => {
          const newTables = [...prev]
          const table = newTables[randomTableIndex]
          const newBid = table.currentBid + 1000

          newTables[randomTableIndex] = {
            ...table,
            currentBid: newBid,
            highestBidder: randomUser,
          }

          // Add to bid history
          setBidHistory((prev) => [
            {
              tableId: table.id,
              bidder: randomUser,
              amount: newBid,
              timestamp: new Date(),
            },
            ...prev.slice(0, 9),
          ]) // Keep only last 10 bids

          return newTables
        })
      }
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [tables])

  const placeBid = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId)
    if (!table) return

    const bidAmount = Number.parseInt(customBid)
    const minimumBid = table.currentBid + 1000

    // Validation
    if (!customBid || isNaN(bidAmount)) {
      setBidError("Please enter a valid bid amount")
      return
    }

    if (bidAmount < minimumBid) {
      setBidError(`Bid must be at least ₹${minimumBid.toLocaleString()} (₹1000 more than current bid)`)
      return
    }

    // Clear error and place bid
    setBidError("")
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, currentBid: bidAmount, highestBidder: currentUser } : t)),
    )

    setBidHistory((prev) => [
      {
        tableId,
        bidder: currentUser,
        amount: bidAmount,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9),
    ])

    setSelectedTable(null)
    setCustomBid("")
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Diamond":
        return "bg-purple-600"
      case "Platinum":
        return "bg-gray-400"
      case "Gold":
        return "bg-yellow-500"
      case "Silver":
        return "bg-gray-300"
      default:
        return "bg-gray-500"
    }
  }

  // Clear bid error when selection changes
  useEffect(() => {
    setBidError("")
    setCustomBid("")
  }, [selectedTable])

  return (
    <section className="w-full py-6 md:py-8 lg:py-12 bg-black">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-8">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gold-gradient">Live Bidding Section</h2>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-platinum-gradient italic">
              Welcome the King of Good Times
            </h3>
          </div>

          {/* Main content: Image on left, Tables list on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image on the left */}
            <div className="relative">
              <div className="relative w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-2xl shadow-yellow-500/20">
                <Image
                  src="/images/seating-chart-black.png"
                  alt="King of Good Times Seating Chart"
                  fill
                  style={{ objectFit: "contain" }}
                  quality={100}
                />

                {/* Hover areas positioned accurately over each table */}
                {tables.map((table) => {
                  let position = { top: "50%", left: "50%", width: "8%", height: "6%" }

                  // Accurate positioning based on the seating chart layout
                  switch (table.id) {
                    case "50": // Top left diamond
                      position = { top: "8%", left: "8%", width: "12%", height: "8%" }
                      break
                    case "51": // Top center-left diamond
                      position = { top: "8%", left: "25%", width: "12%", height: "8%" }
                      break
                    case "52": // Top center-right diamond
                      position = { top: "8%", left: "63%", width: "12%", height: "8%" }
                      break
                    case "53": // Top right diamond
                      position = { top: "8%", left: "80%", width: "12%", height: "8%" }
                      break
                    case "43/44": // Left platinum (combined)
                      position = { top: "25%", left: "2%", width: "15%", height: "10%" }
                      break
                    case "82": // Left center circle
                      position = { top: "32%", left: "22%", width: "10%", height: "8%" }
                      break
                    case "72": // Right center circle
                      position = { top: "32%", left: "68%", width: "10%", height: "8%" }
                      break
                    case "41": // Left side circle (top)
                      position = { top: "45%", left: "5%", width: "8%", height: "6%" }
                      break
                    case "81": // Left rectangle
                      position = { top: "52%", left: "18%", width: "12%", height: "8%" }
                      break
                    case "71": // Right rectangle
                      position = { top: "52%", left: "70%", width: "12%", height: "8%" }
                      break
                    case "62": // Right side circle (top)
                      position = { top: "45%", left: "87%", width: "8%", height: "6%" }
                      break
                    case "40": // Left side circle (bottom)
                      position = { top: "65%", left: "5%", width: "8%", height: "6%" }
                      break
                    case "80": // Left bottom rectangle
                      position = { top: "72%", left: "18%", width: "12%", height: "8%" }
                      break
                    case "70": // Right bottom rectangle
                      position = { top: "72%", left: "70%", width: "12%", height: "8%" }
                      break
                    case "63": // Right side circle (middle)
                      position = { top: "58%", left: "87%", width: "8%", height: "6%" }
                      break
                    case "64": // Right side circle (bottom)
                      position = { top: "71%", left: "87%", width: "8%", height: "6%" }
                      break
                    default:
                      position = { top: "50%", left: "50%", width: "8%", height: "6%" }
                  }

                  return (
                    <div
                      key={table.id}
                      className="absolute cursor-pointer z-10"
                      style={position}
                      onMouseEnter={() => setHoveredTable(table.id)}
                      onMouseLeave={() => setHoveredTable(null)}
                    >
                      {/* Show bid info only on hover */}
                      {hoveredTable === table.id && (
                        <div className="absolute z-20 bg-black/95 text-yellow-400 px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-yellow-500/50 shadow-xl -top-14 left-1/2 transform -translate-x-1/2">
                          <div className="font-bold text-center text-yellow-300">Table {table.id}</div>
                          <div className="font-bold text-center">₹{table.currentBid.toLocaleString()}</div>
                          <div className="text-yellow-300 text-xs text-center">{table.highestBidder}</div>
                          {/* Small arrow pointing down */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-yellow-500/50"></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Available Tables section on the right */}
            <div className="space-y-4">
              <Card className="bg-card-overlay border-black-charcoal">
                <CardHeader>
                  <CardTitle className="text-platinum-gradient">Available Tables</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto space-y-3">
                  {tables.map((table) => (
                    <div
                      key={table.id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedTable === table.id
                          ? "border-yellow-500 bg-yellow-500/10"
                          : "border-black-charcoal bg-background hover:border-yellow-500/50"
                      }`}
                      onClick={() => setSelectedTable(table.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{table.name}</h4>
                          <p className="text-sm text-muted-foreground">{table.pax} PAX</p>
                        </div>
                        <Badge className={`${getCategoryColor(table.category)} text-white`}>{table.category}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Bid:</p>
                          <p className="font-bold text-yellow-400">₹{table.currentBid.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">by {table.highestBidder}</p>
                        </div>
                      </div>

                      {/* Custom bid input when table is selected */}
                      {selectedTable === table.id && (
                        <div className="mt-3 space-y-2 border-t border-yellow-500/20 pt-3">
                          <Label htmlFor={`bid-${table.id}`} className="text-sm text-foreground">
                            Enter Your Bid (Min: ₹{(table.currentBid + 1000).toLocaleString()})
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id={`bid-${table.id}`}
                              type="number"
                              placeholder={`${table.currentBid + 1000}`}
                              value={customBid}
                              onChange={(e) => setCustomBid(e.target.value)}
                              className="bg-background border-yellow-500/50 text-foreground"
                              min={table.currentBid + 1000}
                              step="1000"
                            />
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                placeBid(table.id)
                              }}
                              className="bg-yellow-500 hover:bg-yellow-600 text-black whitespace-nowrap"
                              disabled={!customBid}
                            >
                              Place Bid
                            </Button>
                          </div>
                          {bidError && <p className="text-red-400 text-xs">{bidError}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Live Bidding Activity */}
          <Card className="bg-card-overlay border-black-charcoal">
            <CardHeader>
              <CardTitle className="text-platinum-gradient">Live Bidding Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {bidHistory.map((bid, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-foreground">
                      <strong>{bid.bidder}</strong> bid on <strong>Table {bid.tableId}</strong>
                    </span>
                    <div className="text-right">
                      <span className="text-yellow-400 font-bold">₹{bid.amount.toLocaleString()}</span>
                      <div className="text-xs text-muted-foreground">{bid.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
                {bidHistory.length === 0 && (
                  <p className="text-muted-foreground text-center">No recent bidding activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
