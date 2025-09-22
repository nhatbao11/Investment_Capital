"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { HiMail, HiPhone, HiLocationMarker, HiClock } from "react-icons/hi"
import { FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa"
import emailjs from "@emailjs/browser"
import { useLanguage } from "../contexts/LanguageContext"
import phantichdoanhnghiep from "../assets/images/lienhe.jpg"
import PageHeader from "../components/ui/PageHeader"

const SERVICE_ID = "service_oqtsjvk"
const TEMPLATE_ID = "template_as1f8ef"
const PUBLIC_KEY = "tmtvG3TszApKascvx"

const Contact: React.FC = () => {
  const { t } = useLanguage()
  const formRef = useRef<HTMLFormElement>(null)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "fail">("idle")
  const location = useLocation()

  useEffect(() => {
    if (location.hash === "#contact-form") {
      const form = document.getElementById("contact-form")
      if (form) {
        const headerHeight = 80
        const sectionPosition = form.getBoundingClientRect().top + window.pageYOffset
        window.scrollTo({
          top: sectionPosition - headerHeight,
          behavior: "smooth",
        })
      }
    }
  }, [location])

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current || sending) return

    setSending(true)
    setStatus("idle")
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      setStatus("ok")
      formRef.current.reset()
    } catch (err) {
      console.error(err)
      setStatus("fail")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen">
         <PageHeader
        title={t("contact.hero.title")}
        subtitle={t("contact.hero.subtitle")}
        backgroundImage={phantichdoanhnghiep}
      />
      {/* <div className="contact-gradient relative overflow-hidden">
        <img
          src="/modern-office-building-with-professional-business-.jpg"
          alt="Contact Y&T Capital"
          className="absolute inset-0 w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight"
            >
              {t("contact.hero.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed"
            >
              {t("contact.hero.subtitle")}
            </motion.p>
          </div>
        </div>
      </div> */}

      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-semibold text-slate-900 mb-8">{t("contact.info.title")}</h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
                      <HiMail className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 mb-1">{t("contact.info.email")}</p>
                      <a
                        href="mailto:ytcapital.group@gmail.com"
                        className="text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        ytcapital.group@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
                      <HiPhone className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 mb-1">{t("contact.info.phone")}</p>
                      <a href="tel:+84822082407" className="text-slate-600 hover:text-slate-900 transition-colors">
                        +84 822 082 407
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
                      <HiLocationMarker className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 mb-1">{t("contact.info.address")}</p>
                      <p className="text-slate-600">92, 19E, Phường An Lạc, TP. Hồ Chí Minh</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
                      <HiClock className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 mb-1">{t("contact.info.hours")}</p>
                      <p className="text-slate-600">{t("contact.info.hours.value")}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="pt-8 border-t border-slate-200"
              >
                <h3 className="text-lg font-medium text-slate-900 mb-4">Kết nối với chúng tôi</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com/Y&TCapital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <FaFacebook className="text-lg" />
                  </a>
                  <a
                    href="https://linkedin.com/company/Y&TCapital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <FaLinkedin className="text-lg" />
                  </a>
                  <a
                    href="https://tiktok.com/@Y&TCapital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <FaTiktok className="text-lg" />
                  </a>
                </div>
              </motion.div>
            </div>

            <motion.div
              id="contact-form"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
                <div className="mb-8">
                  <h2 className="text-3xl font-semibold text-slate-900 mb-4">{t("contact.form.title")}</h2>
                  <p className="text-slate-600 text-lg">
                    Hãy để lại thông tin và chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                  </p>
                </div>

                <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="user_name" className="block text-sm font-medium text-slate-700 mb-2">
                        {t("contact.form.name")}
                      </label>
                      <input
                        type="text"
                        id="user_name"
                        name="user_name"
                        placeholder={t("contact.form.name.placeholder")}
                        autoComplete="name"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="user_email" className="block text-sm font-medium text-slate-700 mb-2">
                        {t("contact.form.email")}
                      </label>
                      <input
                        type="email"
                        id="user_email"
                        name="user_email"
                        placeholder={t("contact.form.email.placeholder")}
                        autoComplete="email"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      {t("contact.form.message")}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder={t("contact.form.message.placeholder")}
                      rows={6}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 resize-none bg-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all duration-200 ${
                      sending
                        ? "bg-slate-400 cursor-not-allowed text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                  >
                    {sending ? "Đang gửi..." : t("contact.form.submit")}
                  </button>

                  {status === "ok" && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Đã gửi thành công! Chúng tôi sẽ phản hồi sớm.
                    </div>
                  )}
                  {status === "fail" && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Gửi thất bại. Vui lòng thử lại sau.
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
