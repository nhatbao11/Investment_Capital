"use client"

import React, { useState, useEffect } from 'react'
import { FaTimes, FaSave } from 'react-icons/fa'
import { Post, CreatePostRequest, UpdatePostRequest } from '../../services/types/posts'
import { postsApi } from '../../services/api/posts'
import { usePostCategories } from '../../services/hooks/usePostCategories'
import { useNotification } from '../ui/Notification'

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
  const { addNotification } = useNotification()
  const { categories: postCategories, fetchCategoriesByType, loading: categoriesLoading } = usePostCategories()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'nganh' as 'nganh' | 'doanh_nghiep',
    category_id: undefined as number | undefined,
    status: 'draft' as 'draft' | 'published' | 'archived',
    thumbnail_url: '',
    pdf_url: ''
  })
  const [localBusy, setLocalBusy] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Debug categories changes
  useEffect(() => {
    console.log('PostModal - Categories changed:', postCategories)
  }, [postCategories])

  // Fetch categories when category type changes (for both new and existing posts)
  useEffect(() => {
    if (isOpen && formData.category) {
      console.log('PostModal - Fetching categories for type:', formData.category)
      fetchCategoriesByType(formData.category).catch(err => {
        console.error('Error fetching categories:', err)
        addNotification('Lỗi khi tải danh mục', 'error')
      })
    }
  }, [formData.category, isOpen, fetchCategoriesByType, addNotification])

  useEffect(() => {
    if (isOpen) {
      if (post) {
        console.log('PostModal - Setting form data from post:', post)
        setFormData({
          title: post.title,
          content: post.content,
          category: post.category,
          category_id: post.category_id || undefined,
          status: post.status,
          thumbnail_url: post.thumbnail_url || '',
          pdf_url: post.pdf_url || ''
        })
      } else {
        console.log('PostModal - Setting default form data')
        setFormData({
          title: '',
          content: '',
          category: 'nganh',
          category_id: undefined,
          status: 'draft',
          thumbnail_url: '',
          pdf_url: ''
        })
      }
      setErrors({})
    }
  }, [post, isOpen])

  // Debug log for form data changes
  useEffect(() => {
    console.log('PostModal - Form data changed:', formData)
    console.log('PostModal - Current thumbnail_url:', formData.thumbnail_url)
    console.log('PostModal - Current pdf_url:', formData.pdf_url)
  }, [formData])

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
        category_id: formData.category_id || null,
        status: formData.status,
        thumbnail_url: formData.thumbnail_url || null,
        pdf_url: formData.pdf_url || null,
      }
      await onSave(payload)
      onClose()
    } catch (error: any) {
      console.error('Save post error:', error)
      if (error?.response?.data?.errors) {
        // Handle validation errors
        const validationErrors: Record<string, string> = {}
        error.response.data.errors.forEach((err: any) => {
          validationErrors[err.path] = err.msg
        })
        setErrors(validationErrors)
      } else {
        const msg = error?.response?.data?.message || error?.message || 'Lưu bài viết thất bại'
        setErrors(prev => ({ ...prev, _server: msg }))
      }
    } finally { setLocalBusy(false) }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset category_id when category type changes
      ...(name === 'category' ? { category_id: undefined } : {})
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Loại bài viết *
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
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục {formData.category === 'nganh' ? 'ngành' : 'doanh nghiệp'}
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  console.log('PostModal - Category ID changed to:', value)
                  setFormData(prev => ({
                    ...prev,
                    category_id: value ? Number(value) : undefined
                  }))
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn danh mục (tùy chọn)</option>
                {(() => {
                  console.log('PostModal - Rendering categories:', postCategories, 'for category type:', formData.category)
                  return null
                })()}
                {categoriesLoading || postCategories.length === 0 ? (
                  <option value="" disabled>
                    {categoriesLoading ? 'Đang tải danh mục...' : 'Không có danh mục'}
                  </option>
                ) : (
                  postCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                )}
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
                    console.log('Uploading image...')
                    const res = await postsApi.uploadAsset(file)
                    console.log('Image upload result:', res)
                    setFormData(prev => {
                      console.log('Setting thumbnail_url to:', res.url)
                      return { ...prev, thumbnail_url: res.url }
                    })
                  } catch (err) {
                    console.error('Image upload error:', err)
                  } finally { setLocalBusy(false) }
                }} />
              </label>
            </div>
            
            {/* Preview uploaded image */}
            {formData.thumbnail_url && (
              <div className="mt-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                  <div className="flex items-center gap-3">
                    <img 
                      src={formData.thumbnail_url.startsWith('http') ? formData.thumbnail_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${formData.thumbnail_url}`} 
                      alt="Preview" 
                      className="h-16 w-16 object-cover rounded"
                      onError={(e) => {
                        console.error('Image load error:', formData.thumbnail_url);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Ảnh đã chọn</p>
                      <p className="text-xs text-gray-500">{formData.thumbnail_url}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: '' }))}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            )}
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
                    console.log('Uploading PDF...')
                    const res = await postsApi.uploadAsset(file)
                    console.log('PDF upload result:', res)
                    setFormData(prev => {
                      console.log('Setting pdf_url to:', res.url)
                      return { ...prev, pdf_url: res.url }
                    })
                  } catch (err) {
                    console.error('PDF upload error:', err)
                  } finally { setLocalBusy(false) }
                }} />
              </label>
            </div>
            
            {/* Preview uploaded PDF */}
            {formData.pdf_url && (
              <div className="mt-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 bg-red-100 rounded flex items-center justify-center">
                      <span className="text-red-600 text-2xl">📄</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">PDF đã chọn</p>
                      <p className="text-xs text-gray-500">{formData.pdf_url}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, pdf_url: '' }))}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            )}
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

          {errors._server && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors._server}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {post ? 'Đóng' : 'Hủy'}
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

