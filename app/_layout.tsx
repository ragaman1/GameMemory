import { Stack } from 'expo-router';
import React from 'react';
import { ThemeProvider } from '../src/contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
      {/* Configure the screen for the 'index' route (index.tsx) */}
      {/* The header title will be shown here */}
      <Stack.Screen name="index" options={{ title: 'Number Memory Game' }} />
      {/* If you add more screens later (e.g., app/settings.tsx), */}
      {/* you would add more Stack.Screen components here */}
      </Stack>
    </ThemeProvider>
  );
}

// Optional: Add basic error boundary or global context providers here if needed
