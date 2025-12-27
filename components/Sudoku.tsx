
import React, { useState, useMemo } from 'react';
import { Delete, ChevronRight, Heart } from 'lucide-react';

interface SudokuProps {
  onComplete: () => void;
}

// USER: Update this URL with your Google Drive direct image link
const SUDOKU_PHOTO = "https://drive.google.com/thumbnail?id=1315YMCH4vAP--tWgHPteS9secExeYhjZ&sz=w1000";

const Sudoku: React.FC<SudokuProps> = ({ onComplete }) => {
  const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ];

  const initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  const [board, setBoard] = useState<number[][]>(initialBoard.map(row => [...row]));
  const [won, setWon] = useState(false);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  const numberCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 9; i++) counts[i] = 0;
    board.flat().forEach(val => {
      if (val !== 0) counts[val]++;
    });
    return counts;
  }, [board]);

  const highlightedNumber = useMemo(() => {
    if (!selectedCell) return null;
    const [r, c] = selectedCell;
    const val = board[r][c];
    return val !== 0 ? val : null;
  }, [selectedCell, board]);

  const updateCellValue = (r: number, c: number, num: number) => {
    if (won || initialBoard[r][c] !== 0) return;

    const newBoard = [...board.map(row => [...row])];
    newBoard[r][c] = num;
    setBoard(newBoard);

    if (JSON.stringify(newBoard) === JSON.stringify(solution)) {
      setWon(true);
    }
  };

  const handleKeyPress = (num: number) => {
    if (selectedCell) {
      updateCellValue(selectedCell[0], selectedCell[1], num);
    }
  };

  const handleBackspace = () => {
    if (selectedCell) {
      updateCellValue(selectedCell[0], selectedCell[1], 0);
    }
  };

  const getButtonStyle = (num: number) => {
    const count = numberCounts[num] || 0;
    const isCompleted = count >= 9;
    const opacity = isCompleted ? 0 : 1 - (count * 0.1);
    
    return {
      opacity: opacity,
      pointerEvents: isCompleted ? 'none' as const : 'auto' as const,
      cursor: isCompleted ? 'default' : 'pointer'
    };
  };

  return (
    <div className="relative glass-card p-4 md:p-6 rounded-3xl shadow-xl flex flex-col items-center space-y-6 max-w-md w-full no-select">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#007FFF]">Quest 2: Sudoku</h3>
        <p className="text-sm text-gray-500">The final puzzle before the surprise! ✨</p>
      </div>

      <div className="grid grid-cols-9 border-2 border-[#007FFF] bg-white overflow-hidden rounded-lg shadow-inner">
        {board.map((row, r) => (
          row.map((cell, c) => {
            const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
            const isHighlighted = highlightedNumber !== null && cell === highlightedNumber;
            
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => setSelectedCell([r, c])}
                className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-sm md:text-lg font-bold cursor-pointer transition-colors border border-[#007FFF]/10
                  ${initialBoard[r][c] !== 0 ? 'bg-gray-100 text-gray-400' : 'text-[#007FFF]'}
                  ${isHighlighted ? 'bg-blue-100' : 'hover:bg-blue-50'}
                  ${isSelected ? 'bg-blue-300 !text-white scale-110 z-10' : ''}
                  ${(r + 1) % 3 === 0 && r < 8 ? 'border-b-2 border-b-[#007FFF]' : ''}
                  ${(c + 1) % 3 === 0 && c < 8 ? 'border-r-2 border-r-[#007FFF]' : ''}
                `}
              >
                {cell === 0 ? '' : cell}
              </div>
            );
          })
        ))}
      </div>

      {/* Numeric Keypad */}
      <div className="w-full space-y-2">
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              disabled={numberCounts[num] >= 9}
              style={getButtonStyle(num)}
              className={`py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-md text-lg 
                ${highlightedNumber === num ? 'bg-blue-600 text-white scale-105 ring-2 ring-blue-300' : 'bg-[#007FFF] text-white'}
                ${numberCounts[num] >= 9 ? 'opacity-0 cursor-default' : ''}
              `}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              disabled={numberCounts[num] >= 9}
              style={getButtonStyle(num)}
              className={`py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-md text-lg 
                ${highlightedNumber === num ? 'bg-blue-600 text-white scale-105 ring-2 ring-blue-300' : 'bg-[#007FFF] text-white'}
                ${numberCounts[num] >= 9 ? 'opacity-0 cursor-default' : ''}
              `}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="py-3 bg-red-400 text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center"
          >
            <Delete size={20} />
          </button>
        </div>
      </div>

      {/* Win Modal Overlay */}
      {won && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="image-container shadow-lg border-4 border-[#007FFF]/20">
            <img src={SUDOKU_PHOTO} alt="Cutiepie" />
          </div>
          <div className="text-center space-y-4">
            <h4 className="text-2xl font-bold text-pink-500 flex items-center justify-center gap-2">
              That's my cutiepiee, Muahh
            </h4>
            <button 
              onClick={onComplete}
              className="flex items-center gap-2 px-10 py-4 bg-[#007FFF] text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg font-bold text-xl animate-bounce-slow"
            >
              Unlock the Wish
              <Heart size={24} fill="white" />
            </button>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400 italic text-center">
        Select a box with a number to highlight matches.
      </div>
    </div>
  );
};

export default Sudoku;
