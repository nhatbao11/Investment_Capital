"use client"

import type React from "react"
import { motion } from "framer-motion"

interface HeadingProps {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  align?: "left" | "center" | "right"
  color?: "default" | "blue" | "yellow" | "gray"
  animated?: boolean
}

const Heading: React.FC<HeadingProps> = ({
  children,
  level = 2,
  className = "",
  align = "left",
  color = "default",
  animated = true,
}) => {
  const baseClasses = "font-bold leading-tight"

  const levelClasses = {
    1: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    2: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
    3: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
    4: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
    5: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
    6: "text-base sm:text-lg md:text-xl lg:text-2xl",
  }

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  const colorClasses = {
    default: "text-gray-900",
    blue: "text-blue-900",
    yellow: "text-yellow-600",
    gray: "text-gray-600",
  }

  const classes = `${baseClasses} ${levelClasses[level]} ${alignClasses[align]} ${colorClasses[color]} ${className}`

  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Tag className={classes}>{children}</Tag>
      </motion.div>
    )
  }

  return <Tag className={classes}>{children}</Tag>
}

export default Heading
