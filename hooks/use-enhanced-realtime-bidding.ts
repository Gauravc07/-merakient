"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { supabase, type Table, type Bid } from "@/lib/supabase"

interface BidResult {
  success: boolean
  error?: string
  error_code?: string
  current_bid?: number
  minimum_bid?: number
  current_version?: number
}

export function useEnhancedRealtimeBidding() {
  const [tables, setTables] = useState<Table[]>([])
  const [recentBids, setRecentBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")

  const retryTimeoutRef = useRef<NodeJS.Timeout>()
  const maxRetries = 3
  const retryDelays = [1000, 3000, 5000] // Progressive delays

  // Fetch initial data with retry logic
  const fetchWithRetry = useCallback(async (url: string, retries = 0): Promise<any> => {
    try {
      const response = await fetch(url, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      if (retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelays[retries]))
        return fetchWithRetry(url, retries + 1)
      }
      throw err
    }
  }, [])

  const fetchTables = useCallback(async () => {
    try {
      const data = await fetchWithRetry("/api/tables")
      if (data.tables) {
        setTables(data.tables)
      }
    } catch (err) {
      setError("Failed to fetch tables")
      console.error("Error fetching tables:", err)
    }
  }, [fetchWithRetry])

  const fetchRecentBids = useCallback(async () => {
    try {
      const data = await fetchWithRetry("/api/bids")
      if (data.bids) {
        setRecentBids(data.bids)
      }
    } catch (err) {
      console.error("Error fetching bids:", err)
    }
  }, [fetchWithRetry])

  // Initial data fetch
  useEffect(() => {
    Promise.all([fetchTables(), fetchRecentBids()]).finally(() => setLoading(false))
  }, [fetchTables, fetchRecentBids])

  // Enhanced real-time subscriptions with reconnection logic
  useEffect(() => {
    let tablesChannel: any
    let bidsChannel: any
    let reconnectAttempts = 0
    const maxReconnectAttempts = 5

    const setupSubscriptions = () => {
      setConnectionStatus("connecting")

      // Subscribe to table updates
      tablesChannel = supabase
        .channel("tables-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "tables",
          },
          (payload) => {
            console.log("Table updated:", payload.new)
            setTables((prev) =>
              prev.map((table) => (table.id === payload.new.id ? { ...table, ...payload.new } : table)),
            )
          },
        )
        .on("system", {}, (payload) => {
          if (payload.type === "system" && payload.event === "phx_error") {
            console.error("Tables channel error:", payload)
            setConnectionStatus("disconnected")
          }
        })
        .subscribe((status) => {
          console.log("Tables subscription status:", status)
          if (status === "SUBSCRIBED") {
            setConnectionStatus("connected")
            reconnectAttempts = 0
          }
        })

      // Subscribe to new bids
      bidsChannel = supabase
        .channel("bids-changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "bids",
          },
          (payload) => {
            console.log("New bid:", payload.new)
            setRecentBids((prev) => [payload.new as Bid, ...prev.slice(0, 49)])
          },
        )
        .on("system", {}, (payload) => {
          if (payload.type === "system" && payload.event === "phx_error") {
            console.error("Bids channel error:", payload)
            setConnectionStatus("disconnected")
          }
        })
        .subscribe((status) => {
          console.log("Bids subscription status:", status)
        })
    }

    const handleReconnect = () => {
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++
        console.log(`Attempting to reconnect... (${reconnectAttempts}/${maxReconnectAttempts})`)

        retryTimeoutRef.current = setTimeout(() => {
          cleanup()
          setupSubscriptions()
        }, Math.pow(2, reconnectAttempts) * 1000) // Exponential backoff
      }
    }

    const cleanup = () => {
      if (tablesChannel) {
        supabase.removeChannel(tablesChannel)
      }
      if (bidsChannel) {
        supabase.removeChannel(bidsChannel)
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }

    setupSubscriptions()

    // Handle connection issues
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && connectionStatus === "disconnected") {
        handleReconnect()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      cleanup()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [connectionStatus])

  const placeBid = useCallback(
    async (tableId: string, bidAmount: number): Promise<BidResult> => {
      try {
        const table = tables.find((t) => t.id === tableId)
        const expectedVersion = table?.version

        const response = await fetch("/api/bids", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Session-ID": `${Date.now()}-${Math.random()}`,
          },
          body: JSON.stringify({
            table_id: tableId,
            bid_amount: bidAmount,
            expected_version: expectedVersion,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          return {
            success: false,
            error: data.error || "Failed to place bid",
            error_code: data.error_code,
            current_bid: data.current_bid,
            minimum_bid: data.minimum_bid,
            current_version: data.current_version,
          }
        }

        return { success: true, ...data }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Network error"
        return {
          success: false,
          error: errorMessage,
          error_code: "NETWORK_ERROR",
        }
      }
    },
    [tables],
  )

  const refetch = useCallback(() => {
    setError(null)
    setLoading(true)
    Promise.all([fetchTables(), fetchRecentBids()]).finally(() => setLoading(false))
  }, [fetchTables, fetchRecentBids])

  return {
    tables,
    recentBids,
    loading,
    error,
    connectionStatus,
    placeBid,
    refetch,
  }
}
