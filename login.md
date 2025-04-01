Let me add a few more key files to complete the user registration and score tracking feature:

# 1. Update src/hooks/useGameLogic.ts to save scores

```typescript
import { useState, useRef, useEffect } from 'react';
import { generateSequence } from '../utils/gameLogic';
import { useAuth } from './useAuth';
import { saveScore } from '../utils/scoreStorage';
import type { GameState, GameLogicReturn, DisplayMode } from '../types/game';

export function useGameLogic(): GameLogicReturn {
  // Existing state
  const [gameState, setGameState] = useState<GameState>('idle');
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('sequential');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get auth session
  const { session } = useAuth();

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
      const newScore = score + level * 10;
      setScore(newScore);
      setGameState('success');
      
      timeoutRef.current = setTimeout(() => {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        startLevel(nextLevel);
      }, 1500);
    } else {
      setGameState('failure');
      
      // Save score when game ends (only if user is logged in and score > 0)
      if (session.isAuthenticated && session.user && score > 0) {
        saveScore(session.user.id, session.user.username, score, level);
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
    toggleDisplayMode
  };
}
```

# 2. Create app/components/AuthHeader.tsx

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import type { UserScore } from '../../src/types/user';

type AuthHeaderProps = {
  bestScore: UserScore | null;
  compact?: boolean;
};

