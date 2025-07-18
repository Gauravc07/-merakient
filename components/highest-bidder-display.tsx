"use client"

import { useMemo } from "react" // Use useMemo for optimization
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Loader2 } from "lucide-react"
import Image from "next/image"
import type { Table } from "@/lib/supabase" // Import Table type

interface HighestBidderDisplayProps {
  tables: Table[] // Now accepts tables as a prop
  loading: boolean // Now accepts loading as a prop
  error: string | null // Now accepts error as a prop
}

export default function HighestBidderDisplay({ tables, loading, error }: HighestBidderDisplayProps) {
  // Derive the highest bidder from the tables prop
  const highestBidder = useMemo(() => {
    if (!tables || tables.length === 0) return null
    return tables.reduce(
      (maxBidder, currentTable) => {
        if (currentTable.current_bid > (maxBidder?.current_bid || 0)) {
          return currentTable
        }
        return maxBidder
      },
      null as Table | null,
    )
  }, [tables])

  return (
    <Card className="bg-card-overlay border-black-charcoal mb-6 relative">
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <Image
          src="/images/kingfisher-plane.png"
          alt="Kingfisher Plane Background"
          fill
          style={{ objectFit: "cover" }}
          quality={100}
          className="opacity-10" // Adjust opacity to ensure text readability
        />
      </div>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Crown className="h-8 w-8 text-yellow-400" />
        </div>
        <CardTitle className="text-platinum-gradient text-center">Highest Bidder of the Day</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </div>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : highestBidder && highestBidder.current_bid !== null ? (
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-yellow-400">₹{highestBidder.current_bid.toLocaleString()}</p>
            <p className="text-lg text-foreground">
              by <span className="font-semibold">{highestBidder.highest_bidder_username || "Anonymous"}</span> on Table{" "}
              <span className="font-semibold">{highestBidder.id}</span>
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground text-center">No highest bidder yet. Place your bids!</p>
        )}
      </CardContent>
    </Card>
  )
}
