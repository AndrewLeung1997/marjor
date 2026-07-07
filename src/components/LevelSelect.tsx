import { DIFFICULTY_LABELS, LEVELS, formatTime, getLevelsByDifficulty } from '../data/levels';
import type { Difficulty, LevelResult } from '../types';

interface LevelSelectProps {
  isLevelUnlocked: (id: number) => boolean;
  getLevelResult: (id: number) => LevelResult | undefined;
  onSelectLevel: (id: number) => void;
  onBack: () => void;
  completedCount: number;
}

function Stars({ count }: { count: number }) {
  return (
    <span className="stars" aria-label={`${count} 星`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`star ${i <= count ? 'star--filled' : ''}`}>
          ★
        </span>
      ))}
    </span>
  );
}

export function LevelSelect({
  isLevelUnlocked,
  getLevelResult,
  onSelectLevel,
  onBack,
  completedCount,
}: LevelSelectProps) {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="level-select">
      <header className="level-select__header">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          ← 返回
        </button>
        <div>
          <h2>選擇關卡</h2>
          <p className="level-select__progress">
            已通關 {completedCount} / {LEVELS.length} 關
          </p>
        </div>
      </header>

      {difficulties.map((diff) => (
        <section key={diff} className="level-select__section">
          <h3 className={`difficulty-badge difficulty-badge--${diff}`}>
            {DIFFICULTY_LABELS[diff]}
          </h3>
          <div className="level-grid">
            {getLevelsByDifficulty(diff).map((level) => {
              const unlocked = isLevelUnlocked(level.id);
              const result = getLevelResult(level.id);

              return (
                <button
                  key={level.id}
                  type="button"
                  className={`level-card ${unlocked ? '' : 'level-card--locked'} ${result ? 'level-card--completed' : ''}`}
                  onClick={() => unlocked && onSelectLevel(level.id)}
                  disabled={!unlocked}
                >
                  <span className="level-card__num">{level.id}</span>
                  <span className="level-card__name">{level.name}</span>
                  {result ? (
                    <Stars count={result.stars} />
                  ) : unlocked ? (
                    <span className="level-card__hint">
                      {formatTime(level.timeLimit)} · {level.targetScore}分
                    </span>
                  ) : (
                    <span className="level-card__lock">🔒</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
