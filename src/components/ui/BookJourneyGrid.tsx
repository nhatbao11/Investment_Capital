'use client';

import React, { useState, useEffect, useRef } from 'react';
import Grid from './Grid';
import Card from './Card';
import Heading from './Heading';
import Text from './Text';
import Button from './Button';
import BookJourneyCard from './BookJourneyCard';
import { getApiBaseUrl, resolvePdfUrl } from '../../utils/apiConfig';

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
  const API_BASE = getApiBaseUrl();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const desktopTrackRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [desktopActiveIdx, setDesktopActiveIdx] = useState(0);
  const mobileAutoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const desktopAutoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchBooks();
  }, [showPopular, showLatest, limit]);

  // Auto-slide for mobile
  useEffect(() => {
    if (books.length <= 1) return;
    
    // Clear existing interval
    if (mobileAutoSlideIntervalRef.current) {
      clearInterval(mobileAutoSlideIntervalRef.current);
    }

    // Set up auto-slide
    mobileAutoSlideIntervalRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % books.length;
        const el = mobileTrackRef.current;
        if (el) {
          const cardWidth = el.firstElementChild instanceof HTMLElement 
            ? el.firstElementChild.offsetWidth + 16 
            : 1;
          el.scrollTo({ left: next * cardWidth, behavior: 'smooth' });
        }
        return next;
      });
    }, 5000);

    return () => {
      if (mobileAutoSlideIntervalRef.current) {
        clearInterval(mobileAutoSlideIntervalRef.current);
      }
    };
  }, [books.length]);

  // Auto-slide for desktop
  useEffect(() => {
    const visibleCount = 2;
    const totalSlides = Math.ceil(books.length / visibleCount);
    if (totalSlides <= 1) return;
    
    // Clear existing interval
    if (desktopAutoSlideIntervalRef.current) {
      clearInterval(desktopAutoSlideIntervalRef.current);
    }

    // Set up auto-slide
    desktopAutoSlideIntervalRef.current = setInterval(() => {
      setDesktopActiveIdx((prev) => {
        const next = (prev + 1) % totalSlides;
        const el = desktopTrackRef.current;
        if (el && el.firstElementChild) {
          const firstChild = el.firstElementChild as HTMLElement;
          const cardWidth = firstChild.offsetWidth;
          const gap = 16; // gap-4 = 16px
          const scrollPosition = next * (cardWidth + gap) * visibleCount;
          el.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        }
        return next;
      });
    }, 5000);

    return () => {
      if (desktopAutoSlideIntervalRef.current) {
        clearInterval(desktopAutoSlideIntervalRef.current);
      }
    };
  }, [books.length]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE}/bookjourney`;
      
      if (showPopular) {
        url = `${API_BASE}/bookjourney/popular`;
      } else if (showLatest) {
        url = `${API_BASE}/bookjourney/latest`;
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
    const pdfUrl = resolvePdfUrl(book.pdf_url);
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

      {/* Desktop: horizontal slide with max 2 items */}
      <div className="hidden md:block">
        <div className="relative overflow-hidden">
          <div
            ref={desktopTrackRef}
            onScroll={() => {
              const el = desktopTrackRef.current;
              if (!el || !el.firstElementChild) return;
              const firstChild = el.firstElementChild as HTMLElement;
              const cardWidth = firstChild.offsetWidth;
              const gap = 16; // gap-4 = 16px
              const visibleCount = 2;
              const slideWidth = (cardWidth + gap) * visibleCount;
              const idx = Math.round(el.scrollLeft / slideWidth);
              const totalSlides = Math.ceil(books.length / visibleCount);
              if (idx !== desktopActiveIdx) {
                setDesktopActiveIdx(Math.max(0, Math.min(idx, totalSlides - 1)));
              }
            }}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {books.map((book) => (
              <div key={book.id} className="snap-center shrink-0 w-[calc(50%-0.5rem)]">
                <BookJourneyCard book={book} onView={handleView} />
              </div>
            ))}
          </div>
          {/* Dots indicator for desktop */}
          {Math.ceil(books.length / 2) > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: Math.ceil(books.length / 2) }).map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => {
                    const el = desktopTrackRef.current;
                    if (!el || !el.firstElementChild) return;
                    const firstChild = el.firstElementChild as HTMLElement;
                    const cardWidth = firstChild.offsetWidth;
                    const gap = 16; // gap-4 = 16px
                    const visibleCount = 2;
                    const scrollPosition = i * (cardWidth + gap) * visibleCount;
                    el.scrollTo({ 
                      left: scrollPosition, 
                      behavior: 'smooth' 
                    });
                  }}
                  className={`${
                    i === desktopActiveIdx 
                      ? 'bg-blue-600 w-3' 
                      : 'bg-gray-300 w-2'
                  } h-2 rounded-full transition-all`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default BookJourneyGrid;
