// SignupPage - Two-sided layout matching Login style
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box, TextField, Button, Typography, Link,
  InputAdornment, IconButton, Alert, Stack
} from '@mui/material';
import {
  Visibility, VisibilityOff, AutoAwesome as SparkIcon,
  Chat as ChatIcon, Assignment as TaskIcon, Translate as TranslateIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import { validateEmail, validatePassword, validateConfirmPassword, validateName } from '../utils/validators';

const ACCENT = '#a8e63d';
const BG = '#080b05';

const Spark4 = ({ size = 20, opacity = 0.55, sx = {} }) => (
  <Box sx={{ display: 'inline-flex', opacity, ...sx }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 1L13.2 10.8L23 12L13.2 13.2L12 23L10.8 13.2L1 12L10.8 10.8Z" fill={ACCENT}/>
    </svg>
  </Box>
);

export default function SignupPage() {
  const { register, loading } = useAuth();
  const { error } = useSelector((s) => s.auth);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    const nameErr = validateName(formData.name);
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    const confirmErr = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (confirmErr) newErrors.confirmPassword = confirmErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try { await register(formData.email, formData.password, formData.name); } catch {}
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255,255,255,0.03)', borderRadius: '10px',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(168,230,61,0.35)' },
      '&.Mui-focused fieldset': { borderColor: ACCENT, borderWidth: '1px' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', '&.Mui-focused': { color: ACCENT } },
    '& .MuiInputBase-input': { color: 'white', fontSize: '0.9rem' },
    '& .MuiFormHelperText-root': { color: '#ef4444' }
  };

  const perks = [
    { icon: <ChatIcon sx={{ fontSize: 16, color: ACCENT }} />, label: 'AI Chat & Brainstorming' },
    { icon: <TaskIcon sx={{ fontSize: 16, color: ACCENT }} />, label: 'Smart Task Management' },
    { icon: <TranslateIcon sx={{ fontSize: 16, color: ACCENT }} />, label: 'Language & Translation Tools' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', background: BG }}>

      {/* ── LEFT PANEL ── */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, flexDirection: 'column', justifyContent: 'space-between', p: 6, position: 'relative', overflow: 'hidden', borderRight: '1px solid rgba(168,230,61,0.08)' }}>
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(168,230,61,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,230,61,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '70%', height: '70%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(45,90,12,0.5) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <Spark4 size={14} sx={{ position: 'absolute', top: '15%', right: '20%' }} />
        <Spark4 size={22} sx={{ position: 'absolute', top: '40%', right: '8%', opacity: 0.35 }} />
        <Spark4 size={10} sx={{ position: 'absolute', bottom: '25%', left: '30%', opacity: 0.4 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
          <Box sx={{ width: 34, height: 34, borderRadius: '9px', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SparkIcon sx={{ fontSize: 19, color: BG }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'white', letterSpacing: '0.04em' }}>SPARK</Typography>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography sx={{ fontSize: '2.6rem', fontWeight: 900, color: 'white', lineHeight: 1.1, letterSpacing: '-0.03em', mb: 3 }}>
            Start for free.<br />No credit card<br />required.
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, mb: 5, maxWidth: 340 }}>
            Join thousands of teams already using Spark AI to boost their productivity every day.
          </Typography>
          <Stack spacing={2}>
            {perks.map((p, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 30, height: 30, borderRadius: '8px', background: 'rgba(168,230,61,0.08)', border: '1px solid rgba(168,230,61,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.icon}
                </Box>
                <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{p.label}</Typography>
                <CheckIcon sx={{ fontSize: 14, color: ACCENT, ml: 'auto' }} />
              </Box>
            ))}
          </Stack>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1, p: 3, borderRadius: '14px', border: '1px solid rgba(168,230,61,0.1)', background: 'rgba(168,230,61,0.04)' }}>
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}>
            {[1,2,3,4,5].map(i => <Box key={i} sx={{ fontSize: '14px' }}>⭐</Box>)}
          </Box>
          <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontStyle: 'italic', mb: 1.5 }}>
            "The best AI productivity tool I've used. It's fast, intuitive, and genuinely helpful."
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: ACCENT, fontWeight: 600 }}>— Software Engineer</Typography>
        </Box>
      </Box>

      {/* ── RIGHT PANEL ── */}
      <Box sx={{ flex: { xs: 1, md: '0 0 480px' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', px: { xs: 3, sm: 6, md: 7 }, py: 6, position: 'relative', overflowY: 'auto' }}>
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 6 }}>
          <Box sx={{ width: 30, height: 30, borderRadius: '8px', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SparkIcon sx={{ fontSize: 17, color: BG }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'white', letterSpacing: '0.04em' }}>SPARK</Typography>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', mb: 1 }}>Create account</Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)' }}>Get started with Spark AI for free</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', '& .MuiAlert-icon': { color: '#f87171' } }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2.5}>
            <TextField fullWidth label="Full name" name="name" autoComplete="name"
              value={formData.name} onChange={handleChange} error={Boolean(errors.name)} helperText={errors.name} sx={inputSx} />

            <TextField fullWidth label="Email address" name="email" type="email" autoComplete="email"
              value={formData.email} onChange={handleChange} error={Boolean(errors.email)} helperText={errors.email} sx={inputSx} />

            <TextField fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
              value={formData.password} onChange={handleChange} error={Boolean(errors.password)} helperText={errors.password} sx={inputSx}
              slotProps={{ input: { endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(255,255,255,0.35)', '&:hover': { color: 'rgba(255,255,255,0.7)' } }}>
                    {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                  </IconButton>
                </InputAdornment>
              )}}}
            />

            <TextField fullWidth label="Confirm password" name="confirmPassword" type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
              value={formData.confirmPassword} onChange={handleChange} error={Boolean(errors.confirmPassword)} helperText={errors.confirmPassword} sx={inputSx}
              slotProps={{ input: { endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" sx={{ color: 'rgba(255,255,255,0.35)', '&:hover': { color: 'rgba(255,255,255,0.7)' } }}>
                    {showConfirm ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                  </IconButton>
                </InputAdornment>
              )}}}
            />
          </Stack>

          <Button fullWidth type="submit" disabled={loading} sx={{ mt: 3.5, background: ACCENT, color: BG, fontWeight: 700, fontSize: '0.9rem', py: 1.5, borderRadius: '10px', '&:hover': { background: '#c5f135', boxShadow: `0 6px 24px rgba(168,230,61,0.3)` }, '&:disabled': { background: 'rgba(168,230,61,0.25)', color: 'rgba(0,0,0,0.4)' }, transition: 'all 0.2s' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>

          {loading && (
            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', mt: 1.5 }}>
              Server may be starting up, please wait...
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: ACCENT, fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
