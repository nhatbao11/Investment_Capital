import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Y&T Group - Shaping Tomorrow Through Agile Innovation',
    template: '%s | Y&T Group'
  },
  description: 'Y&T Group là đơn vị chia sẻ kiến thức đầu tư: phân tích ngành, doanh nghiệp, báo cáo và chiến lược đầu tư dài hạn. Không cung cấp dịch vụ tài chính.',
  keywords: [
    'đầu tư',
    'tài chính',
    'Y&T Group',
    'phân tích doanh nghiệp',
    'phân tích ngành',
    'quản lý rủi ro',
    'đầu tư bền vững',
    'investment',
    'finance',
    'business analysis',
    'sector analysis',
    'risk management'
  ],
  authors: [{ name: 'Y&T Group' }],
  creator: 'Y&T Group',
  publisher: 'Y&T Group',
  icons: {
    icon: '/images/Logo01.jpg',
    shortcut: '/images/Logo01.jpg',
    apple: '/images/Logo01.jpg',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yt2future.com'),
  alternates: {
    canonical: '/',
    languages: {
      'vi-VN': '/vi',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://yt2future.com',
    title: 'Y&T Group - Shaping Tomorrow Through Agile Innovation',
    description: 'Y&T Group là đơn vị chia sẻ kiến thức đầu tư: phân tích ngành, doanh nghiệp, báo cáo và chiến lược đầu tư.',
    siteName: 'Y&T Group',
    images: [
      {
        url: '/images/Logo01.jpg',
        width: 1200,
        height: 630,
        alt: 'Y&T Group Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Y&T Group - Shaping Tomorrow Through Agile Innovation',
    description: 'Y&T Group là đơn vị chia sẻ kiến thức đầu tư: phân tích ngành, doanh nghiệp, báo cáo và chiến lược đầu tư.',
    images: ['/images/Logo01.jpg'],
    creator: '@ytcapital',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Preload critical resources */}
        <link rel="preload" href="/images/Logo01.jpg" as="image" type="image/jpeg" />
        <link rel="preload" href="/images/vechungtoi.jpg" as="image" type="image/jpeg" />
        <link rel="preload" href="/images/Saigon.mp4" as="video" type="video/mp4" />
        
        {/* Favicon */}
        <link rel="icon" href="/images/Logo01.jpg" type="image/jpeg" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-white`}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-white text-gray-900">
            {/* Organization structured data for logo in search */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Organization',
                  name: 'Y&T Group',
                  url: 'https://yt2future.com',
                  logo: 'https://yt2future.com/favicon.svg',
                }),
              }}
            />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
