import type { Difficulty, LevelConfig } from '../types';

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '簡單',
  medium: '中等',
  hard: '困難',
  expert: '專家',
};

export const LEVELS: LevelConfig[] = [
  // 簡單 1–8：3–5 色，逐步認識形狀
  { id: 1, difficulty: 'easy', name: '三色入門', gridSize: 7, tileTypeCount: 3, moves: 45, timeLimit: 300, targetScore: 1300, stars: [1300, 1900, 2500] },
  { id: 2, difficulty: 'easy', name: '方圓三角', gridSize: 7, tileTypeCount: 3, moves: 44, timeLimit: 300, targetScore: 1500, stars: [1500, 2100, 2700] },
  { id: 3, difficulty: 'easy', name: '暖色練習', gridSize: 7, tileTypeCount: 3, moves: 43, timeLimit: 290, targetScore: 1700, stars: [1700, 2300, 2900] },
  { id: 4, difficulty: 'easy', name: '鑽石初現', gridSize: 8, tileTypeCount: 4, moves: 42, timeLimit: 290, targetScore: 1900, stars: [1900, 2600, 3300] },
  { id: 5, difficulty: 'easy', name: '四色繽紛', gridSize: 8, tileTypeCount: 4, moves: 42, timeLimit: 280, targetScore: 2100, stars: [2100, 2800, 3500] },
  { id: 6, difficulty: 'easy', name: '色彩節奏', gridSize: 8, tileTypeCount: 4, moves: 41, timeLimit: 280, targetScore: 2300, stars: [2300, 3000, 3700] },
  { id: 7, difficulty: 'easy', name: '五色調和', gridSize: 8, tileTypeCount: 5, moves: 40, timeLimit: 270, targetScore: 2500, stars: [2500, 3200, 3900] },
  { id: 8, difficulty: 'easy', name: '形狀大集', gridSize: 8, tileTypeCount: 5, moves: 40, timeLimit: 270, targetScore: 2700, stars: [2700, 3400, 4100] },

  // 中等 9–16：5–7 色
  { id: 9, difficulty: 'medium', name: '進階調色', gridSize: 8, tileTypeCount: 5, moves: 38, timeLimit: 260, targetScore: 2900, stars: [2900, 3700, 4500] },
  { id: 10, difficulty: 'medium', name: '六形並進', gridSize: 8, tileTypeCount: 6, moves: 38, timeLimit: 250, targetScore: 3200, stars: [3200, 4100, 5000] },
  { id: 11, difficulty: 'medium', name: '六色挑戰', gridSize: 8, tileTypeCount: 6, moves: 37, timeLimit: 250, targetScore: 3500, stars: [3500, 4500, 5500] },
  { id: 12, difficulty: 'medium', name: '色塊風暴', gridSize: 8, tileTypeCount: 6, moves: 36, timeLimit: 240, targetScore: 3800, stars: [3800, 4900, 6000] },
  { id: 13, difficulty: 'medium', name: '七色迷陣', gridSize: 9, tileTypeCount: 7, moves: 36, timeLimit: 240, targetScore: 4100, stars: [4100, 5300, 6500] },
  { id: 14, difficulty: 'medium', name: '全形譜', gridSize: 9, tileTypeCount: 7, moves: 35, timeLimit: 230, targetScore: 4400, stars: [4400, 5700, 7000] },
  { id: 15, difficulty: 'medium', name: '光譜交響', gridSize: 9, tileTypeCount: 7, moves: 34, timeLimit: 230, targetScore: 4700, stars: [4700, 6100, 7500] },
  { id: 16, difficulty: 'medium', name: '中級試煉', gridSize: 9, tileTypeCount: 7, moves: 34, timeLimit: 220, targetScore: 5000, stars: [5000, 6500, 8000] },

  // 困難 17–24
  { id: 17, difficulty: 'hard', name: '七色極限', gridSize: 9, tileTypeCount: 7, moves: 32, timeLimit: 210, targetScore: 5300, stars: [5300, 6800, 8300] },
  { id: 18, difficulty: 'hard', name: '深淺之間', gridSize: 9, tileTypeCount: 7, moves: 32, timeLimit: 200, targetScore: 5600, stars: [5600, 7200, 8800] },
  { id: 19, difficulty: 'hard', name: '黑白試煉', gridSize: 9, tileTypeCount: 7, moves: 31, timeLimit: 200, targetScore: 5900, stars: [5900, 7600, 9300] },
  { id: 20, difficulty: 'hard', name: '連環爆破', gridSize: 9, tileTypeCount: 7, moves: 30, timeLimit: 190, targetScore: 6200, stars: [6200, 8000, 9800] },
  { id: 21, difficulty: 'hard', name: '全譜對決', gridSize: 9, tileTypeCount: 7, moves: 30, timeLimit: 190, targetScore: 6500, stars: [6500, 8400, 10300] },
  { id: 22, difficulty: 'hard', name: '形態風暴', gridSize: 9, tileTypeCount: 7, moves: 29, timeLimit: 180, targetScore: 6800, stars: [6800, 8800, 10800] },
  { id: 23, difficulty: 'hard', name: '色彩大師', gridSize: 9, tileTypeCount: 7, moves: 28, timeLimit: 180, targetScore: 7100, stars: [7100, 9200, 11300] },
  { id: 24, difficulty: 'hard', name: '困難終章', gridSize: 9, tileTypeCount: 7, moves: 28, timeLimit: 170, targetScore: 7400, stars: [7400, 9600, 11800] },

  // 專家 25–32
  { id: 25, difficulty: 'expert', name: '專家開局', gridSize: 9, tileTypeCount: 7, moves: 28, timeLimit: 180, targetScore: 7800, stars: [7800, 10100, 12400] },
  { id: 26, difficulty: 'expert', name: '鑽石風暴', gridSize: 9, tileTypeCount: 7, moves: 27, timeLimit: 175, targetScore: 8200, stars: [8200, 10600, 13000] },
  { id: 27, difficulty: 'expert', name: '三角迷城', gridSize: 9, tileTypeCount: 7, moves: 27, timeLimit: 170, targetScore: 8600, stars: [8600, 11100, 13600] },
  { id: 28, difficulty: 'expert', name: '圓方之戰', gridSize: 9, tileTypeCount: 7, moves: 26, timeLimit: 165, targetScore: 9000, stars: [9000, 11600, 14200] },
  { id: 29, difficulty: 'expert', name: '四形歸一', gridSize: 9, tileTypeCount: 7, moves: 26, timeLimit: 160, targetScore: 9400, stars: [9400, 12100, 14800] },
  { id: 30, difficulty: 'expert', name: '極限調色', gridSize: 9, tileTypeCount: 7, moves: 25, timeLimit: 155, targetScore: 9800, stars: [9800, 12600, 15400] },
  { id: 31, difficulty: 'expert', name: '爆破煉獄', gridSize: 9, tileTypeCount: 7, moves: 25, timeLimit: 150, targetScore: 10200, stars: [10200, 13100, 16000] },
  { id: 32, difficulty: 'expert', name: '傳奇通關', gridSize: 9, tileTypeCount: 7, moves: 24, timeLimit: 150, targetScore: 10800, stars: [10800, 13900, 17000] },
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
