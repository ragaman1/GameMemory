// app/index.tsx
import { View, Text, Switch, SafeAreaView, TouchableOpacity } from 'react-native';
import { useGameLogic } from '../src/hooks/useGameLogic';
import SequenceDisplay from './components/SequenceDisplay';
import NumberPad from './components/NumberPad';
import SequenceReview from './components/SequenceReview';
import { createStyles } from '../src/styles/gameStyles';
import { useTheme } from '../src/contexts/ThemeContext';
// You'll need to install: npm install @expo/vector-icons
// Removed Ionicons import as it was only used in the removed header
// import { Ionicons } from '@expo/vector-icons';

import type { GameLogicReturn } from '../src/types/game';

export default function MemoryGame() {
  // Get theme context
  const { theme, colors } = useTheme(); // Removed unused toggleTheme from here
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
    toggleDisplayMode, // Keep this logic if needed elsewhere, e.g., in settings
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
      {/* REMOVED THE <View style={styles.header}> BLOCK THAT WAS HERE */}

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
                {/* Removed display of level/score from here - consider adding back if needed */}
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
                 {/* Display Level and Score below input dots */}
                 <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>Level: {level}</Text>
                  <Text style={styles.infoText}>Score: {score}</Text>
                 </View>
                 {/* Display Mode Toggle */}
                 { (gameState === 'idle' || gameState === 'failure' || gameState === 'gameover') &&
                  <View style={styles.modeToggle}>
                      <Text style={[styles.modeLabel, { color: colors.text }]}>
                        {displayMode === 'sequential' ? 'One by One' : 'All at Once'}
                      </Text>
                      <Switch
                        value={displayMode === 'simultaneous'}
                        onValueChange={toggleDisplayMode}
                        // Disabled logic might need adjustment based on exact state transitions
                        disabled={gameState !== 'idle' && gameState !== 'failure' && gameState !== 'gameover'}
                        // Consider adding theme colors to the switch track/thumb if desired
                      />
                 </View>
                }
              </>
            )}
          </View>
        ) : (
           // Placeholder for idle state in game area if needed
           <View style={styles.placeholderArea}>
             {/* Display Level and Score in placeholder */}
             <View style={styles.infoContainer}>
               <Text style={[styles.infoText, { marginBottom: 10 }]}>Level: {level}</Text>
               <Text style={[styles.infoText, { marginBottom: 20 }]}>Score: {score}</Text>
             </View>
              {/* Display Mode Toggle */}
              <View style={styles.modeToggle}>
                  <Text style={[styles.modeLabel, { color: colors.text }]}>
                    {displayMode === 'sequential' ? 'One by One' : 'All at Once'}
                  </Text>
                  <Switch
                    value={displayMode === 'simultaneous'}
                    onValueChange={toggleDisplayMode}
                    disabled={gameState !== 'idle' && gameState !== 'failure' && gameState !== 'gameover'}
                  />
              </View>
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

