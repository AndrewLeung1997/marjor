import type { CSSProperties } from 'react';
import { TILE_MAP } from '../data/tiles';
import type { TileTypeId } from '../types';

interface TileFaceProps {
  type: TileTypeId;
  className?: string;
}

/** 立體彩色磚塊（正方形 / 鑽石 / 圓形 / 三角形） */
export function TileFace({ type, className = '' }: TileFaceProps) {
  const def = TILE_MAP[type];

  return (
    <div
      className={`color-tile color-tile--${type} color-tile--shape-${def.shape} ${className}`.trim()}
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
