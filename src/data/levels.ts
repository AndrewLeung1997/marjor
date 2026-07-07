import type { Difficulty, LevelConfig } from '../types';

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '簡單',
  medium: '中等',
  hard: '困難',
};

export const LEVELS: LevelConfig[] = [
  { id: 1, difficulty: 'easy', name: '初試身手', gridSize: 7, tileTypeCount: 8, moves: 30, timeLimit: 180, targetScore: 800, stars: [800, 1200, 1600] },
  { id: 2, difficulty: 'easy', name: '萬字開局', gridSize: 7, tileTypeCount: 8, moves: 28, timeLimit: 170, targetScore: 1000, stars: [1000, 1400, 1800] },
  { id: 3, difficulty: 'easy', name: '筒索交錯', gridSize: 8, tileTypeCount: 9, moves: 28, timeLimit: 160, targetScore: 1200, stars: [1200, 1700, 2200] },
  { id: 4, difficulty: 'easy', name: '東風入懷', gridSize: 8, tileTypeCount: 9, moves: 26, timeLimit: 150, targetScore: 1400, stars: [1400, 1900, 2400] },
  { id: 5, difficulty: 'easy', name: '紅中登場', gridSize: 8, tileTypeCount: 10, moves: 25, timeLimit: 140, targetScore: 1600, stars: [1600, 2100, 2600] },
  { id: 6, difficulty: 'medium', name: '牌局升溫', gridSize: 8, tileTypeCount: 10, moves: 22, timeLimit: 130, targetScore: 1800, stars: [1800, 2400, 3000] },
  { id: 7, difficulty: 'medium', name: '青發現世', gridSize: 8, tileTypeCount: 11, moves: 22, timeLimit: 120, targetScore: 2000, stars: [2000, 2700, 3400] },
  { id: 8, difficulty: 'medium', name: '六牌齊飛', gridSize: 8, tileTypeCount: 11, moves: 20, timeLimit: 115, targetScore: 2200, stars: [2200, 2900, 3600] },
  { id: 9, difficulty: 'medium', name: '連環胡牌', gridSize: 9, tileTypeCount: 12, moves: 20, timeLimit: 110, targetScore: 2500, stars: [2500, 3200, 4000] },
  { id: 10, difficulty: 'medium', name: '牌桌風雲', gridSize: 9, tileTypeCount: 12, moves: 18, timeLimit: 100, targetScore: 2800, stars: [2800, 3600, 4500] },
  { id: 11, difficulty: 'hard', name: '雀神之路', gridSize: 9, tileTypeCount: 13, moves: 18, timeLimit: 95, targetScore: 3000, stars: [3000, 4000, 5000] },
  { id: 12, difficulty: 'hard', name: '天胡挑戰', gridSize: 9, tileTypeCount: 13, moves: 16, timeLimit: 90, targetScore: 3200, stars: [3200, 4300, 5400] },
  { id: 13, difficulty: 'hard', name: '牌山崩塌', gridSize: 9, tileTypeCount: 14, moves: 15, timeLimit: 85, targetScore: 3500, stars: [3500, 4700, 5900] },
  { id: 14, difficulty: 'hard', name: '終局之戰', gridSize: 9, tileTypeCount: 14, moves: 14, timeLimit: 80, targetScore: 3800, stars: [3800, 5100, 6400] },
  { id: 15, difficulty: 'hard', name: '雀聖傳說', gridSize: 9, tileTypeCount: 15, moves: 12, timeLimit: 75, targetScore: 4200, stars: [4200, 5600, 7000] },
];

export function getLevelsByDifficulty(difficulty: Difficulty): LevelConfig[] {
  return LEVELS.filter((l) => l.difficulty === difficulty);
}

export function getLevel(id: number): LevelConfig | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function calcStars(level: LevelConfig, score: number): number {
  if (score >= level.stars[2]) return 3;
  if (score >= level.stars[1]) return 2;
  if (score >= level.stars[0]) return 1;
  return 0;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
