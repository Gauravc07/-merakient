"use client"

import { useEffect, useState } from "react"
import type { Bid } from "@/lib/supabase"

function timeAgo(iso: string, now: number): string {
  const s = Math.max(0, Math.round((now - Date.parse(iso)) / 1000))
  if (s < 5) return "just now"
  if (s < 60) return `${s} sec ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min ago`
  return `${Math.floor(m / 60)} hr ago`
}

interface BidTimelineProps {
  bids: Bid[]
  currentUser: string
}

export default function BidTimeline({ bids, currentUser }: BidTimelineProps) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="mirzapur-texture flex h-full flex-col rounded-2xl border border-mirzapur-gold/30 bg-black/60 p-4 sm:p-5">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg text-mirzapur-gradient">Bid History</h3>
        <span className="flex items-center gap-2 font-numeric text-[10px] tracking-[0.25em] text-mirzapur-bone/60">
          <span className="h-2 w-2 animate-pulse rounded-full bg-mirzapur-blood" /> LIVE · {bids.length}
        </span>
      </header>

      {bids.length === 0 ? (
        <p className="py-10 text-center text-sm text-mirzapur-bone/50">The party's warming up. The first bid sets the tone.</p>
      ) : (
        <ol className="relative max-h-[520px] space-y-3 overflow-y-auto overflow-x-hidden pl-5 pr-1">
          <span className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-mirzapur-gold/60 via-mirzapur-gold/20 to-transparent" />
          {bids.map((bid, i) => {
            const isMine = bid.username === currentUser
            return (
              // Keyed by id, so only newly-arrived bids mount and play the smoke-in animation.
              <li key={bid.id ?? `${bid.table_id}-${bid.bid_time}`} className="smoke-in relative">
                <span
                  className={`absolute -left-5 top-4 h-3 w-3 rounded-full border-2 border-black ${
                    i === 0 ? "bg-mirzapur-gold shadow-[0_0_12px_rgba(201,162,39,0.8)]" : "bg-mirzapur-gold/40"
                  }`}
                />
                <div
                  className={`rounded-xl border px-4 py-3 ${
                    i === 0 ? "border-mirzapur-gold/50 bg-mirzapur-gold/[0.07]" : "border-mirzapur-gold/15 bg-black/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-semibold text-mirzapur-bone">
                      👑 {bid.username}
                      {isMine && <span className="ml-1.5 text-emerald-400">(you)</span>}
                    </span>
                    <span className="shrink-0 font-numeric text-mirzapur-bone/50">{timeAgo(bid.bid_time, now)}</span>
                  </div>
                  <p className="mt-1 font-numeric text-2xl font-bold text-mirzapur-gold">
                    ₹{bid.bid_amount.toLocaleString("en-IN")}
                  </p>
                  <p className="font-numeric text-[11px] tracking-wider text-mirzapur-bone/50">Table {bid.table_id} · Xclusive</p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
