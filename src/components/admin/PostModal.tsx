"use client"

import React, { useState, useEffect } from 'react'
import { FaTimes, FaSave } from 'react-icons/fa'
import { Post, CreatePostRequest, UpdatePostRequest } from '../../services/types/posts'
import { postsApi } from '../../services/api/posts'

interface PostModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CreatePostRequest | UpdatePostRequest) => Promise<void>
  post?: Post | null
  loading?: boolean
}

const PostModal: React.FC<PostModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  post, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'nganh' as 'nganh' | 'doanh_nghiep',
    status: 'draft' as 'draft' | 'published' | 'archived',
    thumbnail_url: '',
    pdf_url: ''
  })
  const [localBusy, setLocalBusy] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        status: post.status,
        thumbnail_url: post.thumbnail_url || '',
        pdf_url: post.pdf_url || ''
      })
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'nganh',
        status: 'draft',
        thumbnail_url: '',
        pdf_url: ''
      })
    }
    setErrors({})
  }, [post, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc'
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung là bắt buộc'
    }
    if (formData.content.trim().length < 10) {
      newErrors.content = 'Nội dung phải có ít nhất 10 ký tự'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLocalBusy(true)
      const payload: CreatePostRequest | UpdatePostRequest = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        status: formData.status,
        thumbnail_url: formData.thumbnail_url || undefined,
        pdf_url: formData.pdf_url || undefined,
      }
      await onSave(payload)
      try {
        alert(post ? 'Cập nhật bài viết thành công' : 'Tạo bài viết thành công')
      } catch {}
      onClose()
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Lưu bài viết thất bại'
      setErrors(prev => ({ ...prev, _server: msg }))
    } finally { setLocalBusy(false) }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {post ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors._server && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">{errors._server}</div>
          )}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nhập tiêu đề bài viết"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="nganh">Phân tích ngành</option>
                <option value="doanh_nghiep">Phân tích doanh nghiệp</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh đại diện (URL hoặc upload)
            </label>
            <input
              type="text"
              id="thumbnail_url"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg hoặc /uploads/posts/abc.jpg"
            />
            <div className="mt-2">
              <label className="inline-flex items-center px-3 py-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 text-sm">
                Tải ảnh từ máy
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  try {
                    setLocalBusy(true)
                    const res = await postsApi.uploadAsset(file)
                    setFormData(prev => ({ ...prev, thumbnail_url: res.url }))
                  } catch (err) {
                    console.error(err)
                  } finally { setLocalBusy(false) }
                }} />
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="pdf_url" className="block text-sm font-medium text-gray-700 mb-2">
              Tập tin PDF (URL hoặc upload)
            </label>
            <input
              type="text"
              id="pdf_url"
              name="pdf_url"
              value={formData.pdf_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/report.pdf hoặc /uploads/posts/report.pdf"
            />
            <div className="mt-2">
              <label className="inline-flex items-center px-3 py-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 text-sm">
                Tải PDF từ máy
                <input type="file" accept="application/pdf" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  try {
                    setLocalBusy(true)
                    const res = await postsApi.uploadAsset(file)
                    setFormData(prev => ({ ...prev, pdf_url: res.url }))
                  } catch (err) {
                    console.error(err)
                  } finally { setLocalBusy(false) }
                }} />
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nhập nội dung bài viết..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.content.length}/50 ký tự tối thiểu
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || localBusy}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center"
            >
              {loading || localBusy ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <FaSave className="h-4 w-4 mr-2" />
                  {post ? 'Cập nhật' : 'Tạo bài viết'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostModal

