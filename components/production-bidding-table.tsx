"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRealtimeBidding } from "@/hooks/use-realtime-bidding"
import { Loader2 } from "lucide-react"
import BiddingTimeStatus from "./bidding-time-status"
import BidLoadingOverlay from "./bid-loading-overlay"
import DynamicTableLayout from "./dynamic-table-layout"
import HighestBidderDisplay from "./highest-bidder-display"
import BidDialog from "./bid-dialog" // Import the new BidDialog

interface ProductionBiddingTableProps {
  currentUser?: string
  isSpectator?: boolean // New prop
}

export default function ProductionBiddingTable({
  currentUser = "user1",
  isSpectator = false,
}: ProductionBiddingTableProps) {
  const { tables, recentBids, loading, error, placeBid, refetch } = useRealtimeBidding()
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null) // Renamed for clarity
  const [hoveredTable, setHoveredTable] = useState<string | null>(null)
  const [isPlacingBid, setIsPlacingBid] = useState(false)

  const currentSelectedTableData = tables.find((t) => t.id === selectedTableId)

  const handlePlaceBid = async (tableId: string, bidAmount: number) => {
    if (isSpectator) {
      // Prevent bidding if in spectator mode
      // This error will be handled by the BidDialog
      return { success: false, error: "You are in spectator mode and cannot place bids." }
    }

    setIsPlacingBid(true)

    console.log("Placing bid:", { tableId, bidAmount })

    // Add a minimum delay to show the animation
    const [result] = await Promise.all([
      placeBid(tableId, bidAmount),
      new Promise((resolve) => setTimeout(resolve, 2000)), // Minimum 2 seconds to show animation
    ])

    console.log("Bid result:", result)

    if (result.success) {
      setSelectedTableId(null) // Close dialog on success
      // Force an additional refresh to ensure UI updates
      setTimeout(() => {
        refetch()
      }, 500)
    } else {
      // Error will be handled by BidDialog
    }

    setIsPlacingBid(false)
    return result // Return result for BidDialog to handle
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
        return "bg-purple-800" // Added for VIP tables
      case "Standing":
        return "bg-blue-600" // Added for Standing tables
      default:
        return "bg-gray-500"
    }
  }

  // Manual refresh function - keep the function but remove the button
  const handleManualRefresh = () => {
    console.log("Manual refresh triggered")
    refetch()
  }

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
          <Button onClick={handleManualRefresh}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Bid Loading Overlay */}
      <BidLoadingOverlay isVisible={isPlacingBid} />

      {/* Bid Dialog */}
      <BidDialog
        table={currentSelectedTableData}
        currentUser={currentUser}
        isOpen={!!selectedTableId} // Open if a table is selected
        onOpenChange={(open) => {
          if (!open) setSelectedTableId(null) // Close dialog
        }}
        onPlaceBid={handlePlaceBid}
        isPlacingBid={isPlacingBid}
      />

      <section className="w-full py-6 md:py-8 lg:py-12 bg-black">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-8">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gold-gradient">
              Welcome the King of Good Times
            </h2>
          </div>
          {/* Bidding Time Status */}
          <BiddingTimeStatus tables={tables} />
          {/* Highest Bidder Display */}
          <HighestBidderDisplay tables={tables} loading={loading} error={error} /> {/* Pass props here */}
          <div className="space-y-6">
            {/* Main content: DynamicTableLayout on left, Live Bidding Activity on right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Dynamic Table Layout */}
              <div>
                <DynamicTableLayout
                  tables={tables}
                  hoveredTable={hoveredTable}
                  selectedTable={selectedTableId} // Pass selectedTableId
                  onTableHover={setHoveredTable}
                  onTableSelect={setSelectedTableId} // Update selectedTableId on click
                  currentUser={currentUser}
                />
              </div>

              {/* Right Column: Live Bidding Activity */}
              <div className="space-y-4">
                <Card className="bg-card-overlay border-black-charcoal h-full">
                  {/* Added h-full */}
                  <CardHeader>
                    <CardTitle className="text-platinum-gradient flex items-center gap-2">
                      Live Bidding Activity ({recentBids.length})
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
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
    </>
  )
}
