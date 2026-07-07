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
    spawnEveryMoves: 6,
    tiers: ['normal'],
    countdown: { normal: 20, fast: 12, critical: 7 },
  },
  medium: {
    maxBombs: 2,
    spawnEveryMoves: 5,
    tiers: ['normal', 'fast'],
    countdown: { normal: 16, fast: 11, critical: 7 },
  },
  hard: {
    maxBombs: 3,
    spawnEveryMoves: 4,
    tiers: ['fast', 'critical'],
    countdown: { normal: 14, fast: 9, critical: 6 },
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
