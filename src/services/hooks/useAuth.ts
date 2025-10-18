import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';
import { User, LoginRequest, RegisterRequest, ChangePasswordRequest, AuthResponse } from '../types/auth';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<AuthResponse | undefined>;
  loginWithGoogle: (idToken: string) => Promise<void>;
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
          // Check if token is valid by calling getProfile
          const userData = await authApi.getProfile();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        // Clear invalid tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
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
      
      // Always save tokens to localStorage
      localStorage.setItem('access_token', response.tokens.accessToken);
      localStorage.setItem('refresh_token', response.tokens.refreshToken);
      
      setUser(response.user);
      return response; // Return response for role checking
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      // Do not throw to avoid UI generic failure; caller can read hook error state
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.loginWithGoogle(idToken);
      localStorage.setItem('access_token', response.tokens.accessToken);
      localStorage.setItem('refresh_token', response.tokens.refreshToken);
      setUser(response.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google login failed');
      return;
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
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
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
      
      // Always refresh into localStorage
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
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshToken
  };
};

