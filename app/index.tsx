// app/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import SequenceDisplay from './components/SequenceDisplay';
import NumberPad from './components/NumberPad';
import { generateSequence } from './utils/gameLogic';

export default function MemoryGame() {
  const [gameState, setGameState] = useState('idle'); // idle, displaying, recall, success, failure
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameMode, setGameMode] = useState<'sequence' | 'wholeNumber'>('sequence'); // ADDED

  // Ref to handle timeouts so they can be cleared when needed.
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear sequence and input when game state is idle
  useEffect(() => {
    if (gameState === 'idle') {
      setSequence([]);
      setPlayerInput([]);
    }
  }, [gameState]);

  // startLevel now accepts the current level explicitly.
  const startLevel = (currentLevel: number) => {
    // Generate a sequence with length based on the current level.
    const newSequence = generateSequence(currentLevel + 2);
    let displayValue: number[] | number;

    if (gameMode === 'wholeNumber') {
      const numberString = newSequence.join('');
      displayValue = parseInt(numberString, 10); //convert to a single number
      setSequence([displayValue]); // Adjust the sequence to hold the single number
    } else {
      displayValue = newSequence; // use the array
      setSequence(newSequence);
    }
    setPlayerInput([]);
    setGameState('displaying');

    // Adjust the timeout based on the game mode
    const displayTime = gameMode === 'wholeNumber' ? 2000 : (currentLevel + 2) * 1000;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setGameState('recall');
    }, displayTime);
  };

  // Restart the game at level 1.
  const startGame = () => {
    // Clear any pending timeouts to avoid interference from a previous round.
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLevel(1);
    setScore(0);
    startLevel(1);
  };

  const handleNumberPress = (num: number) => {
    if (gameState !== 'recall') return;

    const newInput = [...playerInput, num];
    setPlayerInput(newInput);

    // If the player has input the full sequence, check the answer.
    if (gameMode === 'wholeNumber') {
        if (newInput.length === sequence[0].toString().length) {
            checkAnswer(newInput);
        }
    }
    else if (newInput.length === sequence.length) {
      checkAnswer(newInput);
    }
  };

  const checkAnswer = (input: number[]) => {
    let correct: boolean = false;

    if (gameMode === 'wholeNumber') {
      //Convert user input to a single number for comparison
      const playerNumber = parseInt(input.join(''), 10);
      correct = playerNumber === sequence[0];
    } else {
      correct = input.every((num, index) => num === sequence[index]);
    }

    if (correct) {
      setScore(score + level * 10);
      setGameState('success');

      // Clear any pending timeout for safety.
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // After a brief delay, proceed to the next level.
      timeoutRef.current = setTimeout(() => {
        const newLevel = level + 1;
        setLevel(newLevel);
        startLevel(newLevel);
      }, 1500);
    } else {
      // On failure, clear any pending timeout and set game state to failure.
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setGameState('failure');
    }
  };

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

      {/* Game status banner */}
      <View
        style={[
          styles.statusBanner,
          gameState === 'success'
            ? styles.successBanner
            : gameState === 'failure'
            ? styles.failureBanner
            : gameState === 'displaying'
            ? styles.displayingBanner
            : gameState === 'recall'
            ? styles.recallBanner
            : styles.idleBanner,
        ]}
      >
        <Text style={styles.statusText}>
          {gameState === 'idle' && 'Ready to start!'}
          {gameState === 'displaying' && 'Memorize the sequence...'}
          {gameState === 'recall' && 'Recall the sequence!'}
          {gameState === 'success' && 'Correct! Well done!'}
          {gameState === 'failure' && 'Incorrect! Game Over!'}
        </Text>
      </View>

      {/* Add this to your existing MemoryGame component, preferably near the header */}
      <View style={styles.modeSwitcher}>
        <TouchableOpacity 
          style={[
            styles.modeButton, 
            gameMode === 'sequence' && styles.activeMode
          ]}
          onPress={() => {
            if (gameMode !== 'sequence') {
              setGameMode('sequence');
              setGameState('idle');
            }
          }}
        >
          <Text style={styles.modeButtonText}>Sequence Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.modeButton, 
            gameMode === 'wholeNumber' && styles.activeMode
          ]}
          onPress={() => setGameMode('wholeNumber')}
        >
          <Text style={styles.modeButtonText}>Whole Number Mode</Text>
        </TouchableOpacity>
      </View>


      {/* Sequence Display */}
      <View style={styles.gameArea}>
        <SequenceDisplay
          sequence={sequence}
          isDisplaying={gameState === 'displaying'}
          level={level}
          gameMode={gameMode} // ADDED
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBanner: {
    width: '100%',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleBanner: {
    backgroundColor: '#95a5a6',
  },

  modeSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  modeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3498db',
    backgroundColor: '#f5f5f5',
  },
  activeMode: {
    backgroundColor: '#3498db',
  },
  activeModeText: {
    color: 'white',
  },

  displayingBanner: {
    backgroundColor: '#3498db',
  },
  recallBanner: {
    backgroundColor: '#2ecc71',
  },
  successBanner: {
    backgroundColor: '#2ecc71',
  },
  failureBanner: {
    backgroundColor: '#e74c3c',
  },
  statusText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '90%',
  },
  inputDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#3498db',
    marginHorizontal: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputDotFilled: {
    backgroundColor: '#3498db',
  },
  inputNumber: {
    color: 'white',
    fontWeight: 'bold',
  },
  controlArea: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

modeButtonText: {
  color: '#3498db',
  fontWeight: 'bold',
},
buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  numberPadContainer: {
    flex: 3,
  },
});