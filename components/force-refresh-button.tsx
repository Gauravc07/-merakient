"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useForceRefreshBidding } from "@/hooks/use-force-refresh-bidding"

export default function ForceRefreshButton() {
  const { forceRefresh, isRefreshing } = useForceRefreshBidding()

  return (
    <Button
      onClick={forceRefresh}
      disabled={isRefreshing}
      variant="outline"
      size="sm"
      className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
      {isRefreshing ? "Refreshing..." : "Force Refresh"}
    </Button>
  )
}
