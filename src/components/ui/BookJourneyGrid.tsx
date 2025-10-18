'use client';

import React, { useState, useEffect, useRef } from 'react';
import Grid from './Grid';
import Card from './Card';
import Heading from './Heading';
import Text from './Text';
import Button from './Button';
import BookJourneyCard from './BookJourneyCard';

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

interface BookJourneyGridProps {
  onViewBook: (book: BookJourney) => void;
  onDownloadBook: (book: BookJourney) => void;
  showPopular?: boolean;
  showLatest?: boolean;
  limit?: number;
}

const BookJourneyGrid: React.FC<BookJourneyGridProps> = ({
  onViewBook,
  onDownloadBook,
  showPopular = false,
  showLatest = false,
  limit = 6
}) => {
  const [books, setBooks] = useState<BookJourney[]>([]);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    fetchBooks();
  }, [showPopular, showLatest, limit]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE}/api/v1/bookjourney`;
      
      if (showPopular) {
        url = `${API_BASE}/api/v1/bookjourney/popular`;
      } else if (showLatest) {
        url = `${API_BASE}/api/v1/bookjourney/latest`;
      }

      const response = await fetch(`${url}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      // Sort by created_at ASC (oldest first - who posted first shows first)
      const sortedBooks = (data.data || []).sort((a: BookJourney, b: BookJourney) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setBooks(sortedBooks);
    } catch (err) {
      setError('Không thể tải danh sách sách');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (book: BookJourney) => {
    try {
      // Tăng lượt xem khi mở PDF
      await fetch(`${API_BASE}/bookjourney/${book.id}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to update view count:', error);
    }
    
    // Xử lý PDF URL
    let pdfUrl = book.pdf_url;
    
    // Nếu URL bắt đầu với /uploads/, sử dụng API route
    if (pdfUrl.startsWith('/uploads/')) {
      pdfUrl = `/api${pdfUrl}`;
    }
    
    // Nếu URL không có protocol, thêm domain
    if (!pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://') && !pdfUrl.startsWith('/api/')) {
      pdfUrl = `https://yt2future.com${pdfUrl}`;
    }
    
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  // Bỏ hành động download; chỉ xem

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <Text className="text-center text-gray-500">Đang tải sách...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="w-12 h-12 text-red-500 mx-auto mb-4 text-5xl">⚠️</div>
        <Text className="text-red-600 mb-4">{error}</Text>
        <Button
          onClick={fetchBooks}
          variant="outline"
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          🔄 Thử lại
        </Button>
      </Card>
    );
  }

  if (books.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 text-gray-400 mx-auto mb-4 text-6xl">📚</div>
        <Heading level={3} className="text-gray-600 mb-2">
          Chưa có sách nào
        </Heading>
        <Text className="text-gray-500">
          Hành trình sách sẽ được cập nhật sớm nhất
        </Text>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile: horizontal scroll with snap */}
      <div className="md:hidden -mx-4 px-4">
        <div
          ref={mobileTrackRef}
          onScroll={() => {
            const el = mobileTrackRef.current;
            if (!el) return;
            const cardWidth = el.firstElementChild instanceof HTMLElement ? el.firstElementChild.offsetWidth + 16 /* gap */ : 1;
            const idx = Math.round(el.scrollLeft / Math.max(cardWidth, 1));
            if (idx !== activeIdx) setActiveIdx(Math.max(0, Math.min(idx, books.length - 1)));
          }}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {books.map((book) => (
            <div key={book.id} className="snap-center shrink-0 w-[85%]">
              <BookJourneyCard book={book} onView={handleView} />
            </div>
          ))}
        </div>
        {/* Dots indicator */}
        {books.length > 1 && (
          <div className="mt-2 flex justify-center gap-2">
            {books.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to book ${i + 1}`}
                onClick={() => {
                  const el = mobileTrackRef.current;
                  if (!el) return;
                  const child = el.children[i] as HTMLElement | undefined;
                  if (child) el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
                }}
                className={`${i === activeIdx ? 'bg-blue-600 w-3' : 'bg-gray-300 w-2'} h-2 rounded-full transition-all`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: grid 1 cột hoặc nhiều nếu cần */}
      <div className="hidden md:block">
        <Grid cols={1} gap="md">
          {books.map((book) => (
            <BookJourneyCard
              key={book.id}
              book={book}
              onView={handleView}
            />
          ))}
        </Grid>
      </div>

    </div>
  );
};

export default BookJourneyGrid;
