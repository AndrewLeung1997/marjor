import type { CSSProperties } from 'react';
import { getSpecialLabel } from '../utils/gameEngine';
import { TILE_MAP } from '../data/tiles';
import { TileFace } from './TileFace';
import type { Position, SpecialType, TileTypeId } from '../types';

interface TileProps {
  type: TileTypeId;
  special: SpecialType | null;
  row: number;
  col: number;
  selected: boolean;
  matched: boolean;
  onClick: (pos: Position) => void;
  disabled: boolean;
}

export function Tile({
  type,
  special,
  row,
  col,
  selected,
  matched,
  onClick,
  disabled,
}: TileProps) {
  const def = TILE_MAP[type];
  const bombLabel = special ? getSpecialLabel(special) : '';

  return (
    <button
      type="button"
      className={`tile ${selected ? 'tile--selected' : ''} ${matched ? 'tile--matched' : ''} ${special ? `tile--bomb tile--bomb-${special}` : ''}`}
      style={{ '--tile-accent': def.color } as CSSProperties}
      onClick={() => onClick({ row, col })}
      disabled={disabled}
      aria-label={special ? `${def.name} ${bombLabel}` : `${def.name} 牌`}
    >
      <TileFace type={type} />
      {special && (
        <span className="tile__bomb-icon" aria-hidden="true">
          {special === 'bomb-area' ? '💥' : special === 'bomb-row' ? '↔' : '↕'}
        </span>
      )}
    </button>
  );
}
