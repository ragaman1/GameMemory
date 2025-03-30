└── GameMemory/
    ├── app/                   # Main application code (file-based routing)
    │   ├── _layout.tsx        # Root layout for navigation
    │   ├── index.tsx          # Main game screen
    │   └── components/        # Reusable UI components
    │       ├── SequenceDisplay.tsx  # Displays numbers to memorize
    │       ├── NumberPad.tsx        # Input pad for player responses
    │       ├── GameControls.tsx     # Start/restart game buttons
    │       ├── ProgressBar.tsx      # Shows game progress
    │       └── StatusBanner.tsx     # Displays game status messages
    ├── src/
    │   ├── hooks/
    │   │   └── useGameLogic.ts # Custom hook for game state management
    │   ├── styles/
    │   │   └── gameStyles.ts  # Style definitions
    │   ├── types/
    │   │   └── game.ts        # Type definitions
    │   └── utils/
    │       └── gameLogic.ts   # Game logic utilities
    ├── assets/                # Static assets
    │   ├── fonts/
    │   ├── images/
    │   └── sounds/
    ├── app.json               # Expo configuration file
    ├── package.json           # Project dependencies and scripts
    └── tsconfig.json          # TypeScript configuration


Game Components
Main Components
SequenceDisplay: Shows the sequence of numbers to memorize
NumberPad: Allows players to input their recalled sequence
GameControls: Provides start/restart functionality
ProgressBar: Visual indicator of game progress
StatusBanner: Displays feedback based on game state
Game Logic
The game logic is managed through the useGameLogic custom hook, which:

Controls game state ('idle', 'displaying', 'recall', 'success', 'failure')
Generates random number sequences
Validates player input
Manages level progression and scoring
Game Flow
Start: Player initiates the game via GameControls
Display Phase: A sequence of numbers is shown one by one
Recall Phase: Player attempts to input the sequence using the NumberPad
Outcome:
Correct sequence: Progress to next level with a longer sequence
Incorrect sequence: Game over with final score display
Technical Implementation
Built with React Native and Expo
Uses TypeScript for type safety
Implements custom hooks for state management
Separates concerns with dedicated components
Utilizes file-based routing for navigation
This documentation reflects the current structure and implementation of the GameMemory app as seen in the repository.