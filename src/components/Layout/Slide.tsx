// Removed import for Next.js compatibility

interface SlideProps {
  className?: string;
}

const Slide: React.FC<SlideProps> = ({ className }) => {
  return (
    <div className={`relative w-full ${className || ''}`}>
      <div className="relative w-full aspect-[16/9] sm:aspect-[16/9] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/images/Saigon.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white pointer-events-none">
        {/* <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 sm:p-12 max-w-4xl mx-4"> */}
          {/* <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Y&T TECH & SERVICES INVESTORS
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl mt-4 text-gray-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Shaping Tomorrow Through Agile Innovation
          </p> */}
        </div>
      {/* </div> */}
    </div>
  );
};

export default Slide;