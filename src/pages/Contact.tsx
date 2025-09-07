import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { HiMail, HiPhone, HiLocationMarker, HiClock } from "react-icons/hi";
import { FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import PageHeader from "../components/ui/PageHeader";
import lienhe from '../assets/images/lienhe.jpg';

const SERVICE_ID = "service_oqtsjvk";
const TEMPLATE_ID = "template_as1f8ef";
const PUBLIC_KEY = "tmtvG3TszApKascvx";

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "fail">("idle");
  const location = useLocation();

  // Cuộn mượt đến form khi load trang với hash #contact-form
  useEffect(() => {
    if (location.hash === "#contact-form") {
      const form = document.getElementById("contact-form");
      if (form) {
        const headerHeight = 80;
        const sectionPosition = form.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: sectionPosition - headerHeight,
          behavior: "smooth",
        });
      }
    }
  }, [location]);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current || sending) return;

    setSending(true);
    setStatus("idle");
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setStatus("ok");
      formRef.current.reset();
    } catch (err) {
      console.error(err);
      setStatus("fail");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Liên hệ với chúng tôi"
        subtitle="Chúng tôi rất vui lòng hỗ trợ bạn, vui lòng liên hệ qua các kênh sau"
        backgroundImage={lienhe}
      />

      {/* Contact Information & Form */}
      <div className="py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Contact Details */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-xl border border-blue-200">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-900 p-3 rounded-lg mr-4">
                    <HiMail className="text-white text-2xl" />
                  </div>
                  <h3 className="text-3xl font-bold text-blue-900">Thông tin liên hệ</h3>
                </div>
                <div className="space-y-8">
                  <motion.div 
                    className="flex items-center space-x-6 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="bg-blue-900 p-4 rounded-xl">
                      <HiMail className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">Email</p>
                      <a 
                        href="mailto:minhnhat1009@gmail.com" 
                        className="text-blue-600 hover:text-blue-800 transition-colors text-lg"
                      >
                        ytcapital.group@gmail.com
                      </a>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-6 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="bg-yellow-500 p-4 rounded-xl">
                      <HiPhone className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">Điện thoại</p>
                      <a 
                        href="tel:+84822082407" 
                        className="text-blue-600 hover:text-blue-800 transition-colors text-lg"
                      >
                        +84 822 082 407
                      </a>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-6 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="bg-blue-900 p-4 rounded-xl">
                      <HiLocationMarker className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">Địa chỉ</p>
                      <p className="text-gray-600 text-lg">92, 19E, Phường An Lạc, TP. Hồ Chí Minh</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-6 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="bg-yellow-500 p-4 rounded-xl">
                      <HiClock className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">Giờ làm việc</p>
                      <p className="text-gray-600 text-lg">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl shadow-xl border border-yellow-200">
                <div className="flex items-center mb-6">
                  <div className="bg-yellow-500 p-3 rounded-lg mr-4">
                    <FaFacebook className="text-white text-2xl" />
                  </div>
                  <h3 className="text-3xl font-bold text-blue-900">Mạng xã hội</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <motion.a
                    href="https://facebook.com/Y&TCapital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl transition duration-300 text-center group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaFacebook className="text-3xl mx-auto mb-2" />
                    <p className="text-sm font-semibold">Facebook</p>
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com/company/Y&TCapital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-700 hover:bg-blue-800 text-white p-6 rounded-xl transition duration-300 text-center group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaLinkedin className="text-3xl mx-auto mb-2" />
                    <p className="text-sm font-semibold">LinkedIn</p>
                  </motion.a>
                  <motion.a
                    href="https://tiktok.com/@Y&TCapital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black hover:bg-gray-800 text-white p-6 rounded-xl transition duration-300 text-center group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTiktok className="text-3xl mx-auto mb-2" />
                    <p className="text-sm font-semibold">TikTok</p>
                  </motion.a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              id="contact-form"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-bold text-blue-900 mb-6">Gửi tin nhắn cho chúng tôi</h3>
              <form ref={formRef} onSubmit={sendEmail} className="space-y-6" noValidate>
                <div>
                  <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    placeholder="Nhập họ và tên của bạn"
                    autoComplete="name"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    placeholder="Nhập địa chỉ email của bạn"
                    autoComplete="email"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Tin nhắn
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Nhập tin nhắn của bạn"
                    rows={5}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 resize-none"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={sending}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition duration-300 ${
                    sending 
                      ? "bg-gray-400 cursor-not-allowed text-white" 
                      : "bg-blue-900 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {sending ? "Đang gửi..." : "Gửi tin nhắn"}
                </button>

                {/* Status Messages */}
                {status === "ok" && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg" role="status">
                    ✅ Đã gửi thành công! Chúng tôi sẽ phản hồi sớm.
                  </div>
                )}
                {status === "fail" && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                    ❌ Gửi thất bại. Vui lòng thử lại sau.
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;