import Video from "../../assets/images/Saigon.mp4";

interface SlideProps {
  className?: string;
}

const Slide: React.FC<SlideProps> = ({ className }) => {
  return (
    <div className={`relative w-screen h-screen ${className}`}>
      <video
        className="w-full h-full object-cover"
        src={Video}
        autoPlay
        muted
        loop
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
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