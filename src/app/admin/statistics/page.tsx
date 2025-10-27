"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../services/hooks/useAuth'
import { FaArrowLeft, FaChartLine, FaUsers } from 'react-icons/fa'

const StatisticsPage: React.FC = () => {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [selectedDate, setSelectedDate] = useState('')
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, selectedPeriod, selectedDate])

  const loadData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        // Set default nếu không có token
        setStats({ total_visits: { unique_ips: 0, total_visits: 0 } })
        return
      }

      let url = `http://localhost:5000/api/v1/simple-stats?period=${selectedPeriod}`
      
      // Nếu chọn ngày cụ thể
      if (selectedDate && selectedPeriod === 'custom') {
        url += `&date=${selectedDate}`
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        // Set default nếu lỗi
        setStats({ total_visits: { unique_ips: 0, total_visits: 0 } })
        return
      }

      const data = await response.json()
      setStats(data.data)
    } catch (err) {
      console.error('Error loading data:', err)
      // Set default nếu catch error
      setStats({ total_visits: { unique_ips: 0, total_visits: 0 } })
    } finally {
      setLoading(false)
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
    { value: 'year', label: 'Năm này' },
    { value: 'custom', label: 'Chọn ngày' }
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
            <div className="flex flex-wrap gap-2 mb-4">
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
            
            {/* Date picker cho custom date */}
            {selectedPeriod === 'custom' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn ngày
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Stats Display */}
        {!loading && stats && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Số người đã ghé thăm trang web: {stats.total_visits.unique_ips}
            </h2>
            <p className="text-gray-600 mb-4">
              {selectedPeriod === 'today' && 'Hôm nay'}
              {selectedPeriod === 'week' && 'Tuần này'}
              {selectedPeriod === 'month' && 'Tháng này'}
              {selectedPeriod === 'year' && 'Năm này'}
              {selectedPeriod === 'custom' && `Ngày ${selectedDate}`}
            </p>
            <div className="flex items-center">
              <FaUsers className="h-12 w-12 text-blue-600 mr-4" />
              <div>
                <p className="text-4xl font-bold text-gray-900">{stats.total_visits.unique_ips}</p>
                <p className="text-sm text-gray-500">người</p>
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
      </div>
    </div>
  )
}

export default StatisticsPage