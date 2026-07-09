import type { CSSProperties } from 'react';
import { BOMB_TIER_LABELS } from '../data/bombs';
import { TILE_MAP, SHAPE_LABELS } from '../data/tiles';
import { TileFace } from './TileFace';
import type { Position, TimedBomb, TileTypeId } from '../types';

interface TileProps {
  type: TileTypeId;
  bomb: TimedBomb | null;
  row: number;
  col: number;
  selected: boolean;
  matched: boolean;
  isDragging?: boolean;
  isDragTarget?: boolean;
  dragOffset?: { x: number; y: number };
  onClick: (pos: Position) => void;
  onPointerDown: (pos: Position, e: React.PointerEvent) => void;
  disabled: boolean;
}

export function Tile({
  type,
  bomb,
  row,
  col,
  selected,
  matched,
  isDragging,
  isDragTarget,
  dragOffset,
  onClick,
  onPointerDown,
  disabled,
}: TileProps) {
  const def = TILE_MAP[type];
  const bombLabel = bomb ? BOMB_TIER_LABELS[bomb.tier] : '';

  const motionTransform = dragOffset
    ? `translate(${dragOffset.x}px, ${dragOffset.y}px)`
    : undefined;

  return (
    <button
      type="button"
      className={`tile ${selected ? 'tile--selected' : ''} ${matched ? 'tile--matched' : ''} ${bomb ? `tile--bomb tile--bomb-${bomb.tier}` : ''} ${bomb && bomb.countdown <= 3 ? 'tile--bomb-urgent' : ''} ${isDragging ? 'tile--dragging' : ''} ${isDragTarget ? 'tile--drag-target' : ''}`}
      style={{ '--tile-accent': def.color } as CSSProperties}
      onClick={() => onClick({ row, col })}
      onPointerDown={(e) => onPointerDown({ row, col }, e)}
      disabled={disabled}
      aria-label={
        bomb
          ? `${def.name}${SHAPE_LABELS[def.shape]} ${bombLabel} ${bomb.countdown}秒`
          : `${def.name}${SHAPE_LABELS[def.shape]}`
      }
    >
      <div className="tile__motion" style={{ transform: motionTransform }}>
        <TileFace type={type} />
        {bomb && (
          <span className="tile__bomb-countdown" aria-hidden="true">
            {bomb.countdown}
          </span>
        )}
      </div>
    </button>
  );
}
