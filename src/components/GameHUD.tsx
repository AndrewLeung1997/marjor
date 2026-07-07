import { countBombs } from '../data/bombs';
import { calcStars, formatTime } from '../data/levels';
import { getLowestBombCountdown } from '../utils/gameEngine';
import type { BombBoard, LevelConfig } from '../types';

interface GameHUDProps {
  level: LevelConfig;
  score: number;
  movesLeft: number;
  timeLeft: number;
  combo: number;
  bombs: BombBoard;
  movesUntilSpawn: number;
  phaseLabel: string;
  onBack: () => void;
  onShuffle: () => void;
  onRestart: () => void;
}

export function GameHUD({
  level,
  score,
  movesLeft,
  timeLeft,
  combo,
  bombs,
  movesUntilSpawn,
  phaseLabel,
  onBack,
  onShuffle,
  onRestart,
}: GameHUDProps) {
  const progress = Math.min(100, (score / level.targetScore) * 100);
  const stars = calcStars(level, score);
  const timeWarn = timeLeft <= 15;
  const timeCritical = timeLeft <= 5;
  const bombCount = countBombs(bombs);
  const nearestBomb = getLowestBombCountdown(bombs);
  const bombWarn = nearestBomb !== null && nearestBomb <= 5;
  const bombCritical = nearestBomb !== null && nearestBomb <= 3;

  return (
    <div className="game-hud">
      <div className="game-hud__top">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          ← 離開
        </button>
        <div className="game-hud__title">
          <span className="game-hud__level">第 {level.id} 關</span>
          <span className="game-hud__name">{level.name}</span>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onRestart}>
          重來
        </button>
      </div>

      <div className="game-hud__stats">
        <div className="stat">
          <span className="stat__label">分數</span>
          <span className="stat__value">{score.toLocaleString()}</span>
        </div>
        <div className={`stat stat--timer ${timeWarn ? 'stat--warn' : ''} ${timeCritical ? 'stat--critical' : ''}`}>
          <span className="stat__label">時間</span>
          <span className="stat__value">{formatTime(timeLeft)}</span>
        </div>
        <div className="stat">
          <span className="stat__label">步數</span>
          <span className={`stat__value ${movesLeft <= 3 ? 'stat__value--warn' : ''}`}>
            {movesLeft}
          </span>
        </div>
        <div className={`stat stat--bomb ${bombWarn ? 'stat--warn' : ''} ${bombCritical ? 'stat--critical' : ''}`}>
          <span className="stat__label">炸彈</span>
          <span className="stat__value">
            {bombCount > 0 ? `${bombCount} · ${nearestBomb}s` : `— · ${movesUntilSpawn}`}
          </span>
        </div>
        {combo > 0 && (
          <div className="stat stat--combo">
            <span className="stat__label">連擊</span>
            <span className="stat__value">×{combo}</span>
          </div>
        )}
      </div>

      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
        <div className="progress-bar__stars">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`progress-star ${i <= stars ? 'progress-star--active' : ''}`}
              style={{ left: `${(level.stars[i - 1] / level.targetScore) * 100}%` }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {phaseLabel && <p className="game-hud__phase">{phaseLabel}</p>}

      <p className="game-hud__hint">
        拖曳牌面交換 · 三消帶炸彈的牌可拆除 · 倒數歸零即輸
      </p>

      <button type="button" className="btn btn--secondary btn--shuffle" onClick={onShuffle}>
        洗牌
      </button>
    </div>
  );
}
