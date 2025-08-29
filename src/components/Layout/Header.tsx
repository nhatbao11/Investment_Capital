import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Logo01.jpg";

interface HeaderProps {
  className?: string;
}

const SCROLL_DOWN_THRESHOLD = 90;
const SCROLL_UP_THRESHOLD = 30;

const Header: React.FC<HeaderProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showInvestmentDropdown, setShowInvestmentDropdown] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `font-bold transition-all duration-200 ease-in-out border border-gray-200 rounded px-2 py-1 flex items-center ${
      isActive(path)
        ? "bg-blue-900 text-white"
        : "text-blue-900 hover:bg-blue-900 hover:text-white"
    }`;

  useEffect(() => {
    let ticking = false;

    const updateHeaderHeight = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;

        if (!isScrolled && y > SCROLL_DOWN_THRESHOLD) {
          setIsScrolled(true);
          setLangOpen(false);
        } else if (isScrolled && y < SCROLL_UP_THRESHOLD) {
          setIsScrolled(false);
        }

        if (headerRef.current) {
          const height = headerRef.current.getBoundingClientRect().height;
          headerRef.current.setAttribute("data-header-height", `${height}`);
          console.log("Header height updated:", height);
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", updateHeaderHeight, { passive: true });
    window.addEventListener("resize", updateHeaderHeight);
    updateHeaderHeight();

    return () => {
      window.removeEventListener("scroll", updateHeaderHeight);
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, [isScrolled]);

  return (
    <header
      ref={headerRef}
      data-header-height="80"
      className={`
        sticky top-0 z-50 bg-white shadow-md
        flex justify-between items-center
        transition-all duration-300 ease-in-out
        ${isScrolled ? "px-5 py-2" : "px-6 py-3"}
        font-sans ${className || ""}
      `}
    >
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src={Logo}
            alt="Logo"
            className={`transition-all duration-300 ease-in-out ${
              isScrolled ? "h-9" : "h-[50px]"
            }`}
          />
          <div
            className={`transition-all duration-300 ease-in-out ${
              isScrolled ? "mt-1" : "mt-3"
            }`}
          >
            <h1
              className={`font-bold transition-all duration-300 ease-in-out ${
                isScrolled ? "text-lg" : "text-xl"
              } text-blue-900 -mt-1`}
            >
              Y&T Capital
            </h1>
            <p
              className={`text-xs font-bold transition-all duration-300 ease-in-out text-blue-900 ${
                isScrolled
                  ? "opacity-0 -translate-y-1 pointer-events-none select-none h-0 overflow-hidden"
                  : "opacity-100 translate-y-0 h-auto"
              }`}
            >
              Shaping Tomorrow Through Agile Innovation
            </p>
          </div>
        </Link>
      </div>

      <div className="flex flex-col items-end">
        <div
          className={`
            flex items-center space-x-3 text-sm mb-1 overflow-hidden
            transition-[max-height,opacity,transform] duration-300 ease-in-out
            ${isScrolled ? "max-h-0 opacity-0 -translate-y-2 pointer-events-none" : "max-h-12 opacity-100 translate-y-0"}
          `}
        >
          <Link
            to="/login"
            target="_blank"
            className="font-bold text-blue-900 px-2 py-1 rounded transition-all duration-200 ease-in-out hover:bg-blue-900 hover:text-white border border-gray-200"
          >
            Đăng nhập
          </Link>
          <Link
            to="/signup"
            target="_blank"
            className="font-bold text-blue-900 px-2 py-1 rounded transition-all duration-200 ease-in-out hover:bg-blue-900 hover:text-white border border-gray-200"
          >
            Đăng ký
          </Link>

          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="font-bold text-black px-2 py-1 border border-gray-200 rounded transition-all duration-200 ease-in-out hover:bg-blue-900 hover:text-white"
            >
              🌐
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded shadow">
                <button className="w-full px-3 py-1 text-left font-bold text-black hover:bg-blue-900 hover:text-white">
                  🇻🇳 Tiếng Việt
                </button>
                <button className="w-full px-3 py-1 text-left font-bold text-black hover:bg-blue-900 hover:text-white">
                  🇬🇧 English
                </button>
                <button className="w-full px-3 py-1 text-left font-bold text-black hover:bg-blue-900 hover:text-white">
                  🇯🇵 日本語
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className="flex space-x-4 md:space-x-8 text-base transition-all duration-300 ease-in-out items-center">
          <Link to="/about" className={navLinkClass("/about")}>
            Về chúng tôi
          </Link>
          <Link to="/sector" className={navLinkClass("/sector")}>
            Phân tích Ngành
          </Link>
          <Link to="/analysis" className={navLinkClass("/analysis")}>
            Phân tích Doanh nghiệp
          </Link>
          <div className="relative group">
            <Link
              to="/investment"
              className={navLinkClass("/investment")}
              onMouseEnter={() => setShowInvestmentDropdown(true)}
              onMouseLeave={() => setShowInvestmentDropdown(false)}
            >
              Giải pháp đầu tư
            </Link>
            {showInvestmentDropdown && (
              <div
                className="absolute right-4 top-[100%] bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-[900px] pointer-events-auto group-hover:block transition-none"
                onMouseEnter={() => setShowInvestmentDropdown(true)}
                onMouseLeave={() => setShowInvestmentDropdown(false)}
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="font-bold text-black text-base">1. Kiến thức đầu tư</h3>
                    <h4
                      className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                      onClick={() => navigate("/investment#ly-thuyet")}
                    >
                      1.1. Lý thuyết nền tảng
                    </h4>
                    <h4
                      className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                      onClick={() => navigate("/investment#lich-su")}
                    >
                      1.2. Lịch sử thị trường tài chính và các cuộc khủng hoảng
                    </h4>
                    <h4
                      className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                      onClick={() => navigate("/investment#cong-cu")}
                    >
                      1.3. Công cụ và phương pháp phân tích
                    </h4>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="font-bold text-black text-base">2. Phương pháp đầu tư</h3>
                    <h4
                      className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                      onClick={() => navigate("/investment#chien-luoc")}
                    >
                      2.1. Chiến lược đầu tư
                    </h4>
                    <h4
                      className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                      onClick={() => navigate("/investment#danh-muc")}
                    >
                      2.2. Xây dựng danh mục đầu tư
                    </h4>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="font-bold text-black text-base">3. Quản trị rủi ro</h3>
                    <h4
                      className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                      onClick={() => navigate("/investment#risk-overview")}
                    >
                      3.1. Tổng quan về rủi ro
                    </h4>
                    <h4
                      className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                      onClick={() => navigate("/investment#phan-loai")}
                    >
                      3.2. Phân loại rủi ro
                    </h4>
                    <h4
                      className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                      onClick={() => navigate("/investment#phuong-phap")}
                    >
                      3.3. Phương pháp quản trị rủi ro
                    </h4>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link to="/contact" className={navLinkClass("/contact")}>
            Liên hệ
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;