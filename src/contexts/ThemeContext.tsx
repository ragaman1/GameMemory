// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Theme type definitions
export type ThemeMode = 'light' | 'dark';

// Define color schemes for light and dark themes
export const LightTheme = {
  background: '#f0f4f7',
  card: 'white',
  text: '#333',
  textSecondary: '#888',
  border: '#d0d0d0',
  inputDot: '#e0e0e0',
  inputDotBorder: '#a0a0a0',
  inputDotFilled: '#3498db',
  inputDotFilledBorder: '#2980b9',
  startButton: '#2ecc71',
  
  // Status colors
  idleBanner: '#95a5a6',
  displayingBanner: '#3498db',
  recallBanner: '#f1c40f',
  successBanner: '#2ecc71',
  failureBanner: '#e74c3c',
};

export const DarkTheme = {
  background: '#1a1a1a',
  card: '#2a2a2a',
  text: '#f0f0f0',
  textSecondary: '#a0a0a0',
  border: '#3a3a3a',
  inputDot: '#3a3a3a',
  inputDotBorder: '#5a5a5a',
  inputDotFilled: '#3498db',
  inputDotFilledBorder: '#2980b9',
  startButton: '#2ecc71',
  
  // Status colors (keeping consistent)
  idleBanner: '#95a5a6',
  displayingBanner: '#3498db',
  recallBanner: '#f1c40f', 
  successBanner: '#2ecc71',
  failureBanner: '#e74c3c',
};

export type ThemeContextType = {
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: typeof LightTheme | typeof DarkTheme;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: LightTheme,
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeMode>(colorScheme === 'dark' ? 'dark' : 'light');
  
  useEffect(() => {
    if (colorScheme) {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    }
  }, [colorScheme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const colors = theme === 'light' ? LightTheme : DarkTheme;
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);