"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog" // Import Dialog components

const pastEventsData = [
  {
    id: 1,
    title: "The Beginning Chapter 01",
    date: "February 02, 2025",
    description: "Experience The Unthinkable. Featuring VDJ SHAAN - India's No #1 VDJ.",
    location: "THE MILLS, RAJA BAHADUR CITY CENTRE, DHOLE PATIL RD, PUNE",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7U8WvwaKOCyGLhOXcujrVFSTPjkhdN.png",
  },
  {
    id: 2,
    title: "Chapter 02: Life in the Dream House",
    date: "March 08, 2025",
    description: "Women's Day Special featuring HRJ & K-YASH. Dress Code: Pink and White.",
    location: "KOREGAON PARK ANNEXE, ONYX BUILDING, PUNE, MAHARASHTRA",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eE0JYySuIlX8StjhHoeIxVeVcFz69I.png",
  },
  {
    id: 3,
    title: "Chapter 03: Meraki's Empire",
    date: "April 13, 2025",
    description: "Featuring STUVI B2B HAMSHYRE, Supporting Act: KNHALI.",
    location: "KOREGAON PARK ANNEX, JADHAV NAGAR, MUNDHWA, PUNE",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-whRrF93zYtTVh3z2K9ftO81gcmqUZO.png",
  },
  {
    id: 4,
    title: "The Asylum Wednesdays",
    date: "May 28, 2025",
    description: "Sound by DHYAN and ANTOOXKRAUTEK. ",
    location: "DI MORA - PUNE",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ASYLUM%20MAY%2028%20%282%29.png-bwJ1hWxGoZHdnWV5EwO7rTOYZwGcbo.jpeg",
  },
  {
    id: 5,
    title: "Center Stage Saturday",
    date: "May 24, 2025",
    description: "Featuring SLAPJACK & KNHALI. Meraki Takes Over Penthouze.",
    location: "PENTHOUZE - PUNE",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Center%20Stage%20Sat%2024.05.25%2003.jpg-6dUflu8XuKjZUqzHuAfeNJ7dbUWxAG.jpeg",
  },
  {
    id: 6,
    title: "Bollywood Takeover",
    date: "June 07, 2025",
    description: "Featuring SUSHMAHAN - The Mashup Monarchs Duo. Hosted by Prathmesh Joshi.",
    location: "EPITOME - PUNE",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CXDLROBzPGDrMQlnQtcRyc0mzeNnOJ.png",
  },
  {
    id: 7,
    title: "KIKI's Amazonia 2.0: Dusk, With a Wild Twist",
    date: "June 29, 2025",
    description:
      "India's No.1 Duo Performing PROBROS. Hosted by Devanshu Thite. Amazonia Special Decor, Fireworks, Live Acts.",
    location: "KIKI, B WING, 2ND FLOOR, THE MILLS - RAJA BAHADUR CITY CENTRE, PUNE",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5358%20%282%29.PNG-ofoH50ZGu79TfzpueCVQOnvtA8xG9i.jpeg",
  },
  {
    id: 8,
    title: "House of Bollywood",
    date: "July 05, 2025",
    description: "Featuring DJ NAAIRO, also featuring K-YASH.",
    location: "PENTHOUZE - PUNE",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Nl4rdXKnGJj3OxkT39giK3LUeIFV8D.png",
  },
  {
    id: 9,
    title: "SIN CITY",
    date: "July 13, 2025",
    description: "Featuring TRUX. Hosted by  Chirag Bhagat and Sarang Angarkar.",
    location: "KIKI, B WING, 2ND FLOOR, THE MILLS - RAJA BAHADUR CITY CENTRE, PUNE",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SIN%20CITY%20KIKI-IbCddTmhNFu1K6kWxGJhupBTkhj2rE.png",
  },
]

export default function PastEventsPageContent() {
  return (
    <section id="past-events-page" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-platinum-gradient">Our Past Events</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Relive the magic of our most memorable events, meticulously crafted and flawlessly executed.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12">
          {pastEventsData.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden shadow-silver hover:shadow-lg transition-shadow duration-300 bg-card border border-black-charcoal"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative w-full h-64 overflow-hidden cursor-pointer">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      style={{ objectFit: "cover" }}
                      quality={100}
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    width={1200}
                    height={800}
                    style={{ objectFit: "contain", width: "100%", height: "auto" }}
                    className="max-h-[90vh] mx-auto"
                  />
                </DialogContent>
              </Dialog>
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-orange-light">{event.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{event.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{event.description}</p>
                <p className="text-sm text-muted-foreground mt-2">Location: {event.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
