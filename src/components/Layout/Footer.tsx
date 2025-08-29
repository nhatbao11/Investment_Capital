import React from "react";
import { FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa";
import { MdLocationOn, MdEmail, MdAccessTime, MdPhone } from "react-icons/md";
import Logo from "../../assets/images/Logo01.jpg";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-black px-4 sm:px-6 md:px-16 py-10 border-t border-gray-200 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12">
        {/* Logo + slogan (bên trái) */}
        <div className="flex flex-col items-center text-center">
          <img
            src={Logo}
            alt="Y&T Capital Logo"
            className="w-35 h-auto mb-3"
          />
          <p className="text-blue-900 text-base font-bold">
            Shaping Tomorrow Through Agile Innovation
          </p>
        </div>


        {/* 3 cột nội dung (ở giữa) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-xs sm:text-sm flex-1">
          {/* Địa chỉ */}
          <div>
            <h4 className="font-bold text-blue-900 text-base sm:text-lg mb-3">Địa chỉ</h4>
            <p className="flex items-start text-gray-700 font-medium hover:text-blue-900 transition-colors">
              <MdLocationOn className="text-blue-900 mr-2 mt-1 text-lg sm:text-xl" />
              92, 19E, Phường An Lạc, TP. Hồ Chí Minh
            </p>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="font-bold text-blue-900 text-base sm:text-lg mb-3">Liên hệ</h4>
            <p className="flex items-center text-gray-700 font-medium hover:text-blue-900 transition-colors mb-2">
              <MdEmail className="text-blue-900 mr-2 text-lg sm:text-xl" />
              ytcapital.group@gmail.com
            </p>
            <p className="flex items-center text-gray-700 font-medium hover:text-blue-900 transition-colors mb-2">
              <MdPhone className="text-blue-900 mr-2 text-lg sm:text-xl" />
              0909 123 456
            </p>
            <p className="flex items-center text-gray-700 font-medium hover:text-blue-900 transition-colors">
              <MdAccessTime className="text-blue-900 mr-2 text-lg sm:text-xl" />
              Thứ 2 - Thứ 6: 08:00 - 17:30
            </p>
          </div>

          {/* Chính sách */}
          <div>
            <h4 className="font-bold text-blue-900 text-base sm:text-lg mb-3">Thông tin</h4>
            <ul className="space-y-2 text-gray-700 font-medium">
              <li>
                <a href="/terms" className="hover:text-blue-900 hover:underline transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-blue-900 hover:underline transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-blue-900 hover:underline transition-colors">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-blue-900 hover:underline transition-colors">
                  Dịch vụ
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mạng xã hội */}
      <div className="flex justify-center space-x-6 mt-8 md:mt-10">
        {[
          { icon: <FaLinkedin className="text-lg sm:text-xl" />, link: "https://www.linkedin.com/" },
          { icon: <FaFacebook className="text-lg sm:text-xl" />, link: "https://www.facebook.com/" },
          { icon: <FaTiktok className="text-lg sm:text-xl" />, link: "https://www.tiktok.com/" },
        ].map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-blue-900 hover:text-white text-gray-700 transition-all duration-300 ease-in-out"
          >
            {item.icon}
          </a>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 mt-6 md:mt-8 pt-6 text-center">
        <p className="text-xs sm:text-sm text-gray-600 font-medium">
          © 2025 <span className="text-blue-900 font-bold">Y&T Capital</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;