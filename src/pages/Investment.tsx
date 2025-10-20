"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "../components/ui/PageHeader";
import BookJourneyGrid from "../components/ui/BookJourneyGrid";
import InvestmentFeed from "../components/ui/InvestmentFeed";
import Section from "../components/ui/Section";
import { useLanguage } from "../contexts/LanguageContext";

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

  // Handle BookJourney view
  const handleViewBook = (book: BookJourney) => {
    try {
      router.push(`/bookjourney/${book.id}`);
    } catch (error) {
      console.error('Error navigating to book:', error);
    }
  };

  // Handle BookJourney download
  const handleDownloadBook = (book: BookJourney) => {
    // Download functionality
  };

  try {
    return (
      <div className="min-h-screen bg-white">
        {/* Page Header */}
        <PageHeader
          title={t("investment.page.title")}
          subtitle={t("investment.page.subtitle")}
          backgroundImage="/images/giaiphapdautu.jpg"
          height="h-48"
        />

        {/* Main Content */}
        <div className="relative">
          <div className="relative max-w-7xl mx-auto py-6 sm:py-10 px-6 lg:px-8">
            {/* BookJourney Section */}
            <Section id="bookjourney-section" className="mb-10 sm:mb-14">
              <div className="text-left mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center p-2 rounded-md bg-blue-900 text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18V6C18 4.89543 17.1046 4 16 4H6Z"/><path d="M20 8H18V20H20C21.1046 20 22 19.1046 22 18V10C22 8.89543 21.1046 8 20 8Z"/></svg>
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{t("investment.bookjourney.title")}</h2>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 sm:p-6">
                <BookJourneyGrid
                  onViewBook={handleViewBook}
                  onDownloadBook={handleDownloadBook}
                  limit={6}
                />
              </div>
            </Section>

            {/* Investment Knowledge Section */}
            <InvestmentFeed title={t("investment.knowledge.title")} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in Investment component:', error);
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Có lỗi xảy ra</h1>
          <p className="text-gray-600 mb-4">Vui lòng tải lại trang hoặc thử lại sau</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }
};

export default Investment;
