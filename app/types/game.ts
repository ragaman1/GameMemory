// app/types/game.ts

// Game state types
export type GameState = 'idle' | 'displaying' | 'recall' | 'success' | 'failure';

// Component props
export type StatusBannerProps = {
  state: GameState;
};

export type SequenceDisplayProps = {
  sequence: number[];
  isDisplaying: boolean;
  level: number;
};

export type NumberPadProps = {
  onNumberPress: (num: number) => void;
  disabled: boolean;
};

export type InputIndicatorProps = {
  sequence: number[];
  playerInput: number[];
};

// Game logic return type
export type GameLogicReturn = {
  gameState: GameState;
  level: number;
  sequence: number[];
  playerInput: number[];
  score: number;
  startGame: () => void;
  handleNumberPress: (num: number) => void;
  handleDeletePress: () => void;
};

// Optional: Configuration types
export type GameConfig = {
  initialLevel?: number;
  levelMultiplier?: number;
  baseTimeout?: number;
};