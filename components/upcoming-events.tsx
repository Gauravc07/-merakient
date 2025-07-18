import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const upcomingEvents = [
  {
    id: 1,
    title: "The King of Good Times",
    location: "KIKI, Pune",
    date: "25TH JULY",
    description: "Celebrating 14000 crores worth of recovery",
    image: "/images/king-of-good-times.png",
  },
]

export default function UpcomingEvents() {
  return (
    <section id="upcoming-events" className="w-full py-12 md:py-16 lg:py-20 bg-platinum-gradient">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Upcoming Event</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-black-charcoal/80">
            Mark your calendars for our highly anticipated event.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {upcomingEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden shadow-lg transition-shadow duration-300 bg-card border border-black-charcoal"
            >
              <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto min-h-[250px]">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    style={{ objectFit: "cover" }}
                    quality={100}
                    className="rounded-l-lg md:rounded-tr-none md:rounded-bl-lg"
                  />
                </div>
                <div className="p-6 flex flex-col justify-center space-y-4 bg-card-overlay rounded-r-lg md:rounded-bl-none md:rounded-tr-lg">
                  <CardTitle className="font-serif text-3xl text-royal-red text-center md:text-left">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-center md:text-left">
                    <span className="font-semibold text-foreground">Location:</span> {event.location}
                  </CardDescription>
                  <CardDescription className="text-muted-foreground text-center md:text-left">
                    <span className="font-semibold text-foreground">Date:</span> {event.date}
                  </CardDescription>
                  <p className="text-foreground text-center md:text-left">{event.description}</p>
                  <Link href="/bidding" className="w-full max-w-xs mx-auto md:mx-0">
                    <Button className="w-full bg-button-red text-white hover:bg-button-red/90 transition-colors shadow-md hover:shadow-lg">
                      BID TABLE TODAY
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
