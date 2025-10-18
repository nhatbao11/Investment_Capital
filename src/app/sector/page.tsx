import type { Metadata } from 'next'
import Sector from '@/pages/Sector'
import NextLayout from '@/components/Layout/NextLayout'

export const metadata: Metadata = {
  title: 'Phân tích Ngành',
  description: 'Nghiên cứu chuyên sâu các ngành kinh tế với Y&T Group. Phân tích xu hướng, cơ hội và thách thức của từng lĩnh vực kinh tế.',
  keywords: [
    'phân tích ngành',
    'nghiên cứu ngành',
    'ngân hàng',
    'bất động sản',
    'sản xuất',
    'công nghệ',
    'sector analysis',
    'industry research',
    'banking',
    'real estate',
    'manufacturing',
    'technology'
  ],
  openGraph: {
    title: 'Phân tích Ngành - Y&T Group',
    description: 'Nghiên cứu chuyên sâu các ngành kinh tế với phân tích xu hướng và cơ hội đầu tư.',
    images: ['/og-sector.png'],
  },
  alternates: {
    canonical: '/sector',
  },
}

export default function SectorPage() {
  return (
    <NextLayout>
      <Sector />
    </NextLayout>
  )
}
