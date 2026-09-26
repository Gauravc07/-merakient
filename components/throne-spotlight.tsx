"use client"

import { useMemo } from "react"
import { Crown } from "lucide-react"
import type { Table } from "@/lib/supabase"
import { TABLE_ZONES, type TableZone } from "@/lib/bidding-constants"
import type { BiddingClock } from "@/hooks/use-bidding-clock"

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`

interface ThroneSpotlightProps {
  tables: Table[]
  clock: BiddingClock
  onBid: (tableId: string) => void
  canBid: boolean
}

export default function ThroneSpotlight({ tables, clock, onBid, canBid }: ThroneSpotlightProps) {
  // The throne is the single highest real bid across all tables. Tables with no bids
  // yet don't count, otherwise the highest *opening* price would look like a winner.
  const throne = useMemo(() => {
    const bidOn = tables.filter((t) => t.bid_count > 0 && t.highest_bidder_username)
    if (bidOn.length === 0) return null
    return bidOn.reduce((max, t) => (t.current_bid > max.current_bid ? t : max))
  }, [tables])

  const lowestOpening = useMemo(() => (tables.length ? Math.min(...tables.map((t) => t.base_price)) : null), [tables])

  return (
    <section className="mirzapur-texture relative mb-5 overflow-hidden rounded-2xl border border-mirzapur-gold/40 bg-black/60 px-4 py-3.5 text-center shadow-[0_0_60px_rgba(201,162,39,0.08)] sm:px-6 sm:py-5">
      <div className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-2/3 rounded-full bg-mirzapur-gold/10 blur-3xl" />

      <div className="relative flex items-center justify-center gap-2 font-numeric text-[11px] tracking-[0.35em] text-mirzapur-gold/80">
        <Crown className="h-4 w-4" /> {clock.phase === "ended" ? "THE THRONE IS CLAIMED" : "THE THRONE"}
      </div>

      {throne ? (
        <div className="relative mt-2 space-y-3">
          <p className="font-numeric text-[11px] tracking-[0.25em] text-mirzapur-bone/60">
            TABLE {throne.id} · {TABLE_ZONES[throne.category as TableZone]?.toUpperCase()}
          </p>
          <p className="gold-glow font-numeric text-4xl font-bold text-mirzapur-gold sm:text-5xl">{inr(throne.current_bid)}</p>

          <dl className="mx-auto max-w-xs">
            <Stat label="Highest bidder" value={`👑 ${throne.highest_bidder_username}`} />
          </dl>

          {canBid && clock.phase === "live" && (
            <button
              type="button"
              onClick={() => onBid(throne.id)}
              className="rounded-full bg-mirzapur-gold px-6 py-2 font-numeric text-xs font-bold tracking-[0.2em] text-black shadow-[0_0_25px_rgba(201,162,39,0.4)] transition hover:bg-mirzapur-bone active:scale-95 sm:text-sm"
            >
              CLAIM THE THRONE
            </button>
          )}
        </div>
      ) : (
        <div className="relative mt-2 space-y-1.5">
          <p className="font-display text-lg leading-snug tracking-wide text-mirzapur-bone sm:text-xl">Abhi toh Mirzapur ki gaddi khaali hai</p>
          <p className="text-xs text-mirzapur-bone/60 sm:text-sm">
            No bids yet. Be the first to claim a table
            {lowestOpening ? ` — bidding opens at ${inr(lowestOpening)}` : ""}.
          </p>
        </div>
      )}
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-mirzapur-gold/20 bg-black/40 px-2 py-2">
      <dt className="font-numeric text-[9px] uppercase tracking-[0.2em] text-mirzapur-bone/50 sm:text-[10px]">{label}</dt>
      <dd className="mt-1 truncate font-numeric text-sm font-semibold text-mirzapur-bone sm:text-base">{value}</dd>
    </div>
  )
}
