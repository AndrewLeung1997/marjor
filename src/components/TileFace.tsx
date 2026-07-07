import type { CSSProperties } from 'react';
import { TILE_MAP } from '../data/tiles';
import type { TileTypeId } from '../types';

interface TileFaceProps {
  type: TileTypeId;
  className?: string;
}

/** 正方形立體磚塊 */
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
        } as CSSProperties
      }
      aria-hidden="true"
    />
  );
}

export function TileFaceLarge({ type }: TileFaceProps) {
  return <TileFace type={type} className="color-tile--large" />;
}
