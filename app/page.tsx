"use client"

import { useState, useEffect } from "react"
import HomeHero from "@/components/home-hero"
import UpcomingEvents from "@/components/upcoming-events"
import StatsSection from "@/components/stats-section"
import BrandStorySection from "@/components/brand-story-section"
import GlimpseIntoOurEvents from "@/components/glimpse-into-our-events"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { LoadingScreen } from "@/components/loading-screen"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

export default function HomePage() {
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Automatically call handleLoadingComplete after a delay (optional if LoadingScreen doesn’t call it itself)
    const timer = setTimeout(() => {
      handleLoadingComplete()
    }, 3000) // adjust delay if needed

    return () => clearTimeout(timer)
  }, [])

  const handleLoadingComplete = () => {
    setShowLoading(false)
  }

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <SiteHeader />
      <main className="flex-1">
        <HomeHero />
        <StatsSection />
        <UpcomingEvents />
        <BrandStorySection />
        {/* <GlimpseIntoOurEvents /> */}
      </main>
      <SiteFooter />
      <SpeedInsights />
      <Analytics />
    </div>
  )
}
