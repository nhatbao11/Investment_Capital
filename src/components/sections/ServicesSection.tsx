"use client"

import type React from "react"
import { motion } from "framer-motion"
import { HiChartBar, HiTrendingUp, HiShieldCheck, HiLightBulb } from "react-icons/hi"
import Card from "../ui/Card"
import Heading from "../ui/Heading"
import Text from "../ui/Text"
import Icon from "../ui/Icon"
import Button from "../ui/Button"
import Container from "../ui/Container"
import Grid from "../ui/Grid"

const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: HiChartBar,
      title: "Phân tích doanh nghiệp",
      description: "Đánh giá toàn diện tình hình tài chính, kinh doanh và tiềm năng phát triển của doanh nghiệp.",
      features: ["Phân tích tài chính", "Đánh giá rủi ro", "Dự báo xu hướng", "Báo cáo chi tiết"],
      color: "blue"
    },
    {
      icon: HiTrendingUp,
      title: "Phân tích ngành",
      description: "Nghiên cứu sâu về các ngành nghề, xu hướng thị trường và cơ hội đầu tư tiềm năng.",
      features: ["Nghiên cứu thị trường", "Phân tích cạnh tranh", "Dự báo ngành", "Cơ hội đầu tư"],
      color: "yellow"
    },
    {
      icon: HiShieldCheck,
      title: "Quản lý rủi ro",
      description: "Xây dựng chiến lược quản lý rủi ro hiệu quả, đảm bảo an toàn cho danh mục đầu tư.",
      features: ["Đánh giá rủi ro", "Chiến lược phòng ngừa", "Giám sát liên tục", "Báo cáo rủi ro"],
      color: "blue"
    },
    {
      icon: HiLightBulb,
      title: "Tư vấn đầu tư",
      description: "Cung cấp lời khuyên chuyên sâu về các cơ hội đầu tư phù hợp với mục tiêu tài chính.",
      features: ["Tư vấn cá nhân", "Lập kế hoạch đầu tư", "Theo dõi hiệu suất", "Điều chỉnh chiến lược"],
      color: "yellow"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-yellow-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Heading level={2} align="center" color="blue" className="mb-4">
            Dịch vụ của chúng tôi
          </Heading>
          <Text size="lg" color="muted" align="center" className="max-w-3xl mx-auto">
            Chúng tôi cung cấp đầy đủ các dịch vụ tài chính chuyên nghiệp, 
            từ phân tích đến tư vấn đầu tư, giúp bạn đưa ra quyết định thông minh.
          </Text>
        </motion.div>

        <Grid cols={2} gap="lg" animated>
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card variant="elevated" padding="lg" className="h-full group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Icon
                      icon={service.icon}
                      size="xl"
                      color={service.color as any}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <Heading level={4} className="mb-3">
                      {service.title}
                    </Heading>
                    <Text color="muted" className="mb-4">
                      {service.description}
                    </Text>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="outline"
                      size="sm"
                      href="/contact"
                      className="w-full sm:w-auto"
                    >
                      Tìm hiểu thêm
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </Grid>
      </Container>
    </section>
  )
}

export default ServicesSection

