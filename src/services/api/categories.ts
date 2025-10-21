import { getApiBaseUrl } from '../../utils/apiConfig';

const API_BASE = getApiBaseUrl();

export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
  knowledge_count?: number;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  color?: string;
}

class CategoriesAPI {
  private baseUrl = `${API_BASE}/categories`;

  async getAll(): Promise<Category[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.data.categories;
  }

  async create(categoryData: CreateCategoryData): Promise<Category> {
    const token = localStorage.getItem('access_token');
    console.log('Create category - Token:', token ? 'Present' : 'Missing');
    console.log('Create category - Data:', categoryData);
    
    // Clear any malformed token and get fresh one
    if (!token || token === 'null' || token === 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      throw new Error('No valid token found. Please login again.');
    }
    
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });

    console.log('Create category - Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.log('Create category - Error:', error);
      throw new Error(error.message || 'Failed to create category');
    }

    const data = await response.json();
    return data.data.category;
  }

  async update(id: number, categoryData: UpdateCategoryData): Promise<Category> {
    const token = localStorage.getItem('access_token');
    console.log('Update category - Token:', token ? 'Present' : 'Missing');
    console.log('Update category - ID:', id, 'Data:', categoryData);
    
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });

    console.log('Update category - Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.log('Update category - Error:', error);
      throw new Error(error.message || 'Failed to update category');
    }

    const data = await response.json();
    return data.data.category;
  }

  async delete(id: number): Promise<void> {
    const token = localStorage.getItem('access_token');
    console.log('Delete category - Token:', token ? 'Present' : 'Missing');
    console.log('Delete category - URL:', `${this.baseUrl}/${id}`);
    
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Delete category - Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.log('Delete category - Error:', error);
      throw new Error(error.message || 'Failed to delete category');
    }
  }
}

export const categoriesAPI = new CategoriesAPI();




