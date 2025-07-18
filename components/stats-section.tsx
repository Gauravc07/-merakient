import Link from "next/link"

export default function StatsSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-background text-foreground">
      <div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-platinum-gradient leading-tight">
            MERAKI ENTERTAINMENT
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            The mastermind behind innovative and unforgettable event experiences. We transform visions into reality with
            unparalleled creativity and precision.
          </p>
          <Link
            href="/about-us"
            className="inline-flex items-center justify-center h-24 w-24 rounded-full border border-platinum text-white text-lg font-bold uppercase transition-colors hover:bg-platinum/10"
          >
            ABOUT US
            <span className="sr-only">About Us</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-5xl md:text-6xl font-bold text-platinum-gradient">30+</div>
            <p className="text-lg text-muted-foreground">Events Managed</p>
          </div>
          <div className="space-y-2">
            <div className="text-5xl md:text-6xl font-bold text-platinum-gradient">10K+</div>
            <p className="text-lg text-muted-foreground">Audience Reach</p>
          </div>
          <div className="space-y-2">
            <div className="text-5xl md:text-6xl font-bold text-platinum-gradient">30+</div>
            <p className="text-lg text-muted-foreground">Artists Collaborated</p>
          </div>
        </div>
      </div>
    </section>
  )
}
