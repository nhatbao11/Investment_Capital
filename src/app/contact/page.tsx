import type { Metadata } from 'next'
import ContactNew from '@/pages/ContactNew'
import NextLayout from '@/components/Layout/NextLayout'

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Liên hệ với Y&T Group để được tư vấn miễn phí về các giải pháp đầu tư. Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn.',
  keywords: [
    'liên hệ',
    'tư vấn đầu tư',
    'hỗ trợ khách hàng',
    'thông tin liên hệ',
    'contact',
    'investment consultation',
    'customer support',
    'contact information'
  ],
  openGraph: {
    title: 'Liên hệ - Y&T Group',
    description: 'Liên hệ với Y&T Group để được tư vấn miễn phí về các giải pháp đầu tư.',
    images: ['/og-contact.png'],
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return (
    <NextLayout>
        <ContactNew />
    </NextLayout>
  )
}
