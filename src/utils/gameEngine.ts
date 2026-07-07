import { TILE_TYPES } from '../data/tiles';
import type { Board, Position, SpecialBoard, SpecialType, TileTypeId } from '../types';

function posKey(p: Position): string {
  return `${p.row},${p.col}`;
}

function randomTile(types: TileTypeId[]): TileTypeId {
  return types[Math.floor(Math.random() * types.length)];
}

function getTypes(count: number): TileTypeId[] {
  return TILE_TYPES.slice(0, count).map((t) => t.id);
}

export function createEmptySpecials(size: number): SpecialBoard {
  return Array.from({ length: size }, () => Array<SpecialType | null>(size).fill(null));
}

export function createBoard(size: number, tileTypeCount: number): Board {
  const types = getTypes(tileTypeCount);
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

export function cloneSpecials(specials: SpecialBoard): SpecialBoard {
  return specials.map((row) => [...row]);
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

export function swapSpecials(specials: SpecialBoard, a: Position, b: Position): SpecialBoard {
  const next = cloneSpecials(specials);
  const tmp = next[a.row][a.col];
  next[a.row][a.col] = next[b.row][b.col];
  next[b.row][b.col] = tmp;
  return next;
}

/** 找出所有三消組（橫向、縱向各自成組） */
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
        groups.push(
          Array.from({ length: len }, (_, i) => ({ row, col: col + i }))
        );
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
        groups.push(
          Array.from({ length: len }, (_, i) => ({ row: row + i, col }))
        );
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

function pickBombFromGroup(group: Position[]): { pos: Position; type: SpecialType } | null {
  if (group.length >= 5) {
    const mid = group[Math.floor(group.length / 2)];
    return { pos: mid, type: 'bomb-area' };
  }
  if (group.length === 4) {
    const sameRow = group.every((p) => p.row === group[0].row);
    const mid = group[1];
    return { pos: mid, type: sameRow ? 'bomb-row' : 'bomb-col' };
  }
  return null;
}

export interface MatchResolution {
  toRemove: Position[];
  bombCreates: { pos: Position; type: SpecialType }[];
}

/** 解析本輪消除：四連生成排炸彈，五連生成範圍炸彈 */
export function resolveMatchGroups(groups: Position[][]): MatchResolution {
  const toRemove = new Set<string>();
  const bombCreates: { pos: Position; type: SpecialType }[] = [];
  const bombPositions = new Set<string>();

  const sortedGroups = [...groups].sort((a, b) => b.length - a.length);

  for (const group of sortedGroups) {
    const bomb = pickBombFromGroup(group);
    if (bomb && !bombPositions.has(posKey(bomb.pos))) {
      bombCreates.push(bomb);
      bombPositions.add(posKey(bomb.pos));
      for (const p of group) {
        if (posKey(p) !== posKey(bomb.pos)) toRemove.add(posKey(p));
      }
    } else {
      for (const p of group) {
        const k = posKey(p);
        if (!bombPositions.has(k)) toRemove.add(k);
      }
    }
  }

  return {
    toRemove: Array.from(toRemove).map((key) => {
      const [row, col] = key.split(',').map(Number);
      return { row, col };
    }),
    bombCreates,
  };
}

export function getBombBlast(pos: Position, type: SpecialType, size: number): Position[] {
  const result: Position[] = [];

  if (type === 'bomb-row') {
    for (let col = 0; col < size; col++) {
      result.push({ row: pos.row, col });
    }
  } else if (type === 'bomb-col') {
    for (let row = 0; row < size; row++) {
      result.push({ row, col: pos.col });
    }
  } else {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const row = pos.row + dr;
        const col = pos.col + dc;
        if (row >= 0 && row < size && col >= 0 && col < size) {
          result.push({ row, col });
        }
      }
    }
  }

  return result;
}

