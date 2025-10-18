import { apiClient } from './client';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  ChangePasswordRequest 
} from '../types/auth';
import axios from 'axios';

export const authApi = {
  // Đăng ký
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    // ApiClient already returns ApiResponse<T>; the payload is in response.data
    return response.data as AuthResponse;
  },

  // Đăng nhập
  login: async (data: LoginRequest): Promise<AuthResponse> => {

    const { rememberMe, ...payload } = data as any;
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);

    return response.data as AuthResponse;
  },

  // Login with Google: exchange id_token from Google for our JWT
  loginWithGoogle: async (idToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/google', { id_token: idToken });
    return response.data as AuthResponse;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken
    });
    return response.data as AuthResponse;
  },

  // Đăng xuất
  logout: async (refreshToken?: string): Promise<void> => {
    await apiClient.post('/auth/logout', {
      refresh_token: refreshToken
    });
  },

  // Lấy profile
  getProfile: async (): Promise<User> => {
    // Response shape: ApiResponse<{ user: User }>
    const response = await apiClient.get<{ user?: User }>('/auth/profile');
    const payload = (response as any)?.data as { user?: User } | undefined;
    if (!payload || !payload.user) {
      throw new Error('Invalid profile response');
    }
    return payload.user as User;
  },

  // Cập nhật profile
  updateProfile: async (data: { full_name: string }): Promise<User> => {
    const response = await apiClient.put<{ user?: User }>('/auth/profile', data);
    const payload = (response as any)?.data as { user?: User } | undefined;
    if (!payload || !payload.user) {
      throw new Error('Invalid update profile response');
    }
    return payload.user as User;
  },

  // Upload avatar (multipart/form-data)
  uploadAvatar: async (file: File): Promise<{ avatar_url: string; user: User }> => {
    const form = new FormData();
    form.append('avatar', file);
    // Use axios directly to preserve multipart boundary via apiClient's base config
    const res = await axios.post(`${(apiClient as any).client.defaults.baseURL}/auth/avatar`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''}`
      },
    });
    return res.data.data as { avatar_url: string; user: User };
  },

  // Đổi mật khẩu
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.put('/auth/change-password', data);
  },

  // Forgot password: request reset link
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password by token
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { token, new_password: newPassword });
  }
};

