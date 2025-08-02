"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface PageTransitionProps {
  children: React.ReactNode
}

type Direction = "top" | "right" | "bottom" | "left"

const getRandomDirection = (): Direction => {
  const directions: Direction[] = ["top", "right", "bottom", "left"]
  return directions[Math.floor(Math.random() * directions.length)]
}

const getOppositeDirection = (direction: Direction): Direction => {
  const opposites: Record<Direction, Direction> = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }
  return opposites[direction]
}

const getCoverVariants = (direction: Direction) => {
  const variants = {
    top: {
      initial: { y: "-100%" },
      animate: { y: 0 },
      exit: { y: "100%" },
    },
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
    },
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "-100%" },
    },
    left: {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
    },
  }
  return variants[direction]
}

const getPageVariants = (direction: Direction) => {
  const oppositeDirection = getOppositeDirection(direction)
  const variants = {
    top: {
      initial: { y: "100%", opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: "-100%", opacity: 0 },
    },
    right: {
      initial: { x: "-100%", opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "100%", opacity: 0 },
    },
    bottom: {
      initial: { y: "-100%", opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: "100%", opacity: 0 },
    },
    left: {
      initial: { x: "100%", opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "-100%", opacity: 0 },
    },
  }
  return variants[oppositeDirection]
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [direction, setDirection] = useState<Direction>("top")
  const [isCoverVisible, setIsCoverVisible] = useState(false)
  const [key, setKey] = useState(pathname)

  useEffect(() => {
    if (pathname !== key) {
      const newDirection = getRandomDirection()
      setDirection(newDirection)
      setIsCoverVisible(true)

      // Delay content update to allow cover in animation
      const timeout = setTimeout(() => {
        setKey(pathname)
        setIsCoverVisible(false)
      }, 1000) // total transition time (cover in + content + cover out)

      return () => clearTimeout(timeout)
    }
  }, [pathname, key])

  const coverVariants = getCoverVariants(direction)
  const pageVariants = getPageVariants(direction)

  return (
    <>
      {/* Black Cover Transition */}
      <AnimatePresence>
        {isCoverVisible && (
          <motion.div
            key="cover"
            className="fixed inset-0 z-[9999] bg-black"
            initial={coverVariants.initial}
            animate={coverVariants.animate}
            exit={coverVariants.exit}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        )}
      </AnimatePresence>

      {/* Page Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={pageVariants.initial}
          animate={pageVariants.animate}
          exit={pageVariants.exit}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: isCoverVisible ? 0.2 : 0,
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
