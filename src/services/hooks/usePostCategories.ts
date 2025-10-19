import { useState, useEffect, useCallback } from 'react';
import { postCategoriesAPI, PostCategory, CreatePostCategoryData, UpdatePostCategoryData } from '../api/postCategories';

interface UsePostCategoriesReturn {
  categories: PostCategory[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchCategoriesByType: (type: 'nganh' | 'doanh_nghiep') => Promise<void>;
  createCategory: (data: CreatePostCategoryData) => Promise<PostCategory | null>;
  updateCategory: (id: number, data: UpdatePostCategoryData) => Promise<PostCategory | null>;
  deleteCategory: (id: number) => Promise<boolean>;
}

export const usePostCategories = (): UsePostCategoriesReturn => {
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoriesData = await postCategoriesAPI.getAll();
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch post categories');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategoriesByType = useCallback(async (type: 'nganh' | 'doanh_nghiep') => {
    try {
      setLoading(true);
      setError(null);
      
      const categoriesData = await postCategoriesAPI.getByType(type);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch post categories by type');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: CreatePostCategoryData): Promise<PostCategory | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const category = await postCategoriesAPI.create(data);
      setCategories(prev => [...prev, category]);
      return category;
    } catch (err: any) {
      setError(err.message || 'Failed to create post category');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: number, data: UpdatePostCategoryData): Promise<PostCategory | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const category = await postCategoriesAPI.update(id, data);
      setCategories(prev => prev.map(cat => cat.id === id ? category : cat));
      return category;
    } catch (err: any) {
      setError(err.message || 'Failed to update post category');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await postCategoriesAPI.delete(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete post category');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategoriesByType,
    createCategory,
    updateCategory,
    deleteCategory
  };
};
