"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [showSlogan, setShowSlogan] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setShowSlogan(true) // show "It's the Meraki way"
          }, 400) // small delay before showing text

          setTimeout(() => {
            setFadeOut(true)
          }, 1400) // fade out after slogan appears

          setTimeout(() => {
            setIsVisible(false)
            onComplete()
          }, 2200) // final complete
          return 100
        }
        return prev + Math.random() * 3 + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={fadeOut ? { opacity: 0, y: -100 } : { opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="mirzapur-scope fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-6"
        >
          <div className="smoke-layer" />
          <div className="pointer-events-none absolute inset-0 spotlight-cone" />
          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-8 sm:text-left">
            {/* Meraki Logo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center"
            >
              <Image
                src="/images/meraki-logo.png"
                alt="Meraki"
                width={120}
                height={60}
                className="brightness-0 invert"
              />
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-2 text-mirzapur-bone"
            >
              <div className="font-numeric text-xs uppercase tracking-[0.3em] text-mirzapur-gold/80">Blending creativity and</div>
              <div className="font-numeric text-xs uppercase tracking-[0.3em] text-mirzapur-gold/80">innovation to awaken new realms</div>

              <div className="flex items-center justify-center space-x-4 pt-4 sm:justify-start">
                <span className="font-numeric text-xs tracking-[0.3em]">LOADING</span>
                <motion.span
                  key={Math.floor(progress)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-numeric text-sm tabular-nums text-mirzapur-gold"
                >
                  {Math.floor(progress).toString().padStart(3, "0")}% 
                </motion.span>

                {/* New: Meraki Way Text */}
                {showSlogan && (
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="pl-4 font-display text-sm text-mirzapur-bone"
                  >
                    It's the <span className="text-mirzapur-gold">Meraki</span> way.
                  </motion.span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mx-auto mt-2 h-0.5 w-64 bg-mirzapur-gold/15 sm:mx-0">
                <motion.div
                  className="h-full bg-mirzapur-gold shadow-[0_0_10px_rgba(201,162,39,0.8)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>
          </div>

          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
            <div
              className="absolute top-3/4 right-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute top-1/2 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
