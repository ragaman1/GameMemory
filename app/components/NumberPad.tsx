// app/components/NumberPad.tsx
import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface NumberPadProps {
  onNumberPress: (num: number) => void;
  disabled: boolean;
}

export default function NumberPad({ onNumberPress, disabled }: NumberPadProps) {
  // Using useMemo so that the numbers are shuffled on component mount.
  const numbers = useMemo(() => shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]), []);

  return (
    <View style={styles.container}>
      {numbers.map((num) => (
        <TouchableOpacity
          key={num}
          style={styles.button}
          onPress={() => onNumberPress(num)}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>{num}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Helper function to shuffle an array
function shuffleArray(array: number[]) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    width: 80,
    height: 80,
    backgroundColor: '#3498db',
    margin: 10, // Adds margin around each button
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});