import { useState, useCallback } from 'react';
import { viewTrackingApi } from '../api/viewTracking';

interface ViewTrackingStats {
  unique_visitors: number;
  total_views: number;
  logged_in_users: number;
  anonymous_users: number;
}

interface ViewTrackingReturn {
  trackView: (resourceType: 'post' | 'investment_knowledge' | 'bookjourney', resourceId: number) => Promise<boolean>;
  getResourceStats: (resourceType: 'post' | 'investment_knowledge' | 'bookjourney', resourceId: number, days?: number) => Promise<ViewTrackingStats>;
  getOverallStats: (days?: number) => Promise<any>;
  getTopContent: (resourceType?: 'post' | 'investment_knowledge' | 'bookjourney', limit?: number, days?: number) => Promise<any>;
  getDashboardStats: (days?: number) => Promise<any>;
  getRealStatistics: () => Promise<any>;
  loading: boolean;
  error: string | null;
}

export const useViewTracking = (): ViewTrackingReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackView = useCallback(async (
    resourceType: 'post' | 'investment_knowledge' | 'bookjourney', 
    resourceId: number
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await viewTrackingApi.trackView(resourceType, resourceId);
      return response.data?.tracked || false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to track view');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getResourceStats = useCallback(async (
    resourceType: 'post' | 'investment_knowledge' | 'bookjourney',
    resourceId: number,
    days: number = 30
  ): Promise<ViewTrackingStats> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await viewTrackingApi.getResourceStats(resourceType, resourceId, days);
      return response.data?.stats || {
        unique_visitors: 0,
        total_views: 0,
        logged_in_users: 0,
        anonymous_users: 0
      };
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get resource stats');
      return {
        unique_visitors: 0,
        total_views: 0,
        logged_in_users: 0,
        anonymous_users: 0
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const getOverallStats = useCallback(async (days: number = 30) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await viewTrackingApi.getOverallStats(days);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get overall stats');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTopContent = useCallback(async (
    resourceType?: 'post' | 'investment_knowledge' | 'bookjourney',
    limit: number = 10,
    days: number = 30
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await viewTrackingApi.getTopContent(resourceType, limit, days);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get top content');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDashboardStats = useCallback(async (days: number = 30) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await viewTrackingApi.getDashboardStats(days);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get dashboard stats');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRealStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await viewTrackingApi.getRealStatistics();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get real statistics');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    trackView,
    getResourceStats,
    getOverallStats,
    getTopContent,
    getDashboardStats,
    getRealStatistics,
    loading,
    error
  };
};
