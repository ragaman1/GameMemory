import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface SequenceDisplayProps {
  sequence: number[];
  isDisplaying: boolean;
  level: number;
}

export default function SequenceDisplay({ sequence, isDisplaying, level }: SequenceDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const fadeAnim = useState(new Animated.Value(0))[0];
  
  // Use useCallback to properly handle dependencies
  const displaySequence = useCallback(() => {
    // Clear any existing timeouts
    const timeouts: NodeJS.Timeout[] = [];
    
    sequence.forEach((_, index) => {
      const timeout = setTimeout(() => {
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
      
      timeouts.push(timeout);
    });
    
    // Cleanup function to clear timeouts if component unmounts or effect reruns
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [sequence, level, fadeAnim]); // Include all dependencies!
  
  useEffect(() => {
    if (isDisplaying && sequence.length > 0) {
      setCurrentIndex(-1);
      const cleanup = displaySequence();
      
      return cleanup; // This will clear timeouts if effect reruns
    }
  }, [isDisplaying, sequence, level, displaySequence]); // Include level and displaySequence
  
  return (
    <View style={styles.container}>
      {isDisplaying ? (
        <Animated.View style={[styles.numberDisplay, { opacity: fadeAnim }]}>
          <Text style={styles.number}>
            {currentIndex >= 0 && currentIndex < sequence.length 
              ? String(sequence[currentIndex]) 
              : ""}
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