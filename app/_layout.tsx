// app/_layout.tsx
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import SettingsModal from './components/SettingsModal';

// We'll use this custom hook to manage the settings modal visibility
function useSettingsModal() {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  return { visible, open, close };
}

// The main layout component
function AppStack() {
  const { colors } = useTheme();
  const settings = useSettingsModal();
  
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            color: colors.text,
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Number Memory Game',
            headerRight: () => (
              <TouchableOpacity 
                onPress={settings.open} 
                style={{ marginRight: 15 }}
              >
                <Ionicons 
                  name="settings-outline" 
                  size={24} 
                  color={colors.text}
                />
              </TouchableOpacity>
            ) 
          }} 
        />
      </Stack>
      
      <SettingsModal 
        visible={settings.visible} 
        onClose={settings.close} 
      />
    </>
  );
}

// Root layout that provides the theme context
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppStack />
    </ThemeProvider>
  );
}