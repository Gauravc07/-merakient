"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import type { Table } from "@/lib/supabase"
import type { BiddingPhase } from "@/hooks/use-bidding-clock"

interface XclusiveTableLayoutProps {
  tables: Table[]
  selectedTable: string | null
  onTableSelect: (tableId: string) => void
  currentUser: string
  phase?: BiddingPhase
}

// ── Floor map geometry ────────────────────────────────────────────────────────────────
// Positions are measured from the Xclusive "TABLE LAYOUT" poster (902×1600) and mapped
// into a MAP_W × MAP_H canvas: x = (posterX − 40) × 0.7, y = (posterY − 415) × 0.7.
// The canvas is scaled down to fit narrower screens; tile sizes stay constant in it.
const MAP_W = 576
const MAP_H = 700
const BIDDABLE_SIZE = 56
const RESERVED_SIZE = 28

// Gold platforms (the poster's gold blocks): left, top, width, height
const PLATFORMS: Array<[number, number, number, number]> = [
  [27, 21, 154, 213], // left block (XC1–XC3)
  [182, 21, 220, 63], // DJ console bar
  [404, 21, 94, 213], // right block (XC4–XC6, T1)
  [502, 8, 70, 226], // Level 01 column (E1–E3)
  [457, 266, 101, 151], // bar
  [182, 508, 284, 185], // front row block (A1–A6, operations, T2–T3)
  [4, 581, 163, 112], // Xclusive Lounge (KC1–KC2)
  [468, 497, 91, 196], // balcony (B1–B3)
]

// Table centres on the map
const TABLE_POS: Record<string, [number, number]> = {
  XC3: [69, 66], XC2: [69, 129], XC1: [69, 195],
  XC4: [456, 58], XC5: [462, 129], XC6: [462, 201],
  T1: [419, 215],
  E1: [524, 58], E2: [524, 130], E3: [524, 202],
  F1: [110, 350], F2: [110, 391], F3: [110, 432],
  F4: [169, 350], F5: [169, 391],
  D1: [244, 256], D2: [244, 303], D3: [244, 350], D4: [244, 397], D5: [244, 445],
  D6: [348, 256], D7: [348, 303], D8: [348, 350], D9: [348, 397], D10: [348, 445],
  A1: [216, 541], A2: [314, 541], A3: [412, 541],
  A4: [216, 604], A5: [314, 604], A6: [412, 604],
  T2: [317, 672], T3: [388, 672],
  KC1: [41, 669], KC2: [125, 669],
  B1: [526, 533], B2: [526, 595], B3: [526, 659],
}

// Non-table poster details: framed decor squares and the entry marker
const DECOR_SQUARES: Array<[number, number]> = [
  [167, 220], // left block corner
  [169, 432], // floor-side cluster
]

function useFitScale(width: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setScale(Math.min(1, el.clientWidth / width))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [width])
  return { ref, scale }
}

const at = (x: number, y: number): CSSProperties => ({ left: x, top: y, transform: "translate(-50%, -50%)" })

function Label({ x, y, vertical = false, children, className = "" }: { x: number; y: number; vertical?: boolean; children: ReactNode; className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute whitespace-nowrap font-numeric text-[11px] font-semibold tracking-[0.2em] ${className}`}
      style={{ ...at(x, y), ...(vertical ? { writingMode: "vertical-rl", transform: "translate(-50%, -50%) rotate(180deg)" } : {}) }}
    >
      {children}
    </div>
  )
}

function Tile({
  id,
  tables,
  selectedTable,
  onTableSelect,
  currentUser,
  phase,
}: {
  id: string
  tables: Table[]
  selectedTable: string | null
  onTableSelect: (tableId: string) => void
  currentUser: string
  phase: BiddingPhase
}) {
  const [x, y] = TABLE_POS[id]
  const table = tables.find((t) => t.id === id)

  // Not returned by the API = not open for bidding → small, dimmed "reserved" tile.
  if (!table) {
    return (
      <div
        title={`${id} — reserved, not open for bidding`}
        className="absolute flex items-center justify-center rounded border border-violet-500/40 bg-violet-950/60 font-numeric text-[9px] text-violet-200/60"
        style={{ ...at(x, y), width: RESERVED_SIZE, height: RESERVED_SIZE }}
      >
        {id}
      </div>
    )
  }

  const hasBids = table.bid_count > 0
  const ended = phase === "ended"
  const clickable = phase === "live"
  const isSelected = selectedTable === id
  const isWinning = table.highest_bidder_username === currentUser
  const stateClass = ended
    ? "border-zinc-600 bg-zinc-800/80 text-zinc-400"
    : hasBids
      ? "border-red-500/80 bg-mirzapur-blood/60 text-mirzapur-bone shadow-[0_0_16px_rgba(220,38,38,0.45)]"
      : "border-mirzapur-gold bg-black/80 text-mirzapur-bone shadow-[0_0_14px_rgba(201,162,39,0.4)]"

  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => onTableSelect(id)}
      title={clickable ? `Bid on ${id}` : phase === "not-started" ? "Bidding hasn't started yet" : "Bidding has ended"}
      className={`absolute flex flex-col items-center justify-center rounded-md border font-numeric transition-[box-shadow,filter] duration-200 ${stateClass} ${
        clickable ? "hover:brightness-125" : "cursor-not-allowed"
      } ${isSelected ? "ring-2 ring-mirzapur-bone" : ""} ${isWinning ? "ring-2 ring-emerald-400" : ""}`}
      style={{ ...at(x, y), width: BIDDABLE_SIZE, height: BIDDABLE_SIZE }}
    >
      <span className="text-xs font-bold tracking-wide">{id}</span>
      <span className={`text-[10px] ${ended ? "" : "text-mirzapur-gold"}`}>
        {ended ? (hasBids ? "SOLD" : "UNSOLD") : `₹${(table.current_bid / 1000).toFixed(0)}k`}
      </span>
      {hasBids && !ended && <span className="absolute -left-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-red-500" />}
      {isWinning && (
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full border border-black bg-emerald-400" />
      )}
    </button>
  )
}

export default function XclusiveTableLayout({
  tables,
  selectedTable,
  onTableSelect,
  currentUser,
  phase = "live",
}: XclusiveTableLayoutProps) {
  const { ref, scale } = useFitScale(MAP_W)

  return (
    <div className="mirzapur-texture w-full space-y-4 overflow-hidden rounded-2xl border-2 border-mirzapur-gold/50 bg-mirzapur-panel p-3 shadow-2xl shadow-black/60 sm:p-4 md:p-6">
      <div className="text-center">
        <h3 className="font-display text-lg text-mirzapur-gradient sm:text-xl">The Royal Floor</h3>
        <p className="font-numeric text-[10px] tracking-[0.25em] text-mirzapur-bone/40">XCLUSIVE SUPERCLUB · TABLE LAYOUT</p>
      </div>

      {/* Measures available width; the map inside is scaled to fit it */}
      <div ref={ref} className="w-full">
        <div className="relative mx-auto" style={{ width: MAP_W * scale, height: MAP_H * scale }}>
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: MAP_W, height: MAP_H, transform: `scale(${scale})` }}>
            {PLATFORMS.map(([left, top, width, height], i) => (
              <div
                key={i}
                className="absolute rounded-sm border border-mirzapur-gold/40 bg-gradient-to-br from-mirzapur-gold/25 via-mirzapur-gold/15 to-mirzapur-bronze/20"
                style={{ left, top, width, height }}
              />
            ))}

            {/* front-row block dividers, as on the poster */}
            <div className="absolute h-px bg-mirzapur-gold/35" style={{ left: 182, top: 572, width: 284 }} />
            <div className="absolute h-px bg-mirzapur-gold/35" style={{ left: 182, top: 636, width: 284 }} />
            {/* bar divider */}
            <div className="absolute w-px bg-mirzapur-gold/35" style={{ left: 475, top: 266, height: 151 }} />

            {DECOR_SQUARES.map(([x, y], i) => (
              <div
                key={i}
                aria-hidden
                className="absolute border border-mirzapur-gold/50 bg-black/40 before:absolute before:inset-1 before:border before:border-mirzapur-gold/30"
                style={{ ...at(x, y), width: RESERVED_SIZE, height: RESERVED_SIZE }}
              />
            ))}

            <Label x={292} y={52} className="text-[13px] text-mirzapur-gold">DJ CONSOLE</Label>
            <Label x={555} y={130} vertical className="text-mirzapur-gold/80">LEVEL 01</Label>
            <Label x={35} y={385} vertical className="text-mirzapur-bone/70">DANCE FLOOR</Label>
            <Label x={296} y={343} vertical className="text-mirzapur-bone/70">DANCE FLOOR</Label>
            <Label x={517} y={342} vertical className="text-[15px] text-mirzapur-gold">BAR</Label>
            <Label x={538} y={458} className="text-[10px] text-mirzapur-bone/60">ENTRY ↘</Label>
            <Label x={484} y={595} vertical className="text-[10px] text-mirzapur-gold/80">BALCONY</Label>
            <Label x={85} y={606} className="text-center text-[10px] leading-tight text-mirzapur-gold">
              XCLUSIVE LOUNGE
              <br />
              <span className="text-[9px] text-mirzapur-gold/70">(KEY CLUB)</span>
            </Label>
            <div
              className="absolute flex items-center justify-center rounded-sm bg-black/70 font-numeric text-[9px] tracking-[0.15em] text-mirzapur-bone/70"
              style={{ ...at(222, 672), width: 76, height: 22 }}
            >
              OPERATIONS
            </div>

            {Object.keys(TABLE_POS).map((id) => (
              <Tile
                key={id}
                id={id}
                tables={tables}
                selectedTable={selectedTable}
                onTableSelect={onTableSelect}
                currentUser={currentUser}
                phase={phase}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 font-numeric text-[10px] text-mirzapur-bone/60 sm:text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-violet-500/50 bg-violet-950/60" /> Reserved
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Yours
        </span>
      </div>
    </div>
  )
}
