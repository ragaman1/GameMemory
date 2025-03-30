import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/hooks/useAuth';
import {
  DarkTheme,
  ThemeProvider,
  DefaultTheme
} from '@react-navigation/native';
import { useColorScheme } from 'react-native';

export default function AppLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              title: 'Memory Game'
            }}
          />
          <Stack.Screen
            name="auth/login"
            options={{
              presentation: 'modal',
              title: 'Login / Register',
              headerStyle: {
                backgroundColor: '#121212',
              },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="auth/profile"
            options={{
              title: 'Your Profile',
              headerStyle: {
                backgroundColor: '#121212',
              },
              headerTintColor: '#fff',
            }}
          />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
