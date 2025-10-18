"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import TeamCard from "../components/ui/TeamCard"
import MemberModal, { type Member } from "../components/ui/DetailTeamCard"
import PageHeader from "../components/ui/PageHeader"
import Image from "next/image"
import { useLanguage } from "../contexts/LanguageContext"

const About: React.FC = () => {
  const { t } = useLanguage()

  const members: Member[] = [
    {
      name: t("about.members.nhat.name"),
      title: t("about.members.nhat.title"),
      image: "/images/Nhat.jpg",
      description: t("about.members.nhat.description"),
      experience: t("about.members.nhat.experience"),
      strengths: t("about.members.nhat.strengths").split(", "),
      achievements: t("about.members.nhat.achievements").split(", "),
      education: t("about.members.nhat.education"),
      linkedin: "linkedin.com/in/tran-minh-nhat",
      email: "nhat.tran@ytcapital.com",
    },
    {
      name: t("about.members.nga.name"),
      title: t("about.members.nga.title"),
      image: "/images/Nga.jpg",
      description: t("about.members.nga.description"),
      experience: t("about.members.nga.experience"),
      strengths: t("about.members.nga.strengths").split(", "),
      achievements: t("about.members.nga.achievements").split(", "),
      education: t("about.members.nga.education"),
      linkedin: "linkedin.com/in/pham-phuong-nga",
      email: "nga.pham@ytcapital.com",
    },
    {
      name: t("about.members.bao.name"),
      title: t("about.members.bao.title"),
      image: "/images/Bao.jpg",
      description: t("about.members.bao.description"),
      experience: t("about.members.bao.experience"),
      strengths: t("about.members.bao.strengths").split(", "),
      achievements: t("about.members.bao.achievements").split(", "),
      education: t("about.members.bao.education"),
      linkedin: "linkedin.com/in/nguyen-nhat-bao",
      email: "bao.nguyen@ytcapital.com",
    },
  ]

  const [selected, setSelected] = useState<Member | null>(null)

  return (
    <div className="w-full  text-primary overflow-x-hidden bg-background">
      <PageHeader title={t("about.hero.title")} subtitle={t("about.hero.subtitle")} backgroundImage="/images/vechungtoi.jpg" height="h-48" />

      <div className="bg-gray-100 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center px-6 lg:px-8">

          {/* Text bên trái */}
          <div>
            <h2 className="text-xl sm:text-3xl font-bold text-blue-900 mb-4 flex items-center">
              {t("about.about_us.title")}
              <span className="ml-3 w-12 h-1 bg-blue-900 inline-block"></span>
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {t("about.about_us.description")}
            </p>
          </div>

          {/* Ảnh bên phải */}
          <div className="relative w-full max-w-4xl">
            <div className="absolute -bottom-6 -left-6 w-full h-full border-24 border-blue-900"></div>
            <div className="relative z-10 shadow-lg w-full h-auto">
              <Image
                src="/images/sumenh.png"
                alt="Về chúng tôi"
                width={800}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* <section className="py-24 bg-background">
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
                  src="/images/tamnhin.jpg"
                  alt="Vision"
                  className="w-full h-80 object-cover rounded-lg mb-8"
                  style={{
                    aspectRatio: '16/9',
                    minHeight: '320px',
                    maxHeight: '400px'
                  }}
                  loading="lazy"
                  decoding="async"
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
                  src="/images/sumenh.png"
                  alt="Mission"
                  className="w-full h-80 object-cover rounded-lg mb-8"
                  style={{
                    aspectRatio: '16/9',
                    minHeight: '320px',
                    maxHeight: '400px'
                  }}
                  loading="lazy"
                  decoding="async"
                />
                <h3 className="text-3xl font-bold text-primary mb-6">{t("about.mission.title")}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed flex-grow">
                  {t("about.mission.description")}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section> */}

      {/* <section className="py-24 bg-gradient-to-br from-primary to-primary/90">
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
                className={`card p-8 hover:shadow-xl transition-all duration-300 ${val.accent ? "border-l-4 border-accent" : "border-l-4 border-primary"
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
      </section> */}

      <section className="py-16 sm:py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-xl sm:text-3xl font-bold text-blue-900 mb-4 flex items-center">
              {t("about.team.title")}
              <span className="ml-3 w-12 h-1 bg-blue-900 inline-block"></span>
            </h2>
          </motion.div>
          {/* Mobile: horizontal swipe with scroll-snap */}
          <div className="md:hidden -mx-4 px-4">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none]" style={{ WebkitOverflowScrolling: 'touch' }}>
              {members.map((m, index) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="snap-center shrink-0 w-[80%]"
                >
                  <TeamCard
                    name={m.name}
                    title={m.title}
                    image={m.image}
                    onClick={() => setSelected(m)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop: keep grid layout */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((m, index) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <TeamCard
                  name={m.name}
                  title={m.title}
                  image={m.image}
                  onClick={() => setSelected(m)}
                />
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
            <h3 className="text-2xl sm:text-5xl font-bold text-white mb-8 -mt-10">{t("about.cta.title")}</h3>
            <p className="text-base sm:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t("about.cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center -mb-10">
              <Link
                href="/contact#contact-form"
                className="px-4 py-2 sm:px-6 text-sm sm:text-base font-semibold rounded-md text-white bg-blue-900 relative overflow-hidden before:absolute before:top-0 before:left-[-100%] before:h-full before:w-full before:bg-yellow-500 before:transition-all before:duration-500 hover:before:left-0 shadow-md transition-colors duration-300">
                <span className="relative z-10">{t("about.cta.contact")}</span>
              </Link>
</div>
          </motion.div>
        </div>
      </section>

      {selected && <MemberModal open={!!selected} onClose={() => setSelected(null)} member={selected} />}
    </div>
  )
}

export default About
