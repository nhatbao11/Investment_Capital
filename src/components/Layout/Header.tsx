import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/Logo01.jpg";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const location = useLocation();
  const [langOpen, setLangOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`bg-white text-blue-900 shadow-md px-6 py-3 flex justify-between items-center ${className}`}>
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src={Logo}
            alt="Logo"
            className="w-12 h-12 object-contain rounded-full"
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Y&T Capital</h1>
            <p className="text-xs md:text-sm text-blue-900">
              Shaping Tomorrow Through Agile Innovation
            </p>
          </div>
        </Link>
      </div>

      <div className="flex flex-col items-end">
        <div className="flex items-center space-x-3 text-sm mb-1">
          <Link
            to="/login"
            className="px-2 py-1 border border-blue-900 text-blue-900 rounded hover:underline"
          >
            Đăng nhập
          </Link>
          <Link
            to="/signup"
            className="px-2 py-1 bg-blue-900 text-white rounded hover:bg-blue-800"
          >
            Đăng ký
          </Link>

          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="px-2 py-1 border border-blue-900 text-blue-900 rounded hover:underline"
            >
              🌐
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded shadow">
                <button className="w-full px-3 py-1 text-left hover:bg-gray-100">
                  🇻🇳 Tiếng Việt
                </button>
                <button className="w-full px-3 py-1 text-left hover:bg-gray-100">
                  🇬🇧 English
                </button>
                <button className="w-full px-3 py-1 text-left hover:bg-gray-100">
                  🇯🇵 日本語
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className="flex space-x-2 md:space-x-4 text-blue-900 font-medium text-sm md:text-base">
          <Link
            to="/about"
            className={`px-3 py-2 rounded-md transition ${isActive("/about")
                ? "bg-blue-100 font-semibold"
                : "hover:bg-blue-200"
              }`}
          >
            Về chúng tôi
          </Link>
          <Link
            to="/stock"
            className={`px-3 py-2 rounded-md transition ${isActive("/stock")
                ? "bg-blue-100 font-semibold"
                : "hover:bg-blue-200"
              }`}
          >
            Bộ lọc cổ phiếu
          </Link>
          <Link
            to="/analysis"
            className={`px-3 py-2 rounded-md transition ${isActive("/analysis")
                ? "bg-blue-100 font-semibold"
                : "hover:bg-blue-200"
              }`}
          >
            Phân tích Doanh nghiệp
          </Link>
          <Link
            to="/investment"
            className={`px-3 py-2 rounded-md transition ${isActive("/investment")
                ? "bg-blue-100 font-semibold"
                : "hover:bg-blue-200"
              }`}
          >
            Hệ thống đầu tư
          </Link>
          <Link
            to="/contact"
            className={`px-3 py-2 rounded-md transition ${isActive("/contact")
                ? "bg-blue-100 font-semibold"
                : "hover:bg-blue-200"
              }`}
          >
            Liên hệ
          </Link>
        </nav>


      </div>
    </header>
  );
};

export default Header;
