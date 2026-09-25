"use client"

import { useEffect, useState } from "react"

// Edit or add lines here — they rotate while bidding is live.
const DIALOGUES = [
  "Party sabke liye hai… takht sirf ek ka.",
  "Aaj raat ka asli king kaun?",
  "Shauk mehenga hai. Raat usse bhi mehengi.",
]

const ROTATE_MS = 6000

export default function MirzapurDialogues() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % DIALOGUES.length), ROTATE_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mb-6 flex min-h-[3.5rem] items-center justify-center px-4" aria-live="polite">
      <p key={index} className="gold-reveal text-center font-display text-base italic text-mirzapur-bone/85 sm:text-xl">
        “{DIALOGUES[index]}”
      </p>
    </div>
  )
}
