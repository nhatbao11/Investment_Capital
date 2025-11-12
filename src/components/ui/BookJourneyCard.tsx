'use client';

import React from 'react';
import { FaUser, FaCalendar, FaEye } from 'react-icons/fa';
import Card from './Card';
import Heading from './Heading';
import Text from './Text';
import Button from './Button';
import { resolveFileUrl } from '../../utils/apiConfig';

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
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  return (
    <Card className="p-4 sm:p-6 md:p-7" hover={false} variant="outlined">
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Image */}
        {book.image_url && (
          <div className="w-full md:w-full">
            <img
              src={resolveFileUrl(book.image_url)}
              alt={book.title}
              className="w-full h-40 sm:h-48 md:h-64 object-cover rounded-xl md:rounded-2xl border border-gray-200 shadow-sm"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 whitespace-normal">
          {/* Title - 1 hàng */}
          <Heading level={4} className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
            {book.title}
          </Heading>
          
          {/* Description */}
          {book.description && (
            <Text className="text-gray-700 leading-6 sm:leading-7 md:leading-8 mb-3 sm:mb-4 line-clamp-3">
              {book.description}
            </Text>
          )}

          {/* Meta: author • date • views in one row - Mobile và Desktop cùng 1 hàng */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 gap-1 sm:gap-2 overflow-hidden flex-nowrap">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1 flex-nowrap">
              <div className="flex items-center gap-0.5 sm:gap-1 min-w-0 flex-shrink">
                <FaUser className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate max-w-[80px] sm:max-w-none">{book.author_name || 'Y&T Group'}</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                <FaCalendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{formatDate(book.created_at)}</span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 flex-nowrap">
              <FaEye className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{book.view_count}</span>
            </div>
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
