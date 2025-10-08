import { apiClient } from './client';

// Investment Knowledge API
export const investmentKnowledgeApi = {
  // Lấy tất cả investment knowledge
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    const response = await apiClient.get('/investment-knowledge', { params });
    return response.data;
  },

  // Lấy investment knowledge theo ID
  getById: async (id: number) => {
    const response = await apiClient.get(`/investment-knowledge/${id}`);
    return response.data;
  },

  // Tạo investment knowledge mới
  create: async (data: {
    title: string;
    image_url?: string;
    content: string;
    meaning?: string;
    status?: 'draft' | 'published' | 'archived';
  }) => {
    const response = await apiClient.post('/investment-knowledge', data);
    return response.data;
  },

  // Cập nhật investment knowledge
  update: async (id: number, data: {
    title?: string;
    image_url?: string;
    content?: string;
    meaning?: string;
    status?: 'draft' | 'published' | 'archived';
  }) => {
    const response = await apiClient.put(`/investment-knowledge/${id}`, data);
    return response.data;
  },

  // Xóa investment knowledge
  delete: async (id: number) => {
    const response = await apiClient.delete(`/investment-knowledge/${id}`);
    return response.data;
  },

  // Lấy investment knowledge phổ biến
  getPopular: async (limit?: number) => {
    const response = await apiClient.get('/investment-knowledge/popular', {
      params: { limit }
    });
    return response.data;
  },

  // Lấy investment knowledge mới nhất
  getLatest: async (limit?: number) => {
    const response = await apiClient.get('/investment-knowledge/latest', {
      params: { limit }
    });
    return response.data;
  },

  // Tăng view count
  incrementView: async (id: number) => {
    const response = await apiClient.post(`/investment-knowledge/${id}/view`, {});
    return response.data;
  },
};
