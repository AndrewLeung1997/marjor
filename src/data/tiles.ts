import type { TileDef, TileTypeId } from '../types';

const WAN_NAMES = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
const NUM_NAMES = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

function wanTiles(): TileDef[] {
  return WAN_NAMES.map((n, i) => ({
    id: `wan${i + 1}` as TileTypeId,
    label: `${n}萬`,
    name: `${n}萬`,
    color: '#b71c1c',
    bg: '#ffebee',
    suit: 'wan' as const,
  }));
}

function tongTiles(): TileDef[] {
  return NUM_NAMES.map((n, i) => ({
    id: `tong${i + 1}` as TileTypeId,
    label: `${n}筒`,
    name: `${n}筒`,
    color: '#1565c0',
    bg: '#e3f2fd',
    suit: 'tong' as const,
  }));
}

function suoTiles(): TileDef[] {
  return NUM_NAMES.map((n, i) => ({
    id: `suo${i + 1}` as TileTypeId,
    label: `${n}索`,
    name: `${n}索`,
    color: '#2e7d32',
    bg: '#e8f5e9',
    suit: 'suo' as const,
  }));
}

const HONOR_TILES: TileDef[] = [
  { id: 'dong', label: '東', name: '東風', color: '#1a1a1a', bg: '#f5f5f5', suit: 'honor' },
  { id: 'nan', label: '南', name: '南風', color: '#1a1a1a', bg: '#f5f5f5', suit: 'honor' },
  { id: 'xi', label: '西', name: '西風', color: '#1a1a1a', bg: '#f5f5f5', suit: 'honor' },
  { id: 'bei', label: '北', name: '北風', color: '#1a1a1a', bg: '#f5f5f5', suit: 'honor' },
  { id: 'zhong', label: '中', name: '紅中', color: '#c62828', bg: '#ffcdd2', suit: 'honor' },
  { id: 'fa', label: '發', name: '青發', color: '#00695c', bg: '#e0f2f1', suit: 'honor' },
  { id: 'bai', label: '白', name: '白板', color: '#546e7a', bg: '#eceff1', suit: 'honor' },
];

export const TILE_TYPES: TileDef[] = [...wanTiles(), ...tongTiles(), ...suoTiles(), ...HONOR_TILES];

export const TILE_MAP = Object.fromEntries(TILE_TYPES.map((t) => [t.id, t])) as Record<
  TileTypeId,
  TileDef
>;

/** 依關卡選出多樣牌型：萬筒索均衡 + 字牌 */
export function getTilePool(count: number, levelId: number): TileTypeId[] {
  const wan = TILE_TYPES.filter((t) => t.suit === 'wan').map((t) => t.id);
  const tong = TILE_TYPES.filter((t) => t.suit === 'tong').map((t) => t.id);
  const suo = TILE_TYPES.filter((t) => t.suit === 'suo').map((t) => t.id);
  const honors = TILE_TYPES.filter((t) => t.suit === 'honor').map((t) => t.id);

  const pool: TileTypeId[] = [];
  const offset = (levelId - 1) % 3;

  // 每種花色輪流取牌，確保視覺多樣
  const perSuit = Math.max(2, Math.floor((count - 2) / 3));
  for (let i = 0; i < perSuit && pool.length < count - 2; i++) {
    const idx = (i + offset) % 9;
    pool.push(wan[idx], tong[idx], suo[idx]);
  }

  // 加入字牌增加辨識度
  const honorPick = [honors[(levelId + offset) % 4], honors[4 + (levelId % 3)]];
  for (const h of honorPick) {
    if (pool.length < count && !pool.includes(h)) pool.push(h);
  }

  // 補足到 count
  const all = [...wan, ...tong, ...suo, ...honors];
  let cursor = (levelId * 3 + offset) % all.length;
  while (pool.length < count) {
    const id = all[cursor % all.length];
    if (!pool.includes(id)) pool.push(id);
    cursor++;
  }

  return pool.slice(0, count);
}
