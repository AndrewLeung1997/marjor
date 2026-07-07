import type { Difficulty, LevelConfig } from '../types';

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '簡單',
  medium: '中等',
  hard: '困難',
};

export const LEVELS: LevelConfig[] = [
  { id: 1, difficulty: 'easy', name: '三色入門', gridSize: 7, tileTypeCount: 3, moves: 45, timeLimit: 300, targetScore: 1300, stars: [1300, 1900, 2500] },
  { id: 2, difficulty: 'easy', name: '紅綠黃', gridSize: 7, tileTypeCount: 3, moves: 42, timeLimit: 290, targetScore: 1600, stars: [1600, 2200, 2800] },
  { id: 3, difficulty: 'easy', name: '四色繽紛', gridSize: 8, tileTypeCount: 4, moves: 42, timeLimit: 280, targetScore: 1900, stars: [1900, 2600, 3300] },
  { id: 4, difficulty: 'easy', name: '色彩節奏', gridSize: 8, tileTypeCount: 4, moves: 40, timeLimit: 270, targetScore: 2200, stars: [2200, 3000, 3800] },
  { id: 5, difficulty: 'easy', name: '五色調和', gridSize: 8, tileTypeCount: 5, moves: 40, timeLimit: 260, targetScore: 2600, stars: [2600, 3400, 4200] },
  { id: 6, difficulty: 'medium', name: '進階調色', gridSize: 8, tileTypeCount: 5, moves: 38, timeLimit: 250, targetScore: 3000, stars: [3000, 3900, 4800] },
  { id: 7, difficulty: 'medium', name: '六色挑戰', gridSize: 8, tileTypeCount: 6, moves: 36, timeLimit: 240, targetScore: 3400, stars: [3400, 4400, 5400] },
  { id: 8, difficulty: 'medium', name: '色塊風暴', gridSize: 8, tileTypeCount: 6, moves: 35, timeLimit: 230, targetScore: 3800, stars: [3800, 4900, 6000] },
  { id: 9, difficulty: 'medium', name: '七色迷陣', gridSize: 9, tileTypeCount: 7, moves: 34, timeLimit: 220, targetScore: 4200, stars: [4200, 5400, 6600] },
  { id: 10, difficulty: 'medium', name: '全色交響', gridSize: 9, tileTypeCount: 7, moves: 32, timeLimit: 210, targetScore: 4600, stars: [4600, 5900, 7200] },
  { id: 11, difficulty: 'hard', name: '七色極限', gridSize: 9, tileTypeCount: 7, moves: 32, timeLimit: 200, targetScore: 5000, stars: [5000, 6400, 7800] },
  { id: 12, difficulty: 'hard', name: '深淺之間', gridSize: 9, tileTypeCount: 7, moves: 30, timeLimit: 190, targetScore: 5400, stars: [5400, 6900, 8400] },
  { id: 13, difficulty: 'hard', name: '黑白試煉', gridSize: 9, tileTypeCount: 7, moves: 30, timeLimit: 180, targetScore: 5800, stars: [5800, 7400, 9000] },
  { id: 14, difficulty: 'hard', name: '全譜對決', gridSize: 9, tileTypeCount: 7, moves: 28, timeLimit: 170, targetScore: 6200, stars: [6200, 7900, 9600] },
  { id: 15, difficulty: 'hard', name: '色彩大師', gridSize: 9, tileTypeCount: 7, moves: 28, timeLimit: 165, targetScore: 6600, stars: [6600, 8400, 10200] },
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
