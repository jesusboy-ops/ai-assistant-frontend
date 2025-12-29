// Sidebar navigation component for dashboard
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  Email as EmailIcon,
  Note as NoteIcon,
  CalendarMonth as CalendarIcon,
  Folder as FolderIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  PictureAsPdf as PdfIcon,
  MenuBook as MenuBookIcon,
  Assignment as TaskIcon,
  Translate as TranslateIcon,
  Notifications as NotificationsIcon,
  Calculate as CalculateIcon,
  Summarize as SummarizeIcon
} from '@mui/icons-material';
import useAuth from '../hooks/useAuth';

const Sidebar = ({ open, onClose, collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Navigation items grouped by category
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
    { text: 'Life Admin', icon: <TaskIcon />, path: '/life-admin' },
    { text: 'Dictionary', icon: <MenuBookIcon />, path: '/dictionary' },
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Translator', icon: <TranslateIcon />, path: '/translator' },
    { text: 'Reminders', icon: <NotificationsIcon />, path: '/reminders' },
    { text: 'Math Solver', icon: <CalculateIcon />, path: '/math' }
  ];

  const accountItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    console.log('🧭 Navigating to:', path);
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
  };

  const renderNavItems = (items) => (
    <List sx={{ padding: 0 }}>
      {items.map((item) => (
        <ListItem key={item.path} disablePadding>
          <ListItemButton
            onClick={() => handleNavigation(item.path)}
            sx={{
              paddingY: 1.5,
              paddingX: collapsed && !isMobile ? 1 : 2,
              position: 'relative',
              justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                '& .MuiListItemIcon-root': {
                  color: '#06b6d4'
                }
              },
              ...(isActive(item.path) && {
                backgroundColor: 'rgba(102, 126, 234, 0.15)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
                  }
              })
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed && !isMobile ? 'auto' : 40,
                color: isActive(item.path) ? '#06b6d4' : 'inherit',
                justifyContent: 'center'
              }}
            >
              {item.icon}
            </ListItemIcon>
            {(!collapsed || isMobile) && (
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: isActive(item.path) ? 600 : 400,
                    color: isActive(item.path) ? '#06b6d4' : 'inherit'
                  }
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  const sidebarContent = (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        backgroundColor: '#0f0f23',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(102, 126, 234, 0.2)',
        background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%)',
        width: collapsed && !isMobile ? 80 : 280,
        transition: 'width 0.3s ease',
        zIndex: 1200,
        overflow: 'hidden'
      }}
    >
      {/* Logo/Brand */}
      <Box
        sx={{
          padding: collapsed && !isMobile ? 2 : 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: collapsed && !isMobile ? 'center' : 'flex-start'
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.5rem',
            color: 'white'
          }}
        >
          S
        </Box>
        {(!collapsed || isMobile) && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Spark
          </Typography>
        )}
        {!isMobile && (
          <IconButton
            onClick={onToggleCollapse}
            sx={{
              marginLeft: 'auto',
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: '#06b6d4'
              }
            }}
          >
            <ChevronLeftIcon
              sx={{
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', paddingY: 2 }}>
        {/* MAIN Section */}
        {(!collapsed || isMobile) && (
          <Typography
            variant="caption"
            sx={{
              paddingX: 2,
              paddingY: 1,
              display: 'block',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            MAIN
          </Typography>
        )}
        {renderNavItems(mainItems)}

        {/* PRODUCTIVITY Section */}
        {(!collapsed || isMobile) && (
          <Typography
            variant="caption"
            sx={{
              paddingX: 2,
              paddingY: 1,
              paddingTop: 3,
              display: 'block',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            PRODUCTIVITY
          </Typography>
        )}
        {renderNavItems(productivityItems)}

        {/* TOOLS Section */}
        {(!collapsed || isMobile) && (
          <Typography
            variant="caption"
            sx={{
              paddingX: 2,
              paddingY: 1,
              paddingTop: 3,
              display: 'block',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            TOOLS
          </Typography>
        )}
        {renderNavItems(toolsItems)}

        {/* ACCOUNT Section */}
        {(!collapsed || isMobile) && (
          <Typography
            variant="caption"
            sx={{
              paddingX: 2,
              paddingY: 1,
              paddingTop: 3,
              display: 'block',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            ACCOUNT
          </Typography>
        )}
        {renderNavItems(accountItems)}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Logout Button */}
      <List sx={{ padding: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              paddingY: 1.5,
              paddingX: collapsed && !isMobile ? 1 : 2,
              justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.1)'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed && !isMobile ? 'auto' : 40, color: '#ef4444', justifyContent: 'center' }}>
              <LogoutIcon />
            </ListItemIcon>
            {(!collapsed || isMobile) && (
              <ListItemText
                primary="Logout"
                sx={{
                  '& .MuiTypography-root': {
                    color: '#ef4444'
                  }
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  // Mobile drawer
  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: 'transparent'
          }
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // Desktop sidebar
  return sidebarContent;
};

export default Sidebar;
