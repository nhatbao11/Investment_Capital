import React, { useRef, useEffect, useState, type JSX } from "react";
import investmentData from "../data/tab5.json";

const Investment: React.FC = () => {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Hàm tạo ID duy nhất và hiển thị mã định danh
  const generateKey = (chapter: string, section?: string, subsection?: string) => {
    return [chapter, section, subsection].filter(Boolean).join(".");
  };

  // Hàm cuộn mượt đến section
  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId];
    if (section) {
      const headerHeight = 50;
      const bannerHeight = 300;
      const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: sectionPosition - headerHeight - bannerHeight,
        behavior: "smooth",
      });
    }
  };

  // Intersection Observer để highlight menu
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = (entry.target as HTMLDivElement).id;
            const navLinks = document.querySelectorAll("nav button");
            navLinks.forEach((link) => {
              link.classList.remove("underline", "text-white");
              link.classList.add("text-gray-300");
            });
            const activeLink = Array.from(navLinks).find(
              (link) => link.textContent === sectionId
            );
            if (activeLink) {
              activeLink.classList.add("underline", "text-white");
              activeLink.classList.remove("text-gray-300");
            }
          }
        });
      },
      { threshold: [0.3, 0.5, 0.7], rootMargin: "-150px 0px 0px 0px" }
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

  // Hàm render heading động với mã định danh
  const DynamicHeading = ({
    level,
    code,
    children,
  }: {
    level: number;
    code: string;
    children: React.ReactNode;
  }) => {
    const Tag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
    return (
      <Tag className={`font-semibold ${level === 1 ? "text-2xl text-black" : level === 2 ? "text-xl text-blue-900" : "text-sm text-black"}`}>
        {code} {children}
      </Tag>
    );
  };

  // Hàm render nội dung, bỏ key như introduction, main_content
  const renderContent = (data: any, level: number = 1, parentKey: string = "") => {
    if (!data) return null;

    if (typeof data === "string") {
      return <p className="text-gray-700 text-base leading-relaxed">{data}</p>;
    } else if (Array.isArray(data)) {
      return (
        <ul className="list-disc ml-6 space-y-2">
          {data.map((item, index) => (
            <li key={`${parentKey}.${index}`} className="text-gray-700 text-base leading-relaxed">
              {typeof item === "string" ? item : renderContent(item, level + 1, `${parentKey}.${index}`)}
            </li>
          ))}
        </ul>
      );
    } else if (typeof data === "object" && data !== null) {
      return (
        <div className="space-y-2">
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
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div className="relative w-full h-[300px] bg-gray-800 text-white flex items-center justify-center">
        <h1 className="text-5xl font-bold">Giải pháp đầu tư</h1>
        <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1200x300')] bg-cover bg-center opacity-50"></div>
      </div>

      {/* Thanh menu điều hướng */}
      <nav className="bg-gray-600 text-white sticky top-[50px] w-full z-40 shadow-md">
        <ul className="flex flex-wrap justify-start space-x-4 p-2 w-full">
          {investmentData.chapters.map((chapter) => (
            <li key={chapter.chapter}>
              <button
                onClick={() => scrollToSection(chapter.title)}
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 hover:bg-blue-500 text-gray-300"
              >
                {chapter.chapter} {chapter.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Nội dung chính */}
      <div className="pt-6 px-1 w-full">
        {investmentData.chapters.map((chapter, chapterIndex) => (
          <section
            key={chapter.chapter}
            id={chapter.title}
            ref={(el: HTMLDivElement | null) => {
              sectionRefs.current[chapter.title] = el;
            }}
            className={`p-2 rounded-lg shadow-md ${sectionColors[chapterIndex % sectionColors.length]}`}
          >
            <DynamicHeading level={1} code={chapter.chapter}>
              {chapter.title}
            </DynamicHeading>
            {chapter.sections.map((section) => (
              <div
                key={section.section}
                id={generateKey(chapter.chapter, section.section)}
                ref={(el: HTMLDivElement | null) => {
                  sectionRefs.current[generateKey(chapter.chapter, section.section)] = el;
                }}
                className="mt-3"
              >
                <DynamicHeading level={2} code={section.section}>
                  {section.title}
                </DynamicHeading>
                <div className="mt-2 space-y-2">
                  {section.subsections ? (
                    section.subsections.map((subsection) => (
                      <div
                        key={subsection.subsection}
                        id={generateKey(chapter.chapter, section.section, subsection.subsection)}
                        ref={(el: HTMLDivElement | null) => {
                          sectionRefs.current[generateKey(chapter.chapter, section.section, subsection.subsection)] = el;
                        }}
                        className="mt-2"
                      >
                        <button
                          onClick={() =>
                            setExpandedSections((prev) => ({
                              ...prev,
                              [generateKey(chapter.chapter, section.section, subsection.subsection)]: !prev[
                                generateKey(chapter.chapter, section.section, subsection.subsection)
                              ],
                            }))
                          }
                          className="flex items-center w-full text-left font-medium hover:underline text-black hover:text-blue-900 focus:outline-none text-sm"
                        >
                          <span className="mr-2">{subsection.subsection} {subsection.title}</span>
                          <span>
                            {expandedSections[generateKey(chapter.chapter, section.section, subsection.subsection)]
                              ? "▼"
                              : "▶"}
                          </span>
                        </button>
                        {expandedSections[generateKey(chapter.chapter, section.section, subsection.subsection)] && (
                          <div className="ml-6 mt-2 space-y-2">
                            {renderContent(subsection.content, 3, generateKey(chapter.chapter, section.section, subsection.subsection))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          setExpandedSections((prev) => ({
                            ...prev,
                            [generateKey(chapter.chapter, section.section)]: !prev[generateKey(chapter.chapter, section.section)],
                          }))
                        }
                        className="flex items-center w-full text-left font-medium hover:underline text-black hover:text-blue-900 focus:outline-none text-sm"
                      >
                        <span className="mr-2">{section.section} {section.title}</span>
                        <span>
                          {expandedSections[generateKey(chapter.chapter, section.section)] ? "▼" : "▶"}
                        </span>
                      </button>
                      {expandedSections[generateKey(chapter.chapter, section.section)] && (
                        <div className="ml-6 mt-2 space-y-2">
                          {renderContent(section.content, 3, generateKey(chapter.chapter, section.section))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
};

// Mảng màu nền cho các section
const sectionColors = ["bg-white", "bg-gray-50", "bg-white"];

export default Investment;