import { useCallback, useEffect, useRef, useState } from 'react';
import { getLevel } from '../data/levels';
import {
  applyBombCreates,
  applyGravity,
  areAdjacent,
  calcBombScore,
  calcMatchScore,
  chainExplode,
  createBoard,
  createEmptySpecials,
  findMatchGroups,
  hasBombAt,
  refillBoard,
  removeAt,
  resolveMatchGroups,
  shuffleBoard,
  swapSpecials,
  swapTiles,
  wouldCreateMatch,
} from '../utils/gameEngine';
import type { GamePhase, GameState, LevelConfig, LoseReason, Position } from '../types';

const ANIM_SWAP = 200;
const ANIM_MATCH = 350;
const ANIM_FALL = 300;
const ANIM_EXPLODE = 400;

function initState(level: LevelConfig): GameState {
  const size = level.gridSize;
  return {
    board: createBoard(size, level.tileTypeCount),
    specials: createEmptySpecials(size),
    score: 0,
    movesLeft: level.moves,
    timeLeft: level.timeLimit,
    selected: null,
    phase: 'idle',
    combo: 0,
    lastMatched: [],
  };
}

export function useGame(levelId: number, onWin: (score: number) => void) {
  const level = getLevel(levelId)!;
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

  // 倒數計時
  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => {
        if (s.phase === 'won' || s.phase === 'lost') return s;
        if (s.timeLeft <= 1) {
          return { ...s, timeLeft: 0, phase: 'lost', loseReason: 'time' as LoseReason };
        }
        return { ...s, timeLeft: s.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(id);
  }, [levelId]);

  const settleBoard = useCallback(
    async (
      board: GameState['board'],
      specials: GameState['specials'],
      score: number
    ): Promise<{ board: GameState['board']; specials: GameState['specials']; score: number }> => {
      let currentBoard = board;
      let currentSpecials = specials;
      const currentScore = score;

      setState((s) => ({ ...s, phase: 'falling' }));
      await delay(100);

      const fallen = applyGravity(currentBoard, currentSpecials);
      currentBoard = fallen.board;
      currentSpecials = fallen.specials;
      setState((s) => ({ ...s, board: currentBoard, specials: currentSpecials }));
      await delay(ANIM_FALL);

      currentBoard = refillBoard(currentBoard, level.tileTypeCount);
      setState((s) => ({ ...s, board: currentBoard }));
      await delay(ANIM_FALL);

      return { board: currentBoard, specials: currentSpecials, score: currentScore };
    },
    [level.tileTypeCount]
  );

  const processMatches = useCallback(
    async (
      board: GameState['board'],
      specials: GameState['specials'],
      score: number,
      combo: number,
      movesLeft: number
    ) => {
      let currentBoard = board;
      let currentSpecials = specials;
      let currentScore = score;
      let currentCombo = combo;

      while (true) {
        const groups = findMatchGroups(currentBoard);
        if (groups.length === 0) break;

        const bombTriggers = findMatchesWithBombs(currentSpecials, groups);
        let clearedPositions: Position[] = [];

        if (bombTriggers.length > 0) {
          setState((s) => ({ ...s, phase: 'exploding' }));
          const exploded = chainExplode(currentBoard, currentSpecials, bombTriggers);
          currentBoard = exploded.board;
          currentSpecials = exploded.specials;
          clearedPositions = exploded.cleared;
          currentCombo += 1;
          currentScore += calcBombScore(clearedPositions.length, currentCombo);
          setState((s) => ({
            ...s,
            board: currentBoard,
            specials: currentSpecials,
            lastMatched: clearedPositions,
            score: currentScore,
            combo: currentCombo,
          }));
          await delay(ANIM_EXPLODE);
        }

        const remainingGroups = findMatchGroups(currentBoard);
        if (remainingGroups.length === 0) {
          if (clearedPositions.length > 0) {
            const settled = await settleBoard(currentBoard, currentSpecials, currentScore);
            currentBoard = settled.board;
            currentSpecials = settled.specials;
            continue;
          }
          break;
        }

        const { toRemove, bombCreates } = resolveMatchGroups(remainingGroups);
        currentCombo += 1;
        currentScore += calcMatchScore(toRemove.length + bombCreates.length, currentCombo);

        setState((s) => ({
          ...s,
          phase: 'matching',
          lastMatched: [...toRemove, ...bombCreates.map((b) => b.pos)],
          score: currentScore,
          combo: currentCombo,
        }));
        await delay(ANIM_MATCH);

        const removed = removeAt(currentBoard, currentSpecials, toRemove);
        currentBoard = removed.board;
        currentSpecials = removed.specials;
        currentSpecials = applyBombCreates(currentBoard, currentSpecials, bombCreates);

        setState((s) => ({
          ...s,
          board: currentBoard,
          specials: currentSpecials,
          lastMatched: [],
        }));

        const settled = await settleBoard(currentBoard, currentSpecials, currentScore);
        currentBoard = settled.board;
        currentSpecials = settled.specials;
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
        board: currentBoard,
        specials: currentSpecials,
        score: currentScore,
        combo: 0,
        phase: 'idle',
      }));
      processingRef.current = false;
    },
    [level, settleBoard]
  );

  const handleTileClick = useCallback(
    async (pos: Position) => {
      if (processingRef.current || state.phase !== 'idle') return;
      if (state.timeLeft <= 0) return;

      const { selected, board, specials, score, movesLeft } = state;

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

      const bombA = hasBombAt(specials, selected);
      const bombB = hasBombAt(specials, pos);
      const isBombSwap = bombA || bombB;

      if (!isBombSwap && !wouldCreateMatch(board, selected, pos)) {
        setState((s) => ({ ...s, selected: pos }));
        return;
      }

      processingRef.current = true;
      setState((s) => ({ ...s, phase: 'swapping', selected: null }));

      let currentBoard = swapTiles(board, selected, pos);
      let currentSpecials = swapSpecials(specials, selected, pos);
      setState((s) => ({
        ...s,
        board: currentBoard,
        specials: currentSpecials,
        movesLeft: s.movesLeft - 1,
      }));

      await delay(ANIM_SWAP);

      const newMovesLeft = movesLeft - 1;

      if (isBombSwap) {
        const triggers: Position[] = [];
        if (bombA) triggers.push(selected);
        if (bombB) triggers.push(pos);

        setState((s) => ({ ...s, phase: 'exploding' }));
        const exploded = chainExplode(currentBoard, currentSpecials, triggers);
        currentBoard = exploded.board;
        currentSpecials = exploded.specials;
        let currentScore = score + calcBombScore(exploded.cleared.length, 1);

        setState((s) => ({
          ...s,
          board: currentBoard,
          specials: currentSpecials,
          lastMatched: exploded.cleared,
          score: currentScore,
          combo: 1,
        }));
        await delay(ANIM_EXPLODE);

        const settled = await settleBoard(
          currentBoard,
          currentSpecials,
          currentScore
        );
        await processMatches(
          settled.board,
          settled.specials,
          settled.score,
          1,
          newMovesLeft
        );
        return;
      }

      await processMatches(currentBoard, currentSpecials, score, 0, newMovesLeft);
    },
    [state, processMatches, settleBoard]
  );

  const shuffle = useCallback(async () => {
    if (processingRef.current || state.phase !== 'idle') return;
    processingRef.current = true;
    const shuffled = shuffleBoard(state.board, level.tileTypeCount);
    setState((s) => ({
      ...s,
      board: shuffled,
      specials: createEmptySpecials(shuffled.length),
      selected: null,
    }));
    await delay(300);
    processingRef.current = false;
  }, [state.board, state.phase, level.tileTypeCount]);

  return {
    level,
    state,
    handleTileClick,
    reset,
    shuffle,
  };
}

function findMatchesWithBombs(
  specials: GameState['specials'],
  groups: Position[][]
): Position[] {
  const matched = new Set<string>();
  for (const group of groups) {
    for (const p of group) matched.add(`${p.row},${p.col}`);
  }
  const triggers: Position[] = [];
  for (const key of matched) {
    const [row, col] = key.split(',').map(Number);
    if (specials[row][col]) triggers.push({ row, col });
  }
  return triggers;
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
    case 'exploding':
      return '炸彈！';
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
    case 'time':
      return '時間到！再試一次吧';
    case 'moves':
      return '步數已用盡，再試一次吧';
    default:
      return '挑戰失敗，再試一次吧';
  }
}
