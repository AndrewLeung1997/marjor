import { useCallback, useState } from 'react';

const STORAGE_KEY = 'color-crush-player-name';

function loadName(): string {
  try {
    return localStorage.getItem(STORAGE_KEY)?.trim() ?? '';
  } catch {
    return '';
  }
}

export function usePlayerName() {
  const [playerName, setPlayerNameState] = useState(loadName);

  const setPlayerName = useCallback((name: string) => {
    const trimmed = name.trim().slice(0, 16);
    setPlayerNameState(trimmed);
    try {
      if (trimmed) localStorage.setItem(STORAGE_KEY, trimmed);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return trimmed;
  }, []);

  return { playerName, setPlayerName };
}
