
import React from 'react';
import { Play, Heart } from 'lucide-react';

interface IntroScreenProps {
  onPlay: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onPlay }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      <div className="relative">
        <div className="absolute -top-12 -left-12 text-pink-400 animate-bounce">
          <Heart fill="currentColor" size={40} />
        </div>
        <div className="absolute -bottom-8 -right-8 text-pink-400 animate-bounce" style={{ animationDelay: '0.5s' }}>
          <Heart fill="currentColor" size={30} />
        </div>
        
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
            Hey Beautiful! Let's play a game.
          </h2>
        </div>
      </div>

      <button
        onClick={onPlay}
        className="group relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-[#007FFF] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce-slow"
      >
        <Play size={48} fill="currentColor" className="ml-2 group-hover:scale-125 transition-transform" />
      </button>
      <span className="absolute -bottom-10 font-bold text-[#007FFF] text-xl opacity-0 group-hover:opacity-100 transition-opacity">
          Let's Start!
      </span>
    </div>
  );
};

export default IntroScreen;
