"use client"

import { useState, useEffect } from "react"
import { supabase, type Table, type Bid } from "@/lib/supabase"

export function useRealtimeBidding() {
  const [tables, setTables] = useState<Table[]>([])
  const [recentBids, setRecentBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Log Supabase client status on mount
  useEffect(() => {
    if (!supabase) {
      console.warn(
        "⚠️ Supabase client is NOT initialized. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set correctly.",
      )
    } else {
      console.log("✅ Supabase client is initialized.")
    }
  }, [])

  // Fetch initial data
  useEffect(() => {
    fetchTables()
    fetchRecentBids()
  }, [])

  // Auto-refresh every 1 second for more responsive updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTables()
      fetchRecentBids()
    }, 1000) // Reduced to 1 second for faster updates

    return () => clearInterval(interval)
  }, [])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!supabase) return

    // Subscribe to table updates
    const tablesSubscription = supabase
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
          setTables((prev) => prev.map((table) => (table.id === payload.new.id ? { ...table, ...payload.new } : table)))
        },
      )
      .subscribe()

    // Subscribe to new bids
    const bidsSubscription = supabase
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
          setRecentBids((prev) => [payload.new as Bid, ...prev.slice(0, 19)])
          // Force refresh tables when new bid comes in
          fetchTables()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(tablesSubscription)
      supabase.removeChannel(bidsSubscription)
    }
  }, [])

  const fetchTables = async () => {
    try {
      const response = await fetch("/api/tables", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched tables:", data)

      if (data.tables && Array.isArray(data.tables)) {
        setTables(data.tables)
        setError(null)
      } else {
        console.warn("Invalid tables data:", data)
      }
    } catch (err) {
      console.error("Error fetching tables:", err)
      setError("Failed to fetch tables")
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentBids = async () => {
    try {
      const response = await fetch("/api/bids", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched bids:", data)

      if (data.bids && Array.isArray(data.bids)) {
        setRecentBids(data.bids)
      }
    } catch (err) {
      console.error("Error fetching bids:", err)
    }
  }

  const placeBid = async (tableId: string, bidAmount: number) => {
    try {
      const response = await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table_id: tableId,
          bid_amount: bidAmount,
        }),
      })

      const data = await response.json()
      console.log("Bid response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to place bid")
      }

      // Immediately refresh data after successful bid
      await Promise.all([fetchTables(), fetchRecentBids()])

      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to place bid"
      console.error("Bid error:", errorMessage)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  return {
    tables,
    recentBids,
    loading,
    error,
    placeBid,
    refetch: () => {
      fetchTables()
      fetchRecentBids()
    },
  }
}
