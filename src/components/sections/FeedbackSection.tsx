"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HiChevronLeft, HiChevronRight, HiStar } from "react-icons/hi"
import { FaStar, FaUser, FaBuilding } from "react-icons/fa"
// Using regular img to avoid next/image remote domain config for avatar
import { useLanguage } from "../../contexts/LanguageContext"
import { useFeedbacks } from "../../services/hooks/useFeedbacks"
import { useAuth } from "../../services/hooks/useAuth"

interface Feedback {
  id: number
  name: string
  company: string
  logo: string
  feedback: string
  rating: number
}

const FeedbackSection: React.FC = () => {
  const { t } = useLanguage()
  const { fetchFeedbacks, createFeedback, feedbacks, loading } = useFeedbacks()
  const { user } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    content: '',
    rating: 5
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Load feedbacks from API
  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        await fetchFeedbacks({ 
          page: 1,
          status: 'approved',
          limit: 10
        })
      } catch (error) {
        console.error('Failed to load feedbacks:', error)
      }
    }
    loadFeedbacks()
  }, [])

  // Không dùng dữ liệu mẫu, chỉ hiển thị từ API

  // Use API feedbacks or default ones (defensive in case feedbacks is undefined)
  const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : []
  const apiOrigin = (() => {
    try {
      const u = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1')
      return u.origin
    } catch { return 'http://localhost:5000' }
  })()

  const displayFeedbacks = safeFeedbacks.length > 0 ? safeFeedbacks.map((fb: any) => ({
    id: fb.id,
    name: fb.name,
    company: fb.company || t('feedback.customer'),
    logo: fb.user_avatar_url ? (fb.user_avatar_url.startsWith('/uploads/') ? `${apiOrigin}${fb.user_avatar_url}` : fb.user_avatar_url) : "/images/Logo01.jpg",
    feedback: fb.content,
    rating: fb.rating || 5
  })) : []

  // Ensure currentIndex is always in range when list size changes
  useEffect(() => {
    if (displayFeedbacks.length === 0) {
      setCurrentIndex(0)
    } else if (currentIndex >= displayFeedbacks.length) {
      setCurrentIndex(0)
    }
  }, [displayFeedbacks.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === displayFeedbacks.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? displayFeedbacks.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto slide every 5 seconds (only if more than 1 item)
  useEffect(() => {
    if (displayFeedbacks.length <= 1) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [displayFeedbacks.length])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus('idle')

    try {
      if (!user) {
        const confirmLogin = window.confirm(t('feedback.form.login.required'))
        if (confirmLogin) {
          window.location.href = '/login/'
        }
        setSubmitting(false)
        return
      }
      await createFeedback({
        name: formData.name,
        company: formData.company || undefined,
        content: formData.content,
        rating: formData.rating
      })
      
      setSubmitStatus('success')
      setFormData({
        name: '',
        company: '',
        content: '',
        rating: 5
      })
      
      // Reload feedbacks
      await fetchFeedbacks({ 
        status: 'approved',
        limit: 10
      })
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      setSubmitStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <HiStar
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
            {t("home.feedback.title")}
          </h2>
          {/* <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
            {t("home.feedback.subtitle")}
          </p> */}
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-xl sm:rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 sm:p-8 md:p-12 shadow-2xl"
              >
                <div className="text-center">
                  {/* Logo và thông tin công ty */}
                  <div className="mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 relative rounded-full overflow-hidden bg-gray-100">
                      <img
                        src={displayFeedbacks[currentIndex]?.logo || "/images/Logo01.jpg"}
                        alt={displayFeedbacks[currentIndex]?.company || t('feedback.customer')}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-2 leading-tight">
                      {displayFeedbacks[currentIndex]?.name || t('feedback.customer')}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-3 sm:mb-4">
                      {displayFeedbacks[currentIndex]?.company || t('feedback.customer')}
                    </p>
                    <div className="flex justify-center mb-4 sm:mb-6">
                      {renderStars(displayFeedbacks[currentIndex]?.rating || 5)}
                    </div>
                  </div>

                  {/* Feedback text */}
                  <blockquote className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed italic">
                    "{displayFeedbacks[currentIndex]?.feedback || ''}"
                  </blockquote>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous feedback"
          >
            <HiChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next feedback"
          >
            <HiChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
            {displayFeedbacks.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to feedback ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Feedback Form */}
        <div className="mt-12 sm:mt-16 text-center">
          <motion.button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showForm ? t('feedback.form.hide') : t('feedback.send')}
          </motion.button>
        </div>

        {/* Feedback Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Đóng"
                  className="absolute top-2 sm:top-3 right-2 sm:right-3 text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
                  onClick={() => setShowForm(false)}
                >
                  ✕
                </button>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center leading-tight">
                  {t('feedback.form.title')}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      {t('feedback.form.your.name')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder={t('feedback.form.your.name.placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      {t('feedback.form.company')}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder={t('feedback.form.company.placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      {t('feedback.form.rating')} *
                    </label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value={5}>{t('feedback.form.rating.5stars')}</option>
                      <option value={4}>{t('feedback.form.rating.4stars')}</option>
                      <option value={3}>{t('feedback.form.rating.3stars')}</option>
                      <option value={2}>{t('feedback.form.rating.2stars')}</option>
                      <option value={1}>{t('feedback.form.rating.1star')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      {t('feedback.form.content')} *
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                      placeholder={t('feedback.form.content.placeholder')}
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                      {t('feedback.form.success')}
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                      {t('feedback.form.error')}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                    >
                      {t('feedback.form.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors text-sm sm:text-base"
                    >
                      {submitting ? t('feedback.form.sending') : t('feedback.form.submit')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default FeedbackSection

