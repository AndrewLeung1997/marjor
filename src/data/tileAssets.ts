import { TILE_TYPES } from './tiles';
import type { TileTypeId } from '../types';

/** 香港麻雀牌面 PNG（samoheen/mahjong-tiles, CC0） */
export const TILE_IMAGES: Record<TileTypeId, string> = Object.fromEntries(
  TILE_TYPES.map((t) => [t.id, `/tiles/hk/${t.id}.png`])
) as Record<TileTypeId, string>;
