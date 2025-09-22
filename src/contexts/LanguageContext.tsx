"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Language = "vi" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  vi: {
    // Header
    "header.login": "Đăng nhập",
    "header.signup": "Đăng ký",
    "header.about": "Về chúng tôi",
    "header.sector": "Phân tích Ngành",
    "header.analysis": "Phân tích Doanh nghiệp",
    "header.investment": "Giải pháp đầu tư",
    "header.contact": "Liên hệ",
    "header.slogan": "Shaping Tomorrow Through Agile Innovation",

    // Investment dropdown
    "investment.knowledge": "Kiến thức đầu tư",
    "investment.theory": "Lý thuyết nền tảng",
    "investment.history": "Lịch sử thị trường tài chính và các cuộc khủng hoảng",
    "investment.tools": "Công cụ và phương pháp phân tích",
    "investment.methods": "Phương pháp đầu tư",
    "investment.strategy": "Chiến lược đầu tư",
    "investment.portfolio": "Xây dựng danh mục đầu tư",
    "investment.risk": "Quản trị rủi ro",
    "investment.risk.overview": "Tổng quan về rủi ro",
    "investment.risk.types": "Phân loại rủi ro",
    "investment.risk.methods": "Phương pháp quản trị rủi ro",

    // Footer
    "footer.address": "Địa chỉ",
    "footer.contact": "Liên hệ",
    "footer.info": "Thông tin",
    "footer.terms": "Điều khoản sử dụng",
    "footer.privacy": "Chính sách bảo mật",
    "footer.about": "Về chúng tôi",
    "footer.services": "Dịch vụ",
    "footer.hours": "Thứ 2 - Thứ 6: 08:00 - 17:30",
    "footer.rights": "All rights reserved.",

    // Languages
    "lang.vietnamese": "Tiếng Việt",
    "lang.english": "English",
  },
  en: {
    // Header
    "header.login": "Login",
    "header.signup": "Sign Up",
    "header.about": "About Us",
    "header.sector": "Sector Analysis",
    "header.analysis": "Business Analysis",
    "header.investment": "Investment Solutions",
    "header.contact": "Contact",
    "header.slogan": "Shaping Tomorrow Through Agile Innovation",

    // Investment dropdown
    "investment.knowledge": "Investment Knowledge",
    "investment.theory": "Fundamental Theory",
    "investment.history": "Financial Market History and Crises",
    "investment.tools": "Analysis Tools and Methods",
    "investment.methods": "Investment Methods",
    "investment.strategy": "Investment Strategy",
    "investment.portfolio": "Portfolio Construction",
    "investment.risk": "Risk Management",
    "investment.risk.overview": "Risk Overview",
    "investment.risk.types": "Risk Classification",
    "investment.risk.methods": "Risk Management Methods",

    // Footer
    "footer.address": "Address",
    "footer.contact": "Contact",
    "footer.info": "Information",
    "footer.terms": "Terms of Use",
    "footer.privacy": "Privacy Policy",
    "footer.about": "About Us",
    "footer.services": "Services",
    "footer.hours": "Mon - Fri: 08:00 - 17:30",
    "footer.rights": "All rights reserved.",

    // Languages
    "lang.vietnamese": "Vietnamese",
    "lang.english": "English",
  },
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language") as Language
    return saved && ["vi", "en"].includes(saved) ? saved : "vi"
  })

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
    document.documentElement.lang = language
  }, [language])

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
