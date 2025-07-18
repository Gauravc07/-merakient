import Image from "next/image"

const galleryImages = [
  { id: 1, src: "/placeholder.svg?height=400&width=600", alt: "Luxury Event Decor" },
  { id: 2, src: "/placeholder.svg?height=400&width=600", alt: "Live Music Performance" },
  { id: 3, src: "/placeholder.svg?height=400&width=600", alt: "Elegant Dining Setup" },
  { id: 4, src: "/placeholder.svg?height=400&width=600", alt: "Corporate Event Stage" },
  { id: 5, src: "/placeholder.svg?height=400&width=600", alt: "Wedding Reception Lights" },
  { id: 6, src: "/placeholder.svg?height=400&width=600", alt: "Fashion Show Runway" },
  { id: 7, src: "/placeholder.svg?height=400&width=600", alt: "Outdoor Festival Crowd" },
  { id: 8, src: "/placeholder.svg?height=400&width=600", alt: "Art Installation Exhibit" },
]

export default function GallerySection() {
  return (
    <section id="gallery" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-orange-gradient">Our Gallery</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A visual journey through the unforgettable moments we've created.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="relative group overflow-hidden rounded-lg shadow-orange border border-black-charcoal"
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                width={600}
                height={400}
                className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white-ash text-lg font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
