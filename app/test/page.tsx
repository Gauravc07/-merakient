import MultiUserTestPanel from "@/components/multi-user-test-panel"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { getCurrentUser } from "@/lib/auth-enhanced"
import { redirect } from "next/navigation"

export default async function TestPage() {
  const user = await getCurrentUser()

  // Only allow admin users or specific test users
  if (!user || !["user1", "admin"].includes(user.username)) {
    redirect("/")
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <SiteHeader />
      <main className="flex-1 pt-24">
        <div className="container px-4 md:px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-platinum-gradient mb-4">
              Multi-User Testing Dashboard
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Test the real-time bidding system with multiple simulated users to ensure proper conflict resolution and
              database integrity.
            </p>
          </div>
          <MultiUserTestPanel />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
