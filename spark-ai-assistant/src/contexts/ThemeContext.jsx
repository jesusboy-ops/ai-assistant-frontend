// Theme Context for managing light/dark mode preferences
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme, getStoredTheme, setStoredTheme } from '../theme';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }) => {
  // Force dark mode always
  const [mode, setMode] = useState('dark');

  // Remove system theme change listener - we don't need it anymore
  
  const toggleTheme = () => {
    // Do nothing - dark mode only
    console.log('Theme toggle disabled - dark mode only');
  };

  const setThemeMode = (newMode) => {
    // Always set to dark mode
    setMode('dark');
    setStoredTheme('dark');
  };

  // Always return dark mode
  const getActualMode = () => {
    return 'dark';
  };

  const actualMode = 'dark';
  const theme = getTheme('dark');

  const contextValue = {
    mode: 'dark',
    actualMode: 'dark',
    toggleTheme,
    setThemeMode,
    isDark: true,
    isLight: false
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;