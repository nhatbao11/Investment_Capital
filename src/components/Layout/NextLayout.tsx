"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "./Header"
import Footer from "./Footer"
import ScrollToTop from "../ui/ScrollToTop"

interface NextLayoutProps {
  children: React.ReactNode
  className?: string
}

const NextLayout: React.FC<NextLayoutProps> = ({ children, className }) => {
  const pathname = usePathname()
  const [headerHeight, setHeaderHeight] = useState(80) // Default fallback
  
  // Pages that don't need header and footer
  const noHeaderFooterPages = ['/login', '/signup']
  const shouldShowHeaderFooter = !noHeaderFooterPages.includes(pathname || '')

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header[data-header-height]') as HTMLElement
      if (header) {
        const height = header.offsetHeight
        setHeaderHeight(height)
      }
    }

    // Initial measurement with a small delay to ensure header is rendered
    const timeoutId = setTimeout(updateHeaderHeight, 100)

    // Update on scroll (header height changes when scrolled)
    const handleScroll = () => {
      updateHeaderHeight()
    }

    // Throttle scroll events for better performance
    let scrollTimeout: NodeJS.Timeout
    const throttledScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleScroll, 16) // ~60fps
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    window.addEventListener('resize', updateHeaderHeight)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(scrollTimeout)
      window.removeEventListener('scroll', throttledScroll)
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [])

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
      <main 
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ paddingTop: `${headerHeight}px` }}
      >
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default NextLayout
