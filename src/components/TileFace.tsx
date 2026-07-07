import type { CSSProperties } from 'react';
import { TILE_MAP } from '../data/tiles';
import type { TileTypeId } from '../types';

interface TileFaceProps {
  type: TileTypeId;
  className?: string;
}

/** 立體正方形磚塊：顶面 + 右側 + 前面 */
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
    >
      <div className="color-tile__top" />
      <div className="color-tile__edge color-tile__edge--right" />
      <div className="color-tile__edge color-tile__edge--bottom" />
    </div>
  );
}

export function TileFaceLarge({ type }: TileFaceProps) {
  return <TileFace type={type} className="color-tile--large" />;
}
