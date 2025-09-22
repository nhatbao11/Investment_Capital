"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { HiOutlineChevronDoubleDown, HiTrendingUp, HiShieldCheck, HiLightBulb, HiUsers } from "react-icons/hi"
import Slide from "../components/Layout/Slide"
import Vechungtoi from "../assets/images/vechungtoi.jpg"
import { HashLink } from "react-router-hash-link"
import { useLanguage } from "../contexts/LanguageContext"

const Home: React.FC = () => {
  const { t } = useLanguage()

  const scrollToNext = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  const features = [
    {
      icon: <HiTrendingUp className="text-4xl text-blue-900" />,
      title: t("home.features.analysis.title"),
      description: t("home.features.analysis.description"),
    },
    {
      icon: <HiShieldCheck className="text-4xl text-yellow-500" />,
      title: t("home.features.risk.title"),
      description: t("home.features.risk.description"),
    },
    {
      icon: <HiLightBulb className="text-4xl text-blue-900" />,
      title: t("home.features.innovation.title"),
      description: t("home.features.innovation.description"),
    },
    {
      icon: <HiUsers className="text-4xl text-yellow-500" />,
      title: t("home.features.team.title"),
      description: t("home.features.team.description"),
    },
  ]

  const stats = [
    { number: t("home.stats.professional"), label: t("home.stats.professional.desc") },
    { number: t("home.stats.risk"), label: t("home.stats.risk.desc") },
    { number: t("home.stats.support"), label: t("home.stats.support.desc") },
    { number: t("home.stats.trust"), label: t("home.stats.trust.desc") },
  ]

  return (
    <div className="bg-background overflow-x-hidden">
      <div className="relative h-screen">
        <Slide className="-mt-px" />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-6 max-w-6xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              {t("home.hero.title")}
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-slate-200 max-w-4xl mx-auto mb-6 font-light">
              {t("home.hero.subtitle")}
            </p>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              {t("home.hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
  to="/about"
  className="text-lg px-10 py-4 rounded-xl font-semibold 
             border border-black text-white
             hover:bg-white hover:text-blue-900
             shadow-xl hover:shadow-2xl 
             transition-all duration-300"
>
  {t("home.hero.learnMore")}
</Link>

            </div>
          </motion.div>
        </div>
        <button
          onClick={scrollToNext}
          aria-label={t("home.hero.scrollDown")}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 group"
        >
          <HiOutlineChevronDoubleDown className="text-white text-4xl animate-bounce drop-shadow-lg group-hover:text-accent transition-colors" />
        </button>
      </div>

      <section id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-6">{t("home.features.title")}</h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
              {t("home.features.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">{feature.title}</h3>
                <p className="text-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-primary/90">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
                <div className="text-3xl sm:text-4xl font-bold text-white mb-3">{stat.number}</div>
                <div className="text-lg text-primary-foreground/90 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-8">{t("home.about.title")}</h2>
              <p className="text-xl text-foreground mb-8 leading-relaxed">{t("home.about.description")}</p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-900 rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground text-lg">{t("home.about.point1")}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground text-lg">{t("home.about.point2")}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-900 rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground text-lg">{t("home.about.point3")}</span>
                </div>
              </div>
              <Link
                to="/about"
                className="btn-primary inline-block mt-10 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t("home.about.learnMore")}
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card p-6 shadow-xl">
                <img
                  src={Vechungtoi || "/placeholder.svg?height=400&width=600&query=professional investment team"}
                  alt="Y&T Capital Team"
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
            </motion.div>
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
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">{t("home.cta.title")}</h2>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t("home.cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <HashLink
                smooth
                to="/contact#contact-form"
                className="btn-accent px-10 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {t("home.cta.contact")}
              </HashLink>
              <Link
                to="/investment"
                className="btn-outline px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                {t("home.cta.solutions")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
