// Error boundary component to catch React rendering errors
import React from 'react';
import { Alert, Box, Typography, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <Alert 
          severity="error" 
          sx={{ 
            margin: 2,
            '& .MuiAlert-message': { width: '100%' }
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              🚨 Component Error
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Something went wrong with this component. This is usually caused by trying to render an object as text.
            </Typography>
            
            {this.state.error && (
              <Typography variant="body2" sx={{ mb: 2, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                <strong>Error:</strong> {this.state.error.toString()}
              </Typography>
            )}
            
            <Button
              startIcon={<RefreshIcon />}
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.reload();
              }}
              variant="outlined"
              size="small"
            >
              Refresh Page
            </Button>
          </Box>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;