import type { CSSProperties } from 'react';
import { TILE_MAP } from '../data/tiles';
import type { TileTypeId } from '../types';

interface TileFaceProps {
  type: TileTypeId;
  className?: string;
}

/** 立體彩色方塊 */
export function TileFace({ type, className = '' }: TileFaceProps) {
  const def = TILE_MAP[type];

  return (
    <div
      className={`color-tile color-tile--${type} ${className}`.trim()}
      style={
        {
          '--tile-color': def.color,
          '--tile-bg': def.bg,
          '--tile-highlight': def.highlight,
          '--tile-border': def.border,
          '--tile-text': def.text,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <div className="color-tile__base" />
      <div className="color-tile__body">
        <span className="color-tile__label">{def.label}</span>
        <div className="color-tile__shine" />
      </div>
    </div>
  );
}

export function TileFaceLarge({ type }: TileFaceProps) {
  return <TileFace type={type} className="color-tile--large" />;
}
