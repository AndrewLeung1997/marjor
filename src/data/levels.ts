import type { Difficulty, LevelConfig } from '../types';

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '簡單',
  medium: '中等',
  hard: '困難',
};

export const LEVELS: LevelConfig[] = [
  { id: 1, difficulty: 'easy', name: '三色入門', gridSize: 7, tileTypeCount: 3, moves: 32, timeLimit: 180, targetScore: 700, stars: [700, 1000, 1400] },
  { id: 2, difficulty: 'easy', name: '紅綠黃', gridSize: 7, tileTypeCount: 3, moves: 30, timeLimit: 170, targetScore: 850, stars: [850, 1200, 1600] },
  { id: 3, difficulty: 'easy', name: '四色繽紛', gridSize: 8, tileTypeCount: 4, moves: 30, timeLimit: 160, targetScore: 1000, stars: [1000, 1400, 1800] },
  { id: 4, difficulty: 'easy', name: '色彩節奏', gridSize: 8, tileTypeCount: 4, moves: 28, timeLimit: 150, targetScore: 1200, stars: [1200, 1600, 2000] },
  { id: 5, difficulty: 'easy', name: '五色調和', gridSize: 8, tileTypeCount: 5, moves: 28, timeLimit: 140, targetScore: 1400, stars: [1400, 1800, 2200] },
  { id: 6, difficulty: 'medium', name: '進階調色', gridSize: 8, tileTypeCount: 5, moves: 26, timeLimit: 130, targetScore: 1600, stars: [1600, 2100, 2600] },
  { id: 7, difficulty: 'medium', name: '六色挑戰', gridSize: 8, tileTypeCount: 6, moves: 26, timeLimit: 120, targetScore: 1800, stars: [1800, 2300, 2800] },
  { id: 8, difficulty: 'medium', name: '色塊風暴', gridSize: 8, tileTypeCount: 6, moves: 24, timeLimit: 115, targetScore: 2000, stars: [2000, 2500, 3100] },
  { id: 9, difficulty: 'medium', name: '七色迷陣', gridSize: 9, tileTypeCount: 7, moves: 24, timeLimit: 110, targetScore: 2200, stars: [2200, 2800, 3500] },
  { id: 10, difficulty: 'medium', name: '全色交響', gridSize: 9, tileTypeCount: 7, moves: 22, timeLimit: 100, targetScore: 2400, stars: [2400, 3100, 3800] },
  { id: 11, difficulty: 'hard', name: '七色極限', gridSize: 9, tileTypeCount: 7, moves: 22, timeLimit: 95, targetScore: 2600, stars: [2600, 3400, 4200] },
  { id: 12, difficulty: 'hard', name: '深淺之間', gridSize: 9, tileTypeCount: 7, moves: 20, timeLimit: 90, targetScore: 2800, stars: [2800, 3600, 4500] },
  { id: 13, difficulty: 'hard', name: '黑白試煉', gridSize: 9, tileTypeCount: 7, moves: 20, timeLimit: 85, targetScore: 3000, stars: [3000, 3900, 4800] },
  { id: 14, difficulty: 'hard', name: '全譜對決', gridSize: 9, tileTypeCount: 7, moves: 18, timeLimit: 80, targetScore: 3200, stars: [3200, 4200, 5200] },
  { id: 15, difficulty: 'hard', name: '色彩大師', gridSize: 9, tileTypeCount: 7, moves: 18, timeLimit: 75, targetScore: 3400, stars: [3400, 4500, 5600] },
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
