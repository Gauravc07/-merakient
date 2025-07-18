"use client"

import { useState, useCallback } from "react"
import { useRealtimeBidding } from "./use-realtime-bidding"

export function useForceRefreshBidding() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { refetch } = useRealtimeBidding()

  const forceRefresh = useCallback(async () => {
    setIsRefreshing(true)

    try {
      // Clear any cached data
      if ("caches" in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      }

      // Force refetch data
      await refetch()

      // Small delay to ensure updates propagate
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error force refreshing:", error)
    } finally {
      setIsRefreshing(false)
    }
  }, [refetch])

  return { forceRefresh, isRefreshing }
}
