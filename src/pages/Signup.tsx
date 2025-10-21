"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "../contexts/LanguageContext"
import { useAuth } from "../services/hooks/useAuth"

const Signup: React.FC = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const { register, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formError, setFormError] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError("Vui lòng điền đầy đủ thông tin")
      return
    }
    
    // Validate terms acceptance
    if (!termsAccepted) {
      setFormError("Vui lòng đồng ý với điều khoản sử dụng")
      return
    }
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setFormError("Mật khẩu xác nhận không khớp")
      return
    }
    
    // Validate password length
    if (formData.password.length < 8) {
      setFormError("Mật khẩu phải có ít nhất 8 ký tự")
      return
    }
    
    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/
    if (!passwordRegex.test(formData.password)) {
      setFormError("Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt (@$!%*?&)")
      return
    }
    
    try {
      await register({
        full_name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "client"
      })
      // Redirect after successful registration
      router.push("/")
    } catch (err: any) {
      
      // Xử lý lỗi validation
      if (err.response?.data?.code === 'VALIDATION_ERROR') {
        const validationErrors = err.response.data.errors
        if (validationErrors && validationErrors.length > 0) {
          setFormError(validationErrors[0].message)
          return
        }
      }
      
      // Xử lý lỗi email đã tồn tại
      if (err.response?.data?.code === 'EMAIL_EXISTS') {
        setFormError("Email này đã được sử dụng. Vui lòng chọn email khác.")
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
        setFormError("Đăng ký thất bại. Vui lòng thử lại.")
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleGoogleSignup = () => {
    // Google signup functionality
  }

  const handleFacebookSignup = () => {
    // Facebook signup functionality
  }

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
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t("signup.title")}</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">{t("signup.subtitle")}</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                {t("signup.name")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={t("signup.name.placeholder")}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                {t("signup.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={t("signup.email.placeholder")}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                {t("signup.password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("signup.password.placeholder")}
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                {t("signup.confirm")}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t("signup.confirm.placeholder")}
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {formError}
              </div>
            )}

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-3 block text-sm text-slate-700 leading-5">
                {t("signup.terms")} {" "}
                <a href="/terms.pdf" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-500 font-medium transition-colors">
                  {t("signup.terms.link")}
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !termsAccepted}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-3 sm:py-3 sm:px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:transform-none disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? t("signup.loading") : t("signup.submit")}
            </button>

            {/* Social signup removed as requested */}

            <div className="text-center pt-4">
              <p className="text-sm text-slate-600">
                {t("signup.login")}{" "}
                <a href="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                  {t("signup.login.link")}
                </a>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup
