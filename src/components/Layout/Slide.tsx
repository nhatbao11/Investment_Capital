import Video from "../../assets/images/Saigon.mp4";

interface SlideProps {
  className?: string;
}

const Slide: React.FC<SlideProps> = ({ className }) => {
  return (
    <div className={`relative w-screen h-screen ${className}`}>
      <video
        className="w-full h-[80vh] object-cover"
        src={Video}
        autoPlay
        muted
        loop
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white -translate-y-20">
  <h1 className="text-5xl md:text-7xl font-bold tracking-wide text-gray-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    Y&T TECH & SERVICES INVESTORS
  </h1>
  <p className="text-2xl md:text-3xl mt-4 text-gray-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
Shaping Tomorrow Through Agile Innovation  </p>
</div>

    </div>
  );
};

export default Slide;