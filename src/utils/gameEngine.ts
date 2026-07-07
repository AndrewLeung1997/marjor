import { getTilePool } from '../data/tiles';
import { countBombs, getBombConfig, pickBombTier } from '../data/bombs';
import type { Board, BombBoard, Difficulty, Position, TimedBomb, TileTypeId } from '../types';

function posKey(p: Position): string {
  return `${p.row},${p.col}`;
}

function randomTile(types: TileTypeId[]): TileTypeId {
  return types[Math.floor(Math.random() * types.length)];
}

export function createEmptyBombs(size: number): BombBoard {
  return Array.from({ length: size }, () => Array<TimedBomb | null>(size).fill(null));
}

export function createBoard(size: number, tileTypeCount: number, levelId: number): Board {
  const types = getTilePool(tileTypeCount, levelId);
  let board: Board;

  do {
    board = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => randomTile(types))
    );
  } while (findMatches(board).length > 0 || !hasValidMoves(board, types));

  return board;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function cloneBombs(bombs: BombBoard): BombBoard {
  return bombs.map((row) => row.map((b) => (b ? { ...b } : null)));
}

export function areAdjacent(a: Position, b: Position): boolean {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
}

export function swapTiles(board: Board, a: Position, b: Position): Board {
  const next = cloneBoard(board);
  const tmp = next[a.row][a.col];
  next[a.row][a.col] = next[b.row][b.col];
  next[b.row][b.col] = tmp;
  return next;
}

export function swapBombs(bombs: BombBoard, a: Position, b: Position): BombBoard {
  const next = cloneBombs(bombs);
  const tmp = next[a.row][a.col];
  next[a.row][a.col] = next[b.row][b.col];
  next[b.row][b.col] = tmp;
  return next;
}

export function findMatchGroups(board: Board): Position[][] {
  const size = board.length;
  const groups: Position[][] = [];

  for (let row = 0; row < size; row++) {
    let col = 0;
    while (col < size) {
      const type = board[row][col];
      if (!type) {
        col++;
        continue;
      }
      let end = col + 1;
      while (end < size && board[row][end] === type) end++;
      const len = end - col;
      if (len >= 3) {
        groups.push(Array.from({ length: len }, (_, i) => ({ row, col: col + i })));
      }
      col = end;
    }
  }

  for (let col = 0; col < size; col++) {
    let row = 0;
    while (row < size) {
      const type = board[row][col];
      if (!type) {
        row++;
        continue;
      }
      let end = row + 1;
      while (end < size && board[end][col] === type) end++;
      const len = end - row;
      if (len >= 3) {
        groups.push(Array.from({ length: len }, (_, i) => ({ row: row + i, col })));
      }
      row = end;
    }
  }

  return groups;
}

export function findMatches(board: Board): Position[] {
  const seen = new Set<string>();
  for (const group of findMatchGroups(board)) {
    for (const p of group) seen.add(posKey(p));
  }
  return Array.from(seen).map((key) => {
    const [row, col] = key.split(',').map(Number);
    return { row, col };
  });
}

/** 合併所有三消組為待消除格子 */
export function resolveMatchGroups(groups: Position[][]): Position[] {
  const toRemove = new Set<string>();
  for (const group of groups) {
    for (const p of group) toRemove.add(posKey(p));
  }
  return Array.from(toRemove).map((key) => {
    const [row, col] = key.split(',').map(Number);
    return { row, col };
  });
}

export function removeAt(board: Board, bombs: BombBoard, positions: Position[]): {
  board: Board;
  bombs: BombBoard;
  defused: number;
} {
  const nextBoard = cloneBoard(board);
  const nextBombs = cloneBombs(bombs);
  let defused = 0;

  for (const { row, col } of positions) {
    if (nextBombs[row][col]) defused++;
    nextBoard[row][col] = null;
    nextBombs[row][col] = null;
  }

  return { board: nextBoard, bombs: nextBombs, defused };
}

