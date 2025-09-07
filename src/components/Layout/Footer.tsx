import React from "react";
import { FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa";
import { MdLocationOn, MdEmail, MdAccessTime, MdPhone } from "react-icons/md";
import { motion } from "framer-motion";
import Logo from "../../assets/images/Logo01.jpg";

const Footer: React.FC = () => {

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 text-black border-t border-gray-200 font-sans mt-16 sm:mt-0 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-yellow-500/5"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16">
          {/* Logo + slogan - Centered */}
          <motion.div 
            className="flex flex-col items-center text-center mt-10"
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
                src={Logo}
                alt="Y&T Capital Logo"
                className="w-24 sm:w-28 h-auto rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <span className="text-white text-xs">✨</span>
              </motion.div>
            </motion.div>
            <motion.p 
              className="text-blue-900 text-sm sm:text-base font-bold whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
            >
              Shaping Tomorrow Through Agile Innovation
            </motion.p>
          </motion.div>

          {/* Content columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-xs sm:text-sm flex-1 mt-10">
          {/* Địa chỉ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <h4 className="font-bold text-blue-900 text-base sm:text-lg mb-4 group-hover:text-yellow-600 transition-colors duration-300">Địa chỉ</h4>
            <motion.p 
              className="flex items-start text-gray-700 font-medium hover:text-blue-900 transition-all duration-300 hover:scale-105"
              whileHover={{ x: 5 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <MdLocationOn className="text-blue-900 mr-2 mt-1 text-lg sm:text-xl" />
              </motion.div>
              92, 19E, Phường An Lạc, TP. Hồ Chí Minh
            </motion.p>
          </motion.div>

          {/* Liên hệ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="group"
          >
            <h4 className="font-bold text-blue-900 text-base sm:text-lg mb-4 group-hover:text-yellow-600 transition-colors duration-300">Liên hệ</h4>
            <motion.p 
              className="flex items-center text-gray-700 font-medium hover:text-blue-900 transition-all duration-300 mb-3 hover:scale-105"
              whileHover={{ x: 5 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <MdEmail className="text-blue-900 mr-2 text-lg sm:text-xl" />
              </motion.div>
              ytcapital.group@gmail.com
            </motion.p>
            <motion.p 
              className="flex items-center text-gray-700 font-medium hover:text-blue-900 transition-all duration-300 mb-3 hover:scale-105"
              whileHover={{ x: 5 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <MdPhone className="text-blue-900 mr-2 text-lg sm:text-xl" />
              </motion.div>
              0909 123 456
            </motion.p>
            <motion.p 
              className="flex items-center text-gray-700 font-medium hover:text-blue-900 transition-all duration-300 hover:scale-105"
              whileHover={{ x: 5 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <MdAccessTime className="text-blue-900 mr-2 text-lg sm:text-xl" />
              </motion.div>
              Thứ 2 - Thứ 6: 08:00 - 17:30
            </motion.p>
          </motion.div>

          {/* Chính sách */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="group"
          >
            <h4 className="font-bold text-blue-900 text-base sm:text-lg mb-4 group-hover:text-yellow-600 transition-colors duration-300">Thông tin</h4>
            <ul className="space-y-3 text-gray-700 font-medium">
              {[
                { href: "/terms", text: "Điều khoản sử dụng" },
                { href: "/privacy", text: "Chính sách bảo mật" },
                { href: "/about", text: "Về chúng tôi" },
                { href: "/services", text: "Dịch vụ" }
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
      <div className="relative border-t border-gray-200 mt-6 pt-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Social Media */}
            <motion.div 
              className="flex justify-center space-x-4 sm:space-x-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {[
                { icon: <FaLinkedin className="text-lg sm:text-xl" />, link: "https://www.linkedin.com/", color: "hover:bg-blue-700" },
                { icon: <FaFacebook className="text-lg sm:text-xl" />, link: "https://www.facebook.com/", color: "hover:bg-blue-600" },
                { icon: <FaTiktok className="text-lg sm:text-xl" />, link: "https://www.tiktok.com/", color: "hover:bg-black" },
              ].map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-blue-900 ${item.color} hover:text-white text-gray-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl`}
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
                © 2025 <span className="text-blue-900 font-bold">Y&T Capital</span>. All rights reserved.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;