import { useCallback, useEffect, useRef, useState } from 'react';
import { getBombConfig } from '../data/bombs';
import { getLevel } from '../data/levels';
import {
  applyGravity,
  areAdjacent,
  calcDefuseScore,
  calcMatchScore,
  createBoard,
  createEmptyBombs,
  ensurePlayable,
  findMatchGroups,
  refillBoardSafe,
  removeAt,
  resolveMatchGroups,
  spawnBomb,
  swapBombs,
  swapTiles,
  tickBombs,
  wouldCreateMatch,
} from '../utils/gameEngine';
import { getTilePool } from '../data/tiles';
import type { GamePhase, GameState, LevelConfig, LoseReason, Position } from '../types';

const ANIM_SWAP = 200;
const ANIM_MATCH = 300;
const ANIM_FALL = 300;

function initState(level: LevelConfig): GameState {
  const size = level.gridSize;
  const tilePool = getTilePool(level.tileTypeCount, level.id);
  const bombConfig = getBombConfig(level.difficulty);

  return {
    board: createBoard(size, level.tileTypeCount, level.id),
    bombs: createEmptyBombs(size),
    tilePool,
    score: 0,
    movesLeft: level.moves,
    timeLeft: level.timeLimit,
    movesUntilSpawn: bombConfig.spawnEveryMoves,
    selected: null,
    phase: 'idle',
    combo: 0,
    lastMatched: [],
  };
}

