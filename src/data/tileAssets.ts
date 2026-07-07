import type { TileTypeId } from '../types';

/** 香港麻雀牌面 PNG（samoheen/mahjong-tiles, CC0） */
export const TILE_IMAGES: Record<TileTypeId, string> = {
  wan: '/tiles/hk/12-characters-5.png',   // 伍萬
  tong: '/tiles/hk/21-circles-5.png',     // 伍筒
  suo: '/tiles/hk/26-bamboos-1.png',      // 一索
  dong: '/tiles/hk/04-east-wind.png',     // 東
  zhong: '/tiles/hk/03-red-dragon.png',   // 中
  fa: '/tiles/hk/02-green-dragon.png',    // 發
};
