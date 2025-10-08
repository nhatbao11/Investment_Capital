"use client"

import React, { useState, useEffect } from "react";
// Removed framer-motion to avoid hover/scroll animations
import { useRouter } from "next/navigation";
import PageHeader from "../components/ui/PageHeader";
import BookJourneyGrid from "../components/ui/BookJourneyGrid";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import Heading from "../components/ui/Heading";
import Text from "../components/ui/Text";
import { useLanguage } from "../contexts/LanguageContext";

// Interface cho dữ liệu investment từ admin
interface InvestmentPost {
  id: number;
  title: string;
  image_url: string;
  images: string[];
  content: string;
  meaning: string;
  created_at: string;
  view_count: number;
}

// Interface cho BookJourney
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

const Investment: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [posts, setPosts] = useState<InvestmentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());

  // Toggle expand/collapse post
  const togglePost = (postId: number) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  // Handle BookJourney view
  const handleViewBook = (book: BookJourney) => {
    router.push(`/bookjourney/${book.id}`);
  };

  // Handle BookJourney download
  const handleDownloadBook = (book: BookJourney) => {
    console.log('Downloading book:', book.title);
  };

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const ENV_BASE = process.env.NEXT_PUBLIC_API_URL || '';
        const DEFAULT_BASE = 'http://localhost:5000';
        const candidates = [
          ENV_BASE ? `${ENV_BASE}/api/v1/investment-knowledge` : '',
          `${DEFAULT_BASE}/api/v1/investment-knowledge`
        ].filter(Boolean);

        let data: any = null;
        let lastErr: any = null;
        for (const url of candidates) {
          try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            data = await resp.json();
            lastErr = null;
            break;
          } catch (e) {
            lastErr = e;
          }
        }
        if (!data) throw lastErr || new Error('Failed to fetch investment knowledge');
        setPosts(data.data.knowledge);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching investment knowledge:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải nội dung...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Lỗi: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <PageHeader
        title={t("investment.page.title")}
        subtitle={t("investment.page.subtitle")}
        backgroundImage="/images/giaiphapdautu.jpg"
      />

      {/* Main Content */}
      <div className="relative">
        {/* Background Pattern - toned down on mobile for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        <div className="absolute inset-0 opacity-0 sm:opacity-5">
          <div className="hidden sm:block absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl"></div>
          <div className="hidden sm:block absolute top-40 right-20 w-24 h-24 bg-indigo-200 rounded-full blur-2xl"></div>
          <div className="hidden sm:block absolute bottom-20 left-1/4 w-40 h-40 bg-purple-200 rounded-full blur-3xl"></div>
          <div className="hidden sm:block absolute bottom-40 right-1/3 w-28 h-28 bg-cyan-200 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
          {/* BookJourney Section */}
          <Section id="bookjourney-section" className="mb-12 sm:mb-16">
            <div className="text-center mb-6 sm:mb-10">
              <Heading level={2} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{t("investment.bookjourney.title")}</Heading>
            </div>
            
            <BookJourneyGrid
              onViewBook={handleViewBook}
              onDownloadBook={handleDownloadBook}
              limit={6}
            />
          </Section>

          {/* Investment Knowledge Section */}
          <Section className="mb-10 sm:mb-16">
            <div className="text-center mb-6 sm:mb-10">
              <Heading level={2} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{t("investment.knowledge.title")}</Heading>
            </div>

          {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {t("investment.no.content")}
            </div>
            <p className="text-gray-400">
              {t("investment.no.content.subtitle")}
            </p>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-8 lg:space-y-10">
            {posts.map((post, index) => {
              const isExpanded = expandedPosts.has(post.id);
              
              return (
                <article key={post.id} className="bg-white border border-gray-200 shadow-lg rounded-xl sm:rounded-2xl overflow-hidden">
                  <div className="p-3 sm:p-6 md:p-8">
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">{post.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-6">
                      <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {!isExpanded ? (
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <span className="text-blue-700 hover:text-blue-800 cursor-pointer text-sm sm:text-base font-semibold underline-offset-2 hover:underline" onClick={() => togglePost(post.id)}>
                            {t("investment.view.more")}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
                        {/* Nội dung chính: tự tách đoạn cho dễ đọc */}
                        <div className="lg:col-span-2">
                          <div className="prose prose-slate sm:prose-base md:prose-lg max-w-none text-gray-900 mb-3 sm:mb-6">
                            {post.content
                              .split(/\n\s*\n/) // tách theo đoạn trống
                              .filter(p => p.trim().length > 0)
                              .map((p, idx) => (
                                <p key={idx} className="leading-6 sm:leading-7 md:leading-8 text-sm sm:text-base">{p}</p>
                              ))}
                          </div>
                          {post.meaning && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-5 md:p-6 mb-3 sm:mb-6">
                              <h4 className="text-blue-900 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{t("investment.meaning.title")}</h4>
                              <p className="text-blue-900/80 leading-6 sm:leading-7 whitespace-pre-wrap text-sm sm:text-base">{post.meaning}</p>
                            </div>
                          )}
                        </div>

                        {/* Hình ảnh và meta */}
                        <div className="space-y-3 sm:space-y-6">
                          {post.images && post.images.length > 0 && (
                            <div className="grid grid-cols-1 gap-3 sm:gap-5">
                              {post.images.slice(0,3).map((imageUrl, i) => (
                                <div key={i} className="w-full overflow-hidden rounded-lg sm:rounded-2xl border border-gray-200 shadow-sm">
                                  <img src={imageUrl} alt={`${post.title}-${i}`} className="w-full h-44 sm:h-64 md:h-80 lg:h-[28rem] object-cover" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="lg:col-span-3 flex justify-end mt-1 sm:mt-4">
                          <button onClick={() => togglePost(post.id)} className="text-blue-700 font-semibold underline-offset-2 hover:underline text-sm sm:text-base">{t("investment.collapse")}</button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          )}
        </Section>
        </div>
      </div>
    </div>
  );
};

export default Investment;
