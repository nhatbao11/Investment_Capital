import { getApiBaseUrl, getImageBaseUrl } from '../../utils/apiConfig';

// API Configuration
export const API_CONFIG = {
  // Backend URL - tự động detect môi trường
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 15000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Helper để lấy base URL cho static files (uploads)
export const getApiOrigin = () => {
  return getImageBaseUrl();
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
