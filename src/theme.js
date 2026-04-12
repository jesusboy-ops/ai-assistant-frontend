// Theme configuration - Veon-style dark green theme
import { createTheme } from '@mui/material/styles';

export const gradientColors = {
  primary: 'linear-gradient(135deg, #a8e63d 0%, #7bc62d 100%)',
  secondary: 'linear-gradient(135deg, #2d4a1e 0%, #1a2e0f 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
};

const commonTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.2 },
    h2: { fontWeight: 600, fontSize: '2rem', lineHeight: 1.3 },
    h3: { fontWeight: 600, fontSize: '1.75rem', lineHeight: 1.3 },
    h4: { fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.4 },
    h5: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.4 },
    h6: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' }
  },
  shape: { borderRadius: 12 },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 }
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
          '&:hover': { transform: 'translateY(-1px)' }
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': { borderWidth: '1px', transform: 'translateY(-1px)' }
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
          '& .MuiOutlinedInput-root': { borderRadius: 8 }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500 }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' }
      }
    }
  }
};

export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#a8e63d',
      light: '#c5f135',
      dark: '#7bc62d',
      contrastText: '#0a0f05'
    },
    secondary: {
      main: '#2d5a1b',
      light: '#3d7a25',
      dark: '#1a3a10',
      contrastText: '#ffffff'
    },
    background: {
      default: '#0a0d07',
      paper: '#0f1409',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.65)',
      disabled: 'rgba(255, 255, 255, 0.4)'
    },
    success: { main: '#a8e63d', light: '#c5f135', dark: '#7bc62d' },
    error: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
    warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
    info: { main: '#a8e63d', light: '#c5f135', dark: '#7bc62d' },
    divider: 'rgba(168, 230, 61, 0.12)'
  },
  components: {
    ...commonTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(15, 20, 9, 0.85)',
          border: '1px solid rgba(168, 230, 61, 0.12)',
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          '&:hover': { transform: 'translateY(-2px)' }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 13, 7, 0.95)',
          backgroundImage: 'none',
          borderBottom: '1px solid rgba(168, 230, 61, 0.1)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0a0d07',
          borderRight: '1px solid rgba(168, 230, 61, 0.1)'
        }
      }
    }
  }
});

export const lightTheme = darkTheme;

export const getStoredTheme = () => 'dark';
export const setStoredTheme = () => {};
export const getTheme = () => darkTheme;
