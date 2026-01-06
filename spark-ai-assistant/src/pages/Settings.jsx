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
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { persistor } from '../store/store';
import toast from '../utils/toast';
import PageHeader from '../components/PageHeader';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: true,
    autoSave: true,
    emailNotifications: true,
    pushNotifications: false
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

  const handleResetSettings = async () => {
    try {
      // Clear all persisted data
      await persistor.purge();
      
      // Reset form to defaults
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        notifications: true,
        autoSave: true,
        emailNotifications: true,
        pushNotifications: false
      });
      
      toast.success('Settings reset successfully');
      setShowResetDialog(false);
      
      // Optionally reload the page to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error('Failed to reset settings');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <Grid container spacing={4}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: 3,
              height: 'fit-content'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                Profile Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                />

                <Button
                  variant="contained"
                  onClick={handleSave}
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
                    },
                    py: 1.5
                  }}
                >
                  Save Profile Changes
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Preferences */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: 3,
              height: 'fit-content'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                Notification Preferences
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications}
                      onChange={handleChange}
                      name="notifications"
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">General Notifications</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Receive notifications about app updates and features
                      </Typography>
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.emailNotifications}
                      onChange={handleChange}
                      name="emailNotifications"
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">Email Notifications</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Get important updates via email
                      </Typography>
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.pushNotifications}
                      onChange={handleChange}
                      name="pushNotifications"
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">Push Notifications</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Receive browser push notifications
                      </Typography>
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.autoSave}
                      onChange={handleChange}
                      name="autoSave"
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">Auto-save</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Automatically save your work
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: 3,
              height: 'fit-content'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                Security Settings
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  variant="outlined"
                />

                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
                    },
                    py: 1.5
                  }}
                >
                  Update Password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Management */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: 3,
              height: 'fit-content'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                Account Management
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Export Data
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    Download all your data in JSON format
                  </Typography>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    sx={{
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)'
                      }
                    }}
                  >
                    Export My Data
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="body1" sx={{ mb: 1, color: 'warning.main' }}>
                    Reset Settings
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    Reset all app settings and clear stored data. This will not delete your account.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="warning"
                    size="large"
                    fullWidth
                    onClick={() => setShowResetDialog(true)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)'
                      }
                    }}
                  >
                    Reset All Settings
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="body1" sx={{ mb: 1, color: 'error.main' }}>
                    Danger Zone
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    This action cannot be undone. All your data will be permanently deleted.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    fullWidth
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.1)'
                      }
                    }}
                  >
                    Delete Account
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Reset Settings Dialog */}
      <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
        <DialogTitle>Reset All Settings</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all settings? This will:
          </Typography>
          <Box component="ul" sx={{ mt: 2, pl: 2 }}>
            <li>Clear all stored tasks and reminders</li>
            <li>Reset all preferences to defaults</li>
            <li>Clear cached data</li>
            <li>Keep your account and login intact</li>
          </Box>
          <Typography sx={{ mt: 2, color: 'warning.main' }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
          <Button onClick={handleResetSettings} color="warning" variant="contained">
            Reset Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;
