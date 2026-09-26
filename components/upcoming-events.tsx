"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, Crown, Music } from "lucide-react"
import type { Table } from "@/lib/supabase"
import { useBiddingClock } from "@/hooks/use-bidding-clock"
import GaddiThrone from "./gaddi-throne"
import PosterImage from "./poster-image"
import { CURRENT_EVENT as EVENT } from "@/lib/event-content"

const IST = "Asia/Kolkata"
const istDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { timeZone: IST, weekday: "short", day: "numeric", month: "short" }).toUpperCase()
const istTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", { timeZone: IST, hour: "numeric", minute: "2-digit", hour12: true })
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`

export default function UpcomingEvents() {
  const [tables, setTables] = useState<Table[]>([])
  const clock = useBiddingClock(tables)

  useEffect(() => {
    let cancelled = false
    fetch("/api/tables", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => !cancelled && setTables(Array.isArray(data.tables) ? data.tables : []))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const minPrice = tables.length ? Math.min(...tables.map((t) => t.base_price)) : null
  const ended = clock.phase === "ended"

  return (
    <section id="upcoming-events" className="mirzapur-scope w-full py-14 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-10 space-y-3 text-center">
          <p className="font-numeric text-xs tracking-[0.4em] text-mirzapur-gold/70">MERAKI PRESENTS</p>
          <h2 className="font-display text-4xl text-mirzapur-gradient md:text-5xl">Upcoming Event</h2>
        </div>

        <article className="mirzapur-texture mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-mirzapur-gold/40 bg-black/60 shadow-[0_0_60px_rgba(177,0,0,0.15)] md:grid-cols-2">
          {/* Visual: the event poster. The velvet + throne underneath shows if the poster file is missing. */}
          {/* Poster proportions (1092×1440) at every size, so its printed title at the bottom is never cropped */}
          <div className="velvet-curtain relative flex aspect-[91/120] flex-col items-center justify-center gap-4 overflow-hidden">
            <div className="smoke-layer" />
            <GaddiThrone className="relative h-40 w-40 md:h-52 md:w-52" />
            <PosterImage
              src={EVENT.eventPoster}
              alt={`${EVENT.title} — ${EVENT.edition} poster`}
              fill
              sizes="(min-width: 768px) 32rem, 100vw"
              className="object-cover object-top"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center gap-5 p-6 text-center md:p-10 md:text-left">
            <p className="text-mirzapur-bone/75">{EVENT.tagline}</p>

            <ul className="space-y-2 font-numeric text-sm text-mirzapur-bone/85">
              <li className="flex items-center justify-center gap-2 md:justify-start">
                <MapPin className="h-4 w-4 text-mirzapur-gold" /> {EVENT.venue}
              </li>
              <li className="flex items-center justify-center gap-2 md:justify-start">
                <CalendarDays className="h-4 w-4 text-mirzapur-gold" />
                {istDate(`${EVENT.eventDate}T12:00:00+05:30`)}
              </li>
              <li className="flex items-center justify-center gap-2 md:justify-start">
                <Music className="h-4 w-4 text-mirzapur-gold" /> {EVENT.dj}
              </li>
              {clock.startsAt && clock.endsAt && (
                <li className="flex items-center justify-center gap-2 md:justify-start">
                  <Clock className="h-4 w-4 text-mirzapur-gold" />
                  Table bidding {istDate(clock.startsAt)}, {istTime(clock.startsAt)} – {istTime(clock.endsAt)} IST
                </li>
              )}
              {minPrice !== null && (
                <li className="flex items-center justify-center gap-2 md:justify-start">
                  <Crown className="h-4 w-4 text-mirzapur-gold" />
                  {tables.length} VIP tables · bids from {inr(minPrice)}
                </li>
              )}
            </ul>

            <Link
              href="/bidding"
              className="mx-auto inline-flex w-full max-w-xs items-center justify-center rounded-full bg-mirzapur-gold px-6 py-3 font-numeric text-sm font-bold tracking-[0.25em] text-black shadow-[0_0_25px_rgba(201,162,39,0.35)] transition hover:bg-mirzapur-bone active:scale-95 md:mx-0"
            >
              {ended ? "SEE THE THRONE" : "BID TABLE TODAY"}
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}
