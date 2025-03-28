// app/components/NumberPad.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, DimensionValue } from 'react-native';

interface NumberPadProps {
  onNumberPress: (num: number) => void;
  disabled: boolean;
  // Optional: Allow customizing button size and spacing
  buttonSize?: number;
  buttonSpacing?: number;
}

// Define constants for easier maintenance and clarity
const DEFAULT_BUTTON_SIZE = 75; // Slightly smaller for better fit
const DEFAULT_BUTTON_SPACING = 10;

// The layout remains the same logically
const keypadLayout = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [null, 0, null], // 0 centered at bottom
];

export default function NumberPad({
  onNumberPress,
  disabled,
  buttonSize = DEFAULT_BUTTON_SIZE,
  buttonSpacing = DEFAULT_BUTTON_SPACING,
}: NumberPadProps) {

  // Calculate dynamic styles based on props
  const buttonStyle = {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2, // Make it round
    marginHorizontal: buttonSpacing / 2,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  };

  const disabledButtonStyle = {
    backgroundColor: '#a5c9e3', // Lighter color when disabled
    elevation: 0, // No shadow when disabled
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
      {keypadLayout.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={[styles.row, rowStyle]}>
          {row.map((num, colIndex) =>
            num !== null ? (
              <TouchableOpacity
                key={num}
                style={[
                  styles.baseButton, // Common base styles
                  buttonStyle,      // Dynamic size/shape/color styles
                  disabled && disabledButtonStyle, // Apply disabled style conditionally
                ]}
                onPress={() => onNumberPress(num)}
                disabled={disabled}
                activeOpacity={disabled ? 1 : 0.7} // Prevent opacity change when disabled
              >
                <Text style={styles.buttonText}>{num}</Text>
              </TouchableOpacity>
            ) : (
              <View
                key={`empty-${rowIndex}-${colIndex}`}
                style={emptyButtonStyle} // Spacer view
              />
            )
          )}
        </View>
      ))}
    </View>
  );
}

// Keep StyleSheet for static styles that don't depend on props
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20, // Adjust as needed based on button size/spacing
    paddingBottom: 20,
    alignItems: 'center', // Center the rows horizontally
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%', // Ensure row takes full width for centering its content
  },
  baseButton: {
    // Base styles common to all buttons (e.g., alignment)
    // Moved dynamic size/color to inline styles for customization
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  // No need for specific button/emptyButton styles here anymore
  // as they are calculated dynamically based on props
});
