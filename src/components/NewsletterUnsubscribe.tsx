"use client"

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'

const NewsletterUnsubscribeContent: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleUnsubscribe = useCallback(async (emailToUnsubscribe: string) => {
    try {
      setStatus('loading')
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
      
      const res = await fetch(`${API_BASE}/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailToUnsubscribe })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setStatus('success')
        setMessage('✅ Đã hủy đăng ký thành công!')
      } else {
        setStatus('error')
        setMessage('❌ ' + (data.message || 'Có lỗi xảy ra'))
      }
    } catch (error) {
      setStatus('error')
      setMessage('❌ Không thể kết nối đến server')
    }
  }, [])

  useEffect(() => {
    // Lấy email từ URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const emailParam = params.get('email')
      setEmail(emailParam)
      
      // Tự động unsubscribe nếu có email
      if (emailParam) {
        handleUnsubscribe(emailParam)
      }
    }
  }, [handleUnsubscribe])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src="/images/Logo01.jpg" 
              alt="Y&T Group" 
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900">Y&T Group</h1>
          </div>

          {/* Content */}
          {!email && (
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Để hủy đăng ký email, vui lòng click vào link trong email bạn đã nhận.
              </p>
              <Link 
                href="/"
                className="inline-block text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Về trang chủ
              </Link>
            </div>
          )}

          {email && status === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 mb-2">Đang xử lý hủy đăng ký...</p>
              <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
            </div>
          )}

          {email && status === 'success' && (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Đã hủy đăng ký thành công!</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Email <strong className="text-green-700">{email}</strong> đã được xóa khỏi danh sách nhận newsletter.
                  <br />
                  <span className="text-gray-600">Bạn sẽ không nhận email từ Y&T Group nữa.</span>
                </p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Bạn có thể đăng ký lại bất cứ lúc nào trong trang cá nhân.
              </p>
              <Link 
                href="/"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ← Quay lại trang chủ
              </Link>
            </div>
          )}

          {email && status === 'error' && (
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
              <p className="text-gray-600 mb-6">
                {message || 'Không thể hủy đăng ký. Vui lòng thử lại sau.'}
              </p>
              <Link 
                href="/"
                className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const NewsletterUnsubscribe: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    }>
      <NewsletterUnsubscribeContent />
    </Suspense>
  )
}

export default NewsletterUnsubscribe
