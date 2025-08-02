"use client"

import Image from "next/image"

const galleryItems = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  src: `/placeholder.svg?height=${200 + (i % 5) * 30}&width=${250 + (i % 4) * 40}`,
}))

export default function GlimpseIntoOurEvents() {
  return (
    <section id="glimpse-events" className="w-full py-12 md:py-16 lg:py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-platinum-gradient">
            A Glimpse Into Our Events
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Experience the grandeur and excitement of Meraki Entertainment's past creations.
          </p>
        </div>

        {/* Masonry-style layout */}
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-0 space-y-0">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="mb-0 break-inside-avoid overflow-hidden rounded-md shadow-sm border border-black-charcoal"
            >
              <Image
                src={item.src}
                alt={`Event image ${item.id}`}
                width={400}
                height={300}
                layout="responsive"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
