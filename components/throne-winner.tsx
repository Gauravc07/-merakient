"use client"

import { useEffect, useMemo } from "react"
import { Crown } from "lucide-react"
import type { Table } from "@/lib/supabase"

const GOLDS = ["#C9A227", "#EDD18A", "#F59E0B", "#FFF1C1", "#B8860B"]

interface ThroneWinnerProps {
  open: boolean
  username: string
  wonTables: Table[]
  onClose: () => void
}

export default function ThroneWinner({ open, username, wonTables, onClose }: ThroneWinnerProps) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        color: GOLDS[i % GOLDS.length],
        delay: `${Math.random() * 2.5}s`,
        duration: `${3 + Math.random() * 3}s`,
        width: 5 + Math.random() * 6,
        height: 8 + Math.random() * 10,
      })),
    [],
  )
  const bubbles = useMemo(
    () =>
      Array.from({ length: 24 }, () => ({
        left: `${10 + Math.random() * 80}%`,
        size: 4 + Math.random() * 8,
        delay: `${Math.random() * 4}s`,
        duration: `${4 + Math.random() * 4}s`,
      })),
    [],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const total = wonTables.reduce((sum, t) => sum + t.current_bid, 0)

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center overflow-hidden bg-black/90 px-6"
      role="dialog"
      aria-modal="true"
      aria-label="You won the throne"
    >
      <div className="pointer-events-none absolute inset-0 spotlight-cone" />
      {bubbles.map((b, i) => (
        <span
          key={`b${i}`}
          className="bubble-rise"
          style={{ left: b.left, width: b.size, height: b.size, animationDelay: b.delay, animationDuration: b.duration }}
        />
      ))}
      {confetti.map((c, i) => (
        <span
          key={`c${i}`}
          className="confetti-piece"
          style={{
            left: c.left,
            width: c.width,
            height: c.height,
            background: c.color,
            animationDelay: c.delay,
            animationDuration: c.duration,
          }}
        />
      ))}

      <div className="relative max-w-md space-y-5 text-center">
        <Crown className="crown-drop mx-auto h-20 w-20 text-mirzapur-gold drop-shadow-[0_0_25px_rgba(201,162,39,0.8)]" />
        <h2 className="gold-reveal font-display text-4xl leading-tight text-mirzapur-gradient sm:text-5xl" style={{ animationDelay: "0.8s" }}>
          The Throne is Yours
        </h2>
        <p className="gold-reveal text-mirzapur-bone/80" style={{ animationDelay: "1.1s" }}>
          Congratulations, <span className="font-semibold text-mirzapur-bone">{username}</span>. Tonight, the whole party bows to you.
        </p>

        <ul className="gold-reveal space-y-2" style={{ animationDelay: "1.4s" }}>
          {wonTables.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between rounded-lg border border-mirzapur-gold/40 bg-black/50 px-4 py-2 font-numeric"
            >
              <span className="text-mirzapur-bone">Table {t.id}</span>
              <span className="font-bold text-mirzapur-gold">₹{t.current_bid.toLocaleString("en-IN")}</span>
            </li>
          ))}
        </ul>
        {wonTables.length > 1 && (
          <p className="font-numeric text-sm text-mirzapur-bone/70">Total: ₹{total.toLocaleString("en-IN")}</p>
        )}

        <p className="gold-reveal text-xs text-mirzapur-bone/60" style={{ animationDelay: "1.7s" }}>
          Pay at the gate — a dedicated escort will take you to your table.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="gold-reveal rounded-full bg-mirzapur-gold px-8 py-3 font-numeric text-sm font-bold tracking-[0.25em] text-black transition hover:bg-mirzapur-bone"
          style={{ animationDelay: "2s" }}
        >
          TAKE YOUR SEAT
        </button>
      </div>
    </div>
  )
}
