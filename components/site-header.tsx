"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MenuIcon, XIcon } from "lucide-react"
import Image from "next/image"

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl rounded-2xl border border-black-charcoal bg-background/90 backdrop-blur-md">
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        {/* Left navigation links - Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#upcoming-events"
            scroll={true}
            className="text-lg font-oswald uppercase font-bold text-white hover:text-orange-light transition-colors"
          >
            Upcoming Events
          </Link>
          <Link
            href="/about-us"
            className="text-lg font-oswald uppercase font-bold text-white hover:text-orange-light transition-colors"
          >
            About Us
          </Link>
        </nav>

        {/* Central Logo */}
        <Link href="/" className="flex items-center justify-center h-full">
          <Image
            src="/images/meraki-logo.png"
            alt="Meraki Entertainment Logo"
            width={70}
            height={70}
            className="object-contain"
          />
        </Link>

        {/* Right navigation links - Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/past-events"
            className="text-lg font-oswald uppercase font-bold text-white hover:text-orange-light transition-colors"
          >
            Past Events
          </Link>
          <Link
            href="/bidding"
            className="text-lg font-oswald uppercase font-bold text-white hover:text-orange-light transition-colors"
          >
            Bidding
          </Link>
          <Link
            href="/contact-us"
            className="text-lg font-oswald uppercase font-bold text-white hover:text-orange-light transition-colors"
          >
            Contact Us
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden text-orange-light" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-md border border-black-charcoal rounded-2xl shadow-lg">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/#upcoming-events"
              scroll={true}
              className="text-lg font-oswald uppercase font-bold text-white hover:text-orange-light transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Upcoming Events
            </Link>
            <Link
              href="/about-us"
              className="text-lg font-oswald uppercase font-bold text-white hover:text-orange-light transition-colors py-2"
              onClick={closeMobileMenu}
            >
              About Us
            </Link>
            <Link
              href="/past-events"
              className="text-lg font-oswald uppercase font-bold text-white hover:text-orange-light transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Past Events
            </Link>
            <Link
              href="/bidding"
              className="text-lg font-oswald uppercase font-bold text-white hover:text-orange-light transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Bidding
            </Link>
            <Link
              href="/contact-us"
              className="text-lg font-oswald uppercase font-bold text-white hover:text-orange-light transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
