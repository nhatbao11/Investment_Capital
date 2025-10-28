import { apiClient } from './client';

export interface ToggleNewsletterRequest {
  newsletter_opt_in: boolean;
}

export interface ToggleNewsletterResponse {
  success: boolean;
  message: string;
  data: {
    newsletter_opt_in: boolean;
  };
}

export const newsletterApi = {
  // Toggle newsletter subscription
  toggleSubscription: async (data: ToggleNewsletterRequest): Promise<ToggleNewsletterResponse> => {
    const response = await apiClient.post('/newsletter/toggle', data);
    return response as any;
  }
};

