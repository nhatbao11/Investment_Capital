import { apiClient } from './client';
import { Feedback, CreateFeedbackRequest, FeedbackStats } from '../types/feedbacks';
import { PaginatedResponse, Pagination } from '../api/config';

export const feedbacksApi = {
  // Lấy danh sách feedbacks
  getFeedbacks: async (params?: {
    page?: number;
    limit?: number;
    rating?: number;
    status?: 'pending' | 'approved' | 'rejected';
  }): Promise<PaginatedResponse<Feedback>> => {
    const response = await apiClient.get<{ feedbacks: Feedback[]; pagination: Pagination }>('/feedbacks', { params });
    return {
      data: response.data.feedbacks,
      pagination: response.data.pagination,
    };
  },

  // Tạo feedback mới
  createFeedback: async (data: CreateFeedbackRequest): Promise<Feedback> => {
    const response = await apiClient.post<{ feedback: Feedback }>('/feedbacks', data);
    return response.data.feedback as Feedback;
  },

  // Lấy feedbacks chờ duyệt (Admin only)
  getPendingFeedbacks: async (limit?: number): Promise<Feedback[]> => {
    const response = await apiClient.get<{ feedbacks: Feedback[] }>('/feedbacks/pending', { 
      params: { limit } 
    });
    return response.data.feedbacks as Feedback[];
  },

  // Duyệt feedback (Admin only)
  approveFeedback: async (id: number, adminNotes?: string): Promise<Feedback> => {
    const response = await apiClient.put<{ feedback: Feedback }>(`/feedbacks/${id}/approve`, {
      admin_notes: adminNotes
    });
    return response.data.feedback as Feedback;
  },

  // Từ chối feedback (Admin only)
  rejectFeedback: async (id: number, adminNotes?: string): Promise<Feedback> => {
    const response = await apiClient.put<{ feedback: Feedback }>(`/feedbacks/${id}/reject`, {
      admin_notes: adminNotes
    });
    return response.data.feedback as Feedback;
  },

  // Xóa feedback (Admin only)
  deleteFeedback: async (id: number): Promise<void> => {
    await apiClient.delete(`/feedbacks/${id}`);
  },

  // Lấy thống kê feedbacks (Admin only)
  getFeedbackStats: async (): Promise<FeedbackStats> => {
    const response = await apiClient.get<{ stats: FeedbackStats }>('/feedbacks/stats');
    return response.data.stats as FeedbackStats;
  }
};





