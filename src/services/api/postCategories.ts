import { getApiBaseUrl } from '../../utils/apiConfig';

const API_BASE = getApiBaseUrl();

export interface PostCategory {
  id: number;
  name: string;
  description?: string;
  color: string;
  category_type: 'nganh' | 'doanh_nghiep';
  created_at: string;
  updated_at: string;
  post_count?: number;
}

export interface CreatePostCategoryData {
  name: string;
  description?: string;
  color?: string;
  category_type: 'nganh' | 'doanh_nghiep';
}

export interface UpdatePostCategoryData {
  name?: string;
  description?: string;
  color?: string;
}

class PostCategoriesAPI {
  private baseUrl = `${API_BASE}/post-categories`;

  async getAll(): Promise<PostCategory[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch post categories');
    }
    const data = await response.json();
    return data.data.categories;
  }

  async getByType(type: 'nganh' | 'doanh_nghiep'): Promise<PostCategory[]> {
    const response = await fetch(`${this.baseUrl}/type/${type}`);
    if (!response.ok) {
      throw new Error('Failed to fetch post categories by type');
    }
    const data = await response.json();
    return data.data.categories;
  }

  async create(categoryData: CreatePostCategoryData): Promise<PostCategory> {
    const token = localStorage.getItem('access_token');
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
      throw new Error(error.message || 'Failed to create post category');
    }

    const data = await response.json();
    return data.data.category;
  }

  async update(id: number, categoryData: UpdatePostCategoryData): Promise<PostCategory> {
    const token = localStorage.getItem('access_token');
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
      throw new Error(error.message || 'Failed to update post category');
    }

    const data = await response.json();
    return data.data.category;
  }

  async delete(id: number): Promise<void> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete post category');
    }
  }
}

export const postCategoriesAPI = new PostCategoriesAPI();
