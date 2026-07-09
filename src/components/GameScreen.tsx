import { useCallback, useEffect, useRef, useState } from 'react';
import { submitScore } from '../api/leaderboard';
import { GameBoard } from './GameBoard';
import { GameHUD } from './GameHUD';
import { ResultModal, type LeaderboardUiState } from './ResultModal';
import { calcStars, LEVELS } from '../data/levels';
import { getLoseMessage, getPhaseLabel, useGame } from '../hooks/useGame';
import { usePlayerName } from '../hooks/usePlayerName';

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
  const [leaderboardState, setLeaderboardState] = useState<LeaderboardUiState>('idle');
  const [leaderboardMessage, setLeaderboardMessage] = useState('');
  const submittedRef = useRef(false);

  const { playerName, setPlayerName } = usePlayerName();

  const handleWin = (score: number) => {
    onWin(score);
    setFinalScore(score);
    setResultWon(true);
    setShowResult(true);
  };

  const { level, state, handleTileClick, attemptSwap, reset } = useGame(levelId, handleWin);

  const postToLeaderboard = useCallback(
    async (name: string) => {
      const trimmed = setPlayerName(name);
      if (trimmed.length < 2) return;

      setLeaderboardState('submitting');
      try {
        const stars = calcStars(level, finalScore);
        const res = await submitScore({
          name: trimmed,
          levelId,
          score: finalScore,
          stars,
        });
        setLeaderboardState('success');
        setLeaderboardMessage(
          res.improved ? `線上排名 #${res.rank} · 總分 ${res.totalScore.toLocaleString()}` : (res.message ?? '未刷新紀錄')
        );
      } catch {
        setLeaderboardState('error');
        setLeaderboardMessage('無法連線排行榜，部署至 Netlify 後即可使用');
      }
    },
    [finalScore, level, levelId, setPlayerName]
  );

  useEffect(() => {
    if (!showResult || !resultWon || submittedRef.current) return;

    submittedRef.current = true;

    if (!playerName || playerName.length < 2) {
      setLeaderboardState('need-name');
      return;
    }

    void postToLeaderboard(playerName);
  }, [showResult, resultWon, playerName, postToLeaderboard]);

  useEffect(() => {
    submittedRef.current = false;
    setLeaderboardState('idle');
    setLeaderboardMessage('');
  }, [levelId]);

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
        bombs={state.bombs}
        movesUntilSpawn={state.movesUntilSpawn}
        phaseLabel={getPhaseLabel(state.phase)}
        onBack={onBack}
        onRestart={() => {
          reset();
          setShowResult(false);
          submittedRef.current = false;
          setLeaderboardState('idle');
        }}
      />

      <div className="game-board-area">
        <GameBoard
          board={state.board}
          bombs={state.bombs}
          selected={state.selected}
          lastMatched={state.lastMatched}
          phase={state.phase}
          onTileClick={handleTileClick}
          onSwap={attemptSwap}
        />
      </div>

      {showResult && (
        <ResultModal
          level={level}
          score={finalScore}
          won={resultWon}
          loseMessage={getLoseMessage(state.loseReason)}
          hasNext={levelId < LEVELS.length && resultWon}
          leaderboardState={leaderboardState}
          leaderboardMessage={leaderboardMessage}
          onSubmitLeaderboard={(name) => void postToLeaderboard(name)}
          onNext={() => {
            setShowResult(false);
            submittedRef.current = false;
            setLeaderboardState('idle');
            onNextLevel();
          }}
          onRetry={() => {
            reset();
            setShowResult(false);
            submittedRef.current = false;
            setLeaderboardState('idle');
          }}
          onMenu={onBack}
        />
      )}
    </div>
  );
}
