
import { useState, useRef, useEffect } from 'react';
import { generateSequence } from '../utils/gameLogic';
import { useAuth } from './useAuth';
import { saveScore } from '../utils/scoreStorage';
import type { GameState, GameLogicReturn, DisplayMode } from '../types/game';

export function useGameLogic(): GameLogicReturn {
  // Existing state
  const [gameState, setGameState] = useState<GameState>('idle');
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('sequential');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get auth session
  const { session } = useAuth();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startLevel = (currentLevel: number) => {
    const newSequence = generateSequence(currentLevel + 2);
    setSequence(newSequence);
    setPlayerInput([]);
    setGameState('displaying');

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Adjust display time based on mode
    const displayTime = displayMode === 'sequential' 
      ? (currentLevel + 2) * 1000  // Original timing
      : Math.max(3000, (currentLevel + 2) * 500); // Longer time for simultaneous display

    timeoutRef.current = setTimeout(() => {
      setGameState('recall');
    }, displayTime);
  };

  // Add toggle function
  const toggleDisplayMode = () => {
    setDisplayMode(prevMode => 
      prevMode === 'sequential' ? 'simultaneous' : 'sequential'
    );
  };

  const startGame = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLevel(1);
    setScore(0);
    startLevel(1);
  };

  const handleNumberPress = (num: number) => {
    if (gameState !== 'recall') return;

    const newInput = [...playerInput, num];
    setPlayerInput(newInput);

    if (newInput.length === sequence.length) {
      checkAnswer(newInput);
    }
  };

  const handleDeletePress = () => {
    if (gameState !== 'recall' || playerInput.length === 0) {
      return;
    }
    setPlayerInput(prevInput => prevInput.slice(0, -1));
  };

  const checkAnswer = (input: number[]) => {
    const isCorrect = input.every((num, index) => num === sequence[index]);

    if (isCorrect) {
      const newScore = score + level * 10;
      setScore(newScore);
      setGameState('success');
      
      timeoutRef.current = setTimeout(() => {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        startLevel(nextLevel);
      }, 1500);
    } else {
      setGameState('failure');
      
      // Save score when game ends (only if user is logged in and score > 0)
      if (session.isAuthenticated && session.user && score > 0) {
        saveScore(session.user.id, session.user.username, score, level);
      }
    }
  };

  return {
    gameState,
    level,
    sequence,
    playerInput,
    score,
    startGame,
    handleNumberPress,
    handleDeletePress,
    displayMode,
    toggleDisplayMode
  };
}
