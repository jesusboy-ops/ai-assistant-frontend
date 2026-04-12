// Header - Veon-style dark green theme
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem,
  Typography, Divider, useTheme
} from '@mui/material';
import {
  Search as SearchIcon, Menu as MenuIcon,
  Person as ProfileIcon, Settings as SettingsIcon, Logout as LogoutIcon
} from '@mui/icons-material';
import NotificationCenter from '../components/NotificationCenter';
import UnifiedSearch from '../components/UnifiedSearch';
import { useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';

const ACCENT = '#a8e63d';

const Header = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#0a0d07', borderBottom: '1px solid rgba(168,230,61,0.1)', height: '64px' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 }, height: '64px', minHeight: '64px !important' }}>
        {/* Mobile menu */}
        <IconButton edge="start" onClick={onSidebarToggle} sx={{ display: { md: 'none' }, mr: 2, color: 'rgba(255,255,255,0.7)', '&:hover': { color: ACCENT, background: 'rgba(168,230,61,0.08)' } }}>
          <MenuIcon />
        </IconButton>

        {/* Search bar */}
        <Box
          onClick={() => setSearchOpen(true)}
          sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', px: 2, py: 1, width: { sm: '260px', md: '340px' }, height: '38px', border: '1px solid rgba(168,230,61,0.1)', cursor: 'pointer', transition: 'all 0.2s ease', '&:hover': { border: '1px solid rgba(168,230,61,0.3)', background: 'rgba(168,230,61,0.04)' } }}
        >
          <SearchIcon sx={{ color: 'rgba(255,255,255,0.35)', mr: 1.5, fontSize: '18px' }} />
          <Typography sx={{ flex: 1, color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Search...</Typography>
          <Box sx={{ background: 'rgba(255,255,255,0.07)', borderRadius: '4px', px: 0.8, py: 0.2, fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>⌘K</Box>
        </Box>

        {/* Mobile search icon */}
        <IconButton sx={{ display: { xs: 'flex', sm: 'none' }, color: 'rgba(255,255,255,0.6)', '&:hover': { color: ACCENT } }} onClick={() => setSearchOpen(true)}>
          <SearchIcon />
        </IconButton>

        {/* Right side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <NotificationCenter />
          <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ p: '3px', '&:hover': { background: 'rgba(168,230,61,0.08)' } }}>
            <Avatar sx={{ width: 34, height: 34, border: `1.5px solid rgba(168,230,61,0.4)`, fontSize: '14px', fontWeight: 700, background: 'linear-gradient(135deg, #2d5a1b 0%, #1a3a10 100%)', color: ACCENT }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile menu */}
        <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={() => setProfileAnchor(null)}
          PaperProps={{ sx: { mt: 1.5, minWidth: 200, background: '#0f1409', border: '1px solid rgba(168,230,61,0.15)', borderRadius: '10px', '& .MuiMenuItem-root': { px: 2.5, py: 1.2, '&:hover': { background: 'rgba(168,230,61,0.07)' } } } }}>
          <Box sx={{ px: 2.5, py: 2 }}>
            <Typography sx={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{user?.name || 'User'}</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', mt: 0.3 }}>{user?.email || ''}</Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(168,230,61,0.1)', my: 0.5 }} />
          <MenuItem onClick={() => { setProfileAnchor(null); navigate('/settings'); }} sx={{ color: 'rgba(255,255,255,0.8)', gap: 1.5, fontSize: '0.875rem' }}>
            <ProfileIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.45)' }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => { setProfileAnchor(null); navigate('/settings'); }} sx={{ color: 'rgba(255,255,255,0.8)', gap: 1.5, fontSize: '0.875rem' }}>
            <SettingsIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.45)' }} /> Settings
          </MenuItem>
          <Divider sx={{ borderColor: 'rgba(168,230,61,0.1)', my: 0.5 }} />
          <MenuItem onClick={() => { setProfileAnchor(null); logout(); }} sx={{ color: 'rgba(239,68,68,0.8)', gap: 1.5, fontSize: '0.875rem' }}>
            <LogoutIcon sx={{ fontSize: 16 }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
      <UnifiedSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </AppBar>
  );
};

export default Header;
