import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Container
} from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Visibility,
  VisibilityOff,
  AutoAwesome as SparkIcon
} from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import { validateEmail, validatePassword, validateConfirmPassword, validateName } from '../utils/validators';

const SignupPage = () => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(formData.email, formData.password, formData.name);
    } catch (error) {
      // Error handling is done in the auth hook
    }
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
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
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
                  color: '#ffffff'
                }}
              >
                Spark
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
              Create your account
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Get started with AI-powered productivity
            </Typography>
          </Box>

          {/* Signup Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
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
              autoComplete="new-password"
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

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              sx={{
                mb: 3,
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
                },
                '&:disabled': { 
                  background: 'rgba(6, 182, 212, 0.3)' 
                },
                position: 'relative'
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </Box>

          {/* Sign in link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{ 
                  color: '#06b6d4', 
                  fontWeight: 600, 
                  textDecoration: 'none', 
                  '&:hover': { textDecoration: 'underline' } 
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default SignupPage;