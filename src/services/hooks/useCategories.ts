import { useState, useEffect, useCallback } from 'react';
import { categoriesAPI, Category, CreateCategoryData, UpdateCategoryData } from '../api/categories';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (data: CreateCategoryData) => Promise<Category | null>;
  updateCategory: (id: number, data: UpdateCategoryData) => Promise<Category | null>;
  deleteCategory: (id: number) => Promise<boolean>;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoriesData = await categoriesAPI.getAll();
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: CreateCategoryData): Promise<Category | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const category = await categoriesAPI.create(data);
      setCategories(prev => [...prev, category]);
      return category;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: number, data: UpdateCategoryData): Promise<Category | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const category = await categoriesAPI.update(id, data);
      setCategories(prev => prev.map(cat => cat.id === id ? category : cat));
      return category;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update category');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await categoriesAPI.delete(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete category');
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
    createCategory,
    updateCategory,
    deleteCategory
  };
};



