import type { TileDef, TileTypeId } from '../types';

/** 紅橙黃綠青藍紫黑白 — 依序解鎖 */
export const COLOR_TILE_ORDER: TileTypeId[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'cyan',
  'blue',
  'purple',
  'black',
  'white',
];

export const TILE_TYPES: TileDef[] = [
  { id: 'red', label: '紅', name: '紅色', color: '#e53935', bg: '#ef5350', highlight: '#ffcdd2' },
  { id: 'orange', label: '橙', name: '橙色', color: '#f57c00', bg: '#ff9800', highlight: '#ffe0b2' },
  { id: 'yellow', label: '黃', name: '黃色', color: '#f9a825', bg: '#ffca28', highlight: '#fff9c4' },
  { id: 'green', label: '綠', name: '綠色', color: '#2e7d32', bg: '#66bb6a', highlight: '#c8e6c9' },
  { id: 'cyan', label: '青', name: '青色', color: '#00838f', bg: '#26c6da', highlight: '#b2ebf2' },
  { id: 'blue', label: '藍', name: '藍色', color: '#1565c0', bg: '#42a5f5', highlight: '#bbdefb' },
  { id: 'purple', label: '紫', name: '紫色', color: '#6a1b9a', bg: '#ab47bc', highlight: '#e1bee7' },
  { id: 'black', label: '黑', name: '黑色', color: '#212121', bg: '#424242', highlight: '#757575' },
  { id: 'white', label: '白', name: '白色', color: '#bdbdbd', bg: '#fafafa', highlight: '#ffffff' },
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
