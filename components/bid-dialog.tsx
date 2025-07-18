"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import type { Table } from "@/lib/supabase" // Import Table type

interface BidDialogProps {
  table: Table | null
  currentUser: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onPlaceBid: (tableId: string, bidAmount: number) => Promise<any>
  isPlacingBid: boolean
}

export default function BidDialog({
  table,
  currentUser,
  isOpen,
  onOpenChange,
  onPlaceBid,
  isPlacingBid,
}: BidDialogProps) {
  const [customBid, setCustomBid] = useState<string>("")
  const [bidError, setBidError] = useState<string>("")
  const initialBidSetRef = useRef(false)

  useEffect(() => {
    if (isOpen && table && !initialBidSetRef.current) {
      setCustomBid((table.current_bid + 1000).toString())
      setBidError("")
      initialBidSetRef.current = true
    } else if (!isOpen) {
      setCustomBid("")
      setBidError("")
      initialBidSetRef.current = false
    }
  }, [isOpen, table])

  const handleInternalPlaceBid = async () => {
    if (!table) return

    const bidAmount = Number.parseInt(customBid)
    const minimumBid = table.current_bid + 1000

    if (!customBid || isNaN(bidAmount)) {
      setBidError("Please enter a valid bid amount")
      return
    }

    if (bidAmount < minimumBid) {
      setBidError(`Bid must be at least ₹${minimumBid.toLocaleString()} (₹1000 more than current bid)`)
      return
    }

    setBidError("")
    const result = await onPlaceBid(table.id, bidAmount)

    if (result.success) {
      onOpenChange(false)
    } else {
      setBidError(result.error || "Failed to place bid")
    }
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

  if (!table) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card-overlay border-black-charcoal text-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-platinum-gradient">Place Bid on Table {table.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Current highest bid: ₹{table.current_bid.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Moved "Enter Your Bid" section to the top */}
          <div className="space-y-2">
            <Label htmlFor="bid-amount" className="text-sm text-foreground">
              Enter Your Bid (Min: ₹{(table.current_bid + 1000).toLocaleString()})
            </Label>
            <Input
              id="bid-amount"
              type="text"
              placeholder={`${table.current_bid + 1000}`}
              value={customBid}
              onChange={(e) => setCustomBid(e.target.value)}
              className="bg-background border-yellow-500/50 text-foreground"
              disabled={isPlacingBid}
            />
            {bidError && <p className="text-red-400 text-xs mt-1">{bidError}</p>}
          </div>

          {/* Original "Current Bid" section, now below the input */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Current Bid:</p>
              <p className="font-bold text-yellow-400">₹{table.current_bid.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">by {table.highest_bidder_username || "No bidder"}</p>
            </div>
            <Badge className={`${getCategoryColor(table.category)} text-white`}>{table.category}</Badge>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleInternalPlaceBid}
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
      </DialogContent>
    </Dialog>
  )
}
