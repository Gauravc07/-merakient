"use client"

import { useEffect, useState } from "react"
import { getTimeUntilEnd, getTimeUntilStart, isEventLive } from "@/utils/time-helpers"

export type BiddingPhase = "not-started" | "live" | "ended"

export interface BiddingClock {
  phase: BiddingPhase
  /** ms until start (not-started), until end (live), or 0 (ended) */
  countdown: number
  startsAt: string | null
  endsAt: string | null
}

export function useBiddingClock(tables: Array<{ bidding_starts_at: string; bidding_ends_at: string }>): BiddingClock {
  const startsAt = tables[0]?.bidding_starts_at ?? null
  const endsAt = tables[0]?.bidding_ends_at ?? null
  const [clock, setClock] = useState<Pick<BiddingClock, "phase" | "countdown">>({ phase: "not-started", countdown: 0 })

  useEffect(() => {
    if (!startsAt || !endsAt) return
    const tick = () => {
      if (isEventLive(startsAt, endsAt)) setClock({ phase: "live", countdown: getTimeUntilEnd(endsAt) })
      else if (getTimeUntilStart(startsAt) > 0) setClock({ phase: "not-started", countdown: getTimeUntilStart(startsAt) })
      else setClock({ phase: "ended", countdown: 0 })
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [startsAt, endsAt])

  return { ...clock, startsAt, endsAt }
}

/** 02:15 / 1:05:09 style clock, for the throne card and countdown numerals. */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const mm = String(m).padStart(2, "0")
  const ss = String(s).padStart(2, "0")
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
