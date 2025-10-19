export interface Post {
  id: number;
  title: string;
  summary?: string;
  content: string;
  category: 'nganh' | 'doanh_nghiep';
  category_id?: number;
  category_name?: string;
  category_color?: string;
  thumbnail_url?: string;
  pdf_url?: string;
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
  category_id?: number;
  thumbnail_url?: string;
  pdf_url?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  category?: 'nganh' | 'doanh_nghiep';
  status?: 'draft' | 'published' | 'archived';
  search?: string;
  category_id?: number;
}

