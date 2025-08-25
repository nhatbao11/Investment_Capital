import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

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
        const headerHeight = 50;
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
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-300">Liên hệ với chúng tôi</h2>
      <p className="mb-6 text-gray-300">Chúng tôi rất vui lòng hỗ trợ bạn, vui lòng liên hệ qua các kênh sau.</p>

      {/* Thông tin liên hệ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg mb-6"
      >
        <h3 className="text-xl font-semibold text-green-300 mb-4">Thông tin Liên hệ</h3>
        <div className="space-y-3 text-gray-200">
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:minhnhat1009@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
              minhnhat1009@gmail.com
            </a>
          </p>
          <p>
            <strong>Điện thoại:</strong>{" "}
            <a href="tel:+84822082407" className="text-blue-400 hover:text-blue-300 transition-colors">
              +84 822 082 407
            </a>
          </p>
          <p><strong>Địa chỉ:</strong> 92, 19E, Phường An Lạc, TP. Hồ Chí Minh</p>
        </div>
      </motion.div>

      {/* Mạng xã hội */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg mb-6"
      >
        <h3 className="text-xl font-semibold text-purple-300 mb-4">Mạng Xã hội</h3>
        <div className="space-y-3 text-gray-200">
          <p>
            <strong>Facebook:</strong>{" "}
            <a
              href="https://facebook.com/Y&TCapital"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              facebook.com/Y&TCapital
            </a>
          </p>
          <p>
            <strong>LinkedIn:</strong>{" "}
            <a
              href="https://linkedin.com/company/Y&TCapital"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              linkedin.com/company/Y&TCapital
            </a>
          </p>
        </div>
      </motion.div>

      {/* Form gửi email */}
      <motion.div
        id="contact-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold text-yellow-300 mb-4">Gửi tin nhắn cho chúng tôi</h3>
        <form ref={formRef} onSubmit={sendEmail} className="space-y-4" noValidate>
          <input
            type="text"
            name="user_name"
            placeholder="Họ và tên"
            autoComplete="name"
            className="w-full p-3 bg-gray-700 rounded-lg text-white border-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="user_email"
            placeholder="Email"
            autoComplete="email"
            className="w-full p-3 bg-gray-700 rounded-lg text-white border-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            name="message"
            placeholder="Tin nhắn"
            rows={4}
            className="w-full p-3 bg-gray-700 rounded-lg text-white border-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={sending}
            className={`w-full p-3 rounded-lg transition duration-300 ${
              sending ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {sending ? "Đang gửi..." : "Gửi"}
          </button>

          {/* Trạng thái gửi */}
          {status === "ok" && (
            <p className="text-green-400 text-sm mt-2" role="status" aria-live="polite">
              ✅ Đã gửi thành công! Chúng tôi sẽ phản hồi sớm.
            </p>
          )}
          {status === "fail" && (
            <p className="text-red-400 text-sm mt-2" role="alert" aria-live="assertive">
              ❌ Gửi thất bại. Vui lòng thử lại sau.
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;