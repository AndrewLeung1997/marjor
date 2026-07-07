import { useCallback, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Tile } from './Tile';
import type { Board, BombBoard, GamePhase, Position } from '../types';

interface GameBoardProps {
  board: Board;
  bombs: BombBoard;
  selected: Position | null;
  lastMatched: Position[];
  phase: GamePhase;
  onTileClick: (pos: Position) => void;
  onSwap: (from: Position, to: Position) => void;
}

interface DragState {
  from: Position;
  pointerId: number;
  startX: number;
  startY: number;
}

const DRAG_START = 8;
const DRAG_COMMIT = 28;

function isMatched(lastMatched: Position[], row: number, col: number): boolean {
  return lastMatched.some((p) => p.row === row && p.col === col);
}

export function GameBoard({
  board,
  bombs,
  selected,
  lastMatched,
  phase,
  onTileClick,
  onSwap,
}: GameBoardProps) {
  const disabled = phase !== 'idle';
  const size = board.length;
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const didDragRef = useRef(false);

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragFrom, setDragFrom] = useState<Position | null>(null);
  const [dragTarget, setDragTarget] = useState<Position | null>(null);

  const resetDrag = useCallback(() => {
    dragRef.current = null;
    didDragRef.current = false;
    setDragFrom(null);
    setDragTarget(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const getCellSize = useCallback(() => {
    const el = boardRef.current;
    if (!el) return { w: 40, h: 56 };
    const rect = el.getBoundingClientRect();
    const gap = 2;
    const pad = 6;
    const innerW = rect.width - pad * 2 - gap * (size - 1);
    const innerH = rect.height - pad * 2 - gap * (size - 1);
    const cellW = innerW / size;
    const cellH = innerH / size;
    return { w: cellW, h: cellH };
  }, [size]);

  const resolveDrag = useCallback(
    (dx: number, dy: number, from: Position) => {
      const { w, h } = getCellSize();

      if (Math.abs(dx) < DRAG_START && Math.abs(dy) < DRAG_START) {
        return { offset: { x: 0, y: 0 }, target: null as Position | null };
      }

      if (Math.abs(dx) > Math.abs(dy)) {
        const dir = dx > 0 ? 1 : -1;
        const newCol = from.col + dir;
        if (newCol < 0 || newCol >= size) {
          return { offset: { x: 0, y: 0 }, target: null };
        }
        const clampedX = Math.max(-w * 0.85, Math.min(w * 0.85, dx));
        return {
          offset: { x: clampedX, y: 0 },
          target: { row: from.row, col: newCol },
        };
      }

      const dir = dy > 0 ? 1 : -1;
      const newRow = from.row + dir;
      if (newRow < 0 || newRow >= size) {
        return { offset: { x: 0, y: 0 }, target: null };
      }
      const clampedY = Math.max(-h * 0.85, Math.min(h * 0.85, dy));
      return {
        offset: { x: 0, y: clampedY },
        target: { row: newRow, col: from.col },
      };
    },
    [getCellSize, size]
  );

  const handlePointerDown = useCallback(
    (pos: Position, e: React.PointerEvent) => {
      if (disabled || !board[pos.row][pos.col]) return;

      e.preventDefault();

      dragRef.current = {
        from: pos,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
      };
      didDragRef.current = false;
      setDragFrom(pos);
      setDragTarget(null);
      setDragOffset({ x: 0, y: 0 });
      boardRef.current?.setPointerCapture(e.pointerId);
    },
    [board, disabled]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;

      e.preventDefault();

      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;

      if (Math.abs(dx) > DRAG_START || Math.abs(dy) > DRAG_START) {
        didDragRef.current = true;
      }

      const { offset, target } = resolveDrag(dx, dy, drag.from);
      setDragOffset(offset);
      setDragTarget(target);
    },
    [resolveDrag]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;

      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const { target } = resolveDrag(dx, dy, drag.from);

      if (target && (Math.abs(dx) >= DRAG_COMMIT || Math.abs(dy) >= DRAG_COMMIT)) {
        onSwap(drag.from, target);
      }

      if (boardRef.current?.hasPointerCapture(e.pointerId)) {
        boardRef.current.releasePointerCapture(e.pointerId);
      }
      resetDrag();
    },
    [onSwap, resetDrag, resolveDrag]
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent) => {
      if (dragRef.current?.pointerId === e.pointerId) resetDrag();
    },
    [resetDrag]
  );

  const handleClick = useCallback(
    (pos: Position) => {
      if (didDragRef.current) return;
      onTileClick(pos);
    },
    [onTileClick]
  );

  return (
    <div
      ref={boardRef}
      className="game-board"
      style={{ '--grid-size': size } as CSSProperties}
      role="grid"
      aria-label="色塊棋盤"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {board.map((row, rowIdx) =>
        row.map((type, colIdx) => {
          if (!type) return <div key={`${rowIdx}-${colIdx}`} className="tile tile--empty" />;

          const isSelected = selected?.row === rowIdx && selected?.col === colIdx;
          const matched = isMatched(lastMatched, rowIdx, colIdx);
          const isDragging = dragFrom?.row === rowIdx && dragFrom?.col === colIdx;
          const isTarget = dragTarget?.row === rowIdx && dragTarget?.col === colIdx;

          return (
            <Tile
              key={`${rowIdx}-${colIdx}`}
              type={type}
              bomb={bombs[rowIdx][colIdx]}
              row={rowIdx}
              col={colIdx}
              selected={isSelected}
              matched={matched}
              isDragging={isDragging}
              isDragTarget={isTarget}
              dragOffset={isDragging ? dragOffset : undefined}
              onClick={handleClick}
              onPointerDown={handlePointerDown}
              disabled={disabled}
            />
          );
        })
      )}
    </div>
  );
}
