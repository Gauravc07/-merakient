"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

// Event posters live in public/images and are swapped per event — if a file is missing,
// render nothing instead of a broken-image icon so the section still looks intentional.
export default function PosterImage(props: ImageProps) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return <Image {...props} alt={props.alt} onError={() => setFailed(true)} />
}
