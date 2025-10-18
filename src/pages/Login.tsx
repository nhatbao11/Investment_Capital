"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "../contexts/LanguageContext"
import { useAuth } from "../services/hooks/useAuth"

const Login: React.FC = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const { login, loading, error, user } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState("")
  const [newsletterOptIn, setNewsletterOptIn] = useState(false)
  
  const gsiInited = useRef(false)

  // Handle redirect after successful login
  useEffect(() => {
    if (user && !loading) {
      if (user.role === 'admin') {
        // Use window.location for static export mode
        window.location.href = "/admin/"
      } else {
        // Use window.location for static export mode
        window.location.href = "/"
      }
    }
  }, [user, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    
    if (!email || !password) {
      setFormError("Vui lòng điền đầy đủ email và mật khẩu")
      return
    }
    
    try {
      await login({ email, password, newsletter_opt_in: newsletterOptIn })
      if (error) {
        setFormError(error)
      }
      // Redirect will be handled by useEffect when user state updates
    } catch (err: any) {
      
      // Xử lý lỗi validation
      if (err.response?.data?.code === 'VALIDATION_ERROR') {
        const validationErrors = err.response.data.errors
        if (validationErrors && validationErrors.length > 0) {
          setFormError(validationErrors[0].message)
          return
        }
      }
      
      // Xử lý lỗi đăng nhập
      if (err.response?.data?.code === 'INVALID_CREDENTIALS') {
        setFormError("Email hoặc mật khẩu không đúng")
        return
      }
      
      if (err.response?.data?.code === 'ACCOUNT_DEACTIVATED') {
        setFormError("Tài khoản đã bị vô hiệu hóa")
        return
      }
      
      // Xử lý lỗi mạng
      if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
        setFormError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.")
        return
      }
      
      // Lỗi khác
      if (err.response?.data?.message) {
        setFormError(err.response.data.message)
      } else {
        setFormError("Đăng nhập thất bại. Vui lòng thử lại.")
      }
    }
  }

  // Google login removed per requirement

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center" style={{ backgroundImage: "url('/images/vechungtoi.jpg')" }}>
      <div className="absolute inset-0 bg-black/55" />

      {/* Top bar: logo + brand left, contact right */}
      <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/images/Logo01.jpg" alt="Y&T Group Logo" className="h-8 w-8 rounded-full" />
            <span className="text-white font-bold text-base sm:text-lg">Y&T Group</span>
          </Link>
          <Link href="/contact" className="text-white/90 hover:text-white font-semibold">
            {t("header.contact")}
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Đăng nhập</h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                {t("login.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.email.placeholder")}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                {t("login.password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.password.placeholder")}
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {(formError || error) && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {formError || error}
              </div>
            )}

            {/* Tùy chọn nhận email khi có tin mới nhất (không bắt buộc) */}
            <div className="flex items-start">
              <input
                id="newsletterOptIn"
                name="newsletterOptIn"
                type="checkbox"
                checked={newsletterOptIn}
                onChange={(e) => setNewsletterOptIn(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded mt-1"
              />
              <label htmlFor="newsletterOptIn" className="ml-3 block text-sm text-slate-700 leading-5">
                Tôi đồng ý nhận email khi có tin mới nhất
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-3 sm:py-3 sm:px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:transform-none text-sm sm:text-base"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            {/* Google login UI removed per requirement */}

            <div className="text-center pt-4">
              <p className="text-sm text-slate-600">
                {t("login.signup")}{" "}
                <a href="/signup" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                  {t("login.signup.link")}
                </a>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
