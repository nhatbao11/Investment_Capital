"use client"

import type React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { HiOutlineChevronDoubleDown, HiTrendingUp, HiShieldCheck, HiLightBulb, HiUsers } from "react-icons/hi"
import Slide from "../components/Layout/Slide"
import Image from "next/image"
import { useLanguage } from "../contexts/LanguageContext"
import HeroSection from "../components/sections/HeroSection"
// import FeaturesSection from "../components/sections/FeaturesSection"
import ServicesSection from "../components/sections/ServicesSection"
import FeedbackSection from "../components/sections/FeedbackSection"
import { useState, useEffect } from "react"
import { usePosts } from "../services/hooks/usePosts"
import { Post } from "../services/types/posts"
import PostImage from "../components/ui/PostImage"
import { postsApi } from "../services/api/posts"

const Home: React.FC = () => {
  const { t } = useLanguage()
  const { fetchLatestPosts } = usePosts()
  const [latestPosts, setLatestPosts] = useState<Post[]>([])

  const scrollToNext = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadLatestPosts = async () => {
      try {
        const posts = await fetchLatestPosts(6)
        setLatestPosts(posts)
      } catch (error) {
        console.error('Failed to load latest posts:', error)
      }
    }
    loadLatestPosts()
  }, [])

  const handleViewReport = async (post: Post) => {
    try {
      // Tăng lượt xem khi click vào bài viết
      await postsApi.incrementViewCount(post.id)
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  const features = [
    {
      icon: <HiTrendingUp className="text-4xl text-blue-900" />,
      title: t("home.features.analysis.title"),
      description: t("home.features.analysis.description"),
      href: "/sector",
    },
    {
      icon: <HiShieldCheck className="text-4xl text-yellow-500" />,
      title: t("home.features.risk.title"),
      description: t("home.features.risk.description"),
      href: "/analysis",
    },
    {
      icon: <HiLightBulb className="text-4xl text-blue-900" />,
      title: t("home.features.innovation.title"),
      description: t("home.features.innovation.description"),
      href: "/investment",
    },
    {
      icon: <HiUsers className="text-4xl text-yellow-500" />,
      title: t("home.features.team.title"),
      description: t("home.features.team.description"),
      href: "/about",
    },
  ];

  return (
    <div className="bg-background overflow-x-hidden">
      <div className="relative">
        <Slide className="-mt-px" />
        <div className="absolute inset-0 flex items-end md:items-start justify-start bg-gradient-to-b from-slate-900/70 via-slate-900/30 to-transparent md:bg-gradient-to-br md:from-slate-900/60 md:via-slate-800/50 md:to-slate-900/60 pb-1 sm:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left text-white px-4 sm:px-6 max-w-3xl sm:max-w-5xl mb-0 md:mt-20 lg:mt-28 xl:mt-32"
          >
            <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
              {t("home.hero.title")}
            </h1>

            <p className="text-sm sm:text-xl md:text-2xl text-slate-200 font-medium max-w-2xl sm:max-w-4xl mb-5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
              {t("home.hero.subtitle")}
            </p>

            <div className="flex flex-row flex-wrap gap-3 sm:gap-6 justify-start mt-2">
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-md text-white bg-blue-900 text-center whitespace-nowrap leading-snug relative overflow-hidden before:absolute before:top-0 before:left-[-100%] before:h-full before:w-full before:bg-yellow-500 before:transition-all before:duration-500 hover:before:left-0 shadow-md transition-colors duration-300">
                <span className="relative z-10">{t("home.hero.learnMore")}</span>
              </Link>
            </div>
          </motion.div>

        </div>

        {/* <button
          onClick={scrollToNext}
          aria-label={t("home.hero.scrollDown")}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 group"
        >
          <HiOutlineChevronDoubleDown className="text-white text-4xl animate-bounce drop-shadow-lg group-hover:text-accent transition-colors" />
        </button> */}
      </div>

      {/*about us*/}
      <div className="bg-blue-900/80 text-white px-6 sm:px-8 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-6">

          <div className="md:w-1/4 text-left">
            <h2 className="text-xl font-semibold">{t("home.about.title")}</h2>
          </div>

          <div className="md:w-3/4 relative">
          
            <div className="absolute left-0 top-0 h-full w-px bg-white/40 hidden md:block"></div>

            <div className="pl-0 md:pl-10">
              <p className="text-sm md:text-base leading-snug md:leading-relaxed">
                "{t("home.about.mission")}"
              </p>
              <div className="flex flex-row flex-wrap gap-4 sm:gap-6 justify-start mt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-5 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-md text-white bg-yellow-500 text-center whitespace-nowrap leading-snug relative overflow-hidden before:absolute before:top-0 before:left-[-100%] before:h-full before:w-full before:bg-blue-900 before:transition-all before:duration-500 hover:before:left-0 shadow-md transition-colors duration-300">
                  <span className="relative z-10">{t("home.about.learnMore")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest posts hidden as requested */}
      {false && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
                Bài viết mới nhất
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Khám phá các bài phân tích chuyên sâu về ngành và doanh nghiệp từ đội ngũ chuyên gia của chúng tôi
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <PostImage 
                    src={post.thumbnail_url} 
                    alt={post.title}
                  />

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        post.category === 'nganh' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {post.category === 'nganh' ? 'Phân tích ngành' : 'Phân tích doanh nghiệp'}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.content.substring(0, 120)}...
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                        <span>{post.view_count} lượt xem</span>
                      </div>
                    </div>

                  <Link
                    href={post.category === 'nganh' ? '/sector' : '/analysis'}
                    onClick={() => handleViewReport(post)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Đọc thêm
                  </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/sector"
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors mr-4"
              >
                Xem phân tích ngành
              </Link>
              <Link
                href="/analysis"
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Xem phân tích doanh nghiệp
              </Link>
            </div>
          </div>
        </section>
      )}

      <section id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-3 -mt-10">{t("home.features.title")}</h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
              {t("home.features.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 -mt-7">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <motion.div
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`card p-8 text-center transition-all duration-300 cursor-pointer
              ${hoverIndex === index ? "shadow-2xl scale-105 z-10" : "opacity-60"}`}
                >
                  <div className="flex justify-center mb-6 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-4 inline-block">
                    {feature.title === 'Phân tích doanh nghiệp' ? (
                      <>
                        <span className="block">Phân tích</span>
                        <span className="block">doanh nghiệp</span>
                      </>
                    ) : (
                      feature.title
                    )}
                  </h3>
                  <p className="text-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Feedback Section */}
      <FeedbackSection />

      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center -mt-10">
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
            <div className="flex flex-col sm:flex-row gap-6 justify-center -mb-10">
              <Link
                href="/contact#contact-form"
                className="px-6 py-2 text-base font-semibold rounded-md text-white bg-blue-900 relative overflow-hidden before:absolute before:top-0 before:left-[-100%] before:h-full before:w-full before:bg-yellow-500 before:transition-all before:duration-500 hover:before:left-0 shadow-md transition-colors duration-300">
                <span className="relative z-10">{t("home.cta.contact")}</span>
              </Link>
              <Link
                href="/investment"
                className="px-6 py-2 text-base font-semibold rounded-md text-white bg-yellow-500 relative overflow-hidden before:absolute before:top-0 before:left-[-100%] before:h-full before:w-full before:bg-blue-900 before:transition-all before:duration-500 hover:before:left-0 shadow-md transition-colors duration-300">
                <span className="relative z-10">{t("home.cta.solutions")}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
