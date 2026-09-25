"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import type { Table } from "@/lib/supabase"
import { BID_INCREMENT, ZONE_STYLES, TABLE_ZONES, type TableZone } from "@/lib/bidding-constants"

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
      setCustomBid((table.current_bid + BID_INCREMENT).toString())
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
    const minimumBid = table.current_bid + BID_INCREMENT

    if (!customBid || isNaN(bidAmount)) {
      setBidError("Please enter a valid bid amount")
      return
    }

    if (bidAmount < minimumBid) {
      setBidError(`Bid must be at least ₹${minimumBid.toLocaleString()} (₹${BID_INCREMENT.toLocaleString()} more than current bid)`)
      return
    }

    setBidError("")
    onOpenChange(false)

    const result = await onPlaceBid(table.id, bidAmount)

    if (!result.success) {
      // On a version conflict / insufficient bid, the server tells us the real current
      // minimum — bump the field to it so the user can just hit "Place Bid" again.
      if (typeof result.minimum_bid === "number") {
        setCustomBid(result.minimum_bid.toString())
      }
      setBidError(result.error || "Failed to place bid")
      onOpenChange(true)
    }
  }

  const zone: TableZone = (table?.category as TableZone) || "RESERVED"
  const style = ZONE_STYLES[zone]

  if (!table) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Leave a margin on each side on phones instead of running edge to edge */}
      <DialogContent className="w-[calc(100%-2.5rem)] max-w-[400px] rounded-xl p-5 sm:rounded-xl sm:p-6 bg-black border-mirzapur-gold/40 text-mirzapur-bone max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-mirzapur-gradient font-display text-xl">
            {currentUser} — BID ON {table.name}
          </DialogTitle>
          <DialogDescription className="text-mirzapur-bone/60">
            Current highest bid: ₹{table.current_bid.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bid-amount" className="text-sm text-mirzapur-bone">
              Enter Your Bid (Min: ₹{(table.current_bid + BID_INCREMENT).toLocaleString()})
            </Label>
            <Input
              id="bid-amount"
              type="text"
              inputMode="numeric"
              placeholder={`${table.current_bid + BID_INCREMENT}`}
              value={customBid}
              onChange={(e) => setCustomBid(e.target.value)}
              className="bg-black border-mirzapur-gold/40 text-mirzapur-bone"
              disabled={isPlacingBid}
            />
            {bidError && <p className="text-red-400 text-xs mt-1">{bidError}</p>}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-mirzapur-bone/60">Current Bid:</p>
              <p className="font-bold text-mirzapur-gold">₹{table.current_bid.toLocaleString()}</p>
              <p className="text-xs text-mirzapur-bone/50">by {table.highest_bidder_username || "No bidder"}</p>
            </div>
            <Badge className={`${style.badge} border-0`}>{TABLE_ZONES[zone]}</Badge>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleInternalPlaceBid}
            className="bg-mirzapur-gold hover:bg-mirzapur-bronze text-black whitespace-nowrap font-semibold"
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
