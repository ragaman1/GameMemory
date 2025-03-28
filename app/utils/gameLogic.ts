// app/utils/gameLogic.ts
export const generateSequence = (length: number): number[] => {
  const sequence: number[] = [];
  
  for (let i = 0; i < length; i++) {
    sequence.push(Math.floor(Math.random() * 10)); // Random number between 0-9
  }
  
  return sequence;
};

// Add default export to fix the error
export default function GameLogic() {
  // Empty component to satisfy Expo Router
  return null;
}