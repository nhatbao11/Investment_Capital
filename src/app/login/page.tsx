import type { Metadata } from 'next'
import Login from '@/pages/Login'
import Footer from '@/components/Layout/Footer'

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description: 'Đăng nhập vào tài khoản Y&T Group để truy cập các dịch vụ đầu tư chuyên nghiệp.',
  keywords: [
    'đăng nhập',
    'tài khoản',
    'login',
    'account',
    'sign in'
  ],
  openGraph: {
    title: 'Đăng nhập - Y&T Group',
    description: 'Đăng nhập vào tài khoản Y&T Group để truy cập các dịch vụ đầu tư.',
    images: ['/og-login.png'],
  },
  alternates: {
    canonical: '/login',
  },
}

export default function LoginPage() {
  return (
    <>
      <Login />
      <Footer />
    </>
  )
}
