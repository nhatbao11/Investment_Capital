"use client"

import type React from "react"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { NotificationProvider } from "@/components/ui/Notification"

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <LanguageProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </LanguageProvider>
  )
}















