import { calcStars } from '../data/levels';
import type { LevelConfig } from '../types';

interface ResultModalProps {
  level: LevelConfig;
  score: number;
  won: boolean;
  loseMessage?: string;
  onNext?: () => void;
  onRetry: () => void;
  onMenu: () => void;
  hasNext: boolean;
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
}: ResultModalProps) {
  const stars = won ? calcStars(level, score) : 0;

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
