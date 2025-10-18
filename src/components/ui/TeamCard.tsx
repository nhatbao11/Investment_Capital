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
      className="group relative w-full text-left flex flex-col items-center bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <div className="relative w-48 h-48 border-4 border-gray-200 shadow-md overflow-hidden group-hover:scale-105 transition-transform duration-300 mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Image failed to load:', image);
            console.error('Error details:', e);
          }}
          onLoad={() => {

          }}
        />
      </div>

      <div className="text-center">
        <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
          {name}
        </h4>
        <p className="text-sm text-gray-600">{title}</p>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </button>
  );
};

export default TeamCard;
