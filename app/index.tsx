// app/index.tsx
import { View, Text, Switch, SafeAreaView, TouchableOpacity } from 'react-native';
import { useGameLogic } from '../src/hooks/useGameLogic';
import SequenceDisplay from './components/SequenceDisplay';
import NumberPad from './components/NumberPad';
import SequenceReview from './components/SequenceReview';
import { createStyles } from '../src/styles/gameStyles';
import { useTheme } from '../src/contexts/ThemeContext';
// You'll need to install: npm install @expo/vector-icons
import { Ionicons } from '@expo/vector-icons';

import type { GameLogicReturn } from '../src/types/game';

export default function MemoryGame() {
  // Get theme context
  const { theme, toggleTheme, colors } = useTheme();
  const styles = createStyles(colors);
  
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
    toggleDisplayMode,
    lives,
    lastFailedSequence
  }: GameLogicReturn = useGameLogic();

  // Render controls only when the game is idle or after failure.
  const renderGameControls = () => {
    if (gameState === 'idle' || gameState === 'failure' || gameState === 'gameover') {
      return (
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.buttonText}>
            {gameState === 'gameover' ? 'Game Over - Restart' :
             gameState === 'failure' ? 'Try Again' : 'Start Game'}
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with level, score, theme toggle, and mode toggle */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.infoText}>Level: {level}</Text>
          
          {/* Theme toggle */}
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Ionicons
              name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.infoText}>Score: {score}</Text>
        
        <View style={styles.modeToggle}>
          <Text style={styles.modeLabel}>
            {displayMode === 'sequential' ? 'One by One' : 'All at Once'}
          </Text>
          <Switch
            value={displayMode === 'simultaneous'}
            onValueChange={toggleDisplayMode}
            disabled={gameState !== 'idle' && gameState !== 'failure' && gameState !== 'gameover'}
          />
        </View>
      </View>
{/* Status Banner - Removed */}


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

        ) : gameState === 'recall' || gameState === 'success' || gameState === 'failure' || gameState === 'review' ? (
          // Show input feedback during recall, success (briefly), failure, or review
          <View style={styles.inputDisplay}>
            {gameState === 'review' && lastFailedSequence ? (
              <SequenceReview
                correct={lastFailedSequence.correct}
                player={lastFailedSequence.player}
                lives={lives}
                level={level}
              />
            ) : (
              <>
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
                        // Add conditional styling for correctness on failure?
                      ]}
                    >
                      {/* Show entered number inside the dot */}
                      {index < playerInput.length && (
                        <Text style={styles.inputNumber}>{playerInput[index]}</Text>
                      )}
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        ) : (
           // Placeholder for idle state in game area if needed
           <View style={styles.placeholderArea}>
             <Text style={styles.placeholderText}>Press Start</Text>
           </View>
        )}
      </View>

      {/* Render the game controls OR the number pad based on game state */}
      <View style={styles.controlArea}>
        {gameState === 'idle' || gameState === 'failure' || gameState === 'gameover' ? (
          renderGameControls()
        ) : gameState === 'recall' ? (
          // Only show NumberPad during recall phase
          <NumberPad
            onNumberPress={handleNumberPress}
            onDeletePress={handleDeletePress} // Pass the handler here
            disabled={gameState !== 'recall'} // Already handled, but explicit is fine
          />
        ) : (
          // No controls shown during 'displaying' or 'success' states
          <View style={styles.numberPadPlaceholder} /> // Optional: maintain layout space
        )}
      </View>
    </SafeAreaView>
  );
}

