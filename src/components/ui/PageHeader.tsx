import React from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string; // ảnh nền
  height?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backgroundImage,
  height = "h-[50vh] sm:h-[60vh] md:h-[70vh]",
}) => {
  return (
    <div className={`relative w-full ${height}`}>
      {/* Ảnh nền */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Overlay tối nhẹ */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Nội dung */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white px-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PageHeader;
