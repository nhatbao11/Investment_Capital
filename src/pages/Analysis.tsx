"use client"

import type React from "react"
import { motion } from "framer-motion"
import { HiChartBar, HiTrendingUp, HiCurrencyDollar, HiShieldCheck } from "react-icons/hi"
import PageHeader from "../components/ui/PageHeader"
import phantichdoanhnghiep from "../assets/images/phantichdoanhnghiep.jpg"
import { useLanguage } from "../contexts/LanguageContext"

const Analysis: React.FC = () => {
  const { t } = useLanguage()

  const openPDF = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank")
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <PageHeader
        title={t("analysis.hero.title")}
        subtitle={t("analysis.hero.subtitle")}
        backgroundImage={phantichdoanhnghiep}
      />

      <div className="max-w-7xl mx-auto py-24 px-6 lg:px-8 space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-8">{t("analysis.intro.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t("analysis.intro.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-primary mb-16 text-center">
            {t("analysis.services.title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-8 text-center group hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <HiChartBar className="text-5xl text-blue-900" />
              </div>
              <h4 className="text-xl font-bold text-primary mb-4">{t("analysis.services.financial")}</h4>
              <p className="text-muted-foreground leading-relaxed">{t("analysis.services.financial.desc")}</p>
            </div>
            <div className="card p-8 text-center group hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <HiTrendingUp className="text-5xl text-yellow-500" />
              </div>
              <h4 className="text-xl font-bold text-primary mb-4">{t("analysis.services.business")}</h4>
              <p className="text-muted-foreground leading-relaxed">{t("analysis.services.business.desc")}</p>
            </div>
            <div className="card p-8 text-center group hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <HiCurrencyDollar className="text-5xl text-blue-900" />
              </div>
              <h4 className="text-xl font-bold text-primary mb-4">{t("analysis.services.valuation")}</h4>
              <p className="text-muted-foreground leading-relaxed">{t("analysis.services.valuation.desc")}</p>
            </div>
            <div className="card p-8 text-center group hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <HiShieldCheck className="text-5xl text-yellow-500" />
              </div>
              <h4 className="text-xl font-bold text-primary mb-4">{t("analysis.services.risk")}</h4>
              <p className="text-muted-foreground leading-relaxed">{t("analysis.services.risk.desc")}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center gap-16"
        >
          <div className="w-full lg:w-1/2">
            <div className="card p-10">
              <h3 className="text-3xl font-bold text-primary mb-6">Chỉ số Tài chính Cốt lõi</h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Phân tích sâu các chỉ số tài chính quan trọng như P/E, EPS, ROE, ROA và vốn hóa thị trường để đánh giá
                hiệu quả hoạt động và tiềm năng tăng trưởng của doanh nghiệp.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-muted p-6 rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-primary">P/E</div>
                  <div className="text-sm text-muted-foreground mt-1">Price-to-Earnings</div>
                </div>
                <div className="bg-muted p-6 rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-accent">ROE</div>
                  <div className="text-sm text-muted-foreground mt-1">Return on Equity</div>
                </div>
                <div className="bg-muted p-6 rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-primary">EPS</div>
                  <div className="text-sm text-muted-foreground mt-1">Earnings per Share</div>
                </div>
                <div className="bg-muted p-6 rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-accent">ROA</div>
                  <div className="text-sm text-muted-foreground mt-1">Return on Assets</div>
                </div>
              </div>
              <button
                onClick={() => openPDF("/path/to/finance.pdf")}
                className="btn-primary px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Xem báo cáo chi tiết
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="card p-8">
              <img
                src="/financial-analysis-charts-and-graphs.jpg"
                alt="Biểu đồ Phân tích"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col-reverse lg:flex-row items-center gap-16"
        >
          <div className="w-full lg:w-1/2">
            <div className="card p-8">
              <img
                src="/investment-recommendation-dashboard.jpg"
                alt="Biểu đồ Khuyến nghị"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="card p-10">
              <h3 className="text-3xl font-bold text-accent mb-6">Khuyến nghị & Tín hiệu</h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Đánh giá toàn diện triển vọng đầu tư dựa trên phân tích kỹ thuật, cơ bản và các tín hiệu thị trường quan
                trọng để đưa ra khuyến nghị đầu tư phù hợp.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-accent rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground text-lg">Phân tích xu hướng giá</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground text-lg">Đánh giá rủi ro</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-accent rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground text-lg">Dự báo giá mục tiêu</span>
                </div>
              </div>
              <button
                onClick={() => openPDF("/path/to/recommendation.pdf")}
                className="btn-accent px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Xem khuyến nghị chi tiết
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center gap-16"
        >
          <div className="w-full lg:w-1/2">
            <div className="card p-10">
              <h3 className="text-3xl font-bold text-primary mb-6">Mục tiêu Giá & Phân tích</h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Phân tích chuyên sâu giá mục tiêu dựa trên các mô hình định giá, xu hướng thị trường và các yếu tố cơ
                bản/kỹ thuật để đưa ra dự báo chính xác.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-muted p-6 rounded-xl shadow-sm text-center">
                  <div className="text-3xl font-bold text-primary">DCF</div>
                  <div className="text-sm text-muted-foreground mt-1">Discounted Cash Flow</div>
                </div>
                <div className="bg-muted p-6 rounded-xl shadow-sm text-center">
                  <div className="text-3xl font-bold text-accent">PEG</div>
                  <div className="text-sm text-muted-foreground mt-1">Price/Earnings Growth</div>
                </div>
              </div>
              <button
                onClick={() => openPDF("/path/to/price-analysis.pdf")}
                className="btn-primary px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Xem phân tích giá
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="card p-8">
              <img
                src="/valuation-models-and-price-targets.jpg"
                alt="Mô hình Định giá"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col-reverse lg:flex-row items-center gap-16"
        >
          <div className="w-full lg:w-1/2">
            <div className="card p-8">
              <img
                src="/business-overview-and-company-analysis.jpg"
                alt="Tổng quan Doanh nghiệp"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="card p-10">
              <h3 className="text-3xl font-bold text-accent mb-6">Mô tả Doanh nghiệp</h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Tổng quan chi tiết về hoạt động kinh doanh, chiến lược phát triển, thị trường mục tiêu và tiềm năng tăng
                trưởng của doanh nghiệp.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-accent rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground text-lg">Lịch sử phát triển</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground text-lg">Chiến lược kinh doanh</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-accent rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground text-lg">Thị trường mục tiêu</span>
                </div>
              </div>
              <button
                onClick={() => openPDF("/path/to/description.pdf")}
                className="btn-accent px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Xem mô tả chi tiết
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analysis
