# GameMemory App Documentation

GameMemory is a number sequence memory game built with React Native and Expo. Players are shown a sequence of numbers they must memorize and then recall in the correct order.

## Project Structure

Based on the repository files, I'll update the documentation to reflect the current directory structure and components. Here's the revised documentation:

# Updated GameMemory App Documentation

## Updated Project Structure

```
└── GameMemory/
    ├── README.md              # Project overview and setup instructions
    ├── app.json               # Expo configuration file
    ├── package.json           # Project dependencies and scripts
    ├── tsconfig.json          # TypeScript configuration
    ├── app/                   # Main application code
    │   ├── _layout.tsx        # Root layout for navigation
    │   ├── index.tsx          # Main game screen
    │   ├── components/        # Reusable UI components
    │   │   ├── SequenceDisplay.tsx  # Displays numbers to memorize
    │   │   ├── NumberPad.tsx        # Input pad for player responses
    │   │   ├── GameControls.tsx     # Start/restart game buttons
    │   │   └── StatusBanner.tsx     # Displays game status messages
    │   ├── hooks/
    │   │   └── useGameLogic.ts      # Custom hook for game state management
    │   ├── utils/
    │   │   └── gameLogic.ts         # Game logic utilities
    │   ├── types/
    │   │   └── game.ts              # Type definitions
    │   └── styles/
    │       └── gameStyles.ts        # Style definitions
    └── assets/                # Static assets
        ├── fonts/
        │   └── SpaceMono-Regular.ttf
        ├── images/
        └── sounds/
```

## New Key Files and Their Roles

### The `hooks` Directory (New)

- **useGameLogic.ts**  
  - **Purpose**: Custom hook that manages all game state and logic
  - **Functionality**:
    - Manages game state ('idle', 'displaying', 'recall', 'success', 'failure')
    - Handles level progression and score calculation
    - Generates sequences using `gameLogic.ts` utilities
    - Controls timing of sequence display and recall phases
    - Validates player input against generated sequence

### The `types` Directory (New)

- **game.ts**  
  - **Purpose**: Contains TypeScript type definitions for the game
  - **Contents**:
    - `GameState` type ('idle' | 'displaying' | 'recall' | 'success' | 'failure')
    - `GameLogicReturn` interface for the useGameLogic hook return values

### The `styles` Directory (New)

- **gameStyles.ts**  
  - **Purpose**: Contains all style definitions for the game components
  - **Usage**: Imported by components to maintain consistent styling

### Updated Components

- **StatusBanner.tsx** (New)
  - **Purpose**: Displays status messages based on game state
  - **Props**:
    - `state`: Current game state
  - **Behavior**: Shows different messages for success, failure, and other states

- **GameControls.tsx** (Updated)
  - Now uses styles imported from gameStyles.ts
  - Simplified props interface

### Updated Main Game Screen

- **index.tsx** (Updated)
  - Now uses the useGameLogic custom hook for state management
  - Simplified component structure with clearer separation of concerns
  - Uses StatusBanner component for game feedback
  - Better type safety with imported types

## Updated Game Flow Documentation

1. **Initialization**:
   - Player presses "Start Game" (handled by GameControls)
   - useGameLogic hook generates initial sequence and starts level 1

2. **Sequence Display**:
   - Numbers are shown one by one with timing based on level
   - SequenceDisplay component handles the visual presentation

3. **Recall Phase**:
   - NumberPad component is enabled for input
   - Player inputs are validated against the sequence
   - StatusBanner provides feedback

4. **Level Completion**:
   - Correct answers advance to next level with longer sequence
   - Incorrect answers end the game
   - Score is calculated based on level completed

## Technical Updates

- Added proper TypeScript typing throughout the application
- Implemented custom hook pattern for game logic
- Separated styles into dedicated file
- Improved component structure and responsibility separation
- Added status banner for better user feedback
- Maintained all existing functionality while improving code organization

The documentation now accurately reflects the current state of the repository with its improved structure and added TypeScript support. The game maintains all original functionality while being better organized and more maintainable.