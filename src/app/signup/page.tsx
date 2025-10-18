import type { Metadata } from 'next'
import Signup from '@/pages/Signup'
import Footer from '@/components/Layout/Footer'

export const metadata: Metadata = {
  title: 'Đăng ký',
  description: 'Tạo tài khoản mới tại Y&T Group để bắt đầu hành trình đầu tư chuyên nghiệp.',
  keywords: [
    'đăng ký',
    'tạo tài khoản',
    'signup',
    'register',
    'create account'
  ],
  openGraph: {
    title: 'Đăng ký - Y&T Group',
    description: 'Tạo tài khoản mới tại Y&T Group để bắt đầu hành trình đầu tư.',
    images: ['/og-signup.png'],
  },
  alternates: {
    canonical: '/signup',
  },
}

export default function SignupPage() {
  return (
    <>
      <Signup />
      <Footer />
    </>
  )
}
