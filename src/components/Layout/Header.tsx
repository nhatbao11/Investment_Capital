import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenu, HiX, HiChevronDown, HiSparkles } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `font-bold transition-all duration-300 ease-in-out border border-gray-200 rounded-lg px-3 py-2 flex items-center relative overflow-hidden group ${
      isActive(path)
        ? "bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg"
        : "text-blue-900 hover:bg-gradient-to-r hover:from-blue-900 hover:to-blue-800 hover:text-white hover:shadow-lg"
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

  const goToInvestment = (hash: string) => {
    setShowInvestmentDropdown(false);
    navigate(`/investment#${encodeURIComponent(hash)}`);
  };

  return (
    <motion.header
      ref={headerRef}
      data-header-height="80"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`
        sticky top-0 z-50
        transition-all duration-500 ease-in-out
        ${isScrolled 
          ? "px-5 py-2 bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100" 
          : "px-6 py-3 bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-sm shadow-md"
        }
        font-sans ${className || ""}
      `}
    >
      <div className="flex justify-between items-center">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                className="relative"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={Logo}
                  alt="Logo"
                  className={`transition-all duration-500 ease-in-out rounded-full shadow-lg ${
                    isScrolled ? "h-8 w-8" : "h-12 w-12"
                  } group-hover:shadow-xl`}
                />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <HiSparkles className="text-yellow-500 text-xs" />
                </motion.div>
              </motion.div>
              <div
                className={`transition-all duration-500 ease-in-out ${
                  isScrolled ? "mt-0" : "mt-1"
                }`}
              >
                <motion.h1
                  className={`font-bold transition-all duration-500 ease-in-out ${
                    isScrolled ? "text-lg" : "text-xl"
                  } text-blue-900 group-hover:text-yellow-600`}
                  whileHover={{ scale: 1.05 }}
                >
                  Y&T Capital
                </motion.h1>
                <motion.p
                  className={`text-xs font-bold transition-all duration-500 ease-in-out text-blue-900 ${
                    isScrolled
                      ? "opacity-0 -translate-y-1 pointer-events-none select-none h-0 overflow-hidden"
                      : "opacity-100 translate-y-0 h-auto"
                  }`}
                >
                  Shaping Tomorrow Through Agile Innovation
                </motion.p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-col items-end">
            {/* Top bar with login/signup/language */}
            <div
              className={`
                flex items-center space-x-3 text-sm mb-1 overflow-hidden
                transition-[max-height,opacity,transform] duration-300 ease-in-out
                ${isScrolled ? "max-h-0 opacity-0 -translate-y-2 pointer-events-none" : "max-h-12 opacity-100 translate-y-0"}
              `}
            >
              <a
                href="/login"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-900 px-2 py-1 rounded transition-all duration-200 ease-in-out hover:bg-blue-900 hover:text-white border border-gray-200"
              >
                Đăng nhập
              </a>
              <a
                href="/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-900 px-2 py-1 rounded transition-all duration-200 ease-in-out hover:bg-blue-900 hover:text-white border border-gray-200"
              >
                Đăng ký
              </a>

              <div className="relative">
                <button
                  onClick={() => setLangOpen((v) => !v)}
                  className="font-bold text-black px-2 py-1 border border-gray-200 rounded transition-all duration-200 ease-in-out hover:bg-blue-900 hover:text-white"
                >
                  🌐
                </button>
                {langOpen && (
                  <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded shadow-lg z-50">
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

            {/* Main Navigation */}
            <nav className="flex space-x-2 xl:space-x-4 text-base transition-all duration-300 ease-in-out items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/about" className={navLinkClass("/about")}>
                  Về chúng tôi
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/sector" className={navLinkClass("/sector")}>
                  Phân tích Ngành
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/analysis" className={navLinkClass("/analysis")}>
                  Phân tích Doanh nghiệp
                </Link>
              </motion.div>
              <motion.div className="relative group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/investment"
                  className={`${navLinkClass("/investment")} flex items-center`}
                  onMouseEnter={() => setShowInvestmentDropdown(true)}
                  onMouseLeave={() => setShowInvestmentDropdown(false)}
                >
                  Giải pháp đầu tư
                  <HiChevronDown className="ml-1 text-xs transition-transform duration-200 group-hover:rotate-180" />
                </Link>
                <AnimatePresence>
                  {showInvestmentDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-4 top-[100%] bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl p-6 z-50 w-[900px] pointer-events-auto"
                      onMouseEnter={() => setShowInvestmentDropdown(true)}
                      onMouseLeave={() => setShowInvestmentDropdown(false)}
                    >
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1 min-w-0">
                        <h3 className="font-bold text-black text-base">1. Kiến thức đầu tư</h3>
                        <h4
                          className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                          onClick={() => goToInvestment("Kiến thức đầu tư")}
                        >
                          1.1. Lý thuyết nền tảng
                        </h4>
                        <h4
                          className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                          onClick={() => goToInvestment("Lịch sử thị trường tài chính và các cuộc khủng hoảng")}
                        >
                          1.2. Lịch sử thị trường tài chính và các cuộc khủng hoảng
                        </h4>
                        <h4
                          className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                          onClick={() => goToInvestment("Công cụ và phương pháp phân tích")}
                        >
                          1.3. Công cụ và phương pháp phân tích
                        </h4>
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <h3 className="font-bold text-black text-base">2. Phương pháp đầu tư</h3>
                        <h4
                          className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                          onClick={() => goToInvestment("Phương pháp đầu tư")}
                        >
                          2.1. Chiến lược đầu tư
                        </h4>
                        <h4
                          className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                          onClick={() => goToInvestment("Xây dựng danh mục đầu tư")}
                        >
                          2.2. Xây dựng danh mục đầu tư
                        </h4>
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <h3 className="font-bold text-black text-base">3. Quản trị rủi ro</h3>
                        <h4
                          className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                          onClick={() => goToInvestment("Quản trị rủi ro trong đầu tư")}
                        >
                          3.1. Tổng quan về rủi ro
                        </h4>
                        <h4
                          className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                          onClick={() => goToInvestment("Quản trị rủi ro trong đầu tư")}
                        >
                          3.2. Phân loại rủi ro
                        </h4>
                        <h4
                          className="font-bold text-blue-900 text-sm cursor-pointer hover:bg-blue-900 hover:text-white rounded px-2 py-1"
                          onClick={() => goToInvestment("Quản trị rủi ro trong đầu tư")}
                        >
                          3.3. Phương pháp quản trị rủi ro
                        </h4>
                      </div>
                    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/contact" className={navLinkClass("/contact")}>
                  Liên hệ
                </Link>
              </motion.div>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <a
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-900 px-2 py-1 text-sm font-medium"
            >
              Đăng nhập
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 pb-4 border-t border-gray-200 overflow-hidden"
            >
              <nav className="flex flex-col space-y-2 pt-4">
              <Link
                to="/about"
                className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive("/about")
                    ? "bg-blue-900 text-white"
                    : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Về chúng tôi
              </Link>
              <Link
                to="/sector"
                className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive("/sector")
                    ? "bg-blue-900 text-white"
                    : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Phân tích Ngành
              </Link>
              <Link
                to="/analysis"
                className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive("/analysis")
                    ? "bg-blue-900 text-white"
                    : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Phân tích Doanh nghiệp
              </Link>
              <Link
                to="/investment"
                className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive("/investment")
                    ? "bg-blue-900 text-white"
                    : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Giải pháp đầu tư
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive("/contact")
                    ? "bg-blue-900 text-white"
                    : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Liên hệ
              </Link>
              <div className="pt-2 border-t border-gray-200">
                <a
                  href="/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 rounded-lg text-base font-medium text-blue-900 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Đăng ký
                </a>
              </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
    </motion.header>
  );
};

export default Header;