"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface BidLoadingOverlayProps {
  isVisible: boolean
}

export default function BidLoadingOverlay({ isVisible }: BidLoadingOverlayProps) {
  const [dots, setDots] = useState("")

  // Animate the dots
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Animated King Character */}
        <div className="relative">
          <div className="animate-bounce">
            <Image
              src="/images/king-character.png"
              alt="King of Good Times"
              width={200}
              height={200}
              className="mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Golden glow effect around the character */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-400/20 via-transparent to-transparent rounded-full animate-pulse"></div>
        </div>

        {/* Loading text with animated dots */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gold-gradient">Placing Your Bid{dots}</h2>
          <p className="text-xl text-yellow-300 animate-pulse">The King is securing your table!</p>
        </div>

        {/* Animated loading bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Floating golden particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-orange-400 rounded-full animate-ping animation-delay-300"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping animation-delay-700"></div>
          <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-orange-300 rounded-full animate-ping animation-delay-1000"></div>
        </div>
      </div>
    </div>
  )
}
