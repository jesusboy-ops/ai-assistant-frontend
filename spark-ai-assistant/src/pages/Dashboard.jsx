// Dashboard overview page
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Chat as ChatIcon,
  Email as EmailIcon,
  Note as NoteIcon,
  CalendarMonth as CalendarIcon,
  Folder as FolderIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp,
  AutoAwesome as SparkIcon,
  PictureAsPdf as PdfIcon,
  MoreVert as MoreVertIcon,
  MenuBook as MenuBookIcon,
  Assignment as TaskIcon,
  Translate as TranslateIcon,
  Notifications as NotificationsIcon,
  Calculate as CalculateIcon,
  Summarize as SummarizeIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import PageHeader from '../components/PageHeader';
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { user } = useSelector((state) => state.auth);
  const { conversations } = useSelector((state) => state.chat);
  const { notes } = useSelector((state) => state.notes);
  const { events } = useSelector((state) => state.calendar);
  const { files } = useSelector((state) => state.files);
  const { tasks } = useSelector((state) => state.tasks);
  const { reminders } = useSelector((state) => state.reminders);
  const { translationHistory } = useSelector((state) => state.translator);
  const { calculationHistory } = useSelector((state) => state.math);
  const { summaries } = useSelector((state) => state.documentSummarizer);
  const { searchHistory } = useSelector((state) => state.dictionary);

  // Quick stats cards - Enhanced with more explicit data
  const stats = [
    {
      title: 'AI Conversations',
      value: conversations.length || 0,
      icon: <ChatIcon sx={{ fontSize: 32 }} />,
      color: '#667eea',
      secondaryColor: '#764ba2',
      path: '/chat',
      change: '+12%',
      changeType: 'positive',
      description: 'Active AI chats',
      recentActivity: conversations.length > 0 ? 'Last chat: 2 hours ago' : 'No recent chats'
    },
    {
      title: 'Tasks',
      value: tasks.length || 0,
      icon: <TaskIcon sx={{ fontSize: 32 }} />,
      color: '#f59e0b',
      secondaryColor: '#d97706',
      path: '/tasks',
      change: '+15%',
      changeType: 'positive',
      description: 'Active tasks',
      recentActivity: tasks.length > 0 ? 'Due today: 3 tasks' : 'Create your first task'
    },
    {
      title: 'Notes',
      value: notes.length || 0,
      icon: <NoteIcon sx={{ fontSize: 32 }} />,
      color: '#10b981',
      secondaryColor: '#059669',
      path: '/notes',
      change: '+8%',
      changeType: 'positive',
      description: 'Total notes saved',
      recentActivity: notes.length > 0 ? 'Last updated: Today' : 'Start your first note'
    },
    {
      title: 'Reminders',
      value: reminders.length || 0,
      icon: <NotificationsIcon sx={{ fontSize: 32 }} />,
      color: '#ef4444',
      secondaryColor: '#dc2626',
      path: '/reminders',
      change: '+5%',
      changeType: 'positive',
      description: 'Active reminders',
      recentActivity: reminders.length > 0 ? 'Next: Tomorrow 9 AM' : 'Set your first reminder'
    },
    {
      title: 'Calendar Events',
      value: events.length || 0,
      icon: <CalendarIcon sx={{ fontSize: 32 }} />,
      color: '#8b5cf6',
      secondaryColor: '#7c3aed',
      path: '/calendar',
      change: '+5%',
      changeType: 'positive',
      description: 'Upcoming events',
      recentActivity: events.length > 0 ? 'Next event: Tomorrow' : 'No upcoming events'
    },
    {
      title: 'Files',
      value: files.length || 0,
      icon: <FolderIcon sx={{ fontSize: 32 }} />,
      color: '#06b6d4',
      secondaryColor: '#3b82f6',
      path: '/files',
      change: '+15%',
      changeType: 'positive',
      description: 'Total files stored',
      recentActivity: files.length > 0 ? 'Last upload: 1 day ago' : 'Upload your first file'
    }
  ];

  // Quick actions - Enhanced descriptions
  const quickActions = [
    {
      title: 'Start AI Chat',
      description: 'Have a conversation with your AI assistant for brainstorming, coding help, or writing assistance',
      icon: <ChatIcon sx={{ fontSize: 28 }} />,
      path: '/chat',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      features: ['Real-time responses', 'Context aware', 'Multi-format support']
    },
    {
      title: 'Dictionary Lookup',
      description: 'Search for word definitions, pronunciations, synonyms, and save favorites for vocabulary building',
      icon: <MenuBookIcon sx={{ fontSize: 28 }} />,
      path: '/dictionary',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      features: ['Pronunciations', 'Synonyms', 'Save favorites']
    },
    {
      title: 'Manage Tasks',
      description: 'Create and organize your to-do list with AI assistance, due dates, and priority management',
      icon: <TaskIcon sx={{ fontSize: 28 }} />,
      path: '/tasks',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      features: ['AI suggestions', 'Due dates', 'Priorities']
    },
    {
      title: 'Translate Text',
      description: 'Translate text between multiple languages instantly with pronunciation and history tracking',
      icon: <TranslateIcon sx={{ fontSize: 28 }} />,
      path: '/translator',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      features: ['Multi-language', 'Audio playback', 'History']
    },
    {
      title: 'Set Reminders',
      description: 'Create smart reminders with AI context detection for meetings, tasks, and important events',
      icon: <NotificationsIcon sx={{ fontSize: 28 }} />,
      path: '/reminders',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      features: ['Smart detection', 'Notifications', 'Calendar sync']
    },
    {
      title: 'Math Solver',
      description: 'Solve mathematical expressions quickly with optional step-by-step explanations and history',
      icon: <CalculateIcon sx={{ fontSize: 28 }} />,
      path: '/math',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      features: ['Step-by-step', 'History', 'Quick solve']
    },
    {
      title: 'Generate Email',
      description: 'Create professional emails with AI assistance for business communications and follow-ups',
      icon: <EmailIcon sx={{ fontSize: 28 }} />,
      path: '/emails',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      features: ['Templates', 'Tone adjustment', 'Grammar check']
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      position: 'relative',
      paddingBottom: 4,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, ${alpha('#667eea', 0.15)} 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, ${alpha('#764ba2', 0.15)} 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, ${alpha('#06b6d4', 0.1)} 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }
    }}>
      <Box sx={{ 
        maxWidth: { xs: '100%', sm: 600, md: 900, lg: 1200, xl: 1400 }, 
        margin: '0 auto',
        padding: { xs: 1, sm: 2, md: 3, lg: 4 },
        position: 'relative',
        zIndex: 1
      }}>
        {/* Welcome Header */}
        <Box sx={{ marginBottom: { xs: 4, sm: 6 } }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              marginBottom: 2,
              color: 'white',
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Welcome back, {user?.name || 'User'}! 👋
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontWeight: 400,
              fontSize: { xs: '0.875rem', sm: '1.125rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Here's what's happening with your productivity today
          </Typography>
        </Box>

        {/* Stats Grid: 2 per row on mobile, 3 per row on tablet, 6 per row on desktop */}
        <Grid container spacing={{ xs: 3, sm: 3, md: 4 }} sx={{ 
          marginBottom: { xs: 6, sm: 7, md: 8 },
          justifyContent: 'center'
        }}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 6, sm: 4, lg: 2 }} key={stat.title}>
              <Card
                sx={{
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  background: `linear-gradient(135deg, 
                    ${alpha(stat.color, 0.1)} 0%, 
                    ${alpha(stat.secondaryColor, 0.05)} 50%, 
                    rgba(15, 15, 35, 0.9) 100%
                  )`,
                  border: `1px solid ${alpha(stat.color, 0.3)}`,
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    border: `1px solid ${stat.color}`,
                    '& .stat-icon': {
                      transform: 'scale(1.1) rotate(5deg)'
                    }
                  }
                }}
                onClick={() => navigate(stat.path)}
              >
                <CardContent sx={{ p: 2 }}>
                  {/* Header with icon */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <Box
                      className="stat-icon"
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.secondaryColor} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                        }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>

                  {/* Main Value */}
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800, 
                      color: 'white',
                      fontSize: { xs: '1.5rem', sm: '1.75rem' },
                      lineHeight: 1,
                      mb: 0.5,
                      textAlign: 'center'
                    }}
                  >
                    {stat.value}
                  </Typography>

                  {/* Title */}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'white',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      mb: 0.5,
                      textAlign: 'center'
                    }}
                  >
                    {stat.title}
                  </Typography>

                  {/* Change Chip */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <Chip
                      label={stat.change}
                      size="small"
                      sx={{
                        backgroundColor: alpha('#10b981', 0.2),
                        color: '#10b981',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        height: 20
                      }}
                    />
                  </Box>

                  {/* Description */}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)', 
                      fontSize: '0.7rem',
                      display: 'block',
                      textAlign: 'center',
                      mb: 1
                    }}
                  >
                    {stat.description}
                  </Typography>

                  {/* Progress Bar */}
                  <Box sx={{ mt: 1 }}>
                    <Box 
                      sx={{ 
                        width: '100%', 
                        height: 4, 
                        backgroundColor: alpha(stat.color, 0.1),
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: `${Math.min(100, Math.floor((stat.value / 20) * 100))}%`, 
                          height: '100%', 
                          background: `linear-gradient(90deg, ${stat.color}, ${stat.secondaryColor})`,
                          borderRadius: 2,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions: 1 per row on mobile, 2x2 grid on larger screens */}
        <Box sx={{ marginBottom: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 4 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
                }}
            >
              <SparkIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
              }}
            >
              Quick Actions
            </Typography>
          </Box>
          
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            {quickActions.map((action, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={action.title} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card
                  sx={{
                    width: '100%',
                    maxWidth: { xs: '100%', sm: 280, md: 300 },
                    minHeight: { xs: 'auto', sm: 320, md: 340 },
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      border: '1px solid rgba(102, 126, 234, 0.4)',
                      '& .action-icon': {
                        transform: 'scale(1.1) rotate(-5deg)'
                      }
                    }
                  }}
                  onClick={() => navigate(action.path)}
                >
                  <CardContent sx={{ 
                    p: { xs: 2.5, sm: 2 }, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    gap: { xs: 1.5, sm: 1 },
                    justifyContent: 'space-between'
                  }}>
                    {/* Icon and Title Section */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      mb: 1
                    }}>
                      <Box
                        className="action-icon"
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: action.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          transition: 'all 0.3s ease',
                          flexShrink: 0
                        }}
                      >
                        {action.icon}
                      </Box>

                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: '1.125rem',
                          color: 'white',
                          lineHeight: 1.2,
                          flex: 1
                        }}
                      >
                        {action.title}
                      </Typography>
                    </Box>

                    {/* Description and Features */}
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.75)', 
                          lineHeight: 1.4,
                          fontSize: '0.8rem',
                          mb: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: { xs: 2, sm: 2 },
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {action.description}
                      </Typography>

                      {/* Features */}
                      <Box sx={{ mb: 1 }}>
                        {action.features.slice(0, 3).map((feature, idx) => (
                          <Chip
                            key={idx}
                            label={feature}
                            size="small"
                            sx={{
                              mr: 0.5,
                              mb: 0.5,
                              backgroundColor: alpha('#667eea', 0.15),
                              color: '#8b9aee',
                              fontSize: '0.6rem',
                              height: 18,
                              fontWeight: 500
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Action Button */}
                    <Box sx={{ mt: 'auto', pt: 1 }}>
                      <Button
                        fullWidth
                        endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />}
                        sx={{
                          background: action.gradient,
                          color: 'white',
                          padding: { xs: '8px 16px', sm: '10px 20px' },
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          borderRadius: 2,
                          textTransform: 'none',
                          '&:hover': {
                            background: action.gradient,
                            opacity: 0.9,
                            transform: 'translateX(4px)'
                            },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Get started
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Calendar & Events: Same width on mobile */}
        <Box sx={{ marginBottom: 8 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'center' },
            justifyContent: { xs: 'center', sm: 'space-between' }, 
            gap: 2,
            marginBottom: 4,
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                  }}
              >
                <CalendarIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                }}
              >
                Calendar & Events
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => navigate('/calendar')}
              sx={{
                borderColor: '#f59e0b',
                color: '#f59e0b',
                fontWeight: 600,
                paddingX: 3,
                '&:hover': {
                  borderColor: '#fbbf24',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  color: '#fbbf24'
                }
              }}
            >
              View All Events
            </Button>
          </Box>
          
          <Grid container spacing={3} sx={{ justifyContent: { xs: 'center', lg: 'flex-start' } }}>
            {/* Mini Calendar */}
            <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', justifyContent: { xs: 'center', lg: 'flex-start' } }}>
              <Card
                sx={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                    }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 3, color: 'white' }}>
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Typography>
                  
                  {/* Calendar Grid */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, marginBottom: 2 }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                      <Typography
                        key={`day-header-${index}`}
                        sx={{
                          textAlign: 'center',
                          padding: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}
                      >
                        {day.charAt(0)}
                      </Typography>
                    ))}
                  </Box>
                  
                  {/* Calendar Days */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                    {Array.from({ length: 35 }, (_, i) => {
                      const date = new Date();
                      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                      const startDate = new Date(firstDay);
                      startDate.setDate(startDate.getDate() - firstDay.getDay() + i);
                      const dayNumber = startDate.getDate();
                      const isCurrentMonth = startDate.getMonth() === date.getMonth();
                      const isToday = startDate.toDateString() === date.toDateString();
                      
                      const dayEvents = events.filter(event => {
                        if (!event.date) return false;
                        const eventDate = new Date(event.date);
                        return eventDate.toDateString() === startDate.toDateString();
                      });
                      const hasEvents = dayEvents.length > 0;
                      
                      return (
                        <Box
                          key={i}
                          sx={{
                            position: 'relative',
                            textAlign: 'center',
                            padding: 1,
                            fontSize: '0.875rem',
                            borderRadius: 1,
                            cursor: 'pointer',
                            color: isCurrentMonth ? 'white' : 'rgba(255, 255, 255, 0.3)',
                            backgroundColor: isToday ? '#f59e0b' : 'transparent',
                            '&:hover': {
                              backgroundColor: isToday ? '#d97706' : 'rgba(245, 158, 11, 0.1)'
                            }
                          }}
                          onClick={() => navigate('/calendar')}
                        >
                          {dayNumber}
                          {hasEvents && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 2,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                backgroundColor: dayEvents[0].color || '#06b6d4'
                                }}
                            />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                  
                  {/* Calendar Stats */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ color: '#f59e0b', fontWeight: 700 }}>{events.length}</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Total Events</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ color: '#06b6d4', fontWeight: 700 }}>
                        {events.filter(e => {
                          const eventDate = new Date(e.date);
                          const today = new Date();
                          return eventDate.toDateString() === today.toDateString();
                        }).length}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Today</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700 }}>
                        {events.filter(e => {
                          const eventDate = new Date(e.date);
                          const now = new Date();
                          return eventDate > now;
                        }).length}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Upcoming</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Upcoming Events - Same width as calendar */}
            <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', justifyContent: { xs: 'center', lg: 'flex-start' } }}>
              <Card
                sx={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                    }
                }}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                      Upcoming Events
                    </Typography>
                    <Chip 
                      label={`${events.length} events`} 
                      size="small" 
                      sx={{ backgroundColor: alpha('#06b6d4', 0.2), color: '#06b6d4' }}
                    />
                  </Box>
                  
                  <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    {events.length === 0 ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          color: 'text.secondary',
                          py: 4
                        }}
                      >
                        <CalendarIcon sx={{ fontSize: 48, mb: 2, opacity: 0.4 }} />
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: 'white' }}>
                          No events scheduled
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center', mb: 3 }}>
                          Create your first event to get started
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => navigate('/calendar')}
                          sx={{
                            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                            color: 'white'
                          }}
                        >
                          Create Event
                        </Button>
                      </Box>
                    ) : (
                      events
                        .slice(0, 4)
                        .map((event) => {
                          const eventDate = new Date(event.date);
                          const today = new Date();
                          const isToday = eventDate.toDateString() === today.toDateString();
                          const isTomorrow = eventDate.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
                          
                          let dateLabel;
                          if (isToday) {
                            dateLabel = 'Today';
                          } else if (isTomorrow) {
                            dateLabel = 'Tomorrow';
                          } else {
                            dateLabel = eventDate.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            });
                          }

                          const timeLabel = event.time ? new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          }) : 'All day';

                          return (
                            <Box
                              key={event.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                padding: 2,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${alpha(event.color || '#667eea', 0.1)} 0%, ${alpha(event.color || '#667eea', 0.05)} 100%)`,
                                border: `1px solid ${alpha(event.color || '#667eea', 0.2)}`,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                mb: 2,
                                '&:hover': {
                                  transform: 'translateX(4px)',
                                  background: `linear-gradient(135deg, ${alpha(event.color || '#667eea', 0.15)} 0%, ${alpha(event.color || '#667eea', 0.08)} 100%)`
                                }
                              }}
                              onClick={() => navigate('/calendar')}
                            >
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 2,
                                  backgroundColor: event.color || '#667eea',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: '0.875rem',
                                  flexShrink: 0
                                }}
                              >
                                {eventDate.getDate()}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: 'white' }}>
                                  {event.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: alpha(event.color || '#667eea', 0.9), fontSize: '0.875rem' }}>
                                  {dateLabel} • {timeLabel}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: event.color || '#667eea',
                                  flexShrink: 0
                                }}
                              />
                            </Box>
                          );
                        })
                    )}
                  </Box>
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/calendar')}
                    sx={{
                      mt: 3,
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': {
                        borderColor: '#8b9aee',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)'
                      }
                    }}
                  >
                    {events.length === 0 ? 'Create First Event' : 'Add New Event'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;