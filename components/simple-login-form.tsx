"use client"

import { useActionState } from "react"
import { MessageCircle } from "lucide-react"
import { login, spectatorLogin } from "@/app/actions" // Import spectatorLogin

const ACCESS_PHONE_DISPLAY = "+91 78755 94364"
const ACCESS_WHATSAPP_URL = `https://wa.me/917875594364?text=${encodeURIComponent(
  "Hi! I'd like login access to bid for a table at The Prince of Mirzapur – The Bidding Edition (Xclusive, Pune).",
)}`

export default function SimpleLoginForm() {
  const [loginState, loginAction] = useActionState(login, null)
  const [spectatorState, spectatorAction] = useActionState(spectatorLogin, null) // State for spectator login

  return (
    <div className="mirzapur-scope flex items-center justify-center min-h-[calc(100dvh-120px)] py-12">
      <div className="mirzapur-texture w-full max-w-md bg-black/70 p-8 rounded-lg border border-mirzapur-gold/40">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl text-mirzapur-gradient">XCLUSIVE BIDDING</h1>
          <p className="text-mirzapur-bone/60 mt-2">Enter your credentials to access the live bidding section.</p>
        </div>

        <form action={loginAction} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-mirzapur-bone/80 mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              placeholder="enter username"
              required
              className="w-full px-3 py-2 bg-black border border-mirzapur-gold/30 rounded-md text-mirzapur-bone focus:outline-none focus:ring-2 focus:ring-mirzapur-gold"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-mirzapur-bone/80 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="enter password"
              required
              className="w-full px-3 py-2 bg-black border border-mirzapur-gold/30 rounded-md text-mirzapur-bone focus:outline-none focus:ring-2 focus:ring-mirzapur-gold"
            />
          </div>

          {loginState?.error && (
            <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{loginState.error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-mirzapur-gold hover:bg-mirzapur-bronze text-black font-semibold py-2 px-4 rounded-md"
          >
            Login
          </button>
        </form>

        {/* No login yet? Open WhatsApp to the organiser with a message already typed. */}
        <div className="mt-4 space-y-2 text-center">
          <p className="text-xs text-mirzapur-bone/50">Don&apos;t have login details yet?</p>
          <a
            href={ACCESS_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-md border border-mirzapur-gold/60 px-4 py-2 font-semibold text-mirzapur-gold transition-colors hover:bg-mirzapur-gold/10"
          >
            <MessageCircle className="h-4 w-4" /> Request Access on WhatsApp
          </a>
          <p className="text-xs text-mirzapur-bone/50">
            or text <span className="text-mirzapur-bone/80">{ACCESS_PHONE_DISPLAY}</span>
          </p>
        </div>

        <div className="mt-6 border-t border-mirzapur-gold/20 pt-6">
          <h2 className="font-display text-xl text-mirzapur-gold text-center mb-4">OR</h2>
          <form action={spectatorAction}>
            <button
              type="submit"
              className="w-full bg-mirzapur-gunmetal hover:bg-mirzapur-gunmetal/70 text-mirzapur-bone font-semibold py-2 px-4 rounded-md"
            >
              Spectator Login (View Only)
            </button>
          </form>
          {spectatorState?.error && (
            <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded mt-2">{spectatorState.error}</div>
          )}
        </div>
      </div>
    </div>
  )
}
