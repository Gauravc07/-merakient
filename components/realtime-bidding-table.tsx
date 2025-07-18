"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRealtimeBidding } from "@/hooks/use-realtime-bidding"
import { Loader2 } from "lucide-react"
import BiddingTimeStatus from "./bidding-time-status"
import DynamicTableLayout from "./dynamic-table-layout" // Import the new component

interface RealtimeBiddingTableProps {
  currentUser?: string
}

export default function RealtimeBiddingTable({ currentUser = "user1" }: RealtimeBiddingTableProps) {
  const { tables, recentBids, loading, error, placeBid } = useRealtimeBidding()
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [hoveredTable, setHoveredTable] = useState<string | null>(null)
  const [customBid, setCustomBid] = useState<string>("")
  const [bidError, setBidError] = useState<string>("")
  const [isPlacingBid, setIsPlacingBid] = useState(false)

  const handlePlaceBid = async () => {
    if (!selectedTable) return // Should not happen if button is only shown when selectedTable is not null

    const table = tables.find((t) => t.id === selectedTable)
    if (!table) {
      setBidError("Selected table not found or not bid-able.")
      return
    }

    const bidAmount = Number.parseInt(customBid)
    const minimumBid = table.current_bid + 1000

    // Validation
    if (!customBid || isNaN(bidAmount)) {
      setBidError("Please enter a valid bid amount")
      return
    }

    if (bidAmount < minimumBid) {
      setBidError(`Bid must be at least ₹${minimumBid.toLocaleString()} (₹1000 more than current bid)`)
      return
    }

    setIsPlacingBid(true)
    setBidError("")

    const result = await placeBid(selectedTable, bidAmount)

    if (result.success) {
      setSelectedTable(null)
      setCustomBid("")
    } else {
      setBidError(result.error || "Failed to place bid")
    }

    setIsPlacingBid(false)
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
      case "VIP":
        return "bg-purple-800"
      case "Standing":
        return "bg-blue-600"
      default:
        return "bg-gray-500"
    }
  }

  // Clear bid error and custom bid when selection changes
  useEffect(() => {
    setBidError("")
    setCustomBid("")
  }, [selectedTable])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        <span className="ml-2 text-foreground">Loading bidding data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  const currentSelectedTableData = tables.find((t) => t.id === selectedTable)

  return (
    <section className="w-full py-6 md:py-8 lg:py-12 bg-black">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-8">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gold-gradient">Live Bidding Section</h2>
        </div>

        {/* Add this new time status component */}
        <BiddingTimeStatus tables={tables} />

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-platinum-gradient italic">
              Welcome the King of Good Times
            </h3>
          </div>

          {/* Main content: DynamicTableLayout on left, Live Bidding Activity on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Dynamic Table Layout and Bid Input */}
            <div>
              <DynamicTableLayout
                tables={tables}
                hoveredTable={hoveredTable}
                selectedTable={selectedTable}
                onTableHover={setHoveredTable}
                onTableSelect={setSelectedTable}
                currentUser={currentUser}
              />

              {/* Conditional Bid Input Form */}
              {selectedTable && currentSelectedTableData && (
                <Card className="mt-4 bg-card-overlay border-black-charcoal">
                  <CardHeader>
                    <CardTitle className="text-platinum-gradient">
                      Place Bid on Table {currentSelectedTableData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Bid:</p>
                        <p className="font-bold text-yellow-400">
                          ₹{currentSelectedTableData.current_bid.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          by {currentSelectedTableData.highest_bidder_username || "No bidder"}
                        </p>
                      </div>
                      <Badge className={`${getCategoryColor(currentSelectedTableData.category)} text-white`}>
                        {currentSelectedTableData.category}
                      </Badge>
                    </div>

                    <Label htmlFor={`bid-${selectedTable}`} className="text-sm text-foreground">
                      Enter Your Bid (Min: ₹{(currentSelectedTableData.current_bid + 1000).toLocaleString()})
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`bid-${selectedTable}`}
                        type="number"
                        placeholder={`${currentSelectedTableData.current_bid + 1000}`}
                        value={customBid}
                        onChange={(e) => setCustomBid(e.target.value)}
                        className="bg-background border-yellow-500/50 text-foreground"
                        min={currentSelectedTableData.current_bid + 1000}
                        step="1000"
                        disabled={isPlacingBid}
                      />
                      <Button
                        onClick={handlePlaceBid}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black whitespace-nowrap"
                        disabled={!customBid || isPlacingBid}
                      >
                        {isPlacingBid ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Placing...
                          </>
                        ) : (
                          "Place Bid"
                        )}
                      </Button>
                    </div>
                    {bidError && <p className="text-red-400 text-xs">{bidError}</p>}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column: Live Bidding Activity */}
            <div className="space-y-4">
              <Card className="bg-card-overlay border-black-charcoal">
                <CardHeader>
                  <CardTitle className="text-platinum-gradient">Live Bidding Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {" "}
                    {/* Adjusted max-height */}
                    {recentBids.map((bid, index) => (
                      <div key={bid.id || index} className="flex justify-between items-center text-sm">
                        <span className="text-foreground">
                          <strong>{bid.username}</strong> bid on <strong>Table {bid.table_id}</strong>
                        </span>
                        <div className="text-right">
                          <span className="text-yellow-400 font-bold">₹{bid.bid_amount.toLocaleString()}</span>
                          <div className="text-xs text-muted-foreground">
                            {new Date(bid.bid_time).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {recentBids.length === 0 && (
                      <p className="text-muted-foreground text-center">No recent bidding activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
