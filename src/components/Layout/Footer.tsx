import React from "react";
import { FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa";
import { MdLocationOn, MdEmail, MdAccessTime, MdPhone } from "react-icons/md";
import Logo from "../../assets/images/YT LOGO.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 text-gray-700 px-6 md:px-16 py-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">

        {/* Logo + slogan (bên trái) */}
        <div className="flex flex-col items-center transform -translate-x-4">
          <img
            src={Logo}
            alt="Y&T Capital Logo"
            className="w-40 h-auto mb-2"
          />
          <p className="text-black text-base font-bold text-center">
            Shaping Tomorrow Through Agile Innovation  </p>
        </div>



        {/* 3 cột nội dung (ở giữa) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm flex-1">

          {/* Địa chỉ */}
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Địa chỉ</h4>
            <p className="flex items-start text-gray-700 font-medium">
              <MdLocationOn className="text-blue-900 mr-2 mt-0.5" />
              92, 19E, Phường An Lạc, TP. Hồ Chí Minh
            </p>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Liên hệ</h4>
            <p className="flex items-center text-gray-700 font-medium hover:text-blue-900 transition-colors cursor-pointer">
              <MdEmail className="text-blue-900 mr-2" />
              ytcapital.group@gmail.com
            </p>
            <p className="flex items-center text-gray-700 font-medium mt-1">
              <MdPhone className="text-blue-900 mr-2" />
              0909 123 456
            </p>
            <p className="flex items-center text-gray-700 font-medium mt-1">
              <MdAccessTime className="text-blue-900 mr-2" />
              Thứ 2 - Thứ 6: 08:00 - 17:30
            </p>
          </div>

          {/* Chính sách */}
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Thông tin</h4>
            <ul className="space-y-1 text-gray-700 font-medium">
              <li>
                <a href="/terms" className="hover:text-blue-900 transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-blue-900 transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-blue-900 transition-colors">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-blue-900 transition-colors">
                  Dịch vụ
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mạng xã hội */}
      <div className="flex justify-center space-x-4 mt-8">
        {[
          { icon: <FaLinkedin />, link: "https://www.linkedin.com/" },
          { icon: <FaFacebook />, link: "https://www.facebook.com/" },
          { icon: <FaTiktok />, link: "https://www.tiktok.com/" },
        ].map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-blue-900 hover:text-white text-gray-700 text-lg transition-all duration-300"
          >
            {item.icon}
          </a>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mt-6 pt-4 text-center">
        <p className="text-xs text-gray-600 font-medium">
          © 2025 <span className="text-blue-900 font-bold">Y&T Capital</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
