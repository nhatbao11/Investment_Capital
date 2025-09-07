import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TeamCard from "../components/ui/TeamCard";
import MemberModal, { type Member } from "../components/ui/DetailTeamCard";
import PageHeader from "../components/ui/PageHeader";
import Nhat from "../assets/images/Nhat.jpg";
import Nga from "../assets/images/Nga.jpg";
import Bao from "../assets/images/Bao.jpg";
import VisionImg from "../assets/images/tamnhin.jpg";
import MissionImg from "../assets/images/sumenh.png";
import vechungtoi from '../assets/images/vechungtoi.jpg';

const About: React.FC = () => {
  const members: Member[] = [
    {
      name: "Trần Minh Nhật",
      title: "CEO & Founder",
      image: Nhat,
      description:
        "Anh Nhật là người sáng lập công ty, định hướng tầm nhìn và chiến lược tổng thể. Tập trung vào giải pháp đầu tư bền vững.",
      experience: "5+ năm kinh nghiệm trong lĩnh vực tài chính và đầu tư",
      strengths: ["Lãnh đạo chiến lược", "Phân tích tài chính", "Quản lý rủi ro", "Phát triển kinh doanh"],
      achievements: [
        "Tác giả của 3 cuốn sách về đầu tư tài chính",
        "...",
        "...",
        "..."
      ],
      education: "Thạc sĩ Tài chính - Đại học Kinh tế TP.HCM",
      linkedin: "linkedin.com/in/tran-minh-nhat",
      email: "nhat.tran@ytcapital.com"
    },
    {
      name: "Phạm Phương Nga",
      title: "Co-Founder",
      image: Nga,
      description:
        "Chị Nga phụ trách phát triển kinh doanh và đối tác. Kinh nghiệm trong vận hành và mở rộng quy mô.",
      experience: "5+ năm kinh nghiệm trong phát triển kinh doanh và quản lý đối tác",
      strengths: ["Phát triển kinh doanh", "Quản lý đối tác", "Vận hành doanh nghiệp", "Mở rộng thị trường"],
      achievements: [
        "Xây dựng mạng lưới 200+ đối tác chiến lược",
        "...",
        "...",
        "..."
      ],
      education: "Thạc sĩ Tài chính - Đại học Kinh tế TP.HCM",
      linkedin: "linkedin.com/in/pham-phuong-nga",
      email: "nga.pham@ytcapital.com"
    },
    {
      name: "Nguyễn Nhất Bảo",
      title: "Co-Founder",
      image: Bao,
      description:
        "Anh Bảo phụ trách công nghệ và sản phẩm. Tập trung tối ưu trải nghiệm và hiệu quả hệ thống.",
      experience: "5+ năm kinh nghiệm trong công nghệ tài chính và phát triển sản phẩm",
      strengths: ["Công nghệ tài chính", "Phát triển sản phẩm", "Tối ưu hóa hệ thống", "Đổi mới sáng tạo"],
      achievements: [
        "Phát triển 10+ sản phẩm fintech thành công",
        "...",
        "...",
        "..."
      ],
      education: "Cử nhân công nghệ thông tin - VKU",
      linkedin: "linkedin.com/in/nguyen-nhat-bao",
      email: "bao.nguyen@ytcapital.com"
    },
  ];

  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <div className="w-full text-blue-900 overflow-x-hidden">
      {/* Page Header */}
      <PageHeader
        title="Về Chúng Tôi"
        subtitle="Đồng hành cùng bạn trên hành trình tài chính bền vững"
        backgroundImage={vechungtoi}
      />

      {/* Vision & Mission Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl shadow-lg h-full">
                <img 
                  src={VisionImg} 
                  alt="Vision" 
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl shadow-lg mx-auto lg:mx-0" 
                />
                <h3 className="text-2xl sm:text-3xl font-bold mt-6 text-blue-900">Tầm nhìn</h3>
                <p className="text-gray-700 mt-4 text-base sm:text-lg leading-relaxed">
                  Trở thành đối tác tài chính tin cậy, đồng hành cùng khách hàng để thúc đẩy thịnh vượng bền vững.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg h-full">
                <img 
                  src={MissionImg} 
                  alt="Mission" 
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl shadow-lg mx-auto lg:mx-0" 
                />
                <h3 className="text-2xl sm:text-3xl font-bold mt-6 text-blue-900">Sứ mệnh</h3>
                <p className="text-gray-700 mt-4 text-base sm:text-lg leading-relaxed">
                  Cung cấp các sản phẩm và dịch vụ tài chính sáng tạo, tối ưu hóa lợi nhuận và giảm thiểu rủi ro.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Giá trị cốt lõi
            </h3>
            <p className="text-xl text-yellow-100 max-w-3xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { title: "Đổi mới", desc: "Không ngừng sáng tạo, mang đến giải pháp đầu tư hiện đại.", color: "blue" },
              { title: "Tin cậy", desc: "Luôn đặt lợi ích và sự tin tưởng của khách hàng lên hàng đầu.", color: "yellow" },
              { title: "Bền vững", desc: "Tạo ra giá trị lâu dài, cân bằng giữa lợi nhuận và trách nhiệm.", color: "blue" },
              { title: "Hợp tác", desc: "Xây dựng mối quan hệ gắn bó và đồng hành cùng đối tác.", color: "yellow" },
            ].map((val, index) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className={`p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all ${
                  val.color === 'blue' ? 'border-l-4 border-blue-900' : 'border-l-4 border-yellow-500'
                }`}
              >
                <h4 className={`text-xl sm:text-2xl font-bold mb-4 ${
                  val.color === 'blue' ? 'text-blue-900' : 'text-yellow-600'
                }`}>
                  {val.title}
                </h4>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Đội ngũ lãnh đạo
            </h3>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
              Những con người tài năng và tâm huyết đứng sau Y&T Capital
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {members.map((m) => (
              <TeamCard
                key={m.name}
                name={m.name}
                title={m.title}
                image={m.image}
                onClick={() => setSelected(m)}
              />
            ))}
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
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Sẵn sàng đồng hành cùng bạn?
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Liên hệ với chúng tôi để bắt đầu hành trình hợp tác và phát triển.
            </p>
            <Link
              to="/contact#contact-form"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-300 shadow-lg"
            >
              Liên hệ ngay
            </Link>
          </motion.div>
        </div>
      </section>

      {selected && (
        <MemberModal
          open={!!selected}
          onClose={() => setSelected(null)}
          member={selected}
        />
      )}
    </div>
  );
};

export default About;