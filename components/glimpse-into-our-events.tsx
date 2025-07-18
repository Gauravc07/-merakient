import Image from "next/image"

const galleryItems = [
  { id: 1, type: "image", src: "/placeholder.svg?height=300&width=450", span: "col-span-2" },
  { id: 2, type: "image", src: "/placeholder.svg?height=200&width=200", span: "" },
  { id: 3, type: "image", src: "/placeholder.svg?height=250&width=300", span: "" },
  { id: 4, type: "image", src: "/placeholder.svg?height=400&width=250", span: "row-span-2" },
  { id: 5, type: "image", src: "/placeholder.svg?height=200&width=350", span: "" },
  { id: 6, type: "image", src: "/placeholder.svg?height=350&width=250", span: "" },
  { id: 7, type: "image", src: "/placeholder.svg?height=300&width=400", span: "col-span-2" },
  { id: 8, type: "image", src: "/placeholder.svg?height=200&width=200", span: "" },
  { id: 9, type: "image", src: "/placeholder.svg?height=250&width=300", span: "" },
  { id: 10, type: "image", src: "/placeholder.svg?height=300&width=200", span: "" },
  { id: 11, type: "image", src: "/placeholder.svg?height=280&width=380", span: "" },
  { id: 12, type: "image", src: "/placeholder.svg?height=220&width=320", span: "" },
]

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className={`relative group overflow-hidden rounded-lg shadow-md border border-black-charcoal ${item.span}`}
            >
              <Image
                src={item.src || "/placeholder.svg"}
                alt={`Event image ${item.id}`}
                width={item.span.includes("col-span-2") ? 600 : 300}
                height={item.span.includes("row-span-2") ? 400 : 200}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
