"use client"

import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { FaEye, FaCalendar, FaUser, FaFileAlt, FaSearch } from "react-icons/fa"
import PostImage from "./PostImage"
import { usePosts } from "../../services/hooks/usePosts"
import { postsApi } from "../../services/api/posts"
import { useLanguage } from "../../contexts/LanguageContext"
import { useDebounce } from "../../hooks/useDebounce"

interface PostFeedProps {
  category: 'nganh' | 'doanh_nghiep'
  accentColor?: 'blue' | 'green'
  title: string
}

const PostFeed: React.FC<PostFeedProps> = ({ category, accentColor = 'blue', title }) => {
  const { t } = useLanguage()
  const { fetchPosts, posts, loading, pagination } = usePosts()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'latest' | 'popular'>('latest')
  const [isSearching, setIsSearching] = useState(false)
  
  // Debounce search để tránh gọi API quá nhiều
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    const load = async () => {
      setIsSearching(search !== debouncedSearch)
      await fetchPosts({ category, status: 'published', page, limit: 12, search: debouncedSearch }) as any
      setIsSearching(false)
    }
    load()
  }, [category, page, sort, debouncedSearch])

  const featured = useMemo(() => posts.slice(0, 3), [posts])
  const rest = useMemo(() => posts.slice(3), [posts])

  const resolveApiOrigin = () => {
    const raw = (process as any).env.NEXT_PUBLIC_API_URL || ''
    if (!raw) return 'http://localhost:5000/api/v1'
    try {
      return new URL(raw).origin
    } catch {
      // fallback: strip trailing /api/v1 if provided without protocol parsing
      return raw.replace(/\/api\/v1$/, '')
    }
  }

  const handleViewReport = async (post: any) => {
    try {
      // Tăng lượt xem
      await postsApi.incrementViewCount(post.id)
      
      // Xử lý PDF
      if (post.pdf_url) {
        let pdfUrl = post.pdf_url;
        
        // Nếu URL bắt đầu với /uploads/, sử dụng API route
        if (pdfUrl.startsWith('/uploads/')) {
          pdfUrl = `/api${pdfUrl}`;
        }
        
        // Nếu URL không có protocol, thêm domain
        if (!pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://') && !pdfUrl.startsWith('/api/')) {
          pdfUrl = `https://yt2future.com${pdfUrl}`;
        }
        
        // Mở PDF trong tab mới
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Không có PDF, chuyển đến trang chi tiết
        window.location.href = `/posts/${post.id}`;
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
      
      // Fallback: thử mở trực tiếp
      if (post.pdf_url) {
        const fallbackUrl = post.pdf_url.startsWith('/uploads/') 
          ? `/api${post.pdf_url}` 
          : post.pdf_url;
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = `/posts/${post.id}`;
      }
    }
  }

  const TagBg = accentColor === 'green' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
  const ButtonBg = 'btn-ltr-hover'

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
              placeholder={category === 'nganh' ? t('sector.search.placeholder') : t('analysis.search.placeholder')} 
              className="pl-9 pr-3 py-2 sm:py-2.5 border rounded-lg text-sm w-full sm:w-auto min-w-[200px]" 
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured row */}
      {loading ? (
        <div className="text-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">{t('analysis.loading')}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 sm:py-16 text-gray-500 text-sm sm:text-base">{t('analysis.no.reports')}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {/* Big feature */}
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            <PostImage src={featured[0]?.thumbnail_url} alt={featured[0]?.title} containerClassName="h-40 sm:h-64 md:h-72 lg:h-80 xl:h-[460px]" />
            <div className="p-4 sm:p-6">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${TagBg}`}>{category==='nganh'?t('analysis.category.nganh'):t('analysis.category.doanh_nghiep')}</span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-3 mb-3 leading-tight">{featured[0]?.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">{featured[0]?.content}</p>
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4 gap-2">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-1"><FaUser className="h-3 w-3 sm:h-4 sm:w-4" /><span className="truncate">{featured[0]?.author_name || 'Y&T Group'}</span></div>
                  <div className="flex items-center gap-1"><FaCalendar className="h-3 w-3 sm:h-4 sm:w-4" /><span>{featured[0]?.created_at ? new Date(featured[0].created_at).toLocaleDateString('vi-VN') : ''}</span></div>
                </div>
                <div className="flex items-center gap-1"><FaEye className="h-3 w-3 sm:h-4 sm:w-4" /><span>{featured[0]?.view_count || 0}</span></div>
              </div>
              <button onClick={()=>handleViewReport(featured[0])} className={`w-full ${ButtonBg} text-white px-4 py-2 sm:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base`}>
                <FaFileAlt className="h-3 w-3 sm:h-4 sm:w-4" /> {t('analysis.read.report')}
              </button>
            </div>
          </motion.div>

          {/* Side features */}
          <div className="grid grid-rows-2 gap-4 sm:gap-6">
            {featured.slice(1).map((post)=> (
              <motion.div key={post.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <PostImage src={post.thumbnail_url} alt={post.title} containerClassName="h-40 sm:h-40" />
                <div className="p-3 sm:p-4">
                  <span className={`inline-flex px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-full ${TagBg}`}>{category==='nganh'?t('analysis.category.nganh.short'):t('analysis.category.doanh_nghiep.short')}</span>
                  <h4 className="text-sm sm:text-base md:text-lg font-semibold mt-2 mb-2 line-clamp-2 leading-tight">{post.title}</h4>
                  <p className="text-gray-600 mb-3 text-xs sm:text-sm line-clamp-3">{post.content}</p>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mb-3 gap-2">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-1"><FaUser className="h-3 w-3 sm:h-4 sm:w-4" /><span className="truncate">{post.author_name || 'Y&T Group'}</span></div>
                      <div className="flex items-center gap-1"><FaCalendar className="h-3 w-3 sm:h-4 sm:w-4" /><span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span></div>
                    </div>
                    <div className="flex items-center gap-1"><FaEye className="h-3 w-3 sm:h-4 sm:w-4" /><span>{post.view_count}</span></div>
                  </div>
                  <button onClick={()=>handleViewReport(post)} className={`w-full ${ButtonBg} text-white px-3 py-2 rounded-lg text-xs sm:text-sm`}>{t('analysis.read.report')}</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {rest.map((post) => (
            <motion.div key={post.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <PostImage src={post.thumbnail_url} alt={post.title} containerClassName="h-40 sm:h-48" />
              <div className="p-4 sm:p-5">
                <h5 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2 leading-tight">{post.title}</h5>
                <p className="text-gray-600 mb-3 text-xs sm:text-sm line-clamp-3">{post.content}</p>
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 gap-2">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-1"><FaUser className="h-3 w-3 sm:h-4 sm:w-4" /><span className="truncate">{post.author_name || 'Y&T Group'}</span></div>
                    <div className="flex items-center gap-1"><FaCalendar className="h-3 w-3 sm:h-4 sm:w-4" /><span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span></div>
                  </div>
                  <div className="flex items-center gap-1"><FaEye className="h-3 w-3 sm:h-4 sm:w-4" /><span>{post.view_count}</span></div>
                </div>
                <button onClick={()=>handleViewReport(post)} className={`w-full ${ButtonBg} text-white px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2`}><FaFileAlt className="h-3 w-3 sm:h-4 sm:w-4"/>{t('analysis.read')}</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Load more */}
      {!!pagination && page < (pagination.pages || 1) && (
        <div className="text-center mt-8 sm:mt-10">
          <button onClick={()=> setPage(p=> p+1)} className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gray-900 text-white hover:bg-black text-sm sm:text-base transition-colors">{t('analysis.view.more')}</button>
        </div>
      )}
    </div>
  )
}

export default PostFeed

