
import React from 'react';
import { Gift, ExternalLink, Heart } from 'lucide-react';

const BirthdayWish: React.FC = () => {
  // Placeholder link as requested - User should replace this string
  const DRIVE_LINK = "https://drive.google.com/thumbnail?id=1HxpM0CDZ2Zi1VaNokYVmgGcVkZgt7Jed&sz=w1000";

  return (
    <div className="glass-card p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center space-y-8 max-w-lg w-full">
      <div className="relative">
        <div className="absolute -top-6 -left-6 text-pink-500 animate-pulse">
           <Heart fill="currentColor" size={40} />
        </div>
        <div className="absolute -top-6 -right-6 text-[#007FFF] animate-pulse">
           <Heart fill="currentColor" size={40} />
        </div>
        <Gift size={80} className="text-[#007FFF] animate-bounce" />
      </div>

      <div className="space-y-4">
        <h2 className="text-4xl font-pacifico text-[#007FFF]">Happy Birthday!</h2>
        <p className="text-xl text-gray-700 leading-relaxed font-semibold">
          You've conquered the games and proved your brilliance! 
          Now for the most important part of the day...
        </p>
      </div>

      <div className="bg-[#007FFF]/10 p-6 rounded-2xl w-full">
        <div className="bg-[#007FFF]/10 p-6 rounded-2xl w-full">
  <div className="image-container shadow-lg border-4 border-[#007FFF]/20">
    <img 
      src={DRIVE_LINK} 
      alt="Final Message" 
      className="w-full h-auto" // Optional: ensures image fits container
    />
  </div>
</div>
      </div>

      <div className="text-gray-400 text-sm">
        I love you so much Dikshu🩵
      </div>
    </div>
  );
};

export default BirthdayWish;
