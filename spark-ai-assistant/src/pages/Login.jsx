// Simple Login page
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress,
  Container
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  AutoAwesome as SparkIcon
} from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import useGoogleAuth from '../hooks/useGoogleAuth';
import { validateEmail, validateRequired } from '../utils/validators';

const Login = () => {
  const { login, loading } = useAuth();
  const { handleGoogleSignIn, isGoogleConfigured } = useGoogleAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    const emailError = validateEmail(formData.email);
    const passwordError = validateRequired(formData.password, 'Password');
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try { 
      await login(formData.email, formData.password); 
    } catch (error) {
      // Error handling is done in the auth hook
    }
  };

  const handleGoogleLogin = async () => { 
    await handleGoogleSignIn(); 
  };

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
      <Container maxWidth="sm">
        <Card
          sx={{
            p: 4,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
        >
          {/* Logo and Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <SparkIcon sx={{ fontSize: 40, color: '#06b6d4', mr: 1 }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Spark
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
              Welcome back
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Sign in to your account
            </Typography>
          </Box>

          {/* Google Sign In */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            disabled={loading || !isGoogleConfigured()}
            sx={{
              mb: 3,
              py: 1.5,
              borderColor: isGoogleConfigured() ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              color: isGoogleConfigured() ? 'white' : 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                borderColor: isGoogleConfigured() ? '#06b6d4' : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: isGoogleConfigured() ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.05)'
              },
              '&:disabled': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            {isGoogleConfigured() ? 'Continue with Google' : 'Google OAuth Not Configured'}
          </Button>
          
          {!isGoogleConfigured() && (
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                color: 'rgba(255, 255, 255, 0.5)', 
                mb: 2,
                mt: -2 
              }}
            >
              Set up Google OAuth in your environment to enable Google sign-in
            </Typography>
          )}
          
          <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', px: 2 }}>
              or
            </Typography>
          </Divider>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(6, 182, 212, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#06b6d4' }
                },
                '& .MuiInputLabel-root': { 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  '&.Mui-focused': { color: '#06b6d4' } 
                },
                '& .MuiInputBase-input': { color: 'white' }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(6, 182, 212, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#06b6d4' }
                },
                '& .MuiInputLabel-root': { 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  '&.Mui-focused': { color: '#06b6d4' } 
                },
                '& .MuiInputBase-input': { color: 'white' }
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{
                  color: '#06b6d4',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 3,
                background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0891b2 0%, #7c3aed 100%)'
                },
                '&:disabled': { 
                  background: 'rgba(6, 182, 212, 0.3)' 
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>

          {/* Sign up link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Don't have an account?{' '}
              <Link
                component={RouterLink}
                to="/signup"
                sx={{ 
                  color: '#06b6d4', 
                  fontWeight: 600, 
                  textDecoration: 'none', 
                  '&:hover': { textDecoration: 'underline' } 
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
