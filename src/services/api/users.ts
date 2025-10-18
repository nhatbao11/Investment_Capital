import { apiClient } from './client';
import { API_CONFIG, PaginatedResponse, Pagination } from './config';
import { User } from '../types/auth';

export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: 'client' | 'admin';
  search?: string;
}

export const usersApi = {
  getUsers: async (params?: GetUsersParams): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<{ users?: User[]; pagination?: Pagination }>(
      '/users',
      { params }
    );
    const payload = (response as any)?.data as { users?: User[]; pagination?: Pagination } | undefined;
    return {
      data: payload?.users ?? [],
      pagination: payload?.pagination ?? { page: params?.page || 1, limit: params?.limit || 10, pages: 1, total: 0 },
    } as PaginatedResponse<User>;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get<{ user?: User }>(`/users/${id}`);
    const payload = (response as any)?.data as { user?: User } | undefined;
    if (!payload?.user) throw new Error('Invalid getUserById response');
    return payload.user as User;
  },

  updateUser: async (
    id: number,
    data: Partial<Pick<User, 'full_name' | 'role' | 'is_active' | 'email_verified'>>
  ): Promise<User> => {
    const response = await apiClient.put<{ user?: User }>(`/users/${id}`, data);
    const payload = (response as any)?.data as { user?: User } | undefined;
    if (!payload?.user) throw new Error('Invalid updateUser response');
    return payload.user as User;
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};

