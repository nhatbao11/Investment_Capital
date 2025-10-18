import type { Metadata } from 'next'
import Investment from '@/pages/Investment'
import NextLayout from '@/components/Layout/NextLayout'

export const metadata: Metadata = {
  title: 'Giải pháp Đầu tư',
  description: 'Khám phá các giải pháp đầu tư toàn diện và chuyên nghiệp tại Y&T Group. Kiến thức đầu tư, chiến lược và quản lý rủi ro.',
  keywords: [
    'giải pháp đầu tư',
    'kiến thức đầu tư',
    'chiến lược đầu tư',
    'quản lý rủi ro',
    'danh mục đầu tư',
    'investment solutions',
    'investment knowledge',
    'investment strategy',
    'risk management',
    'portfolio management'
  ],
  openGraph: {
    title: 'Giải pháp Đầu tư - Y&T Group',
    description: 'Khám phá các giải pháp đầu tư toàn diện và chuyên nghiệp với kiến thức và chiến lược đầu tư.',
    images: ['/og-investment.png'],
  },
  alternates: {
    canonical: '/investment',
  },
}

export default function InvestmentPage() {
  return (
    <NextLayout>
      <Investment />
    </NextLayout>
  )
}
