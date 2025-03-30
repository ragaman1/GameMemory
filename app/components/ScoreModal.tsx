import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { UserScore } from '../../src/types/user';

type ScoreModalProps = {
  visible: boolean;
  onClose: () => void;
  score: number;
  level: number;
  isHighScore: boolean;
  previousBest: UserScore | null;
};

const { width } = Dimensions.get('window');

export default function ScoreModal({
  visible,
  onClose,
  score,
  level,
  isHighScore,
  previousBest
}: ScoreModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.titleText}>
            {isHighScore ? '🎉 New High Score! 🎉' : 'Game Over'}
          </Text>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>

          <View style={styles.levelContainer}>
            <Text style={styles.levelLabel}>Level Reached</Text>
            <Text style={styles.levelValue}>{level}</Text>
          </View>

          {isHighScore && previousBest && (
            <View style={styles.improvementContainer}>
              <Text style={styles.improvementText}>
                You beat your previous best: {previousBest.score}
              </Text>
              <Text style={styles.improvementValue}>
                +{score - previousBest.score} points!
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.playAgainButton} onPress={onClose}>
            <Text style={styles.playAgainText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: width * 0.8,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4E7AF0',
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  levelLabel: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  levelValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  improvementContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(78, 122, 240, 0.1)',
    borderRadius: 10,
  },
  improvementText: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 5,
  },
  improvementValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  playAgainButton: {
    backgroundColor: '#4E7AF0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});