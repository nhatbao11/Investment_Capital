import React from 'react';

interface PostImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  containerClassName?: string;
}

const PostImage: React.FC<PostImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '/images/Logo01.jpg',
  containerClassName = 'h-48'
}) => {
  const resolveUrl = (url?: string) => {
    if (!url) return fallbackSrc;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads/')) {
      // Sử dụng API origin từ config
      const apiOrigin = (() => {
        try { 
          return new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').origin;
        } catch { 
          return 'http://localhost:5000';
        }
      })();
      return `${apiOrigin}${url}`;
    }
    return url;
  };

  return (
    <div className={`w-full ${containerClassName} bg-gray-100 rounded-t-lg overflow-hidden relative`}>
      <img
        src={resolveUrl(src)}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${className}`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.src !== fallbackSrc) {
            target.src = fallbackSrc;
          }
        }}
      />
    </div>
  );
};

export default PostImage;
