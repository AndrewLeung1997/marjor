export type Difficulty = 'easy' | 'medium' | 'hard';

export type TileTypeId =
  | 'wan1' | 'wan2' | 'wan3' | 'wan4' | 'wan5' | 'wan6' | 'wan7' | 'wan8' | 'wan9'
  | 'tong1' | 'tong2' | 'tong3' | 'tong4' | 'tong5' | 'tong6' | 'tong7' | 'tong8' | 'tong9'
  | 'suo1' | 'suo2' | 'suo3' | 'suo4' | 'suo5' | 'suo6' | 'suo7' | 'suo8' | 'suo9'
  | 'dong' | 'nan' | 'xi' | 'bei' | 'zhong' | 'fa' | 'bai';

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
  suit: 'wan' | 'tong' | 'suo' | 'honor';
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
