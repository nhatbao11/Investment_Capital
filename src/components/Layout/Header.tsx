"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HiMenu, HiX, HiSparkles } from "react-icons/hi"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "../../contexts/LanguageContext"
import { useAuth } from "../../services/hooks/useAuth"
import { authApi } from "../../services/api/auth"
import { API_CONFIG } from "../../services/api/config"
import { newsletterApi } from "../../services/api/newsletter"

interface HeaderProps {
  className?: string
}

const SCROLL_DOWN_THRESHOLD = 90
const SCROLL_UP_THRESHOLD = 30

const Header: React.FC<HeaderProps> = ({ className }) => {
  const pathname = usePathname()
  // const navigate = useNavigate()
  const { language, setLanguage, t } = useLanguage() // Added language context
  const { user, logout, loading } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileBusy, setProfileBusy] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [newsletterOptIn, setNewsletterOptIn] = useState(false)
  const [newsletterBusy, setNewsletterBusy] = useState(false)
  const [toast, setToast] = useState<{type:'success'|'error', message:string}|null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  // const [showInvestmentDropdown, setShowInvestmentDropdown] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)

  const isActive = (path: string) => {
    if (!pathname) return false
    
    // Handle exact match
    if (pathname === path) return true
    
    // Handle root path
    if (path === '/' && pathname === '/') return true
    
    // Handle sub-paths (e.g., /contact should match /contact)
    if (pathname.startsWith(path) && path !== '/') return true
    
    return false
  }

  const navLinkClass = (path: string) =>
    `font-bold transition-all duration-300 ease-in-out border border-gray-200 rounded-lg px-2 sm:px-3 py-2 flex items-center relative overflow-hidden group text-sm sm:text-base whitespace-nowrap ${
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

        // Only change background style when scrolling, keep header always visible
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

  useEffect(() => {
    if (user) {
      setProfileName(user.full_name)
      setNewsletterOptIn(user.newsletter_opt_in || false)
    }
  }, [user])

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile)
      setAvatarPreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setAvatarPreview('')
    }
  }, [avatarFile])

  const apiOrigin = (() => { try { return new URL(API_CONFIG.BASE_URL).origin } catch { return 'http://localhost:5000/api/v1' } })()
  const avatarUrl = (() => {
    const url = (avatarPreview || (user as any)?.avatar_url || '/images/Logo01.jpg')
    if (!url) return '/images/Logo01.jpg'
    if (url.startsWith('http')) return url
    if (url.startsWith('/uploads/')) return `${apiOrigin}${url}`
    return url
  })()

  const showToast = (type:'success'|'error', message:string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 2500)
  }

  const saveProfileQuick = async () => {
    try {
      setProfileBusy(true)
      let newAvatarUrl: string | undefined
      if (avatarFile) {
        const res = await authApi.uploadAvatar(avatarFile)
        newAvatarUrl = res.avatar_url
      }
      await fetch(`${API_CONFIG.BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''}`
        },
        body: JSON.stringify({ full_name: profileName, ...(newAvatarUrl ? { avatar_url: newAvatarUrl } : {}) })
      })
      showToast('success', 'Cập nhật hồ sơ thành công')
      setAvatarFile(null)
    } catch (e:any) {
      showToast('error', e?.response?.data?.message || 'Cập nhật hồ sơ thất bại')
    } finally {
      setProfileBusy(false)
    }
  }

  const toggleNewsletter = async () => {
    try {
      setNewsletterBusy(true)
      const newValue = !newsletterOptIn
      const response = await newsletterApi.toggleSubscription({ newsletter_opt_in: newValue })
      setNewsletterOptIn(response.data.newsletter_opt_in)
      showToast('success', response.message)
    } catch (e:any) {
      showToast('error', e?.response?.data?.message || 'Cập nhật newsletter thất bại')
    } finally {
      setNewsletterBusy(false)
    }
  }

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
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 ease-in-out
        ${
          isScrolled
            ? "px-3 sm:px-5 py-2 bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100"
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
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <motion.div className="relative" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
              <img
                src="/images/Logo01.jpg"
                alt="Y&T Group Logo"
                width={56}
                height={56}
                className={`transition-all duration-500 ease-in-out rounded-full shadow-lg ${
                  isScrolled ? "h-8 w-8 sm:h-10 sm:w-10" : "h-10 w-10 sm:h-12 sm:w-12"
                } group-hover:shadow-xl`}
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, 48px"
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
                className={`font-bold transition-all duration-500 ease-in-out whitespace-nowrap ${
                  isScrolled ? "text-base sm:text-lg" : "text-lg sm:text-xl"
                } text-blue-900 group-hover:text-yellow-600`}
                whileHover={{ scale: 1.05 }}
              >
                Y&T Group
              </motion.h1>
              {/* Slogan: hiển thị trên desktop, ẩn trên mobile; thu nhỏ khi scroll */}
              <motion.p
                className={`hidden lg:block text-xs font-bold transition-all duration-500 ease-in-out text-blue-900 whitespace-nowrap ${
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
          {toast && (
            <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white z-[10000] ${toast.type==='success' ? 'bg-green-600' : 'bg-red-600'}`}>
              {toast.message}
            </div>
          )}
          {/* Top bar with login/signup/language */}
          <div
            className={`flex items-center space-x-2 xl:space-x-3 text-sm mb-1 transition-all duration-500 ease-in-out ${
              isScrolled ? "opacity-0 pointer-events-none h-0 overflow-hidden" : "opacity-100 h-auto"
            }`}
          >
            {!loading && user ? (
              <div className="flex items-center space-x-3">
                <span className="text-blue-900 text-sm font-medium">
                  {t('greeting.hello')}, {user.full_name}
                </span>
                {user.role === 'admin' && (
                  <a
                    href="/admin"
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Admin Dashboard
                  </a>
                )}
                <div
                  className="relative"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Profile</button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-[9999]"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                          <div className="mt-3">
                            <label className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 text-xs">
                              Chọn ảnh
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                            </label>
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-xs text-gray-600 mb-1">Họ tên</label>
                          <input
                            type="text"
                            className="w-full border rounded px-3 py-2 text-sm"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                          />
                        </div>
                        <div className="mt-3">
                          <label className="flex items-center cursor-pointer" onClick={toggleNewsletter}>
                            <input
                              type="checkbox"
                              checked={newsletterOptIn}
                              onChange={toggleNewsletter}
                              disabled={newsletterBusy}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-xs text-gray-700">Nhận email thông báo tin mới</span>
                          </label>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <a href="/profile" className="text-blue-700 text-xs hover:underline">Đổi mật khẩu / Xóa tài khoản</a>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={async () => { await saveProfileQuick() }}
                              disabled={profileBusy}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                            >
                              {profileBusy ? 'Đang lưu...' : 'Lưu'}
                            </button>
                            <button
                              onClick={async () => { await logout(); showToast('success', 'Đăng xuất thành công'); if (typeof window !== 'undefined') window.location.href = '/login/' }}
                              className="px-3 py-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                            >
                              Đăng xuất
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href="/login"
                  className="text-blue-900 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors border border-blue-200"
                >
                  {t("header.login")}
                </a>
                <a
                  href="/signup"
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {t("header.signup")}
                </a>
              </div>
            )}

            {isScrolled ? null : (
              <div 
                className="relative group"
                onMouseEnter={() => setLangOpen(true)}
                onMouseLeave={() => setLangOpen(false)}
              >
                <button
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
                      className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-2xl z-[99999] overflow-hidden"
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
              <Link href="/about" className={navLinkClass("/about")}>
                {t("header.about")}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/sector" className={navLinkClass("/sector")}>
                {t("header.sector")}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/analysis" className={navLinkClass("/analysis")}>
                {t("header.analysis")}
              </Link>
            </motion.div>
            <motion.div className="relative group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/investment" className={`${navLinkClass("/investment")} flex items-center`}>
                {t("header.investment")}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/contact" className={navLinkClass("/contact")}>
                {t("header.contact")}
              </Link>
            </motion.div>
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-1 sm:space-x-2">
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
            className="lg:hidden mt-3 pb-3 border-t border-gray-200 overflow-hidden"
          >
            <nav className="flex flex-col space-y-1.5 pt-3">
              <Link
                href="/about"
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  isActive("/about") ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("header.about")}
              </Link>
              <Link
                href="/sector"
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  isActive("/sector") ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("header.sector")}
              </Link>
              <Link
                href="/analysis"
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  isActive("/analysis") ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("header.analysis")}
              </Link>
              <Link
                href="/investment"
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  isActive("/investment") ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("header.investment")}
              </Link>
              <Link
                href="/contact"
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  isActive("/contact") ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("header.contact")}
              </Link>
              <div className="pt-2 border-t border-gray-200">
                {!loading && user ? (
                  <div className="px-4 py-2">
                    <div className="text-sm text-gray-600 mb-2">
                      {t('greeting.hello')}, {user.full_name}
                    </div>
                    {user.role === 'admin' && (
                      <a
                        href="/admin"
                        className="block px-4 py-2 rounded-lg text-sm sm:text-base font-medium text-blue-900 hover:bg-blue-50 transition-colors mb-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </a>
                    )}
                    <a
                      href="/profile"
                      className="block px-4 py-2 rounded-lg text-sm sm:text-base font-medium text-blue-900 hover:bg-blue-50 transition-colors mb-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </a>
                    <button
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block px-4 py-2 rounded-lg text-sm sm:text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="block px-4 py-2 rounded-lg text-sm sm:text-base font-medium text-blue-900 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("header.login")}
                    </a>
                    <a
                      href="/signup"
                      className="block px-4 py-2 rounded-lg text-sm sm:text-base font-medium text-blue-900 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("header.signup")}
                    </a>
                  </>
                )}
                <div className="px-4 py-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-blue-900 font-medium">{t("lang.language")}:</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleLanguageChange("vi")}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          language === "vi" ? "bg-blue-900 text-white" : "bg-gray-100 text-blue-900 hover:bg-blue-100"
                        }`}
                      >
                        VN
                      </button>
                      <button
                        onClick={() => handleLanguageChange("en")}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          language === "en" ? "bg-blue-900 text-white" : "bg-gray-100 text-blue-900 hover:bg-blue-100"
                        }`}
                      >
                        EN
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
