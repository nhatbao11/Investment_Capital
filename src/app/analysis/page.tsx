import type { Metadata } from 'next'
import Analysis from '@/pages/Analysis'
import NextLayout from '@/components/Layout/NextLayout'

export const metadata: Metadata = {
  title: 'Phân tích Doanh nghiệp',
  description: 'Dịch vụ phân tích doanh nghiệp chuyên nghiệp tại Y&T Group. Đánh giá toàn diện tình hình tài chính, kinh doanh và rủi ro của doanh nghiệp.',
  keywords: [
    'phân tích doanh nghiệp',
    'đánh giá tài chính',
    'phân tích kinh doanh',
    'định giá doanh nghiệp',
    'đánh giá rủi ro',
    'business analysis',
    'financial analysis',
    'company valuation',
    'risk assessment'
  ],
  openGraph: {
    title: 'Phân tích Doanh nghiệp - Y&T Group',
    description: 'Dịch vụ phân tích doanh nghiệp chuyên nghiệp với đánh giá toàn diện tình hình tài chính và kinh doanh.',
    images: ['/og-analysis.png'],
  },
  alternates: {
    canonical: '/analysis',
  },
}

export default function AnalysisPage() {
  return (
    <NextLayout>
      <Analysis />
    </NextLayout>
  )
}
