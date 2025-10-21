import { apiClient } from './client';
import { Post, CreatePostRequest, UpdatePostRequest, GetPostsParams } from '../types/posts';
import { PaginatedResponse } from '../api/config';

export const postsApi = {
  // Lấy danh sách posts
  getPosts: async (params?: GetPostsParams): Promise<PaginatedResponse<Post>> => {
    const response = await apiClient.get<{ posts?: Post[]; pagination?: PaginatedResponse<Post>['pagination'] }>(
      '/posts',
      { params }
    );
    const payload = (response as any)?.data as { posts?: Post[]; pagination?: PaginatedResponse<Post>['pagination'] } | undefined;
    return {
      data: payload?.posts ?? [],
      pagination: payload?.pagination ?? { page: params?.page || 1, limit: params?.limit || 10, pages: 1, total: 0 },
    } as PaginatedResponse<Post>;
  },

  // Lấy post theo ID
  getPostById: async (id: number): Promise<Post> => {
    const response = await apiClient.get<{ post?: Post }>(`/posts/${id}`);
    const payload = (response as any)?.data as { post?: Post } | undefined;
    if (!payload?.post) throw new Error('Invalid getPostById response');
    return payload.post as Post;
  },

  // Tạo post mới (Admin only)
  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post<{ post?: Post }>('/posts', data);
    const payload = (response as any)?.data as { post?: Post } | undefined;
    if (!payload?.post) throw new Error('Invalid createPost response');
    return payload.post as Post;
  },
  // Upload post asset (image/pdf)
  uploadAsset: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append('file', file);
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
    const baseURL = (apiClient as any).client.defaults.baseURL;
    
    console.log('Upload asset - Base URL:', baseURL);
    console.log('Upload asset - Token:', token ? 'Present' : 'Missing');
    console.log('Upload asset - File:', file.name, file.type, file.size);
    
    const res = await fetch(`${baseURL}/posts/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });
    
    console.log('Upload asset - Response status:', res.status);
    const json = await res.json();
    console.log('Upload asset - Response data:', json);
    
    if (!res.ok) throw new Error(json?.message || 'Upload failed');
    return json.data as { url: string };
  },

  // Cập nhật post (Admin only)
  updatePost: async (id: number, data: UpdatePostRequest): Promise<Post> => {
    const response = await apiClient.put<{ post?: Post }>(`/posts/${id}`, data);
    const payload = (response as any)?.data as { post?: Post } | undefined;
    if (!payload?.post) throw new Error('Invalid updatePost response');
    return payload.post as Post;
  },

  // Xóa post (Admin only)
  deletePost: async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },

  // Lấy posts phổ biến
  getPopularPosts: async (limit?: number): Promise<Post[]> => {
    const response = await apiClient.get<{ posts?: Post[] }>('/posts/popular', { 
      params: { limit } 
    });
    return ((response as any)?.data?.posts ?? []) as Post[];
  },

  // Lấy posts mới nhất
  getLatestPosts: async (limit?: number): Promise<Post[]> => {
    const response = await apiClient.get<{ posts?: Post[] }>('/posts/latest', { 
      params: { limit } 
    });
    return ((response as any)?.data?.posts ?? []) as Post[];
  },

  // Tăng lượt xem post
  incrementViewCount: async (id: number): Promise<void> => {
    await apiClient.post(`/posts/${id}/view`);
  }
};

