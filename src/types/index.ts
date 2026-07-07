export type Difficulty = 'easy' | 'medium' | 'hard';

/** 九色順序：隨難度逐步解鎖 */
export type TileTypeId =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'purple'
  | 'black'
  | 'white';

/** 炸彈等級：普通 / 緊急 / 危急 */
export type BombTier = 'normal' | 'fast' | 'critical';

export interface TimedBomb {
  tier: BombTier;
  countdown: number;
}

export type LoseReason = 'moves' | 'time' | 'bomb';

export interface TileDef {
  id: TileTypeId;
  label: string;
  name: string;
  color: string;
  bg: string;
  highlight: string;
}

export interface LevelConfig {
  id: number;
  difficulty: Difficulty;
  name: string;
  gridSize: number;
  tileTypeCount: number;
  moves: number;
  timeLimit: number;
  targetScore: number;
  stars: [number, number, number];
}

export interface LevelResult {
  stars: number;
  bestScore: number;
}

export interface GameProgress {
  unlockedLevels: number[];
  completedLevels: Record<number, LevelResult>;
  lastPlayedLevel?: number;
}

export interface Position {
  row: number;
  col: number;
}

export type Board = (TileTypeId | null)[][];

export type BombBoard = (TimedBomb | null)[][];

export type GamePhase =
  | 'idle'
  | 'swapping'
  | 'matching'
  | 'falling'
  | 'won'
  | 'lost';

export interface GameState {
  board: Board;
  bombs: BombBoard;
  score: number;
  movesLeft: number;
  timeLeft: number;
  movesUntilSpawn: number;
  selected: Position | null;
  phase: GamePhase;
  combo: number;
  lastMatched: Position[];
  loseReason?: LoseReason;
  tilePool: TileTypeId[];
}
