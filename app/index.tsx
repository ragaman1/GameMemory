// app/index.tsx
import { View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import SequenceDisplay from './components/SequenceDisplay';
import NumberPad from './components/NumberPad';
import { createStyles } from '../src/styles/gameStyles';
import { useTheme } from '../src/contexts/ThemeContext';
import { useGame } from '../src/contexts/GameContext';

export default function MemoryGame() {
  // Get theme context
  const { colors } = useTheme();
  const styles = createStyles(colors);
  
  // Use the game context instead of direct hook
  const {
    gameState,
    level,
    sequence,
    playerInput,
    startGame,
    handleNumberPress,
    handleDeletePress,
    displayMode
  } = useGame();

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
      {/* Removed header - now in Stack navigator */}

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

      {/* Render the game controls OR the number pad based on game state */}
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