export default function AuthHeader({ bestScore, compact = false }: AuthHeaderProps) {
  const router = useRouter();
  const { session } = useAuth();

  const navigateToAuth = () => {
    router.push('/auth/login');
  };

  const navigateToProfile = () => {
    router.push('/auth/profile');
  };

  if (compact) {
    // Compact version for smaller screens or headers
    return (
      <View style={styles.compactContainer}>
        {session.isAuthenticated && session.user ? (
          <TouchableOpacity onPress={navigateToProfile}>
            <Text style={styles.compactText}>
              {session.user.username} {bestScore ? `• ${bestScore.score}pts` : ''}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={navigateToAuth}>
            <Text style={styles.compactLoginText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Full version
  return (
    <View style={styles.container}>
      {session.isAuthenticated && session.user ? (
        <View style={styles.userInfo}>
          <Text style={styles.username}>
            {session.user.username}
          </Text>
          {bestScore && (
            <Text style={styles.bestScore}>
              Best: {bestScore.score} (Lv.{bestScore.level})
            </Text>
          )}
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={navigateToProfile}
          >
            <Text style={styles.profileButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={navigateToAuth}
        >
          <Text style={styles.loginText}>Login / Register</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#121212',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
  },
  bestScore: {
    color: '#4E7AF0',
    marginRight: 10,
  },
  profileButton: {
    backgroundColor: '#333',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: '#4E7AF0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  loginText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Compact styles
  compactContainer: {
    padding: 5,
  },
  compactText: {
    color: '#fff',
    fontSize: 12,
  },
  compactLoginText: {
    color: '#4E7AF0',
    fontSize: 12,
    fontWeight: 'bold',
  }
});
```

# 3. Create app/components/ScoreBoard.tsx

```typescript
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import type { UserScore } from '../../src/types/user';

type ScoreBoardProps = {
  scores: UserScore[];
  highlightUserId?: string | null;
  title?: string;
  maxItems?: number;
};

export default function ScoreBoard({
  scores,
  highlightUserId = null,
  title = 'Leaderboard',
  maxItems = 10
}: ScoreBoardProps) {
  // Format date function
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      {scores.length > 0 ? (
        <FlatList
          data={scores.slice(0, maxItems)}
          keyExtractor={(item, index) => `score-${index}`}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View 
              style={[
                styles.scoreItem,
                highlightUserId && item.userId === highlightUserId 
                  ? styles.highlightedItem 
                  : null
              ]}
            >
              <Text style={styles.rankText}>#{index + 1}</Text>
              <Text style={styles.username}>{item.username}</Text>
              <View style={styles.scoreDetails}>
                <Text style={styles.scoreText}>{item.score}</Text>
                <Text style={styles.levelText}>Lv.{item.level}</Text>
                <Text style={styles.dateText}>{formatDate(item.date)}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>No scores recorded yet.</Text>
          }
        />
      ) : (
        <Text style={styles.emptyMessage}>No scores recorded yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  highlightedItem: {
    backgroundColor: '#2A3455',
  },
  rankText: {
    width: 30,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4E7AF0',
  },
  username: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scoreDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 10,
  },
  levelText: {
    color: '#4E7AF0',
    marginRight: 10,
  },
  dateText: {
    color: '#888888',
    fontSize: 12,
  },
  emptyMessage: {
    color: '#888888',
    textAlign: 'center',
    padding: 20,
  },
});
```

# 4. Create app/components/ScoreModal.tsx

```typescript
import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { UserScore } from '../../src/types/user';

type ScoreModalProps = {
  visible: boolean;
  onClose: () => void;
  score: number;
  level: number;
  isHighScore: boolean;
  previousBest: UserScore | null;
};

const { width } = Dimensions.get('window');

export default function ScoreModal({
  visible,
  onClose,
  score,
  level,
  isHighScore,
  previousBest
}: ScoreModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.titleText}>
            {isHighScore ? '🎉 New High Score! 🎉' : 'Game Over'}
          </Text>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>

          <View style={styles.levelContainer}>
            <Text style={styles.levelLabel}>Level Reached</Text>
            <Text style={styles.levelValue}>{level}</Text>
          </View>

          {isHighScore && previousBest && (
            <View style={styles.improvementContainer}>
              <Text style={styles.improvementText}>
                You beat your previous best: {previousBest.score}
              </Text>
              <Text style={styles.improvementValue}>
                +{score - previousBest.score} points!
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.playAgainButton} onPress={onClose}>
            <Text style={styles.playAgainText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: width * 0.8,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4E7AF0',
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  levelLabel: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  levelValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  improvementContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(78, 122, 240, 0.1)',
    borderRadius: 10,
  },
  improvementText: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 5,
  },
  improvementValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  playAgainButton: {
    backgroundColor: '#4E7AF0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
```

# 5. Update the app/index.tsx to utilize these new components

Now your game should handle user registration and score tracking. Would you like me to create any additional files or make further adjustments to enhance this feature?


###########################
# Updated app/index.tsx

```typescript
import { 
  View, 
  Text, 
  Switch, 
  SafeAreaView, 
  TouchableOpacity,
  StyleSheet 
} from 'react-native'; 
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useGameLogic } from '../src/hooks/useGameLogic'; 
import { useAuth } from '../src/hooks/useAuth';
import { getUserBestScore } from '../src/utils/scoreStorage';
import SequenceDisplay from './components/SequenceDisplay';
import NumberPad from './components/NumberPad';
import StatusBanner from './components/StatusBanner';
import AuthHeader from './components/AuthHeader';
import ScoreModal from './components/ScoreModal';
import { styles } from '../src/styles/gameStyles'; 

import type { GameLogicReturn } from '../src/types/game';
import type { UserScore } from '../src/types/user';

export default function MemoryGame() {
  const router = useRouter();
  const { session } = useAuth();
  const [bestScore, setBestScore] = useState<UserScore | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [isHighScore, setIsHighScore] = useState(false);
  
  // Game logic hook with proper typing
  const {
    gameState,
    level,
    sequence,
    playerInput,
    score,
    startGame,
    handleNumberPress,
    handleDeletePress,
    displayMode,
    toggleDisplayMode
  }: GameLogicReturn = useGameLogic();

  // Load user's best score when authenticated
  useEffect(() => {
    if (session.isAuthenticated && session.user) {
      getUserBestScore(session.user.id).then(score => {
        if (score) setBestScore(score);
      });
    } else {
      setBestScore(null);
    }
  }, [session]);

  // Show score modal when game ends
  useEffect(() => {
    if (gameState === 'failure' && score > 0) {
      // Check if it's a high score
      const newHighScore = !bestScore || score > bestScore.score;
      setIsHighScore(newHighScore);
      setShowScoreModal(true);
      
      // If it's a new high score, refresh the best score
      if (newHighScore && session.isAuthenticated && session.user) {
        setTimeout(() => {
          getUserBestScore(session.user.id).then(score => {
            if (score) setBestScore(score);
          });
        }, 1000); // Short delay to ensure score is saved
      }
    }
  }, [gameState, score, bestScore, session]);

  // Render controls only when the game is idle or after failure.
  const renderGameControls = () => {
    if (gameState === 'idle' || gameState === 'failure') {
      return (
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.buttonText}>
            {gameState === 'failure' ? 'Try Again' : 'Start Game'}
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Auth Header */}
      <AuthHeader bestScore={bestScore} />

      {/* Header with level and score info and mode toggle */}
      <View style={styles.header}>
        <Text style={styles.infoText}>Level: {level}</Text>
        <Text style={styles.infoText}>Score: {score}</Text>
        <View style={styles.modeToggle}>
          <Text style={styles.modeLabel}>
            {displayMode === 'sequential' ? 'One by One' : 'All at Once'}
          </Text>
          <Switch
            value={displayMode === 'simultaneous'}
            onValueChange={toggleDisplayMode}
            disabled={gameState !== 'idle' && gameState !== 'failure'}
          />
        </View>
      </View>

      {/* Status Banner */}
      <StatusBanner state={gameState} />

      {/* Sequence Display / Input Area */}
      <View style={styles.gameArea}>
        {gameState === 'displaying' ? (
          // Show sequence being displayed
          <SequenceDisplay
            sequence={sequence}
            isDisplaying={true}
            level={level}
            displayMode={displayMode}
          />

        ) : gameState === 'recall' || gameState === 'success' || gameState === 'failure' ? (
          // Show input feedback during recall, success (briefly), or failure
          <View style={styles.inputDisplay}>
             {/* Optionally show the target sequence on failure */}
             {gameState === 'failure' && (
                <Text style={styles.failSequenceText}>Sequence: {sequence.join('')}</Text>
             )}
            <View style={styles.inputRow}>
              {sequence.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.inputDot,
                    index < playerInput.length ? styles.inputDotFilled : null,
                  ]}
                >
                  {/* Show entered number inside the dot */}
                  {index < playerInput.length && (
                    <Text style={styles.inputNumber}>{playerInput[index]}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        ) : (
           // Placeholder for idle state in game area if needed
           <View style={styles.placeholderArea}>
             <Text style={styles.placeholderText}>Press Start</Text>
           </View>
        )}
      </View>

      {/* Game controls */}
      <View style={styles.controlArea}>
        {gameState === 'idle' || gameState === 'failure' ? (
          renderGameControls()
        ) : gameState === 'recall' ? (
          // Only show NumberPad during recall phase
          <NumberPad
            onNumberPress={handleNumberPress}
            onDeletePress={handleDeletePress}
            disabled={gameState !== 'recall'}
          />
        ) : (
          // No controls shown during 'displaying' or 'success' states
          <View style={styles.numberPadPlaceholder} />
        )}
      </View>

      {/* Score Modal */}
      <ScoreModal
        visible={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        score={score}
        level={level}
        isHighScore={isHighScore}
        previousBest={bestScore}
      />
    </SafeAreaView>
  );
}
```

## Suggestions for Further Enhancements

1. **Achievements System**
   - Create unlockable achievements like "Reach Level 10", "Perfect Score", etc.
   - Store achievements in AsyncStorage and display them on the profile screen

2. **Daily Challenges**
   - Implement daily challenges with specific patterns to memorize
   - Offer bonus points for completing daily challenges

3. **Different Game Modes**
   - Add "Reversed" mode (enter sequence backward)
   - Add "Time Attack" mode (complete as many levels as possible in a time limit)
   - Add "Pattern" mode (memorize shapes/colors instead of numbers)

4. **Social Features**
   - Allow players to challenge friends by sharing a specific sequence code
   - Implement a way to share scores on social media

5. **Progress Analytics**
   - Show graphs of player progress over time
   - Provide statistics like average score, most common errors, etc.

6. **Customize Appearance**
   - Allow users to choose themes or customize game colors
   - Add sound effects and music options

7. **Offline/Online Syncing**
   - Implement Firebase or another backend service for proper authentication
   - Sync scores and progress across devices

8. **Accessibility Features**
   - Add larger display options
   - Support for color blindness
   - Voice-guided gameplay option

9. **Tutorial Mode**
   - Create an interactive tutorial for first-time players
   - Include memory-enhancing tips

10. **Monetization Options** (if desired)
    - Premium themes or game modes
    - Ad-free experience option
    - Power-ups like "hint" or "extra life"

Which of these would you be most interested in implementing next?

############################################
# Implementing Customize Appearance Feature

Let's create the necessary files for theme customization and sound effects:

## 1. First, let's create the theme system (src/utils/themeContext.tsx)

```typescript
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme definitions
export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  accent: string;
  primary: string;
  secondary: string;
  success: string;
  error: string;
  inactive: string;
  inputBackground: string;
  border: string;
};

export type ThemeOption = {
  id: string;
  name: string;
  colors: ThemeColors;
};

// Predefined themes
export const themes: ThemeOption[] = [
  {
    id: 'default',
    name: 'Classic Dark',
    colors: {
      background: '#121212',
      card: '#1E1E1E',
      text: '#FFFFFF',
      accent: '#4E7AF0',
      primary: '#4E7AF0',
      secondary: '#333333',
      success: '#4CAF50',
      error: '#E53935',
      inactive: '#666666',
      inputBackground: '#333333',
      border: '#333333',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    colors: {
      background: '#0F172A',
      card: '#1E293B',
      text: '#F8FAFC',
      accent: '#38BDF8',
      primary: '#38BDF8',
      secondary: '#334155',
      success: '#22C55E',
      error: '#EF4444',
      inactive: '#64748B',
      inputBackground: '#334155',
      border: '#334155',
    },
  },
  {
    id: 'retro',
    name: 'Retro Arcade',
    colors: {
      background: '#000000',
      card: '#240046',
      text: '#FF00FF',
      accent: '#00FF00',
      primary: '#FF00FF',
      secondary: '#3A0CA3',
      success: '#00FF00',
      error: '#FF0000',
      inactive: '#7209B7',
      inputBackground: '#240046',
      border: '#FF00FF',
    },
  },
  {
    id: 'pastel',
    name: 'Pastel Vibes',
    colors: {
      background: '#FEFAE0',
      card: '#FAEDCD',
      text: '#283618',
      accent: '#606C38',
      primary: '#BC6C25',
      secondary: '#DDA15E',
      success: '#606C38',
      error: '#E76F51',
      inactive: '#D4A373',
      inputBackground: '#FAEDCD',
      border: '#D4A373',
    },
  },
  {
    id: 'neon',
    name: 'Neon Nights',
    colors: {
      background: '#10002B',
      card: '#240046',
      text: '#E0AAFF',
      accent: '#5A189A',
      primary: '#7B2CBF',
      secondary: '#C77DFF',
      success: '#00FF00',
      error: '#FF0000',
      inactive: '#3C096C',
      inputBackground: '#240046',
      border: '#5A189A',
    },
  },
];

// Context type
type ThemeContextType = {
  currentTheme: ThemeColors;
  themeOption: ThemeOption;
  setThemeOption: (option: ThemeOption) => void;
  availableThemes: ThemeOption[];
};

// Create context
const ThemeContext = createContext<ThemeContextType>({
  currentTheme: themes[0].colors,
  themeOption: themes[0],
  setThemeOption: () => {},
  availableThemes: themes,
});

// Storage key
const THEME_STORAGE_KEY = '@game_memory_theme';

// Provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeOption, setThemeOptionState] = useState<ThemeOption>(themes[0]);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedThemeId = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedThemeId) {
          const savedTheme = themes.find(theme => theme.id === savedThemeId);
          if (savedTheme) {
            setThemeOptionState(savedTheme);
          }
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      }
    };
    
    loadTheme();
  }, []);

  // Save theme when it changes
  const setThemeOption = async (option: ThemeOption) => {
    setThemeOptionState(option);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, option.id);
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: themeOption.colors,
        themeOption,
        setThemeOption,
        availableThemes: themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme
export function useTheme() {
  return useContext(ThemeContext);
}
```

## 2. Now let's create the sound system (src/utils/soundContext.tsx)

```typescript
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sound settings type
type SoundSettings = {
  soundEffectsEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
};

// Sound context type
type SoundContextType = {
  settings: SoundSettings;
  updateSettings: (newSettings: Partial<SoundSettings>) => void;
  playButtonSound: () => Promise<void>;
  playNumberSound: () => Promise<void>;
  playSuccessSound: () => Promise<void>;
  playFailureSound: () => Promise<void>;
  playLevelUpSound: () => Promise<void>;
  startBackgroundMusic: () => Promise<void>;
  stopBackgroundMusic: () => Promise<void>;
  isLoaded: boolean;
};

// Create context
const SoundContext = createContext<SoundContextType>({
  settings: {
    soundEffectsEnabled: true,
    musicEnabled: true,
    volume: 0.7,
  },
  updateSettings: () => {},
  playButtonSound: async () => {},
  playNumberSound: async () => {},
  playSuccessSound: async () => {},
  playFailureSound: async () => {},
  playLevelUpSound: async () => {},
  startBackgroundMusic: async () => {},
  stopBackgroundMusic: async () => {},
  isLoaded: false,
});

// Storage key
const SOUND_SETTINGS_KEY = '@game_memory_sound';

// Provider component
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SoundSettings>({
    soundEffectsEnabled: true,
    musicEnabled: true,
    volume: 0.7,
  });
  
  const [sounds, setSounds] = useState<Record<string, Audio.Sound | null>>({
    button: null,
    number: null,
    success: null,
    failure: null,
    levelUp: null,
    background: null,
  });
  
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(SOUND_SETTINGS_KEY);
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Failed to load sound settings', error);
      }
    };
    
    loadSettings();
  }, []);

  // Load sound assets
  useEffect(() => {
    const loadSounds = async () => {
      try {
        // Here we'd normally load actual sound files
        // For this example, we'll create empty sound objects
        const buttonSound = new Audio.Sound();
        const numberSound = new Audio.Sound();
        const successSound = new Audio.Sound();
        const failureSound = new Audio.Sound();
        const levelUpSound = new Audio.Sound();
        const backgroundMusic = new Audio.Sound();
        
        // In a real app, you'd load the sound files like this:
        // await buttonSound.loadAsync(require('../../assets/sounds/button.mp3'));
        
        setSounds({
          button: buttonSound,
          number: numberSound,
          success: successSound,
          failure: failureSound,
          levelUp: levelUpSound,
          background: backgroundMusic,
        });
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load sound assets', error);
      }
    };
    
    loadSounds();
    
    // Cleanup sounds on unmount
    return () => {
      Object.values(sounds).forEach(sound => {
        if (sound) {
          sound.unloadAsync();
        }
      });
    };
  }, []);

  // Update settings
  const updateSettings = async (newSettings: Partial<SoundSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    try {
      await AsyncStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(updatedSettings));
      
      // Update volume for all sounds
      Object.values(sounds).forEach(sound => {
        if (sound) {
          sound.setVolumeAsync(updatedSettings.volume);
        }
      });
      
      // Stop background music if disabled
      if (!updatedSettings.musicEnabled && sounds.background) {
        sounds.background.stopAsync();
      }
    } catch (error) {
      console.error('Failed to save sound settings', error);
    }
  };

  // Sound playing functions
  const playSound = async (soundKey: keyof typeof sounds) => {
    if (!settings.soundEffectsEnabled || !isLoaded || !sounds[soundKey]) {
      return;
    }
    
    try {
      await sounds[soundKey]?.setVolumeAsync(settings.volume);
      await sounds[soundKey]?.replayAsync();
    } catch (error) {
      console.error(`Failed to play ${soundKey} sound`, error);
    }
  };

  const playButtonSound = async () => playSound('button');
  const playNumberSound = async () => playSound('number');
  const playSuccessSound = async () => playSound('success');
  const playFailureSound = async () => playSound('failure');
  const playLevelUpSound = async () => playSound('levelUp');

  const startBackgroundMusic = async () => {
    if (!settings.musicEnabled || !isLoaded || !sounds.background) {
      return;
    }
    
    try {
      await sounds.background.setVolumeAsync(settings.volume * 0.5); // Lower volume for background
      await sounds.background.setIsLoopingAsync(true);
      await sounds.background.playAsync();
    } catch (error) {
      console.error('Failed to start background music', error);
    }
  };

  const stopBackgroundMusic = async () => {
    if (!isLoaded || !sounds.background) {
      return;
    }
    
    try {
      await sounds.background.stopAsync();
    } catch (error) {
      console.error('Failed to stop background music', error);
    }
  };

  return (
    <SoundContext.Provider
      value={{
        settings,
        updateSettings,
        playButtonSound,
        playNumberSound,
        playSuccessSound,
        playFailureSound,
        playLevelUpSound,
        startBackgroundMusic,
        stopBackgroundMusic,
        isLoaded,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

// Hook to use sound
export function useSound() {
  return useContext(SoundContext);
}
```

## 3. Let's create a Settings Screen (app/settings.tsx)

```typescript
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Slider,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, ThemeOption } from '../src/utils/themeContext';
import { useSound } from '../src/utils/soundContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { currentTheme, themeOption, setThemeOption, availableThemes } = useTheme();
  const { settings, updateSettings, playButtonSound } = useSound();

  const handleThemeSelect = (theme: ThemeOption) => {
    setThemeOption(theme);
    playButtonSound();
  };

  const handleSoundToggle = (value: boolean) => {
    updateSettings({ soundEffectsEnabled: value });
    if (value) {
      playButtonSound();
    }
  };

  const handleMusicToggle = (value: boolean) => {
    updateSettings({ musicEnabled: value });
    playButtonSound();
  };

  const handleVolumeChange = (value: number) => {
    updateSettings({ volume: value });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={[styles.header, { borderBottomColor: currentTheme.border }]}>
        <Text style={[styles.title, { color: currentTheme.text }]}>Settings</Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: currentTheme.primary }]}
          onPress={() => {
            playButtonSound();
            router.back();
          }}
        >
          <Text style={[styles.backButtonText, { color: currentTheme.text }]}>
            Back to Game
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
            Game Theme
          </Text>
          <View style={styles.themesContainer}>
            {availableThemes.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeOption,
                  { backgroundColor: theme.colors.card },
                  themeOption.id === theme.id && styles.selectedTheme,
                  themeOption.id === theme.id && {
                    borderColor: theme.colors.accent,
                  },
                ]}
                onPress={() => handleThemeSelect(theme)}
              >
                <View style={[styles.themePreview, { backgroundColor: theme.colors.background }]}>
                  <View
                    style={[
                      styles.themePreviewElement,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  />
                  <View
                    style={[
                      styles.themePreviewElement,
                      { backgroundColor: theme.colors.secondary },
                    ]}
                  />
                  <View
                    style={[
                      styles.themePreviewElement,
                      { backgroundColor: theme.colors.accent },
                    ]}
                  />
                </View>
                <Text style={[styles.themeName, { color: theme.colors.text }]}>
                  {theme.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sound Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
            Sound Settings
          </Text>

          <View style={styles.settingRow}>
            <Text style={[styles.settingText, { color: currentTheme.text }]}>
              Sound Effects
            </Text>
            <Switch
              value={settings.soundEffectsEnabled}
              onValueChange={handleSoundToggle}
              trackColor={{ false: currentTheme.inactive, true: currentTheme.primary }}
              thumbColor={
                settings.soundEffectsEnabled ? currentTheme.accent : currentTheme.text
              }
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={[styles.settingText, { color: currentTheme.text }]}>
              Background Music
            </Text>
            <Switch
              value={settings.musicEnabled}
              onValueChange={handleMusicToggle}
              trackColor={{ false: currentTheme.inactive, true: currentTheme.primary }}
              thumbColor={
                settings.musicEnabled ? currentTheme.accent : currentTheme.text
              }
            />
          </View>

          <View style={styles.volumeContainer}>
            <Text style={[styles.settingText, { color: currentTheme.text }]}>
              Volume: {Math.round(settings.volume * 100)}%
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={settings.volume}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor={currentTheme.primary}
              maximumTrackTintColor={currentTheme.inactive}
              thumbTintColor={currentTheme.accent}
            />
          </View>

          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: currentTheme.secondary }]}
            onPress={playButtonSound}
          >
            <Text style={[styles.testButtonText, { color: currentTheme.text }]}>
              Test Sound
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  backButtonText: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeOption: {
    width: '48%',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTheme: {
    borderWidth: 2,
  },
  themePreview: {
    height: 80,
    borderRadius: 4,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  themePreviewElement: {
    width: '30%',
    height: '100%',
    borderRadius: 4,
  },
  themeName: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingText: {
    fontSize: 16,
  },
  volumeContainer: {
    marginTop: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  testButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    fontWeight: 'bold',
  },
});
```

## 4. Update _layout.tsx to include the theme and sound providers

```typescript
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/hooks/useAuth';
import { ThemeProvider, useTheme } from '../src/utils/themeContext';
import { SoundProvider } from '../src/utils/soundContext';
import { 
  DarkTheme, 
  ThemeProvider as NavigationThemeProvider, 
  DefaultTheme 
} from '@react-navigation/native';
import { useColorScheme } from 'react-native';

