import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import investmentData from "../data/tab5.json";
import PageHeader from "../components/ui/PageHeader";
import giaiphapdautu from '../assets/images/giaiphapdautu.jpg';

const Investment: React.FC = () => {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeChapter, setActiveChapter] = useState<string>("");
  const location = useLocation();

  // Hàm tạo ID duy nhất và hiển thị mã định danh
  const generateKey = (chapter: string, section?: string, subsection?: string) => {
    return [chapter, section, subsection].filter(Boolean).join(".");
  };

  // Hàm cuộn mượt đến section
  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId];
    if (section) {
      const headerHeight = 80;
      const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: sectionPosition - headerHeight,
        behavior: "smooth",
      });
    }
  };

  // Set active chapter via IntersectionObserver
  useEffect(() => {
    const chapterTitles = new Set(investmentData.chapters.map((c: any) => c.title));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = (entry.target as HTMLDivElement).id;
            if (chapterTitles.has(sectionId)) {
              setActiveChapter(sectionId);
            }
          }
        });
      },
      { threshold: [0.3, 0.5, 0.7], rootMargin: "-100px 0px 0px 0px" }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el instanceof HTMLDivElement) {
        observer.observe(el);
      }
    });

    return () => {
      Object.values(sectionRefs.current).forEach((el) => {
        if (el instanceof HTMLDivElement) {
          observer.unobserve(el);
        }
      });
    };
  }, []);

  // Hỗ trợ cuộn theo hash khi vào trang hoặc khi hash thay đổi
  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.replace(/^#/, ""));
      // slight delay to ensure refs are set
      setTimeout(() => scrollToSection(id), 0);
    }
  }, [location.hash]);

  // Hàm render nội dung
  const renderContent = (data: any, level: number = 1, parentKey: string = "") => {
    if (!data) return null;

    if (typeof data === "string") {
      return <p className="text-gray-700 text-base leading-relaxed mb-4">{data}</p>;
    } else if (Array.isArray(data)) {
      return (
        <ul className="list-disc ml-6 space-y-2 mb-4">
          {data.map((item, index) => (
            <li key={`${parentKey}.${index}`} className="text-gray-700 text-base leading-relaxed">
              {typeof item === "string" ? item : renderContent(item, level + 1, `${parentKey}.${index}`)}
            </li>
          ))}
        </ul>
      );
    } else if (typeof data === "object" && data !== null) {
      return (
        <div className="space-y-2 mb-4">
          {Object.values(data).flatMap((value, index) => {
            const currentKey = `${parentKey}.${index}`;
            if (typeof value === "string") {
              return (
                <p key={currentKey} className="text-gray-700 text-base leading-relaxed">
                  {value}
                </p>
              );
            } else if (Array.isArray(value)) {
              return (
                <ul key={currentKey} className="list-disc ml-6 space-y-2">
                  {value.map((item, subIndex) => (
                    <li key={`${currentKey}.${subIndex}`} className="text-gray-700 text-base leading-relaxed">
                      {typeof item === "string" ? item : renderContent(item, level + 1, `${currentKey}.${subIndex}`)}
                    </li>
                  ))}
                </ul>
              );
            } else if (typeof value === "object") {
              return <div key={currentKey} className="space-y-2">{renderContent(value, level + 1, currentKey)}</div>;
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <PageHeader
        title="Giải pháp đầu tư"
        subtitle="Hệ thống kiến thức toàn diện về đầu tư tài chính và quản lý rủi ro"
        // backgroundClass="bg-gradient-to-br from-blue-900 to-blue-700"
        backgroundImage={giaiphapdautu}
      />

      {/* Navigation Menu */}
      <nav className="bg-white border-b border-gray-200 sticky top-[60px] w-full z-40 shadow-sm">
  <div className="w-full px-4">
    <div className="flex flex-wrap justify-start gap-2 py-4">
      {investmentData.chapters.map((chapter) => (
        <button
          key={chapter.chapter}
          onClick={() => {
            setActiveChapter(chapter.title); // Cập nhật activeChapter
            scrollToSection(chapter.title); // Cuộn đến section
          }}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap ${
            activeChapter === chapter.title
              ? "bg-yellow-500 text-white"
              : "text-blue-900 hover:bg-yellow-300"
          }`}
        >
          {chapter.chapter} {chapter.title}
        </button>
      ))}
    </div>
  </div>
</nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {investmentData.chapters.map((chapter, chapterIndex) => (
          <motion.section
            key={chapter.chapter}
            id={chapter.title}
            ref={(el: HTMLDivElement | null) => {
              sectionRefs.current[chapter.title] = el;
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`mb-12 ${
              chapterIndex % 2 === 0 
                ? "bg-gradient-to-br from-blue-50 to-blue-100" 
                : "bg-gradient-to-br from-yellow-50 to-yellow-100"
            }`}
          >
            {/* Chapter Header */}
            <div className="p-8 border-b-2 border-white/50">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  chapterIndex % 2 === 0 ? "bg-blue-900" : "bg-yellow-500"
                }`}>
                  {chapter.chapter}
                </div>
                <h2 className="text-3xl font-bold text-blue-900">
                  {chapter.title}
                </h2>
              </div>
            </div>

            {/* Chapter Content */}
            <div className="p-8">
              {chapter.sections.map((section) => (
                <div
                  key={section.section}
                  id={generateKey(chapter.chapter, section.section)}
                  ref={(el: HTMLDivElement | null) => {
                    sectionRefs.current[generateKey(chapter.chapter, section.section)] = el;
                  }}
                  className="mb-8"
                >
                  {/* Section Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-blue-800 mb-2">
                      {section.section}. {section.title}
                    </h3>
                    <div className={`w-16 h-1 rounded-full ${
                      chapterIndex % 2 === 0 ? "bg-blue-600" : "bg-yellow-500"
                    }`}></div>
                  </div>

                  {/* Section Content */}
                  <div className="space-y-6">
                    {section.subsections ? (
                      section.subsections.map((subsection) => (
                        <div
                          key={subsection.subsection}
                          id={generateKey(chapter.chapter, section.section, subsection.subsection)}
                          ref={(el: HTMLDivElement | null) => {
                            sectionRefs.current[generateKey(chapter.chapter, section.section, subsection.subsection)] = el;
                          }}
                          className="bg-white/70 p-6 rounded-xl shadow-sm"
                        >
                          <h4 className="text-xl font-semibold text-blue-700 mb-4">
                            {subsection.subsection}. {subsection.title}
                          </h4>
                          <div className="prose prose-lg max-w-none">
                            {renderContent(subsection.content, 3, generateKey(chapter.chapter, section.section, subsection.subsection))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white/70 p-6 rounded-xl shadow-sm">
                        <div className="prose prose-lg max-w-none">
                          {renderContent(section.content, 2, generateKey(chapter.chapter, section.section))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
};

export default Investment;
