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
import { styles } from '../src/styles/gameStyles'; 

import type { GameLogicReturn } from '../src/types/game';
import type { UserScore } from '../src/types/user';

export default function MemoryGame() {
  const router = useRouter();
  const { session } = useAuth();
  const [bestScore, setBestScore] = useState<UserScore | null>(null);
  
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

  // Update best score when game ends (but no alerts or modals)
  useEffect(() => {
    if (gameState === 'failure' && score > 0 && session.isAuthenticated && session.user) {
      // Check if score is higher than current best
      if (!bestScore || score > bestScore.score) {
        // Refresh best score
        setTimeout(() => {
          session.user && getUserBestScore(session.user.id).then(score => {
            if (score) setBestScore(score);
          });
        }, 1000);
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
    </SafeAreaView>
  );
}

const authStyles = StyleSheet.create({
  authBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
});