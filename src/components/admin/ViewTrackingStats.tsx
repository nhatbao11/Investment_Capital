import React, { useState, useEffect } from 'react';
import { useViewTracking } from '../../services/hooks/useViewTracking';

interface ViewTrackingStatsProps {
  resourceType?: 'post' | 'investment_knowledge' | 'bookjourney';
  resourceId?: number;
  days?: number;
}

const ViewTrackingStats: React.FC<ViewTrackingStatsProps> = ({
  resourceType,
  resourceId,
  days = 30
}) => {
  const { getResourceStats, getOverallStats, getTopContent, loading, error } = useViewTracking();
  const [stats, setStats] = useState<any>(null);
  const [topContent, setTopContent] = useState<any[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      if (resourceType && resourceId) {
        // Lấy thống kê cho resource cụ thể
        const resourceStats = await getResourceStats(resourceType, resourceId, days);
        setStats(resourceStats);
      } else {
        // Lấy thống kê tổng quan
        const overallStats = await getOverallStats(days);
        setStats(overallStats);
      }

      // Lấy top content
      const top = await getTopContent(resourceType, 10, days);
      setTopContent(top || []);
    };

    loadStats();
  }, [resourceType, resourceId, days, getResourceStats, getOverallStats, getTopContent]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Thống kê lượt xem ({days} ngày gần nhất)
      </h3>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.unique_visitors || 0}
            </div>
            <div className="text-sm text-blue-600">Lượt truy cập duy nhất</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.total_views || 0}
            </div>
            <div className="text-sm text-green-600">Tổng lượt xem</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {stats.logged_in_users || 0}
            </div>
            <div className="text-sm text-purple-600">Người dùng đã đăng nhập</div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {stats.anonymous_users || 0}
            </div>
            <div className="text-sm text-orange-600">Khách truy cập</div>
          </div>
        </div>
      )}

      {topContent.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            Nội dung được xem nhiều nhất
          </h4>
          <div className="space-y-2">
            {topContent.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 truncate">
                    {item.title || item.name || `ID: ${item.resource_id}`}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.resource_type === 'post' && 'Bài viết'}
                    {item.resource_type === 'investment_knowledge' && 'Kiến thức đầu tư'}
                    {item.resource_type === 'bookjourney' && 'Hành trình sách'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">
                    {item.unique_visitors || 0}
                  </div>
                  <div className="text-xs text-gray-500">lượt xem</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTrackingStats;
