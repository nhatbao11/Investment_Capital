"use client"

import type React from "react"
import { motion } from "framer-motion"

interface SectionProps {
  children: React.ReactNode
  className?: string
  background?: "white" | "gray" | "blue" | "gradient"
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  id?: string
}

const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  background = "white",
  padding = "lg",
  id,
}) => {
  const baseClasses = "w-full"

  const backgroundClasses = {
    white: "bg-white",
    gray: "bg-gray-50",
    blue: "bg-blue-50",
    gradient: "bg-gradient-to-br from-blue-50 to-yellow-50",
  }

  const paddingClasses = {
    none: "",
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-20",
  }

  const classes = `${baseClasses} ${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`

  return (
    <motion.section
      id={id}
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </motion.section>
  )
}

export default Section














