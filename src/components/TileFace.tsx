import type { CSSProperties } from 'react';
import { TILE_MAP } from '../data/tiles';
import type { TileTypeId } from '../types';

interface TileFaceProps {
  type: TileTypeId;
  className?: string;
}

/** 彩色方塊 */
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
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <div className="color-tile__body" />
      <div className="color-tile__shine" />
    </div>
  );
}

export function TileFaceLarge({ type }: TileFaceProps) {
  return <TileFace type={type} className="color-tile--large" />;
}
