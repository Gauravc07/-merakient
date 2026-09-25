"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRealtimeBidding } from "@/hooks/use-realtime-bidding"
import { useBiddingClock } from "@/hooks/use-bidding-clock"
import { CirclePlay, Loader2, WifiOff } from "lucide-react"
import BidLoadingOverlay from "./bid-loading-overlay"
import BidDialog from "./bid-dialog"
import BiddingStories from "./bidding-stories"
import PartyEntry from "./party-entry"
import BiddingCountdown from "./bidding-countdown"
import MirzapurDialogues from "./mirzapur-dialogues"
import ThroneSpotlight from "./throne-spotlight"
import ThroneWinner from "./throne-winner"
import BidTimeline from "./bid-timeline"
import XclusiveTableLayout from "./xclusive-table-layout"

interface ProductionBiddingTableProps {
  currentUser?: string
  isSpectator?: boolean
}

// sessionStorage can throw (private mode, blocked storage) — treat that as "not seen".
function seen(key: string): boolean {
  try {
    return !!sessionStorage.getItem(key)
  } catch {
    return false
  }
}
function markSeen(key: string) {
  try {
    sessionStorage.setItem(key, "1")
  } catch {}
}

export default function ProductionBiddingTable({
  currentUser = "user1",
  isSpectator = false,
}: ProductionBiddingTableProps) {
  const { tables, recentBids, loading, error, connectionStatus, placeBid, refetch } = useRealtimeBidding()
  const clock = useBiddingClock(tables)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const [isPlacingBid, setIsPlacingBid] = useState(false)

  // Intro sequence, once per user per browser session (i.e. right after login):
  // curtain entry → stories. Refreshing the page doesn't replay it.
  const entryKey = `xclusive-entry-seen:${currentUser}`
  const storiesKey = `xclusive-stories-seen:${currentUser}`
  const winnerKey = `xclusive-winner-seen:${currentUser}`
  const [entryOpen, setEntryOpen] = useState(false)
  const [storiesOpen, setStoriesOpen] = useState(false)
  const [winnerOpen, setWinnerOpen] = useState(false)

  useEffect(() => {
    if (!seen(entryKey)) setEntryOpen(true)
    else if (!seen(storiesKey)) setStoriesOpen(true)
  }, [entryKey, storiesKey])

  const finishEntry = useCallback(() => {
    setEntryOpen(false)
    markSeen(entryKey)
    if (!seen(storiesKey)) setStoriesOpen(true)
  }, [entryKey, storiesKey])

  const closeStories = useCallback(() => {
    setStoriesOpen(false)
    markSeen(storiesKey)
  }, [storiesKey])

  // Winner moment: once bidding ends, show the crown to anyone holding a table.
  const wonTables = useMemo(
    () => (isSpectator ? [] : tables.filter((t) => t.bid_count > 0 && t.highest_bidder_username === currentUser)),
    [tables, currentUser, isSpectator],
  )
  useEffect(() => {
    if (clock.phase === "ended" && wonTables.length > 0 && !entryOpen && !storiesOpen && !seen(winnerKey)) {
      setWinnerOpen(true)
    }
  }, [clock.phase, wonTables.length, entryOpen, storiesOpen, winnerKey])

  const closeWinner = useCallback(() => {
    setWinnerOpen(false)
    markSeen(winnerKey)
  }, [winnerKey])

  const currentSelectedTableData = tables.find((t) => t.id === selectedTableId) ?? null

  const handlePlaceBid = async (tableId: string, bidAmount: number) => {
    if (isSpectator) {
      return { success: false, error: "You are in spectator mode and cannot place bids." }
    }
    if (isPlacingBid) {
      // Guard against double-submit (e.g. a double click) racing a second request.
      return { success: false, error: "A bid is already in progress." }
    }

    setIsPlacingBid(true)
    const result = await placeBid(tableId, bidAmount)

    if (result.success) {
      setSelectedTableId(null)
    }

    setIsPlacingBid(false)
    return result
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-mirzapur-gold" />
        <span className="ml-2 text-foreground">Loading bidding data...</span>
      </div>
    )
  }

  return (
    <>
      <PartyEntry open={entryOpen} onDone={finishEntry} />
      <BiddingStories open={storiesOpen} onClose={closeStories} />
      <ThroneWinner open={winnerOpen} username={currentUser} wonTables={wonTables} onClose={closeWinner} />
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

      <section className="mirzapur-scope w-full py-6 md:py-8 lg:py-12">
        <div className="container px-4 md:px-6">
          <header className="mb-8 space-y-3 text-center">
            <p className="font-numeric text-[10px] tracking-[0.45em] text-mirzapur-gold/70 sm:text-xs">
              THE PRINCE OF MIRZAPUR · XCLUSIVE SUPERCLUB | PUNE
            </p>
            <h2 className="font-display text-4xl leading-tight text-mirzapur-gradient sm:text-5xl md:text-6xl">
              The Bidding Edition
            </h2>
            <p className="text-sm text-mirzapur-bone/70 md:text-base">Bid for the throne. Only one table gets the crown tonight.</p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <img src="/images/meraki-logo.png" alt="Meraki Logo" className="h-9 w-auto opacity-80 md:h-11" />
              <span className="font-numeric text-xs tracking-wider text-mirzapur-gold/60">presented by Meraki</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setStoriesOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-mirzapur-gold/40 bg-black/40 px-4 py-1.5 font-numeric text-xs text-mirzapur-gold hover:bg-mirzapur-gold/10"
              >
                <CirclePlay className="h-4 w-4" /> How it works
              </button>
              {connectionStatus === "disconnected" && (
                <span className="inline-flex items-center gap-2 rounded-full border border-mirzapur-blood/60 bg-mirzapur-blood/10 px-3 py-1 text-xs text-mirzapur-bone">
                  <WifiOff className="h-3 w-3" /> Reconnecting to live updates...
                </span>
              )}
            </div>
          </header>

          {error && (
            <div className="mb-6 flex items-center justify-center gap-3 rounded-lg border border-mirzapur-blood/50 bg-mirzapur-blood/10 p-3 text-center text-sm text-mirzapur-bone">
              <span>{error}</span>
              <Button size="sm" variant="outline" onClick={refetch} className="border-mirzapur-gold/40 text-mirzapur-gold">
                Retry
              </Button>
            </div>
          )}

          <BiddingCountdown clock={clock} />
          {clock.phase === "live" && <MirzapurDialogues />}
          <ThroneSpotlight tables={tables} clock={clock} onBid={setSelectedTableId} canBid={!isSpectator} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr] lg:gap-8">
            <XclusiveTableLayout
              tables={tables}
              selectedTable={selectedTableId}
              onTableSelect={setSelectedTableId}
              currentUser={currentUser}
              phase={clock.phase}
            />
            <BidTimeline bids={recentBids} currentUser={currentUser} />
          </div>
        </div>
      </section>
    </>
  )
}
