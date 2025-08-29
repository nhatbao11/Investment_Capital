import React from 'react';

const Sector: React.FC = () => {
  const openPDF = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header with full-width image */}
      <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh]">
        <img
          src="placeholder.jpg" // Thay bằng ảnh thực
          alt="Phân tích Ngành"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
            Phân tích Ngành
          </h1>
        </div>
      </div>

      {/* Content sections */}
      <div className="p-4 sm:p-6 md:p-8 space-y-12 md:space-y-16">
        {/* Section 1: Chữ trái, ảnh phải */}
        <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
          <div className="w-full md:w-1/2 p-4 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-300 mb-3 sm:mb-4">
              Ngành Tài chính
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-3 sm:mb-4">
              Tổng quan về ngành tài chính, bao gồm xu hướng ngân hàng, bảo hiểm và đầu tư, với các chỉ số kinh tế vĩ mô ảnh hưởng.
            </p>
            <button
              onClick={() => openPDF('/path/to/finance-sector.pdf')} // Thay bằng đường dẫn PDF thực
              className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Xem thêm
            </button>
          </div>
          <div className="w-full md:w-1/2">
            <img
              src="placeholder1.jpg" // Thay bằng ảnh thực
              alt="Ảnh minh họa Ngành Tài chính"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Section 2: Chữ phải, ảnh trái */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
          <div className="w-full md:w-1/2">
            <img
              src="placeholder2.jpg" // Thay bằng ảnh thực
              alt="Ảnh minh họa Ngành Công nghệ"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 p-4 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-300 mb-3 sm:mb-4">
              Ngành Công nghệ
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-3 sm:mb-4">
              Phân tích ngành công nghệ, tập trung vào đổi mới AI, phần mềm và phần cứng, cùng với các thách thức toàn cầu.
            </p>
            <button
              onClick={() => openPDF('/path/to/tech-sector.pdf')} // Thay bằng đường dẫn PDF thực
              className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Xem thêm
            </button>
          </div>
        </div>

        {/* Section 3: Chữ trái, ảnh phải */}
        <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
          <div className="w-full md:w-1/2 p-4 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-300 mb-3 sm:mb-4">
              Ngành Sản xuất
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-3 sm:mb-4">
              Đánh giá ngành sản xuất, bao gồm chuỗi cung ứng, tự động hóa và tác động của thương mại quốc tế.
            </p>
            <button
              onClick={() => openPDF('/path/to/manufacturing-sector.pdf')} // Thay bằng đường dẫn PDF thực
              className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Xem thêm
            </button>
          </div>
          <div className="w-full md:w-1/2">
            <img
              src="placeholder3.jpg" // Thay bằng ảnh thực
              alt="Ảnh minh họa Ngành Sản xuất"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Section 4: Chữ phải, ảnh trái */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
          <div className="w-full md:w-1/2">
            <img
              src="placeholder4.jpg" // Thay bằng ảnh thực
              alt="Ảnh minh họa Ngành Năng lượng"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 p-4 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-300 mb-3 sm:mb-4">
              Ngành Năng lượng
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-3 sm:mb-4">
              Khảo sát ngành năng lượng, từ dầu khí đến năng lượng tái tạo, với trọng tâm vào bền vững và chuyển đổi.
            </p>
            <button
              onClick={() => openPDF('/path/to/energy-sector.pdf')} // Thay bằng đường dẫn PDF thực
              className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Xem thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sector;