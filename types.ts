
export enum GameState {
  INTRO = 'INTRO',
  MINESWEEPER = 'MINESWEEPER',
  SUDOKU = 'SUDOKU',
  WISH = 'WISH'
}

export interface MinesweeperCell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}
