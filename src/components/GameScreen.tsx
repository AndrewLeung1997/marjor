import { useEffect, useState } from 'react';
import { GameBoard } from './GameBoard';
import { GameHUD } from './GameHUD';
import { ResultModal } from './ResultModal';
import { getLoseMessage, getPhaseLabel, useGame } from '../hooks/useGame';
import { LEVELS } from '../data/levels';

interface GameScreenProps {
  levelId: number;
  onWin: (score: number) => void;
  onBack: () => void;
  onNextLevel: () => void;
}

export function GameScreen({ levelId, onWin, onBack, onNextLevel }: GameScreenProps) {
  const [finalScore, setFinalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [resultWon, setResultWon] = useState(false);

  const handleWin = (score: number) => {
    onWin(score);
    setFinalScore(score);
    setResultWon(true);
    setShowResult(true);
  };

  const { level, state, handleTileClick, reset, shuffle } = useGame(levelId, handleWin);

  useEffect(() => {
    if (state.phase === 'lost' && !showResult) {
      setFinalScore(state.score);
      setResultWon(false);
      setShowResult(true);
    }
  }, [state.phase, state.score, showResult]);

  return (
    <div className="app app--game">
      <GameHUD
        level={level}
        score={state.score}
        movesLeft={state.movesLeft}
        timeLeft={state.timeLeft}
        combo={state.combo}
        phaseLabel={getPhaseLabel(state.phase)}
        onBack={onBack}
        onShuffle={shuffle}
        onRestart={() => {
          reset();
          setShowResult(false);
        }}
      />

      <GameBoard
        board={state.board}
        specials={state.specials}
        selected={state.selected}
        lastMatched={state.lastMatched}
        phase={state.phase}
        onTileClick={handleTileClick}
      />

      {showResult && (
        <ResultModal
          level={level}
          score={finalScore}
          won={resultWon}
          loseMessage={getLoseMessage(state.loseReason)}
          hasNext={levelId < LEVELS.length && resultWon}
          onNext={() => {
            setShowResult(false);
            onNextLevel();
          }}
          onRetry={() => {
            reset();
            setShowResult(false);
          }}
          onMenu={onBack}
        />
      )}
    </div>
  );
}
