"use client"

import React, { useState, useEffect } from 'react'
import { FaTimes, FaPaperPlane, FaEye, FaUsers } from 'react-icons/fa'
import { useNotification } from '../ui/Notification'

interface InvestmentNewsletterModalProps {
  isOpen: boolean
  onClose: () => void
  knowledgeId: number
  knowledgeTitle: string
}

const InvestmentNewsletterModal: React.FC<InvestmentNewsletterModalProps> = ({
  isOpen,
  onClose,
  knowledgeId,
  knowledgeTitle
}) => {
  const { addNotification } = useNotification()
  
  // Lấy token từ localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token')
    }
    return null
  }
  
  const [customSubject, setCustomSubject] = useState('')
  const [customContent, setCustomContent] = useState('')
  const [preview, setPreview] = useState<any>(null)
  const [subscribersCount, setSubscribersCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened, fetching preview for knowledge:', knowledgeId)
      setCustomSubject(knowledgeTitle)
      setCustomContent('') // Reset content when opening modal
      fetchPreview()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const fetchPreview = async () => {
    const token = getToken()
    
    if (!token) {
      console.error('No token available')
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: 'Vui lòng đăng nhập lại'
      })
      return
    }
    
    try {
      setLoading(true)
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
      console.log('Fetching preview for knowledge:', knowledgeId)
      
      const res = await fetch(`${API_BASE}/investment-knowledge/${knowledgeId}/preview-newsletter`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          custom_subject: customSubject || undefined,
          custom_content: customContent || undefined
        })
      })
      
      const data = await res.json()
      console.log('Preview response:', data)
      
      if (data.success) {
        setPreview(data.data)
        setSubscribersCount(data.data.subscribers_count || 0)
        // Set original content nếu chưa có custom content
        if (!customContent && data.data.original_content) {
          setCustomContent(data.data.original_content)
        }
        // Set original title nếu chưa có custom subject
        if (!customSubject && data.data.original_title) {
          setCustomSubject(data.data.original_title)
        }
      } else {
        console.error('Preview failed:', data)
        addNotification({
          type: 'error',
          title: 'Lỗi',
          message: data.message || 'Không thể tải preview email'
        })
      }
    } catch (err) {
      console.error('Error fetching preview:', err)
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể tải preview email'
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    fetchPreview()
  }

  const handleSend = async () => {
    const token = getToken()
    
    if (!token) {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: 'Vui lòng đăng nhập lại'
      })
      return
    }
    
    if (!confirm(`Gửi email cho ${subscribersCount} người đăng ký?`)) return
    
    try {
      setSending(true)
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
      const res = await fetch(`${API_BASE}/investment-knowledge/${knowledgeId}/send-newsletter`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          custom_subject: customSubject || undefined,
          custom_content: customContent || undefined
        })
      })
      
      const data = await res.json()
      if (data.success) {
        addNotification({
          type: 'success',
          title: 'Thành công',
          message: `Đã gửi email cho ${data.data.sent} người!`
        })
        onClose()
      } else {
        addNotification({
          type: 'error',
          title: 'Lỗi',
          message: data.message || 'Không thể gửi email'
        })
      }
    } catch (err) {
      console.error(err)
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể gửi email'
      })
    } finally {
      setSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={(e) => {
      // Close modal when clicking backdrop
      if (e.target === e.currentTarget) {
        onClose()
      }
    }}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-50" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">📧 Gửi Newsletter</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          <div className="bg-white px-6 py-4">
            {/* Info */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Bài viết:</strong> {knowledgeTitle}
              </p>
              <p className="text-sm text-gray-600">
                <FaUsers className="inline mr-2" />
                Số người nhận: <strong>{subscribersCount}</strong>
              </p>
            </div>

            {/* Form chỉnh sửa */}
            <div className="mb-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ✏️ Chỉnh sửa Tiêu đề email (để trống = dùng tiêu đề gốc):
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Ví dụ: 🎉 Tin HOT - Kiến thức mới..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
                {customSubject && (
                  <p className="mt-1 text-xs text-green-600">✓ Tiêu đề tùy chỉnh sẽ được dùng</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ✏️ Chỉnh sửa Nội dung email (để trống = dùng nội dung gốc):
                </label>
                <textarea
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Ví dụ: Xin chào! Chúng tôi vừa phát hành kiến thức mới..."
                  rows={6}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
                {customContent && (
                  <p className="mt-1 text-xs text-green-600">✓ Nội dung tùy chỉnh sẽ được dùng</p>
                )}
              </div>

              <button
                onClick={handlePreview}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
              >
                <FaEye className="mr-2" />
                {loading ? 'Đang tải preview...' : '🔍 Xem preview email'}
              </button>
            </div>

            {/* Preview */}
            {preview && (
              <div className="mb-4 border-2 border-blue-300 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2 font-medium text-blue-900 border-b border-blue-200">
                  📧 Preview Email:
                </div>
                <div 
                  className="p-4 bg-white max-h-[600px] overflow-y-auto overflow-x-hidden"
                  dangerouslySetInnerHTML={{ __html: preview.html }} 
                />
              </div>
            )}

            {!preview && !loading && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Nhấn "Xem preview" để xem email sẽ gửi đi
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={sending}
              >
                Hủy
              </button>
              <button
                onClick={handleSend}
                disabled={sending || !subscribersCount}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                <FaPaperPlane className="mr-2" />
                {sending ? 'Đang gửi...' : 'Gửi email'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestmentNewsletterModal
