"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { supabase, type Table, type Bid } from "@/lib/supabase"

export interface BidResult {
  success: boolean
  error?: string
  error_code?: string
  current_bid?: number
  minimum_bid?: number
  current_version?: number
}

// Always-on safety-net poll — catches bids/updates even if Supabase Realtime replication
// isn't enabled for a table (a common gap on fresh projects) or a push is dropped.
// Real-time subscriptions are still the primary path and make most updates feel instant;
// this just guarantees correctness even when they silently don't fire.
const SAFETY_POLL_MS = 3000
const RETRY_DELAYS_MS = [500, 1500, 3000]
const FETCH_TIMEOUT_MS = 8000

function describeFetchError(err: unknown): string {
  // A bare "Failed to fetch" just means the browser couldn't reach the server at all
  // (dev server not running, no network, or a browser extension blocking the request) —
  // give a message that says that instead of a raw TypeError stack.
  if (err instanceof DOMException && err.name === "AbortError") return "Request timed out"
  if (err instanceof TypeError && err.message === "Failed to fetch") {
    return "Can't reach the server — check that it's running and you're online"
  }
  return err instanceof Error ? err.message : "Unknown error"
}

export function useRealtimeBidding() {
  const [tables, setTables] = useState<Table[]>([])
  const [recentBids, setRecentBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")

  const tablesRef = useRef<Table[]>([])
  tablesRef.current = tables
  const tablesInFlightRef = useRef(false)
  const bidsInFlightRef = useRef(false)

  const fetchWithRetry = useCallback(async (url: string, attempt = 0): Promise<any> => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    try {
      const response = await fetch(url, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
        signal: controller.signal,
      })
      if (!response.ok) {
        // Prefer the server's explanation (e.g. "Bidding is temporarily unavailable…") over a bare status code
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || `HTTP ${response.status}`)
      }
      return await response.json()
    } catch (err) {
      if (attempt < RETRY_DELAYS_MS.length) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]))
        return fetchWithRetry(url, attempt + 1)
      }
      throw err
    } finally {
      clearTimeout(timeout)
    }
  }, [])

  const fetchTables = useCallback(async () => {
    if (tablesInFlightRef.current) return // avoid piling up overlapping requests while one is slow/hung
    tablesInFlightRef.current = true
    try {
      const data = await fetchWithRetry("/api/tables")
      if (Array.isArray(data.tables)) {
        setTables(data.tables)
        setError(null)
      }
    } catch (err) {
      console.error("Error fetching tables:", describeFetchError(err))
      setError(describeFetchError(err))
    } finally {
      tablesInFlightRef.current = false
    }
  }, [fetchWithRetry])

  const fetchRecentBids = useCallback(async () => {
    if (bidsInFlightRef.current) return
    bidsInFlightRef.current = true
    try {
      const data = await fetchWithRetry("/api/bids")
      if (Array.isArray(data.bids)) setRecentBids(data.bids)
    } catch (err) {
      console.error("Error fetching bids:", describeFetchError(err))
    } finally {
      bidsInFlightRef.current = false
    }
  }, [fetchWithRetry])

  // Initial load
  useEffect(() => {
    Promise.all([fetchTables(), fetchRecentBids()]).finally(() => setLoading(false))
  }, [fetchTables, fetchRecentBids])

  // Realtime is the primary update path — near-instant instead of waiting on a poll tick.
  // Fallback polling only runs while the channel isn't SUBSCRIBED, so a healthy connection
  // has zero steady-state polling overhead.
  useEffect(() => {
    if (!supabase) {
      setConnectionStatus("disconnected")
      return
    }
    // Non-null copy so the nested callbacks below keep the narrowed type
    const client = supabase

    let reconnectAttempts = 0
    const maxReconnectAttempts = 5
    let reconnectTimeout: ReturnType<typeof setTimeout> | undefined
    let tablesChannel: ReturnType<typeof client.channel> | undefined
    let bidsChannel: ReturnType<typeof client.channel> | undefined

    const cleanup = () => {
      if (tablesChannel) client.removeChannel(tablesChannel)
      if (bidsChannel) client.removeChannel(bidsChannel)
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
    }

    const scheduleReconnect = () => {
      if (reconnectAttempts >= maxReconnectAttempts) return
      reconnectAttempts++
      reconnectTimeout = setTimeout(() => {
        cleanup()
        setupSubscriptions()
      }, Math.pow(2, reconnectAttempts) * 1000)
    }

    const setupSubscriptions = () => {
      setConnectionStatus("connecting")

      tablesChannel = client
        .channel("tables-changes")
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "tables" }, (payload) => {
          setTables((prev) => prev.map((t) => (t.id === payload.new.id ? { ...t, ...(payload.new as Table) } : t)))
        })
        .on("system", {}, (payload: any) => {
          if (payload?.event === "phx_error") {
            setConnectionStatus("disconnected")
            scheduleReconnect()
          }
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setConnectionStatus("connected")
            reconnectAttempts = 0
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            setConnectionStatus("disconnected")
            scheduleReconnect()
          }
        })

      bidsChannel = client
        .channel("bids-changes")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "bids" }, (payload) => {
          setRecentBids((prev) => [payload.new as Bid, ...prev.slice(0, 49)])
          // The bid RPC already updates `tables`, and the tables-changes subscription above
          // will pick that up — no need to force a fetch here (keeps this push-only/fast).
        })
        .subscribe()
    }

    setupSubscriptions()

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && connectionStatus === "disconnected") {
        reconnectAttempts = 0
        cleanup()
        setupSubscriptions()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      cleanup()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Safety-net poll — always runs (regardless of connection status) so a bid always shows
  // up within SAFETY_POLL_MS even if realtime pushes are silently not arriving.
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTables()
      fetchRecentBids()
    }, SAFETY_POLL_MS)
    return () => clearInterval(interval)
  }, [fetchTables, fetchRecentBids])

  const placeBid = useCallback(
    async (tableId: string, bidAmount: number): Promise<BidResult & { data?: any }> => {
      try {
        const table = tablesRef.current.find((t) => t.id === tableId)
        const response = await fetch("/api/bids", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Session-ID": `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          },
          body: JSON.stringify({
            table_id: tableId,
            bid_amount: bidAmount,
            expected_version: table?.version,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          // Version conflict: the table moved under us — refresh it immediately so the
          // dialog can show the new minimum instead of a stale one.
          if (data.error_code === "VERSION_CONFLICT" || data.error_code === "INSUFFICIENT_BID") {
            fetchTables()
          }
          return {
            success: false,
            error: data.error || "Failed to place bid",
            error_code: data.error_code,
            current_bid: data.current_bid,
            minimum_bid: data.minimum_bid,
            current_version: data.current_version,
          }
        }

        // Don't rely solely on the realtime push to reflect a successful bid — fetch
        // immediately so the table/activity feed update the instant the dialog closes.
        await Promise.all([fetchTables(), fetchRecentBids()])

        return { success: true, data }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Network error — please try again",
          error_code: "NETWORK_ERROR",
        }
      }
    },
    [fetchTables, fetchRecentBids],
  )

  const refetch = useCallback(() => {
    fetchTables()
    fetchRecentBids()
  }, [fetchTables, fetchRecentBids])

  return { tables, recentBids, loading, error, connectionStatus, placeBid, refetch }
}
