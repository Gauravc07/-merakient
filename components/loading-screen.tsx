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
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          <div className="flex items-center space-x-8">
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
              className="text-white space-y-2"
            >
              <div className="text-sm font-light tracking-wider uppercase">BLENDING CREATIVITY AND</div>
              <div className="text-sm font-light tracking-wider uppercase">INNOVATION TO AWAKEN NEW REALMS</div>

              <div className="flex items-center space-x-4 pt-4">
                <span className="text-sm font-light tracking-wider">LOADING...</span>
                <motion.span
                  key={Math.floor(progress)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-mono tabular-nums"
                >
                  {Math.floor(progress).toString().padStart(3, "0")}% 
                </motion.span>

                {/* New: Meraki Way Text */}
                {showSlogan && (
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-white text-sm font-light tracking-wide pl-4"
                  >
                    It's the <span className="italic font-medium">Meraki</span> way.
                  </motion.span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-64 h-0.5 bg-gray-800 mt-2">
                <motion.div
                  className="h-full bg-white"
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
