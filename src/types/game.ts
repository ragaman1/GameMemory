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

// Add a new type for display mode
export type DisplayMode = 'sequential' | 'simultaneous';

// Update GameLogicReturn to include the new mode and toggle function
export interface GameLogicReturn {
  // existing fields
  gameState: GameState;
  level: number;
  sequence: number[];
  playerInput: number[];
  score: number;
  startGame: () => void;
  handleNumberPress: (num: number) => void;
  handleDeletePress: () => void;
  // new fields
  displayMode: DisplayMode;
  toggleDisplayMode: () => void;
}

// Optional: Configuration types
export type GameConfig = {
  initialLevel?: number;
  levelMultiplier?: number;
  baseTimeout?: number;
};