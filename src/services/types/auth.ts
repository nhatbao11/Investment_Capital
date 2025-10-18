export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'client' | 'admin';
  is_active: boolean;
  email_verified: boolean;
  newsletter_opt_in?: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  newsletter_opt_in?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role?: 'client' | 'admin';
  newsletter_opt_in?: boolean;
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

