import Link from "next/link"
import { InstagramIcon, PhoneIcon as WhatsappIcon } from "lucide-react"

const NAV = [
  { href: "/bidding", label: "Bidding" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
]

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-mirzapur-gold/25 bg-black py-12 text-mirzapur-bone">
      <div className="container space-y-8 px-4 md:px-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-end md:justify-between md:space-y-0">
          <div className="space-y-2">
            <h3 className="font-display text-4xl text-mirzapur-gradient md:text-5xl">Meraki Entertainment</h3>
            <p className="font-numeric text-sm uppercase tracking-[0.3em] text-mirzapur-bone/60">Event Management / Entertainment</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="https://www.instagram.com/the.meraki_ent?igsh=MWw2Z3l3MWI2Z2kwdA=="
              className="rounded-full border border-mirzapur-gold/50 p-2 text-mirzapur-gold transition-colors hover:bg-mirzapur-gold/10"
            >
              <InstagramIcon className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://wa.me/917875594364"
              className="rounded-full border border-mirzapur-gold/50 p-2 text-mirzapur-gold transition-colors hover:bg-mirzapur-gold/10"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsappIcon className="h-6 w-6" />
              <span className="sr-only">WhatsApp</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col space-y-4 border-t border-mirzapur-gold/15 pt-8 md:flex-row md:items-center md:justify-between md:space-y-0">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-lg text-mirzapur-bone/70 md:justify-start">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-mirzapur-gold">
                <span className="pr-1 text-mirzapur-gold">•</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="mt-4 text-center text-sm text-mirzapur-bone/50 md:mt-0 md:text-right">
            &copy; {new Date().getFullYear()} Meraki Entertainment. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
