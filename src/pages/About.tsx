"use client"

import type React from "react"
import { useState } from "react"
import { HashLink } from "react-router-hash-link"
import { motion } from "framer-motion"
import TeamCard from "../components/ui/TeamCard"
import MemberModal, { type Member } from "../components/ui/DetailTeamCard"
import PageHeader from "../components/ui/PageHeader"
import Nhat from "../assets/images/Nhat.jpg"
import Nga from "../assets/images/Nga.jpg"
import Bao from "../assets/images/Bao.jpg"
import VisionImg from "../assets/images/tamnhin.jpg"
import MissionImg from "../assets/images/sumenh.png"
import vechungtoi from "../assets/images/vechungtoi.jpg"
import { useLanguage } from "../contexts/LanguageContext"

const About: React.FC = () => {
  const { t } = useLanguage()

  const members: Member[] = [
    {
      name: "Trần Minh Nhật",
      title: "CEO & Founder",
      image: Nhat,
      description:
        "Anh Nhật là người sáng lập công ty, định hướng tầm nhìn và chiến lược tổng thể. Tập trung vào giải pháp đầu tư bền vững.",
      experience: "5+ năm kinh nghiệm trong lĩnh vực tài chính và đầu tư",
      strengths: ["Lãnh đạo chiến lược", "Phân tích tài chính", "Quản lý rủi ro", "Phát triển kinh doanh"],
      achievements: ["Tác giả của 3 cuốn sách về đầu tư tài chính", "...", "...", "..."],
      education: "Thạc sĩ Tài chính - Đại học Kinh tế TP.HCM",
      linkedin: "linkedin.com/in/tran-minh-nhat",
      email: "nhat.tran@ytcapital.com",
    },
    {
      name: "Phạm Phương Nga",
      title: "Co-Founder",
      image: Nga,
      description: "Chị Nga phụ trách phát triển kinh doanh và đối tác. Kinh nghiệm trong vận hành và mở rộng quy mô.",
      experience: "5+ năm kinh nghiệm trong phát triển kinh doanh và quản lý đối tác",
      strengths: ["Phát triển kinh doanh", "Quản lý đối tác", "Vận hành doanh nghiệp", "Mở rộng thị trường"],
      achievements: ["Xây dựng mạng lưới 200+ đối tác chiến lược", "...", "...", "..."],
      education: "Thạc sĩ Tài chính - Đại học Kinh tế TP.HCM",
      linkedin: "linkedin.com/in/pham-phuong-nga",
      email: "nga.pham@ytcapital.com",
    },
    {
      name: "Nguyễn Nhất Bảo",
      title: "Co-Founder",
      image: Bao,
      description: "Anh Bảo phụ trách công nghệ và sản phẩm. Tập trung tối ưu trải nghiệm và hiệu quả hệ thống.",
      experience: "5+ năm kinh nghiệm trong công nghệ tài chính và phát triển sản phẩm",
      strengths: ["Công nghệ tài chính", "Phát triển sản phẩm", "Tối ưa hóa hệ thống", "Đổi mới sáng tạo"],
      achievements: ["Phát triển 10+ sản phẩm fintech thành công", "...", "...", "..."],
      education: "Cử nhân công nghệ thông tin - VKU",
      linkedin: "linkedin.com/in/nguyen-nhat-bao",
      email: "bao.nguyen@ytcapital.com",
    },
  ]

  const [selected, setSelected] = useState<Member | null>(null)

  return (
    <div className="w-full  text-primary overflow-x-hidden bg-background">
      <PageHeader title={t("about.hero.title")} subtitle={t("about.hero.subtitle")} backgroundImage={vechungtoi} />

      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="card p-8 h-full flex flex-col">
                <img
                  src={VisionImg || "/placeholder.svg?height=300&width=500&query=professional vision concept"}
                  alt="Vision"
                  className="w-full h-64 object-cover rounded-lg mb-8"
                />
                <h3 className="text-3xl font-bold text-primary mb-6">{t("about.vision.title")}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed flex-grow">
                  {t("about.vision.description")}
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
              <div className="card p-8 h-full flex flex-col">
                <img
                  src={MissionImg || "/placeholder.svg?height=300&width=500&query=professional mission concept"}
                  alt="Mission"
                  className="w-full h-64 object-cover rounded-lg mb-8"
                />
                <h3 className="text-3xl font-bold text-primary mb-6">{t("about.mission.title")}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed flex-grow">
                  {t("about.mission.description")}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-primary to-primary/90">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl sm:text-5xl font-bold text-white mb-6">{t("about.values.title")}</h3>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: t("about.values.innovation"),
                desc: t("about.values.innovation.desc"),
                accent: false,
              },
              {
                title: t("about.values.integrity"),
                desc: t("about.values.integrity.desc"),
                accent: false,
              },
              {
                title: t("about.values.excellence"),
                desc: t("about.values.excellence.desc"),
                accent: false,
              },
              {
                title: t("about.values.partnership"),
                desc: t("about.values.partnership.desc"),
                accent: false,
              },
            ].map((val, index) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className={`card p-8 hover:shadow-xl transition-all duration-300 ${
                  val.accent ? "border-l-4 border-accent" : "border-l-4 border-primary"
                }`}
              >
                <h4 className={`text-2xl font-bold mb-4 ${val.accent ? "text-accent" : "text-primary"}`}>
                  {val.title}
                </h4>
                <p className="text-muted-foreground text-lg leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl sm:text-5xl font-bold text-primary mb-6">{t("about.team.title")}</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("about.team.subtitle")}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {members.map((m, index) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <TeamCard name={m.name} title={m.title} image={m.image} onClick={() => setSelected(m)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl sm:text-5xl font-bold text-white mb-8">{t("about.cta.title")}</h3>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t("about.cta.description")}
            </p>
            <HashLink
              smooth
              to="/contact#contact-form"
              className="btn-accent px-10 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {t("about.cta.contact")}
            </HashLink>
          </motion.div>
        </div>
      </section>

      {selected && <MemberModal open={!!selected} onClose={() => setSelected(null)} member={selected} />}
    </div>
  )
}

export default About
