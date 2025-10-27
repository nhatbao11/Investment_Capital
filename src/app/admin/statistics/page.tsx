"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../services/hooks/useAuth'
import { useSimpleStats } from '../../../services/hooks/useSimpleStats'
import { FaArrowLeft, FaChartLine, FaUsers, FaEye, FaCalendar, FaDesktop, FaMobile } from 'react-icons/fa'

const StatisticsPage: React.FC = () => {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { getSimpleStats, getDashboardOverview, loading, error } = useSimpleStats()
  
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [stats, setStats] = useState<any>(null)
  const [overview, setOverview] = useState<any>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, selectedPeriod])

  const loadData = async () => {
    try {
      const [statsData, overviewData] = await Promise.all([
        getSimpleStats(selectedPeriod),
        getDashboardOverview()
      ])
      
      setStats(statsData)
      setOverview(overviewData)
    } catch (err) {
      console.error('Error loading data:', err)
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

  const periods = [
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
    { value: 'year', label: 'Năm này' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <FaChartLine className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Thống kê truy cập</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Selector */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Chọn khoảng thời gian</h2>
            <div className="flex flex-wrap gap-2">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FaUsers className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Hôm nay</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.today.unique_ips}</p>
                  <p className="text-sm text-gray-500">{overview.today.total_visits} lượt truy cập</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FaCalendar className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tuần này</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.week.unique_ips}</p>
                  <p className="text-sm text-gray-500">{overview.week.total_visits} lượt truy cập</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <FaChartLine className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tháng này</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.month.unique_ips}</p>
                  <p className="text-sm text-gray-500">{overview.month.total_visits} lượt truy cập</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <FaEye className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Năm này</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.year.unique_ips}</p>
                  <p className="text-sm text-gray-500">{overview.year.total_visits} lượt truy cập</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Stats */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Total Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thống kê {periods.find(p => p.value === selectedPeriod)?.label}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <FaUsers className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-700">Số IP duy nhất</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{stats.total_visits.unique_ips}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <FaEye className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-700">Tổng lượt truy cập</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats.total_visits.total_visits}</span>
                </div>
              </div>
            </div>

            {/* Content Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê theo nội dung</h3>
              <div className="space-y-3">
                {stats.content_stats.map((content: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-700">
                        {content.resource_type === 'post' && 'Bài viết'}
                        {content.resource_type === 'investment_knowledge' && 'Kiến thức đầu tư'}
                        {content.resource_type === 'bookjourney' && 'Hành trình sách'}
                      </span>
                      <p className="text-sm text-gray-500">{content.unique_ips} IP duy nhất</p>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{content.total_visits}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Daily/Monthly Breakdown */}
        {(stats?.daily_stats?.length > 0 || stats?.monthly_stats?.length > 0) && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Chi tiết theo {selectedPeriod === 'week' ? 'ngày' : 'tháng'}
              </h3>
              <div className="space-y-3">
                {(stats.daily_stats || stats.monthly_stats || []).map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-700">
                        {selectedPeriod === 'week' 
                          ? new Date(item.date).toLocaleDateString('vi-VN')
                          : `Tháng ${item.month}`
                        }
                      </span>
                      <p className="text-sm text-gray-500">{item.unique_ips} IP duy nhất</p>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{item.total_visits}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Đang tải...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatisticsPage