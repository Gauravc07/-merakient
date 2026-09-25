"use client"

import type { BiddingClock } from "@/hooks/use-bidding-clock"

const formatISTClock = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true })

function splitClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60].map((n) => String(n).padStart(2, "0"))
}

export default function BiddingCountdown({ clock }: { clock: BiddingClock }) {
  const [h, m, s] = splitClock(clock.countdown)

  const heading =
    clock.phase === "live" ? "BIDDING IS LIVE" : clock.phase === "not-started" ? "BIDDING OPENS IN" : "BIDDING HAS ENDED"

  return (
    <section className="mb-6 rounded-2xl border border-mirzapur-gold/40 bg-black/60 px-4 py-5 text-center shadow-[0_0_40px_rgba(177,0,0,0.12)]">
      <div className="flex items-center justify-center gap-2 font-numeric text-xs tracking-[0.35em] text-mirzapur-gold sm:text-sm">
        {heading}
      </div>

      {clock.phase === "ended" ? (
        <p className="mt-3 text-sm text-mirzapur-bone/70">Bidding is closed. Winners — your escort awaits at the gate.</p>
      ) : (
        <div className="mt-3 flex items-end justify-center gap-2 sm:gap-3">
          {[
            [h, "HRS"],
            [m, "MIN"],
            [s, "SEC"],
          ].map(([value, unit], i) => (
            <div key={unit} className="flex items-end gap-2 sm:gap-3">
              {i > 0 && <span className="pb-6 font-numeric text-2xl text-mirzapur-gold/50 sm:text-3xl">:</span>}
              <div>
                <div className="min-w-[3.5rem] rounded-lg border border-mirzapur-gold/30 bg-gradient-to-b from-mirzapur-maroon/60 to-black px-2 py-2 font-numeric text-3xl font-bold tabular-nums text-mirzapur-gold sm:min-w-[4.5rem] sm:text-5xl">
                  {value}
                </div>
                <div className="mt-1 font-numeric text-[9px] tracking-[0.3em] text-mirzapur-bone/50">{unit}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {clock.startsAt && clock.endsAt && (
        <p className="mt-3 font-numeric text-[11px] tracking-wider text-mirzapur-gold/60">
          Bidding window: {formatISTClock(clock.startsAt)} – {formatISTClock(clock.endsAt)} IST
        </p>
      )}
    </section>
  )
}
