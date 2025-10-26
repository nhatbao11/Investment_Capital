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
  description: 'Y&T Group - Đơn vị chia sẻ kiến thức đầu tư chuyên nghiệp. Phân tích ngành, doanh nghiệp, báo cáo đầu tư và chiến lược dài hạn. Nền tảng kiến thức đầu tư uy tín.',
  keywords: [
    'đầu tư',
    'tài chính',
    'Y&T Group',
    'yt2future',
    'phân tích doanh nghiệp',
    'phân tích ngành',
    'quản lý rủi ro',
    'đầu tư bền vững',
    'báo cáo đầu tư',
    'chiến lược đầu tư',
    'kiến thức đầu tư',
    'đầu tư chứng khoán',
    'phân tích cổ phiếu',
    'đầu tư dài hạn',
    'investment',
    'finance',
    'business analysis',
    'sector analysis',
    'risk management',
    'stock analysis',
    'investment strategy',
    'financial planning',
    'vietnam investment',
    'đầu tư việt nam'
  ],
  authors: [{ name: 'Y&T Group' }],
  creator: 'Y&T Group',
  publisher: 'Y&T Group',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
    title: 'Y&T Group - Đơn vị chia sẻ kiến thức đầu tư chuyên nghiệp',
    description: 'Y&T Group - Đơn vị chia sẻ kiến thức đầu tư chuyên nghiệp. Phân tích ngành, doanh nghiệp, báo cáo đầu tư và chiến lược dài hạn. Nền tảng kiến thức đầu tư uy tín.',
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

        {/* Preload only critical resources */}
        <link rel="preload" href="/images/Logo01.jpg" as="image" type="image/jpeg" />
        
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
                  description: 'Y&T Group - Đơn vị chia sẻ kiến thức đầu tư chuyên nghiệp. Phân tích ngành, doanh nghiệp, báo cáo đầu tư và chiến lược dài hạn.',
                  sameAs: [
                    'https://yt2future.com',
                    'https://www.yt2future.com'
                  ],
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