export function applyGravity(board: Board, bombs: BombBoard): {
  board: Board;
  bombs: BombBoard;
} {
  const size = board.length;
  const nextBoard = cloneBoard(board);
  const nextBombs = cloneBombs(bombs);

  for (let col = 0; col < size; col++) {
    let writeRow = size - 1;
    for (let row = size - 1; row >= 0; row--) {
      if (nextBoard[row][col] !== null) {
        nextBoard[writeRow][col] = nextBoard[row][col];
        nextBombs[writeRow][col] = nextBombs[row][col];
        if (writeRow !== row) {
          nextBoard[row][col] = null;
          nextBombs[row][col] = null;
        }
        writeRow--;
      }
    }
  }

  return { board: nextBoard, bombs: nextBombs };
}

export function refillBoard(board: Board, tilePool: TileTypeId[]): Board {
  const size = board.length;
  const next = cloneBoard(board);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (next[row][col] === null) {
        next[row][col] = randomTile(tilePool);
      }
    }
  }

  return next;
}

/** 無可行步時自動重排（不消耗玩家操作） */
export function ensurePlayable(board: Board, tilePool: TileTypeId[]): Board {
  if (findMatches(board).length === 0 && hasValidMoves(board, tilePool)) {
    return board;
  }

  const size = board.length;
  let next = cloneBoard(board);

  for (let attempt = 0; attempt < 80; attempt++) {
    const types = next.flat().filter((t): t is TileTypeId => t !== null);
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }

    let idx = 0;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (next[row][col]) next[row][col] = types[idx++];
      }
    }

    if (findMatches(next).length === 0 && hasValidMoves(next, tilePool)) {
      return next;
    }
  }

  return createBoard(size, tilePool.length, 1);
}

export function refillBoardSafe(board: Board, tilePool: TileTypeId[]): Board {
  return ensurePlayable(refillBoard(board, tilePool), tilePool);
}

export function calcMatchScore(matchCount: number, combo: number): number {
  const base = matchCount >= 5 ? 300 : matchCount === 4 ? 200 : 100;
  const multiplier = 1 + combo * 0.5;
  return Math.round(base * multiplier);
}

export function calcDefuseScore(defusedCount: number): number {
  return defusedCount * 150;
}

export function wouldCreateMatch(board: Board, a: Position, b: Position): boolean {
  return findMatches(swapTiles(board, a, b)).length > 0;
}

export function hasValidMoves(board: Board, tilePool: TileTypeId[]): boolean {
  const size = board.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const pos = { row, col };
      if (col + 1 < size && wouldCreateMatch(board, pos, { row, col: col + 1 })) return true;
      if (row + 1 < size && wouldCreateMatch(board, pos, { row: row + 1, col })) return true;
    }
  }

  void tilePool;
  return false;
}

export function shuffleBoard(
  board: Board,
  tileTypeCount: number,
  levelId: number
): Board {
  const types = getTilePool(tileTypeCount, levelId);
  let next: Board;
  do {
    next = createBoard(board.length, tileTypeCount, levelId);
  } while (!hasValidMoves(next, types));
  return next;
}

/** 炸彈倒數 -1，回傳是否有炸彈歸零 */
export function tickBombs(bombs: BombBoard): { bombs: BombBoard; exploded: boolean } {
  const next = cloneBombs(bombs);
  let exploded = false;

  for (let row = 0; row < next.length; row++) {
    for (let col = 0; col < next[row].length; col++) {
      const bomb = next[row][col];
      if (!bomb) continue;
      bomb.countdown -= 1;
      if (bomb.countdown <= 0) exploded = true;
    }
  }

  return { bombs: next, exploded };
}

/** 在隨機牌面生成倒數炸彈 */
export function spawnBomb(
  board: Board,
  bombs: BombBoard,
  difficulty: Difficulty
): BombBoard {
  const config = getBombConfig(difficulty);
  if (countBombs(bombs) >= config.maxBombs) return bombs;

  const size = board.length;
  const candidates: Position[] = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] && !bombs[row][col]) {
        candidates.push({ row, col });
      }
    }
  }

  if (candidates.length === 0) return bombs;

  const pos = candidates[Math.floor(Math.random() * candidates.length)];
  const tier = pickBombTier(config);
  const next = cloneBombs(bombs);
  next[pos.row][pos.col] = {
    tier,
    countdown: config.countdown[tier],
  };

  return next;
}

export function getLowestBombCountdown(bombs: BombBoard): number | null {
  let min: number | null = null;
  for (const row of bombs) {
    for (const bomb of row) {
      if (!bomb) continue;
      if (min === null || bomb.countdown < min) min = bomb.countdown;
    }
  }
  return min;
}
