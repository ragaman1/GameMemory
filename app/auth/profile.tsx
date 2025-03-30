import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/hooks/useAuth';
import {
  getUserBestScore,
  getTopScores,
  getScores
} from '../../src/utils/scoreStorage';
import type { UserScore } from '../../src/types/user';

export default function ProfileScreen() {
  const { session, logout } = useAuth();
  const router = useRouter();
  const [userScores, setUserScores] = useState<UserScore[]>([]);
  const [topScores, setTopScores] = useState<UserScore[]>([]);
  const [bestScore, setBestScore] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session.isAuthenticated || !session.user) {
      // Redirect to login if not authenticated
      router.replace('/auth/login');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch all scores
        const allScores = await getScores();
        
        // Get user's scores
        const userScoresData = allScores.filter(
          score => score.userId === session.user?.id
        );
        setUserScores(userScoresData);
        
        // Get user's best score
        const best = session.user ? await getUserBestScore(session.user.id) : null;
        setBestScore(best);
        
        // Get top scores for leaderboard
        const top = await getTopScores(10);
        setTopScores(top);
      } catch (error) {
        console.error('Error loading profile data', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E7AF0" />
        <Text style={styles.loadingText}>Loading profile data...</Text>
      </View>
    );
  }

  // Function to format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Player Profile</Text>
          <View style={styles.userInfoContainer}>
            <Text style={styles.username}>{session.user?.username}</Text>
            <Text style={styles.joinDate}>
              Joined: {formatDate(session.user?.createdAt || Date.now())}
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {bestScore ? bestScore.score : '0'}
              </Text>
              <Text style={styles.statLabel}>Best Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {bestScore ? bestScore.level : '0'}
              </Text>
              <Text style={styles.statLabel}>Highest Level</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userScores.length}</Text>
              <Text style={styles.statLabel}>Games Played</Text>
            </View>
          </View>
        </View>

        {/* Recent Games Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Recent Games</Text>
          {userScores.length > 0 ? (
            <FlatList
              data={userScores.slice(0, 5)}
              keyExtractor={(item, index) => `user-score-${index}`}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreDate}>{formatDate(item.date)}</Text>
                  <Text style={styles.scoreText}>Score: {item.score}</Text>
                  <Text style={styles.levelText}>Level: {item.level}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.emptyMessage}>
              You haven't played any games yet.
            </Text>
          )}
        </View>

        {/* Leaderboard Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          {topScores.length > 0 ? (
            <FlatList
              data={topScores}
              keyExtractor={(item, index) => `top-score-${index}`}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View style={[
                  styles.leaderboardItem,
                  item.userId === session.user?.id ? styles.highlightedItem : null
                ]}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                  <Text style={styles.leaderUsername}>{item.username}</Text>
                  <Text style={styles.leaderScore}>{item.score}</Text>
                  <Text style={styles.leaderLevel}>Lv.{item.level}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.emptyMessage}>No scores recorded yet.</Text>
          )}
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back to Game</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
    fontSize: 16,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#aaaaaa',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4E7AF0',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#aaaaaa',
  },
  scoreItem: {
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreDate: {
    color: '#aaaaaa',
    fontSize: 12,
  },
  scoreText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  levelText: {
    color: '#4E7AF0',
  },
  emptyMessage: {
    color: '#aaaaaa',
    textAlign: 'center',
    marginVertical: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  highlightedItem: {
    backgroundColor: '#2A3455',
  },
  rankText: {
    width: 40,
    color: '#4E7AF0',
    fontWeight: 'bold',
    fontSize: 16,
  },
  leaderUsername: {
    flex: 1,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  leaderScore: {
    width: 60,
    color: '#ffffff',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  leaderLevel: {
    width: 50,
    color: '#aaaaaa',
    textAlign: 'right',
  },
  actionsSection: {
    padding: 16,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#E53935',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#4E7AF0',
    fontSize: 14,
  },
});