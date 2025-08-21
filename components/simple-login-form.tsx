"use client"

import { useActionState } from "react"
import { login, spectatorLogin } from "@/app/actions" // Import spectatorLogin

export default function SimpleLoginForm() {
  const [loginState, loginAction] = useActionState(login, null)
  const [spectatorState, spectatorAction] = useActionState(spectatorLogin, null) // State for spectator login

  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-120px)] py-12">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg border border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-400">Login to Bidding</h1>
          <p className="text-gray-400 mt-2">Enter your credentials to access the live bidding section.</p>
        </div>

        <form action={loginAction} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              placeholder="enter username"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="enter password"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {loginState?.error && (
            <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{loginState.error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-400 text-center">
          <p>THE BIDDING AMOUNT WILL INCREMENT AT THE BUFFER OF 10K. <br />
            THE BIDDING AMOUNT WILL BE COLLECTED AT THE GATE SO BID ACCORDINGLY. <br />
            THE HIGHEST BIDDER WILL GET A DEDICATED ESCORT TO HIS/HER TABLE.</p>
        </div>

        <div className="mt-6 border-t border-gray-700 pt-6">
          <h2 className="text-xl font-bold text-yellow-400 text-center mb-4">Or</h2>
          <form action={spectatorAction}>
            <button
              type="submit"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md"
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
