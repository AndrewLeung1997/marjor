import { useCallback, useEffect, useState } from 'react';
import { calcStars, getLevel, LEVELS } from '../data/levels';
import type { GameProgress } from '../types';

const STORAGE_KEY = 'mahjong-crush-progress';

const DEFAULT_PROGRESS: GameProgress = {
  unlockedLevels: [1],
  completedLevels: {},
};

function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as GameProgress;
    return {
      unlockedLevels: parsed.unlockedLevels?.length ? parsed.unlockedLevels : [1],
      completedLevels: parsed.completedLevels ?? {},
      lastPlayedLevel: parsed.lastPlayedLevel,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function saveProgress(progress: GameProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useProgress() {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const isLevelUnlocked = useCallback(
    (levelId: number) => progress.unlockedLevels.includes(levelId),
    [progress.unlockedLevels]
  );

  const getLevelResult = useCallback(
    (levelId: number) => progress.completedLevels[levelId],
    [progress.completedLevels]
  );

  const recordWin = useCallback((levelId: number, score: number) => {
    setProgress((prev) => {
      const level = getLevel(levelId);
      if (!level) return prev;

      const stars = calcStars(level, score);
      const existing = prev.completedLevels[levelId];
      const bestScore = Math.max(existing?.bestScore ?? 0, score);
      const bestStars = Math.max(existing?.stars ?? 0, stars);

      const nextUnlocked = new Set(prev.unlockedLevels);
      nextUnlocked.add(levelId);
      if (levelId < LEVELS.length) nextUnlocked.add(levelId + 1);

      return {
        unlockedLevels: Array.from(nextUnlocked).sort((a, b) => a - b),
        completedLevels: {
          ...prev.completedLevels,
          [levelId]: { stars: bestStars, bestScore },
        },
        lastPlayedLevel: levelId,
      };
    });
  }, []);

  const setLastPlayed = useCallback((levelId: number) => {
    setProgress((prev) => ({ ...prev, lastPlayedLevel: levelId }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({ ...DEFAULT_PROGRESS });
  }, []);

  const completedCount = Object.keys(progress.completedLevels).length;

  return {
    progress,
    isLevelUnlocked,
    getLevelResult,
    recordWin,
    setLastPlayed,
    resetProgress,
    completedCount,
  };
}
