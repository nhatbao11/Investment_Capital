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
    const response = await apiClient.get<{ feedbacks?: Feedback[]; pagination?: Pagination }>('/feedbacks', { params });
    const payload = (response as any)?.data as { feedbacks?: Feedback[]; pagination?: Pagination } | undefined;
    return {
      data: payload?.feedbacks ?? [],
      pagination: payload?.pagination ?? { page: params?.page || 1, limit: params?.limit || 10, pages: 1, total: 0 },
    } as PaginatedResponse<Feedback>;
  },

  // Tạo feedback mới
  createFeedback: async (data: CreateFeedbackRequest): Promise<Feedback> => {
    const response = await apiClient.post<{ feedback?: Feedback }>('/feedbacks', data);
    const payload = (response as any)?.data as { feedback?: Feedback } | undefined;
    if (!payload?.feedback) throw new Error('Invalid create feedback response');
    return payload.feedback as Feedback;
  },

  // Lấy feedbacks chờ duyệt (Admin only)
  getPendingFeedbacks: async (limit?: number): Promise<Feedback[]> => {
    const response = await apiClient.get<{ feedbacks?: Feedback[] }>('/feedbacks/pending', { 
      params: { limit } 
    });
    return ((response as any)?.data?.feedbacks ?? []) as Feedback[];
  },

  // Duyệt feedback (Admin only)
  approveFeedback: async (id: number, adminNotes?: string): Promise<Feedback> => {
    const response = await apiClient.put<{ feedback?: Feedback }>(`/feedbacks/${id}/approve`, {
      admin_notes: adminNotes
    });
    const payload = (response as any)?.data as { feedback?: Feedback } | undefined;
    if (!payload?.feedback) throw new Error('Invalid approve response');
    return payload.feedback as Feedback;
  },

  // Từ chối feedback (Admin only)
  rejectFeedback: async (id: number, adminNotes?: string): Promise<Feedback> => {
    const response = await apiClient.put<{ feedback?: Feedback }>(`/feedbacks/${id}/reject`, {
      admin_notes: adminNotes
    });
    const payload = (response as any)?.data as { feedback?: Feedback } | undefined;
    if (!payload?.feedback) throw new Error('Invalid reject response');
    return payload.feedback as Feedback;
  },

  // Xóa feedback (Admin only)
  deleteFeedback: async (id: number): Promise<void> => {
    await apiClient.delete(`/feedbacks/${id}`);
  },

  // Lấy thống kê feedbacks (Admin only)
  getFeedbackStats: async (): Promise<FeedbackStats> => {
    const response = await apiClient.get<{ stats?: FeedbackStats }>('/feedbacks/stats');
    const payload = (response as any)?.data as { stats?: FeedbackStats } | undefined;
    if (!payload?.stats) throw new Error('Invalid stats response');
    return payload.stats as FeedbackStats;
  }
};

