"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { HiMenu, HiX, HiSparkles } from "react-icons/hi"
import { motion, AnimatePresence } from "framer-motion"
import Logo from "../../assets/images/Logo01.jpg"
import { useLanguage } from "../../contexts/LanguageContext"

interface HeaderProps {
  className?: string
}

const SCROLL_DOWN_THRESHOLD = 90
const SCROLL_UP_THRESHOLD = 30

const Header: React.FC<HeaderProps> = ({ className }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { language, setLanguage, t } = useLanguage() // Added language context
  const [langOpen, setLangOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  // const [showInvestmentDropdown, setShowInvestmentDropdown] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)

  const isActive = (path: string) => location.pathname === path

  const navLinkClass = (path: string) =>
    `font-bold transition-all duration-300 ease-in-out border border-gray-200 rounded-lg px-2 sm:px-3 py-2 flex items-center relative overflow-hidden group text-sm sm:text-base ${
      isActive(path)
        ? "bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg"
        : "text-blue-900 hover:bg-gradient-to-r hover:from-blue-900 hover:to-blue-800 hover:text-white hover:shadow-lg"
    }`

  const handleLanguageChange = (newLang: "vi" | "en") => {
    setLanguage(newLang)
    setLangOpen(false)
  }

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case "vi":
        return "VN" // Changed from flag to text
      case "en":
        return "EN" // Changed from 🇬🇧 to EN
      default:
        return "🌐"
    }
  }

  useEffect(() => {
    let ticking = false

    const updateHeaderHeight = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY

        if (!isScrolled && y > SCROLL_DOWN_THRESHOLD) {
          setIsScrolled(true)
          setLangOpen(false)
        } else if (isScrolled && y < SCROLL_UP_THRESHOLD) {
          setIsScrolled(false)
        }

        if (headerRef.current) {
          const height = headerRef.current.getBoundingClientRect().height
          headerRef.current.setAttribute("data-header-height", `${height}`)
        }

        ticking = false
      })
    }

    window.addEventListener("scroll", updateHeaderHeight, { passive: true })
    window.addEventListener("resize", updateHeaderHeight)
    updateHeaderHeight()

    return () => {
      window.removeEventListener("scroll", updateHeaderHeight)
      window.removeEventListener("resize", updateHeaderHeight)
    }
  }, [isScrolled])

  // const goToInvestment = (hash: string) => {
  //   setShowInvestmentDropdown(false)
  //   navigate(`/investment#${encodeURIComponent(hash)}`)
  // }

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
        ${
          isScrolled
            ? "px-3 sm:px-5 py-2 bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100"
            : "px-4 sm:px-6 py-3 bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-sm shadow-md"
        }
        font-sans ${className || ""}
      `}
    >
      <div className="flex justify-between items-center">
        {/* Logo Section */}
        <motion.div
          className="flex items-center space-x-2 sm:space-x-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <motion.div className="relative" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
              <img
                src={Logo || "/placeholder.svg"}
                alt="Logo"
                className={`transition-all duration-500 ease-in-out rounded-full shadow-lg ${
                  isScrolled ? "h-6 w-6 sm:h-8 sm:w-8" : "h-8 w-8 sm:h-12 sm:w-12"
                } group-hover:shadow-xl`}
              />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <HiSparkles className="text-yellow-500 text-xs" />
              </motion.div>
            </motion.div>
            <div className={`transition-all duration-500 ease-in-out ${isScrolled ? "mt-0" : "mt-1"}`}>
              <motion.h1
                className={`font-bold transition-all duration-500 ease-in-out ${
                  isScrolled ? "text-sm sm:text-lg" : "text-base sm:text-xl"
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
                {t("header.slogan")}
              </motion.p>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-col items-end">
          {/* Top bar with login/signup/language */}
          <div
            className={`flex items-center space-x-2 xl:space-x-3 text-sm mb-1 transition-all duration-500 ease-in-out ${
              isScrolled ? "opacity-0 pointer-events-none h-0 overflow-hidden" : "opacity-100 h-auto"
            }`}
          >
            <a
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-900 px-2 py-1 rounded transition-all duration-200 ease-in-out hover:bg-blue-900 hover:text-white border border-gray-200 text-xs xl:text-sm"
            >
              {t("header.login")}
            </a>
            <a
              href="/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-900 px-2 py-1 rounded transition-all duration-200 ease-in-out hover:bg-blue-900 hover:text-white border border-gray-200 text-xs xl:text-sm"
            >
              {t("header.signup")}
            </a>

            {isScrolled ? null : (
              <div className="relative">
                <button
                  onClick={() => setLangOpen((v) => !v)}
                  className="font-bold text-black px-2 py-1 border border-gray-200 rounded transition-all duration-200 ease-in-out hover:bg-blue-900 hover:text-white flex items-center space-x-1 text-xs xl:text-sm"
                >
                  <span>{getLanguageFlag(language)}</span>
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-2xl z-[99999] overflow-hidden"
                    >
                      <button
                        onClick={() => handleLanguageChange("vi")}
                        className={`w-full px-3 py-2 text-left font-bold text-xs xl:text-sm transition-colors duration-200 flex items-center space-x-2 ${
                          language === "vi" ? "bg-blue-900 text-white" : "text-black hover:bg-blue-900 hover:text-white"
                        }`}
                      >
                        <span>VN</span>
                        <span>{t("lang.vietnamese")}</span>
                      </button>
                      <button
                        onClick={() => handleLanguageChange("en")}
                        className={`w-full px-3 py-2 text-left font-bold text-xs xl:text-sm transition-colors duration-200 flex items-center space-x-2 ${
                          language === "en" ? "bg-blue-900 text-white" : "text-black hover:bg-blue-900 hover:text-white"
                        }`}
                      >
                        <span>EN</span>
                        <span>{t("lang.english")}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Main Navigation */}
          <nav className="flex space-x-1 xl:space-x-2 text-sm xl:text-base transition-all duration-300 ease-in-out items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/about" className={navLinkClass("/about")}>
                {t("header.about")}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/sector" className={navLinkClass("/sector")}>
                {t("header.sector")}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/analysis" className={navLinkClass("/analysis")}>
                {t("header.analysis")}
              </Link>
            </motion.div>
            <motion.div className="relative group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/investment" className={`${navLinkClass("/investment")} flex items-center`}>
                {t("header.investment")}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/contact" className={navLinkClass("/contact")}>
                {t("header.contact")}
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
            className="text-blue-900 px-2 py-1 text-xs sm:text-sm font-medium"
          >
            {t("header.login")}
          </a>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <HiX size={20} /> : <HiMenu size={20} />}
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
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  isActive("/about") ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("header.about")}
              </Link>
              <Link
                to="/sector"
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  isActive("/sector") ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("header.sector")}
              </Link>
              <Link
                to="/analysis"
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  isActive("/analysis") ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("header.analysis")}
              </Link>
              <Link
                to="/investment"
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  isActive("/investment") ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("header.investment")}
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  isActive("/contact") ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("header.contact")}
              </Link>
              <div className="pt-2 border-t border-gray-200">
                <a
                  href="/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 rounded-lg text-sm sm:text-base font-medium text-blue-900 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("header.signup")}
                </a>
                <div className="px-4 py-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-blue-900 font-medium">Language:</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleLanguageChange("vi")}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          language === "vi" ? "bg-blue-900 text-white" : "bg-gray-100 text-blue-900 hover:bg-blue-100"
                        }`}
                      >
                        VN {/* Changed from flag to text */}
                      </button>
                      <button
                        onClick={() => handleLanguageChange("en")}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          language === "en" ? "bg-blue-900 text-white" : "bg-gray-100 text-blue-900 hover:bg-blue-100"
                        }`}
                      >
                        EN {/* Changed from 🇬🇧 to EN */}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
