import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineChevronDoubleDown, HiTrendingUp, HiShieldCheck, HiLightBulb, HiUsers } from "react-icons/hi";
import Slide from "../components/Layout/Slide";
import Vechungtoi from "../assets/images/vechungtoi.jpg";

const Home: React.FC = () => {
  const scrollToNext = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: <HiTrendingUp className="text-4xl text-blue-900" />,
      title: "Phân tích chuyên sâu",
      description: "Đánh giá toàn diện thị trường và cơ hội đầu tư với dữ liệu thời gian thực"
    },
    {
      icon: <HiShieldCheck className="text-4xl text-yellow-500" />,
      title: "Quản lý rủi ro",
      description: "Chiến lược bảo vệ vốn và tối ưu hóa lợi nhuận với mức rủi ro được kiểm soát"
    },
    {
      icon: <HiLightBulb className="text-4xl text-blue-900" />,
      title: "Giải pháp sáng tạo",
      description: "Tận dụng công nghệ AI và Machine Learning nhằm dự báo xu hướng thị trường, nhận diện cơ hội đầu tư tiềm năng"
    },
    {
      icon: <HiUsers className="text-4xl text-yellow-500" />,
      title: "Đội ngũ chuyên gia",
      description: "Các chuyên gia tài chính giàu kinh nghiệm đồng hành cùng bạn"
    }
  ];

  const stats = [
    { number: "Chuyên nghiệp", label: "Dịch vụ tận tâm và minh bạch" },
    { number: "Tối ưu rủi ro", label: "Ưu tiên bảo toàn vốn dài hạn" },
    { number: "Đồng hành", label: "Lắng nghe và hỗ trợ kịp thời" },
    { number: "Tin cậy", label: "Giải pháp dựa trên dữ liệu" }
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero Section with Video */}
      <div className="relative h-screen">
        <Slide className="-mt-px" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Y&T CAPITAL
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-blue-100 max-w-4xl mx-auto mb-8">
              Shaping Tomorrow Through Agile Innovation
            </p>
            <p className="text-lg sm:text-xl text-blue-200 max-w-3xl mx-auto mb-12">
              Khám phá cơ hội đầu tư cùng chúng tôi - nơi kết nối tài chính và đổi mới để xây dựng tương lai bền vững
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/about" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold transition duration-300 text-center">
                Tìm hiểu thêm
              </Link>
            </div>
          </motion.div>
        </div>
        <button
          onClick={scrollToNext}
          aria-label="Cuộn xuống"
          className="absolute left-1/2 -translate-x-1/2 bottom-25 group"
        >
          <HiOutlineChevronDoubleDown
            className="text-white text-3xl sm:text-4xl animate-bounce drop-shadow-lg"
          />
        </button>
      </div>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Tại sao chọn Y&T Capital?
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
              Chúng tôi mang đến những giải pháp đầu tư toàn diện và chuyên nghiệp
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition duration-300"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-base sm:text-lg text-yellow-100 font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-6">
                Về chúng tôi
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Y&T Capital là công ty đầu tư mới với tầm nhìn dài hạn, tập trung xây dựng những giải pháp đầu tư sáng tạo và bền vững cho khách hàng. 
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Đội ngũ chuyên gia giàu kinh nghiệm</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-900 rounded-full"></div>
                  <span className="text-gray-700">Công nghệ phân tích tiên tiến</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Dịch vụ khách hàng 24/7</span>
                </div>
              </div>
              <Link to="/about" className="inline-block mt-8 bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-300">
                Tìm hiểu thêm về chúng tôi
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-2xl shadow-lg">
                <img
                  src={Vechungtoi}
                  alt="Y&T Capital Team"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Sẵn sàng bắt đầu hành trình đầu tư?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và khám phá cơ hội đầu tư phù hợp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact#contact-form" className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-300 shadow-lg text-center">
                Liên hệ ngay
              </Link>
              <Link to="/investment" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold transition duration-300 text-center">
                Xem giải pháp
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;