// Header component for dashboard
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import NotificationCenter from '../components/NotificationCenter';
import UnifiedSearch from '../components/UnifiedSearch';
import { useSelector, useDispatch } from 'react-redux';
import { formatSmartDate } from '../utils/formatDate';
import useAuth from '../hooks/useAuth';

const Header = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };
  
  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  const handleProfileOpen = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  const handleProfileClick = () => {
    handleProfileClose();
    navigate('/settings'); // Navigate to settings page for profile management
  };

  const handleSettingsClick = () => {
    handleProfileClose();
    navigate('/settings');
  };

  const handleLogoutClick = () => {
    handleProfileClose();
    logout();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        height: '70px'
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        paddingX: { xs: 2, sm: 3, md: 4 },
        height: '70px',
        minHeight: '70px !important' // Override default minHeight
      }}>
        {/* Mobile Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          onClick={onSidebarToggle}
          sx={{ 
            display: { md: 'none' },
            marginRight: 3,
            color: 'rgba(255, 255, 255, 0.8)',
            padding: '12px',
            '&:hover': {
              color: '#06b6d4',
              backgroundColor: 'rgba(6, 182, 212, 0.1)'
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Search Bar - Improved styling */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            paddingX: 3,
            paddingY: 1.5,
            width: { sm: '280px', md: searchOpen ? '450px' : '350px' },
            height: '44px',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            cursor: 'pointer',
            '&:hover': {
              border: '1px solid rgba(102, 126, 234, 0.5)',
              backgroundColor: 'rgba(102, 126, 234, 0.08)',
              transform: 'translateY(-1px)'
            },
            '&:focus-within': {
              border: '1px solid #667eea',
              backgroundColor: 'rgba(102, 126, 234, 0.1)'
            }
          }}
          onClick={handleSearchOpen}
        >
          <SearchIcon sx={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            marginRight: 2,
            fontSize: '20px'
          }} />
          <Typography
            sx={{
              flex: 1,
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: '0.2px'
            }}
          >
            Search across all content...
          </Typography>
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '2px 8px',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 500,
              letterSpacing: '0.5px'
            }}
          >
            ⌘K
          </Box>
        </Box>

        {/* Mobile Search Button */}
        <IconButton
          sx={{ 
            display: { xs: 'flex', sm: 'none' },
            color: 'rgba(255, 255, 255, 0.8)',
            padding: '12px',
            '&:hover': {
              color: '#06b6d4',
              backgroundColor: 'rgba(6, 182, 212, 0.1)'
            }
          }}
          onClick={handleSearchOpen}
        >
          <SearchIcon />
        </IconButton>

        {/* Right side - Notifications and Profile with better spacing */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2, md: 3 },
          marginLeft: { xs: 1, sm: 2 }
        }}>
          {/* Notifications */}
          <NotificationCenter />

          {/* Profile Avatar with improved styling */}
          <IconButton 
            onClick={handleProfileOpen} 
            sx={{ 
              padding: '4px',
              '&:hover': {
                backgroundColor: 'rgba(6, 182, 212, 0.1)'
              }
            }}
          >
            <Avatar
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                border: '2px solid #06b6d4',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  borderColor: '#667eea'
                }
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu with improved styling */}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={handleProfileClose}
          PaperProps={{
            sx: {
              marginTop: 2,
              minWidth: 220,
              backgroundColor: 'rgba(26, 26, 46, 0.95)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              '& .MuiMenuItem-root': {
                padding: '12px 20px',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)'
                }
              }
            }
          }}
        >
          <Box sx={{ padding: '16px 20px' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
              {user?.email || 'user@example.com'}
            </Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '8px 0' }} />
          <MenuItem onClick={handleProfileClick} sx={{ color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <ProfileIcon sx={{ fontSize: 18 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleSettingsClick} sx={{ color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <SettingsIcon sx={{ fontSize: 18 }} />
            Settings
          </MenuItem>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '8px 0' }} />
          <MenuItem onClick={handleLogoutClick} sx={{ color: 'rgba(255, 107, 107, 0.9)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <LogoutIcon sx={{ fontSize: 18 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>

      {/* Unified Search Dialog */}
      <UnifiedSearch open={searchOpen} onClose={handleSearchClose} />
    </AppBar>
  );
};

export default Header;
