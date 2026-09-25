import Link from "next/link"
import PosterImage from "./poster-image"
import { CURRENT_EVENT } from "@/lib/event-content"

export default function HomeHero() {
  const [lineOne, lineTwo] = CURRENT_EVENT.teaserLine

  return (
    <section id="home" className="mirzapur-scope relative flex min-h-screen w-full items-center overflow-hidden">
      {/* Full-screen background image (lib/event-content.ts → heroBackground) */}
      <div className="absolute inset-0 z-0">
        <PosterImage
          src={CURRENT_EVENT.heroBackground}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_55%]"
        />
      </div>
      {/* Darken for legibility: stronger on the text side, fading to black at the bottom */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/75 via-black/65 to-black md:bg-gradient-to-r md:from-black/90 md:via-black/60 md:to-black/20" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-t from-black to-transparent" />
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="smoke-layer" />
      </div>

      <div className="container relative z-10 px-4 pb-16 pt-32 md:px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center md:mx-0 md:text-left">
          <p className="gold-reveal font-numeric text-[11px] tracking-[0.45em] text-mirzapur-gold/90 sm:text-xs">
            MERAKI ENTERTAINMENT PRESENTS
          </p>

          <div className="gold-reveal space-y-1" style={{ animationDelay: "0.2s" }}>
            <p className="font-display text-2xl font-normal tracking-[0.35em] text-mirzapur-red drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-3xl">
              XCLUSIVE
            </p>
            <p className="font-numeric text-[11px] tracking-[0.5em] text-red-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              SUPERCLUB | PUNE
            </p>
          </div>

          <h1
            className="gold-reveal font-poster text-6xl uppercase leading-[0.9] text-parchment sm:text-7xl lg:text-8xl"
            style={{ animationDelay: "0.4s" }}
          >
            {lineOne}
            <br />
            {lineTwo}
          </h1>

          <p
            className="gold-reveal font-numeric text-sm tracking-[0.2em] text-mirzapur-bone/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            style={{ animationDelay: "0.6s" }}
          >
            {CURRENT_EVENT.title.toUpperCase()} · <span className="text-mirzapur-gold">{CURRENT_EVENT.edition.toUpperCase()}</span>
          </p>

          <div
            className="gold-reveal flex flex-wrap items-center justify-center gap-3 md:justify-start"
            style={{ animationDelay: "0.8s" }}
          >
            <Link
              href="/bidding"
              className="bg-mirzapur-gold px-8 py-3.5 font-numeric text-sm font-bold tracking-[0.25em] text-black transition-colors hover:bg-mirzapur-bone"
            >
              ENTER THE PARTY
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
