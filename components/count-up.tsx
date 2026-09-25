"use client"

import { useEffect, useRef, useState } from "react"

interface CountUpProps {
  to: number
  suffix?: string
  durationMs?: number
}

// Counts from 0 to `to` the first time it scrolls into view (ease-out). Shows the final
// number straight away for users who prefer reduced motion.
export default function CountUp({ to, suffix = "", durationMs = 1800 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setValue(to)
      return
    }

    let raf = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs)
          const eased = 1 - Math.pow(1 - t, 3)
          setValue(Math.round(to * eased))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to, durationMs])

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  )
}
