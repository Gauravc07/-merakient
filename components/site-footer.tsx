import Link from "next/link"
import { InstagramIcon, PhoneIcon as WhatsappIcon } from "lucide-react" // Using DiscIcon for the Discord-like icon

export default function SiteFooter() {
  return (
    <footer className="w-full py-12 bg-background text-foreground">
      <div className="container px-4 md:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
          <div className="space-y-2">
            <h3 className="font-serif text-4xl md:text-5xl font-bold text-platinum-gradient">MERAKI ENTERTAINMENT</h3>
            <p className="text-lg text-muted-foreground uppercase tracking-wide">EVENT MANAGEMENT / ENTERTAINMENT</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="https://www.instagram.com/the.meraki_ent?igsh=MWw2Z3l3MWI2Z2kwdA=="
              className="p-2 border border-platinum rounded-full text-platinum hover:bg-platinum/10 transition-colors"
            >
              <InstagramIcon className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://wa.me/917875594364"
              className="p-2 border border-platinum rounded-full text-platinum hover:bg-platinum/10 transition-colors"
              target="_blank" // Open in new tab
              rel="noopener noreferrer" // Security best practice
            >
              <WhatsappIcon className="h-6 w-6" />
              <span className="sr-only">WhatsApp</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-black-charcoal/50 pt-8 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <nav className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-lg text-muted-foreground">
            <Link href="/" className="hover:underline hover:text-platinum transition-colors">
              <span className="text-platinum pr-1">•</span>Home
            </Link>
            <Link href="/#upcoming-events" className="hover:underline hover:text-platinum transition-colors">
              <span className="text-platinum pr-1">•</span>Upcoming Events
            </Link>
            <Link href="/#glimpse-events" className="hover:underline hover:text-platinum transition-colors">
              <span className="text-platinum pr-1">•</span>Past Events
            </Link>
            <Link href="/about-us" className="hover:underline hover:text-platinum transition-colors">
              <span className="text-platinum pr-1">•</span>About Us
            </Link>
            <Link href="/contact-us" className="hover:underline hover:text-platinum transition-colors">
              <span className="text-platinum pr-1">•</span>Contact Us
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground text-center md:text-right mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Meraki Entertainment. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
