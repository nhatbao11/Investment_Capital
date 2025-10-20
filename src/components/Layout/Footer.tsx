"use client"

import type React from "react"
import { FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa"
import { MdLocationOn, MdEmail, MdAccessTime, MdPhone } from "react-icons/md"
import { motion } from "framer-motion"
// Removed import for Next.js compatibility
import { useLanguage } from "../../contexts/LanguageContext" // Added language context

const Footer: React.FC = () => {
  const { t } = useLanguage() // Added translation function

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 text-black border-t border-gray-200 font-sans mt-0 sm:mt-0 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-yellow-500/5"></div>

      <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12 xl:gap-16">
          {/* Logo + slogan - Centered */}
          <motion.div
            className="flex flex-col items-center text-center w-full lg:w-auto mt-6 sm:mt-8 lg:mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
              className="relative mb-3"
            >
              <img
                src="/images/Logo01.jpg"
                alt="Y&T Group Logo"
                className="w-20 sm:w-24 lg:w-28 h-auto rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
              <motion.div
                className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 rounded-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <span className="text-white text-xs">✨</span>
              </motion.div>
            </motion.div>
            <motion.p
              className="text-blue-900 text-xs sm:text-sm lg:text-base font-bold text-center max-w-xs whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
            >
              {t("header.slogan")}
            </motion.p>
          </motion.div>

          {/* Content columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-xs sm:text-sm flex-1 w-full lg:mt-10">
            {/* Địa chỉ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <h4 className="font-bold text-blue-900 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 group-hover:text-yellow-600 transition-colors duration-300">
                {t("footer.address")}
              </h4>
              <motion.div
                className="flex items-start text-gray-700 font-medium hover:text-blue-900 transition-all duration-300 hover:scale-105"
                whileHover={{ x: 5 }}
              >
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="flex-shrink-0">
                  <MdLocationOn className="text-blue-900 mr-2 mt-1 text-base sm:text-lg lg:text-xl" />
                </motion.div>
                <span className="leading-relaxed">92, 19E, Phường An Lạc, TP. Hồ Chí Minh</span>
              </motion.div>
            </motion.div>

            {/* Liên hệ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <h4 className="font-bold text-blue-900 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 group-hover:text-yellow-600 transition-colors duration-300">
                {t("footer.contact")}
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <motion.div
                  className="flex items-center text-gray-700 font-medium hover:text-blue-900 transition-all duration-300 hover:scale-105"
                  whileHover={{ x: 5 }}
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="flex-shrink-0">
                    <MdEmail className="text-blue-900 mr-2 text-base sm:text-lg lg:text-xl" />
                  </motion.div>
                  <span className="break-all">ytcapital.group@gmail.com</span>
                </motion.div>
                <motion.div
                  className="flex items-center text-gray-700 font-medium hover:text-blue-900 transition-all duration-300 hover:scale-105"
                  whileHover={{ x: 5 }}
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="flex-shrink-0">
                    <MdPhone className="text-blue-900 mr-2 text-base sm:text-lg lg:text-xl" />
                  </motion.div>
                  <span>0822 082 407</span>
                </motion.div>
                <motion.div
                  className="flex items-start text-gray-700 font-medium hover:text-blue-900 transition-all duration-300 hover:scale-105"
                  whileHover={{ x: 5 }}
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="flex-shrink-0">
                    <MdAccessTime className="text-blue-900 mr-2 mt-0.5 text-base sm:text-lg lg:text-xl" />
                  </motion.div>
                  <span className="leading-relaxed">{t("footer.hours")}</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Chính sách */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="group sm:col-span-2 lg:col-span-1"
            >
              <h4 className="font-bold text-blue-900 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 group-hover:text-yellow-600 transition-colors duration-300">
                {t("footer.info")}
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-700 font-medium">
                {[
                  { href: "/terms.pdf", text: t("footer.terms"), isPdf: true },
                  { href: "/privacy.pdf", text: t("footer.privacy"), isPdf: true },
                  { href: "/about", text: t("footer.about") },
                ].map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    className="transition-all duration-300"
                  >
                    <a
                      href={item.href}
                      className="hover:text-blue-900 hover:underline transition-all duration-300 block py-1"
                      target={item.isPdf ? "_blank" : undefined}
                      rel={item.isPdf ? "noopener noreferrer" : undefined}
                    >
                      {item.text}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="relative border-t border-gray-200 mt-6 sm:mt-8 pt-4 sm:pt-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            {/* Social Media */}
            <motion.div
              className="flex justify-center space-x-3 sm:space-x-4 lg:space-x-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {[
                {
                  icon: <FaLinkedin className="text-base sm:text-lg lg:text-xl" />,
                  link: "https://www.linkedin.com/",
                  color: "hover:bg-blue-700",
                },
                {
                  icon: <FaFacebook className="text-base sm:text-lg lg:text-xl" />,
                  link: "https://www.facebook.com/",
                  color: "hover:bg-blue-600",
                },
                {
                  icon: <FaTiktok className="text-base sm:text-lg lg:text-xl" />,
                  link: "https://www.tiktok.com/",
                  color: "hover:bg-black",
                },
              ].map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-blue-900 ${item.color} hover:text-white text-gray-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  {item.icon}
                </motion.a>
              ))}
            </motion.div>

            {/* Copyright */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                © 2025 <span className="text-blue-900 font-bold">Y&T Group</span>. {t("footer.rights")}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
