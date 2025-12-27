
import React, { useState } from 'react';
import { GameState } from './types.ts';
import IntroScreen from './components/IntroScreen.tsx';
import Minesweeper from './components/Minesweeper.tsx';
import Sudoku from './components/Sudoku.tsx';
import BirthdayWish from './components/BirthdayWish.tsx';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTo = (nextState: GameState) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setGameState(nextState);
      setIsTransitioning(false);
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#f0f9ff] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 text-[#007FFF]/20 animate-float">
          <Sparkles size={100} />
        </div>
        <div className="absolute bottom-20 right-20 text-[#007FFF]/20 animate-float" style={{ animationDelay: '1.5s' }}>
          <Sparkles size={150} />
        </div>
        <div className="absolute top-1/2 left-20 text-[#007FFF]/10 animate-pulse">
          <div className="w-20 h-20 rounded-full bg-[#007FFF] opacity-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-700 transform ${isTransitioning ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
        {gameState === GameState.INTRO && (
          <IntroScreen onPlay={() => transitionTo(GameState.MINESWEEPER)} />
        )}
        {gameState === GameState.MINESWEEPER && (
          <Minesweeper onComplete={() => transitionTo(GameState.SUDOKU)} />
        )}
        {gameState === GameState.SUDOKU && (
          <Sudoku onComplete={() => transitionTo(GameState.WISH)} />
        )}
        {gameState === GameState.WISH && (
          <BirthdayWish />
        )}
      </div>

      {/* Header Label */}
      <div className="fixed top-6 text-center z-10 w-full">
        <h1 className="text-4xl md:text-5xl font-formal text-[#007FFF] drop-shadow-sm tracking-widest">
          RANIGANJ
        </h1>
      </div>
    </div>
  );
};

export default App;
