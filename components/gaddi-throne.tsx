import { useId } from "react"

// Gold gaddi (throne) drawn inline — no image asset, stays crisp at any size.
export default function GaddiThrone({ className = "h-36 w-36" }: { className?: string }) {
  // Unique gradient ids so two thrones on one page don't share/clash definitions.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "")
  const gold = `gaddi-gold-${uid}`
  const velvet = `gaddi-velvet-${uid}`

  return (
    <svg viewBox="0 0 120 140" className={`drop-shadow-[0_0_24px_rgba(201,162,39,0.55)] ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF1C1" />
          <stop offset="45%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#8C6A2F" />
        </linearGradient>
        <linearGradient id={velvet} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9B1116" />
          <stop offset="100%" stopColor="#4A0404" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="22" r="4" fill={`url(#${gold})`} />
      <circle cx="90" cy="22" r="4" fill={`url(#${gold})`} />
      <circle cx="60" cy="6" r="5" fill={`url(#${gold})`} />
      <path d="M30 72 V26 Q60 -2 90 26 V72 Z" fill={`url(#${gold})`} />
      <path d="M38 70 V30 Q60 10 82 30 V70 Z" fill={`url(#${velvet})`} />
      <circle cx="60" cy="30" r="5" fill="#B10000" stroke="#EDD18A" strokeWidth="1.5" />
      <rect x="10" y="54" width="18" height="32" rx="5" fill={`url(#${gold})`} />
      <rect x="92" y="54" width="18" height="32" rx="5" fill={`url(#${gold})`} />
      <rect x="22" y="68" width="76" height="16" rx="5" fill={`url(#${velvet})`} stroke="#C9A227" strokeWidth="2" />
      <rect x="24" y="84" width="72" height="26" rx="3" fill={`url(#${gold})`} />
      <path d="M34 92 H86 M34 100 H86" stroke="#8C6A2F" strokeWidth="1.5" />
      <rect x="26" y="110" width="9" height="20" rx="2" fill={`url(#${gold})`} />
      <rect x="85" y="110" width="9" height="20" rx="2" fill={`url(#${gold})`} />
    </svg>
  )
}
