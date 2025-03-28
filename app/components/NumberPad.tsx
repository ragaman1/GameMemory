// app/components/NumberPad.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface NumberPadProps {
  onNumberPress: (num: number) => void;
  disabled: boolean;
}

export default function NumberPad({ onNumberPress, disabled }: NumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  
  return (
    <View style={styles.container}>
      <Text style={styles.padTitle}>
        {disabled ? "Please wait..." : "Enter the sequence:"}
      </Text>
      <View style={styles.grid}>
        {numbers.map((num) => (
          <TouchableOpacity
            key={num}
            style={[styles.button, disabled ? styles.buttonDisabled : null]}
            onPress={() => onNumberPress(num)}
            disabled={disabled}
          >
            <Text style={[styles.buttonText, disabled ? styles.textDisabled : null]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  padTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#555',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    margin: 10,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: '#ecf0f1',
  },
  buttonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  textDisabled: {
    color: '#95a5a6'
  }
});