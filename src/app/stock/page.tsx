import type { Metadata } from 'next'
import StockFilter from '@/pages/StockFilter'
import NextLayout from '@/components/Layout/NextLayout'

export const metadata: Metadata = {
  title: 'Bộ lọc Cổ phiếu',
  description: 'Tìm kiếm và phân tích cổ phiếu với bộ lọc thông minh của Y&T Group. Lọc theo ngành, giá và khối lượng giao dịch.',
  keywords: [
    'bộ lọc cổ phiếu',
    'tìm kiếm cổ phiếu',
    'phân tích cổ phiếu',
    'lọc theo ngành',
    'lọc theo giá',
    'stock filter',
    'stock search',
    'stock analysis',
    'sector filter',
    'price filter'
  ],
  openGraph: {
    title: 'Bộ lọc Cổ phiếu - Y&T Group',
    description: 'Tìm kiếm và phân tích cổ phiếu với bộ lọc thông minh theo ngành, giá và khối lượng.',
    images: ['/og-stock.png'],
  },
  alternates: {
    canonical: '/stock',
  },
}

export default function StockPage() {
  return (
    <NextLayout>
      <StockFilter />
    </NextLayout>
  )
}
