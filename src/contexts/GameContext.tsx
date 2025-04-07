// src/contexts/GameContext.tsx//
import React, { createContext, useContext } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import type { GameLogicReturn } from '../types/game';

// Create the context
const GameContext = createContext<GameLogicReturn | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const gameLogic = useGameLogic();
  
  return (
    <GameContext.Provider value={gameLogic}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};