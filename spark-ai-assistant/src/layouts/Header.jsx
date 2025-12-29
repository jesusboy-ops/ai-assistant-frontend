// Header component for dashboard
import { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import NotificationCenter from '../components/NotificationCenter';
import UnifiedSearch from '../components/UnifiedSearch';
import { useSelector, useDispatch } from 'react-redux';
import { formatSmartDate } from '../utils/formatDate';
import useAuth from '../hooks/useAuth';

const Header = ({ onSidebarToggle, onSearchOpen }) => {
  const { user } = useAuth();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [profileAnchor, setProfileAnchor] = useState(null);

  const handleSearchOpen = () => {
    if (onSearchOpen) {
      onSearchOpen();
    }
  };
  
  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchValue('');
  };

  const handleProfileOpen = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#1a1a2e',
        borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
        background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', paddingX: { xs: 1, sm: 2, md: 3 } }}>
        {/* Mobile Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          onClick={onSidebarToggle}
          sx={{ 
            display: { md: 'none' },
            marginRight: 2,
            color: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              color: '#06b6d4'
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Search Bar */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
            paddingX: 2,
            paddingY: 0.5,
            width: { sm: '200px', md: searchOpen ? '400px' : '300px' },
            transition: 'width 0.3s',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer',
            '&:hover': {
              border: '1px solid #667eea',
              backgroundColor: 'rgba(102, 126, 234, 0.05)'
            }
          }}
          onClick={handleSearchOpen}
        >
          <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', marginRight: 1 }} />
          <Typography
            sx={{
              flex: 1,
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.9rem'
            }}
          >
            Search across all content... (Ctrl+K)
          </Typography>
        </Box>

        {/* Mobile Search Button */}
        <IconButton
          sx={{ 
            display: { xs: 'flex', sm: 'none' },
            color: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              color: '#06b6d4'
            }
          }}
          onClick={handleSearchOpen}
        >
          <SearchIcon />
        </IconButton>

        {/* Right side - Backend Status, Notifications and Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Notifications */}
          <NotificationCenter />

          {/* Profile Avatar */}
          <IconButton onClick={handleProfileOpen} sx={{ padding: 0 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                border: '2px solid #06b6d4',
                cursor: 'pointer'
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={handleProfileClose}
          PaperProps={{
            sx: {
              marginTop: 1,
              minWidth: 200,
              backgroundColor: '#2D3748',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Box sx={{ padding: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {user?.email || 'user@example.com'}
            </Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <MenuItem onClick={handleProfileClose}>Profile</MenuItem>
          <MenuItem onClick={handleProfileClose}>Settings</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
