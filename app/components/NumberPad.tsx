// app/components/NumberPad.tsx
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Import your styles
import { createStyles } from '../../src/styles/gameStyles';
import { useTheme } from '../../src/contexts/ThemeContext';

interface NumberPadProps {
  onNumberPress: (num: number) => void;
  onDeletePress: () => void;
  disabled: boolean;
  buttonSize?: number;
  buttonSpacing?: number;
}

const DEFAULT_BUTTON_SIZE = 55; // Default size from your original code
const DEFAULT_BUTTON_SPACING = 10; // Default spacing from your original code

type LayoutElement = number | 'delete' | null;

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
  onDeletePress,
  disabled,
  buttonSize = DEFAULT_BUTTON_SIZE,
  buttonSpacing = DEFAULT_BUTTON_SPACING,
}: NumberPadProps) {
  const { colors } = useTheme();
  const gameStyles = createStyles(colors);
  const [randomizedLayout, setRandomizedLayout] = useState<Array<Array<LayoutElement>>>([]);

  useEffect(() => {
    const allNumbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
    const newLayout: Array<Array<LayoutElement>> = [
      [allNumbers[0], allNumbers[1], allNumbers[2]],
      [allNumbers[3], allNumbers[4], allNumbers[5]],
      [allNumbers[6], allNumbers[7], allNumbers[8]],
      [null, allNumbers[9], 'delete'],
    ];
    setRandomizedLayout(newLayout);
  }, []);

  const rowStyle = {
    marginBottom: buttonSpacing,
  };

  // Combine dynamic sizing with base styles from StyleSheet
  const baseButtonStyle = {
    width: buttonSize,
    height: buttonSize,
    ...gameStyles.numberPadButtonBase, // Apply shadow, borderRadius, margin etc.
  };

  // Combine base + specific number styles + conditional disabled BG
  const numberButtonStyle = [
    baseButtonStyle,
    gameStyles.numberPadNumberButton,
    disabled && gameStyles.numberPadDisabledButton,
  ];

  // Combine base + specific delete styles + conditional disabled BG
  const deleteButtonStyle = [
    baseButtonStyle,
    gameStyles.numberPadDeleteButton,
    disabled && gameStyles.numberPadDisabledButton,
  ];

  // Determine TEXT color: Disabled style or default style
  const textStyle = [
    gameStyles.numberPadButtonText, // Default white text style
    disabled && gameStyles.numberPadDisabledContent, // Apply disabled color if needed
  ];

  // Determine ICON color: Disabled color or default icon color (white)
  const iconColor = disabled
    ? gameStyles.numberPadDisabledContent.color // Use the new disabled content color
    : gameStyles.numberPadDeleteIcon.color;     // Use the defined white icon color

  const emptyCellStyle = {
    width: buttonSize,
    height: buttonSize,
    marginHorizontal: 30, // Add this to match button margins
  };

  return (
    <View style={gameStyles.numberPadContainer}>
      {randomizedLayout.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={[gameStyles.numberPadRow, rowStyle]}>
          {row.map((item, colIndex) => {
            const key = `${item}-${rowIndex}-${colIndex}`;

            if (item === 'delete') {
              return (
                <TouchableOpacity
                  key={key}
                  style={deleteButtonStyle}
                  onPress={onDeletePress}
                  disabled={disabled}
                  activeOpacity={disabled ? 1 : 0.7}
                >
                  <Ionicons
                    name="backspace-outline"
                    size={buttonSize * 0.4}
                    color={iconColor}
                  />
                </TouchableOpacity>
              );
            } else if (typeof item === 'number') {
              return (
                <TouchableOpacity
                  key={key}
                  style={numberButtonStyle}
                  onPress={() => onNumberPress(item)}
                  disabled={disabled}
                  activeOpacity={disabled ? 1 : 0.7}
                >
                  <Text style={textStyle}>{item}</Text>
                </TouchableOpacity>
              );
            } else {
              return (
                <View
                  key={`empty-${rowIndex}-${colIndex}`}
                  style={emptyCellStyle}
                >
                  <Text style={{ opacity: 0 }}> </Text>
                </View>
              );
            }
          })}
        </View>
      ))}
    </View>
  );
}