"use client"

import type React from "react"
// framer-motion removed to avoid hover lift/ripple animations

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  variant?: "default" | "elevated" | "outlined" | "filled"
  padding?: "none" | "sm" | "md" | "lg" | "xl"
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = true,
  variant = "default",
  padding = "md",
}) => {
  const baseClasses = "rounded-xl"

  const variantClasses = {
    default: "bg-white shadow",
    elevated: "bg-white shadow",
    outlined: "bg-white border border-gray-200",
    filled: "bg-gray-50",
  }

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  }

  const hoverClasses = hover ? "" : ""

  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`

  return <div className={classes}>{children}</div>
}

export default Card

