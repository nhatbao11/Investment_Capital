"use client"

import type React from "react"
import { LanguageProvider } from "@/contexts/LanguageContext"

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
}








