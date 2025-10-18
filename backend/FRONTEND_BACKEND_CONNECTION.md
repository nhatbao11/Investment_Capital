# Hướng dẫn Kết nối Frontend với Backend

## 🎯 Mục tiêu
- Kết nối frontend Next.js với backend API
- Cấu hình CORS và authentication
- Tạo API service layer
- Xử lý errors và loading states

---

## 📁 Cấu trúc Frontend API

Tạo cấu trúc thư mục cho API services:

```
src/
├── services/
│   ├── api/
│   │   ├── config.ts          # API configuration
│   │   ├── auth.ts            # Authentication API
│   │   ├── posts.ts           # Posts API
│   │   ├── feedbacks.ts       # Feedbacks API
│   │   └── users.ts           # Users API
│   ├── hooks/
│   │   ├── useAuth.ts         # Authentication hook
│   │   ├── usePosts.ts        # Posts hook
│   │   └── useFeedbacks.ts    # Feedbacks hook
│   └── types/
│       ├── auth.ts            # Auth types
│       ├── posts.ts           # Posts types
│       └── feedbacks.ts       # Feedbacks types
```

---

## 🔧 BƯỚC 1: Cài đặt Dependencies

```bash
# Cài đặt các package cần thiết
npm install axios
npm install @types/axios  # Nếu dùng TypeScript
```

---

## 📝 BƯỚC 2: Tạo API Configuration

### 2.1 Tạo file `src/services/api/config.ts`:

```typescript
// API Configuration
export const API_CONFIG = {
  // Backend URL - thay đổi theo VPS IP của bạn
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://YOUR_VPS_IP:5000/api/v1',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
  errors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

// API Error Types
export interface ApiError {
  success: false;
  message: string;
  code?: string;
  errors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

// Pagination Types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
```

### 2.2 Tạo file `src/services/api/client.ts`:

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, ApiResponse } from './config';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - thêm token vào header
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - xử lý errors
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired hoặc invalid
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // Generic methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

---

## 🔐 BƯỚC 3: Tạo Authentication API

### 3.1 Tạo file `src/services/types/auth.ts`:

```typescript
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'client' | 'admin';
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role?: 'client' | 'admin';
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
```

### 3.2 Tạo file `src/services/api/auth.ts`:

```typescript
import { apiClient } from './client';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  ChangePasswordRequest 
} from '../types/auth';

export const authApi = {
  // Đăng ký
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data!;
  },

  // Đăng nhập
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data!;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken
    });
    return response.data!;
  },

  // Đăng xuất
  logout: async (refreshToken?: string): Promise<void> => {
    await apiClient.post('/auth/logout', {
      refresh_token: refreshToken
    });
  },

  // Lấy profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data!;
  },

  // Cập nhật profile
  updateProfile: async (data: { full_name: string }): Promise<User> => {
    const response = await apiClient.put<User>('/auth/profile', data);
    return response.data!;
  },

  // Đổi mật khẩu
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.put('/auth/change-password', data);
  }
};
```

---

## 📰 BƯỚC 4: Tạo Posts API

### 4.1 Tạo file `src/services/types/posts.ts`:

```typescript
export interface Post {
  id: number;
  title: string;
  content: string;
  category: 'nganh' | 'doanh_nghiep';
  thumbnail_url?: string;
  author_id: number;
  author_name?: string;
  author_email?: string;
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category: 'nganh' | 'doanh_nghiep';
  thumbnail_url?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  category?: 'nganh' | 'doanh_nghiep';
  status?: 'draft' | 'published' | 'archived';
  search?: string;
}
```

### 4.2 Tạo file `src/services/api/posts.ts`:

