import React from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import phantichdoanhnghiep from '../assets/images/phantichdoanhnghiep.jpg';

const Analysis: React.FC = () => {
  const openPDF = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Phân tích Doanh nghiệp"
        subtitle="Khám phá cơ hội đầu tư thông qua phân tích chuyên sâu và đánh giá toàn diện"
        backgroundImage={phantichdoanhnghiep}
      />

      {/* Content sections */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-20">
        {/* Section 1: Chỉ số Tài chính */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
        >
          <div className="w-full lg:w-1/2">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">
                Chỉ số Tài chính Cốt lõi
              </h3>
              <p className="text-gray-700 mb-6 text-base sm:text-lg leading-relaxed">
                Phân tích sâu các chỉ số tài chính quan trọng như P/E, EPS, ROE, ROA và vốn hóa thị trường 
                để đánh giá hiệu quả hoạt động và tiềm năng tăng trưởng của doanh nghiệp.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">P/E</div>
                  <div className="text-sm text-gray-600">Price-to-Earnings</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">ROE</div>
                  <div className="text-sm text-gray-600">Return on Equity</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">EPS</div>
                  <div className="text-sm text-gray-600">Earnings per Share</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">ROA</div>
                  <div className="text-sm text-gray-600">Return on Assets</div>
                </div>
              </div>
              <button
                onClick={() => openPDF('/path/to/finance.pdf')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
              >
                Xem báo cáo chi tiết
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-lg font-semibold">Biểu đồ Phân tích</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Khuyến nghị & Tín hiệu */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12"
        >
          <div className="w-full lg:w-1/2">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">📈</div>
                  <div className="text-lg font-semibold">Biểu đồ Khuyến nghị</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl sm:text-3xl font-bold text-yellow-900 mb-4">
                Khuyến nghị & Tín hiệu
              </h3>
              <p className="text-gray-700 mb-6 text-base sm:text-lg leading-relaxed">
                Đánh giá toàn diện triển vọng đầu tư dựa trên phân tích kỹ thuật, cơ bản và các tín hiệu 
                thị trường quan trọng để đưa ra khuyến nghị đầu tư phù hợp.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Phân tích xu hướng giá</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Đánh giá rủi ro</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Dự báo giá mục tiêu</span>
                </div>
              </div>
              <button
                onClick={() => openPDF('/path/to/recommendation.pdf')}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition duration-300 font-medium"
              >
                Xem khuyến nghị chi tiết
              </button>
            </div>
          </div>
        </motion.div>

        {/* Section 3: Mục tiêu Giá & Phân tích */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
        >
          <div className="w-full lg:w-1/2">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">
                Mục tiêu Giá & Phân tích
              </h3>
              <p className="text-gray-700 mb-6 text-base sm:text-lg leading-relaxed">
                Phân tích chuyên sâu giá mục tiêu dựa trên các mô hình định giá, xu hướng thị trường 
                và các yếu tố cơ bản/kỹ thuật để đưa ra dự báo chính xác.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-blue-600">DCF</div>
                  <div className="text-sm text-gray-600">Discounted Cash Flow</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-indigo-600">PEG</div>
                  <div className="text-sm text-gray-600">Price/Earnings Growth</div>
                </div>
              </div>
              <button
                onClick={() => openPDF('/path/to/price-analysis.pdf')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
              >
                Xem phân tích giá
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">💰</div>
                  <div className="text-lg font-semibold">Mô hình Định giá</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 4: Mô tả Doanh nghiệp */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12"
        >
          <div className="w-full lg:w-1/2">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🏢</div>
                  <div className="text-lg font-semibold">Tổng quan Doanh nghiệp</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl sm:text-3xl font-bold text-yellow-900 mb-4">
                Mô tả Doanh nghiệp
              </h3>
              <p className="text-gray-700 mb-6 text-base sm:text-lg leading-relaxed">
                Tổng quan chi tiết về hoạt động kinh doanh, chiến lược phát triển, 
                thị trường mục tiêu và tiềm năng tăng trưởng của doanh nghiệp.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Lịch sử phát triển</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Chiến lược kinh doanh</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Thị trường mục tiêu</span>
                </div>
              </div>
              <button
                onClick={() => openPDF('/path/to/description.pdf')}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition duration-300 font-medium"
              >
                Xem mô tả chi tiết
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analysis;