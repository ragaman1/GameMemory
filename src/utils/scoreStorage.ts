// src/utils/scoreStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserScore } from '../types/user';

const SCORES_KEY = '@game_memory_scores';

// Save a new score
export async function saveScore(userId: string, username: string, score: number, level: number): Promise<void> {
  try {
    const newScore: UserScore = {
      userId,
      username,
      score,
      level,
      date: Date.now()
    };
    
    // Get existing scores
    const existingScores = await getScores();
    existingScores.push(newScore);
    
    // Sort by score descending
    existingScores.sort((a, b) => b.score - a.score);
    
    // Save back to storage
    await AsyncStorage.setItem(SCORES_KEY, JSON.stringify(existingScores));
  } catch (error) {
    console.error('Failed to save score', error);
    throw error;
  }
}

// Get all scores
export async function getScores(): Promise<UserScore[]> {
  try {
    const scores = await AsyncStorage.getItem(SCORES_KEY);
    return scores ? JSON.parse(scores) : [];
  } catch (error) {
    console.error('Failed to get scores', error);
    return [];
  }
}

// Get user's best score
export async function getUserBestScore(userId: string): Promise<UserScore | null> {
  try {
    const scores = await getScores();
    const userScores = scores.filter(score => score.userId === userId);
    
    if (userScores.length === 0) {
      return null;
    }
    
    // Sort by score and return the best
    userScores.sort((a, b) => b.score - a.score);
    return userScores[0];
  } catch (error) {
    console.error('Failed to get user best score', error);
    return null;
  }
}

// Get top scores (leaderboard)
export async function getTopScores(limit = 10): Promise<UserScore[]> {
  try {
    const scores = await getScores();
    return scores.slice(0, limit);
  } catch (error) {
    console.error('Failed to get top scores', error);
    return [];
  }
}