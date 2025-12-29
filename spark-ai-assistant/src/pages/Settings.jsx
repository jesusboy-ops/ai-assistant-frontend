// Settings page
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  BrightnessAuto as AutoModeIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import toast from '../utils/toast';
import PageHeader from '../components/PageHeader';
import { useThemeMode } from '../contexts/ThemeContext';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const { mode, setThemeMode, isDark } = useThemeMode();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: true
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleThemeChange = (newMode) => {
    setThemeMode(newMode);
    toast.success(`Theme changed to ${newMode} mode`);
  };

  const getThemeIcon = (themeMode) => {
    switch (themeMode) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      case 'auto':
        return <AutoModeIcon />;
      default:
        return <DarkModeIcon />;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: 3
              }}
          >
            <CardContent sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 3 }}>
                Profile Settings
              </Typography>

              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={{ marginBottom: 2 }}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ marginBottom: 3 }}
              />

              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
                  }
                }}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: 3
              }}
          >
            <CardContent sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 3 }}>
                Appearance & Preferences
              </Typography>

              {/* Theme Selection */}
              <Box sx={{ marginBottom: 3 }}>
                <Typography variant="subtitle2" sx={{ marginBottom: 2, fontWeight: 600 }}>
                  Theme Mode
                </Typography>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={mode}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    label="Theme"
                    startAdornment={getThemeIcon(mode)}
                  >
                    <MenuItem value="light">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LightModeIcon />
                        Light Mode
                      </Box>
                    </MenuItem>
                    <MenuItem value="dark">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DarkModeIcon />
                        Dark Mode
                      </Box>
                    </MenuItem>
                    <MenuItem value="auto">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutoModeIcon />
                        Auto (System)
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                  <Chip
                    label={`Current: ${isDark ? 'Dark' : 'Light'}`}
                    color={isDark ? 'primary' : 'secondary'}
                    size="small"
                    icon={isDark ? <DarkModeIcon /> : <LightModeIcon />}
                  />
                  {mode === 'auto' && (
                    <Chip
                      label="Following system preference"
                      variant="outlined"
                      size="small"
                      icon={<AutoModeIcon />}
                    />
                  )}
                </Box>
              </Box>

              <Divider sx={{ marginY: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifications}
                    onChange={handleChange}
                    name="notifications"
                  />
                }
                label="Enable Notifications"
                sx={{ marginBottom: 2, display: 'block' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={true}
                    disabled
                  />
                }
                label="Auto-save (Always enabled)"
                sx={{ marginBottom: 2, display: 'block' }}
              />

              <Divider sx={{ marginY: 3 }} />

              <Typography variant="subtitle2" sx={{ marginBottom: 2, color: 'text.secondary' }}>
                Danger Zone
              </Typography>

              <Button
                variant="outlined"
                color="error"
                fullWidth
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Password Change */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: 3
              }}
          >
            <CardContent sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 3 }}>
                Change Password
              </Typography>

              <TextField
                fullWidth
                label="Current Password"
                type="password"
                sx={{ marginBottom: 2 }}
              />

              <TextField
                fullWidth
                label="New Password"
                type="password"
                sx={{ marginBottom: 2 }}
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                sx={{ marginBottom: 3 }}
              />

              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                Update Password
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
