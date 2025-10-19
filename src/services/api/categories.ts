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
    const token = localStorage.getItem('token');
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create category');
    }

    const data = await response.json();
    return data.data.category;
  }

  async update(id: number, categoryData: UpdateCategoryData): Promise<Category> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update category');
    }

    const data = await response.json();
    return data.data.category;
  }

  async delete(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete category');
    }
  }
}

export const categoriesAPI = new CategoriesAPI();




