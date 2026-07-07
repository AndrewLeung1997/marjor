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
              <div className="menu-tile"><TileFaceLarge type="wan5" /></div>
              <div className="menu-tile"><TileFaceLarge type="tong3" /></div>
              <div className="menu-tile"><TileFaceLarge type="suo7" /></div>
              <div className="menu-tile"><TileFaceLarge type="zhong" /></div>
            </div>
            <h1 className="menu__title">麻雀消消樂</h1>
            <p className="menu__subtitle">中國麻雀版 Candy Crush</p>
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
            <p>拖曳交換牌面 · 限時三消 · 炸彈連鎖</p>
            <p>簡單 · 中等 · 困難 共 15 關</p>
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
