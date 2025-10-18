'use client';

import React from 'react';
import { FaUser, FaCalendar, FaEye } from 'react-icons/fa';
import Card from './Card';
import Heading from './Heading';
import Text from './Text';
import Button from './Button';

interface BookJourney {
  id: number;
  title: string;
  description: string;
  image_url: string;
  pdf_url: string;
  view_count: number;
  download_count: number;
  created_at: string;
  author_name: string;
}

interface BookJourneyCardProps {
  book: BookJourney;
  onView: (book: BookJourney) => void;
}

const BookJourneyCard: React.FC<BookJourneyCardProps> = ({ 
  book, 
  onView
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  return (
    <Card className="p-4 sm:p-6 md:p-7" hover={false} variant="outlined">
      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
        {/* Image */}
        {book.image_url && (
          <div className="w-full md:w-72 md:flex-shrink-0">
            <img
              src={book.image_url.startsWith('http') ? book.image_url : `${API_BASE}${book.image_url}`}
              alt={book.title}
              className="w-full h-40 sm:h-48 md:h-full md:w-72 object-cover rounded-xl md:rounded-2xl border border-gray-200 shadow-sm"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 md:ml-2 lg:ml-4 xl:ml-6 whitespace-normal">
          <Heading level={4} className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {book.title}
          </Heading>
          
          {book.description && (
            <Text className="text-gray-700 leading-6 sm:leading-7 md:leading-8 mb-3 sm:mb-4 line-clamp-3">
              {book.description}
            </Text>
          )}

          {/* Meta: author • date • views in one row */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 gap-2">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="flex items-center gap-1"><FaUser className="h-3 w-3 sm:h-4 sm:w-4" /><span className="truncate">{book.author_name || 'Y&T Group'}</span></div>
              <div className="flex items-center gap-1"><FaCalendar className="h-3 w-3 sm:h-4 sm:w-4" /><span className="shrink-0">{formatDate(book.created_at)}</span></div>
            </div>
            <div className="flex items-center gap-1 shrink-0"><FaEye className="h-3 w-3 sm:h-4 sm:w-4" /><span>{book.view_count}</span></div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => onView(book)}
              size="md"
              variant="ghost"
              className="flex items-center gap-2 btn-ltr-hover"
            >
              Xem PDF
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookJourneyCard;
