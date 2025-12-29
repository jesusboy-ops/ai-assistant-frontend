// Google OAuth Callback Handler
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import useAuth from '../hooks/useAuth';
import toast from '../utils/toast';

const GoogleOAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { googleLogin } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

        if (error) {
          console.error('OAuth error:', error);
          setStatus('error');
          toast.error(`Google OAuth error: ${error}`);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          setStatus('error');
          toast.error('No authorization code received from Google');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        console.log('Processing Google OAuth callback with code:', code.substring(0, 10) + '...');

        // Send the authorization code to your backend
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/oauth/google/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            code,
            state: state || undefined
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Backend error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.token || !data.user) {
          throw new Error('Invalid response from backend - missing token or user data');
        }

        // Store token and update auth state
        localStorage.setItem('token', data.token);
        
        // Use the existing googleLogin function to update the auth state
        // Note: This might need adjustment based on your backend response format
        await googleLogin(data.token, data.user);

        setStatus('success');
        toast.success('Successfully signed in with Google!');
        
        // Redirect to dashboard after a brief delay
        setTimeout(() => navigate('/dashboard'), 1500);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        toast.error(error.message || 'Failed to complete Google sign-in');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, googleLogin]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          p: 4,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: 400
        }}
      >
        {status === 'processing' && (
          <>
            <CircularProgress sx={{ color: '#06b6d4', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
              Completing Google Sign-In
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Please wait while we process your authentication...
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <Box sx={{ fontSize: 48, mb: 2 }}>✅</Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
              Sign-In Successful!
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Redirecting to your dashboard...
            </Typography>
          </>
        )}

        {status === 'error' && (
          <>
            <Box sx={{ fontSize: 48, mb: 2 }}>❌</Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
              Sign-In Failed
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
              There was an error completing your Google sign-in.
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Redirecting to login page...
            </Alert>
          </>
        )}
      </Box>
    </Box>
  );
};

export default GoogleOAuthCallback;