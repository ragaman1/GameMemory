import { Stack } from 'expo-router';
import React from 'react';

// Define the Root Layout using Expo Router's Stack navigator
export default function RootLayout() {
  return (
    <Stack>
      {/* Configure the screen for the 'index' route (index.tsx) */}
      {/* The header title will be shown here */}
      <Stack.Screen name="index" options={{ title: 'Number Memory Game' }} />
      {/* If you add more screens later (e.g., app/settings.tsx), */}
      {/* you would add more Stack.Screen components here */}
    </Stack>
  );
}

// Optional: Add basic error boundary or global context providers here if needed
