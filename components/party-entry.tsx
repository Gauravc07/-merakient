"use client"

import { useMemo, useState } from "react"

const OPEN_MS = 1500

// Synthesised bass "dha-dha" heartbeat — no audio file needed. Only called from a click,
// since browsers block audio that isn't started by a user gesture.
function playHeartbeat() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const thump = (t: number, peak: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(120, t)
      osc.frequency.exponentialRampToValueAtTime(42, t + 0.2)
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(peak, t + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.42)
    }
    const start = ctx.currentTime + 0.02
    ;[0, 0.22, 0.85, 1.07].forEach((offset, i) => thump(start + offset, i % 2 === 0 ? 0.9 : 0.55))
    setTimeout(() => ctx.close(), 2500)
  } catch {
    // No audio support — the visual entry still works.
  }
}

interface PartyEntryProps {
  open: boolean
  onDone: () => void
}

export default function PartyEntry({ open, onDone }: PartyEntryProps) {
  const [opening, setOpening] = useState(false)

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${40 + Math.random() * 50}%`,
        size: 2 + Math.random() * 3,
        delay: `${Math.random() * 3}s`,
        duration: `${2.5 + Math.random() * 2.5}s`,
      })),
    [],
  )

  if (!open) return null

  const enter = () => {
    if (opening) return
    playHeartbeat()
    setOpening(true)
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    setTimeout(onDone, reduced ? 200 : OPEN_MS)
  }

  const curtainTransition = `transform ${OPEN_MS}ms cubic-bezier(0.7, 0, 0.3, 1)`

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden" role="dialog" aria-modal="true" aria-label="Enter the party">
      {/* Curtains — the page behind is revealed as they part */}
      <div
        className="velvet-curtain absolute inset-y-0 left-0 w-1/2 border-r border-mirzapur-gold/40"
        style={{ transform: opening ? "translateX(-102%)" : "translateX(0)", transition: curtainTransition }}
      />
      <div
        className="velvet-curtain absolute inset-y-0 right-0 w-1/2 border-l border-mirzapur-gold/40"
        style={{ transform: opening ? "translateX(102%)" : "translateX(0)", transition: curtainTransition }}
      />

      {/* Smoke + gold particles + title, fading out as the curtains open */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-500"
        style={{ opacity: opening ? 0 : 1 }}
      >
        <div className="smoke-layer" />
        {particles.map((p, i) => (
          <span
            key={i}
            className="gold-particle"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration }}
          />
        ))}

        <div className="relative space-y-4">
          <p className="gold-reveal font-numeric text-xs tracking-[0.5em] text-mirzapur-gold/80 sm:text-sm">THE BIDDING EDITION</p>
          <h1
            className="gold-reveal font-display text-4xl leading-tight text-mirzapur-gradient sm:text-6xl"
            style={{ animationDelay: "0.4s" }}
          >
            Bid for the Throne
          </h1>
          <p className="gold-reveal text-sm text-mirzapur-bone/80 sm:text-base" style={{ animationDelay: "0.9s" }}>
            Only one table gets the crown tonight.
          </p>
          <div className="gold-reveal pt-4" style={{ animationDelay: "1.3s" }}>
            <button
              type="button"
              autoFocus
              onClick={enter}
              className="rounded-full border border-mirzapur-gold bg-black/50 px-8 py-3 font-numeric text-sm font-semibold tracking-[0.3em] text-mirzapur-gold shadow-[0_0_30px_rgba(201,162,39,0.35)] transition hover:bg-mirzapur-gold hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-mirzapur-gold"
            >
              ENTER THE PARTY
            </button>
          </div>
          <p className="gold-reveal font-numeric text-[10px] tracking-[0.3em] text-mirzapur-bone/40" style={{ animationDelay: "1.6s" }}>
            PRESENTED BY MERAKI · XCLUSIVE CLUB &amp; KITCHEN
          </p>
        </div>
      </div>
    </div>
  )
}
