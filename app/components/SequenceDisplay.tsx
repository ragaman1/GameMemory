// app/components/SequenceDisplay.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface SequenceDisplayProps {
  sequence: number[];
  isDisplaying: boolean;
  level: number;
  gameMode: 'sequence' | 'wholeNumber';
}

export default function SequenceDisplay({ 
  sequence, 
  isDisplaying, 
  level,
  gameMode 
}: SequenceDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const fadeAnim = useState(new Animated.Value(0))[0];
  
  useEffect(() => {
    if (isDisplaying && sequence.length > 0) {
      setCurrentIndex(-1);
      if (gameMode === 'wholeNumber') {
        // For wholeNumber mode, we don't need the sequence animation
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            delay: 2000, // Display the whole number for 2 seconds
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        displaySequence();
      }
    }
  }, [isDisplaying, sequence, gameMode]);
  
  const displaySequence = () => {
    sequence.forEach((_, index) => {
      setTimeout(() => {
        setCurrentIndex(index);
        
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            delay: 600 - Math.min(level * 50, 400), // Display gets faster with higher levels
            useNativeDriver: true,
          }),
        ]).start();
      }, index * 1000);
    });
  };
  
  return (
    <View style={styles.container}>
      {isDisplaying ? (
        <Animated.View style={[styles.numberDisplay, { opacity: fadeAnim }]}>
          <Text style={styles.number}>
            {gameMode === 'wholeNumber'
              ? String(sequence[0]) // Display the entire number
              : (currentIndex >= 0 && currentIndex < sequence.length
                ? String(sequence[currentIndex])
                : "")}
          </Text>
        </Animated.View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Sequence will appear here</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberDisplay: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#95a5a6',
  },
});