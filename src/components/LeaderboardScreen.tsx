import { useCallback, useEffect, useState } from 'react';
import { fetchLeaderboard, type LeaderboardEntry } from '../api/leaderboard';
import { usePlayerName } from '../hooks/usePlayerName';

interface LeaderboardScreenProps {
  onBack: () => void;
}

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const { playerName, setPlayerName } = usePlayerName();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draftName, setDraftName] = useState(playerName);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEntries(await fetchLeaderboard(50));
    } catch (err) {
      setError(err instanceof Error ? err.message : '無法載入排行榜');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setDraftName(playerName);
  }, [playerName]);

  const saveName = () => {
    setPlayerName(draftName);
  };

  return (
    <div className="leaderboard">
      <header className="leaderboard__header">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          ← 返回
        </button>
        <h2>線上排行榜</h2>
        <button type="button" className="btn btn--ghost" onClick={() => void load()} disabled={loading}>
          刷新
        </button>
      </header>

      <div className="leaderboard__name-card">
        <label className="leaderboard__label" htmlFor="player-name">
          你的暱稱（通關後自動上榜）
        </label>
        <div className="leaderboard__name-row">
          <input
            id="player-name"
            className="leaderboard__input"
            value={draftName}
            maxLength={16}
            placeholder="輸入 2–16 字"
            onChange={(e) => setDraftName(e.target.value)}
          />
          <button type="button" className="btn btn--secondary" onClick={saveName}>
            儲存
          </button>
        </div>
        {playerName && <p className="leaderboard__current">目前暱稱：{playerName}</p>}
      </div>

      <p className="leaderboard__hint">以所有關卡最佳分數總和排名</p>

      {loading && <p className="leaderboard__status">載入中…</p>}
      {error && (
        <div className="leaderboard__error">
          <p>{error}</p>
          <p className="leaderboard__error-sub">本地開發請使用 <code>npm run dev:netlify</code></p>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <p className="leaderboard__status">暫無紀錄，成為第一位上榜玩家吧！</p>
      )}

      {!loading && entries.length > 0 && (
        <ol className="leaderboard__list">
          {entries.map((entry) => {
            const isMe = playerName && entry.name === playerName;
            return (
              <li
                key={`${entry.rank}-${entry.name}`}
                className={`leaderboard__item ${isMe ? 'leaderboard__item--me' : ''} ${entry.rank <= 3 ? `leaderboard__item--top${entry.rank}` : ''}`}
              >
                <span className="leaderboard__rank">{entry.rank}</span>
                <div className="leaderboard__info">
                  <span className="leaderboard__player">{entry.name}</span>
                  <span className="leaderboard__meta">
                    {entry.levelsCleared} 關 · ★{entry.totalStars}
                  </span>
                </div>
                <span className="leaderboard__score">{entry.totalScore.toLocaleString()}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
