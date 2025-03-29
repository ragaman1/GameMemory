import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import ProgressBar from './ProgressBar';
import type { DisplayMode } from '../types/game';

interface SequenceDisplayProps {
  sequence: number[];
  isDisplaying: boolean;
  level: number;
  displayMode: DisplayMode;
}

export default function SequenceDisplay({ 
  sequence, 
  isDisplaying, 
  level, 
  displayMode 
}: SequenceDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const progressAnim = useState(new Animated.Value(0))[0];
  
  // Reset animations when display starts
  useEffect(() => {
    if (isDisplaying) {
      progressAnim.setValue(0);
    }
  }, [isDisplaying, progressAnim]);
  
  // Sequential display logic
  const displaySequentially = useCallback(() => {
    const timeouts: NodeJS.Timeout[] = [];
    const totalItems = sequence.length;
    
    sequence.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setCurrentIndex(index);
        
        // Update progress (increment by 1/totalItems for each number)
        Animated.timing(progressAnim, {
          toValue: (index + 1) / totalItems,
          duration: 300,
          useNativeDriver: false,
        }).start();
        
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            delay: 600 - Math.min(level * 50, 400),
            useNativeDriver: true,
          }),
        ]).start();
      }, index * 1000);
      
      timeouts.push(timeout);
    });
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [sequence, level, fadeAnim, progressAnim]);
  
  // Simultaneous display logic
  const displaySimultaneously = useCallback(() => {
    // Show all numbers at once
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Calculate display time based on level and sequence length
    const displayTime = Math.max(2000, (level * 300) + (sequence.length * 200));
    
    // Animate progress from 0 to 1 over the full display time
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: displayTime,
      useNativeDriver: false,
    }).start();
    
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, displayTime);
    
    return () => clearTimeout(timeout);
  }, [sequence, level, fadeAnim, progressAnim]);
  
  useEffect(() => {
    if (isDisplaying && sequence.length > 0) {
      setCurrentIndex(-1);
      
      let cleanup;
      if (displayMode === 'sequential') {
        cleanup = displaySequentially();
      } else {
        cleanup = displaySimultaneously();
      }
      
      return cleanup;
    }
  }, [isDisplaying, sequence, level, displayMode, displaySequentially, displaySimultaneously]);
  
  return (
    <View style={styles.container}>
      {/* Progress bar */}
      {isDisplaying && (
        <ProgressBar 
          progress={progressAnim} 
          color="#2ecc71"
          height={8}
        />
      )}
      
      {isDisplaying ? (
        displayMode === 'sequential' ? (
          // Sequential display - show one number at a time
          <Animated.View style={[styles.numberDisplay, { opacity: fadeAnim }]}>
            <Text style={styles.number}>
              {currentIndex >= 0 && currentIndex < sequence.length 
                ? String(sequence[currentIndex]) 
                : ""}
            </Text>
          </Animated.View>
        ) : (
          // Simultaneous display - show all numbers
          <Animated.View style={[styles.simultaneousDisplay, { opacity: fadeAnim }]}>
            <Text style={styles.simultaneousNumbers}>
              {sequence.join(' ')}
            </Text>
          </Animated.View>
        )
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Sequence will appear here</Text>
        </View>
      )}
    </View>
  );
}

// Styles 

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
  simultaneousDisplay: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  simultaneousNumbers: {
    fontSize: 36,
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