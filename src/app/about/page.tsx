import type { Metadata } from 'next'
import About from '@/pages/About'
import NextLayout from '@/components/Layout/NextLayout'

export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description: 'Tìm hiểu về Y&T Group - đơn vị chia sẻ kiến thức đầu tư với đội ngũ nghiên cứu giàu kinh nghiệm, tập trung vào phân tích ngành, doanh nghiệp và chiến lược đầu tư dài hạn.',
  keywords: [
    'về chúng tôi',
    'Y&T Group',
    'đội ngũ nghiên cứu',
    'đơn vị chia sẻ kiến thức',
    'sứ mệnh',
    'tầm nhìn',
    'giá trị cốt lõi',
    'about us',
    'investment knowledge',
    'research team'
  ],
  openGraph: {
    title: 'Về chúng tôi - Y&T Group',
    description: 'Tìm hiểu về Y&T Group - đơn vị chia sẻ kiến thức đầu tư với đội ngũ nghiên cứu giàu kinh nghiệm.',
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
