// app/index.tsx
import { View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import SequenceDisplay from './components/SequenceDisplay';
import NumberPad from './components/NumberPad';
import SequenceReview from './components/SequenceReview';
import { createStyles } from '../src/styles/gameStyles';
import { useTheme } from '../src/contexts/ThemeContext';
import { useGame } from '../src/contexts/GameContext';

export default function MemoryGame() {
  // Get theme context
  const { colors } = useTheme();
  const styles = createStyles(colors);
  
  // Use the game context with updated properties
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
    lives,
    lastFailedSequence
  } = useGame();

  // Render controls only when the game is idle, after failure, or game over
  const renderGameControls = () => {
    if (gameState === 'idle' || gameState === 'failure' || gameState === 'gameover') {
      return (
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.buttonText}>
            {gameState === 'gameover' ? 'Play Again' : 
             gameState === 'failure' ? 'Try Again' : 'Start Game'}
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Game Info Area - Add lives display */}
      <View style={styles.gameInfoArea}>
        <Text style={styles.infoText}>Level: {level}</Text>
        <Text style={styles.infoText}>Score: {score}</Text>
        <Text style={styles.infoText}>Lives: {lives}</Text>
      </View>

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
        ) : gameState === 'review' && lastFailedSequence ? (
          // Show the review screen
          <SequenceReview
            correct={lastFailedSequence.correct}
            player={lastFailedSequence.player}
            lives={lives}
            level={level}
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
        ) : gameState === 'gameover' ? (
          // Game Over display
          <View style={styles.gameOverArea}>
            <Text style={styles.gameOverText}>Game Over!</Text>
            <Text style={styles.finalScoreText}>Final Score: {score}</Text>
            <Text style={styles.levelReachedText}>Level Reached: {level}</Text>
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
            onDeletePress={handleDeletePress}
            disabled={gameState !== 'recall'}
          />
        ) : (
          // No controls shown during 'displaying', 'success' or 'review' states
          <View style={styles.numberPadPlaceholder} />
        )}
      </View>
    </SafeAreaView>
  );
}