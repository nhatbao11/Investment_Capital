import { useState, useEffect } from 'react';
import { investmentKnowledgeApi } from '../api/investmentKnowledge';

export interface InvestmentKnowledge {
  id: number;
  title: string;
  image_url: string;
  content: string;
  meaning: string;
  author_id: number;
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  created_at: string;
  updated_at: string;
  author_name?: string;
  author_email?: string;
}

export interface InvestmentKnowledgePagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const useInvestmentKnowledge = () => {
  const [knowledge, setKnowledge] = useState<InvestmentKnowledge[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<InvestmentKnowledgePagination | null>(null);

  // Fetch investment knowledge
  const fetchKnowledge = async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    try {
      setLoading(true);
      const response = await investmentKnowledgeApi.getAll(params);
      setKnowledge(response.knowledge);
      setPagination(response.pagination);
      return response;
    } catch (error) {
      console.error('Error fetching investment knowledge:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create investment knowledge (expects FormData with pdf or pdf_url)
  const createKnowledge = async (data: FormData) => {
    try {
      const response = await investmentKnowledgeApi.create(data);
      await fetchKnowledge(); // Refresh list
      return response.knowledge;
    } catch (error) {
      console.error('Error creating investment knowledge:', error);
      throw error;
    }
  };

  // Update investment knowledge (expects FormData with optional pdf/image)
  const updateKnowledge = async (id: number, data: FormData) => {
    try {
      const response = await investmentKnowledgeApi.update(id, data);
      await fetchKnowledge(); // Refresh list
      return response.knowledge;
    } catch (error) {
      console.error('Error updating investment knowledge:', error);
      throw error;
    }
  };

  // Delete investment knowledge
  const deleteKnowledge = async (id: number) => {
    try {
      await investmentKnowledgeApi.delete(id);
      await fetchKnowledge(); // Refresh list
      return true;
    } catch (error) {
      console.error('Error deleting investment knowledge:', error);
      throw error;
    }
  };

  // Get popular knowledge
  const getPopularKnowledge = async (limit?: number) => {
    try {
      const response = await investmentKnowledgeApi.getPopular(limit);
      return response.knowledge;
    } catch (error) {
      console.error('Error fetching popular knowledge:', error);
      throw error;
    }
  };

  // Get latest knowledge
  const getLatestKnowledge = async (limit?: number) => {
    try {
      const response = await investmentKnowledgeApi.getLatest(limit);
      return response.knowledge;
    } catch (error) {
      console.error('Error fetching latest knowledge:', error);
      throw error;
    }
  };

  return {
    knowledge,
    loading,
    pagination,
    fetchKnowledge,
    createKnowledge,
    updateKnowledge,
    deleteKnowledge,
    getPopularKnowledge,
    getLatestKnowledge,
  };
};
