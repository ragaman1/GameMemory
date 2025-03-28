// app/components/NumberPad.tsx
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface NumberPadProps {
  onNumberPress: (num: number) => void;
  disabled: boolean;
  buttonSize?: number;
  buttonSpacing?: number;
}

const DEFAULT_BUTTON_SIZE = 75;
const DEFAULT_BUTTON_SPACING = 5;

// Helper function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = (array: number[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function NumberPad({
  onNumberPress,
  disabled,
  buttonSize = DEFAULT_BUTTON_SIZE,
  buttonSpacing = DEFAULT_BUTTON_SPACING,
}: NumberPadProps) {
  const [randomizedLayout, setRandomizedLayout] = useState<Array<Array<number | null>>>([]);

  useEffect(() => {
    // Generate all numbers (0-9) and shuffle them
    const allNumbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
    
    // Create the randomized layout while maintaining the original structure
    const newLayout = [
      [allNumbers[0], allNumbers[1], allNumbers[2]],
      [allNumbers[3], allNumbers[4], allNumbers[5]],
      [allNumbers[6], allNumbers[7], allNumbers[8]],
      [null, allNumbers[9], null], // Keep 0 centered at bottom
    ];
    
    setRandomizedLayout(newLayout);
  }, []);

  const buttonStyle = {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    marginHorizontal: buttonSpacing / 2,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  };

  const disabledButtonStyle = {
    backgroundColor: '#a5c9e3',
    elevation: 0,
    shadowOpacity: 0,
  };

  const emptyButtonStyle = {
    width: buttonSize,
    height: buttonSize,
    marginHorizontal: buttonSpacing / 2,
  };

  const rowStyle = {
    marginBottom: buttonSpacing,
  };

  return (
    <View style={styles.container}>
      {randomizedLayout.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={[styles.row, rowStyle]}>
          {row.map((num, colIndex) =>
            num !== null ? (
              <TouchableOpacity
                key={`${num}-${rowIndex}-${colIndex}`}
                style={[
                  styles.baseButton,
                  buttonStyle,
                  disabled && disabledButtonStyle,
                ]}
                onPress={() => onNumberPress(num)}
                disabled={disabled}
                activeOpacity={disabled ? 1 : 0.7}
              >
                <Text style={styles.buttonText}>{num}</Text>
              </TouchableOpacity>
            ) : (
              <View
                key={`empty-${rowIndex}-${colIndex}`}
                style={emptyButtonStyle}
              />
            )
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  baseButton: {},
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});