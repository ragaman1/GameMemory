import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import type { UserScore } from '../../src/types/user';

type ScoreBoardProps = {
  scores: UserScore[];
  highlightUserId?: string | null;
  title?: string;
  maxItems?: number;
};

export default function ScoreBoard({
  scores,
  highlightUserId = null,
  title = 'Leaderboard',
  maxItems = 10
}: ScoreBoardProps) {
  // Format date function
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      {scores.length > 0 ? (
        <FlatList
          data={scores.slice(0, maxItems)}
          keyExtractor={(item, index) => `score-${index}`}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View 
              style={[
                styles.scoreItem,
                highlightUserId && item.userId === highlightUserId 
                  ? styles.highlightedItem 
                  : null
              ]}
            >
              <Text style={styles.rankText}>#{index + 1}</Text>
              <Text style={styles.username}>{item.username}</Text>
              <View style={styles.scoreDetails}>
                <Text style={styles.scoreText}>{item.score}</Text>
                <Text style={styles.levelText}>Lv.{item.level}</Text>
                <Text style={styles.dateText}>{formatDate(item.date)}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>No scores recorded yet.</Text>
          }
        />
      ) : (
        <Text style={styles.emptyMessage}>No scores recorded yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  highlightedItem: {
    backgroundColor: '#2A3455',
  },
  rankText: {
    width: 30,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4E7AF0',
  },
  username: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scoreDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 10,
  },
  levelText: {
    color: '#4E7AF0',
    marginRight: 10,
  },
  dateText: {
    color: '#888888',
    fontSize: 12,
  },
  emptyMessage: {
    color: '#888888',
    textAlign: 'center',
    padding: 20,
  },
});