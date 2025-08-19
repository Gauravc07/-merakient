import Image from "next/image"

export default function BrandStorySection() {
  return (
    <section className="relative bg-black text-white py-16 md:py-24">
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black/80 z-10"></div>

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/gg90.jpg"
          alt="Meraki Entertainment Brand Story Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main heading */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider">
              MERAKI ENTERTAINMENT <br /><br />
            </h2>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-yellow-200">
              UNFORGETTABLE EXPERIENCES, THE MERAKI WAY
            </h3>
          </div>
        </div>
      </div>
    </section>
  )
}
