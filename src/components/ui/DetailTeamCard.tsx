import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export interface Member {
  name: string;
  title: string;
  image: string;
  description?: string;
  experience?: string;
  strengths?: string[];
  achievements?: string[];
  education?: string;
  linkedin?: string;
  email?: string;
}

interface MemberModalProps {
  open: boolean;
  onClose: () => void;
  member: Member;
}

const MemberModal: React.FC<MemberModalProps> = ({ open, onClose, member }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [open, onClose]);

  // Minimal modal: only name, role and one long introduction paragraph
  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
        aria-labelledby="member-modal-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          ref={dialogRef}
          className="relative w-full max-w-6xl max-h-[90vh] min-h-[70vh] overflow-hidden bg-white shadow-2xl rounded-xl"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <motion.button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute right-6 top-6 z-10 w-10 h-10 rounded-full bg-gray-200/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          <div className="flex flex-col lg:flex-row h-full">
            {/* Ảnh bên trái */}
            <div className="lg:w-1/3 relative bg-gray-200 hidden sm:block">
              <div className="absolute inset-0 flex items-center justify-center w-full h-full">
                <img
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover object-center mt-10"
                  onError={(e) => {
                    // Image failed to load
                  }}
                  onLoad={() => {
                    // Image loaded successfully
                  }}
                />
              </div>
            </div>

            {/* Thông tin bên phải */}
            <div className="w-full lg:w-2/3 p-5 sm:p-8 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex flex-col">
              <div className="pb-8">
                <h2 
                  id="member-modal-title" 
                  className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
                >
                  {member.name}
                </h2>
                <p className="text-lg sm:text-xl text-blue-600 font-semibold mb-4">
                  {member.title}
                </p>
                {member.description && (
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                    {member.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default MemberModal;
