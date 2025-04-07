// app/components/SequenceReview.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SequenceReviewProps }  from '../../src/types/game';
import { useTheme } from '../../src/contexts/ThemeContext';

const SequenceReview = ({ correct, player, lives, level }: SequenceReviewProps) => {
  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    reviewContainer: {
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    reviewTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: colors.text,
    },
    sequencesContainer: {
      width: '100%',
      marginBottom: 16,
    },
    sequenceLabel: {
      marginVertical: 8,
      fontWeight: '600',
      color: colors.text,
    },
    numbersRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    number: {
      fontSize: 24,
      width: 40,
      height: 40,
      textAlign: 'center',
      margin: 5,
      borderRadius: 20,
      backgroundColor: colors.background,
      color: colors.text,
      overflow: 'hidden',
      lineHeight: 40,
    },
    highlightedNumber: {
      backgroundColor: colors.background,
      fontWeight: 'bold',
    },
    incorrectNumber: {
      backgroundColor: colors.text,
      color: 'white',
    },
    livesText: {
      marginTop: 16,
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    hintText: {
      marginTop: 8,
      fontStyle: 'italic',
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.reviewContainer}>
      <Text style={styles.reviewTitle}>Review Your Attempt</Text>
      
      <View style={styles.sequencesContainer}>
        <Text style={styles.sequenceLabel}>Correct sequence:</Text>
        <View style={styles.numbersRow}>
          {correct.map((num, index) => (
            <Text 
              key={index}
              style={[
                styles.number,
                player[index] !== num && styles.highlightedNumber
              ]}
            >
              {num}
            </Text>
          ))}
        </View>
        
        <Text style={styles.sequenceLabel}>Your input:</Text>
        <View style={styles.numbersRow}>
          {player.map((num, index) => (
            <Text 
              key={index} 
              style={[
                styles.number,
                num !== correct[index] && styles.incorrectNumber
              ]}
            >
              {num}
            </Text>
          ))}
        </View>
      </View>
      
      <Text style={styles.livesText}>Lives remaining: {lives - 1}</Text>
      <Text style={styles.hintText}>Continuing to level {Math.max(1, level - 1)}...</Text>
    </View>
  );
};

export default SequenceReview;