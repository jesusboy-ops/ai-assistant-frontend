// Sidebar - Veon-style dark green theme
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, Typography, IconButton, Drawer, useMediaQuery, useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon, Chat as ChatIcon, Email as EmailIcon,
  Note as NoteIcon, CalendarMonth as CalendarIcon, Folder as FolderIcon,
  Settings as SettingsIcon, Logout as LogoutIcon, ChevronLeft as ChevronLeftIcon,
  PictureAsPdf as PdfIcon, MenuBook as MenuBookIcon, Assignment as TaskIcon,
  Translate as TranslateIcon, Notifications as NotificationsIcon,
  Calculate as CalculateIcon, BugReport as DebugIcon, AutoAwesome as SparkIcon
} from '@mui/icons-material';
import useAuth from '../hooks/useAuth';

const ACCENT = '#a8e63d';
const ACCENT_DIM = 'rgba(168,230,61,0.12)';
const ACCENT_BORDER = 'rgba(168,230,61,0.18)';

const Sidebar = ({ open, onClose, collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const mainItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'AI Chat', icon: <ChatIcon />, path: '/chat' }
  ];
  const productivityItems = [
    { text: 'Email Generator', icon: <EmailIcon />, path: '/emails' },
    { text: 'Notes', icon: <NoteIcon />, path: '/notes' },
    { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
    { text: 'Files', icon: <FolderIcon />, path: '/files' },
    { text: 'PDF Scanner', icon: <PdfIcon />, path: '/pdf-scanner' }
  ];
  const toolsItems = [
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Reminders', icon: <NotificationsIcon />, path: '/reminders' },
    { text: 'Dictionary', icon: <MenuBookIcon />, path: '/dictionary' },
    { text: 'AI Translator', icon: <TranslateIcon />, path: '/translator' },
    { text: 'Math Solver', icon: <CalculateIcon />, path: '/math' }
  ];
  const accountItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Debug', icon: <DebugIcon />, path: '/debug' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const renderSection = (label, items) => (
    <>
      {(!collapsed || isMobile) && (
        <Typography sx={{ px: 2.5, pt: 2.5, pb: 0.5, display: 'block', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.08em', fontSize: '10px', textTransform: 'uppercase' }}>
          {label}
        </Typography>
      )}
      <List sx={{ px: 1, mb: 0.5 }}>
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: '2px' }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  py: 1.2, px: collapsed && !isMobile ? 1.5 : 1.8,
                  borderRadius: '8px',
                  justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                  transition: 'all 0.15s ease',
                  minHeight: '40px',
                  background: active ? ACCENT_DIM : 'transparent',
                  border: active ? `1px solid ${ACCENT_BORDER}` : '1px solid transparent',
                  '&:hover': { background: 'rgba(168,230,61,0.07)', border: '1px solid rgba(168,230,61,0.12)' }
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed && !isMobile ? 'auto' : 36, color: active ? ACCENT : 'rgba(255,255,255,0.5)', justifyContent: 'center', '& svg': { fontSize: '18px' } }}>
                  {item.icon}
                </ListItemIcon>
                {(!collapsed || isMobile) && (
                  <ListItemText primary={item.text} sx={{ '& .MuiTypography-root': { fontWeight: active ? 600 : 400, color: active ? ACCENT : 'rgba(255,255,255,0.75)', fontSize: '0.875rem' } }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  const sidebarContent = (
    <Box sx={{ position: 'fixed', top: 0, left: 0, height: '100vh', backgroundColor: '#0a0d07', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(168,230,61,0.1)', width: collapsed && !isMobile ? 72 : 260, transition: 'width 0.3s ease', zIndex: 1200 }}>
      {/* Logo */}
      <Box sx={{ px: collapsed && !isMobile ? 1.5 : 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: collapsed && !isMobile ? 'center' : 'flex-start', minHeight: '64px', borderBottom: '1px solid rgba(168,230,61,0.08)' }}>
        <Box sx={{ px: collapsed && !isMobile ? 1 : 1.8, py: 0.7, borderRadius: '100px', border: '1px solid rgba(168,230,61,0.3)', display: 'flex', alignItems: 'center', gap: collapsed && !isMobile ? 0 : 1.2, background: 'rgba(168,230,61,0.05)', flexShrink: 0 }}>
          <Box sx={{ width: 20, height: 20, borderRadius: '5px', background: '#a8e63d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <SparkIcon sx={{ fontSize: 12, color: '#0a0d07' }} />
          </Box>
          {(!collapsed || isMobile) && (
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'white', letterSpacing: '0.06em' }}>SPARK</Typography>
          )}
        </Box>
        {!isMobile && (!collapsed) && (
          <IconButton onClick={onToggleCollapse} sx={{ ml: 'auto', color: 'rgba(255,255,255,0.35)', p: '6px', '&:hover': { color: ACCENT, background: ACCENT_DIM } }}>
            <ChevronLeftIcon sx={{ fontSize: '18px' }} />
          </IconButton>
        )}
        {!isMobile && collapsed && (
          <IconButton onClick={onToggleCollapse} sx={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', background: '#0a0d07', border: '1px solid rgba(168,230,61,0.15)', p: '4px', width: 24, height: 24, '&:hover': { color: ACCENT, borderColor: ACCENT } }}>
            <ChevronLeftIcon sx={{ fontSize: '14px', transform: 'rotate(180deg)' }} />
          </IconButton>
        )}
      </Box>

      {/* Nav */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1.5, '&::-webkit-scrollbar': { width: '3px' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(168,230,61,0.2)', borderRadius: '2px' } }}>
        {renderSection('Main', mainItems)}
        {renderSection('Productivity', productivityItems)}
        {renderSection('Tools', toolsItems)}
        {renderSection('Account', accountItems)}
      </Box>

      {/* Logout */}
      <Box sx={{ borderTop: '1px solid rgba(168,230,61,0.08)', p: 1 }}>
        <ListItemButton onClick={logout} sx={{ py: 1.2, px: collapsed && !isMobile ? 1.5 : 1.8, borderRadius: '8px', justifyContent: collapsed && !isMobile ? 'center' : 'flex-start', '&:hover': { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }, border: '1px solid transparent', transition: 'all 0.15s ease' }}>
          <ListItemIcon sx={{ minWidth: collapsed && !isMobile ? 'auto' : 36, color: 'rgba(239,68,68,0.7)', justifyContent: 'center', '& svg': { fontSize: '18px' } }}>
            <LogoutIcon />
          </ListItemIcon>
          {(!collapsed || isMobile) && (
            <ListItemText primary="Logout" sx={{ '& .MuiTypography-root': { color: 'rgba(239,68,68,0.8)', fontWeight: 500, fontSize: '0.875rem' } }} />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer anchor="left" open={open} onClose={onClose} sx={{ '& .MuiDrawer-paper': { width: 260, backgroundColor: '#0a0d07', borderRight: '1px solid rgba(168,230,61,0.1)' } }}>
        {sidebarContent}
      </Drawer>
    );
  }

  return sidebarContent;
};

export default Sidebar;
