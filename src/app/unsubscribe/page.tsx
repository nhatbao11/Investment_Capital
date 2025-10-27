'use client'

import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Footer from '@/components/Layout/Footer'

// Dynamic import để tránh lỗi useSearchParams
const NewsletterUnsubscribe = dynamic(() => import('@/components/NewsletterUnsubscribe'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
    </div>
  )
})

export default function UnsubscribePage() {
  return (
    <>
      <NewsletterUnsubscribe />
      <Footer />
    </>
  )
}