// Wrapper component to use theme in navigation
function AppStackNavigator() {
  const { currentTheme } = useTheme();
  const colorScheme = useColorScheme();
  
  const navTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: currentTheme.primary,
      background: currentTheme.background,
      card: currentTheme.card,
      text: currentTheme.text,
    },
  };

  return (
    <NavigationThemeProvider value={navTheme}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            title: 'Memory Game'
          }} 
        />
        <Stack.Screen 
          name="auth/login" 
          options={{ 
            presentation: 'modal',
            title: 'Login / Register',
            headerStyle: {
              backgroundColor: currentTheme.card,
            },
            headerTintColor: currentTheme.text,
          }} 
        />
        <Stack.Screen 
          name="auth/profile" 
          options={{ 
            title: 'Your Profile',
            headerStyle: {
              backgroundColor: currentTheme.card, 
            },
            headerTintColor: currentTheme.text,
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Settings',
            headerShown: false,
          }} 
        />
      </Stack>
    </NavigationThemeProvider>
  );
}

export default function AppLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SoundProvider>
          <AppStackNavigator />
        </SoundProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

## 5. Update the main index.tsx to use themes and sound

```typescript
import { 
  View, 
  Text, 
  Switch, 
  SafeAreaView, 
  TouchableOpacity
} from 'react-native'; 
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useGameLogic } from '../src/hooks/useGameLogic'; 
import { useAuth } from '../src/hooks/useAuth';
import { useTheme } from '../src/utils/themeContext';
import { useSound } from '../src/utils/soundContext';
import { getUserBestScore } from '../src/utils/scoreStorage';
import SequenceDisplay from './components/SequenceDisplay';
import NumberPad from './components/NumberPad';
import StatusBanner from './components/StatusBanner';
import AuthHeader from './components/AuthHeader';
import ScoreModal from './components/ScoreModal';
import { styles } from '../src/styles/gameStyles'; 
import { Ionicons } from '@expo/vector-icons';

import type { GameLogicReturn } from '../src/types/game';
import type { UserScore } from '../src/types/user';

export default function MemoryGame() {
  const router = useRouter();
  const { session } = useAuth();
  const { currentTheme } = useTheme();
  const { 
    playButtonSound, 
    playNumberSound, 
    playSuccessSound, 
    playFailureSound,
    startBackgroundMusic,
    stopBackgroundMusic
  } = useSound();
  
  const [bestScore, setBestScore] = useState<UserScore | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [isHighScore, setIsHighScore] = useState(false);
  
  // Start background music when component mounts
  useEffect(() => {
    startBackgroundMusic();
    return () => {
      stopBackgroundMusic();
    };
  }, []);
  
  // Game logic hook with proper typing
  const {
    gameState,
    level,
    sequence,
    playerInput,
    score,
    startGame,
    handleNumberPress,
    handleDeletePress,
    displayMode,
    toggleDisplayMode
  }: GameLogicReturn = useGameLogic();

  // Play sounds based on game state changes
  useEffect(() => {
    if (gameState === 'success') {
      playSuccessSound();
    } else if (gameState === 'failure') {
      playFailureSound();
    }
  }, [gameState]);

  // Load user's best score when authenticated
  useEffect(() => {
    if (session.isAuthenticated && session.user) {
      getUserBestScore(session.user.id).then(score => {
        if (score) setBestScore(score);
      });
    } else {
      setBestScore(null);
    }
  }, [session]);

  // Show score modal when game ends
  useEffect(() => {
    if (gameState === 'failure' && score > 0) {
      // Check if it's a high score
      const newHighScore = !bestScore || score > bestScore.score;
      setIsHighScore(newHighScore);
      setShowScoreModal(true);
      
      // If it's a new high score, refresh the best score
      if (newHighScore && session.isAuthenticated && session.user) {
        setTimeout(() => {
          getUserBestScore(session.user.id).then(score => {
            if (score) setBestScore(score);
          });
        }, 1000); // Short delay to ensure score is saved
      }
    }
  }, [gameState, score, bestScore, session]);

  // Render controls only when the game is idle or after failure.
  const renderGameControls = () => {
    if (gameState === 'idle' || gameState === 'failure') {
      return (
        <TouchableOpacity 
          style={[styles.startButton, { backgroundColor: currentTheme.primary }]} 
          onPress={() => {
            playButtonSound();
            startGame();
          }}
        >
          <Text style={[styles.buttonText, { color: currentTheme.text }]}>
            {gameState === 'failure' ? 'Try Again' : 'Start Game'}
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  // Navigate to settings
  const navigateToSettings = () => {
    playButtonSound();
    router.push('/settings');
  };

  // Modified number press handler with sound
  const handleNumberWithSound = (num: number) => {
    playNumberSound();
    handleNumberPress(num);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {/* Auth Header */}
      <AuthHeader bestScore={bestScore} />

      {/* Header with level and score info and mode toggle */}
      <View style={[styles.header, { borderBottomColor: currentTheme.border }]}>
        <Text style={[styles.infoText, { color: currentTheme.text }]}>Level: {level}</Text>
        <Text style={[styles.infoText, { color: currentTheme.text }]}>Score: {score}</Text>
        
        <View style={styles.headerButtons}>
          <View style={styles.modeToggle}>
            <Text style={[styles.modeLabel, { color: currentTheme.text }]}>
              {displayMode === 'sequential' ? 'One by One' : 'All at Once'}
            </Text>
            <Switch
              value={displayMode === 'simultaneous'}
              onValueChange={() => {
                playButtonSound();
                toggleDisplayMode();
              }}
              disabled={gameState !== 'idle' && gameState !== 'failure'}
              trackColor={{ false: currentTheme.inactive, true: currentTheme.primary }}
              thumbColor={displayMode === 'simultaneous' ? currentTheme.accent : '#f4f3f4'}
            />
          </View>
          
          <TouchableOpacity style={styles.settingsButton} onPress={navigateToSettings}>
            <Ionicons name="settings-outline" size={24} color={currentTheme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Banner */}
      <StatusBanner state={gameState} />

      {/* Sequence Display / Input Area */}
      <View style={[styles.gameArea, { backgroundColor: currentTheme.card }]}>
        {gameState === 'displaying' ? (
          // Show sequence being displayed
          <SequenceDisplay
            sequence={sequence}
            isDisplaying={true}
            level={level}
            displayMode={displayMode}
          />

        ) : gameState === 'recall' || gameState === 'success' || gameState === 'failure' ? (
          // Show input feedback during recall, success (briefly), or failure
          <View style={styles.inputDisplay}>
             {/* Optionally show the target sequence on failure */}
             {gameState === 'failure' && (
                <Text style={[styles.failSequenceText, { color: currentTheme.error }]}>
                  Sequence: {sequence.join('')}
                </Text>
             )}
            <View style={styles.inputRow}>
              {sequence.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.inputDot,
                    { borderColor: currentTheme.border },
                    index < playerInput.length ? 
                      { backgroundColor: currentTheme.primary } : 
                      { backgroundColor: 'transparent' }
                  ]}
                >
                  {/* Show entered number inside the dot */}
                  {index < playerInput.length && (
                    <Text style={[styles.inputNumber, { color: currentTheme.text }]}>
                      {playerInput[index]}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        ) : (
           // Placeholder for idle state in game area if needed
           <View style={styles.placeholderArea}>
             <Text style={[styles.placeholderText, { color: currentTheme.text }]}>
               Press Start
             </Text>
           </View>
        )}
      </View>

      {/* Game controls */}
      <View style={styles.controlArea}>
        {gameState === 'idle' || gameState === 'failure' ? (
          renderGameControls()
        ) : gameState === 'recall' ? (
          // Only show NumberPad during recall phase
          <NumberPad
            onNumberPress={handleNumberWithSound}
            onDeletePress={() => {
              playButtonSound();
              handleDeletePress();
            }}
            disabled={gameState !== 'recall'}
          />
        ) : (
          // No controls shown during 'displaying' or 'success' states
          <View style={styles.numberPadPlaceholder} />
        )}
      </View>

      {/* Score Modal */}
      <ScoreModal
        visible={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        score={score}
        level={level}
        isHighScore={isHighScore}
        previousBest={bestScore}
      />
    </SafeAreaView>
  );
}
```

