"use client"

import type React from "react"
import { motion } from "framer-motion"
import { StaticImageData } from "next/image"

interface PageHeaderProps {
  title: string
  subtitle?: string
  backgroundImage?: string | StaticImageData // ảnh nền
  height?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, backgroundImage, height = "h-100" }) => {
  return (
    <div className={`relative w-full ${height} overflow-hidden`}>
      {/* Ảnh nền */}
      {backgroundImage && (
        <img
          src={typeof backgroundImage === "string" ? backgroundImage : backgroundImage?.src || "/placeholder.svg"}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            aspectRatio: '16/9',
            minHeight: '400px',
            maxHeight: '600px'
          }}
          loading="eager"
          fetchPriority="high"
        />
      )}

      {/* Overlay tối nhẹ */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Nội dung */}
      <div className="absolute inset-0 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white w-full -mt-2"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl leading-relaxed font-semibold max-w-4xl text-left text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
              <span className="text-white font-bold">{title}</span>
              {subtitle ? (
                <>
                  <br />
                  <span className="text-slate-100 font-medium">{subtitle}</span>
                </>
              ) : null}
            </h1>
          </div>



        </motion.div>
      </div>
    </div>
  )
}

export default PageHeader
