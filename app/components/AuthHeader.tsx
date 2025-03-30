import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import type { UserScore } from '../../src/types/user';

type AuthHeaderProps = {
  bestScore: UserScore | null;
  compact?: boolean;
};

export default function AuthHeader({ bestScore, compact = false }: AuthHeaderProps) {
  const router = useRouter();
  const { session } = useAuth();

  const navigateToAuth = () => {
    router.push('/auth/login');
  };

  const navigateToProfile = () => {
    router.push('/auth/profile');
  };

  if (compact) {
    // Compact version for smaller screens or headers
    return (
      <View style={styles.compactContainer}>
        {session.isAuthenticated && session.user ? (
          <TouchableOpacity onPress={navigateToProfile}>
            <Text style={styles.compactText}>
              {session.user.username} {bestScore ? `• ${bestScore.score}pts` : ''}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={navigateToAuth}>
            <Text style={styles.compactLoginText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Full version
  return (
    <View style={styles.container}>
      {session.isAuthenticated && session.user ? (
        <View style={styles.userInfo}>
          <Text style={styles.username}>
            {session.user.username}
          </Text>
          {bestScore && (
            <Text style={styles.bestScore}>
              Best: {bestScore.score} (Lv.{bestScore.level})
            </Text>
          )}
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={navigateToProfile}
          >
            <Text style={styles.profileButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={navigateToAuth}
        >
          <Text style={styles.loginText}>Login / Register</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#121212',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
  },
  bestScore: {
    color: '#4E7AF0',
    marginRight: 10,
  },
  profileButton: {
    backgroundColor: '#333',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: '#4E7AF0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  loginText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Compact styles
  compactContainer: {
    padding: 5,
  },
  compactText: {
    color: '#fff',
    fontSize: 12,
  },
  compactLoginText: {
    color: '#4E7AF0',
    fontSize: 12,
    fontWeight: 'bold',
  }
});