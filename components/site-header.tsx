"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Crown, MenuIcon, XIcon } from "lucide-react"

const LEFT_LINKS = [
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
]
const RIGHT_LINKS: { href: string; label: string }[] = []
const MOBILE_LINKS = [
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
]

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`group relative py-2 font-numeric text-[13px] font-semibold uppercase tracking-[0.2em] transition-colors ${
        active ? "text-mirzapur-gold" : "text-mirzapur-bone/85 hover:text-mirzapur-gold"
      }`}
    >
      {label}
      {/* gold underline — full on the current page, grows in on hover */}
      <span
        className={`absolute inset-x-0 -bottom-0.5 h-px origin-center bg-gradient-to-r from-transparent via-mirzapur-gold to-transparent transition-transform duration-300 ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  )
}

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) => !href.includes("#") && pathname === href
  const onBidding = pathname === "/bidding"

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 rounded-2xl border border-mirzapur-gold/35 bg-[linear-gradient(90deg,rgba(58,6,8,0.92),rgba(10,2,2,0.94)_50%,rgba(58,6,8,0.92))] shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_-1px_0_rgba(201,162,39,0.35)] backdrop-blur-md">
      {/* Desktop: three columns (links | logo | bidding) so the logo stays centred */}
      <div className="container flex h-20 items-center justify-between px-4 md:grid md:grid-cols-[1fr_auto_1fr] md:px-6">
        <nav className="hidden items-center gap-7 md:flex">
          {LEFT_LINKS.map((l) => (
            <NavLink key={l.href} {...l} active={isActive(l.href)} />
          ))}
        </nav>

        <Link href="/" className="flex h-full items-center justify-center" aria-label="Meraki Entertainment — home">
          <Image
            src="/images/meraki-logo.png"
            alt="Meraki Entertainment Logo"
            width={64}
            height={64}
            className="object-contain drop-shadow-[0_0_12px_rgba(201,162,39,0.45)]"
          />
        </Link>

        <nav className="hidden items-center justify-end gap-7 md:flex">
          {RIGHT_LINKS.map((l) => (
            <NavLink key={l.href} {...l} active={isActive(l.href)} />
          ))}
          <Link
            href="/bidding"
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-numeric text-[13px] font-bold uppercase tracking-[0.2em] transition ${
              onBidding
                ? "border-mirzapur-gold bg-mirzapur-gold text-black"
                : "border-mirzapur-gold/60 text-mirzapur-gold shadow-[0_0_18px_rgba(201,162,39,0.2)] hover:bg-mirzapur-gold hover:text-black"
            }`}
          >
            <Crown className="h-4 w-4" /> Bidding
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-full p-2 text-mirzapur-gold transition hover:bg-mirzapur-gold/10 md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          <span className="sr-only">Toggle navigation menu</span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-mirzapur-gold/35 bg-[linear-gradient(180deg,rgba(40,4,6,0.97),rgba(8,2,2,0.97))] shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-md md:hidden">
          <nav className="flex flex-col p-3">
            {MOBILE_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`border-b border-mirzapur-gold/10 px-3 py-3.5 font-numeric text-sm font-semibold uppercase tracking-[0.2em] transition-colors ${
                  isActive(l.href) ? "text-mirzapur-gold" : "text-mirzapur-bone/85 hover:text-mirzapur-gold"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/bidding"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-mirzapur-gold px-4 py-3 font-numeric text-sm font-bold uppercase tracking-[0.2em] text-black"
            >
              <Crown className="h-4 w-4" /> Bidding
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
