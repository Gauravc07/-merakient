"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { Gavel, MousePointerClick, Music, Sparkles, X } from "lucide-react"
import { BID_INCREMENT, TABLE_PRICES } from "@/lib/bidding-constants"
import { CURRENT_EVENT } from "@/lib/event-content"

const SLIDE_MS = 7000
const TAP_MAX_MS = 250

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`
const eventDateLong = new Date(`${CURRENT_EVENT.eventDate}T12:00:00+05:30`).toLocaleDateString("en-IN", {
  timeZone: "Asia/Kolkata",
  weekday: "long",
  day: "numeric",
  month: "long",
})

interface Slide {
  eyebrow: string
  title: string
  icon: ReactNode
  background: string
  body: ReactNode
}

// Edit slide copy here. The DJ name and event date come from lib/event-content.ts.
const SLIDES: Slide[] = [
  {
    eyebrow: "How to bid · 1/2",
    title: "PICK YOUR TABLE",
    icon: <MousePointerClick className="h-10 w-10" />,
    background: "radial-gradient(ellipse at 50% 20%, #5a0a0a 0%, #1a0202 60%, #0a0101 100%)",
    body: (
      <ul className="space-y-3">
        <li>Only the glowing tables are open for bidding: <b>XC1–XC6</b> near the DJ and <b>A1–A6</b> in the front row.</li>
        <li>
          XC1–XC6 &amp; A1–A3 start at <b>{inr(TABLE_PRICES.XC1)}</b>. A4–A6 start at <b>{inr(TABLE_PRICES.A4)}</b>.
        </li>
        <li>Tap a table, enter your amount, hit <b>Place Bid</b>.</li>
        <li>Every bid must be at least <b>{inr(BID_INCREMENT)}</b> above the current highest bid.</li>
      </ul>
    ),
  },
  {
    eyebrow: "How to bid · 2/2",
    title: "THE RULES OF THE GADDI",
    icon: <Gavel className="h-10 w-10" />,
    background: "radial-gradient(ellipse at 50% 20%, #3d2a05 0%, #140d02 60%, #0a0701 100%)",
    body: (
      <ul className="space-y-3">
        <li>Bidding is open only during the live window — watch the countdown at the top (IST).</li>
        <li>Whoever holds the highest bid when the clock hits zero takes the table.</li>
        <li>A <span className="text-emerald-400 font-semibold">green dot</span> means you're currently winning that table. Outbid? Just bid again.</li>
        <li>The bid amount is collected at the gate — bid accordingly. Winners get a dedicated escort to their table.</li>
      </ul>
    ),
  },
  {
    eyebrow: "On the decks",
    title: "DJ LINEUP",
    icon: <Music className="h-10 w-10" />,
    background: "radial-gradient(ellipse at 50% 20%, #2a0a3d 0%, #10031a 60%, #07010a 100%)",
    body: (
      <div className="space-y-3">
        <p className="font-display text-3xl tracking-wider text-mirzapur-gold">{CURRENT_EVENT.dj}</p>
        <p>
          Live at <b>{CURRENT_EVENT.title}</b>, {eventDateLong}, {CURRENT_EVENT.venue}.
        </p>
        <p className="text-mirzapur-bone/60">The XC tables sit right beside the DJ console — the best seats for the set.</p>
      </div>
    ),
  },
  {
    eyebrow: "Presented by Meraki",
    title: "WHY WE BID",
    icon: <Sparkles className="h-10 w-10" />,
    background: "radial-gradient(ellipse at 50% 20%, #4a1f00 0%, #1a0b00 60%, #0a0500 100%)",
    body: (
      <div className="space-y-3">
        <p>
          Meraki Entertainment introduced live table bidding so the best seats in the house go to the people who want
          them most.
        </p>
        <p>No reservation lists, no favourites — every bid is live, public and fair. The highest bid when the clock runs out wins.</p>
        <p className="font-display text-xl tracking-wider text-mirzapur-gold">Ab gaddi aapki. Bid karo.</p>
      </div>
    ),
  },
]

interface BiddingStoriesProps {
  open: boolean
  onClose: () => void
}

export default function BiddingStories({ open, onClose }: BiddingStoriesProps) {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const elapsedRef = useRef(0)
  const pointerDownAtRef = useRef(0)

  const goTo = useCallback(
    (next: number) => {
      elapsedRef.current = 0
      setProgress(0)
      if (next >= SLIDES.length) {
        onClose()
        return
      }
      setIndex(Math.max(0, next))
    },
    [onClose],
  )

  // Reset to the first slide each time the viewer opens.
  useEffect(() => {
    if (open) {
      elapsedRef.current = 0
      setIndex(0)
      setProgress(0)
      setPaused(false)
    }
  }, [open])

  // Timer — advances automatically; pauses while the user holds a finger/mouse down.
  useEffect(() => {
    if (!open || paused) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      elapsedRef.current += now - last
      last = now
      const p = Math.min(elapsedRef.current / SLIDE_MS, 1)
      setProgress(p)
      if (p >= 1) {
        goTo(index + 1)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [open, paused, index, goTo])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowRight") goTo(index + 1)
      else if (e.key === "ArrowLeft") goTo(index - 1)
    }
    window.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, index, goTo, onClose])

  if (!open) return null

  const slide = SLIDES[index]

  const handlePointerDown = () => {
    pointerDownAtRef.current = Date.now()
    setPaused(true)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setPaused(false)
    if (Date.now() - pointerDownAtRef.current > TAP_MAX_MS) return // was a hold-to-pause, not a tap
    const rect = e.currentTarget.getBoundingClientRect()
    goTo(e.clientX - rect.left < rect.width / 3 ? index - 1 : index + 1)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="How Xclusive bidding works"
        className="relative flex h-[100dvh] w-full select-none flex-col overflow-hidden text-mirzapur-bone sm:h-[88vh] sm:w-auto sm:aspect-[9/16] sm:rounded-2xl sm:border sm:border-mirzapur-gold/30"
        style={{ background: slide.background }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => setPaused(false)}
      >
        {/* Progress bars */}
        <div className="flex gap-1 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          {SLIDES.map((_, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full bg-mirzapur-gold"
                style={{ width: `${i < index ? 100 : i === index ? progress * 100 : 0}%` }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-3 pt-3">
          <div className="flex items-center gap-2">
            <img src="/images/meraki-logo.png" alt="" className="h-8 w-8 rounded-full border border-mirzapur-gold/50 bg-black object-contain p-0.5" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Meraki × Xclusive</div>
              <div className="text-[11px] text-mirzapur-bone/60">{paused ? "Paused" : "Live table bidding"}</div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={onClose}
            className="rounded-full p-2 text-mirzapur-bone/80 hover:bg-white/10 hover:text-mirzapur-bone"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Slide content */}
        <div key={index} className="flex flex-1 flex-col justify-center gap-5 px-6 pb-10 animate-in fade-in duration-300 sm:px-8">
          <div className="text-mirzapur-gold">{slide.icon}</div>
          <div className="text-xs uppercase tracking-[0.25em] text-mirzapur-gold/70">{slide.eyebrow}</div>
          <h2 className="font-display text-3xl leading-tight text-mirzapur-gradient sm:text-4xl">{slide.title}</h2>
          <div className="text-base leading-relaxed text-mirzapur-bone/90 sm:text-[17px]">{slide.body}</div>
        </div>

        <div className="pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-[11px] text-mirzapur-bone/40">
          Tap right for next · left for back · hold to pause
        </div>
      </div>
    </div>
  )
}
