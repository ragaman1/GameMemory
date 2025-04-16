// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Theme type definitions
export type ThemeMode = 'light' | 'dark';

// Define color schemes for light and dark themes
export const LightTheme = {
  background: 'rgb(240, 244, 247)',
  card: 'rgba(255, 255, 255, 0.94)',
  correct: 'rgb(46, 204, 113)',
  text: 'rgb(51, 51, 51)',
  textSecondary: 'rgb(136, 136, 136)',
  border: 'rgb(208, 208, 208)',
  error: 'rgb(231, 76, 60)',
  warning: 'rgb(215, 199, 22)',

  inputDot: 'rgb(224, 224, 224)',
  inputDotBorder: 'rgb(160, 160, 160)',
  inputDotFilled: 'rgb(52, 152, 219)',
  inputDotFilledBorder: 'rgb(41, 128, 185)',
  startButton: 'rgb(46, 204, 113)',
  
  // Status colors
  idleBanner: 'rgb(149, 165, 166)',
  displayingBanner: 'rgb(52, 152, 219)',
  recallBanner: 'rgb(241, 196, 15)',
  successBanner: 'rgb(46, 204, 113)',
  failureBanner: 'rgb(231, 76, 60)',
};

export const DarkTheme = {
  background: 'rgb(26, 26, 26)',
  card: 'rgb(42, 42, 42)',
  correct: 'rgb(46, 204, 113)',
  text: 'rgb(240, 240, 240)',
  textSecondary: 'rgb(160, 160, 160)',
  border: 'rgb(58, 58, 58)',
  warning: 'rgb(215, 199, 22)',
  error: 'rgb(231, 76, 60)',
  
  inputDot: 'rgb(58, 58, 58)',
  inputDotBorder: 'rgb(90, 90, 90)',
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