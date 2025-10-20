"use client"

import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { FaEye, FaCalendar, FaUser, FaFileAlt, FaSearch } from "react-icons/fa"
import { useLanguage } from "../../contexts/LanguageContext"
import { categoriesAPI, Category } from "../../services/api/categories"
import { useDebounce } from "../../hooks/useDebounce"
import { getApiBaseUrl, resolveFileUrl, resolvePdfUrl } from "../../utils/apiConfig"

// Interface cho dữ liệu investment từ admin
interface InvestmentPost {
  id: number;
  title: string;
  image_url: string;
  images: string[];
  content: string;
  pdf_url?: string;
  meaning: string;
  created_at: string;
  view_count: number;
  status: string;
  category_id?: number;
  category_name?: string;
  category_color?: string;
}

interface InvestmentFeedProps {
  title: string
}

const InvestmentFeed: React.FC<InvestmentFeedProps> = ({ title }) => {
  const { t } = useLanguage()
  const [posts, setPosts] = useState<InvestmentPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  
  // Debounce search để tránh gọi API quá nhiều
  const debouncedSearch = useDebounce(search, 500)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoriesAPI.getAll();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch posts với pagination
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setIsSearching(search !== debouncedSearch);
        
        const API_BASE = getApiBaseUrl();
        
        // Check if user is admin to show all statuses
        let userRole = null;
        if (typeof window !== 'undefined') {
          userRole = localStorage.getItem('userRole');
        }
        const isAdmin = userRole === 'admin';
        const statusParam = isAdmin ? 'all' : 'published';
        
        // Build query parameters với pagination
        const params = new URLSearchParams({
          status: statusParam,
          page: page.toString(),
          limit: '12' // Giảm từ 100 xuống 12 để mượt mà hơn
        });
        
        if (debouncedSearch) {
          params.append('search', debouncedSearch);
        }
        
        if (selectedCategory) {
          params.append('category_id', selectedCategory.toString());
        }
        
        const url = `${API_BASE}/investment-knowledge?${params}`;

        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        
        // Sort by created_at ASC (oldest first)
        const sortedPosts = data.data.knowledge.sort((a: InvestmentPost, b: InvestmentPost) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        
        // Nếu là page 1, replace posts, nếu không thì append
        if (page === 1) {
          setPosts(sortedPosts);
        } else {
          setPosts(prev => [...prev, ...sortedPosts]);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching investment knowledge:', err);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };

    fetchPosts();
  }, [debouncedSearch, selectedCategory, page]);

  // Reset page khi search hoặc category thay đổi
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory]);

  const resolveApiOrigin = () => {
    const raw = (process as any).env.NEXT_PUBLIC_API_URL || ''
    if (!raw) return 'http://localhost:5000/api/v1'
    try {
      return new URL(raw).origin
    } catch {
      return raw.replace(/\/api\/v1$/, '')
    }
  }

  const handleViewReport = async (post: InvestmentPost) => {
    try {
      // Tăng view count
      try {
        await fetch(`${getApiBaseUrl()}/investment-knowledge/${post.id}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }

      // Xử lý PDF - sử dụng pdf_url field
      const pdfUrl = post.pdf_url || post.content;
      
      if (pdfUrl) {
        const resolvedUrl = resolvePdfUrl(pdfUrl);
        window.open(resolvedUrl, '_blank', 'noopener,noreferrer');
      } else {
        alert('Không có file PDF để mở');
      }
    } catch (error) {
      console.error('Error opening report:', error);
      alert('Không thể mở file PDF');
    }
  }

  return (
    <div className="max-w-7xl mx-auto pt-8 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-3 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{title}</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input 
              value={search} 
              onChange={(e)=>{ setPage(1); setSearch(e.target.value) }} 
              placeholder="Tìm kiếm kiến thức đầu tư..." 
              className="pl-9 pr-3 py-2 sm:py-2.5 border rounded-lg text-sm w-full sm:w-auto min-w-[200px]" 
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          <select 
            value={selectedCategory || ''} 
            onChange={(e)=>{ setPage(1); setSelectedCategory(e.target.value ? parseInt(e.target.value) : null) }} 
            className="border rounded-lg px-3 py-2 sm:py-2.5 text-sm w-full sm:w-auto"
          >
            <option value="">{t('common.all_categories')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid layout - đều nhau như cũ */}
      {loading && page === 1 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Đang tải nội dung...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 sm:py-16 text-gray-500 text-sm sm:text-base">
          <div className="text-lg mb-2">{t("investment.no.content")}</div>
          <p className="text-sm text-gray-400">{t("investment.no.content.subtitle")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <motion.div 
              key={post.id} 
              initial={{opacity:0,y:20}} 
              whileInView={{opacity:1,y:0}} 
              viewport={{once:true}} 
              className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                {post.image_url ? (
                  <img 
                    src={resolveFileUrl(post.image_url)}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                )}
                
                {/* Status badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  {post.status === 'draft' && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      Bản nháp
                    </span>
                  )}
                  {post.status === 'archived' && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                      Lưu trữ
                    </span>
                  )}
                  {post.category_name && (
                    <span 
                      className="px-2 py-1 text-white text-xs font-medium rounded-full"
                      style={{ backgroundColor: post.category_color || '#3b82f6' }}
                    >
                      {post.category_name}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                {post.category_name && (
                  <div className="mb-2">
                    <span 
                      className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                      style={{ backgroundColor: post.category_color || '#6B7280' }}
                    >
                      {post.category_name}
                    </span>
                  </div>
                )}
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                
                {post.meaning && (
                  <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3">
                    {post.meaning}
                  </p>
                )}

                {/* Meta info */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                  <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                  <span>{post.view_count} lượt xem</span>
                </div>

                {/* Action button */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewReport(post)}
                    className="w-full px-3 py-2 rounded-lg text-sm font-semibold btn-ltr-hover flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Xem PDF
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Load more removed per request */}
    </div>
  )
}

export default InvestmentFeed
