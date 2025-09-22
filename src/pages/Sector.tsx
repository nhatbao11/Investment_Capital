"use client"

import type React from "react"
import { motion } from "framer-motion"
import { HiOfficeBuilding, HiDesktopComputer, HiCog, HiHome } from "react-icons/hi"
import PageHeader from "../components/ui/PageHeader"
import phantichnganh from "../assets/images/phantichnganh.png"
import { useLanguage } from "../contexts/LanguageContext"

const Sector: React.FC = () => {
  const { t } = useLanguage()

  const openPDF = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank")
  }

  const sectors = [
    {
      id: "banking",
      title: t("sector.categories.banking"),
      description: t("sector.categories.banking.desc"),
      accent: false,
      icon: <HiOfficeBuilding className="text-5xl text-blue-900" />,
      metrics: ["Lãi suất", "Tỷ lệ nợ xấu", "Vốn hóa", "ROE"],
    },
    {
      id: "technology",
      title: t("sector.categories.technology"),
      description: t("sector.categories.technology.desc"),
      accent: false,
      icon: <HiDesktopComputer className="text-5xl text-yellow-500" />,
      metrics: ["R&D", "Tăng trưởng", "Đổi mới", "Thị phần"],
    },
    {
      id: "manufacturing",
      title: t("sector.categories.manufacturing"),
      description: t("sector.categories.manufacturing.desc"),
      accent: false,
      icon: <HiCog className="text-5xl text-blue-900" />,
      metrics: ["Năng suất", "Chi phí", "Chuỗi cung ứng", "Tự động hóa"],
    },
    {
      id: "realestate",
      title: t("sector.categories.realestate"),
      description: t("sector.categories.realestate.desc"),
      accent: false,
      icon: <HiHome className="text-5xl text-yellow-500" />,
      metrics: ["Giá BĐS", "Thanh khoản", "Quy hoạch", "Đầu tư"],
    },
  ]

  return (
    <div className="bg-background text-foreground min-h-screen">
      <PageHeader title={t("sector.hero.title")} subtitle={t("sector.hero.subtitle")} backgroundImage={phantichnganh} />

      <div className="max-w-7xl mx-auto py-24 px-6 lg:px-8 space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-8">{t("sector.intro.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t("sector.intro.description")}
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
            {t("sector.categories.title")}
          </h3>
        </motion.div>

        {sectors.map((sector, index) => (
          <motion.div
            key={sector.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
          >
            <div className="w-full lg:w-1/2">
              <div className="card p-10">
                <div className="flex items-center mb-8">
                  <div className={`mr-6 ${sector.accent ? "text-accent" : "text-primary"}`}>{sector.icon}</div>
                  <h3 className={`text-3xl font-bold ${sector.accent ? "text-accent" : "text-primary"}`}>
                    {sector.title}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{sector.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {sector.metrics.map((metric, idx) => (
                    <div key={idx} className="bg-muted p-4 rounded-xl shadow-sm text-center">
                      <div className={`text-sm font-semibold ${sector.accent ? "text-accent" : "text-primary"}`}>
                        {metric}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => openPDF(`/path/to/${sector.id}-sector.pdf`)}
                  className={`px-8 py-4 rounded-xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl ${
                    sector.accent ? "btn-accent" : "btn-primary"
                  }`}
                >
                  Xem báo cáo ngành
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="card p-8">
                <img
                  src={`/${sector.id}-sector-analysis.jpg`}
                  alt={`Biểu đồ ${sector.title}`}
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Sector
