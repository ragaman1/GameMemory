import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Stack } from 'expo-router';
// Import the theme context hook
import { useTheme } from '../src/contexts/ThemeContext';

export default function SettingsScreen() {
  // Get theme values and toggle function from context
  const { theme, toggleTheme, colors } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    // Apply background color from theme
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Configure the header for this specific screen */}
      {/* You might want to theme the header globally in _layout.tsx later */}
      <Stack.Screen options={{ title: 'Settings' }} />

      {/* Apply text color from theme */}
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      {/* Theme Toggle Setting */}
      <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
        {/* Apply text color from theme */}
        <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }} // Consider theming trackColor if desired
          thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}   // Consider theming thumbColor if desired
          ios_backgroundColor="#3e3e3e" // Standard iOS background
          onValueChange={toggleTheme} // Use the function from context
          value={isDarkMode}         // Set based on current theme mode
        />
      </View>

      {/* Add more settings items here */}
      {/* e.g., Sound Toggle, Difficulty, etc. */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 18,
  },
});
