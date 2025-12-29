// Forgot Password page
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import authApi from '../api/authApi';
import { validateEmail } from '../utils/validators';
import toast from '../utils/toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authApi.forgotPassword(email);
      setSuccess(true);
      toast.success('Password reset link sent to your email');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send reset link';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Card 
        sx={{ 
          padding: { xs: 3, sm: 4 }, 
          background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          borderRadius: 3
          }}
      >
        <Box sx={{ marginBottom: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              marginBottom: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Forgot password?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Enter your email and we'll send you a reset link
          </Typography>
        </Box>

        {success ? (
          <Alert severity="success" sx={{ marginBottom: 3 }}>
            Check your email for the password reset link
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              error={Boolean(error)}
              helperText={error}
              sx={{ marginBottom: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                paddingY: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: 'rgba(102, 126, 234, 0.3)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <Box sx={{ marginTop: 3, textAlign: 'center' }}>
          <Link
            component={RouterLink}
            to="/login"
            sx={{
              color: '#06b6d4',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              textDecoration: 'none',
              '&:hover': { 
                textDecoration: 'underline',
                textShadow: '0 0 8px rgba(6, 182, 212, 0.6)'
              }
            }}
          >
            <ArrowBack fontSize="small" />
            Back to login
          </Link>
        </Box>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
