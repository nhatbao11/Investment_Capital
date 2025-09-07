import React from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import phantichnganh from '../assets/images/phantichnganh.png';

const Sector: React.FC = () => {
  const openPDF = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  const sectors = [
    {
      id: 'finance',
      title: 'Ngành Tài chính',
      description: 'Tổng quan về ngành tài chính, bao gồm xu hướng ngân hàng, bảo hiểm và đầu tư, với các chỉ số kinh tế vĩ mô ảnh hưởng.',
      color: 'blue',
      icon: '🏦',
      metrics: ['Lãi suất', 'Tỷ lệ nợ xấu', 'Vốn hóa', 'ROE']
    },
    {
      id: 'technology',
      title: 'Ngành Công nghệ',
      description: 'Phân tích ngành công nghệ, tập trung vào đổi mới AI, phần mềm và phần cứng, cùng với các thách thức toàn cầu.',
      color: 'yellow',
      icon: '💻',
      metrics: ['R&D', 'Tăng trưởng', 'Đổi mới', 'Thị phần']
    },
    {
      id: 'manufacturing',
      title: 'Ngành Sản xuất',
      description: 'Đánh giá ngành sản xuất, bao gồm chuỗi cung ứng, tự động hóa và tác động của thương mại quốc tế.',
      color: 'blue',
      icon: '🏭',
      metrics: ['Năng suất', 'Chi phí', 'Chuỗi cung ứng', 'Tự động hóa']
    },
    {
      id: 'energy',
      title: 'Ngành Năng lượng',
      description: 'Khảo sát ngành năng lượng, từ dầu khí đến năng lượng tái tạo, với trọng tâm vào bền vững và chuyển đổi.',
      color: 'yellow',
      icon: '⚡',
      metrics: ['Giá dầu', 'Năng lượng tái tạo', 'Bền vững', 'Chuyển đổi']
    }
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Phân tích Ngành"
        subtitle="Khám phá cơ hội đầu tư thông qua phân tích chuyên sâu các ngành kinh tế chủ chốt"
        // backgroundClass="bg-gradient-to-br from-blue-900 to-blue-700"
        backgroundImage={phantichnganh}

      />

      {/* Content sections */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-20">
        {sectors.map((sector, index) => (
          <motion.div
            key={sector.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className="w-full lg:w-1/2">
              <div className={`p-6 sm:p-8 rounded-2xl shadow-lg ${
                sector.color === 'blue' 
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100' 
                  : 'bg-gradient-to-br from-yellow-50 to-yellow-100'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{sector.icon}</div>
                  <h3 className={`text-2xl sm:text-3xl font-bold ${
                    sector.color === 'blue' ? 'text-blue-900' : 'text-yellow-900'
                  }`}>
                    {sector.title}
                  </h3>
                </div>
                <p className="text-gray-700 mb-6 text-base sm:text-lg leading-relaxed">
                  {sector.description}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {sector.metrics.map((metric, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg shadow-sm text-center">
                      <div className={`text-sm font-semibold ${
                        sector.color === 'blue' ? 'text-blue-600' : 'text-yellow-600'
                      }`}>{metric}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => openPDF(`/path/to/${sector.id}-sector.pdf`)}
                  className={`px-6 py-3 rounded-lg transition duration-300 font-medium ${
                    sector.color === 'blue' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }`}
                >
                  Xem báo cáo ngành
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl shadow-lg">
                <div className={`aspect-video rounded-lg flex items-center justify-center ${
                  sector.color === 'blue' 
                    ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
                    : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                }`}>
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">{sector.icon}</div>
                    <div className="text-lg font-semibold">Biểu đồ {sector.title}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Sector;