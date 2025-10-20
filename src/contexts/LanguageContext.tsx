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
    "lang.language": "Ngôn ngữ",

    // Common
    "common.categories": "Danh mục",
    "common.all_categories": "Tất cả danh mục",

    // Home page
    "home.hero.title": "Y&T GROUP",
    "home.hero.subtitle": "Shaping Tomorrow Through Agile Innovation",
    "home.hero.description":
      "Khám phá cơ hội đầu tư cùng chúng tôi - nơi kết nối tài chính và đổi mới để xây dựng tương lai bền vững",
    "home.hero.learnMore": "---> Tìm hiểu thêm",
    "home.hero.scrollDown": "Cuộn xuống",

    "home.features.title": "Tại sao chọn Y&T Group?",
    "home.features.subtitle": "Chúng tôi mang đến giải pháp đầu tư toàn diện và phân tích chuyên nghiệp",
    "home.features.analysis.title": "Phân tích ngành",
    "home.features.analysis.description": "Đánh giá, phân tích thị trường và tiềm năng của từng ngành.",
    "home.features.risk.title": "Phân tích doanh nghiệp",
    "home.features.risk.description": "Phân tích chuyên sâu về doanh nghiệp tiềm năng.",
    "home.features.innovation.title": "Giải pháp đầu tư",
    "home.features.innovation.description":
      "Cung cấp các kiến thức về giải pháp đầu tư một cách đầy đủ và chuyên nghiệp.",
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
      "Y&T Group là công ty đầu tư mới với tầm nhìn dài hạn, tập trung xây dựng những giải pháp đầu tư sáng tạo và bền vững cho khách hàng.",
    "home.about.point1": "Đội ngũ chuyên gia giàu kinh nghiệm",
    "home.about.point2": "Công nghệ phân tích tiên tiến",
    "home.about.point3": "Dịch vụ khách hàng 24/7",
    "home.about.learnMore": "Tìm hiểu thêm về chúng tôi",
    "home.about.mission": "Sứ mệnh của chúng tôi là cung cấp những kiến thức và báo cáo uy tín, toàn diện, giúp khách hàng tiếp cận thông tin chính xác, đưa ra các quyết định đầu tư chiến lược, quản lý nguồn vốn hiệu quả và đạt được lợi nhuận bền vững trong dài hạn.",

    "home.cta.title": "Sẵn sàng bắt đầu hành trình đầu tư?",
    "home.cta.description":
      "Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và khám phá cơ hội đầu tư phù hợp",
    "home.cta.contact": "Liên hệ ngay",
    "home.cta.solutions": "Xem giải pháp",

    "home.feedback.title": "Khách hàng nói gì về chúng tôi",
    "home.feedback.subtitle": "Những phản hồi tích cực từ khách hàng đã tin tưởng và đồng hành cùng chúng tôi",

    // About page
    "about.hero.title": "Y&T Group",
    "about.hero.subtitle": "- nơi hội tụ kiến thức, phân tích và chiến lược đầu tư, mang đến cho bạn chìa khóa để mở ra cơ hội và thành công trong thế giới tài chính.",

    "about.mission.title": "Sứ mệnh của chúng tôi",
    "about.mission.description":
      "Tại Y&T Group, chúng tôi cam kết mang đến những giải pháp đầu tư sáng tạo và bền vững, giúp khách hàng đạt được mục tiêu tài chính dài hạn thông qua việc ứng dụng công nghệ tiên tiến và kinh nghiệm chuyên môn sâu rộng.",

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
    "about.team.subtitle": "Những chuyên gia giàu kinh nghiệm dẫn dắt Y&T Group",

    "about.cta.title": "Bắt đầu hành trình đầu tư cùng chúng tôi",
    "about.cta.description": "Liên hệ ngay để được tư vấn miễn phí từ đội ngũ chuyên gia của Y&T Group",
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

    // ContactNew page
    "contactnew.info.title": "Thông tin liên hệ",
    "contactnew.info.address": "92, 19E, Phường An Lạc, TP. Hồ Chí Minh",
    "contactnew.info.email": "ytcapital.group@gmail.com",
    "contactnew.info.phone": "0822 082 407",
    "contactnew.info.hours": "Thứ 2 - Thứ 6: 8:00 - 17:00",
    "contactnew.form.title": "Gửi tin nhắn cho chúng tôi",
    "contactnew.form.name.placeholder": "Họ và tên",
    "contactnew.form.email.placeholder": "Email",
    "contactnew.form.message.placeholder": "Tin nhắn",
    "contactnew.form.submit": "Gửi",
    "contactnew.form.sending": "Đang gửi...",
    "contactnew.form.success": "Đã gửi thành công! Chúng tôi sẽ phản hồi sớm.",
    "contactnew.form.error": "Gửi thất bại. Vui lòng thử lại sau.",

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

    // About page - Additional translations
    "about.about_us.title": "Về Chúng Tôi",
    "about.about_us.description": "Sứ mệnh của chúng tôi là cung cấp kiến thức và báo cáo phân tích đầu tư đáng tin cậy. Chúng tôi mang đến thông tin cập nhật và phân tích rõ ràng giúp nhà đầu tư hiểu thị trường. Các báo cáo tập trung vào cơ hội, rủi ro và giải pháp chiến lược. Chúng tôi đồng hành cùng nhà đầu tư trong việc xây dựng kế hoạch tài chính hiệu quả. Mục tiêu cuối cùng là tạo ra giá trị bền vững cho nhà đầu tư và đối tác.",
    
    // Team members
    "about.members.nhat.name": "Trần Minh Nhật",
    "about.members.nhat.title": "Founder",
    "about.members.nhat.description": "Anh Nhật là người sáng lập công ty, định hướng tầm nhìn và chiến lược tổng thể. Tập trung vào giải pháp đầu tư bền vững.",
    "about.members.nhat.experience": "5+ năm kinh nghiệm trong lĩnh vực tài chính và đầu tư",
    "about.members.nhat.strengths": "Lãnh đạo chiến lược, Phân tích tài chính, Quản lý rủi ro, Phát triển kinh doanh",
    "about.members.nhat.achievements": "Tác giả của 3 cuốn sách về đầu tư tài chính, Xây dựng chiến lược đầu tư thành công, Phát triển mô hình quản lý rủi ro hiệu quả, Dẫn dắt đội ngũ chuyên gia",
    "about.members.nhat.education": "Thạc sĩ Tài chính - Đại học Kinh tế TP.HCM",
    
    "about.members.nga.name": "Phạm Phương Nga",
    "about.members.nga.title": "Co-Founder",
    "about.members.nga.description": "Chị Nga phụ trách phát triển kinh doanh và đối tác. Kinh nghiệm trong vận hành và mở rộng quy mô.",
    "about.members.nga.experience": "5+ năm kinh nghiệm trong phát triển kinh doanh và quản lý đối tác",
    "about.members.nga.strengths": "Phát triển kinh doanh, Quản lý đối tác, Vận hành doanh nghiệp, Mở rộng thị trường",
    "about.members.nga.achievements": "Xây dựng mạng lưới 200+ đối tác chiến lược, Phát triển kênh phân phối hiệu quả, Tối ưu hóa quy trình vận hành, Mở rộng thị trường thành công",
    "about.members.nga.education": "Thạc sĩ Tài chính - Đại học Kinh tế TP.HCM",
    
    "about.members.bao.name": "Nguyễn Nhất Bảo",
    "about.members.bao.title": "Co-Founder",
    "about.members.bao.description": "Anh Bảo phụ trách công nghệ và sản phẩm. Tập trung tối ưu trải nghiệm và hiệu quả hệ thống.",
    "about.members.bao.experience": "5+ năm kinh nghiệm trong công nghệ tài chính và phát triển sản phẩm",
    "about.members.bao.strengths": "Công nghệ tài chính, Phát triển sản phẩm, Tối ưa hóa hệ thống, Đổi mới sáng tạo",
    "about.members.bao.achievements": "Phát triển 10+ sản phẩm fintech thành công, Xây dựng hệ thống phân tích dữ liệu, Tối ưu hóa hiệu suất hệ thống, Đổi mới công nghệ",
    "about.members.bao.education": "Cử nhân công nghệ thông tin - VKU",

    // Investment page
    "investment.page.title": "Giải pháp đầu tư",
    "investment.page.subtitle": "Nội dung rõ ràng, dễ sử dụng",
    "investment.bookjourney.title": "Hành trình sách đầu tư",
    "investment.knowledge.title": "Kiến thức đầu tư",
    "investment.meaning.title": "Ý nghĩa",
    "investment.view.more": "Xem thêm",
    "investment.collapse": "Thu gọn",
    "investment.no.content": "Không có nội dung phù hợp",
    "investment.no.content.subtitle": "Vui lòng thử lại với từ khóa khác",

    // Feedback section
    "feedback.customer": "Khách hàng",
    "feedback.send": "Gửi phản hồi của bạn",
    "feedback.form.title": "Gửi phản hồi",
    "feedback.form.name": "Họ và tên",
    "feedback.form.name.placeholder": "Nhập họ và tên của bạn",
    "feedback.form.email": "Email",
    "feedback.form.email.placeholder": "Nhập địa chỉ email của bạn",
    "feedback.form.message": "Tin nhắn",
    "feedback.form.message.placeholder": "Nhập nội dung phản hồi của bạn",
    "feedback.form.submit": "Gửi phản hồi",
    "feedback.form.sending": "Đang gửi...",
    "feedback.form.success": "Đã gửi phản hồi thành công! Cảm ơn bạn.",
    "feedback.form.error": "Gửi thất bại. Vui lòng thử lại sau.",
    "feedback.form.login.required": "Bạn cần đăng nhập để gửi phản hồi. Bạn có muốn chuyển đến trang đăng nhập không?",
    "feedback.form.cancel": "Hủy",
    "feedback.form.hide": "Ẩn form gửi phản hồi",
    "feedback.form.your.name": "Tên của bạn",
    "feedback.form.your.name.placeholder": "Nhập tên của bạn",
    "feedback.form.company": "Công ty (tùy chọn)",
    "feedback.form.company.placeholder": "Tên công ty",
    "feedback.form.rating": "Đánh giá",
    "feedback.form.rating.5stars": "5 sao - Rất hài lòng",
    "feedback.form.rating.4stars": "4 sao - Hài lòng",
    "feedback.form.rating.3stars": "3 sao - Bình thường",
    "feedback.form.rating.2stars": "2 sao - Không hài lòng",
    "feedback.form.rating.1star": "1 sao - Rất không hài lòng",
    "feedback.form.content": "Nội dung phản hồi",
    "feedback.form.content.placeholder": "Chia sẻ trải nghiệm của bạn với chúng tôi...",

    // Sector Analysis page
    "sector.page.title": "Báo cáo phân tích ngành",
    "sector.search.placeholder": "Tìm tiêu đề...",
    "sector.filter.latest": "Mới nhất",
    "sector.filter.popular": "Phổ biến",
    "sector.filter.oldest": "Cũ nhất",

    // Business Analysis page  
    "analysis.page.title": "Báo cáo phân tích doanh nghiệp",
    "analysis.search.placeholder": "Tìm tiêu đề...",
    "analysis.filter.latest": "Mới nhất",
    "analysis.filter.popular": "Phổ biến",
    "analysis.filter.oldest": "Cũ nhất",
    "analysis.category.nganh": "Phân tích ngành",
    "analysis.category.doanh_nghiep": "Phân tích doanh nghiệp",
    "analysis.category.nganh.short": "Ngành",
    "analysis.category.doanh_nghiep.short": "Doanh nghiệp",
    "analysis.read.report": "Đọc báo cáo",
    "analysis.read": "Đọc",
    "analysis.loading": "Đang tải báo cáo...",
    "analysis.no.reports": "Chưa có báo cáo",
    "analysis.view.more": "Xem thêm",
    "greeting.hello": "Xin chào",
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
    "lang.language": "Language",

    // Common
    "common.categories": "Categories",
    "common.all_categories": "All Categories",

    // Home page
    "home.hero.title": "Y&T GROUP",
    "home.hero.subtitle": "Shaping Tomorrow Through Agile Innovation",
    "home.hero.description":
      "Discover investment opportunities with us - where finance and innovation connect to build a sustainable future",
    "home.hero.learnMore": "---> Learn More",
    "home.hero.scrollDown": "Scroll Down",

    "home.features.title": "Why Choose Y&T Group?",
    "home.features.subtitle": "We provide comprehensive and professional investment solutions",
    "home.features.analysis.title": "Sector Analysis",
    "home.features.analysis.description":
      "Evaluate and analyze the market and potential of each industry.",
    "home.features.risk.title": "Business Analysis",
    "home.features.risk.description":
      "Conduct an in-depth analysis of potential companies",
    "home.features.innovation.title": "Investment Solutions",

    "home.features.innovation.description":
      "Provide comprehensive and professional knowledge on investment solutions.",
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
      "Y&T Group is a new investment company with a long-term vision, focusing on building innovative and sustainable investment solutions for clients.",
    "home.about.point1": "Experienced expert team",
    "home.about.point2": "Advanced analytics technology",
    "home.about.point3": "24/7 customer service",
    "home.about.learnMore": "Learn more about us",
    "home.about.mission": "Our mission is to provide reliable and comprehensive knowledge and reports, helping clients access accurate information, make strategic investment decisions, manage capital effectively and achieve sustainable long-term profits.",

    "home.cta.title": "Ready to start your investment journey?",
    "home.cta.description": "Contact us today for free consultation and discover suitable investment opportunities",
    "home.cta.contact": "Contact Now",
    "home.cta.solutions": "View Solutions",

    "home.feedback.title": "What Our Clients Say",
    "home.feedback.subtitle": "Positive feedback from clients who have trusted and partnered with us",

    // About page
    "about.hero.title": "About Y&T Group",
    "about.hero.subtitle": "Your trusted partner in the investment journey",

    "about.mission.title": "Our Mission",
    "about.mission.description":
      "At Y&T Group, we are committed to providing innovative and sustainable investment solutions, helping clients achieve long-term financial goals through the application of advanced technology and deep professional expertise.",

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
    "about.team.subtitle": "Experienced professionals leading Y&T Group",

    "about.cta.title": "Start your investment journey with us",
    "about.cta.description": "Contact now for free consultation from Y&T Group's expert team",
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

    // ContactNew page
    "contactnew.info.title": "Contact Information",
    "contactnew.info.address": "92, 19E, An Lac Ward, Ho Chi Minh City",
    "contactnew.info.email": "ytcapital.group@gmail.com",
    "contactnew.info.phone": "0822 082 407",
    "contactnew.info.hours": "Mon - Fri: 8:00 - 17:00",
    "contactnew.form.title": "Send Us A Message",
    "contactnew.form.name.placeholder": "Full Name",
    "contactnew.form.email.placeholder": "Email",
    "contactnew.form.message.placeholder": "Message",
    "contactnew.form.submit": "Send",
    "contactnew.form.sending": "Sending...",
    "contactnew.form.success": "Sent successfully! We will respond soon.",
    "contactnew.form.error": "Send failed. Please try again later.",

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

    // About page - Additional translations
    "about.about_us.title": "About Us",
    "about.about_us.description": "Our mission is to provide reliable and comprehensive investment analysis knowledge and reports. We deliver updated information and clear analysis to help investors understand the market. Our reports focus on opportunities, risks, and strategic solutions. We accompany investors in building effective financial plans. The ultimate goal is to create sustainable value for investors and partners.",
    
    // Team members
    "about.members.nhat.name": "Tran Minh Nhat",
    "about.members.nhat.title": "Founder",
    "about.members.nhat.description": "Mr. Nhat is the company founder, setting the vision and overall strategy. Focused on sustainable investment solutions.",
    "about.members.nhat.experience": "5+ years of experience in finance and investment",
    "about.members.nhat.strengths": "Strategic leadership, Financial analysis, Risk management, Business development",
    "about.members.nhat.achievements": "Author of 3 books on financial investment, Built successful investment strategies, Developed effective risk management models, Led expert teams",
    "about.members.nhat.education": "Master of Finance - Ho Chi Minh City University of Economics",
    
    "about.members.nga.name": "Pham Phuong Nga",
    "about.members.nga.title": "Co-Founder",
    "about.members.nga.description": "Ms. Nga is responsible for business development and partnerships. Experienced in operations and scaling.",
    "about.members.nga.experience": "5+ years of experience in business development and partnership management",
    "about.members.nga.strengths": "Business development, Partnership management, Business operations, Market expansion",
    "about.members.nga.achievements": "Built network of 200+ strategic partners, Developed efficient distribution channels, Optimized operational processes, Successfully expanded markets",
    "about.members.nga.education": "Master of Finance - Ho Chi Minh City University of Economics",
    
    "about.members.bao.name": "Nguyen Nhat Bao",
    "about.members.bao.title": "Co-Founder",
    "about.members.bao.description": "Mr. Bao is responsible for technology and products. Focused on optimizing experience and system efficiency.",
    "about.members.bao.experience": "5+ years of experience in financial technology and product development",
    "about.members.bao.strengths": "Financial technology, Product development, System optimization, Innovation",
    "about.members.bao.achievements": "Developed 10+ successful fintech products, Built data analysis systems, Optimized system performance, Technology innovation",
    "about.members.bao.education": "Bachelor of Information Technology - VKU",

    // Investment page
    "investment.page.title": "Investment Solutions",
    "investment.page.subtitle": "Clear, easy to follow and use content",
    "investment.bookjourney.title": "Investment Book Journey",
    "investment.knowledge.title": "Investment Knowledge",
    "investment.meaning.title": "Meaning",
    "investment.view.more": "View More",
    "investment.collapse": "Collapse",
    "investment.no.content": "No matching content found",
    "investment.no.content.subtitle": "Please try with different keywords",

    // Feedback section
    "feedback.customer": "Customer",
    "feedback.send": "Send Your Feedback",
    "feedback.form.title": "Send Feedback",
    "feedback.form.name": "Full Name",
    "feedback.form.name.placeholder": "Enter your full name",
    "feedback.form.email": "Email",
    "feedback.form.email.placeholder": "Enter your email address",
    "feedback.form.message": "Message",
    "feedback.form.message.placeholder": "Enter your feedback content",
    "feedback.form.submit": "Send Feedback",
    "feedback.form.sending": "Sending...",
    "feedback.form.success": "Feedback sent successfully! Thank you.",
    "feedback.form.error": "Send failed. Please try again later.",
    "feedback.form.login.required": "You need to login to send feedback. Do you want to go to the login page?",
    "feedback.form.cancel": "Cancel",
    "feedback.form.hide": "Hide feedback form",
    "feedback.form.your.name": "Your Name",
    "feedback.form.your.name.placeholder": "Enter your name",
    "feedback.form.company": "Company (optional)",
    "feedback.form.company.placeholder": "Company name",
    "feedback.form.rating": "Rating",
    "feedback.form.rating.5stars": "5 stars - Very satisfied",
    "feedback.form.rating.4stars": "4 stars - Satisfied",
    "feedback.form.rating.3stars": "3 stars - Neutral",
    "feedback.form.rating.2stars": "2 stars - Dissatisfied",
    "feedback.form.rating.1star": "1 star - Very dissatisfied",
    "feedback.form.content": "Feedback content",
    "feedback.form.content.placeholder": "Share your experience with us...",

    // Sector Analysis page
    "sector.page.title": "Sector Analysis Reports",
    "sector.search.placeholder": "Search title...",
    "sector.filter.latest": "Latest",
    "sector.filter.popular": "Popular",
    "sector.filter.oldest": "Oldest",

    // Business Analysis page  
    "analysis.page.title": "Business Analysis Reports",
    "analysis.search.placeholder": "Search title...",
    "analysis.filter.latest": "Latest",
    "analysis.filter.popular": "Popular",
    "analysis.filter.oldest": "Oldest",
    "analysis.category.nganh": "Sector Analysis",
    "analysis.category.doanh_nghiep": "Business Analysis",
    "analysis.category.nganh.short": "Sector",
    "analysis.category.doanh_nghiep.short": "Business",
    "analysis.read.report": "Read Report",
    "analysis.read": "Read",
    "analysis.loading": "Loading reports...",
    "analysis.no.reports": "No reports available",
    "analysis.view.more": "View More",
    "greeting.hello": "Hello",
  },
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("vi")
  const [isClient, setIsClient] = useState(false)

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("language") as Language
      if (saved && ["vi", "en"].includes(saved)) {
        setLanguage(saved)
      }
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem("language", language)
      document.documentElement.lang = language
    }
  }, [language, isClient])

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
    // Fallback for SSR or when context is not available
    return {
      language: "vi" as Language,
      setLanguage: () => {},
      t: (key: string) => key,
    }
  }
  
  // Return consistent values during SSR
  if (typeof window === 'undefined') {
    return {
      language: "vi" as Language,
      setLanguage: () => {},
      t: (key: string) => key,
    }
  }
  
  return context
}