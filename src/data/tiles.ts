import type { TileDef } from '../types';

export const TILE_TYPES: TileDef[] = [
  { id: 'wan', label: '伍萬', name: '伍萬', color: '#b71c1c', bg: '#ffebee' },
  { id: 'tong', label: '伍筒', name: '伍筒', color: '#1565c0', bg: '#e3f2fd' },
  { id: 'suo', label: '一索', name: '一索', color: '#2e7d32', bg: '#e8f5e9' },
  { id: 'dong', label: '東', name: '東風', color: '#6a1b9a', bg: '#f3e5f5' },
  { id: 'zhong', label: '中', name: '紅中', color: '#c62828', bg: '#ffcdd2' },
  { id: 'fa', label: '發', name: '青發', color: '#00695c', bg: '#e0f2f1' },
];

export const TILE_MAP = Object.fromEntries(TILE_TYPES.map((t) => [t.id, t])) as Record<
  string,
  TileDef
>;
