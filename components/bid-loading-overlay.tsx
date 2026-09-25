"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface BidLoadingOverlayProps {
  isVisible: boolean
}

export default function BidLoadingOverlay({ isVisible }: BidLoadingOverlayProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (!isVisible) return
    const interval = setInterval(() => setDots((prev) => (prev === "..." ? "" : prev + ".")), 400)
    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className="mirzapur-scope fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-6"
      role="status"
      aria-live="polite"
    >
      <div className="smoke-layer" />
      <div className="pointer-events-none absolute inset-0 spotlight-cone" />

      <div className="relative space-y-6 text-center">
        <div className="relative mx-auto flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
          {/* slow-spinning gold ring + glow behind the figure */}
          <div className="absolute inset-0 animate-[spin_6s_linear_infinite] rounded-full border border-dashed border-mirzapur-gold/40" />
          <div className="absolute inset-6 rounded-full bg-mirzapur-gold/15 blur-2xl" />
          {/* transparent cut-out (white background removed) — public/images/bid-overlay-figure.png */}
          <Image
            src="/images/bid-overlay-figure.png"
            alt=""
            width={536}
            height={672}
            priority
            className="relative h-60 w-auto animate-[bid-float_2.4s_ease-in-out_infinite] drop-shadow-[0_0_25px_rgba(201,162,39,0.45)] sm:h-72"
          />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-3xl text-mirzapur-gradient sm:text-4xl">
            <span className="relative">
              Bid lag rahi hai
              <span className="absolute left-full text-mirzapur-gold">{dots}</span>
            </span>
          </h2>
          <p className="text-sm text-mirzapur-bone/70 sm:text-base">Gaddi ki taraf ek kadam aur.</p>
        </div>

        <div className="mx-auto h-1 w-56 overflow-hidden rounded-full bg-mirzapur-gold/15">
          <div className="h-full w-1/3 animate-[bid-sweep_1.1s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-mirzapur-gold to-transparent" />
        </div>
      </div>
    </div>
  )
}
