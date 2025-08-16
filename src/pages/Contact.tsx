import React from 'react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-300">Liên hệ với chúng tôi</h2>
      <p className="mb-6 text-gray-300">Chúng tôi rất vui lòng hỗ trợ bạn, vui lòng liên hệ qua các kênh sau.</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg mb-6"
      >
        <h3 className="text-xl font-semibold text-green-300 mb-4">Thông tin Liên hệ</h3>
        <div className="space-y-3 text-gray-200">
          <p><strong>Email:</strong> <a href="mailto:minhnhat1009@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">minhnhat1009@gmail.com</a></p>
          <p><strong>Điện thoại:</strong> <a href="tel:+84822082407" className="text-blue-400 hover:text-blue-300 transition-colors">+84 822 082 407</a></p>
          <p><strong>Địa chỉ:</strong> 92, 19E, Phường An Lạc, TP. Hồ Chí Minh</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg mb-6"
      >
        <h3 className="text-xl font-semibold text-purple-300 mb-4">Mạng Xã hội</h3>
        <div className="space-y-3 text-gray-200">
          <p><strong>Facebook:</strong> <a href="https://facebook.com/Y&TCapital" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">facebook.com/Y&TCapital</a></p>
          <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/company/Y&TCapital" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">linkedin.com/company/Y&TCapital</a></p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold text-yellow-300 mb-4">Gửi tin nhắn cho chúng tôi</h3>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Họ và tên"
            className="w-full p-3 bg-gray-700 rounded-lg text-white border-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-700 rounded-lg text-white border-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Tin nhắn"
            rows={4}
            className="w-full p-3 bg-gray-700 rounded-lg text-white border-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Gửi
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;