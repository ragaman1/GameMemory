import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

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
    <View style={[styles.container, { height }]}>
      <Animated.View 
        style={[
          styles.bar, 
          { backgroundColor: color, width }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  bar: {
    height: '100%',
  },
});