import Link from "next/link"
import CountUp from "./count-up"

const STATS = [
  { to: 60, suffix: "+", label: "Events Managed" },
  { to: 30, suffix: "K+", label: "Audience Reach" },
  { to: 80, suffix: "+", label: "Artists Collaborated" },
]

export default function StatsSection() {
  return (
    <section className="mirzapur-scope w-full py-14 md:py-20">
      <div className="container grid items-center gap-12 px-4 md:px-6 lg:grid-cols-2">
        <div className="space-y-6 text-center lg:text-left">
          <h2 className="font-display text-4xl leading-tight text-mirzapur-gradient md:text-5xl">Meraki Entertainment</h2>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-mirzapur-bone/70 lg:mx-0">
            The mastermind behind innovative and unforgettable event experiences. We transform visions into reality with
            unparalleled creativity and precision.
          </p>
          <Link
            href="/about-us"
            className="inline-flex h-24 w-24 items-center justify-center rounded-full border border-mirzapur-gold/60 font-numeric text-sm font-bold tracking-[0.15em] text-mirzapur-gold shadow-[0_0_25px_rgba(201,162,39,0.15)] transition-colors hover:bg-mirzapur-gold/10"
          >
            ABOUT US
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="mirzapur-texture space-y-2 rounded-2xl border border-mirzapur-gold/25 bg-black/50 px-4 py-6">
              <div className="gold-glow font-numeric text-5xl font-bold text-mirzapur-gold md:text-6xl">
                <CountUp to={s.to} suffix={s.suffix} />
              </div>
              <p className="font-numeric text-xs uppercase tracking-[0.2em] text-mirzapur-bone/60">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
