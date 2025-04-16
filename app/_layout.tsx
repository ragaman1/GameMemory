import { Stack, useRouter } from 'expo-router';
import React from 'react';
// Import useTheme along with ThemeProvider
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import { Pressable, Text } from 'react-native';

// Create a new component that consumes the theme context
function ThemedStack() {
  const router = useRouter();
  const { colors } = useTheme(); // Use the theme context here

  const navigateToSettings = () => {
    router.push('/settings');
  };

  return (
    <Stack
      screenOptions={{
        title: 'Number Memory Game',
        // Apply theme colors to the header
        headerStyle: { backgroundColor: colors.card }, // Use card or background color
        headerTintColor: colors.text, // Use text color for title and icons
        headerTitleStyle: { fontWeight: 'bold' }, // Keep or adjust as needed
        headerRight: () => (
          <Pressable onPress={navigateToSettings} style={{ paddingRight: 15 }}>
            {/* Apply theme color to the settings icon */}
            <Text style={{ color: colors.text, fontSize: 24 }}>⚙️</Text>
          </Pressable>
        ),
      }}
    >
      {/* Define screens */}
      <Stack.Screen name="index" />
      {/* Explicitly define settings screen to potentially override options if needed */}
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}

// RootLayout now just sets up the provider and renders ThemedStack
export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedStack />
    </ThemeProvider>
  );
}
