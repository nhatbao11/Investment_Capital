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
  
  // console.log('DetailTeamCard MemberModal rendering:', { 
  //   open, 
  //   member: {
  //     name: member.name,
  //     title: member.title,
  //     image: member.image
  //   }
  // });

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

  // Mock data for demonstration - in real app, this would come from props or API
  const memberData = {
    ...member,
    experience: member.experience || "15+ năm kinh nghiệm trong lĩnh vực tài chính và đầu tư",
    strengths: member.strengths || ["Lãnh đạo chiến lược", "Phân tích tài chính", "Quản lý rủi ro", "Phát triển kinh doanh"],
    achievements: member.achievements || [
      "Thành lập và phát triển 3 công ty thành công",
      "Quản lý danh mục đầu tư trị giá 500+ tỷ VNĐ",
      "Được vinh danh Top 100 CEO trẻ tiềm năng 2023"
    ],
    education: member.education || "Thạc sĩ Tài chính - Đại học Kinh tế TP.HCM",
    linkedin: member.linkedin || "linkedin.com/in/example",
    email: member.email || "example@ytcapital.com"
  };

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
          className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white shadow-2xl rounded-xl"
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
                    console.error('DetailTeamCard image failed to load:', member.image);
                    console.error('Error details:', e);
                  }}
                  onLoad={() => {
                    console.log('DetailTeamCard image loaded successfully:', member.image);
                  }}
                />
              </div>
            </div>

            {/* Thông tin bên phải */}
            <div className="w-full lg:w-2/3 p-5 sm:p-8 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="space-y-6 pb-8">
                <div>
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
                    <p className="text-gray-700 leading-relaxed text-base">
                      {member.description}
                    </p>
                  )}
                </div>

                {/* Content sections */}
                <div className="space-y-6">
                  {/* Experience */}
                  <div className="bg-blue-50 p-4 sm:p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-blue-900">Kinh nghiệm</h3>
                    </div>
                    <p className="text-gray-700">{memberData.experience}</p>
                  </div>

                  {/* Education */}
                  <div className="bg-yellow-50 p-4 sm:p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-yellow-800">Học vấn</h3>
                    </div>
                    <p className="text-gray-700">{memberData.education}</p>
                  </div>

                  {/* Strengths */}
                  <div className="bg-green-50 p-4 sm:p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-green-800">Thế mạnh</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {memberData.strengths.map((strength, index) => (
                        <div key={`strength-${index}-${strength}`} className="flex items-center gap-2 bg-white/60 p-2 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="bg-purple-50 p-4 sm:p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-purple-800">Thành tựu nổi bật</h3>
                    </div>
                    <div className="space-y-2">
                      {memberData.achievements.map((achievement, index) => (
                        <div key={`achievement-${index}-${achievement}`} className="flex items-start gap-3 bg-white/60 p-3 rounded-lg">
                          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                          <span className="text-gray-700 text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Thông tin liên hệ</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-gray-700 text-sm">{memberData.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </div>
                        <a href={`https://${memberData.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors text-sm">
                          LinkedIn Profile
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
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
