import { useState, useEffect, useCallback } from 'react';
import { postsApi } from '../api/posts';
import { Post, CreatePostRequest, UpdatePostRequest, GetPostsParams } from '../types/posts';
import { PaginatedResponse } from '../api/config';

interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  fetchPosts: (params?: GetPostsParams) => Promise<void>;
  fetchPost: (id: number) => Promise<Post | null>;
  createPost: (data: CreatePostRequest) => Promise<Post | null>;
  updatePost: (id: number, data: UpdatePostRequest) => Promise<Post | null>;
  deletePost: (id: number) => Promise<boolean>;
  fetchPopularPosts: (limit?: number) => Promise<Post[]>;
  fetchLatestPosts: (limit?: number) => Promise<Post[]>;
}

export const usePosts = (): UsePostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null>(null);

  const fetchPosts = useCallback(async (params?: GetPostsParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await postsApi.getPosts(params);
      setPosts(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPost = useCallback(async (id: number): Promise<Post | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const post = await postsApi.getPostById(id);
      return post;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (data: CreatePostRequest): Promise<Post | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const post = await postsApi.createPost(data);
      setPosts(prev => [post, ...prev]);
      return post;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (id: number, data: UpdatePostRequest): Promise<Post | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const post = await postsApi.updatePost(id, data);
      setPosts(prev => prev.map(p => p.id === id ? post : p));
      return post;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await postsApi.deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete post');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPopularPosts = useCallback(async (limit?: number): Promise<Post[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const posts = await postsApi.getPopularPosts(limit);
      return posts;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch popular posts');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLatestPosts = useCallback(async (limit?: number): Promise<Post[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const posts = await postsApi.getLatestPosts(limit);
      return posts;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch latest posts');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    posts,
    loading,
    error,
    pagination,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    fetchPopularPosts,
    fetchLatestPosts
  };
};















