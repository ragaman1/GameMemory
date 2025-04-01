└── GameMemory/
    ├── app/                   # Main application code (file-based routing)
    │   ├── _layout.tsx        # Root layout for navigation (includes Auth and theming)
    │   ├── index.tsx          # Main game screen that connects game logic and UI
    │   └── components/        # Reusable UI components
    │       ├── AuthHeader.tsx       # Header showing auth info and best score
    │       ├── SequenceDisplay.tsx  # Displays the generated number sequence
    │       ├── NumberPad.tsx        # Input pad for player sequence entry
    │       ├── GameControls.tsx     # Start/Restart game buttons
    │       ├── ProgressBar.tsx      # (If used) Visual indicator of progress
    │       ├── StatusBanner.tsx     # Displays game status messages (idle, success, failure)
    │       └── ScoreModal.tsx       # Modal to show the final score & high score info
    ├── src/
    │   ├── hooks/
    │   │   ├── useGameLogic.ts   # Custom hook managing game state and level progression
    │   │   └── useAuth.ts        # Auth hook for managing session and user
    │   ├── styles/
    │   │   └── gameStyles.ts     # Centralized style definitions for game components
    │   ├── types/
    │   │   ├── game.ts           # Type definitions for game logic (state, props, etc.)
    │   │   └── user.ts           # Type definitions for user information (id, username, etc.)
    │   └── utils/
    │       ├── gameLogic.ts      # Utilities to generate random number sequences
    │       └── scoreStorage.ts   # Functions to save and retrieve score data
    ├── assets/                  # Static assets (images, fonts, sounds)
    │   ├── fonts/
    │   ├── images/
    │   └── sounds/
    ├── app.json                 # Expo configuration file
    ├── package.json             # Project dependencies and scripts
    ├── tsconfig.json            # TypeScript configuration
    └── README.md                # Overview, setup instrup

Directory structure:
└── ragaman1-gamememory/
    ├── README.md
    ├── app.json
    ├── deirectory_structure.md
    ├── document.md
    ├── login.md
    ├── package.json
    ├── tsconfig.json
    ├── app/
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   ├── auth/
    │   │   ├── login.tsx
    │   │   └── profile.tsx
    │   └── components/
    │       ├── AuthHeader.tsx
    │       ├── GameControls.tsx
    │       ├── NumberPad.tsx
    │       ├── ProgressBar.tsx
    │       ├── ScoreBoard.tsx
    │       ├── ScoreModal.tsx
    │       ├── SequenceDisplay.tsx
    │       ├── StatusBanner.tsx
    │       └── coreModal.tsx
    ├── assets/
    │   ├── fonts/
    │   │   └── SpaceMono-Regular.ttf
    │   ├── images/
    │   └── sounds/
    └── src/
        ├── hooks/
        │   ├── useAuth.tsx
        │   └── useGameLogic.ts
        ├── styles/
        │   └── gameStyles.ts
        ├── types/
        │   ├── game.ts
        │   └── user.ts
        └── utils/
            ├── authStorage.ts
            ├── gameLogic.ts
            └── scoreStorage.ts


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