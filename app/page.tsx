import HomeHero from "@/components/home-hero"
import UpcomingEvents from "@/components/upcoming-events"
import StatsSection from "@/components/stats-section"
import GlimpseIntoOurEvents from "@/components/glimpse-into-our-events"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <SiteHeader />
      <main className="flex-1">
        <HomeHero />
        <StatsSection /> {/* Section with "About Us" button */}
        <UpcomingEvents /> {/* Moved here, as the third section */}
        <GlimpseIntoOurEvents /> {/* Now the fourth section */}
      </main>
      <SiteFooter />
    </div>
  )
}
