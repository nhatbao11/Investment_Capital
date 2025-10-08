"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Header from "./Header"
import Footer from "./Footer"
import ScrollToTop from "../ui/ScrollToTop"

interface NextLayoutProps {
  children: React.ReactNode
  className?: string
}

const NextLayout: React.FC<NextLayoutProps> = ({ children, className }) => {
  const pathname = usePathname()
  
  // Pages that don't need header and footer
  const noHeaderFooterPages = ['/login', '/signup']
  const shouldShowHeaderFooter = !noHeaderFooterPages.includes(pathname || '')

  if (!shouldShowHeaderFooter) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        {children}
        <ScrollToTop />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header className="mb-0" />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default NextLayout
