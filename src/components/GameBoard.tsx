import type { CSSProperties } from 'react';
import { Tile } from './Tile';
import type { Board, GamePhase, Position, SpecialBoard } from '../types';

interface GameBoardProps {
  board: Board;
  specials: SpecialBoard;
  selected: Position | null;
  lastMatched: Position[];
  phase: GamePhase;
  onTileClick: (pos: Position) => void;
}

function isMatched(lastMatched: Position[], row: number, col: number): boolean {
  return lastMatched.some((p) => p.row === row && p.col === col);
}

export function GameBoard({
  board,
  specials,
  selected,
  lastMatched,
  phase,
  onTileClick,
}: GameBoardProps) {
  const disabled = phase !== 'idle';
  const size = board.length;

  return (
    <div
      className="game-board"
      style={{ '--grid-size': size } as CSSProperties}
      role="grid"
      aria-label="麻雀牌面"
    >
      {board.map((row, rowIdx) =>
        row.map((type, colIdx) => {
          if (!type) return <div key={`${rowIdx}-${colIdx}`} className="tile tile--empty" />;

          const isSelected = selected?.row === rowIdx && selected?.col === colIdx;
          const matched = isMatched(lastMatched, rowIdx, colIdx);

          return (
            <Tile
              key={`${rowIdx}-${colIdx}`}
              type={type}
              special={specials[rowIdx][colIdx]}
              row={rowIdx}
              col={colIdx}
              selected={isSelected}
              matched={matched}
              onClick={onTileClick}
              disabled={disabled}
            />
          );
        })
      )}
    </div>
  );
}
