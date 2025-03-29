// app/hooks/useGameLogic.ts
import { useState, useRef, useEffect } from 'react';
import { generateSequence } from '../utils/gameLogic';
import type {GameState, GameLogicReturn } from '../types/game';


export default function useGameLogic(): GameLogicReturn {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [score, setScore] = useState(0);
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

    timeoutRef.current = setTimeout(() => {
      setGameState('recall');
    }, (currentLevel + 2) * 1000);
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

  const checkAnswer = (input: number[]) => {
    const isCorrect = input.every((num, index) => num === sequence[index]);

    if (isCorrect) {
      setScore(score + level * 10);
      setGameState('success');
      
      timeoutRef.current = setTimeout(() => {
        setLevel(prev => prev + 1);
        startLevel(level + 1);
      }, 1500);
    } else {
      setGameState('failure');
    }
  };

  return {
    gameState,
    level,
    sequence,
    playerInput,
    score,
    startGame,
    handleNumberPress
  };
}