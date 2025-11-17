"use client"

import type React from "react"
import { motion } from "framer-motion"

interface TextProps {
  children: React.ReactNode
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl"
  weight?: "normal" | "medium" | "semibold" | "bold"
  color?: "default" | "muted" | "blue" | "yellow" | "gray"
  align?: "left" | "center" | "right"
  className?: string
  animated?: boolean
}

const Text: React.FC<TextProps> = ({
  children,
  size = "base",
  weight = "normal",
  color = "default",
  align = "left",
  className = "",
  animated = true,
}) => {
  const baseClasses = "leading-relaxed"

  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  }

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  }

  const colorClasses = {
    default: "text-gray-900",
    muted: "text-gray-600",
    blue: "text-blue-900",
    yellow: "text-yellow-600",
    gray: "text-gray-500",
  }

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  const classes = `${baseClasses} ${sizeClasses[size]} ${weightClasses[weight]} ${colorClasses[color]} ${alignClasses[align]} ${className}`

  if (animated) {
    return (
      <motion.p
        className={classes}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {children}
      </motion.p>
    )
  }

  return <p className={classes}>{children}</p>
}

export default Text





































