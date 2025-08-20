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
import BidDialog from "./bid-dialog"

interface ProductionBiddingTableProps {
  currentUser?: string
  isSpectator?: boolean
}

export default function ProductionBiddingTable({
  currentUser = "user1",
  isSpectator = false,
}: ProductionBiddingTableProps) {
  const { tables, recentBids, loading, error, placeBid, refetch } = useRealtimeBidding()
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const [hoveredTable, setHoveredTable] = useState<string | null>(null)
  const [isPlacingBid, setIsPlacingBid] = useState(false)

  const currentSelectedTableData = tables.find((t) => t.id === selectedTableId)

  const handlePlaceBid = async (tableId: string, bidAmount: number) => {
    if (isSpectator) {
      return { success: false, error: "You are in spectator mode and cannot place bids." }
    }

    setIsPlacingBid(true)

    const [result] = await Promise.all([
      placeBid(tableId, bidAmount),
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ])

    if (result.success) {
      setSelectedTableId(null)
      setTimeout(() => {
        refetch()
      }, 500)
    }

    setIsPlacingBid(false)
    return result
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

  const handleManualRefresh = () => {
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
      <BidLoadingOverlay isVisible={isPlacingBid} />

      <BidDialog
        table={currentSelectedTableData}
        currentUser={currentUser}
        isOpen={!!selectedTableId}
        onOpenChange={(open) => {
          if (!open) setSelectedTableId(null)
        }}
        onPlaceBid={handlePlaceBid}
        isPlacingBid={isPlacingBid}
      />

      <section className="w-full py-6 md:py-8 lg:py-12 bg-black">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-8">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gold-gradient inline-flex items-center gap-3">
              
              Meraki 
              
            </h2>
            <div className="flex items-center justify-center gap-4">
  <img src="/images/meraki-logo.png" alt="Meraki Logo" className="h-16 md:h-20 w-auto" />
  <span className="text-yellow-400 text-xl md:text-2xl font-semibold">x</span>
  <img src="/images/di_mora_logo.png" alt="Dimora Logo" className="h-16 md:h-20 w-auto" />
  <span className="text-yellow-400 text-xl md:text-2xl font-semibold">x</span>
  <img src="/images/ti_white.png" alt="Ti Logo" className="h-16 md:h-20 w-auto" />
</div>


           
          </div>

          <BiddingTimeStatus tables={tables} />
          <HighestBidderDisplay tables={tables} loading={loading} error={error} />

          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <DynamicTableLayout
                  tables={tables}
                  hoveredTable={hoveredTable}
                  selectedTable={selectedTableId}
                  onTableHover={setHoveredTable}
                  onTableSelect={setSelectedTableId}
                  currentUser={currentUser}
                />
              </div>

              <div className="space-y-4">
                <Card className="bg-card-overlay border-black-charcoal h-full">
                  <CardHeader>
                    <CardTitle className="text-platinum-gradient flex items-center gap-2">
                      Live Bidding Activity ({recentBids.length})
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
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
