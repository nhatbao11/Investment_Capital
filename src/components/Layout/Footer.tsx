import React from "react";
import { FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa";
import { MdLocationOn, MdEmail } from "react-icons/md";
import Logo from "../../assets/images/Logo01.jpg"; 

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-900 px-6 md:px-16 py-10 border-t border-gray-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        
        <div className="flex flex-col space-y-4">
          <img src={Logo} alt="Y&T Capital Logo" className="w-32 h-auto" />
        </div>

        <div>
          <h4 className="font-bold uppercase mb-2 border-b-2 border-blue-800 w-fit">
            Địa chỉ
          </h4>
          <p className="flex items-center text-sm">
            <MdLocationOn className="text-blue-800 mr-2" />
92, 19E, Phường An Lạc, TP. Hồ Chí Minh          </p>
        </div>

        <div>
          <h4 className="font-bold uppercase mb-2 border-b-2 border-blue-800 w-fit">
            Liên hệ
          </h4>
          <p className="flex items-center text-sm">
            <MdEmail className="text-blue-800 mr-2" />
minhnhat1009@gmail.com          </p>
        </div>

        <div className="flex flex-col items-start md:items-end space-y-2">
          <p className="font-semibold">Theo dõi chúng tôi</p>
          <div className="flex space-x-4 text-2xl">
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:text-blue-900"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:text-blue-900"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:text-blue-900"
            >
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-600 mt-8">
        Bản quyền © 2025 Y&T Capital. Đã đăng ký bản quyền.
      </div>
    </footer>
  );
};

export default Footer;