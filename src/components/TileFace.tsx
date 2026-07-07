import { TILE_IMAGES } from '../data/tileAssets';
import type { TileTypeId } from '../types';

interface TileFaceProps {
  type: TileTypeId;
  className?: string;
}

/** 香港麻雀牌：象牙色牌身 + 傳統牌面圖案 */
export function TileFace({ type, className = '' }: TileFaceProps) {
  return (
    <div className={`mahjong-tile ${className}`.trim()} aria-hidden="true">
      <div className="mahjong-tile__back" />
      <div className="mahjong-tile__face">
        <img
          src={TILE_IMAGES[type]}
          alt=""
          className="mahjong-tile__art"
          draggable={false}
        />
      </div>
    </div>
  );
}

export function TileFaceLarge({ type }: TileFaceProps) {
  return <TileFace type={type} className="mahjong-tile--large" />;
}