```typescript
import { apiClient } from './client';
import { Post, CreatePostRequest, UpdatePostRequest, GetPostsParams, PaginatedResponse } from '../types/posts';

export const postsApi = {
  // Lấy danh sách posts
  getPosts: async (params?: GetPostsParams): Promise<PaginatedResponse<Post>> => {
    const response = await apiClient.get<PaginatedResponse<Post>>('/posts', { params });
    return response.data!;
  },

  // Lấy post theo ID
  getPostById: async (id: number): Promise<Post> => {
    const response = await apiClient.get<Post>(`/posts/${id}`);
    return response.data!;
  },

  // Tạo post mới (Admin only)
  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post<Post>('/posts', data);
    return response.data!;
  },

  // Cập nhật post (Admin only)
  updatePost: async (id: number, data: UpdatePostRequest): Promise<Post> => {
    const response = await apiClient.put<Post>(`/posts/${id}`, data);
    return response.data!;
  },

  // Xóa post (Admin only)
  deletePost: async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },

  // Lấy posts phổ biến
  getPopularPosts: async (limit?: number): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>('/posts/popular', { 
      params: { limit } 
    });
    return response.data!;
  },

  // Lấy posts mới nhất
  getLatestPosts: async (limit?: number): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>('/posts/latest', { 
      params: { limit } 
    });
    return response.data!;
  }
};
```

---

## 💬 BƯỚC 5: Tạo Feedbacks API

### 5.1 Tạo file `src/services/types/feedbacks.ts`:

```typescript
export interface Feedback {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  name: string;
  company?: string;
  content: string;
  rating?: number;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFeedbackRequest {
  name: string;
  company?: string;
  content: string;
  rating?: number;
}

export interface FeedbackStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  average_rating: number;
  five_stars: number;
  four_stars: number;
  three_stars: number;
  two_stars: number;
  one_stars: number;
}
```

### 5.2 Tạo file `src/services/api/feedbacks.ts`:

```typescript
import { apiClient } from './client';
import { Feedback, CreateFeedbackRequest, FeedbackStats, PaginatedResponse } from '../types/feedbacks';

export const feedbacksApi = {
  // Lấy danh sách feedbacks
  getFeedbacks: async (params?: {
    page?: number;
    limit?: number;
    rating?: number;
    status?: 'pending' | 'approved' | 'rejected';
  }): Promise<PaginatedResponse<Feedback>> => {
    const response = await apiClient.get<PaginatedResponse<Feedback>>('/feedbacks', { params });
    return response.data!;
  },

  // Tạo feedback mới
  createFeedback: async (data: CreateFeedbackRequest): Promise<Feedback> => {
    const response = await apiClient.post<Feedback>('/feedbacks', data);
    return response.data!;
  },

  // Lấy feedbacks chờ duyệt (Admin only)
  getPendingFeedbacks: async (limit?: number): Promise<Feedback[]> => {
    const response = await apiClient.get<Feedback[]>('/feedbacks/pending', { 
      params: { limit } 
    });
    return response.data!;
  },

  // Duyệt feedback (Admin only)
  approveFeedback: async (id: number, adminNotes?: string): Promise<Feedback> => {
    const response = await apiClient.put<Feedback>(`/feedbacks/${id}/approve`, {
      admin_notes: adminNotes
    });
    return response.data!;
  },

  // Từ chối feedback (Admin only)
  rejectFeedback: async (id: number, adminNotes?: string): Promise<Feedback> => {
    const response = await apiClient.put<Feedback>(`/feedbacks/${id}/reject`, {
      admin_notes: adminNotes
    });
    return response.data!;
  },

  // Xóa feedback (Admin only)
  deleteFeedback: async (id: number): Promise<void> => {
    await apiClient.delete(`/feedbacks/${id}`);
  },

  // Lấy thống kê feedbacks (Admin only)
  getFeedbackStats: async (): Promise<FeedbackStats> => {
    const response = await apiClient.get<FeedbackStats>('/feedbacks/stats');
    return response.data!;
  }
};
```

---

## 🎣 BƯỚC 6: Tạo Custom Hooks

