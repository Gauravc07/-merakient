import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import PastEventsPageContent from "@/components/past-events-page-content"

export default function PastEventsPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <SiteHeader />
      <main className="flex-1 pt-24">
        {" "}
        {/* Added padding-top to account for fixed header */}
        <PastEventsPageContent />
      </main>
      <SiteFooter />
    </div>
  )
}
