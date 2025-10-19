import React from 'react';
import { resolveFileUrl } from '../../utils/apiConfig';

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
    return resolveFileUrl(url);
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
