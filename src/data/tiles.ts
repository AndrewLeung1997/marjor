import type { TileDef, TileTypeId } from '../types';

/** 紅綠黃藍紫黑白 — 依序解鎖，高對比配色 */
export const COLOR_TILE_ORDER: TileTypeId[] = [
  'red',
  'green',
  'yellow',
  'blue',
  'purple',
  'black',
  'white',
];

export const TILE_TYPES: TileDef[] = [
  {
    id: 'red',
    label: '紅',
    name: '紅色',
    color: '#B71C1C',
    bg: '#E53935',
    highlight: '#FF8A80',
    border: '#7F0000',
    text: '#FFFFFF',
  },
  {
    id: 'green',
    label: '綠',
    name: '綠色',
    color: '#1B5E20',
    bg: '#43A047',
    highlight: '#A5D6A7',
    border: '#003300',
    text: '#FFFFFF',
  },
  {
    id: 'yellow',
    label: '黃',
    name: '黃色',
    color: '#F9A825',
    bg: '#FFEB3B',
    highlight: '#FFF59D',
    border: '#F57F17',
    text: '#3E2723',
  },
  {
    id: 'blue',
    label: '藍',
    name: '藍色',
    color: '#0D47A1',
    bg: '#1E88E5',
    highlight: '#90CAF9',
    border: '#002171',
    text: '#FFFFFF',
  },
  {
    id: 'purple',
    label: '紫',
    name: '紫色',
    color: '#4A148C',
    bg: '#8E24AA',
    highlight: '#CE93D8',
    border: '#311B92',
    text: '#FFFFFF',
  },
  {
    id: 'black',
    label: '黑',
    name: '黑色',
    color: '#111111',
    bg: '#424242',
    highlight: '#757575',
    border: '#000000',
    text: '#FFFFFF',
  },
  {
    id: 'white',
    label: '白',
    name: '白色',
    color: '#CFD8DC',
    bg: '#FAFAFA',
    highlight: '#FFFFFF',
    border: '#546E7A',
    text: '#263238',
  },
];

export const TILE_MAP = Object.fromEntries(TILE_TYPES.map((t) => [t.id, t])) as Record<
  TileTypeId,
  TileDef
>;

/** 依關卡取前 N 種顏色（難度越高顏色越多） */
export function getTilePool(count: number, _levelId?: number): TileTypeId[] {
  const n = Math.min(Math.max(3, count), COLOR_TILE_ORDER.length);
  return COLOR_TILE_ORDER.slice(0, n);
}

export function getColorCountLabel(count: number): string {
  return `${Math.min(count, COLOR_TILE_ORDER.length)}色`;
}
