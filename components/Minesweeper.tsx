
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MinesweeperCell } from '../types.ts';
import { Bomb, Flag, RefreshCw, ChevronRight } from 'lucide-react';

interface MinesweeperProps {
  onComplete: () => void;
}

const GRID_SIZE = 9;
const MINE_COUNT = 12;
const LONG_PRESS_DURATION = 500; 

// USER: Update this URL with your Google Drive direct image link
const MINESWEEPER_PHOTO = "https://drive.google.com/thumbnail?id=1315YMCH4vAP--tWgHPteS9secExeYhjZ&sz=w1000"; 

const Minesweeper: React.FC<MinesweeperProps> = ({ onComplete }) => {
  const [grid, setGrid] = useState<MinesweeperCell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  
  const touchTimer = useRef<number | null>(null);
  const isLongPress = useRef(false);

  const initGrid = useCallback(() => {
    const newGrid: MinesweeperCell[][] = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );

    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && newGrid[nr][nc].isMine) {
              count++;
            }
          }
        }
        newGrid[r][c].neighborMines = count;
      }
    }
    setGrid(newGrid);
    setGameOver(false);
    setWon(false);
  }, []);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  const revealCell = (r: number, c: number) => {
    if (gameOver || won || grid[r][c].isRevealed || grid[r][c].isFlagged) return;
    const newGrid = [...grid.map(row => [...row])];
    if (newGrid[r][c].isMine) {
      setGameOver(true);
      revealAll(newGrid);
      return;
    }
    const floodFill = (row: number, col: number) => {
      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
      newGrid[row][col].isRevealed = true;
      if (newGrid[row][col].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            floodFill(row + dr, col + dc);
          }
        }
      }
    };
    floodFill(r, c);
    setGrid(newGrid);
    checkWin(newGrid);
  };

  const toggleFlag = (r: number, c: number) => {
    if (gameOver || won || grid[r][c].isRevealed) return;
    const newGrid = [...grid.map(row => [...row])];
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
    setGrid(newGrid);
  };

  const revealAll = (currentGrid: MinesweeperCell[][]) => {
    currentGrid.forEach(row => row.forEach(cell => cell.isRevealed = true));
    setGrid(currentGrid);
  };

  const checkWin = (currentGrid: MinesweeperCell[][]) => {
    const revealedCount = currentGrid.flat().filter(c => c.isRevealed).length;
    if (revealedCount === GRID_SIZE * GRID_SIZE - MINE_COUNT) {
      setWon(true);
    }
  };

  const handleTouchStart = (r: number, c: number) => {
    isLongPress.current = false;
    touchTimer.current = window.setTimeout(() => {
      isLongPress.current = true;
      toggleFlag(r, c);
      if ('vibrate' in navigator) navigator.vibrate(50);
    }, LONG_PRESS_DURATION);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent, r: number, c: number) => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
    if (!isLongPress.current) {
      revealCell(r, c);
    }
    if (e.cancelable) e.preventDefault();
  };

  return (
    <div className="relative glass-card p-4 md:p-6 rounded-3xl shadow-xl flex flex-col items-center space-y-6 max-w-md w-full no-select">
      <div className="text-center pointer-events-none">
        <h3 className="text-2xl font-bold text-[#007FFF]">Quest 1: Minesweeper</h3>
        <p className="text-sm text-gray-500">Find all the safe paths! ❤️</p>
      </div>

      <div className="grid grid-cols-9 border-2 border-[#007FFF] bg-white overflow-hidden rounded-lg shadow-inner select-none touch-none">
        {grid.map((row, r) => (
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onMouseDown={(e) => { if (e.button === 0) handleTouchStart(r, c); }}
              onMouseUp={(e) => { if (e.button === 0) handleTouchEnd(e, r, c); }}
              onTouchStart={() => handleTouchStart(r, c)}
              onTouchEnd={(e) => handleTouchEnd(e, r, c)}
              onContextMenu={(e) => { e.preventDefault(); toggleFlag(r, c); }}
              className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xs md:text-sm font-bold cursor-pointer transition-all duration-150 border border-[#007FFF]/10
                ${cell.isRevealed 
                  ? (cell.isMine ? 'bg-red-400' : 'bg-white text-[#007FFF]') 
                  : 'bg-[#007FFF] hover:bg-[#007FFF]/90 active:scale-95'
                }
                ${!cell.isRevealed && cell.isFlagged ? 'bg-yellow-400' : ''}
              `}
            >
              {cell.isRevealed ? (
                cell.isMine ? (
                  <Bomb size={18} className="text-white animate-pulse" />
                ) : (
                  cell.neighborMines > 0 ? (
                    <span>{cell.neighborMines}</span>
                  ) : ''
                )
              ) : (
                cell.isFlagged ? <Flag size={16} className="text-white" /> : ''
              )}
            </div>
          ))
        ))}
      </div>

      <div className="flex flex-col items-center space-y-3 w-full">
        <div className="flex justify-between w-full px-2 text-sm font-medium text-gray-600">
          <span className="flex items-center gap-1"><Bomb size={14} className="text-[#007FFF]" /> {MINE_COUNT} Mines</span>
          <span className="flex items-center gap-1"><Flag size={14} className="text-yellow-500" /> {grid.flat().filter(c => c.isFlagged).length} Flagged</span>
        </div>
      </div>

      {/* Result Modal Overlay */}
      {(gameOver || won) && (
        <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="image-container shadow-lg border-4 border-[#007FFF]/20">
            <img src={MINESWEEPER_PHOTO} alt="Result" />
          </div>
          <div className="text-center space-y-4">
            <h4 className={`text-2xl font-bold ${gameOver ? 'text-red-500' : 'text-green-500'}`}>
              {gameOver ? "Aww my baby, Let's try again" : "Lessssgooo my kuchupuchu!"}
            </h4>
            {gameOver ? (
              <button 
                onClick={initGrid}
                className="flex items-center gap-2 px-8 py-3 bg-[#007FFF] text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-md font-bold text-lg"
              >
                <RefreshCw size={20} />
                Try Again
              </button>
            ) : (
              <button 
                onClick={onComplete}
                className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-md font-bold text-lg"
              >
                Next Challenge
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400 italic text-center px-4">
        Mobile Tip: Tap and hold to flag! <br/> Desktop: Right-click to flag!
      </div>
    </div>
  );
};

export default Minesweeper;
