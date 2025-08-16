import React from "react";

interface TeamCardProps {
  name: string;
  title: string;
  image: string;
  onClick?: () => void; 
}

const TeamCard: React.FC<TeamCardProps> = ({ name, title, image, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full text-left flex flex-col items-center bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <img
  src={image}
  alt={name}
  className="w-40 h-40 rounded-xl border-4 border-gray-700 shadow-md object-cover group-hover:scale-105 transition-transform duration-300"
/>

      <div className="mt-4 text-center">
        <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
          {name}
        </h4>
        <p className="text-sm text-gray-400">{title}</p>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </button>
  );
};

export default TeamCard;
