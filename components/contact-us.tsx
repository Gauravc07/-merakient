"use client"
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react"

export default function ContactUs() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gold-gradient">Contact Us</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Let's create something extraordinary together. Reach out to us for inquiries or collaborations.
          </p>
        </div>
        <div className="grid md:grid-cols-1 gap-12">
          <div className="space-y-6 flex flex-col items-center">
            <div className="flex items-center gap-4">
              <MailIcon className="h-8 w-8 text-orange-light" />
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground">Email</h3>
                <p className="text-muted-foreground">themerakicreations2025@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PhoneIcon className="h-8 w-8 text-orange-light" />
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground">Phone</h3>
                <p className="text-muted-foreground">+91 78755 94364</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPinIcon className="h-8 w-8 text-orange-light" />
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground">Address</h3>
                <p className="text-muted-foreground">Pune, Maharashtra</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
