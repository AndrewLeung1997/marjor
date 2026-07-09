import type { Difficulty, BombTier } from '../types';

export const BOMB_TIER_LABELS: Record<BombTier, string> = {
  normal: '普通炸彈',
  fast: '緊急炸彈',
  critical: '危急炸彈',
};

export interface BombDifficultyConfig {
  maxBombs: number;
  spawnEveryMoves: number;
  tiers: BombTier[];
  countdown: Record<BombTier, number>;
}

export const BOMB_CONFIG: Record<Difficulty, BombDifficultyConfig> = {
  easy: {
    maxBombs: 1,
    spawnEveryMoves: 9,
    tiers: ['normal'],
    countdown: { normal: 28, fast: 18, critical: 12 },
  },
  medium: {
    maxBombs: 2,
    spawnEveryMoves: 8,
    tiers: ['normal', 'fast'],
    countdown: { normal: 24, fast: 16, critical: 11 },
  },
  hard: {
    maxBombs: 2,
    spawnEveryMoves: 7,
    tiers: ['fast', 'critical'],
    countdown: { normal: 20, fast: 14, critical: 10 },
  },
  expert: {
    maxBombs: 3,
    spawnEveryMoves: 6,
    tiers: ['fast', 'critical'],
    countdown: { normal: 18, fast: 12, critical: 8 },
  },
};

export function getBombConfig(difficulty: Difficulty): BombDifficultyConfig {
  return BOMB_CONFIG[difficulty];
}

export function pickBombTier(config: BombDifficultyConfig): BombTier {
  const tiers = config.tiers;
  return tiers[Math.floor(Math.random() * tiers.length)];
}

export function countBombs(bombs: (unknown | null)[][]): number {
  return bombs.flat().filter(Boolean).length;
}
