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
  PictureAsPdf as PdfIcon,
  MenuBook as MenuBookIcon,
  Assignment as TaskIcon,
  Translate as TranslateIcon,
  Notifications as NotificationsIcon,
  Calculate as CalculateIcon
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
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Reminders', icon: <NotificationsIcon />, path: '/reminders' },
    { text: 'Dictionary', icon: <MenuBookIcon />, path: '/dictionary' },
    { text: 'AI Translator', icon: <TranslateIcon />, path: '/translator' },
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
    <List sx={{ padding: '0 8px', marginBottom: 1 }}>
      {items.map((item) => (
        <ListItem key={item.path} disablePadding sx={{ marginBottom: '2px' }}>
          <ListItemButton
            onClick={() => handleNavigation(item.path)}
            sx={{
              paddingY: 1.5,
              paddingX: collapsed && !isMobile ? 1.5 : 2,
              borderRadius: '10px',
              position: 'relative',
              justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
              transition: 'all 0.2s ease',
              minHeight: '44px',
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.12)',
                transform: 'translateX(4px)',
                '& .MuiListItemIcon-root': {
                  color: '#06b6d4'
                }
              },
              ...(isActive(item.path) && {
                backgroundColor: 'rgba(102, 126, 234, 0.18)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '24px',
                  borderRadius: '0 4px 4px 0',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
                }
              })
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed && !isMobile ? 'auto' : 44,
                color: isActive(item.path) ? '#06b6d4' : 'rgba(255, 255, 255, 0.8)',
                justifyContent: 'center',
                '& svg': {
                  fontSize: '20px'
                }
              }}
            >
              {item.icon}
            </ListItemIcon>
            {(!collapsed || isMobile) && (
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: isActive(item.path) ? 600 : 500,
                    color: isActive(item.path) ? '#06b6d4' : 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                    letterSpacing: '0.2px'
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
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
        width: collapsed && !isMobile ? 80 : 280,
        transition: 'width 0.3s ease',
        zIndex: 1200
      }}
    >
      {/* Logo/Brand with improved spacing */}
      <Box
        sx={{
          padding: collapsed && !isMobile ? '20px 12px' : '24px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
          minHeight: '70px', // Match header height
          position: 'relative'
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.6rem',
            color: 'white',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            flexShrink: 0,
            ...(collapsed && !isMobile && {
              margin: '0 auto' // Center the logo when collapsed
            })
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
              padding: '8px',
              position: collapsed ? 'absolute' : 'static',
              right: collapsed ? '12px' : 'auto',
              top: collapsed ? '50%' : 'auto',
              transform: collapsed ? 'translateY(-50%)' : 'none',
              '&:hover': {
                color: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)'
              }
            }}
          >
            <ChevronLeftIcon
              sx={{
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                fontSize: '20px'
              }}
            />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Navigation with improved spacing and proper scrolling */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        paddingY: 2,
        // Custom scrollbar styling
        '&::-webkit-scrollbar': {
          width: '4px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.05)'
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(102, 126, 234, 0.3)',
          borderRadius: '2px',
          '&:hover': {
            background: 'rgba(102, 126, 234, 0.5)'
          }
        }
      }}>
        {/* MAIN Section */}
        {(!collapsed || isMobile) && (
          <Typography
            variant="caption"
            sx={{
              paddingX: 3,
              paddingY: 1,
              display: 'block',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              letterSpacing: '0.8px',
              fontSize: '11px',
              textTransform: 'uppercase'
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
              paddingX: 3,
              paddingY: 1,
              paddingTop: 2,
              display: 'block',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              letterSpacing: '0.8px',
              fontSize: '11px',
              textTransform: 'uppercase'
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
              paddingX: 3,
              paddingY: 1,
              paddingTop: 2,
              display: 'block',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              letterSpacing: '0.8px',
              fontSize: '11px',
              textTransform: 'uppercase'
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
              paddingX: 3,
              paddingY: 1,
              paddingTop: 2,
              display: 'block',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              letterSpacing: '0.8px',
              fontSize: '11px',
              textTransform: 'uppercase'
            }}
          >
            ACCOUNT
          </Typography>
        )}
        {renderNavItems(accountItems)}
      </Box>

      {/* Logout Button with improved styling */}
      <Box sx={{ 
        flexShrink: 0,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '8px'
      }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            paddingY: 1.5,
            paddingX: collapsed && !isMobile ? 1.5 : 2,
            borderRadius: '10px',
            justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
            transition: 'all 0.2s ease',
            minHeight: '44px',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              transform: 'translateX(4px)'
            }
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: collapsed && !isMobile ? 'auto' : 44, 
            color: '#ef4444', 
            justifyContent: 'center',
            '& svg': {
              fontSize: '20px'
            }
          }}>
            <LogoutIcon />
          </ListItemIcon>
          {(!collapsed || isMobile) && (
            <ListItemText
              primary="Logout"
              sx={{
                '& .MuiTypography-root': {
                  color: '#ef4444',
                  fontWeight: 500,
                  fontSize: '14px',
                  letterSpacing: '0.2px'
                }
              }}
            />
          )}
        </ListItemButton>
      </Box>
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
            backgroundColor: theme.palette.background.paper
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
