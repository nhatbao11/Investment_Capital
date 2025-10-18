import type { Metadata } from 'next'
import About from '@/pages/About'
import NextLayout from '@/components/Layout/NextLayout'

export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description: 'Tìm hiểu về Y&T Group - công ty đầu tư chuyên nghiệp với đội ngũ chuyên gia giàu kinh nghiệm và công nghệ phân tích tiên tiến.',
  keywords: [
    'về chúng tôi',
    'Y&T Group',
    'đội ngũ chuyên gia',
    'công ty đầu tư',
    'sứ mệnh',
    'tầm nhìn',
    'giá trị cốt lõi',
    'about us',
    'investment company',
    'expert team'
  ],
  openGraph: {
    title: 'Về chúng tôi - Y&T Group',
    description: 'Tìm hiểu về Y&T Group - công ty đầu tư chuyên nghiệp với đội ngũ chuyên gia giàu kinh nghiệm.',
    images: ['/og-about.png'],
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <NextLayout>
      <About />
    </NextLayout>
  )
}
