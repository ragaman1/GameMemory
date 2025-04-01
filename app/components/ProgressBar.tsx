import React from 'react';
import { View, Animated } from 'react-native';
import { styles } from '../../src/styles/gameStyles';

interface ProgressBarProps {
  progress: Animated.Value; // Value between 0 and 1
  color?: string;
  height?: number;
}

export default function ProgressBar({ 
  progress, 
  color = '#3498db', 
  height = 6 
}: ProgressBarProps) {
  // Convert 0-1 progress value to width percentage
  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp'
  });

  return (
    <View style={[styles.progressBarContainer, { height }]}>
      <Animated.View 
        style={[
          styles.progressBar,
          { backgroundColor: color, width }
        ]} 
      />
    </View>
  );
}
