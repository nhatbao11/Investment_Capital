"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../services/hooks/useAuth'
import { usePosts } from '../../services/hooks/usePosts'
import { useFeedbacks } from '../../services/hooks/useFeedbacks'
import { feedbacksApi } from '../../services/api/feedbacks'
import { useUsers } from '../../services/hooks/useUsers'
import { useInvestmentKnowledge } from '../../services/hooks/useInvestmentKnowledge'
import { useCategories } from '../../services/hooks/useCategories'
import { usePostCategories } from '../../services/hooks/usePostCategories'
import { authApi } from '../../services/api/auth'
import { FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaChartBar, FaUsers, FaFileAlt, FaComments, FaSignOutAlt, FaHome, FaLightbulb, FaBook } from 'react-icons/fa'
import PostModal from '../../components/admin/PostModal'
import InvestmentKnowledgeModal from '../../components/admin/InvestmentKnowledgeModal'
import BookJourneyManagement from '../../components/admin/BookJourneyManagement'
import { useLanguage } from '../../contexts/LanguageContext'
import { useNotification } from '../../components/ui/Notification'

const AdminDashboard: React.FC = () => {
  const router = useRouter()
  const { t } = useLanguage()
  const { addNotification } = useNotification()
  const { user, loading: authLoading, logout } = useAuth()
  const { posts, loading: postsLoading, fetchPosts, deletePost, createPost, updatePost, pagination: postsPagination } = usePosts()
  const { feedbacks, loading: feedbacksLoading, fetchFeedbacks, deleteFeedback, approveFeedback, rejectFeedback, fetchFeedbackStats, stats, pagination: feedbacksPagination } = useFeedbacks()
  const [pendingFeedbacks, setPendingFeedbacks] = useState<any[]>([])
  const [allFeedbacks, setAllFeedbacks] = useState<any[]>([])
  const { users, loading: usersLoading, fetchUsers, updateUser, deleteUser, pagination: usersPagination } = useUsers()
  const { knowledge, loading: knowledgeLoading, fetchKnowledge, createKnowledge, updateKnowledge, deleteKnowledge, pagination: knowledgePagination } = useInvestmentKnowledge()
  const { categories, loading: categoriesLoading, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories()
  const { 
    categories: postCategories, 
    loading: postCategoriesLoading, 
    fetchCategoriesByType, 
    createCategory: createPostCategory, 
    updateCategory: updatePostCategory, 
    deleteCategory: deletePostCategory 
  } = usePostCategories()
  const [totalKnowledge, setTotalKnowledge] = useState<number>(0)
  const [totalBookJourney, setTotalBookJourney] = useState<number>(0)
  
  // Investment knowledge filters
  const [investmentFilter, setInvestmentFilter] = useState({
    status: 'all',
    category_id: 'all'
  })
  
  const [activeTab, setActiveTab] = useState<'posts' | 'feedbacks' | 'users' | 'stats' | 'investment' | 'bookjourney' | 'categories' | 'post-categories' | 'investment-categories'>('posts')
  // users are loaded via hook
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false)
  const [editingKnowledge, setEditingKnowledge] = useState<any>(null)
  const [showPostCategoryModal, setShowPostCategoryModal] = useState(false)
  const [editingPostCategory, setEditingPostCategory] = useState<any>(null)
  const [postCategoryForm, setPostCategoryForm] = useState({ name: '', description: '', color: '#3B82F6', category_type: 'nganh' as 'nganh' | 'doanh_nghiep' })
  const [selectedPostCategoryType, setSelectedPostCategoryType] = useState<'nganh' | 'doanh_nghiep'>('nganh')
  const [showInvestmentCategoryModal, setShowInvestmentCategoryModal] = useState(false)
  const [editingInvestmentCategory, setEditingInvestmentCategory] = useState<any>(null)
  const [investmentCategoryForm, setInvestmentCategoryForm] = useState({ name: '', description: '', color: '#3B82F6' })
  const [postFilter, setPostFilter] = useState<{ status?: 'draft' | 'published' | 'archived' | 'all'; category?: 'nganh' | 'doanh_nghiep' | 'all' }>({ status: 'all', category: 'all' })
  const [postsPage, setPostsPage] = useState(1)
  const [postsLimit, setPostsLimit] = useState(10)
  const [feedbacksPage, setFeedbacksPage] = useState(1)
  const [feedbacksLimit, setFeedbacksLimit] = useState(10)
  const [usersPage, setUsersPage] = useState(1)
  const [usersLimit, setUsersLimit] = useState(10)
  const [investmentPage, setInvestmentPage] = useState(1)
  const [investmentLimit, setInvestmentLimit] = useState(10)
  const [autoLimit, setAutoLimit] = useState(10)
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUserData, setEditingUserData] = useState<any | null>(null)
  const [userForm, setUserForm] = useState<{ email: string; full_name: string; password: string; role: 'client' | 'admin'; is_active: boolean }>({ email: '', full_name: '', password: '', role: 'client', is_active: true })

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        window.location.href = '/login/'
        return
      }
      
      if (user.role !== 'admin') {
        window.location.href = '/login/'
        return
      }
      
      // Load data when admin page loads
      loadInitialData()
    }
  }, [user, authLoading])

  // Auto-calc page size to better fill the table container height
  useEffect(() => {
    const calculateLimit = () => {
      if (typeof window === 'undefined') return
      const headerAndChrome = 360 // approximate px for header, tabs, paddings
      const rowHeight = 56 // table row height ~ 56px
      const available = Math.max(300, window.innerHeight - headerAndChrome)
      const rows = Math.max(6, Math.floor(available / rowHeight))
      setAutoLimit(rows)
    }
    calculateLimit()
    window.addEventListener('resize', calculateLimit)
    return () => window.removeEventListener('resize', calculateLimit)
  }, [])

  // Apply auto limit across lists and refetch current tab
  useEffect(() => {
    setPostsLimit(autoLimit)
    setFeedbacksLimit(autoLimit)
    setUsersLimit(autoLimit)
    setInvestmentLimit(autoLimit)
    ;(async () => {
      try {
        if (activeTab === 'posts') await fetchPosts({ 
          page: postsPage, 
          limit: autoLimit,
          status: postFilter.status !== 'all' ? postFilter.status : undefined,
          category: postFilter.category && postFilter.category !== 'all' ? postFilter.category : undefined,
        })
        if (activeTab === 'investment') await fetchKnowledge({ page: investmentPage, limit: autoLimit })
        if (activeTab === 'feedbacks') await fetchFeedbacks({ page: feedbacksPage, limit: autoLimit, status: 'pending' })
        if (activeTab === 'users') await fetchUsers({ page: usersPage, limit: autoLimit })
      } catch {}
    })()
  }, [autoLimit])

  const loadInitialData = async () => {
    try {
      const results = await Promise.all([
        fetchPosts({ 
          page: postsPage, 
          limit: postsLimit,
          status: postFilter.status !== 'all' ? postFilter.status : undefined,
          category: postFilter.category && postFilter.category !== 'all' ? postFilter.category : undefined,
        }),
        fetchUsers({ page: usersPage, limit: usersLimit }),
        fetchKnowledge({ page: investmentPage, limit: investmentLimit }),
        fetchFeedbacks({ page: feedbacksPage, limit: feedbacksLimit, status: 'pending' }),
        fetchFeedbackStats(),
        fetchCategories() // Fetch categories for investment knowledge
      ])
      
      // Set total knowledge from the fetchKnowledge result
      const knowledgeResult = results[2] // fetchKnowledge is the 3rd promise
      if (knowledgeResult && knowledgeResult.pagination) {
        setTotalKnowledge(knowledgeResult.pagination.total)
      } else {
        setTotalKnowledge(knowledge.length || 0)
      }
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
        const r = await fetch(`${API_BASE}/bookjourney/admin/all?page=1&limit=1`, { headers: { Authorization: `Bearer ${token}` } })
        if (r.ok) {
          const j = await r.json()
          setTotalBookJourney(j?.pagination?.total || (j?.data?.length || 0))
        }
      } catch {}
    } catch (error) {
      console.error('Error loading initial data:', error)
    }
  }

  // Khi chuyển sang tab phản hồi, nạp lại cả pending + all
  useEffect(() => {
    if (activeTab === 'feedbacks') {
      (async () => {
        try {
          await fetchFeedbacks({ page: feedbacksPage, limit: feedbacksLimit, status: 'pending' })
          await refreshFeedbackLists()
        } catch (e) {
          console.error('Failed to refresh feedbacks on tab switch', e)
        }
      })()
    }
  }, [activeTab, feedbacksPage, feedbacksLimit])

  // Khi chuyển sang tab investment, nạp lại với filter
  useEffect(() => {
    if (activeTab === 'investment') {
      (async () => {
        try {
          await fetchKnowledge({ 
            page: investmentPage, 
            limit: investmentLimit,
            status: investmentFilter.status !== 'all' ? investmentFilter.status : undefined
          })
        } catch (error) {
          console.error('Error loading investment knowledge:', error)
        }
      })()
    }
  }, [activeTab, investmentPage, investmentLimit, investmentFilter])

  // Khi chuyển sang tab investment-categories, fetch categories
  useEffect(() => {
    if (activeTab === 'investment-categories') {
      fetchCategories()
    }
  }, [activeTab, fetchCategories])

  const refreshUsers = async () => {
    try {
      await fetchUsers({ page: usersPage, limit: usersLimit })
    } catch (e) {
      console.error('Failed to refresh users', e)
    }
  }

  const refreshFeedbacks = async () => {
    try {
      await fetchFeedbacks({ page: feedbacksPage, limit: feedbacksLimit, status: 'pending' })
      await refreshFeedbackLists()
      await fetchFeedbackStats()
    } catch (e) {
      console.error('Failed to refresh feedbacks', e)
    }
  }

  const refreshFeedbackLists = async () => {
    try {
      const [pendingResp, approvedResp, rejectedResp] = await Promise.all([
        feedbacksApi.getFeedbacks({ page: 1, limit: 50, status: 'pending' }),
        feedbacksApi.getFeedbacks({ page: 1, limit: 50, status: 'approved' }),
        feedbacksApi.getFeedbacks({ page: 1, limit: 50, status: 'rejected' }),
      ])
      setPendingFeedbacks(pendingResp.data)
      setAllFeedbacks([...(approvedResp.data || []), ...(rejectedResp.data || [])])
    } catch (e) {
      console.error('Failed to load feedback lists', e)
      setPendingFeedbacks([])
      setAllFeedbacks([])
    }
  }

  const handleDeletePost = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      const success = await deletePost(id)
      if (success) {
        addNotification({
          type: 'success',
          title: 'Thành công',
          message: 'Xóa bài viết thành công'
        })
      } else {
        addNotification({
          type: 'error',
          title: 'Lỗi',
          message: 'Không thể xóa bài viết'
        })
      }
    }
  }

  const handleDeleteFeedback = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) {
      const ok = await deleteFeedback(id)
      if (ok) {
        addNotification({
          type: 'success',
          title: 'Thành công',
          message: 'Xóa phản hồi thành công'
        })
        await refreshFeedbacks()
      } else {
        addNotification({
          type: 'error',
          title: 'Lỗi',
          message: 'Không thể xóa phản hồi'
        })
      }
    }
  }

  const handleApproveFeedback = async (id: number) => {
    const res = await approveFeedback(id)
    if (res) {
      addNotification({
        type: 'success',
        title: 'Thành công',
        message: 'Duyệt phản hồi thành công'
      })
      await refreshFeedbacks()
    } else {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể duyệt phản hồi'
      })
    }
  }

  const handleRejectFeedback = async (id: number) => {
    const res = await rejectFeedback(id)
    if (res) {
      addNotification({
        type: 'success',
        title: 'Thành công',
        message: 'Từ chối phản hồi thành công'
      })
      await refreshFeedbacks()
    } else {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể từ chối phản hồi'
      })
    }
  }

  const handleSavePost = async (data: any) => {
    try {
      if (editingPost) {
        const res = await updatePost(editingPost.id, data)
        if (res) {
          addNotification({
            type: 'success',
            title: 'Thành công',
            message: 'Cập nhật bài viết thành công'
          })
        } else {
          addNotification({
            type: 'error',
            title: 'Lỗi',
            message: 'Không thể cập nhật bài viết'
          })
        }
      } else {
        const res = await createPost(data)
        if (res) {
          addNotification({
            type: 'success',
            title: 'Thành công',
            message: 'Tạo bài viết thành công'
          })
        } else {
          addNotification({
            type: 'error',
            title: 'Lỗi',
            message: 'Không thể tạo bài viết'
          })
        }
      }
    } catch (e: any) {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: e?.response?.data?.message || 'Lưu bài viết thất bại'
      })
    } finally {
      setEditingPost(null)
      setShowCreateModal(false)
    }
  }

  const handleFilterPosts = async (next: typeof postFilter) => {
    setPostFilter(next)
    await fetchPosts({
      page: postsPage,
      limit: postsLimit,
      status: next.status,
      category: next.category && next.category !== 'all' ? next.category : undefined,
    } as any)
  }

  const handleToggleUserActive = async (u: any) => {
    const updated = await updateUser(u.id, { is_active: !u.is_active })
    if (updated) {
      await refreshUsers()
    }
  }

  const handleToggleUserRole = async (u: any) => {
    const nextRole = u.role === 'admin' ? 'client' : 'admin'
    const updated = await updateUser(u.id, { role: nextRole })
    if (updated) {
      await refreshUsers()
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      const ok = await deleteUser(id)
      if (ok) {
        await refreshUsers()
      }
    }
  }

  // Investment Knowledge handlers
  const handleDeleteKnowledge = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa kiến thức đầu tư này?')) {
      await deleteKnowledge(id)
    }
  }




  // Post Category handlers
  const handleSavePostCategory = async () => {
    try {
      if (editingPostCategory) {
        const res = await updatePostCategory(editingPostCategory.id, postCategoryForm)
        if (res) {
          addNotification({
            type: 'success',
            title: 'Thành công',
            message: 'Cập nhật danh mục thành công'
          })
        } else {
          addNotification({
            type: 'error',
            title: 'Lỗi',
            message: 'Không thể cập nhật danh mục'
          })
        }
      } else {
        const res = await createPostCategory(postCategoryForm)
        if (res) {
          addNotification({
            type: 'success',
            title: 'Thành công',
            message: 'Tạo danh mục thành công'
          })
        } else {
          addNotification({
            type: 'error',
            title: 'Lỗi',
            message: 'Không thể tạo danh mục'
          })
        }
      }
    } catch (e: any) {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: e?.response?.data?.message || 'Lưu danh mục thất bại'
      })
    } finally {
      setEditingPostCategory(null)
      setShowPostCategoryModal(false)
      setPostCategoryForm({ name: '', description: '', color: '#3B82F6', category_type: 'nganh' })
    }
  }

  const handleDeletePostCategory = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      const success = await deletePostCategory(id)
      if (success) {
        addNotification({
          type: 'success',
          title: 'Thành công',
          message: 'Xóa danh mục thành công'
        })
      } else {
        addNotification({
          type: 'error',
          title: 'Lỗi',
          message: 'Không thể xóa danh mục (có thể còn bài viết)'
        })
      }
    }
  }

  const handleDeleteInvestmentCategory = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        console.log('Attempting to delete category:', id)
        const success = await deleteCategory(id)
        console.log('Delete result:', success)
        if (success) {
          addNotification({
            type: 'success',
            title: 'Thành công',
            message: 'Xóa danh mục thành công'
          })
          // Refresh categories after deletion
          fetchCategories()
        } else {
          addNotification({
            type: 'error',
            title: 'Lỗi',
            message: 'Không thể xóa danh mục (có thể còn kiến thức)'
          })
        }
      } catch (error: any) {
        console.error('Error deleting category:', error)
        addNotification({
          type: 'error',
          title: 'Lỗi',
          message: error.message || 'Không thể xóa danh mục'
        })
      }
    }
  }

  const handleSaveInvestmentCategory = async () => {
    try {
      if (editingInvestmentCategory) {
        await updateCategory(editingInvestmentCategory.id, investmentCategoryForm)
        addNotification({
          type: 'success',
          title: 'Thành công',
          message: 'Cập nhật danh mục thành công'
        })
      } else {
        await createCategory(investmentCategoryForm)
        addNotification({
          type: 'success',
          title: 'Thành công',
          message: 'Tạo danh mục thành công'
        })
      }
    } catch (e: any) {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: e?.response?.data?.message || 'Lưu danh mục thất bại'
      })
    } finally {
      setEditingInvestmentCategory(null)
      setShowInvestmentCategoryModal(false)
      setInvestmentCategoryForm({ name: '', description: '', color: '#3B82F6' })
    }
  }

  const openCreatePostCategory = (type: 'nganh' | 'doanh_nghiep') => {
    setEditingPostCategory(null)
    setPostCategoryForm({ name: '', description: '', color: '#3B82F6', category_type: type })
    setSelectedPostCategoryType(type)
    setShowPostCategoryModal(true)
  }

  const openEditPostCategory = (category: any) => {
    setEditingPostCategory(category)
    setPostCategoryForm({ 
      name: category.name, 
      description: category.description || '', 
      color: category.color || '#3B82F6',
      category_type: category.category_type
    })
    setSelectedPostCategoryType(category.category_type)
    setShowPostCategoryModal(true)
  }

  const openEditInvestmentCategory = (category: any) => {
    setEditingInvestmentCategory(category)
    setInvestmentCategoryForm({ 
      name: category.name, 
      description: category.description || '', 
      color: category.color || '#3B82F6'
    })
    setShowInvestmentCategoryModal(true)
  }

  const handleSaveKnowledge = async (data: FormData) => {
    try {
      if (editingKnowledge) {
        const res = await updateKnowledge(editingKnowledge.id, data as any)
        if (res) {
          addNotification({
            type: 'success',
            title: 'Thành công',
            message: 'Cập nhật kiến thức đầu tư thành công'
          })
          setEditingKnowledge(null)
          setShowKnowledgeModal(false)
        } else {
          addNotification({
            type: 'error',
            title: 'Lỗi',
            message: 'Không thể cập nhật kiến thức đầu tư'
          })
        }
      } else {
        const res = await createKnowledge(data as any)
        if (res) {
          addNotification({
            type: 'success',
            title: 'Thành công',
            message: 'Tạo kiến thức đầu tư thành công'
          })
          setEditingKnowledge(null)
          setShowKnowledgeModal(false)
        } else {
          addNotification({
            type: 'error',
            title: 'Lỗi',
            message: 'Không thể tạo kiến thức đầu tư'
          })
        }
      }
    } catch (e: any) {
      console.error('Save knowledge error:', e)
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: e?.response?.data?.message || 'Lưu kiến thức đầu tư thất bại'
      })
    }
  }

  const openCreateUser = () => {
    setEditingUserData(null)
    setUserForm({ email: '', full_name: '', password: '', role: 'client', is_active: true })
    setShowUserModal(true)
  }

  const openEditUser = (u: any) => {
    setEditingUserData(u)
    setUserForm({ email: u.email, full_name: u.full_name, password: '', role: u.role, is_active: u.is_active })
    setShowUserModal(true)
  }

  const saveUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingUserData) {
        const updated = await updateUser(editingUserData.id, { full_name: userForm.full_name, role: userForm.role, is_active: userForm.is_active })
        if (updated) {
          await refreshUsers()
        }
      } else {
        await authApi.register({ email: userForm.email, password: userForm.password, full_name: userForm.full_name, role: userForm.role })
        await refreshUsers()
      }
      setShowUserModal(false)
      setEditingUserData(null)
    } catch (err) {
      console.error('Save user error:', err)
    }
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login/'
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/images/Logo01.jpg" alt="Y&T Group" className="h-8 w-8 mr-3 rounded-full" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{t('greeting.hello')}, {user.full_name}</span>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <FaHome className="h-4 w-4 mr-2" />
                Trang chủ
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <FaSignOutAlt className="h-4 w-4 mr-2" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900">{usersPagination?.total ?? users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaFileAlt className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng bài viết</p>
                <p className="text-2xl font-bold text-gray-900">{postsPagination?.total ?? posts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaComments className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng phản hồi</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total ?? (pendingFeedbacks.length + allFeedbacks.length)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaTimes className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.pending || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FaLightbulb className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng kiến thức đầu tư</p>
                <p className="text-2xl font-bold text-gray-900">{totalKnowledge}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaBook className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng hành trình sách</p>
                <p className="text-2xl font-bold text-gray-900">{totalBookJourney}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'posts', name: 'Quản lý bài viết', icon: FaFileAlt },
                { id: 'post-categories', name: 'Danh mục bài viết', icon: FaFileAlt },
                { id: 'investment', name: 'Kiến thức đầu tư', icon: FaLightbulb },
                { id: 'investment-categories', name: 'Danh mục kiến thức đầu tư', icon: FaLightbulb },
                { id: 'bookjourney', name: 'Hành trình sách', icon: FaBook },
                { id: 'feedbacks', name: 'Quản lý phản hồi', icon: FaComments },
                { id: 'users', name: 'Quản lý người dùng', icon: FaUsers },
                { id: 'stats', name: 'Thống kê', icon: FaChartBar },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          {activeTab === 'posts' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quản lý bài viết</h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  Tạo bài viết mới
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Trạng thái</label>
                  <select
                    className="border px-3 py-2 rounded"
                    value={postFilter.status}
                    onChange={(e) => handleFilterPosts({ ...postFilter, status: e.target.value as any })}
                  >
                    <option value="all">Tất cả</option>
                    <option value="draft">Bản nháp</option>
                    <option value="published">Đã xuất bản</option>
                    <option value="archived">Lưu trữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Danh mục</label>
                  <select
                    className="border px-3 py-2 rounded"
                    value={postFilter.category}
                    onChange={(e) => handleFilterPosts({ ...postFilter, category: e.target.value as any })}
                  >
                    <option value="all">Tất cả</option>
                    <option value="nganh">Ngành</option>
                    <option value="doanh_nghiep">Doanh nghiệp</option>
                  </select>
                </div>
              </div>

              {postsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Đang tải...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8">
                  <FaFileAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có bài viết nào</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow" style={{ maxHeight: '60vh' }}>
                  <table className="w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                          Tiêu đề
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          Danh mục
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                          Lượt xem
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                          Ngày tạo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {posts.map((post) => (
                        <tr key={post.id}>
                          <td className="px-6 py-4 w-2/5">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {post.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap w-1/6">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              post.category === 'nganh' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {post.category === 'nganh' ? 'Ngành' : 'Doanh nghiệp'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap w-1/6">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              post.status === 'published' 
                                ? 'bg-green-100 text-green-800'
                                : post.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {post.status === 'published' ? 'Đã xuất bản' : 
                               post.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[8%]">
                            {post.view_count || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[10%]">
                            {new Date(post.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-[8%]">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingPost(post)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Chỉnh sửa"
                              >
                                <FaEdit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Xóa"
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination - Posts */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={async () => { 
                    if (postsPage > 1) { 
                      setPostsPage(postsPage - 1); 
                      await fetchPosts({ 
                        page: postsPage - 1, 
                        limit: postsLimit,
                        status: postFilter.status !== 'all' ? postFilter.status : undefined,
                        category: postFilter.category && postFilter.category !== 'all' ? postFilter.category : undefined,
                      }) 
                    } 
                  }}
                  disabled={postsPage <= 1}
                  className="px-3 py-2 border rounded disabled:opacity-50"
                >
                  Trang trước
                </button>
                <div className="text-sm text-gray-600">Trang {postsPagination?.page ?? postsPage}{postsPagination?.pages ? ` / ${postsPagination.pages}` : ''}</div>
                <button
                  onClick={async () => { 
                    setPostsPage(postsPage + 1); 
                    await fetchPosts({ 
                      page: postsPage + 1, 
                      limit: postsLimit,
                      status: postFilter.status !== 'all' ? postFilter.status : undefined,
                      category: postFilter.category && postFilter.category !== 'all' ? postFilter.category : undefined,
                    }) 
                  }}
                  className="px-3 py-2 border rounded"
                >
                  Trang sau
                </button>
              </div>
            </div>
          )}

          {activeTab === 'investment' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quản lý kiến thức đầu tư</h2>
                <button
                  onClick={() => setShowKnowledgeModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  Thêm kiến thức mới
                </button>
              </div>

              {/* Filter Section */}
              <div className="flex gap-4 mb-6">
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
                  <select
                    value={investmentFilter.status}
                    onChange={(e) => setInvestmentFilter(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">Tất cả</option>
                    <option value="draft">Bản nháp</option>
                    <option value="published">Đã xuất bản</option>
                    <option value="archived">Đã lưu trữ</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Danh mục:</label>
                  <select
                    value={investmentFilter.category_id}
                    onChange={(e) => setInvestmentFilter(prev => ({ ...prev, category_id: e.target.value }))}
                    className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {knowledgeLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Đang tải...</p>
                </div>
              ) : knowledge.length === 0 ? (
                <div className="text-center py-8">
                  <FaLightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có kiến thức đầu tư nào</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow" style={{ maxHeight: '60vh' }}>
                  <table className="w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                          Tiêu đề
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                          Ảnh
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                          Danh mục
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[6%]">
                          Lượt xem
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                          Ngày tạo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {knowledge.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 w-1/4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {item.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap w-1/8">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="h-12 w-12 object-cover rounded"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                                <FaLightbulb className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap w-1/8">
                            {item.category_name ? (
                              <span 
                                className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                style={{ backgroundColor: item.category_color + '20', color: item.category_color }}
                              >
                                {item.category_name}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">Chưa phân loại</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap w-1/8">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.status === 'published' 
                                ? 'bg-green-100 text-green-800'
                                : item.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status === 'published' ? 'Đã xuất bản' : 
                               item.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[6%]">
                            {item.view_count || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[8%]">
                            {new Date(item.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-[8%]">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingKnowledge(item)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Chỉnh sửa"
                              >
                                <FaEdit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteKnowledge(item.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Xóa"
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination - Investment */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={async () => { if (investmentPage > 1) { setInvestmentPage(investmentPage - 1); await fetchKnowledge({ page: investmentPage - 1, limit: investmentLimit }) } }}
                  disabled={knowledgePagination ? investmentPage <= 1 : true}
                  className="px-3 py-2 border rounded disabled:opacity-50"
                >
                  Trang trước
                </button>
                <div className="text-sm text-gray-600">Trang {knowledgePagination?.page ?? investmentPage}{knowledgePagination?.pages ? ` / ${knowledgePagination.pages}` : ''}</div>
                <button
                  onClick={async () => { setInvestmentPage(investmentPage + 1); await fetchKnowledge({ page: investmentPage + 1, limit: investmentLimit }) }}
                  className="px-3 py-2 border rounded"
                >
                  Trang sau
                </button>
              </div>
            </div>
          )}

          {activeTab === 'bookjourney' && (
            <div className="p-6">
              <BookJourneyManagement onClose={() => setActiveTab('posts')} />
            </div>
          )}


          {activeTab === 'post-categories' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quản lý danh mục bài viết</h2>
                <button
                  onClick={() => openCreatePostCategory('nganh')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  Thêm danh mục
                </button>
              </div>

              {/* Tabs for category types */}
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    {[
                      { id: 'nganh', name: 'Danh mục ngành', color: 'blue' },
                      { id: 'doanh_nghiep', name: 'Danh mục doanh nghiệp', color: 'green' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setSelectedPostCategoryType(tab.id as 'nganh' | 'doanh_nghiep')
                          fetchCategoriesByType(tab.id as 'nganh' | 'doanh_nghiep')
                        }}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          selectedPostCategoryType === tab.id
                            ? `border-${tab.color}-500 text-${tab.color}-600`
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {postCategoriesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Đang tải...</p>
                </div>
              ) : postCategories.length === 0 ? (
                <div className="text-center py-8">
                  <FaFileAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có danh mục nào cho {selectedPostCategoryType === 'nganh' ? 'ngành' : 'doanh nghiệp'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {postCategories.map((category) => (
                    <div key={category.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div 
                              className="w-4 h-4 rounded-full mr-3" 
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              category.category_type === 'nganh' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {category.category_type === 'nganh' ? 'Ngành' : 'Doanh nghiệp'}
                            </span>
                          </div>
                          {category.description && (
                            <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                          )}
                          <div className="text-xs text-gray-500">
                            {category.post_count || 0} bài viết
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => openEditPostCategory(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePostCategory(category.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'investment-categories' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quản lý danh mục kiến thức đầu tư</h2>
                <button
                  onClick={() => setShowInvestmentCategoryModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  Thêm danh mục
                </button>
              </div>

              {categoriesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Đang tải...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8">
                  <FaChartBar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có danh mục nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div 
                              className="w-4 h-4 rounded-full mr-3" 
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          </div>
                          {category.description && (
                            <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                          )}
                          <div className="text-xs text-gray-500">
                            {category.knowledge_count || 0} kiến thức
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => openEditInvestmentCategory(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInvestmentCategory(category.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'feedbacks' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quản lý phản hồi</h2>
              </div>

              <div className="mb-4 text-sm text-gray-600">Danh sách phản hồi đang chờ duyệt</div>

              {feedbacksLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Đang tải...</p>
                </div>
              ) : (feedbacks?.length || 0) === 0 ? (
                <div className="text-center py-8">
                  <FaComments className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có phản hồi nào</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow" style={{ maxHeight: '60vh' }}>
                  <table className="min-w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                          Tên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                          Công ty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                          Nội dung
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                          Đánh giá
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                          Ngày tạo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[7%]">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {feedbacks.map((feedback) => (
                        <tr key={feedback.id}>
                          <td className="px-6 py-4 whitespace-nowrap w-[15%]">
                            <div className="text-sm font-medium text-gray-900">
                              {feedback.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[15%]">
                            {feedback.company || '-'}
                          </td>
                          <td className="px-6 py-4 w-1/3">
                            <div className="text-sm text-gray-900 truncate max-w-xs">
                              {feedback.content}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[8%]">
                            {feedback.rating ? `${feedback.rating}/5` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap w-[12%]">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              feedback.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : feedback.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {feedback.status === 'approved' ? 'Đã duyệt' :
                               feedback.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[10%]">
                            {new Date(feedback.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-[7%]">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApproveFeedback(feedback.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Duyệt"
                              >
                                <FaCheck className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRejectFeedback(feedback.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Từ chối"
                              >
                                <FaTimes className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFeedback(feedback.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Xóa"
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* All feedbacks (approved & rejected) */}
              <div className="mt-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tất cả phản hồi</h3>
                {allFeedbacks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Chưa có phản hồi</div>
                ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow max-h-[60vh]">
                    <table className="min-w-full table-fixed divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Tên</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Công ty</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Nội dung</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Đánh giá</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Trạng thái</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Ngày tạo</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allFeedbacks.map((feedback) => (
                          <tr key={`all-${feedback.id}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-1/6">{feedback.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-1/6">{feedback.company || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 w-2/5 truncate">{feedback.content}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-1/12">{feedback.rating ? `${feedback.rating}/5` : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap w-1/6">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                feedback.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {feedback.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-1/6">{new Date(feedback.created_at).toLocaleDateString('vi-VN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pagination - Feedbacks */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={async () => { if (feedbacksPage > 1) { setFeedbacksPage(feedbacksPage - 1); await fetchFeedbacks({ page: feedbacksPage - 1, limit: feedbacksLimit, status: 'pending' }) } }}
                  disabled={feedbacksPagination ? feedbacksPage <= 1 : false}
                  className="px-3 py-2 border rounded disabled:opacity-50"
                >
                  Trang trước
                </button>
                <div className="text-sm text-gray-600">
                  {(() => {
                    const current = feedbacksPagination?.page ?? feedbacksPage;
                    const apiPages = feedbacksPagination?.pages;
                    const totalPages = apiPages && apiPages > 0
                      ? apiPages
                      : Math.max(1, Math.ceil((stats?.pending || 0) / feedbacksLimit));
                    return `Trang ${current} / ${totalPages}`;
                  })()}
                </div>
                <button
                  onClick={async () => { setFeedbacksPage(feedbacksPage + 1); await fetchFeedbacks({ page: feedbacksPage + 1, limit: feedbacksLimit, status: 'pending' }) }}
                  className="px-3 py-2 border rounded"
                >
                  Trang sau
                </button>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quản lý người dùng</h2>
                <button
                  onClick={openCreateUser}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  Thêm người dùng
                </button>
              </div>

              {usersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Đang tải...</p>
                </div>
              ) : (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
                  <table className="min-w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          Tên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          Vai trò
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          Ngày tạo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap w-1/6">
                            <div className="text-sm font-medium text-gray-900">
                              {user.full_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap w-1/4">
                            <div className="text-sm text-gray-900 truncate">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap w-1/6">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'admin' ? 'Admin' : 'Client'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap w-1/6">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.is_active ? 'Hoạt động' : 'Không hoạt động'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-1/6">
                            {new Date(user.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-1/12">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditUser(user)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Chỉnh sửa"
                              >
                                <FaEdit className="h-4 w-4" />
                              </button>
                              {/* Toggle active removed as requested */}
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Xóa"
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination - Users */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={async () => { if (usersPage > 1) { setUsersPage(usersPage - 1); await fetchUsers({ page: usersPage - 1, limit: usersLimit }) } }}
                  disabled={usersPage <= 1}
                  className="px-3 py-2 border rounded disabled:opacity-50"
                >
                  Trang trước
                </button>
                <div className="text-sm text-gray-600">Trang {usersPagination?.page ?? usersPage}{usersPagination?.pages ? ` / ${usersPagination.pages}` : ''}</div>
                <button
                  onClick={async () => { setUsersPage(usersPage + 1); await fetchUsers({ page: usersPage + 1, limit: usersLimit }) }}
                  className="px-3 py-2 border rounded"
                >
                  Trang sau
                </button>
              </div>

              {/* User Modal */}
              {showUserModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl max-w-xl w-full">
                    <div className="px-6 py-4 border-b">
                      <h3 className="text-lg font-semibold text-gray-900">{editingUserData ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</h3>
                    </div>
                    <form onSubmit={saveUser} className="p-6 space-y-4">
                      {!editingUserData && (
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Email</label>
                          <input type="email" className="w-full border rounded px-3 py-2" required value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Họ tên</label>
                        <input type="text" className="w-full border rounded px-3 py-2" required value={userForm.full_name} onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })} />
                      </div>
                      {!editingUserData && (
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Mật khẩu</label>
                          <input type="password" className="w-full border rounded px-3 py-2" required value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Vai trò</label>
                        <select className="w-full border rounded px-3 py-2" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}>
                          <option value="client">Client</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      {editingUserData && (
                        <div className="flex items-center gap-2">
                          <input id="active" type="checkbox" checked={userForm.is_active} onChange={(e) => setUserForm({ ...userForm, is_active: e.target.checked })} />
                          <label htmlFor="active" className="text-sm text-gray-700">Hoạt động</label>
                        </div>
                      )}
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={() => { setShowUserModal(false); setEditingUserData(null) }} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Thống kê</h2>
              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê phản hồi</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng phản hồi:</span>
                        <span className="font-semibold">{stats.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Đã duyệt:</span>
                        <span className="font-semibold text-green-600">{stats.approved}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chờ duyệt:</span>
                        <span className="font-semibold text-yellow-600">{stats.pending}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Từ chối:</span>
                        <span className="font-semibold text-red-600">{stats.rejected}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá trung bình</h3>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {Number(stats?.average_rating ?? 0).toFixed(1)}/5
                      </div>
                      <div className="text-gray-600">Sao trung bình</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố đánh giá</h3>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const keyMap: Record<number, keyof typeof stats> = {
                          5: 'five_stars' as any,
                          4: 'four_stars' as any,
                          3: 'three_stars' as any,
                          2: 'two_stars' as any,
                          1: 'one_stars' as any,
                        };
                        const key = keyMap[star] as any;
                        const count = Number((stats as any)?.[key] ?? 0);
                        const total = Number(stats?.total ?? 1);
                        const percent = Math.min(100, Math.max(0, (count / (total || 1)) * 100));
                        return (
                          <div key={star} className="flex items-center">
                            <span className="text-sm text-gray-600 w-8">{star} sao:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold w-8 text-right">
                              {count}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaChartBar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có dữ liệu thống kê</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Modal */}
      <PostModal
        isOpen={showCreateModal || !!editingPost}
        onClose={() => {
          setShowCreateModal(false)
          setEditingPost(null)
        }}
        onSave={handleSavePost}
        post={editingPost}
        loading={postsLoading}
      />

      {/* Investment Knowledge Modal */}
      <InvestmentKnowledgeModal
        isOpen={showKnowledgeModal || !!editingKnowledge}
        onClose={() => {
          setShowKnowledgeModal(false)
          setEditingKnowledge(null)
        }}
        onSave={handleSaveKnowledge}
        knowledge={editingKnowledge}
        loading={knowledgeLoading}
      />


      {/* Post Category Modal */}
      {showPostCategoryModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPostCategoryModal(false)
              setEditingPostCategory(null)
              setPostCategoryForm({ name: '', description: '', color: '#3B82F6', category_type: 'nganh' })
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingPostCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button
                onClick={() => {
                  setShowPostCategoryModal(false)
                  setEditingPostCategory(null)
                  setPostCategoryForm({ name: '', description: '', color: '#3B82F6', category_type: 'nganh' })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSavePostCategory(); }}>
              <div className="space-y-4">
                {/* Category Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại danh mục</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category_type"
                        value="nganh"
                        checked={postCategoryForm.category_type === 'nganh'}
                        onChange={(e) => setPostCategoryForm(prev => ({ ...prev, category_type: e.target.value as 'nganh' | 'doanh_nghiep' }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Ngành</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category_type"
                        value="doanh_nghiep"
                        checked={postCategoryForm.category_type === 'doanh_nghiep'}
                        onChange={(e) => setPostCategoryForm(prev => ({ ...prev, category_type: e.target.value as 'nganh' | 'doanh_nghiep' }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Doanh nghiệp</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên danh mục *
                  </label>
                  <input
                    type="text"
                    value={postCategoryForm.name}
                    onChange={(e) => setPostCategoryForm({ ...postCategoryForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên danh mục"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={postCategoryForm.description}
                    onChange={(e) => setPostCategoryForm({ ...postCategoryForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mô tả danh mục"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Màu sắc
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={postCategoryForm.color}
                      onChange={(e) => setPostCategoryForm({ ...postCategoryForm, color: e.target.value })}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={postCategoryForm.color}
                      onChange={(e) => setPostCategoryForm({ ...postCategoryForm, color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowPostCategoryModal(false)
                    setEditingPostCategory(null)
                    setPostCategoryForm({ name: '', description: '', color: '#3B82F6', category_type: 'nganh' })
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!postCategoryForm.name.trim() || postCategoriesLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {postCategoriesLoading ? 'Đang lưu...' : (editingPostCategory ? 'Cập nhật' : 'Tạo mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Investment Category Modal */}
      {showInvestmentCategoryModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowInvestmentCategoryModal(false)
              setEditingInvestmentCategory(null)
              setInvestmentCategoryForm({ name: '', description: '', color: '#3B82F6' })
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingInvestmentCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button
                onClick={() => {
                  setShowInvestmentCategoryModal(false)
                  setEditingInvestmentCategory(null)
                  setInvestmentCategoryForm({ name: '', description: '', color: '#3B82F6' })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveInvestmentCategory(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên danh mục *
                  </label>
                  <input
                    type="text"
                    value={investmentCategoryForm.name}
                    onChange={(e) => setInvestmentCategoryForm({ ...investmentCategoryForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên danh mục"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={investmentCategoryForm.description}
                    onChange={(e) => setInvestmentCategoryForm({ ...investmentCategoryForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mô tả danh mục"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Màu sắc
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={investmentCategoryForm.color}
                      onChange={(e) => setInvestmentCategoryForm({ ...investmentCategoryForm, color: e.target.value })}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={investmentCategoryForm.color}
                      onChange={(e) => setInvestmentCategoryForm({ ...investmentCategoryForm, color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowInvestmentCategoryModal(false)
                    setEditingInvestmentCategory(null)
                    setInvestmentCategoryForm({ name: '', description: '', color: '#3B82F6' })
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!investmentCategoryForm.name.trim() || categoriesLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {categoriesLoading ? 'Đang lưu...' : (editingInvestmentCategory ? 'Cập nhật' : 'Tạo mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard