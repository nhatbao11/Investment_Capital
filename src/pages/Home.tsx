import React from "react";
import Slide from "../components/Layout/Slide";
import { HiOutlineChevronDoubleDown } from "react-icons/hi";
import Vechungtoi from "../assets/images/vechungtoi.jpg";

const Home: React.FC = () => {
  const scrollToNext = () => {
    document.getElementById("below-hero")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white overflow-x-hidden">
      <div className="relative h-screen">
        <Slide className="-mt-px" />
        <button
          onClick={scrollToNext}
          aria-label="Cuộn xuống"
          className="absolute left-1/2 -translate-x-1/2 bottom-20 md:bottom-24 group"
        >
          <HiOutlineChevronDoubleDown
            className="text-blue-900 text-5xl animate-bounce drop-shadow-lg"
          />
        </button>
      </div>

      <section id="below-hero" className="h-screen bg-white flex items-start justify-center pt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-6 animate-fade-in transform -translate-y-20">CHÀO MỪNG ĐẾN VỚI Y&T CAPITAL</h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed transform -translate-y-20">
            Khám phá cơ hội đầu tư cùng chúng tôi - nơi kết nối tài chính và đổi mới để xây dựng tương lai bền vững.
          </p>
          <div className="w-full h-full">
            <img
              src={Vechungtoi}
              alt="Y&T Capital Overview"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;