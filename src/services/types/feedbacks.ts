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














