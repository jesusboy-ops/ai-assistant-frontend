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
  const [mode, setMode] = useState(getStoredTheme());

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (mode === 'auto') {
        // Force re-render when system preference changes
        setMode('auto');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const toggleTheme = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    setStoredTheme(newMode);
  };

  const setThemeMode = (newMode) => {
    setMode(newMode);
    setStoredTheme(newMode);
  };

  // Determine actual theme to use
  const getActualMode = () => {
    if (mode === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return mode;
  };

  const actualMode = getActualMode();
  const theme = getTheme(actualMode);

  const contextValue = {
    mode,
    actualMode,
    toggleTheme,
    setThemeMode,
    isDark: actualMode === 'dark',
    isLight: actualMode === 'light'
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