## 6. Update the styles.ts file to make it work with themes

```typescript
import { StyleSheet } from 'react-native';

// Create styles as a function that accepts theme
export const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  modeLabel: {
    marginRight: 8,
    fontSize: 12,
    color: theme.text,
  },
  settingsButton: {
    padding: 5,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.card,
    margin: 10,
    borderRadius: 10,
  },
  placeholderArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  controlArea: {
    padding: 15,
    alignItems: 'center',
  },
  startButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: theme.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  inputDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  inputDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.border,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputDotFilled: {
    backgroundColor: theme.primary,
  },
  inputNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  failSequenceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.error,
    marginBottom: 15,
  },
  numberPadPlaceholder: {
    height: 200, // Match the height of the NumberPad
  },
});

// For backward compatibility, export a default version
export const styles = createStyles({
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  accent: '#4E7AF0',
  primary: '#4E7AF0',
  secondary: '#333333',
  success: '#4CAF50',
  error: '#E53935',
  inactive: '#666666',
  border: '#333333',
});
```

This implementation provides a complete customization system for your memory game with:

1. Multiple theme options with different color schemes
2. Sound effects and background music with volume control
3. User preferences that persist between sessions
4. A dedicated settings screen for customization
5. Theme-aware components that adapt to the selected theme

