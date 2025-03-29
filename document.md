# GameMemory App Documentation

GameMemory is a number sequence memory game built with React Native and Expo. Players are shown a sequence of numbers they must memorize and then recall in the correct order.

## Project Structure

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
    │   │   └── GameControls.tsx     # Start/restart game buttons
    │   └── utils/
    │       └── gameLogic.ts   # Game logic utilities
    └── assets/                # Static assets
        ├── fonts/
        │   └── SpaceMono-Regular.ttf
        ├── images/           # App icons and images
        └── sounds/           # Game sound effects (empty)
```

## Key Files and Their Roles

Below is a complete documentation of the project structure along with an explanation of the role of each file and directory in the **GameMemory** repository.

---

## Project Overview

**GameMemory** is an Expo-based React Native application that implements a number memory game. In the game, a random sequence of numbers is generated and displayed to the user for a brief period, after which the user must recall the sequence using a randomized number pad. The game increases in difficulty with each level, tracks the user's score, and provides visual feedback for correct or incorrect inputs.

---


### Root Level Files

- **README.md**  
  This file introduces the Expo application and provides instructions to get started. It includes:
  - How to install dependencies using `npm install`
  - Commands to start the app on various platforms (Android, iOS, Web)
  - Information on file-based routing using Expo Router
  - A command to “reset” the project (`npm run reset-project`), which moves starter code to a backup (`app-example`) and resets the working `app` directory

- **deirectory_structure.md**  
  This document provides an overview of the project tree structure. It’s useful for new developers to quickly understand where key parts of the codebase reside.

- **package.json**  
  Contains metadata about the GameMemory project along with its dependencies, development dependencies, and scripts:
  - **Scripts** – Commands such as `start`, `android`, `ios`, `web`, `test`, and `lint`
  - **Dependencies** – Expo packages, React & React Native libraries, navigation, vector-icons, and more
  - **Dev Dependencies** – For TypeScript, Babel, Jest for testing

- **tsconfig.json**  
  The TypeScript configuration file that extends Expo’s base configuration. It enforces strict type checking and defines path aliases (e.g., `"@/*"` mapping to the source root).

- **app.json**  
  The Expo configuration file containing settings like:
  - The project’s name, slug, version, orientation, and icons
  - Platform-specific configurations (iOS, Android, Web)
  - Plugins (such as `expo-router` and `expo-splash-screen`)
  - Experimental settings for typed routes

---

### The `app` Directory

This directory holds the core components and logic for the memory game.

- **_layout.tsx**  
  This file sets up the root layout using the Expo Router’s `Stack` navigator. It defines the navigation stack of the app. Currently, only the home screen (index) is configured, but the file can be expanded later to accommodate more screens.

- **index.tsx**  
  This is the main entry point for the game. It manages the overall game state and lifecycle:
  - **State Management**: Tracks the game state (`idle`, `displaying`, `recall`, `success`, `failure`), current level, sequence of numbers, player’s input, and score.
  - **Game Logic**:  
    - Starts a level by generating a sequence (using `generateSequence` from `gameLogic.ts`)
    - Displays the sequence and then changes the game state to allow the player to recall
    - Checks the user’s input against the sequence to determine if the game is won or lost
    - Handles timeouts and transitions between levels or when the game is restarted
  - **UI Components Integration**:  
    - Renders a header showing the level and score
    - Displays hints or feedback in a status banner
    - Renders the sequence using the **SequenceDisplay** component
    - Displays the player's current input visually as dots with numbers
    - Depending on the game state, renders either game controls (start/restart button) or the **NumberPad** for user input

---

### The `components` Directory

This folder contains reusable UI components that build up the game interface.

- **GameControls.tsx**  
  - **Purpose**: Renders the “Start Game” or “Play Again” button.
  - **Usage**: Displayed when the game is idle or after a failure.
  - **Props**:  
    - `onStart`: A callback function to start or restart the game
    - `gameState`: Used to change the label of the button depending on whether the game has failed or is ready to start

- **NumberPad.tsx**  
  - **Purpose**: Implements a randomized number pad used during the recall phase.
  - **Functionality**:
    - Randomizes the layout of digits (0-9) each time the component is loaded, using the Fisher-Yates shuffle algorithm.
    - Maintains a consistent layout structure with a 3-by-3 grid for numbers 1–9 and centers 0 in the bottom row.
    - Accepts props like `onNumberPress` (callback for button press), `disabled` (whether the pad is active during recall), and optional customizations for button size and spacing.
  - **UI**: Buttons display numbers with consistent styling. When disabled, the buttons change style to indicate they are not interactive.

- **SequenceDisplay.tsx**  
  - **Purpose**: Handles the display of the generated memory sequence during the “displaying” phase.
  - **Functionality**:  
    - Uses an animated fade effect to show each number in the sequence one by one.
    - The display timing adjusts based on the level, making it faster for higher levels.
    - Shows a placeholder initially when no sequence is being displayed.
  - **UI**: Displays a circular view with the current number in large font during the sequence presentation.

---

### The `utils` Directory

- **gameLogic.ts**  
  - **Purpose**: Contains the helper function to generate the random sequence of numbers for the game.
  - **Functionality**:  
    - The `generateSequence` function accepts a length parameter and returns an array of random numbers (each between 0–9).
  - There’s also a default export (an empty component) included to satisfy Expo Router’s structure or any default export requirements.

---

### The `assets` Directory

This directory holds static assets for the app.

- **fonts/**  
  - Contains custom fonts such as `SpaceMono-Regular.ttf` used within the app for styling text elements.
- **images/**  
  - Stores images like the app icon, adaptive icons, splash screen images, and other image assets referenced in **app.json**.
- **sounds/**  
  - (Reserved for audio assets) Can include sound effects used in the game.

---

## Summary

- **Initialization & Configuration**:  
  - The project starts with Expo configuration files (`app.json`, `tsconfig.json`, `package.json`) and instructions provided in `README.md`.

- **Navigation & Layout**:  
  - The primary navigation is defined in `_layout.tsx` using an Expo Router `Stack` navigator.

- **Core Game Functionality**:  
  - **index.tsx** orchestrates game logic (state management, timeout handling, level progression) by integrating helper logic from `utils/gameLogic.ts` and UI components.

- **UI Components**:  
  - Components like **SequenceDisplay**, **NumberPad**, and **GameControls** handle the display logic, user input, and feedback during gameplay.

- **Static Assets**:  
  - The **assets** folder holds images, fonts, and sound resources used throughout the application.

This comprehensive documentation highlights the structure and purpose of each file and folder, providing a solid overview of the GameMemory project for further development or review.
## Game Flow

1. Player starts the game by pressing "Start Game"
2. A sequence of numbers appears on screen (length increases with level)
3. Player must recall and input the sequence in the correct order
4. If correct, player advances to the next level with a longer sequence
5. If incorrect, game ends and player can restart

## Technical Features

- Uses React Native with TypeScript for type safety
- Implements Expo Router for navigation
- Uses React hooks (useState, useEffect, useRef) for state management
- Includes animations for sequence display
- Adaptive difficulty that increases with player progression
- Randomized number pad layout for added challenge

## Game States

- **idle**: Initial state before game starts
- **displaying**: Showing the sequence to memorize
- **recall**: Player inputs their answer
- **success**: Player correctly recalled the sequence
- **failure**: Player made a mistake

The app tracks player score and level, with points awarded based on the current level.