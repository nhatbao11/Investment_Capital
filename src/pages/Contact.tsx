"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
// Removed useLocation for Next.js compatibility
import { motion } from "framer-motion"
import { HiMail, HiPhone, HiLocationMarker, HiClock } from "react-icons/hi"
import { FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa"
import emailjs from "@emailjs/browser"
import { useLanguage } from "../contexts/LanguageContext"
import Image from "next/image"
import PageHeader from "../components/ui/PageHeader"

const SERVICE_ID = "service_oqtsjvk"
const TEMPLATE_ID = "template_as1f8ef"
const PUBLIC_KEY = "tmtvG3TszApKascvx"

const Contact: React.FC = () => {
  const { t } = useLanguage()
  const formRef = useRef<HTMLFormElement>(null)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "fail">("idle")
  // Removed useLocation for Next.js compatibility

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === "#contact-form") {
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
  }, [])

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
    <div className="bg-white min-h-screen">
         <PageHeader
        title={t("contact.hero.title")}
        subtitle={t("contact.hero.subtitle")}
        backgroundImage="/images/lienhe.jpg"
        height="h-48"
      />
      {/* <div className="contact-gradient relative overflow-hidden">
        <img
          src="/modern-office-building-with-professional-business-.jpg"
          alt="Contact Y&T Group"
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

      <div className="pt-6 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-1 space-y-6 sm:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4 sm:mb-8">{t("contact.info.title")}</h2>

                {/* Mobile card wrapper for better readability */}
                {/* Mobile styled panel for readability; desktop keeps original theme */}
                <div className="rounded-xl p-4 sm:p-5 bg-slate-700 text-white shadow lg:bg-transparent lg:text-inherit lg:shadow-none lg:p-0">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center lg:bg-slate-900">
                        <HiMail className="text-white text-base sm:text-lg" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1 lg:text-slate-900">{t("contact.info.email")}</p>
                        <a
                          href="mailto:ytcapital.group@gmail.com"
                          className="opacity-90 hover:opacity-100 transition-colors break-all lg:text-slate-600 lg:hover:text-slate-900"
                        >
                          ytcapital.group@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center lg:bg-slate-900">
                        <HiPhone className="text-white text-base sm:text-lg" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1 lg:text-slate-900">{t("contact.info.phone")}</p>
                        <a href="tel:+84822082407" className="opacity-90 hover:opacity-100 transition-colors lg:text-slate-600 lg:hover:text-slate-900">
                          +84 822 082 407
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center lg:bg-slate-900">
                        <HiLocationMarker className="text-white text-base sm:text-lg" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1 lg:text-slate-900">{t("contact.info.address")}</p>
                        <p className="opacity-90 lg:text-slate-600">92, 19E, Phường An Lạc, TP. Hồ Chí Minh</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center lg:bg-slate-900">
                        <HiClock className="text-white text-base sm:text-lg" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1 lg:text-slate-900">{t("contact.info.hours")}</p>
                        <p className="opacity-90 lg:text-slate-600">{t("contact.info.hours.value")}</p>
                      </div>
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
                    href="https://facebook.com/Y&TGroup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <FaFacebook className="text-lg" />
                  </a>
                  <a
                    href="https://linkedin.com/company/Y&TGroup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <FaLinkedin className="text-lg" />
                  </a>
                  <a
                    href="https://tiktok.com/@Y&TGroup"
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
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-4">{t("contact.form.title")}</h2>
                  <p className="text-slate-600 text-base sm:text-lg">
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
                    className={`w-full py-3 px-4 sm:py-4 sm:px-6 rounded-lg font-medium text-base sm:text-lg transition-all duration-200 ${
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

            {/* Map panel - mobile full width with rounded corners */}
            <div className="lg:col-span-3 mt-4">
              <div className="overflow-hidden rounded-xl shadow border border-slate-200">
                <iframe
                  title="Y&T Group Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0412949539887!2d106.61360347508808!3d10.731298489414739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752dc323e3a63b%3A0xa1469f5f02cd4ab5!2zMTkgOTIsIEFuIEzhuqFjLCBCw6xuaCBUw6JuLCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1759044258599!5m2!1svi!2s"
                  className="w-full h-72 sm:h-80 md:h-96 block"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
