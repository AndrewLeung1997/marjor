import type { Config } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const STORE_NAME = 'color-crush-leaderboard';
const MAX_NAME_LEN = 16;
const MAX_LEVEL = 32;

interface PlayerRecord {
  name: string;
  totalScore: number;
  totalStars: number;
  levelsCleared: number;
  bestScores: Record<string, number>;
  bestStars: Record<string, number>;
  updatedAt: string;
}

interface SubmitBody {
  name?: string;
  levelId?: number;
  score?: number;
  stars?: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').slice(0, MAX_NAME_LEN);
}

function playerKey(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_-]/gu, '')
    .slice(0, 32);
  return `player:${slug || 'anonymous'}`;
}

function recalcTotals(record: PlayerRecord): PlayerRecord {
  const bestScores = record.bestScores ?? {};
  const bestStars = record.bestStars ?? {};
  record.totalScore = Object.values(bestScores).reduce((sum, n) => sum + n, 0);
  record.totalStars = Object.values(bestStars).reduce((sum, n) => sum + n, 0);
  record.levelsCleared = Object.keys(bestScores).length;
  return record;
}

async function loadAllPlayers(store: ReturnType<typeof getStore>): Promise<PlayerRecord[]> {
  const list = await store.list({ prefix: 'player:' });
  const players: PlayerRecord[] = [];

  for (const item of list.blobs) {
    const data = await store.get(item.key, { type: 'json' });
    if (data && typeof data === 'object' && 'name' in data) {
      players.push(recalcTotals(data as PlayerRecord));
    }
  }

  return players.sort(
    (a, b) => b.totalScore - a.totalScore || b.totalStars - a.totalStars || b.levelsCleared - a.levelsCleared
  );
}

async function getRankByName(store: ReturnType<typeof getStore>, name: string): Promise<number> {
  const players = await loadAllPlayers(store);
  const index = players.findIndex((p) => p.name === name);
  return index >= 0 ? index + 1 : players.length + 1;
}

export default async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const store = getStore({ name: STORE_NAME, consistency: 'strong' });

  try {
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const limit = Math.min(Math.max(Number(url.searchParams.get('limit') ?? 50), 1), 100);
      const players = await loadAllPlayers(store);

      return json({
        entries: players.slice(0, limit).map((p, i) => ({
          rank: i + 1,
          name: p.name,
          totalScore: p.totalScore,
          totalStars: p.totalStars,
          levelsCleared: p.levelsCleared,
          updatedAt: p.updatedAt,
        })),
      });
    }

    if (req.method === 'POST') {
      const body = (await req.json()) as SubmitBody;
      const name = normalizeName(body.name ?? '');
      const levelId = Number(body.levelId);
      const score = Math.floor(Number(body.score));
      const stars = Math.min(Math.max(Math.floor(Number(body.stars)), 0), 3);

      if (name.length < 2) {
        return json({ error: '名稱至少需要 2 個字' }, 400);
      }
      if (!Number.isFinite(levelId) || levelId < 1 || levelId > MAX_LEVEL) {
        return json({ error: '無效的關卡' }, 400);
      }
      if (!Number.isFinite(score) || score < 0 || score > 999_999) {
        return json({ error: '無效的分數' }, 400);
      }

      const key = playerKey(name);
      const existing =
        ((await store.get(key, { type: 'json' })) as PlayerRecord | null) ?? {
          name,
          totalScore: 0,
          totalStars: 0,
          levelsCleared: 0,
          bestScores: {},
          bestStars: {},
          updatedAt: new Date().toISOString(),
        };

      existing.name = name;
      const levelKey = String(levelId);
      const prevBest = existing.bestScores[levelKey] ?? 0;
      const prevStars = existing.bestStars[levelKey] ?? 0;

      if (score <= prevBest) {
        const rank = await getRankByName(store, name);
        return json({
          ok: true,
          improved: false,
          rank,
          totalScore: existing.totalScore,
          message: '未超越本關最佳紀錄',
        });
      }

      existing.bestScores[levelKey] = score;
      existing.bestStars[levelKey] = Math.max(stars, prevStars);
      existing.updatedAt = new Date().toISOString();
      recalcTotals(existing);

      await store.setJSON(key, existing);
      const rank = await getRankByName(store, name);

      return json({
        ok: true,
        improved: true,
        rank,
        totalScore: existing.totalScore,
        totalStars: existing.totalStars,
        levelsCleared: existing.levelsCleared,
        message: '已更新排行榜',
      });
    }

    return json({ error: '不支援的請求' }, 405);
  } catch (err) {
    console.error('leaderboard error', err);
    return json({ error: '伺服器錯誤' }, 500);
  }
};

export const config: Config = {
  path: '/api/leaderboard',
};
