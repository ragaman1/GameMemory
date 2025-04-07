// app/_layout.tsx
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import { GameProvider, useGame } from '../src/contexts/GameContext';
import SettingsModal from './components/SettingsModal';

// Header component with game stats and settings button
function HeaderComponent() {
  const { colors } = useTheme();
  const { level, score } = useGame();
  const [modalVisible, setModalVisible] = useState(false);
  
  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.headerText, { color: colors.text }]}>
        Level: {level}
      </Text>
      
      <Text style={[styles.headerText, { color: colors.text }]}>
        Score: {score}
      </Text>
      
      <TouchableOpacity 
        onPress={() => setModalVisible(true)} 
        style={styles.settingsButton}
      >
        <Ionicons 
          name="settings-outline" 
          size={24} 
          color={colors.text} 
        />
      </TouchableOpacity>
      
      <SettingsModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </View>
  );
}

// App stack with themed header
function AppStack() {
  const { colors } = useTheme();
  
  return (
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
          title: 'Elina Game',
          headerRight: () => <HeaderComponent /> 
        }} 
      />
    </Stack>
  );
}

// Root layout that provides both theme and game context
export default function RootLayout() {
  return (
    <ThemeProvider>
      <GameProvider>
        <AppStack />
      </GameProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginRight: 15,
    fontSize: 14,
    fontWeight: '500',
  },
  settingsButton: {
    padding: 5,
  }
});