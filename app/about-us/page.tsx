import AboutUs from "@/components/about-us"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <SiteHeader />
      <main className="flex-1 pt-24">
        {" "}
        {/* Added padding-top to account for fixed header */}
        <AboutUs />
      </main>
      <SiteFooter />
    </div>
  )
}