export function useGame(levelId: number, onWin: (score: number) => void) {
  const level = getLevel(levelId)!;
  const bombConfig = getBombConfig(level.difficulty);
  const [state, setState] = useState<GameState>(() => initState(level));
  const processingRef = useRef(false);
  const onWinRef = useRef(onWin);
  onWinRef.current = onWin;

  const reset = useCallback(() => {
    setState(initState(level));
    processingRef.current = false;
  }, [level]);

  useEffect(() => {
    reset();
  }, [levelId, reset]);

  // 關卡計時 + 炸彈倒計時（動畫進行中暫停）
  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => {
        if (s.phase === 'won' || s.phase === 'lost') return s;

        let next = { ...s };

        // 關卡時間
        if (s.timeLeft <= 1) {
          return { ...next, timeLeft: 0, phase: 'lost', loseReason: 'time' as LoseReason };
        }
        next = { ...next, timeLeft: s.timeLeft - 1 };

        // 炸彈倒計時（僅 idle 時走秒）
        if (s.phase === 'idle') {
          const { bombs, exploded } = tickBombs(s.bombs);
          next.bombs = bombs;
          if (exploded) {
            return { ...next, phase: 'lost', loseReason: 'bomb' as LoseReason };
          }
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [levelId]);

  const settleBoard = useCallback(
    async (
      board: GameState['board'],
      bombs: GameState['bombs'],
      score: number,
      tilePool: GameState['tilePool']
    ) => {
      let currentBoard = board;
      let currentBombs = bombs;
      const currentScore = score;

      setState((s) => ({ ...s, phase: 'falling' }));
      await delay(100);

      const fallen = applyGravity(currentBoard, currentBombs);
      currentBoard = fallen.board;
      currentBombs = fallen.bombs;
      setState((s) => ({ ...s, board: currentBoard, bombs: currentBombs }));
      await delay(ANIM_FALL);

      currentBoard = refillBoardSafe(currentBoard, tilePool);
      setState((s) => ({ ...s, board: currentBoard }));
      await delay(ANIM_FALL);

      return { board: currentBoard, bombs: currentBombs, score: currentScore };
    },
    []
  );

  const processMatches = useCallback(
    async (
      board: GameState['board'],
      bombs: GameState['bombs'],
      score: number,
      combo: number,
      movesLeft: number,
      tilePool: GameState['tilePool']
    ) => {
      let currentBoard = board;
      let currentBombs = bombs;
      let currentScore = score;
      let currentCombo = combo;

      while (true) {
        const groups = findMatchGroups(currentBoard);
        if (groups.length === 0) break;

        const toRemove = resolveMatchGroups(groups);
        currentCombo += 1;

        setState((s) => ({
          ...s,
          phase: 'matching',
          lastMatched: toRemove,
          score: currentScore,
          combo: currentCombo,
        }));
        await delay(ANIM_MATCH);

        const removed = removeAt(currentBoard, currentBombs, toRemove);
        currentBoard = removed.board;
        currentBombs = removed.bombs;
        currentScore += calcMatchScore(toRemove.length, currentCombo);
        if (removed.defused > 0) {
          currentScore += calcDefuseScore(removed.defused);
        }

        setState((s) => ({
          ...s,
          board: currentBoard,
          bombs: currentBombs,
          score: currentScore,
          lastMatched: [],
        }));

        const settled = await settleBoard(currentBoard, currentBombs, currentScore, tilePool);
        currentBoard = settled.board;
        currentBombs = settled.bombs;
      }

      if (currentScore >= level.targetScore) {
        setState((s) => ({ ...s, phase: 'won', score: currentScore, combo: 0 }));
        onWinRef.current(currentScore);
        processingRef.current = false;
        return;
      }

      if (movesLeft <= 0) {
        setState((s) => ({
          ...s,
          phase: 'lost',
          score: currentScore,
          combo: 0,
          loseReason: 'moves',
        }));
        processingRef.current = false;
        return;
      }

      setState((s) => ({
        ...s,
        board: ensurePlayable(currentBoard, tilePool),
        bombs: currentBombs,
        score: currentScore,
        combo: 0,
        phase: 'idle',
      }));
      processingRef.current = false;
    },
    [level, settleBoard]
  );

  const attemptSwap = useCallback(
    async (from: Position, to: Position) => {
      if (processingRef.current || state.phase !== 'idle') return;
      if (state.timeLeft <= 0) return;
      if (!areAdjacent(from, to)) return;

      const { board, bombs, score, movesLeft, tilePool, movesUntilSpawn } = state;

      if (!wouldCreateMatch(board, from, to)) {
        processingRef.current = true;
        setState((s) => ({ ...s, phase: 'swapping', selected: null }));

        const swapped = swapTiles(board, from, to);
        const swappedBombs = swapBombs(bombs, from, to);
        setState((s) => ({ ...s, board: swapped, bombs: swappedBombs }));
        await delay(ANIM_SWAP);

        setState((s) => ({ ...s, board, bombs, phase: 'idle' }));
        processingRef.current = false;
        return;
      }

      processingRef.current = true;
      setState((s) => ({ ...s, phase: 'swapping', selected: null }));

      const currentBoard = swapTiles(board, from, to);
      const currentBombs = swapBombs(bombs, from, to);
      const newMovesLeft = movesLeft - 1;
      let nextMovesUntilSpawn = movesUntilSpawn - 1;
      let nextBombs = currentBombs;

      if (nextMovesUntilSpawn <= 0) {
        nextBombs = spawnBomb(currentBoard, currentBombs, level.difficulty);
        nextMovesUntilSpawn = bombConfig.spawnEveryMoves;
      }

      setState((s) => ({
        ...s,
        board: currentBoard,
        bombs: nextBombs,
        movesLeft: newMovesLeft,
        movesUntilSpawn: nextMovesUntilSpawn,
      }));

      await delay(ANIM_SWAP);

      await processMatches(currentBoard, nextBombs, score, 0, newMovesLeft, tilePool);
    },
    [state, processMatches, level.difficulty, bombConfig.spawnEveryMoves]
  );

  const handleTileClick = useCallback(
    async (pos: Position) => {
      if (processingRef.current || state.phase !== 'idle') return;
      if (state.timeLeft <= 0) return;

      const { selected } = state;

      if (!selected) {
        setState((s) => ({ ...s, selected: pos }));
        return;
      }

      if (selected.row === pos.row && selected.col === pos.col) {
        setState((s) => ({ ...s, selected: null }));
        return;
      }

      if (!areAdjacent(selected, pos)) {
        setState((s) => ({ ...s, selected: pos }));
        return;
      }

      await attemptSwap(selected, pos);
    },
    [state, attemptSwap]
  );

  return {
    level,
    state,
    bombConfig,
    handleTileClick,
    attemptSwap,
    reset,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getPhaseLabel(phase: GamePhase): string {
  switch (phase) {
    case 'swapping':
      return '交換中…';
    case 'matching':
      return '消除！';
    case 'falling':
      return '落牌中…';
    case 'won':
      return '通關！';
    case 'lost':
      return '挑戰失敗';
    default:
      return '';
  }
}

export function getLoseMessage(reason?: LoseReason): string {
  switch (reason) {
    case 'bomb':
      return '炸彈爆炸！未能及時消除';
    case 'time':
      return '時間到！再試一次吧';
    case 'moves':
      return '步數已用盡，再試一次吧';
    default:
      return '挑戰失敗，再試一次吧';
  }
}
