import Image from "next/image"

export default function HomeHero() {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col items-center justify-between bg-hero-gradient text-center overflow-hidden py-10"
    >
      <Image
        src="/images/kingfisher-plane-hero.png"
        alt="Black panther with glowing eyes"
        fill
        style={{ objectFit: "cover" }}
        quality={100}
        className="absolute inset-0 z-0 opacity-60"
      />
      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center justify-center flex-grow">
        {/* This div can hold other content if needed in the future, currently empty to center the text at the bottom */}
      </div>
      <div className="relative z-10 px-4 md:px-6 pb-10">
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gold-gradient leading-tight">
          MERAKI ENTERTAINMENT
        </h1>
      </div>
    </section>
  )
}
