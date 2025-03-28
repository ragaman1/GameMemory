// app/index.tsx
import React, { useState, useEffect } from 'react';
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

  // Clear the sequence when game is idle to avoid confusion
  useEffect(() => {
    if (gameState === 'idle') {
      setSequence([]);
      setPlayerInput([]);
    }
  }, [gameState]);
  
  const startGame = () => {
    setLevel(1);
    setScore(0);
    startLevel();
  };
  
  const startLevel = () => {
    const newSequence = generateSequence(level + 2); // Level 1 starts with 3 numbers
    setSequence(newSequence);
    setPlayerInput([]);
    setGameState('displaying');
    
    // After display is complete, allow player to recall
    setTimeout(() => {
      setGameState('recall');
    }, (level + 2) * 1000); // Display time scales with sequence length
  };
  
  const handleNumberPress = (num: number) => {
    if (gameState !== 'recall') return;
    
    const newInput = [...playerInput, num];
    setPlayerInput(newInput);
    
    // Check if player has entered the full sequence
    if (newInput.length === sequence.length) {
      checkAnswer(newInput);
    }
  };
  
  const checkAnswer = (input: number[]) => {
    const correct = input.every((num, index) => num === sequence[index]);
    
    if (correct) {
      setScore(score + level * 10);
      setGameState('success');
      setTimeout(() => {
        setLevel(prevLevel => prevLevel + 1);
        startLevel();
      }, 1500);
    } else {
      setGameState('failure');
    }
  };

  const renderGameControls = () => {
    if (gameState === 'idle') {
      return (
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={startGame}
        >
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      );
    } else if (gameState === 'failure') {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.gameButton} 
            onPress={startGame}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={() => setGameState('idle')}
        >
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with game info */}
      <View style={styles.header}>
        <Text style={styles.infoText}>Level: {level}</Text>
        <Text style={styles.infoText}>Score: {score}</Text>
        
        {/* Small reset button only visible during active gameplay */}
        {(gameState === 'displaying' || gameState === 'recall' || gameState === 'success') && (
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={() => setGameState('idle')}
          >
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Game status banner */}
      <View style={[
        styles.statusBanner, 
        gameState === 'success' ? styles.successBanner : 
        gameState === 'failure' ? styles.failureBanner : 
        gameState === 'displaying' ? styles.displayingBanner : 
        gameState === 'recall' ? styles.recallBanner : 
        styles.idleBanner
      ]}>
        <Text style={styles.statusText}>
          {gameState === 'idle' && "Ready to start!"}
          {gameState === 'displaying' && "Memorize the sequence..."}
          {gameState === 'recall' && "Recall the sequence!"}
          {gameState === 'success' && "Correct! Well done!"}
          {gameState === 'failure' && "Incorrect! Game Over!"}
        </Text>
      </View>
      
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
                  index < playerInput.length ? styles.inputDotFilled : null
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
      
      {/* Conditionally render either the Start/Play Again button or the Number Pad */}
      {gameState === 'idle' || gameState === 'failure' ? (
        <View style={styles.controlArea}>
          {renderGameControls()}
        </View>
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
  resetButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 5,
  },
  resetText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
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
  gameButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  numberPadContainer: {
    flex: 3,
  },
});