import { apiClient } from './client';
import { Post, CreatePostRequest, UpdatePostRequest, GetPostsParams } from '../types/posts';
import { PaginatedResponse } from '../api/config';

export const postsApi = {
  // Lấy danh sách posts
  getPosts: async (params?: GetPostsParams): Promise<PaginatedResponse<Post>> => {
    const response = await apiClient.get<{ posts: Post[]; pagination: PaginatedResponse<Post>['pagination'] }>(
      '/posts',
      { params }
    );
    return {
      data: response.data.posts,
      pagination: response.data.pagination,
    };
  },

  // Lấy post theo ID
  getPostById: async (id: number): Promise<Post> => {
    const response = await apiClient.get<{ post: Post }>(`/posts/${id}`);
    return response.data.post as Post;
  },

  // Tạo post mới (Admin only)
  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post<{ post: Post }>('/posts', data);
    return response.data.post as Post;
  },
  // Upload post asset (image/pdf)
  uploadAsset: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${(apiClient as any).client.defaults.baseURL}/posts/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''}` },
      body: form
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || 'Upload failed');
    return json.data as { url: string };
  },

  // Cập nhật post (Admin only)
  updatePost: async (id: number, data: UpdatePostRequest): Promise<Post> => {
    const response = await apiClient.put<{ post: Post }>(`/posts/${id}`, data);
    return response.data.post as Post;
  },

  // Xóa post (Admin only)
  deletePost: async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },

  // Lấy posts phổ biến
  getPopularPosts: async (limit?: number): Promise<Post[]> => {
    const response = await apiClient.get<{ posts: Post[] }>('/posts/popular', { 
      params: { limit } 
    });
    return response.data.posts as Post[];
  },

  // Lấy posts mới nhất
  getLatestPosts: async (limit?: number): Promise<Post[]> => {
    const response = await apiClient.get<{ posts: Post[] }>('/posts/latest', { 
      params: { limit } 
    });
    return response.data.posts as Post[];
  },

  // Tăng lượt xem post
  incrementViewCount: async (id: number): Promise<void> => {
    await apiClient.post(`/posts/${id}/view`);
  }
};