/** 連鎖引爆炸彈，回傳所有被清除的格子 */
export function chainExplode(
  board: Board,
  specials: SpecialBoard,
  triggers: Position[]
): { cleared: Position[]; board: Board; specials: SpecialBoard } {
  const size = board.length;
  const nextBoard = cloneBoard(board);
  const nextSpecials = cloneSpecials(specials);
  const cleared = new Set<string>();
  const queue = [...triggers];

  while (queue.length > 0) {
    const pos = queue.shift()!;
    const k = posKey(pos);
    if (cleared.has(k)) continue;

    const special = nextSpecials[pos.row][pos.col];
    if (!special && !nextBoard[pos.row][pos.col]) continue;

    if (special) {
      const blast = getBombBlast(pos, special, size);
      for (const p of blast) {
        const pk = posKey(p);
        if (cleared.has(pk)) continue;
        cleared.add(pk);
        if (nextSpecials[p.row][p.col]) {
          queue.push(p);
        }
        nextBoard[p.row][p.col] = null;
        nextSpecials[p.row][p.col] = null;
      }
    } else if (nextBoard[pos.row][pos.col]) {
      cleared.add(k);
      nextBoard[pos.row][pos.col] = null;
      nextSpecials[pos.row][pos.col] = null;
    }
  }

  return {
    cleared: Array.from(cleared).map((key) => {
      const [row, col] = key.split(',').map(Number);
      return { row, col };
    }),
    board: nextBoard,
    specials: nextSpecials,
  };
}

export function removeAt(board: Board, specials: SpecialBoard, positions: Position[]): {
  board: Board;
  specials: SpecialBoard;
} {
  const nextBoard = cloneBoard(board);
  const nextSpecials = cloneSpecials(specials);
  for (const { row, col } of positions) {
    nextBoard[row][col] = null;
    nextSpecials[row][col] = null;
  }
  return { board: nextBoard, specials: nextSpecials };
}

export function applyBombCreates(
  board: Board,
  specials: SpecialBoard,
  creates: { pos: Position; type: SpecialType }[]
): SpecialBoard {
  const next = cloneSpecials(specials);
  for (const { pos, type } of creates) {
    if (board[pos.row][pos.col]) {
      next[pos.row][pos.col] = type;
    }
  }
  return next;
}

export function applyGravity(board: Board, specials: SpecialBoard): {
  board: Board;
  specials: SpecialBoard;
} {
  const size = board.length;
  const nextBoard = cloneBoard(board);
  const nextSpecials = cloneSpecials(specials);

  for (let col = 0; col < size; col++) {
    let writeRow = size - 1;
    for (let row = size - 1; row >= 0; row--) {
      if (nextBoard[row][col] !== null) {
        nextBoard[writeRow][col] = nextBoard[row][col];
        nextSpecials[writeRow][col] = nextSpecials[row][col];
        if (writeRow !== row) {
          nextBoard[row][col] = null;
          nextSpecials[row][col] = null;
        }
        writeRow--;
      }
    }
  }

  return { board: nextBoard, specials: nextSpecials };
}

export function refillBoard(board: Board, tileTypeCount: number): Board {
  const types = getTypes(tileTypeCount);
  const size = board.length;
  const next = cloneBoard(board);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (next[row][col] === null) {
        next[row][col] = randomTile(types);
      }
    }
  }

  return next;
}

export function calcMatchScore(matchCount: number, combo: number): number {
  const base = matchCount >= 5 ? 300 : matchCount === 4 ? 200 : 100;
  const multiplier = 1 + combo * 0.5;
  return Math.round(base * multiplier);
}

export function calcBombScore(clearedCount: number, combo: number): number {
  return Math.round(clearedCount * 50 * (1 + combo * 0.3));
}

export function wouldCreateMatch(board: Board, a: Position, b: Position): boolean {
  const swapped = swapTiles(board, a, b);
  return findMatches(swapped).length > 0;
}

export function hasValidMoves(board: Board, types?: TileTypeId[]): boolean {
  const size = board.length;
  const tileTypes = types ?? getTypes(6);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const pos = { row, col };
      if (col + 1 < size && wouldCreateMatch(board, pos, { row, col: col + 1 })) return true;
      if (row + 1 < size && wouldCreateMatch(board, pos, { row: row + 1, col })) return true;
    }
  }

  void tileTypes;
  return false;
}

export function shuffleBoard(board: Board, tileTypeCount: number): Board {
  const types = getTypes(tileTypeCount);
  let next: Board;
  do {
    next = createBoard(board.length, tileTypeCount);
  } while (!hasValidMoves(next, types));
  return next;
}

export function hasBombAt(specials: SpecialBoard, pos: Position): boolean {
  return specials[pos.row][pos.col] !== null;
}

export function getSpecialLabel(type: SpecialType): string {
  switch (type) {
    case 'bomb-row':
      return '橫排炸彈';
    case 'bomb-col':
      return '直排炸彈';
    case 'bomb-area':
      return '範圍炸彈';
  }
}
