"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar, AlertCircle } from "lucide-react"
import {
  formatTimeRemaining,
  isEventLive,
  getTimeUntilStart,
  getTimeUntilEnd,
  getISTTime,
} from "@/utils/time-helpers"

interface BiddingTimeStatusProps {
  tables: Array<{
    bidding_starts_at: string
    bidding_ends_at: string
  }>
}

export default function BiddingTimeStatus({ tables }: BiddingTimeStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [eventStatus, setEventStatus] = useState<"not-started" | "live" | "ended">("not-started")
  const [customLiveCountdown, setCustomLiveCountdown] = useState<number>(0)
  const [liveStartTime, setLiveStartTime] = useState<Date | null>(null)

  // Timer tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())

      // When in LIVE mode, count down from 1:05:00
      if (eventStatus === "live" && liveStartTime) {
        const elapsed = new Date().getTime() - liveStartTime.getTime()
        const remaining = 65 * 60 * 1000 - elapsed // 1 hr 5 min in ms
        setCustomLiveCountdown(Math.max(remaining, 0))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [eventStatus, liveStartTime])

  // Initial event state
  useEffect(() => {
    if (tables.length === 0) return

    const firstTable = tables[0]
    const startsAt = firstTable.bidding_starts_at
    const endsAt = firstTable.bidding_ends_at

    const nowIST = getISTTime()

    let newStatus: "not-started" | "live" | "ended" = "not-started"

    if (isEventLive(startsAt, endsAt)) {
      newStatus = "live"
      // Set live start time ONCE
      if (!liveStartTime) {
        setLiveStartTime(nowIST)
        setCustomLiveCountdown(65 * 60 * 1000) // Reset to 1:05:00
      }
    } else if (getTimeUntilStart(startsAt) > 0) {
      newStatus = "not-started"
      setLiveStartTime(null)
      setCustomLiveCountdown(0)
    } else {
      newStatus = "ended"
      setLiveStartTime(null)
      setCustomLiveCountdown(0)
    }

    setEventStatus(newStatus)
  }, [currentTime, tables, liveStartTime])

  const getStatusConfig = () => {
    switch (eventStatus) {
      case "live":
        return {
          icon: <Clock className="h-5 w-5 text-yellow-400" />,
          title: "🔴 LIVE BIDDING",
          subtitle: `Time remaining: ${formatTimeRemaining(customLiveCountdown)}`,
          description: "Bidding is currently active! Place your bids now.",
          pulseClass: "animate-pulse",
        }
      case "not-started":
        const startIn = getTimeUntilStart(tables[0].bidding_starts_at)
        return {
          icon: <Calendar className="h-5 w-5 text-yellow-400" />,
          title: "⏰ BIDDING STARTS SOON",
          subtitle: `Starts in: ${formatTimeRemaining(startIn)}`,
          description: "Get ready! Bidding will begin shortly.",
          pulseClass: "",
        }
      case "ended":
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
          title: "🏁 BIDDING ENDED",
          subtitle: "Event has concluded",
          description: "Thank you for participating! Results will be announced soon.",
          pulseClass: "",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div
      className={`bg-black border-2 border-yellow-500 rounded-lg p-4 mb-6 shadow-lg shadow-yellow-500/20 ${config.pulseClass}`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-3">
          {config.icon}
          <h3 className="font-bold text-lg text-yellow-400">{config.title}</h3>
        </div>
        <p className="text-2xl font-bold text-yellow-300 mt-2">{config.subtitle}</p>
      </div>
      <div className="mt-2 text-sm text-yellow-200 text-center">{config.description}</div>
    </div>
  )
}
