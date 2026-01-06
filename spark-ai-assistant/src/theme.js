// Theme configuration for Spark AI Assistant
// Provides comprehensive light/dark mode theming with persistent preferences
// with Indigo-to-Violet gradient accents

import { createTheme } from '@mui/material/styles';

// Gradient colors for accents
export const gradientColors = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Indigo to Violet
  secondary: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', // Cyan to Blue
  success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
};

// Common theme configuration
const commonTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem'
    }
  },
  shape: {
    borderRadius: 12
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out'
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)'
          }
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
};

// Dark theme for main application/dashboard
export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#667eea', // Indigo
      light: '#8b9aee',
      dark: '#4c5fd5',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#06b6d4', // Cyan
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#ffffff'
    },
    background: {
      default: '#0f0f23', // Very dark background
      paper: '#1a1a2e', // Slightly lighter for cards
    },
    surface: {
      main: '#2d3748', // For elevated surfaces
      light: '#4a5568',
      dark: '#1a202c'
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)'
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669'
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626'
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706'
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2'
    },
    divider: 'rgba(255, 255, 255, 0.12)'
  },
  components: {
    ...commonTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(26, 26, 46, 0.8)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a2e',
          backgroundImage: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)',
          borderBottom: '1px solid rgba(102, 126, 234, 0.2)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a2e',
          borderRight: '1px solid rgba(102, 126, 234, 0.2)'
        }
      }
    }
  }
});

// Light theme for authentication screens and light mode
export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#8b9aee',
      dark: '#4c5fd5',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#ffffff'
    },
    background: {
      default: '#ffffff',
      paper: '#f8fafc'
    },
    surface: {
      main: '#ffffff',
      light: '#f8fafc',
      dark: '#e2e8f0'
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
      disabled: '#a0aec0'
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669'
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626'
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706'
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2'
    },
    divider: 'rgba(0, 0, 0, 0.12)'
  },
  components: {
    ...commonTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1a202c',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)'
        }
      }
    }
  }
});

// Theme preference utilities
export const getStoredTheme = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('spark-theme-preference');
    if (stored) return stored;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light'; // Default to light theme
};

export const setStoredTheme = (theme) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('spark-theme-preference', theme);
  }
};

export const getTheme = (mode) => {
  return mode === 'light' ? lightTheme : darkTheme;
};
