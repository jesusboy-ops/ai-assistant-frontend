// Comprehensive Notification Center Component
import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Button,
  Chip,
  Avatar,
  Fade,
  Grow,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  Task as TaskIcon,
  Event as EventIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  setNotifications,
  addNotification
} from '../store/slices/notificationsSlice';
import { formatSmartDate } from '../utils/formatDate';
import { useThemeMode } from '../contexts/ThemeContext';

const NotificationCenter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark } = useThemeMode();
  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, tasks, reminders, system

  useEffect(() => {
    // Load notifications on mount
    loadNotifications();
    
    // Set up polling for new notifications
    const interval = setInterval(loadNotifications, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    // Mock notifications for now - replace with actual API call
    const mockNotifications = [
      {
        id: '1',
        type: 'task',
        title: 'Task Due Soon',
        message: 'Complete project proposal by 5 PM today',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        priority: 'high',
        actionUrl: '/tasks'
      },
      {
        id: '2',
        type: 'reminder',
        title: 'Meeting Reminder',
        message: 'Team standup in 15 minutes',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false,
        priority: 'medium',
        actionUrl: '/calendar'
      },
      {
        id: '3',
        type: 'system',
        title: 'Backup Complete',
        message: 'Your data has been successfully backed up',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true,
        priority: 'low',
        actionUrl: '/settings'
      },
      {
        id: '4',
        type: 'chat',
        title: 'New AI Response',
        message: 'Spark AI has responded to your question about React hooks',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        priority: 'medium',
        actionUrl: '/chat'
      }
    ];
    
    dispatch(setNotifications(mockNotifications));
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      dispatch(markAsRead(notification.id));
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    
    handleClose();
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDeleteNotification = (notificationId, event) => {
    event.stopPropagation();
    dispatch(deleteNotification(notificationId));
  };

  const getNotificationIcon = (type, priority) => {
    const iconProps = {
      sx: { 
        fontSize: 20,
        color: getNotificationColor(type, priority)
      }
    };

    switch (type) {
      case 'task':
        return <TaskIcon {...iconProps} />;
      case 'reminder':
      case 'event':
        return <EventIcon {...iconProps} />;
      case 'email':
        return <EmailIcon {...iconProps} />;
      case 'chat':
        return <ChatIcon {...iconProps} />;
      case 'warning':
        return <WarningIcon {...iconProps} />;
      case 'error':
        return <ErrorIcon {...iconProps} />;
      case 'success':
        return <SuccessIcon {...iconProps} />;
      case 'system':
      default:
        return <InfoIcon {...iconProps} />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return '#ef4444';
    if (priority === 'medium') return '#f59e0b';
    
    switch (type) {
      case 'task':
        return '#667eea';
      case 'reminder':
      case 'event':
        return '#06b6d4';
      case 'email':
        return '#10b981';
      case 'chat':
        return '#8b5cf6';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      case 'success':
        return '#10b981';
      case 'system':
      default:
        return '#6b7280';
    }
  };

  const getPriorityChip = (priority) => {
    if (priority === 'low') return null;
    
    return (
      <Chip
        label={priority}
        size="small"
        sx={{
          height: 20,
          fontSize: '0.65rem',
          fontWeight: 600,
          backgroundColor: priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          color: priority === 'high' ? '#ef4444' : '#f59e0b',
          border: `1px solid ${priority === 'high' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
        }}
      />
    );
  };

  const getFilteredNotifications = () => {
    let filtered = [...notifications]; // Create a copy to avoid mutation
    
    switch (filter) {
      case 'unread':
        filtered = filtered.filter(n => !n.read);
        break;
      case 'tasks':
        filtered = filtered.filter(n => n.type === 'task');
        break;
      case 'reminders':
        filtered = filtered.filter(n => n.type === 'reminder' || n.type === 'event');
        break;
      case 'system':
        filtered = filtered.filter(n => n.type === 'system');
        break;
      default:
        break;
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const filteredNotifications = getFilteredNotifications();
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: isDark ? 'white' : 'inherit',
          transition: 'all 0.2s ease',
          '&:hover': {
            color: '#06b6d4',
            transform: 'scale(1.05)'
          }
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#ef4444',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
              minWidth: 18,
              height: 18,
              animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                  opacity: 1
                },
                '50%': {
                  transform: 'scale(1.1)',
                  opacity: 0.8
                },
                '100%': {
                  transform: 'scale(1)',
                  opacity: 1
                }
              }
            }
          }}
        >
          {unreadCount > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{
          sx: {
            width: 420,
            maxHeight: 600,
            marginTop: 1,
            backgroundColor: isDark ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: 3,
            boxShadow: isDark 
              ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
              : '0 20px 40px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          pb: 2,
          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  onClick={handleMarkAllRead}
                  sx={{
                    color: '#06b6d4',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(6, 182, 212, 0.1)'
                    }
                  }}
                >
                  Mark all read
                </Button>
              )}
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Filter Tabs */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'tasks', label: 'Tasks', count: notifications.filter(n => n.type === 'task').length },
              { key: 'reminders', label: 'Events', count: notifications.filter(n => n.type === 'reminder' || n.type === 'event').length }
            ].map((tab) => (
              <Chip
                key={tab.key}
                label={`${tab.label} ${tab.count > 0 ? `(${tab.count})` : ''}`}
                onClick={() => setFilter(tab.key)}
                variant={filter === tab.key ? 'filled' : 'outlined'}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: filter === tab.key ? '#667eea' : 'transparent',
                  color: filter === tab.key ? 'white' : 'text.secondary',
                  borderColor: filter === tab.key ? '#667eea' : 'rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    backgroundColor: filter === tab.key ? '#5a67d8' : 'rgba(102, 126, 234, 0.1)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Notifications List */}
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : filteredNotifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <NotificationsNoneIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'text.disabled', 
                  mb: 2,
                  opacity: 0.5
                }} 
              />
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                No notifications
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {filter === 'all' 
                  ? "You're all caught up!" 
                  : `No ${filter} notifications`}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredNotifications.map((notification, index) => (
                <Fade in timeout={300 + index * 100} key={notification.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        px: 3,
                        py: 2,
                        backgroundColor: notification.read 
                          ? 'transparent' 
                          : isDark 
                            ? 'rgba(102, 126, 234, 0.05)' 
                            : 'rgba(102, 126, 234, 0.02)',
                        borderLeft: notification.read 
                          ? 'none' 
                          : `3px solid ${getNotificationColor(notification.type, notification.priority)}`,
                        '&:hover': {
                          backgroundColor: isDark 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'rgba(0, 0, 0, 0.02)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: `${getNotificationColor(notification.type, notification.priority)}20`,
                            border: `1px solid ${getNotificationColor(notification.type, notification.priority)}40`
                          }}
                        >
                          {getNotificationIcon(notification.type, notification.priority)}
                        </Avatar>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: notification.read ? 500 : 700,
                                fontSize: '0.875rem',
                                flex: 1
                              }}
                            >
                              {notification.title}
                            </Typography>
                            {getPriorityChip(notification.priority)}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'text.secondary',
                                fontSize: '0.8rem',
                                lineHeight: 1.4,
                                mb: 0.5
                              }}
                            >
                              {notification.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.disabled',
                                fontSize: '0.7rem'
                              }}
                            >
                              {formatSmartDate(notification.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ml: 1 }}>
                        {!notification.read && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(markAsRead(notification.id));
                            }}
                            sx={{ 
                              color: 'text.secondary',
                              '&:hover': { color: '#06b6d4' }
                            }}
                          >
                            <MarkReadIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => handleDeleteNotification(notification.id, e)}
                          sx={{ 
                            color: 'text.secondary',
                            '&:hover': { color: '#ef4444' }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                </Fade>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <Box sx={{ 
            p: 2, 
            borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            textAlign: 'center'
          }}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#5a67d8',
                  backgroundColor: 'rgba(102, 126, 234, 0.05)'
                }
              }}
            >
              View All Notifications
            </Button>
          </Box>
        )}
      </Popover>
    </>
  );
};

export default NotificationCenter;