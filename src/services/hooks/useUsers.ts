import { useState, useCallback } from 'react';
import { usersApi, GetUsersParams } from '../api/users';
import { User } from '../types/auth';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  fetchUsers: (params?: GetUsersParams) => Promise<void>;
  updateUser: (
    id: number,
    data: Partial<Pick<User, 'full_name' | 'role' | 'is_active' | 'email_verified'>>
  ) => Promise<User | null>;
  deleteUser: (id: number) => Promise<boolean>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null>(null);

  const fetchUsers = useCallback(async (params?: GetUsersParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersApi.getUsers(params);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (
    id: number,
    data: Partial<Pick<User, 'full_name' | 'role' | 'is_active' | 'email_verified'>>
  ): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      const updated = await usersApi.updateUser(id, data);
      setUsers(prev => prev.map(u => (u.id === id ? updated : u)));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await usersApi.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    updateUser,
    deleteUser,
  };
};

