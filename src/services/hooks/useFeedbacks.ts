import { useState, useEffect, useCallback } from 'react';
import { feedbacksApi } from '../api/feedbacks';
import { Feedback, CreateFeedbackRequest, FeedbackStats } from '../types/feedbacks';
import { PaginatedResponse } from '../api/config';

interface UseFeedbacksReturn {
  feedbacks: Feedback[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  stats: FeedbackStats | null;
  fetchFeedbacks: (params?: {
    page?: number;
    limit?: number;
    rating?: number;
    status?: 'pending' | 'approved' | 'rejected';
  }) => Promise<void>;
  createFeedback: (data: CreateFeedbackRequest) => Promise<Feedback | null>;
  approveFeedback: (id: number, adminNotes?: string) => Promise<Feedback | null>;
  rejectFeedback: (id: number, adminNotes?: string) => Promise<Feedback | null>;
  deleteFeedback: (id: number) => Promise<boolean>;
  fetchPendingFeedbacks: (limit?: number) => Promise<Feedback[]>;
  fetchFeedbackStats: () => Promise<FeedbackStats | null>;
}

export const useFeedbacks = (): UseFeedbacksReturn => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null>(null);
  const [stats, setStats] = useState<FeedbackStats | null>(null);

  const fetchFeedbacks = useCallback(async (params?: {
    page?: number;
    limit?: number;
    rating?: number;
    status?: 'pending' | 'approved' | 'rejected';
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await feedbacksApi.getFeedbacks(params);
      setFeedbacks(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch feedbacks');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFeedback = useCallback(async (data: CreateFeedbackRequest): Promise<Feedback | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const feedback = await feedbacksApi.createFeedback(data);
      setFeedbacks(prev => [feedback, ...prev]);
      return feedback;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create feedback');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveFeedback = useCallback(async (id: number, adminNotes?: string): Promise<Feedback | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const feedback = await feedbacksApi.approveFeedback(id, adminNotes);
      setFeedbacks(prev => prev.map(f => f.id === id ? feedback : f));
      return feedback;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve feedback');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectFeedback = useCallback(async (id: number, adminNotes?: string): Promise<Feedback | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const feedback = await feedbacksApi.rejectFeedback(id, adminNotes);
      setFeedbacks(prev => prev.map(f => f.id === id ? feedback : f));
      return feedback;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject feedback');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFeedback = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await feedbacksApi.deleteFeedback(id);
      setFeedbacks(prev => prev.filter(f => f.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete feedback');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingFeedbacks = useCallback(async (limit?: number): Promise<Feedback[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const feedbacks = await feedbacksApi.getPendingFeedbacks(limit);
      return feedbacks;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch pending feedbacks');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeedbackStats = useCallback(async (): Promise<FeedbackStats | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await feedbacksApi.getFeedbackStats();
      setStats(stats);
      return stats;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch feedback stats');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    feedbacks,
    loading,
    error,
    pagination,
    stats,
    fetchFeedbacks,
    createFeedback,
    approveFeedback,
    rejectFeedback,
    deleteFeedback,
    fetchPendingFeedbacks,
    fetchFeedbackStats
  };
};

























