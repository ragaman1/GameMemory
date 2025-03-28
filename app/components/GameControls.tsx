// app/components/GameControls.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface GameControlsProps {
  onStart: () => void;
  gameState: string;
}

export default function GameControls({ onStart, gameState }: GameControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onStart}>
        <Text style={styles.buttonText}>
          {gameState === 'failure' ? 'Play Again' : 'Start Game'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  button: {
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
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});