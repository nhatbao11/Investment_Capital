import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Investment: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-300">Hệ thống Đầu tư</h2>
      <p className="mb-6 text-gray-300">Tìm hiểu về phương pháp, quản trị rủi ro và kiến thức đầu tư.</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg mb-6"
      >
        <h3 className="text-xl font-semibold text-green-300 mb-4">Phương pháp Đầu tư</h3>
        <p className="text-gray-200 mb-4">
          Chương trình áp dụng phương pháp đầu tư kết hợp giữa <strong>Phân tích Cơ bản (Fundamental Analysis)</strong> và <strong>Phân tích Kỹ thuật (Technical Analysis)</strong> để tối ưu hóa lợi nhuận và giảm thiểu rủi ro.
        </p>
        <ul className="list-disc pl-6 text-gray-200 space-y-2">
          <li>
            <strong>Phân tích Cơ bản:</strong> Đánh giá sức khỏe tài chính, mức độ minh bạch và tiềm năng tăng trưởng dài hạn của doanh nghiệp.
          </li>
          <li>
            <strong>Phân tích Kỹ thuật:</strong> Sử dụng biểu đồ, chỉ số kỹ thuật (như RSI, MACD) để xác định xu hướng giá và điểm vào/ra hợp lý.
          </li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg mb-6"
      >
        <h3 className="text-xl font-semibold text-yellow-300 mb-4">Quản trị Rủi ro</h3>
        <p className="text-gray-200 mb-4">
          Hệ thống quản lý rủi ro được thiết kế để bảo vệ vốn đầu tư với các chiến lược sau:
        </p>
        <ul className="list-disc pl-6 text-gray-200 space-y-2">
          <li>Đa dạng hóa danh mục đầu tư để giảm thiểu rủi ro tập trung.</li>
          <li>Đặt dừng lỗ (Stop Loss) và chốt lời (Take Profit) tự động.</li>
          <li>Đánh giá định kỳ để điều chỉnh chiến lược phù hợp với thị trường.</li>
        </ul>
        <button
          onClick={toggleExpand}
          className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
        >
          {isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết quản trị rủi ro'}
        </button>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 text-gray-200"
          >
            <p>Chiến lược quản trị rủi ro bao gồm phân tích biến động thị trường, sử dụng tỷ lệ rủi ro/lợi nhuận (Risk/Reward Ratio) từ 1:2 trở lên, và theo dõi các yếu tố vĩ mô như lãi suất và chính sách tiền tệ.</p>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold text-purple-300 mb-4">Kiến thức Đầu tư</h3>
        <p className="text-gray-200 mb-4">
          Chúng tôi cung cấp tài liệu và khóa học để nâng cao kỹ năng đầu tư:
        </p>
        <ul className="list-disc pl-6 text-gray-200 space-y-2">
          <li>Hiểu biết về các loại chứng khoán (cổ phiếu, trái phiếu, quỹ).</li>
          <li>Phân tích báo cáo tài chính và chỉ số tài chính quan trọng.</li>
          <li>Cập nhật xu hướng thị trường và chiến lược đầu tư dài hạn.</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Investment;