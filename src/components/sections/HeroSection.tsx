"use client"

import type React from "react"
import { motion } from "framer-motion"
import Button from "../ui/Button"
import Heading from "../ui/Heading"
import Text from "../ui/Text"
import Container from "../ui/Container"

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <Container size="xl" className="relative z-10">
        <div className="text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heading level={1} align="center" color="blue" className="mb-6">
              Y&T Group
            </Heading>
            <Heading level={2} align="center" color="default" className="mb-4 whitespace-nowrap">
              Shaping Tomorrow Through Agile Innovation
            </Heading>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Text size="xl" color="muted" align="center" className="max-w-3xl mx-auto">
              Nơi kết nối tài chính và đổi mới để xây dựng tương lai bền vững. 
              Chúng tôi mang đến những giải pháp đầu tư thông minh và cơ hội phát triển vượt trội.
            </Text>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="primary"
              size="lg"
              href="/investment"
              className="w-full sm:w-auto"
            >
              Khám phá giải pháp
            </Button>
            <Button
              variant="outline"
              size="lg"
              href="/about"
              className="w-full sm:w-auto"
            >
              Tìm hiểu thêm
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">500+</div>
              <div className="text-gray-600">Dự án đầu tư</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">50+</div>
              <div className="text-gray-600">Đối tác tin cậy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">10+</div>
              <div className="text-gray-600">Năm kinh nghiệm</div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

export default HeroSection

