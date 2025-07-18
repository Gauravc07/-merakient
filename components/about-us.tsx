import Image from "next/image"

export default function AboutUs() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-section-alt">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gold-gradient">About Meraki Entertainment</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Meraki Entertainment, we believe in the art of creating extraordinary experiences. "Meraki" is a word
              that modern Greeks often use to describe what happens when you leave a piece of yourself (your soul,
              creativity, or love) in your work. When you put "meraki" into something, whatever it may be, you are doing
              it with passion, with absolute devotion.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This philosophy is at the heart of everything we do. From conceptualization to flawless execution, our
              dedicated team pours passion and precision into every detail, ensuring that each event is not just an
              occasion, but a cherished memory. We specialize in bespoke event planning, bringing elegance,
              sophistication, and a touch of magic to corporate events, private celebrations, and grand spectacles.
            </p>
          </div>
          <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-silver border border-black-charcoal">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1zEULmV0pgnGFbqdXt3Xv3YGzZnSI7.png"
              alt="Meraki Entertainment - Creative Vision"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
