import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';

const USERS_KEY = '@game_memory_users';

// Generate simple UUID
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Save a user to storage
export async function saveUser(user: User): Promise<void> {
  try {
    const existingUsers = await getUsers();
    
    // Check if user already exists
    const userIndex = existingUsers.findIndex(u => u.id === user.id);
    
    if (userIndex >= 0) {
      // Update existing user
      existingUsers[userIndex] = user;
    } else {
      // Add new user
      existingUsers.push(user);
    }
    
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));
  } catch (error) {
    console.error('Failed to save user', error);
    throw error;
  }
}

// Get all users
export async function getUsers(): Promise<User[]> {
  try {
    const users = await AsyncStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Failed to get users', error);
    return [];
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const users = await getUsers();
    return users.find(user => user.id === id) || null;
  } catch (error) {
    console.error('Failed to get user by ID', error);
    return null;
  }
}