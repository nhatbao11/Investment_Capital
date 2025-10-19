"use client"

import type React from "react"
import { motion } from "framer-motion"

interface IconProps {
  icon: React.ComponentType<{ className?: string }>
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  color?: "default" | "blue" | "yellow" | "gray" | "white"
  className?: string
  animated?: boolean
  hover?: boolean
}

const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = "md",
  color = "default",
  className = "",
  animated = false,
  hover = false,
}) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
    "2xl": "w-10 h-10",
  }

  const colorClasses = {
    default: "text-gray-900",
    blue: "text-blue-900",
    yellow: "text-yellow-600",
    gray: "text-gray-500",
    white: "text-white",
  }

  const classes = `${sizeClasses[size]} ${colorClasses[color]} ${className}`

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <IconComponent className={classes} />
      </motion.div>
    )
  }

  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.2 }}
      >
        <IconComponent className={classes} />
      </motion.div>
    )
  }

  return <IconComponent className={classes} />
}

export default Icon