### 6.1 Tạo file `src/services/hooks/useAuth.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';
import { User, LoginRequest, RegisterRequest, ChangePasswordRequest } from '../types/auth';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { full_name: string }) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const userData = await authApi.getProfile();
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login(data);
      
      // Save tokens
      localStorage.setItem('access_token', response.tokens.accessToken);
      localStorage.setItem('refresh_token', response.tokens.refreshToken);
      
      setUser(response.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.register(data);
      
      // Save tokens
      localStorage.setItem('access_token', response.tokens.accessToken);
      localStorage.setItem('refresh_token', response.tokens.refreshToken);
      
      setUser(response.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(async (data: { full_name: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await authApi.updateProfile(data);
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      await authApi.changePassword(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password change failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await authApi.refreshToken(refreshToken);
      
      // Save new tokens
      localStorage.setItem('access_token', response.tokens.accessToken);
      localStorage.setItem('refresh_token', response.tokens.refreshToken);
      
      setUser(response.user);
    } catch (err) {
      console.error('Token refresh failed:', err);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshToken
  };
};
```

---

## 🔧 BƯỚC 7: Cấu hình Environment Variables

### 7.1 Tạo file `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://YOUR_VPS_IP:5000/api/v1

# Frontend URL (for CORS)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
```

### 7.2 Cập nhật `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  }
}

module.exports = nextConfig
```

---

## 🧪 BƯỚC 8: Sử dụng trong Components

### 8.1 Ví dụ Login Component:

```typescript
// src/components/LoginForm.tsx
import { useState } from 'react';
import { useAuth } from '../services/hooks/useAuth';

export const LoginForm = () => {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      // Redirect to dashboard or home
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### 8.2 Ví dụ Posts Component:

```typescript
// src/components/PostsList.tsx
import { useState, useEffect } from 'react';
import { postsApi } from '../services/api/posts';
import { Post } from '../services/types/posts';

export const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postsApi.getPosts({ limit: 10 });
        setPosts(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Posts</h2>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content.substring(0, 100)}...</p>
          <span>Category: {post.category}</span>
          <span>Views: {post.view_count}</span>
        </div>
      ))}
    </div>
  );
};
```

---

## 🚀 BƯỚC 9: Test Kết nối

### 9.1 Test API từ browser console:

```javascript
// Mở browser console và test
fetch('http://YOUR_VPS_IP:5000/health')
  .then(response => response.json())
  .then(data => console.log(data));

// Test posts API
fetch('http://YOUR_VPS_IP:5000/api/v1/posts')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 9.2 Test từ frontend:

```bash
# Chạy frontend
npm run dev

# Mở http://localhost:3001
# Kiểm tra Network tab trong DevTools
```

---

## 🔒 BƯỚC 10: Cấu hình CORS trên Backend

Đảm bảo backend đã cấu hình CORS đúng:

```javascript
// Trong backend/src/server.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));
```

---

## 📝 Checklist hoàn thành

- [ ] Dependencies đã cài đặt (axios)
- [ ] API configuration đã tạo
- [ ] Authentication API đã implement
- [ ] Posts API đã implement
- [ ] Feedbacks API đã implement
- [ ] Custom hooks đã tạo
- [ ] Environment variables đã cấu hình
- [ ] CORS đã cấu hình trên backend
- [ ] Test kết nối thành công
- [ ] Frontend có thể gọi API

---

## 🚨 Troubleshooting

### Lỗi CORS:
- Kiểm tra CORS_ORIGIN trong backend
- Đảm bảo frontend URL đúng

### Lỗi 401 Unauthorized:
- Kiểm tra token trong localStorage
- Kiểm tra Authorization header

### Lỗi kết nối:
- Kiểm tra VPS IP và port
- Kiểm tra firewall settings
- Kiểm tra backend có chạy không

### Lỗi 500 Internal Server Error:
- Kiểm tra backend logs
- Kiểm tra database connection
- Kiểm tra environment variables

---

## 🎉 Kết luận

Sau khi hoàn thành các bước trên, bạn sẽ có:

1. **Frontend** có thể kết nối với **Backend** trên VPS
2. **Authentication** hoạt động đầy đủ
3. **API calls** được xử lý tự động
4. **Error handling** và **loading states**
5. **Type safety** với TypeScript
6. **Reusable hooks** cho các components

Bây giờ bạn có thể phát triển các tính năng frontend sử dụng API backend một cách dễ dàng! 🚀





























