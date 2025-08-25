import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TeamCard from "../components/ui/TeamCard";
import MemberModal, { type Member } from "../components/ui/DetailTeamCard";
import Nhat from "../assets/images/Nhat.jpg";
import Nga from "../assets/images/Nga.jpg";
import Bao from "../assets/images/Bao.jpg";
import VisionImg from "../assets/images/tamnhin.jpg";
import Vechungtoi from "../assets/images/vechungtoi.jpg";
import MissionImg from "../assets/images/sumenh.png";

const About: React.FC = () => {
  const members: Member[] = [
    {
      name: "Trần Minh Nhật",
      title: "CEO & Founder",
      image: Nhat,
      description:
        "Anh Nhật là người sáng lập công ty, định hướng tầm nhìn và chiến lược tổng thể. Tập trung vào giải pháp đầu tư bền vững.",
    },
    {
      name: "Phạm Phương Nga",
      title: "Co-Founder",
      image: Nga,
      description:
        "Chị Nga phụ trách phát triển kinh doanh và đối tác. Kinh nghiệm trong vận hành và mở rộng quy mô.",
    },
    {
      name: "Nguyễn Nhất Bảo",
      title: "Co-Founder",
      image: Bao,
      description:
        "Anh Bảo phụ trách công nghệ và sản phẩm. Tập trung tối ưu trải nghiệm và hiệu quả hệ thống.",
    },
  ];

  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <div className="w-full text-blue-900 overflow-x-hidden">
      <section
        className="relative min-h-[80vh] max-h-[70vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${Vechungtoi})` }}
      >
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center text-white px-4"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Về Chúng Tôi</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Đồng hành cùng bạn trên hành trình tài chính bền vững.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-10 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img src={VisionImg} alt="Vision" className="w-full h-48 object-cover rounded-2xl shadow-lg" />
            <h3 className="text-2xl md:text-3xl font-bold mt-6">Tầm nhìn</h3>
            <p className="text-black mt-4 text-base md:text-lg">
              Trở thành đối tác tài chính tin cậy, đồng hành cùng khách hàng để thúc đẩy thịnh vượng bền vững.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img src={MissionImg} alt="Mission" className="w-full h-48 object-cover rounded-2xl shadow-lg" />
            <h3 className="text-2xl md:text-3xl font-bold mt-6">Sứ mệnh</h3>
            <p className="text-black mt-4 text-base md:text-lg">
              Cung cấp các sản phẩm và dịch vụ tài chính sáng tạo, tối ưu hóa lợi nhuận và giảm thiểu rủi ro.
            </p>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-24 px-6 md:px-16 bg-white text-center">
        <h3 className="text-3xl md:text-4xl font-extrabold mb-10">Giá trị cốt lõi</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "Đổi mới", desc: "Không ngừng sáng tạo, mang đến giải pháp đầu tư hiện đại." },
            { title: "Tin cậy", desc: "Luôn đặt lợi ích và sự tin tưởng của khách hàng lên hàng đầu." },
            { title: "Bền vững", desc: "Tạo ra giá trị lâu dài, cân bằng giữa lợi nhuận và trách nhiệm." },
            { title: "Hợp tác", desc: "Xây dựng mối quan hệ gắn bó và đồng hành cùng đối tác." },
          ].map((val) => (
            <motion.div
              key={val.title}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className="p-5 bg-gray-50 rounded-2xl shadow-md hover:shadow-xl transition-all"
            >
              <h4 className="text-xl font-bold mb-2">{val.title}</h4>
              <p className="text-gray-700 text-sm md:text-base">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 bg-gray-100">
        <h3 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">Đội ngũ</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
      </section>

      <section className="py-24 px-6 md:px-16 bg-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6">Sẵn sàng đồng hành cùng bạn?</h3>
          <p className="mb-8 text-blue-800 text-base md:text-lg">
            Liên hệ với chúng tôi để bắt đầu hành trình hợp tác và phát triển.
          </p>
          <Link
            to="/contact#contact-form"
            className="px-8 py-3 bg-blue-900 text-white rounded-full shadow-lg hover:bg-blue-800 transition-all duration-300"
          >
            Liên hệ ngay
          </Link>
        </motion.div>
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