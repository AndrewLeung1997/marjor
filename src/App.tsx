import { useState } from 'react';
import { GameScreen } from './components/GameScreen';
import { LevelSelect } from './components/LevelSelect';
import { TileFaceLarge } from './components/TileFace';
import { useProgress } from './hooks/useProgress';
import { LEVELS } from './data/levels';

type Screen = 'menu' | 'levels' | 'game';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [currentLevel, setCurrentLevel] = useState(1);

  const {
    isLevelUnlocked,
    getLevelResult,
    recordWin,
    setLastPlayed,
    resetProgress,
    completedCount,
  } = useProgress();

  const startLevel = (id: number) => {
    setCurrentLevel(id);
    setLastPlayed(id);
    setScreen('game');
  };

  if (screen === 'menu') {
    return (
      <div className="app">
        <div className="menu">
          <div className="menu__hero">
            <div className="menu__tiles" aria-hidden="true">
              <div className="menu-tile"><TileFaceLarge type="red" /></div>
              <div className="menu-tile"><TileFaceLarge type="yellow" /></div>
              <div className="menu-tile"><TileFaceLarge type="cyan" /></div>
              <div className="menu-tile"><TileFaceLarge type="purple" /></div>
            </div>
            <h1 className="menu__title">色彩消消樂</h1>
            <p className="menu__subtitle">九色三消 · 難度越高顏色越多</p>
          </div>

          <div className="menu__stats">
            <p>已通關 {completedCount} / {LEVELS.length} 關</p>
          </div>

          <div className="menu__actions">
            <button
              type="button"
              className="btn btn--primary btn--large"
              onClick={() => setScreen('levels')}
            >
              開始遊戲
            </button>
            {completedCount > 0 && (
              <button type="button" className="btn btn--ghost" onClick={resetProgress}>
                重置進度
              </button>
            )}
          </div>

          <footer className="menu__footer">
            <p>拖曳交換色塊 · 限時三消 · 倒數炸彈</p>
            <p>簡單 3–5 色 · 中等 5–7 色 · 困難 8–9 色</p>
          </footer>
        </div>
      </div>
    );
  }

  if (screen === 'levels') {
    return (
      <div className="app">
        <LevelSelect
          isLevelUnlocked={isLevelUnlocked}
          getLevelResult={getLevelResult}
          onSelectLevel={startLevel}
          onBack={() => setScreen('menu')}
          completedCount={completedCount}
        />
      </div>
    );
  }

  return (
    <GameScreen
      key={currentLevel}
      levelId={currentLevel}
      onWin={(score) => recordWin(currentLevel, score)}
      onBack={() => setScreen('levels')}
      onNextLevel={() => setCurrentLevel((id) => id + 1)}
    />
  );
}
