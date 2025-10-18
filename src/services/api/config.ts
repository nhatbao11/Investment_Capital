// API Configuration
export const API_CONFIG = {
  // Backend URL - thay đổi theo VPS IP của bạn
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  TIMEOUT: 15000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Helper để lấy base URL cho static files (uploads)
export const getApiOrigin = () => {
  try {
    return new URL(API_CONFIG.BASE_URL).origin;
  } catch {
    return 'http://localhost:5000';
  }
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
