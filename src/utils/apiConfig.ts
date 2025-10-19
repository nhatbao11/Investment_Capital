/**
 * API Configuration Utility
 * Tự động detect môi trường và sử dụng URL phù hợp
 */

export const getApiBaseUrl = (): string => {
  // Nếu có NEXT_PUBLIC_API_URL từ environment variable, sử dụng nó
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Nếu đang chạy trên browser (client-side)
  if (typeof window !== 'undefined') {
    // Detect production domain
    const hostname = window.location.hostname;
    
    // Nếu là production domain
    if (hostname === 'yt2future.com' || hostname === 'www.yt2future.com') {
      return 'https://yt2future.com/api/v1';
    }
    
    // Nếu là VPS IP hoặc domain khác
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `https://${hostname}/api/v1`;
    }
  }

  // Default cho local development
  return 'http://localhost:5000/api/v1';
};

export const getImageBaseUrl = (): string => {
  // Nếu có NEXT_PUBLIC_API_URL từ environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '');
  }

  // Nếu đang chạy trên browser (client-side)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Nếu là production domain
    if (hostname === 'yt2future.com' || hostname === 'www.yt2future.com') {
      return 'https://yt2future.com';
    }
    
    // Nếu là VPS IP hoặc domain khác
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `https://${hostname}`;
    }
  }

  // Default cho local development
  return 'http://localhost:5000';
};

/**
 * Xử lý URL file (PDF, hình ảnh) để hiển thị đúng trên mọi môi trường
 */
export const resolveFileUrl = (fileUrl: string): string => {
  if (!fileUrl) return '';
  
  // Nếu đã là URL đầy đủ, trả về nguyên
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl;
  }
  
  // Nếu bắt đầu với /uploads/, sử dụng backend API trực tiếp
  if (fileUrl.startsWith('/uploads/')) {
    const baseUrl = getImageBaseUrl();
    return `${baseUrl}${fileUrl}`;
  }
  
  // Nếu bắt đầu với /api/, trả về nguyên
  if (fileUrl.startsWith('/api/')) {
    return fileUrl;
  }
  
  // Nếu không có protocol, thêm domain
  const baseUrl = getImageBaseUrl();
  return `${baseUrl}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
};

/**
 * Xử lý URL PDF để mở đúng trên mọi môi trường
 */
export const resolvePdfUrl = (pdfUrl: string): string => {
  if (!pdfUrl) return '';
  
  // Nếu đã là URL đầy đủ, trả về nguyên
  if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
    return pdfUrl;
  }
  
  // Nếu bắt đầu với /uploads/, sử dụng backend API trực tiếp
  if (pdfUrl.startsWith('/uploads/')) {
    const baseUrl = getImageBaseUrl();
    return `${baseUrl}${pdfUrl}`;
  }
  
  // Nếu bắt đầu với /api/, trả về nguyên
  if (pdfUrl.startsWith('/api/')) {
    return pdfUrl;
  }
  
  // Nếu không có protocol, thêm domain
  const baseUrl = getImageBaseUrl();
  return `${baseUrl}${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`;
};


