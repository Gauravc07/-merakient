import Image from "next/image"

export default function BrandStorySection() {
  return (
    <section className="relative overflow-hidden bg-black py-20 text-white md:py-28">
      <div className="absolute inset-0">
        <Image src="/images/gg90.jpg" alt="" fill className="object-cover" />
      </div>
      {/* crimson velvet grade over the photo so the gold text stays readable */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/90 via-mirzapur-maroon/75 to-black/95" />
      <div className="pointer-events-none absolute inset-0 z-10 spotlight-cone" />

      <div className="container relative z-20 mx-auto px-4">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h2 className="font-display text-3xl tracking-wide text-mirzapur-gradient md:text-4xl lg:text-5xl">
            Meraki Entertainment
          </h2>
          <p className="font-numeric text-sm tracking-[0.35em] text-mirzapur-gold/80 md:text-base">
            UNFORGETTABLE EXPERIENCES, THE MERAKI WAY
          </p>
          <p className="font-display text-xl italic text-mirzapur-bone/85 md:text-2xl">
            “Party sabke liye hai… takht sirf ek ka.”
          </p>
        </div>
      </div>
    </section>
  )
}
