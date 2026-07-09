export interface LeaderboardEntry {
  rank: number;
  name: string;
  totalScore: number;
  totalStars: number;
  levelsCleared: number;
  updatedAt: string;
}

export interface SubmitScoreResult {
  ok: boolean;
  improved: boolean;
  rank: number;
  totalScore: number;
  totalStars?: number;
  levelsCleared?: number;
  message?: string;
}

const API_URL = '/api/leaderboard';

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? '請求失敗');
  }
  return data;
}

export async function fetchLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API_URL}?limit=${limit}`);
  const data = await parseJson<{ entries: LeaderboardEntry[] }>(res);
  return data.entries;
}

export async function submitScore(payload: {
  name: string;
  levelId: number;
  score: number;
  stars: number;
}): Promise<SubmitScoreResult> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseJson<SubmitScoreResult>(res);
}
