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
          src="/images/concert2.jpg"
          alt="Black panther with glowing eyes"
          fill
          quality={100}
          className="object-cover opacity-60 scale-[1.1]"
          priority
        />

        {/* Centered overlay image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[#FFFF8f] text-center drop-shadow-lg">
            <p className="text-3xl md:text-4xl font-playfair font-semibold uppercase leading-tight tracking-wide">
              MONEY
            </p>
            <p className="text-4xl md:text-5xl italic font-script leading-tight -mt-1">Talks.</p>
            <p className="text-3xl md:text-4xl font-playfair font-semibold uppercase leading-tight tracking-wide -mt-1">
              WE TRANSLATE.
            </p>
          </div>
        </div>


      </div>

      {/* Tablet and Laptop Image */}
      <div className="absolute inset-0 z-0 hidden md:block">
  <Image
    src="/images/concert.jpg"
    alt="Alternate panther image"
    fill
    className="object-cover w-full h-full"
    priority
  />
</div>


      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center justify-center flex-grow">
        {/* Reserved for future content */}
      </div>
      
      <div className="relative z-10 px-4 md:px-6 pb-10">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white-300 leading-tight">
          MERAKI <br />ENTERTAINMENT
        </h1>
      </div>
    </section>
  )
}
