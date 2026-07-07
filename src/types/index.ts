export type Difficulty = 'easy' | 'medium' | 'hard';

export type TileTypeId = 'wan' | 'tong' | 'suo' | 'dong' | 'zhong' | 'fa';

/** 炸彈類型：橫排、直排、範圍 */
export type SpecialType = 'bomb-row' | 'bomb-col' | 'bomb-area';

export type LoseReason = 'moves' | 'time';

export interface TileDef {
  id: TileTypeId;
  label: string;
  name: string;
  color: string;
  bg: string;
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

export type SpecialBoard = (SpecialType | null)[][];

export type GamePhase =
  | 'idle'
  | 'swapping'
  | 'matching'
  | 'falling'
  | 'exploding'
  | 'won'
  | 'lost';

export interface GameState {
  board: Board;
  specials: SpecialBoard;
  score: number;
  movesLeft: number;
  timeLeft: number;
  selected: Position | null;
  phase: GamePhase;
  combo: number;
  lastMatched: Position[];
  loseReason?: LoseReason;
}
