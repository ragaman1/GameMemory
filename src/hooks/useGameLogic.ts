// app/hooks/useGameLogic.ts
import { useState, useRef, useEffect } from 'react';
import { generateSequence } from '../utils/gameLogic';
import type {GameState, GameLogicReturn, DisplayMode} from '../types/game';

export function useGameLogic(): GameLogicReturn {
  // Existing state
  const [gameState, setGameState] = useState<GameState>('idle');
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('sequential');
  
  // New state for lives system
  const [lives, setLives] = useState(3);
  const [lastFailedSequence, setLastFailedSequence] = useState<{
    correct: number[],
    player: number[]
  } | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    setLives(3);
    setLastFailedSequence(null);
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
      setScore(score + level * 10);
      setGameState('success');
      
      timeoutRef.current = setTimeout(() => {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        startLevel(nextLevel);
      }, 1500);
    } else {
      // Enhanced failure handling
      setLastFailedSequence({ correct: sequence, player: input });
      setLives(prevLives => prevLives - 1);
      
      if (lives <= 1) {
        // Game over if this was the last life
        setGameState('gameover');
      } else {
        // Enter review mode
        setGameState('review');
        
        // After showing review, go back to previous level
        timeoutRef.current = setTimeout(() => {
          const previousLevel = Math.max(1, level - 1);
          setLevel(previousLevel);
          startLevel(previousLevel);
        }, 4000); // Give enough time to review mistakes
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
    toggleDisplayMode,
    lives,
    lastFailedSequence
  };
}