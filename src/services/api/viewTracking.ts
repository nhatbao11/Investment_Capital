import { apiClient } from './client';

// View Tracking API
export const viewTrackingApi = {
  // Track view cho resource
  trackView: async (resourceType: 'post' | 'investment_knowledge' | 'bookjourney', resourceId: number) => {
    const response = await apiClient.post(`/view-tracking/${resourceType}/${resourceId}`);
    return response.data;
  },

  // Lấy thống kê view cho resource
  getResourceStats: async (resourceType: 'post' | 'investment_knowledge' | 'bookjourney', resourceId: number, days: number = 30) => {
    const response = await apiClient.get(`/view-tracking/stats/${resourceType}/${resourceId}`, {
      params: { days }
    });
    return response.data;
  },

  // Lấy thống kê tổng quan
  getOverallStats: async (days: number = 30) => {
    const response = await apiClient.get('/view-tracking/overall', {
      params: { days }
    });
    return response.data;
  },

  // Lấy top content
  getTopContent: async (resourceType?: 'post' | 'investment_knowledge' | 'bookjourney', limit: number = 10, days: number = 30) => {
    const response = await apiClient.get('/view-tracking/top', {
      params: { resource_type: resourceType, limit, days }
    });
    return response.data;
  },

  // Lấy thống kê dashboard
  getDashboardStats: async (days: number = 30) => {
    const response = await apiClient.get('/view-tracking/dashboard', {
      params: { days }
    });
    return response.data;
  },

  // Lấy thống kê thật từ database
  getRealStatistics: async () => {
    const response = await apiClient.get('/statistics/real');
    return response.data;
  }
};
