"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../services/hooks/useAuth'
import { useViewTracking } from '../../../services/hooks/useViewTracking'
import { FaArrowLeft, FaChartLine, FaUsers, FaEye, FaUser, FaCalendar, FaTrophy, FaDesktop, FaMobile, FaChrome, FaSafari, FaFirefox, FaChartBar, FaSignInAlt } from 'react-icons/fa'
import { useLanguage } from '../../../contexts/LanguageContext'

const StatisticsPage: React.FC = () => {
  const router = useRouter()
  const { t } = useLanguage()
  const { user, loading: authLoading } = useAuth()
  const { getOverallStats, getTopContent, getDashboardStats, getRealStatistics, loading, error } = useViewTracking()
  
  const [timeRange, setTimeRange] = useState(30)
  const [overallStats, setOverallStats] = useState<any>(null)
  const [topContent, setTopContent] = useState<any[]>([])
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [contentBreakdown, setContentBreakdown] = useState<any>(null)
  const [selectedContentType, setSelectedContentType] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadStatistics()
    }
  }, [user, timeRange, selectedContentType])

  const loadStatistics = async () => {
    try {
      setIsLoading(true)
      
      // Thử gọi API thật trước
      try {
        const realData = await getRealStatistics()
        if (realData) {
          setOverallStats(realData.overallStats)
          setTopContent(realData.topContent || [])
          setDashboardStats(realData.dashboardStats)
          setContentBreakdown(realData.contentBreakdown)
          return
        }
      } catch (realApiError) {
        console.log('Real API failed, trying view tracking API:', realApiError)
      }
      
      // Nếu API thật không hoạt động, thử API view tracking
      const [overall, top, dashboard] = await Promise.all([
        getOverallStats(timeRange),
        getTopContent(selectedContentType === 'all' ? undefined : selectedContentType as any, 10, timeRange),
        getDashboardStats(timeRange)
      ])
      
      setOverallStats(overall)
      setTopContent(top || [])
      setDashboardStats(dashboard)
    } catch (err) {
      console.error('Error loading statistics:', err)
      // Nếu tất cả API lỗi, hiển thị dữ liệu rỗng
      setOverallStats(null)
      setTopContent([])
      setDashboardStats(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin')}
                className="mr-4 p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
              >
                <FaArrowLeft className="h-5 w-5 mr-2" />
                Quay về Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaChartLine className="h-6 w-6 mr-3 text-blue-600" />
                  Thống kê chi tiết
                </h1>
                <p className="text-gray-600 mt-1">Phân tích lượt xem và hành vi người dùng</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={7}>7 ngày gần nhất</option>
                <option value={30}>30 ngày gần nhất</option>
                <option value={90}>90 ngày gần nhất</option>
                <option value={180}>6 tháng gần nhất</option>
                <option value={365}>1 năm gần nhất</option>
                <option value={730}>2 năm gần nhất</option>
                <option value={1095}>3 năm gần nhất</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">Lỗi: {error}</p>
          </div>
        ) : !overallStats && topContent.length === 0 && !dashboardStats ? (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-100 border border-yellow-200 rounded-xl p-8 text-center shadow-lg">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Chưa có dữ liệu thống kê</h3>
            <p className="text-gray-600 mb-6 text-lg">
              Hệ thống chưa có dữ liệu view tracking. Hãy để người dùng truy cập các bài viết, kiến thức đầu tư và hành trình sách để tạo dữ liệu thống kê.
            </p>
            <div className="bg-white p-6 rounded-lg border border-yellow-300 shadow-md">
              <p className="text-gray-700 mb-4">
                💡 <strong>Gợi ý:</strong> Hãy chia sẻ link website với bạn bè để tăng lượt truy cập và tạo dữ liệu thống kê!
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/admin')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Quay về Dashboard
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Tải lại trang
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overall Statistics */}
            {overallStats && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl shadow-lg p-8 border border-blue-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <FaChartLine className="h-6 w-6 mr-3 text-blue-600" />
                  📊 Thống kê tổng quan ({timeRange} ngày)
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <FaUsers className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Lượt truy cập duy nhất</p>
                        <p className="text-3xl font-bold text-blue-900">
                          {overallStats.unique_visitors?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-gray-500">Người dùng thật</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-full">
                        <FaEye className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Tổng lượt xem</p>
                        <p className="text-3xl font-bold text-green-900">
                          {overallStats.total_views?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-gray-500">Tất cả lượt xem</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <FaSignInAlt className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Người dùng đăng nhập</p>
                        <p className="text-3xl font-bold text-purple-900">
                          {overallStats.logged_in_users?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-gray-500">Đã xác thực</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 bg-orange-100 rounded-full">
                        <FaUser className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Khách truy cập</p>
                        <p className="text-3xl font-bold text-orange-900">
                          {overallStats.anonymous_users?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-gray-500">Chưa đăng nhập</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Type Filter */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-100 rounded-xl shadow-lg p-8 border border-indigo-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaChartBar className="h-6 w-6 mr-3 text-indigo-600" />
                🔍 Lọc theo loại nội dung
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setSelectedContentType('all')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedContentType === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                  }`}
                >
                  🌐 Tất cả
                </button>
                <button
                  onClick={() => setSelectedContentType('post')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedContentType === 'post'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                  }`}
                >
                  📄 Bài viết
                </button>
                <button
                  onClick={() => setSelectedContentType('investment_knowledge')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedContentType === 'investment_knowledge'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                  }`}
                >
                  💡 Kiến thức đầu tư
                </button>
                <button
                  onClick={() => setSelectedContentType('bookjourney')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedContentType === 'bookjourney'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                  }`}
                >
                  📚 Hành trình sách
                </button>
              </div>
            </div>

            {/* Top Content */}
            {topContent.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-xl shadow-lg p-8 border border-yellow-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <FaTrophy className="h-6 w-6 mr-3 text-yellow-600" />
                  🏆 Top 10 nội dung được xem nhiều nhất
                </h2>
                
                <div className="space-y-4">
                  {topContent.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-yellow-400">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-6 shadow-md">
                            <span className="text-lg font-bold text-white">#{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {item.title || item.name || `ID: ${item.resource_id}`}
                            </h3>
                            <div className="flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                item.resource_type === 'post' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : item.resource_type === 'investment_knowledge'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {item.resource_type === 'post' && '📄 Bài viết'}
                                {item.resource_type === 'investment_knowledge' && '💡 Kiến thức đầu tư'}
                                {item.resource_type === 'bookjourney' && '📚 Hành trình sách'}
                              </span>
                              <span className="text-sm text-gray-500">
                                ID: {item.resource_id}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-yellow-600">
                            {item.unique_visitors?.toLocaleString() || 0}
                          </div>
                          <div className="text-sm text-gray-500 font-medium">lượt xem</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Breakdown */}
            {contentBreakdown && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-xl shadow-lg p-8 border border-purple-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <FaChartBar className="h-6 w-6 mr-3 text-purple-600" />
                  📈 Chi tiết theo loại nội dung
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Posts */}
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      📄 Bài viết
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng số bài viết:</span>
                        <span className="font-bold text-blue-600">{contentBreakdown.posts?.total || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng lượt xem:</span>
                        <span className="font-bold text-blue-600">{contentBreakdown.posts?.total_views?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trung bình lượt xem:</span>
                        <span className="font-bold text-blue-600">{Math.round(contentBreakdown.posts?.avg_views || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Investment Knowledge */}
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      💡 Kiến thức đầu tư
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng số kiến thức:</span>
                        <span className="font-bold text-green-600">{contentBreakdown.knowledge?.total || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng lượt xem:</span>
                        <span className="font-bold text-green-600">{contentBreakdown.knowledge?.total_views?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trung bình lượt xem:</span>
                        <span className="font-bold text-green-600">{Math.round(contentBreakdown.knowledge?.avg_views || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* BookJourney */}
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      📚 Hành trình sách
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng số hành trình:</span>
                        <span className="font-bold text-purple-600">{contentBreakdown.books?.total || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng lượt xem:</span>
                        <span className="font-bold text-purple-600">{contentBreakdown.books?.total_views?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trung bình lượt xem:</span>
                        <span className="font-bold text-purple-600">{Math.round(contentBreakdown.books?.avg_views || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Yearly Statistics */}
            {dashboardStats?.yearly_stats && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-100 rounded-xl shadow-lg p-8 border border-indigo-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <FaCalendar className="h-6 w-6 mr-3 text-indigo-600" />
                  📅 Thống kê theo năm
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Posts by Year */}
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      📄 Bài viết theo năm
                    </h3>
                    <div className="space-y-3">
                      {dashboardStats.yearly_stats.posts?.slice(0, 3).map((year: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-700 font-semibold">{year.year}</span>
                          <div className="text-right">
                            <div className="font-bold text-blue-900">{year.count} bài</div>
                            <div className="text-sm text-blue-600">{year.views?.toLocaleString() || 0} lượt xem</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Knowledge by Year */}
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      💡 Kiến thức theo năm
                    </h3>
                    <div className="space-y-3">
                      {dashboardStats.yearly_stats.knowledge?.slice(0, 3).map((year: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="text-green-700 font-semibold">{year.year}</span>
                          <div className="text-right">
                            <div className="font-bold text-green-900">{year.count} bài</div>
                            <div className="text-sm text-green-600">{year.views?.toLocaleString() || 0} lượt xem</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Books by Year */}
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      📚 Hành trình theo năm
                    </h3>
                    <div className="space-y-3">
                      {dashboardStats.yearly_stats.books?.slice(0, 3).map((year: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                          <span className="text-purple-700 font-semibold">{year.year}</span>
                          <div className="text-right">
                            <div className="font-bold text-purple-900">{year.count} bài</div>
                            <div className="text-sm text-purple-600">{year.views?.toLocaleString() || 0} lượt xem</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard Stats */}
            {dashboardStats && (
              <div className="bg-gradient-to-r from-green-50 to-teal-100 rounded-xl shadow-lg p-8 border border-green-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <FaCalendar className="h-6 w-6 mr-3 text-green-600" />
                  📅 Thống kê chi tiết theo thời gian
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Daily Stats */}
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <FaCalendar className="h-5 w-5 mr-2 text-blue-600" />
                      📊 Thống kê theo ngày
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-blue-700 font-semibold">Hôm nay</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-900">
                            {dashboardStats.today?.unique_visitors?.toLocaleString() || 0}
                          </div>
                          <div className="text-sm text-blue-600">lượt truy cập</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-500">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-green-700 font-semibold">Tuần này</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-900">
                            {dashboardStats.this_week?.unique_visitors?.toLocaleString() || 0}
                          </div>
                          <div className="text-sm text-green-600">lượt truy cập</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-l-4 border-purple-500">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-purple-700 font-semibold">Tháng này</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-900">
                            {dashboardStats.this_month?.unique_visitors?.toLocaleString() || 0}
                          </div>
                          <div className="text-sm text-purple-600">lượt truy cập</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Device Stats */}
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <FaDesktop className="h-5 w-5 mr-2 text-indigo-600" />
                      📱 Thiết bị truy cập
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg border-l-4 border-indigo-500">
                        <div className="flex items-center">
                          <FaDesktop className="h-6 w-6 text-indigo-600 mr-3" />
                          <span className="text-indigo-700 font-semibold">Desktop</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-900">
                            {dashboardStats.device_stats?.desktop || 0}%
                          </div>
                          <div className="text-sm text-indigo-600">truy cập</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border-l-4 border-emerald-500">
                        <div className="flex items-center">
                          <FaMobile className="h-6 w-6 text-emerald-600 mr-3" />
                          <span className="text-emerald-700 font-semibold">Mobile</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-900">
                            {dashboardStats.device_stats?.mobile || 0}%
                          </div>
                          <div className="text-sm text-emerald-600">truy cập</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatisticsPage
