export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

/** 磚塊形狀 */
export type TileShape = 'square' | 'diamond' | 'circle' | 'triangle';

/** 七色順序：紅綠黃藍紫黑白，隨難度逐步解鎖 */
export type TileTypeId =
  | 'red'
  | 'green'
  | 'yellow'
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
  shape: TileShape;
  color: string;
  bg: string;
  highlight: string;
  border: string;
  text: string;
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
