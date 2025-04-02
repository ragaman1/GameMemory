import React, { useState, useEffect, useCallback} from 'react';
import { View, Text, Animated } from 'react-native';
import ProgressBar from './ProgressBar';
import type { DisplayMode } from '../../src/types/game';
import { styles } from '../../src/styles/gameStyles';

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
  
  const displaySimultaneously = useCallback(() => {
    fadeAnim.setValue(0);
    progressAnim.setValue(0);
    
    // Calculate display time
    const displayTime = Math.max(2000, (level * 300) + (sequence.length * 200));
    
    // 1. First fade in the numbers
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // 2. Start the progress separately after fade-in
    const progressStartTimeout = setTimeout(() => {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: displayTime,
        useNativeDriver: false,
      }).start();
    }, 300); // Start after fade-in completes
    
    // 3. Fade out exactly when progress should finish
    const fadeOutTimeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 300 + displayTime); // Start right after progress completes
    
    return () => {
      clearTimeout(progressStartTimeout);
      clearTimeout(fadeOutTimeout);
      fadeAnim.setValue(0);
      progressAnim.setValue(0);
    };
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
    <View style={styles.sequenceDisplayContainer}>
      {/* Progress bar */}
      {isDisplaying && (
        <View style={styles.sequenceProgressBarWrapper}>
          <ProgressBar
            progress={progressAnim}
            color="#2ecc71"
            height={8}
          />
        </View>
      )}
      
      {isDisplaying ? (
        displayMode === 'sequential' ? (
          // Sequential display - show one number at a time
          <Animated.View style={[styles.sequenceNumberDisplay, { opacity: fadeAnim }]}>
            <Text style={styles.sequenceNumberText}>
              {currentIndex >= 0 && currentIndex < sequence.length 
                ? String(sequence[currentIndex]) 
                : ""}
            </Text>
          </Animated.View>
        ) : (
          // Simultaneous display - show all numbers
          <Animated.View style={[styles.sequenceSimultaneousDisplay, { opacity: fadeAnim }]}>
            <Text style={styles.sequenceSimultaneousNumbers}>
              {sequence.join(' ')}
            </Text>
          </Animated.View>
        )
      ) : (
        <View style={styles.sequencePlaceholder}>
          <Text style={styles.placeholderText}>Sequence will appear here</Text>
        </View>
      )}
    </View>
  );
}