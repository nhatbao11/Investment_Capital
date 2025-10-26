"use client"

import type React from "react"
import { motion } from "framer-motion"

interface GridProps {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: "none" | "sm" | "md" | "lg" | "xl"
  responsive?: boolean
  animated?: boolean
}

const Grid: React.FC<GridProps> = ({
  children,
  className = "",
  cols = 3,
  gap = "md",
  responsive = true,
  animated = false,
}) => {
  const baseClasses = "grid"

  const colsClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
  }

  const gapClasses = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  }

  const classes = `${baseClasses} ${colsClasses[cols]} ${gapClasses[gap]} ${className}`

  if (animated) {
    return (
      <motion.div
        className={classes}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, staggerChildren: 0.1 }}
      >
        {children}
      </motion.div>
    )
  }

  return <div className={classes}>{children}</div>
}

export default Grid

























