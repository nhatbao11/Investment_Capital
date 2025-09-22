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

    // Home page
    "home.hero.title": "Y&T CAPITAL",
    "home.hero.subtitle": "Shaping Tomorrow Through Agile Innovation",
    "home.hero.description":
      "Khám phá cơ hội đầu tư cùng chúng tôi - nơi kết nối tài chính và đổi mới để xây dựng tương lai bền vững",
    "home.hero.learnMore": "Tìm hiểu thêm",
    "home.hero.scrollDown": "Cuộn xuống",

    "home.features.title": "Tại sao chọn Y&T Capital?",
    "home.features.subtitle": "Chúng tôi mang đến những giải pháp đầu tư toàn diện và chuyên nghiệp",
    "home.features.analysis.title": "Phân tích chuyên sâu",
    "home.features.analysis.description": "Đánh giá toàn diện thị trường và cơ hội đầu tư với dữ liệu thời gian thực",
    "home.features.risk.title": "Quản lý rủi ro",
    "home.features.risk.description": "Chiến lược bảo vệ vốn và tối ưu hóa lợi nhuận với mức rủi ro được kiểm soát",
    "home.features.innovation.title": "Giải pháp sáng tạo",
    "home.features.innovation.description":
      "Tận dụng công nghệ AI và Machine Learning nhằm dự báo xu hướng thị trường, nhận diện cơ hội đầu tư tiềm năng",
    "home.features.team.title": "Đội ngũ chuyên gia",
    "home.features.team.description": "Các chuyên gia tài chính giàu kinh nghiệm đồng hành cùng bạn",

    "home.stats.professional": "Chuyên nghiệp",
    "home.stats.professional.desc": "Dịch vụ tận tâm và minh bạch",
    "home.stats.risk": "Tối ưu rủi ro",
    "home.stats.risk.desc": "Ưu tiên bảo toàn vốn dài hạn",
    "home.stats.support": "Đồng hành",
    "home.stats.support.desc": "Lắng nghe và hỗ trợ kịp thời",
    "home.stats.trust": "Tin cậy",
    "home.stats.trust.desc": "Giải pháp dựa trên dữ liệu",

    "home.about.title": "Về chúng tôi",
    "home.about.description":
      "Y&T Capital là công ty đầu tư mới với tầm nhìn dài hạn, tập trung xây dựng những giải pháp đầu tư sáng tạo và bền vững cho khách hàng.",
    "home.about.point1": "Đội ngũ chuyên gia giàu kinh nghiệm",
    "home.about.point2": "Công nghệ phân tích tiên tiến",
    "home.about.point3": "Dịch vụ khách hàng 24/7",
    "home.about.learnMore": "Tìm hiểu thêm về chúng tôi",

    "home.cta.title": "Sẵn sàng bắt đầu hành trình đầu tư?",
    "home.cta.description":
      "Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và khám phá cơ hội đầu tư phù hợp",
    "home.cta.contact": "Liên hệ ngay",
    "home.cta.solutions": "Xem giải pháp",

    // About page
    "about.hero.title": "Về Y&T Capital",
    "about.hero.subtitle": "Đối tác tin cậy trong hành trình đầu tư của bạn",

    "about.mission.title": "Sứ mệnh của chúng tôi",
    "about.mission.description":
      "Tại Y&T Capital, chúng tôi cam kết mang đến những giải pháp đầu tư sáng tạo và bền vững, giúp khách hàng đạt được mục tiêu tài chính dài hạn thông qua việc ứng dụng công nghệ tiên tiến và kinh nghiệm chuyên môn sâu rộng.",

    "about.vision.title": "Tầm nhìn",
    "about.vision.description":
      "Trở thành công ty đầu tư hàng đầu tại Việt Nam, được khách hàng tin tưởng và lựa chọn nhờ vào sự chuyên nghiệp, minh bạch và hiệu quả trong mọi dịch vụ.",

    "about.values.title": "Giá trị cốt lõi",
    "about.values.integrity": "Chính trực",
    "about.values.integrity.desc": "Minh bạch và trung thực trong mọi giao dịch",
    "about.values.excellence": "Xuất sắc",
    "about.values.excellence.desc": "Không ngừng nâng cao chất lượng dịch vụ",
    "about.values.innovation": "Đổi mới",
    "about.values.innovation.desc": "Ứng dụng công nghệ tiên tiến vào đầu tư",
    "about.values.partnership": "Đối tác",
    "about.values.partnership.desc": "Xây dựng mối quan hệ lâu dài với khách hàng",

    "about.team.title": "Đội ngũ lãnh đạo",
    "about.team.subtitle": "Những chuyên gia giàu kinh nghiệm dẫn dắt Y&T Capital",

    "about.cta.title": "Bắt đầu hành trình đầu tư cùng chúng tôi",
    "about.cta.description": "Liên hệ ngay để được tư vấn miễn phí từ đội ngũ chuyên gia của Y&T Capital",
    "about.cta.contact": "Liên hệ tư vấn",

    // Contact page
    "contact.hero.title": "Liên hệ với chúng tôi",
    "contact.hero.subtitle": "Chúng tôi luôn sẵn sàng hỗ trợ bạn",

    "contact.form.title": "Gửi tin nhắn cho chúng tôi",
    "contact.form.name": "Họ và tên",
    "contact.form.name.placeholder": "Nhập họ và tên của bạn",
    "contact.form.email": "Email",
    "contact.form.email.placeholder": "Nhập địa chỉ email của bạn",
    "contact.form.phone": "Số điện thoại",
    "contact.form.phone.placeholder": "Nhập số điện thoại của bạn",
    "contact.form.subject": "Chủ đề",
    "contact.form.subject.placeholder": "Nhập chủ đề tin nhắn",
    "contact.form.message": "Tin nhắn",
    "contact.form.message.placeholder": "Nhập nội dung tin nhắn của bạn",
    "contact.form.submit": "Gửi tin nhắn",

    "contact.info.title": "Thông tin liên hệ",
    "contact.info.address": "Địa chỉ",
    "contact.info.phone": "Điện thoại",
    "contact.info.email": "Email",
    "contact.info.hours": "Giờ làm việc",
    "contact.info.hours.value": "Thứ 2 - Thứ 6: 08:00 - 17:30",

    // Analysis page
    "analysis.hero.title": "Phân tích Doanh nghiệp",
    "analysis.hero.subtitle": "Đánh giá toàn diện và chuyên sâu các doanh nghiệp",

    "analysis.intro.title": "Dịch vụ phân tích doanh nghiệp chuyên nghiệp",
    "analysis.intro.description":
      "Chúng tôi cung cấp các báo cáo phân tích doanh nghiệp chi tiết, giúp nhà đầu tư đưa ra quyết định sáng suốt dựa trên dữ liệu và phân tích chuyên môn.",

    "analysis.services.title": "Các dịch vụ phân tích",
    "analysis.services.financial": "Phân tích tài chính",
    "analysis.services.financial.desc": "Đánh giá tình hình tài chính, khả năng sinh lời và rủi ro tài chính",
    "analysis.services.business": "Phân tích kinh doanh",
    "analysis.services.business.desc": "Phân tích mô hình kinh doanh, thị trường và vị thế cạnh tranh",
    "analysis.services.valuation": "Định giá doanh nghiệp",
    "analysis.services.valuation.desc": "Xác định giá trị hợp lý của doanh nghiệp dựa trên các phương pháp định giá",
    "analysis.services.risk": "Đánh giá rủi ro",
    "analysis.services.risk.desc": "Nhận diện và đánh giá các rủi ro tiềm ẩn trong hoạt động kinh doanh",

    // Sector page
    "sector.hero.title": "Phân tích Ngành",
    "sector.hero.subtitle": "Nghiên cứu chuyên sâu các ngành kinh tế",

    "sector.intro.title": "Phân tích ngành toàn diện",
    "sector.intro.description":
      "Chúng tôi cung cấp các báo cáo phân tích ngành chi tiết, giúp nhà đầu tư hiểu rõ xu hướng, cơ hội và thách thức của từng lĩnh vực kinh tế.",

    "sector.categories.title": "Các ngành phân tích",
    "sector.categories.banking": "Ngân hàng",
    "sector.categories.banking.desc": "Phân tích hệ thống ngân hàng và dịch vụ tài chính",
    "sector.categories.realestate": "Bất động sản",
    "sector.categories.realestate.desc": "Nghiên cứu thị trường bất động sản và xu hướng phát triển",
    "sector.categories.manufacturing": "Sản xuất",
    "sector.categories.manufacturing.desc": "Đánh giá ngành sản xuất và công nghiệp chế tạo",
    "sector.categories.technology": "Công nghệ",
    "sector.categories.technology.desc": "Phân tích ngành công nghệ thông tin và chuyển đổi số",

    // Login page
    "login.title": "Đăng nhập",
    "login.subtitle": "Chào mừng bạn trở lại",
    "login.email": "Email",
    "login.email.placeholder": "Nhập địa chỉ email của bạn",
    "login.password": "Mật khẩu",
    "login.password.placeholder": "Nhập mật khẩu của bạn",
    "login.remember": "Ghi nhớ đăng nhập",
    "login.forgot": "Quên mật khẩu?",
    "login.submit": "Đăng nhập",
    "login.signup": "Chưa có tài khoản?",
    "login.signup.link": "Đăng ký ngay",

    // Signup page
    "signup.title": "Đăng ký",
    "signup.subtitle": "Tạo tài khoản mới",
    "signup.name": "Họ và tên",
    "signup.name.placeholder": "Nhập họ và tên của bạn",
    "signup.email": "Email",
    "signup.email.placeholder": "Nhập địa chỉ email của bạn",
    "signup.password": "Mật khẩu",
    "signup.password.placeholder": "Nhập mật khẩu của bạn",
    "signup.confirm": "Xác nhận mật khẩu",
    "signup.confirm.placeholder": "Nhập lại mật khẩu của bạn",
    "signup.terms": "Tôi đồng ý với",
    "signup.terms.link": "Điều khoản sử dụng",
    "signup.submit": "Đăng ký",
    "signup.login": "Đã có tài khoản?",
    "signup.login.link": "Đăng nhập ngay",

    // StockFilter page
    "stock.title": "Bộ lọc cổ phiếu",
    "stock.subtitle": "Tìm kiếm và phân tích cổ phiếu",
    "stock.search": "Tìm kiếm cổ phiếu",
    "stock.search.placeholder": "Nhập mã cổ phiếu hoặc tên công ty",
    "stock.filter.sector": "Ngành",
    "stock.filter.sector.all": "Tất cả ngành",
    "stock.filter.price": "Khoảng giá",
    "stock.filter.price.min": "Giá tối thiểu",
    "stock.filter.price.max": "Giá tối đa",
    "stock.filter.volume": "Khối lượng giao dịch",
    "stock.filter.apply": "Áp dụng bộ lọc",
    "stock.filter.reset": "Đặt lại",
    "stock.results.title": "Kết quả tìm kiếm",
    "stock.results.code": "Mã CK",
    "stock.results.name": "Tên công ty",
    "stock.results.price": "Giá",
    "stock.results.change": "Thay đổi",
    "stock.results.volume": "KL",
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

    // Home page
    "home.hero.title": "Y&T CAPITAL",
    "home.hero.subtitle": "Shaping Tomorrow Through Agile Innovation",
    "home.hero.description":
      "Discover investment opportunities with us - where finance and innovation connect to build a sustainable future",
    "home.hero.learnMore": "Learn More",
    "home.hero.scrollDown": "Scroll Down",

    "home.features.title": "Why Choose Y&T Capital?",
    "home.features.subtitle": "We provide comprehensive and professional investment solutions",
    "home.features.analysis.title": "In-depth Analysis",
    "home.features.analysis.description":
      "Comprehensive market assessment and investment opportunities with real-time data",
    "home.features.risk.title": "Risk Management",
    "home.features.risk.description":
      "Capital protection strategies and profit optimization with controlled risk levels",
    "home.features.innovation.title": "Innovative Solutions",
    "home.features.innovation.description":
      "Leveraging AI and Machine Learning technology to forecast market trends and identify potential investment opportunities",
    "home.features.team.title": "Expert Team",
    "home.features.team.description": "Experienced financial experts accompanying you on your journey",

    "home.stats.professional": "Professional",
    "home.stats.professional.desc": "Dedicated and transparent service",
    "home.stats.risk": "Risk Optimized",
    "home.stats.risk.desc": "Prioritizing long-term capital preservation",
    "home.stats.support": "Partnership",
    "home.stats.support.desc": "Listening and timely support",
    "home.stats.trust": "Trustworthy",
    "home.stats.trust.desc": "Data-driven solutions",

    "home.about.title": "About Us",
    "home.about.description":
      "Y&T Capital is a new investment company with a long-term vision, focusing on building innovative and sustainable investment solutions for clients.",
    "home.about.point1": "Experienced expert team",
    "home.about.point2": "Advanced analytics technology",
    "home.about.point3": "24/7 customer service",
    "home.about.learnMore": "Learn more about us",

    "home.cta.title": "Ready to start your investment journey?",
    "home.cta.description": "Contact us today for free consultation and discover suitable investment opportunities",
    "home.cta.contact": "Contact Now",
    "home.cta.solutions": "View Solutions",

    // About page
    "about.hero.title": "About Y&T Capital",
    "about.hero.subtitle": "Your trusted partner in the investment journey",

    "about.mission.title": "Our Mission",
    "about.mission.description":
      "At Y&T Capital, we are committed to providing innovative and sustainable investment solutions, helping clients achieve long-term financial goals through the application of advanced technology and deep professional expertise.",

    "about.vision.title": "Vision",
    "about.vision.description":
      "To become the leading investment company in Vietnam, trusted and chosen by clients for professionalism, transparency, and effectiveness in all services.",

    "about.values.title": "Core Values",
    "about.values.integrity": "Integrity",
    "about.values.integrity.desc": "Transparency and honesty in all transactions",
    "about.values.excellence": "Excellence",
    "about.values.excellence.desc": "Continuously improving service quality",
    "about.values.innovation": "Innovation",
    "about.values.innovation.desc": "Applying advanced technology to investment",
    "about.values.partnership": "Partnership",
    "about.values.partnership.desc": "Building long-term relationships with clients",

    "about.team.title": "Leadership Team",
    "about.team.subtitle": "Experienced professionals leading Y&T Capital",

    "about.cta.title": "Start your investment journey with us",
    "about.cta.description": "Contact now for free consultation from Y&T Capital's expert team",
    "about.cta.contact": "Contact for Consultation",

    // Contact page
    "contact.hero.title": "Contact Us",
    "contact.hero.subtitle": "We are always ready to support you",

    "contact.form.title": "Send us a message",
    "contact.form.name": "Full Name",
    "contact.form.name.placeholder": "Enter your full name",
    "contact.form.email": "Email",
    "contact.form.email.placeholder": "Enter your email address",
    "contact.form.phone": "Phone Number",
    "contact.form.phone.placeholder": "Enter your phone number",
    "contact.form.subject": "Subject",
    "contact.form.subject.placeholder": "Enter message subject",
    "contact.form.message": "Message",
    "contact.form.message.placeholder": "Enter your message content",
    "contact.form.submit": "Send Message",

    "contact.info.title": "Contact Information",
    "contact.info.address": "Address",
    "contact.info.phone": "Phone",
    "contact.info.email": "Email",
    "contact.info.hours": "Working Hours",
    "contact.info.hours.value": "Mon - Fri: 08:00 - 17:30",

    // Analysis page
    "analysis.hero.title": "Business Analysis",
    "analysis.hero.subtitle": "Comprehensive and in-depth business evaluation",

    "analysis.intro.title": "Professional business analysis services",
    "analysis.intro.description":
      "We provide detailed business analysis reports, helping investors make informed decisions based on data and professional analysis.",

    "analysis.services.title": "Analysis Services",
    "analysis.services.financial": "Financial Analysis",
    "analysis.services.financial.desc": "Assess financial situation, profitability and financial risks",
    "analysis.services.business": "Business Analysis",
    "analysis.services.business.desc": "Analyze business model, market and competitive position",
    "analysis.services.valuation": "Business Valuation",
    "analysis.services.valuation.desc": "Determine fair value of business based on valuation methods",
    "analysis.services.risk": "Risk Assessment",
    "analysis.services.risk.desc": "Identify and assess potential risks in business operations",

    // Sector page
    "sector.hero.title": "Sector Analysis",
    "sector.hero.subtitle": "In-depth research of economic sectors",

    "sector.intro.title": "Comprehensive sector analysis",
    "sector.intro.description":
      "We provide detailed sector analysis reports, helping investors understand trends, opportunities and challenges of each economic field.",

    "sector.categories.title": "Analysis Sectors",
    "sector.categories.banking": "Banking",
    "sector.categories.banking.desc": "Analysis of banking system and financial services",
    "sector.categories.realestate": "Real Estate",
    "sector.categories.realestate.desc": "Real estate market research and development trends",
    "sector.categories.manufacturing": "Manufacturing",
    "sector.categories.manufacturing.desc": "Assessment of manufacturing and industrial sectors",
    "sector.categories.technology": "Technology",
    "sector.categories.technology.desc": "Analysis of IT sector and digital transformation",

    // Login page
    "login.title": "Login",
    "login.subtitle": "Welcome back",
    "login.email": "Email",
    "login.email.placeholder": "Enter your email address",
    "login.password": "Password",
    "login.password.placeholder": "Enter your password",
    "login.remember": "Remember me",
    "login.forgot": "Forgot password?",
    "login.submit": "Login",
    "login.signup": "Don't have an account?",
    "login.signup.link": "Sign up now",

    // Signup page
    "signup.title": "Sign Up",
    "signup.subtitle": "Create new account",
    "signup.name": "Full Name",
    "signup.name.placeholder": "Enter your full name",
    "signup.email": "Email",
    "signup.email.placeholder": "Enter your email address",
    "signup.password": "Password",
    "signup.password.placeholder": "Enter your password",
    "signup.confirm": "Confirm Password",
    "signup.confirm.placeholder": "Re-enter your password",
    "signup.terms": "I agree to the",
    "signup.terms.link": "Terms of Use",
    "signup.submit": "Sign Up",
    "signup.login": "Already have an account?",
    "signup.login.link": "Login now",

    // StockFilter page
    "stock.title": "Stock Filter",
    "stock.subtitle": "Search and analyze stocks",
    "stock.search": "Search stocks",
    "stock.search.placeholder": "Enter stock code or company name",
    "stock.filter.sector": "Sector",
    "stock.filter.sector.all": "All sectors",
    "stock.filter.price": "Price Range",
    "stock.filter.price.min": "Minimum price",
    "stock.filter.price.max": "Maximum price",
    "stock.filter.volume": "Trading Volume",
    "stock.filter.apply": "Apply Filter",
    "stock.filter.reset": "Reset",
    "stock.results.title": "Search Results",
    "stock.results.code": "Code",
    "stock.results.name": "Company Name",
    "stock.results.price": "Price",
    "stock.results.change": "Change",
    "stock.results.volume": "Volume",
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
