// app/components/NumberPad.tsx
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
// Import an icon library (make sure @expo/vector-icons is installed)
import { Ionicons } from '@expo/vector-icons';

interface NumberPadProps {
  onNumberPress: (num: number) => void;
  onDeletePress: () => void; // New prop for delete action
  disabled: boolean;
  buttonSize?: number;
  buttonSpacing?: number;
}

const DEFAULT_BUTTON_SIZE = 75;
const DEFAULT_BUTTON_SPACING = 5;

// Define a type for the layout elements
type LayoutElement = number | 'delete' | null;

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
  onDeletePress, // Destructure the new prop
  disabled,
  buttonSize = DEFAULT_BUTTON_SIZE,
  buttonSpacing = DEFAULT_BUTTON_SPACING,
}: NumberPadProps) {
  // Update state type to include 'delete'
  const [randomizedLayout, setRandomizedLayout] = useState<Array<Array<LayoutElement>>>([]);

  useEffect(() => {
    // Generate all numbers (0-9) and shuffle them
    const allNumbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);

    // Create the randomized layout, adding 'delete' to the last row
    const newLayout: Array<Array<LayoutElement>> = [
      [allNumbers[0], allNumbers[1], allNumbers[2]],
      [allNumbers[3], allNumbers[4], allNumbers[5]],
      [allNumbers[6], allNumbers[7], allNumbers[8]],
      [null, allNumbers[9], 'delete'], // Place 'delete' identifier
    ];

    setRandomizedLayout(newLayout);
  }, []); // Keep empty dependency array to run only once on mount

  const baseButtonStyle = {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    marginHorizontal: buttonSpacing / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  };

  const numberButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#3498db',
  };

  // Optional: Style the delete button differently
  const deleteButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#e74c3c', // Example: Red color for delete
  };

  const disabledButtonStyle = {
    backgroundColor: '#bdc3c7', // Universal disabled color
    elevation: 0,
    shadowOpacity: 0,
  };

  const emptyCellStyle = {
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
          {row.map((item, colIndex) => {
            const key = `${item}-${rowIndex}-${colIndex}`;

            if (item === 'delete') {
              // Render Delete Button
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.baseButton,
                    deleteButtonStyle, // Apply delete style
                    disabled && disabledButtonStyle,
                  ]}
                  onPress={onDeletePress} // Use onDeletePress handler
                  disabled={disabled}
                  activeOpacity={disabled ? 1 : 0.7}
                >
                  {/* Use an icon for delete */}
                   <Ionicons name="backspace-outline" size={28} color="#fff" />
                </TouchableOpacity>
              );
            } else if (typeof item === 'number') {
              // Render Number Button
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.baseButton,
                    numberButtonStyle, // Apply number style
                    disabled && disabledButtonStyle,
                  ]}
                  onPress={() => onNumberPress(item)} // Use onNumberPress
                  disabled={disabled}
                  activeOpacity={disabled ? 1 : 0.7}
                >
                  <Text style={styles.buttonText}>{item}</Text>
                </TouchableOpacity>
              );
            } else {
              // Render Empty Space
              return (
                <View
                  key={`empty-${rowIndex}-${colIndex}`}
                  style={emptyCellStyle}
                />
              );
            }
          })}
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
  baseButton: {
    // Common styles moved to inline baseButtonStyle object
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});
