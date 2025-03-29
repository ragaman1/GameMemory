// app/index.tsx
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import useGameLogic from './hooks/useGameLogic';
import SequenceDisplay from './components/SequenceDisplay';
import NumberPad from './components/NumberPad';
import StatusBanner from './components/StatusBanner';
import styles from './styles/gameStyles';
import type { GameLogicReturn } from './types/game';

export default function MemoryGame() {
  // Single hook call with proper typing
  const {
    gameState,
    level,
    sequence,
    playerInput,
    score,
    startGame,
    handleNumberPress
  }: GameLogicReturn = useGameLogic();


  // Render controls only when the game is idle or after failure.
  const renderGameControls = () => {
    if (gameState === 'idle' || gameState === 'failure') {
      return (
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.buttonText}>
            {gameState === 'failure' ? 'Play Again' : 'Start Game'}
          </Text>
        </TouchableOpacity>
      );
    }
    // During active gameplay we do not render any extra controls.
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with level and score info */}
      <View style={styles.header}>
        <Text style={styles.infoText}>Level: {level}</Text>
        <Text style={styles.infoText}>Score: {score}</Text>
      </View>
      {/* Status Banner */}
      {/* The StatusBanner component will change its style and text based on the game state */}
      <StatusBanner state={gameState} />

      {/* Sequence Display */}
      <View style={styles.gameArea}>
        <SequenceDisplay 
          sequence={sequence}
          isDisplaying={gameState === 'displaying'}
          level={level}
        />
      </View>

      {/* Input indicators */}
      {gameState !== 'idle' && (
        <View style={styles.inputDisplay}>
          <View style={styles.inputRow}>
            {sequence.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.inputDot,
                  index < playerInput.length ? styles.inputDotFilled : null,
                ]}
              >
                {index < playerInput.length && (
                  <Text style={styles.inputNumber}>{playerInput[index]}</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Render the game controls or the number pad based on game state */}
      {gameState === 'idle' || gameState === 'failure' ? (
        <View style={styles.controlArea}>{renderGameControls()}</View>
      ) : (
        <View style={styles.numberPadContainer}>
          <NumberPad 
            onNumberPress={handleNumberPress}
            disabled={gameState !== 'recall'}
          />
        </View>
      )}
    </SafeAreaView>
  );
}