To fully implement this, you'll need to:
- Add actual sound files to your assets folder
- Update other components to use the theme and sound systems
- Possibly add more theme options or sound effects

These changes should give your users a personalized gaming experience that matches their preferences!

####################################
Let's improve the navigation transition between the game and profile page. Based on your directory structure, you're using Expo Router which should provide smooth transitions, but there might be issues with how the navigation is being triggered.

Here's how to improve the navigation transition:

```jsx
// In your MemoryGame component (app/index.tsx)

import { useRouter } from 'expo-router';
// Other imports...

export default function MemoryGame() {
  const router = useRouter();
  const { session } = useAuth();
  // Other state and logic...

  // Add a navigation function
  const navigateToProfile = () => {
    // Save any game state if needed
    router.push('/auth/profile');
  };

  // Pass this to your AuthHeader
  return (
    <SafeAreaView style={styles.container}>
      {/* Pass the navigation function to AuthHeader */}
      <AuthHeader 
        bestScore={bestScore} 
        onProfilePress={navigateToProfile} 
      />

      {/* Rest of your component */}
    </SafeAreaView>
  );
}
```

Then update your AuthHeader component:

```jsx
// app/components/AuthHeader.tsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../src/hooks/useAuth';
import type { UserScore } from '../../src/types/user';

type AuthHeaderProps = {
  bestScore: UserScore | null;
  onProfilePress: () => void; // Add this prop
};

export default function AuthHeader({ bestScore, onProfilePress }: AuthHeaderProps) {
  const { session } = useAuth();

  return (
    <View style={styles.authBar}>
      {session.isAuthenticated && session.user ? (
        <View style={styles.userInfo}>
          <Text style={styles.username}>{session.user.username}</Text>
          {bestScore && (
            <Text style={styles.bestScore}>Best: {bestScore.score}</Text>
          )}
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={onProfilePress} // Use the prop instead of direct navigation
          >
            <Text style={styles.profileButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={onProfilePress} // Use same function for login
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Your styles...
});
```

Additionally, to make the navigation smoother:

1. Add proper navigation animations in your `_layout.tsx` file:

```jsx
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // You can try different animations
        gestureEnabled: true,
        animationDuration: 200,
        presentation: 'card'
      }}
    />
  );
}
```

2. Make sure your profile page loads quickly by optimizing any heavy operations:

```jsx
// app/auth/profile.tsx
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/hooks/useAuth';

export default function Profile() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Load user data
    const loadData = async () => {
      // Fetch needed data
      setLoading(false); 
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4E7AF0" />
      </View>
    );
  }
  
  // Rest of your profile component
}
```

These changes will help create a smoother transition by:
1. Using proper navigation methods through Expo Router
2. Adding animation configurations 
3. Using a loading state on the profile page
4. Centralizing navigation logic

The key is to ensure navigation is handled consistently and that the destination page is ready to render quickly when users navigate to it.