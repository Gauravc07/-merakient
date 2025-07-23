import Image from "next/image"

export default function HomeHero() {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col items-center justify-between bg-hero-gradient text-center overflow-hidden py-10"
    >
      {/* Mobile Image */}
      <div className="absolute inset-0 z-0 block md:hidden">
        {/* Background image */}
        <Image
          src="/images/makeitrain.jpeg"
          alt="Black panther with glowing eyes"
          fill
          quality={100}
          className="object-cover opacity-60 scale-[1.1]"
          priority
        />

        {/* Centered overlay image */}
        <div className="absolute inset-0 flex items-center justify-center">
  <p className="text-[#FFFF8f] italic text-xl">
    Money Talks. <br /> We Translate.
  </p>
</div>


      </div>

      {/* Tablet and Laptop Image */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image
          src="/images/kingfisher-plane-hero.png"
          alt="Alternate panther image"
          fill
          style={{ objectFit: "cover" }}
          quality={100}
          className="object-cover opacity-60 scale-[0.95]"
          priority
        />
      </div>

      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center justify-center flex-grow">
        {/* Reserved for future content */}
      </div>
      
      <div className="relative z-10 px-4 md:px-6 pb-10">
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
          MERAKI ENTERTAINMENT
        </h1>
      </div>
    </section>
  )
}
