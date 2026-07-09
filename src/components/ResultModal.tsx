import { useState } from 'react';
import { calcStars } from '../data/levels';
import type { LevelConfig } from '../types';

export type LeaderboardUiState = 'idle' | 'submitting' | 'success' | 'error' | 'need-name';

interface ResultModalProps {
  level: LevelConfig;
  score: number;
  won: boolean;
  loseMessage?: string;
  onNext?: () => void;
  onRetry: () => void;
  onMenu: () => void;
  hasNext: boolean;
  leaderboardState?: LeaderboardUiState;
  leaderboardMessage?: string;
  onSubmitLeaderboard?: (name: string) => void;
}

function Stars({ count }: { count: number }) {
  return (
    <div className="result-stars">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`result-star ${i <= count ? 'result-star--filled' : ''}`}
          style={{ animationDelay: `${i * 0.2}s` }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function ResultModal({
  level,
  score,
  won,
  loseMessage,
  onNext,
  onRetry,
  onMenu,
  hasNext,
  leaderboardState = 'idle',
  leaderboardMessage,
  onSubmitLeaderboard,
}: ResultModalProps) {
  const stars = won ? calcStars(level, score) : 0;
  const [draftName, setDraftName] = useState('');

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className={`result-modal ${won ? 'result-modal--win' : 'result-modal--lose'}`}>
        <h2>{won ? '恭喜通關！' : '挑戰失敗'}</h2>
        <p className="result-modal__subtitle">
          {won ? `第 ${level.id} 關 · ${level.name}` : loseMessage ?? '再試一次吧'}
        </p>

        {won && <Stars count={stars} />}

        <p className="result-modal__score">
          得分 <strong>{score.toLocaleString()}</strong>
          {won && (
            <span className="result-modal__target">
              {' '}
              / 目標 {level.targetScore.toLocaleString()}
            </span>
          )}
        </p>

        {won && leaderboardState !== 'idle' && (
          <div className="result-modal__leaderboard">
            {leaderboardState === 'submitting' && <p>正在提交排行榜…</p>}
            {leaderboardState === 'success' && (
              <p className="result-modal__leaderboard-ok">{leaderboardMessage}</p>
            )}
            {leaderboardState === 'error' && (
              <p className="result-modal__leaderboard-err">{leaderboardMessage ?? '無法連線排行榜'}</p>
            )}
            {leaderboardState === 'need-name' && onSubmitLeaderboard && (
              <div className="result-modal__name-form">
                <p>輸入暱稱以登上線上排行榜</p>
                <div className="result-modal__name-row">
                  <input
                    className="leaderboard__input"
                    value={draftName}
                    maxLength={16}
                    placeholder="2–16 字"
                    onChange={(e) => setDraftName(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn--secondary"
                    disabled={draftName.trim().length < 2}
                    onClick={() => onSubmitLeaderboard(draftName.trim())}
                  >
                    提交
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="result-modal__actions">
          {won && hasNext && onNext && (
            <button type="button" className="btn btn--primary" onClick={onNext}>
              下一關 →
            </button>
          )}
          <button type="button" className="btn btn--secondary" onClick={onRetry}>
            再玩一次
          </button>
          <button type="button" className="btn btn--ghost" onClick={onMenu}>
            返回選單
          </button>
        </div>
      </div>
    </div>
  );
}
