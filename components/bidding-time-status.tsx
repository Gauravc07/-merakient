"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar, AlertCircle } from "lucide-react"
import { formatTimeRemaining, isEventLive, getTimeUntilStart, getTimeUntilEnd, getISTTime } from "@/utils/time-helpers"

interface BiddingTimeStatusProps {
  tables: Array<{
    bidding_starts_at: string
    bidding_ends_at: string
  }>
}

export default function BiddingTimeStatus({ tables }: BiddingTimeStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [eventStatus, setEventStatus] = useState<"not-started" | "live" | "ended">("not-started")

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate event status and time remaining
  useEffect(() => {
    if (tables.length === 0) {
      console.log("BiddingTimeStatus: No tables data yet.")
      return
    }

    const firstTable = tables[0]
    const startsAt = firstTable.bidding_starts_at
    const endsAt = firstTable.bidding_ends_at

    const nowIST = getISTTime() // Get current time in IST for comparison
    const startUTC = new Date(startsAt) // Parse DB start time (it's UTC)
    const endUTC = new Date(endsAt) // Parse DB end time (it's UTC)

    console.log("--- BiddingTimeStatus Debug ---")
    console.log("Current Time (Browser Local):", currentTime.toLocaleString())
    console.log("Current Time (IST from helper):", nowIST.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))
    console.log("Starts At (from DB, UTC):", startsAt, "->", startUTC.toLocaleString())
    console.log("Ends At (from DB, UTC):", endsAt, "->", endUTC.toLocaleString())
    console.log("Comparison: nowIST.getTime() >= startUTC.getTime()", nowIST.getTime() >= startUTC.getTime())
    console.log("Comparison: nowIST.getTime() <= endUTC.getTime()", nowIST.getTime() <= endUTC.getTime())

    let newEventStatus: "not-started" | "live" | "ended" = "not-started"
    let newTimeRemaining = 0

    if (isEventLive(startsAt, endsAt)) {
      newEventStatus = "live"
      newTimeRemaining = getTimeUntilEnd(endsAt)
      console.log("Event Status: LIVE")
    } else if (getTimeUntilStart(startsAt) > 0) {
      newEventStatus = "not-started"
      newTimeRemaining = getTimeUntilStart(startsAt)
      console.log("Event Status: NOT STARTED")
    } else {
      newEventStatus = "ended"
      newTimeRemaining = 0
      console.log("Event Status: ENDED")
    }

    setEventStatus(newEventStatus)
    setTimeRemaining(newTimeRemaining)

    console.log("Time Remaining:", formatTimeRemaining(timeRemaining))
    console.log("-----------------------------")
  }, [currentTime, tables])

  if (tables.length === 0) {
    return (
      <div className="bg-black border-2 border-yellow-500 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-yellow-400">
          <Clock className="h-5 w-5" />
          <span>Loading event schedule...</span>
        </div>
      </div>
    )
  }

  const firstTable = tables[0]
  const getStatusConfig = () => {
    switch (eventStatus) {
      case "live":
        return {
          icon: <Clock className="h-5 w-5 text-yellow-400" />,
          title: "🔴 LIVE BIDDING",
          subtitle: `Event ends in: ${formatTimeRemaining(timeRemaining)}`,
          description: "Bidding is currently active! Place your bids now.",
          pulseClass: "animate-pulse",
        }
      case "not-started":
        return {
          icon: <Calendar className="h-5 w-5 text-yellow-400" />,
          title: "⏰ BIDDING STARTS SOON",
          subtitle: `Starts in: ${formatTimeRemaining(timeRemaining)}`,
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
      {/* Added for debugging: Display raw times */}
      {/* <div className="mt-4 text-xs text-gray-500 text-center">
        <p>DB Start: {firstTable.bidding_starts_at}</p>
        <p>DB End: {firstTable.bidding_ends_at}</p>
      </div> */}
    </div>
  )
}
