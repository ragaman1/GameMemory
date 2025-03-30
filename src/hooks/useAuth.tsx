import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserSession } from '../types/user';
import { generateUUID } from '../utils/authStorage';

const AUTH_KEY = '@game_memory_auth';

// Create context
const AuthContext = createContext<{
  session: UserSession;
  login: (username: string) => Promise<void>;
  register: (username: string) => Promise<void>;
  logout: () => Promise<void>;
}>({
  session: { user: null, isAuthenticated: false },
  login: async () => {},
  register: async () => {},
  logout: async () => {}
});

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession>({
    user: null,
    isAuthenticated: false
  });
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedSession = await AsyncStorage.getItem(AUTH_KEY);
        if (savedSession) {
          setSession(JSON.parse(savedSession));
        }
      } catch (error) {
        console.error('Failed to load auth session', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSession();
  }, []);

  // Register new user
  const register = async (username: string) => {
    const newUser: User = {
      id: generateUUID(),
      username,
      createdAt: Date.now()
    };
    
    const newSession: UserSession = {
      user: newUser,
      isAuthenticated: true
    };
    
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(newSession));
    setSession(newSession);
  };

  // Login existing user
  const login = async (username: string) => {
    // In a real app, you'd validate credentials
    // For this simple implementation, we just create a session
    
    const existingUsers = await AsyncStorage.getItem('users') || '[]';
    const users: User[] = JSON.parse(existingUsers);
    
    let user = users.find(u => u.username === username);
    
    if (!user) {
      // Auto-register if user doesn't exist
      return register(username);
    }
    
    const newSession: UserSession = {
      user,
      isAuthenticated: true
    };
    
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(newSession));
    setSession(newSession);
  };

  // Logout
  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setSession({ user: null, isAuthenticated: false });
  };

  if (loading) {
    return null; // Or a loading indicator
  }

  return (
    <AuthContext.Provider value={{ session, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using auth
export function useAuth() {
  return useContext(AuthContext);
}