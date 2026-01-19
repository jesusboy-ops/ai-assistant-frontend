// Task Management Feature Page
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  alpha,
  useTheme,
  useMediaQuery,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  AutoAwesome as SparkIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationIcon,
  Analytics as AnalyticsIcon,
  Group as TeamIcon,
  Sync as SyncIcon,
  SmartToy as AIIcon
} from '@mui/icons-material';
import useScrollToTop from '../../hooks/useScrollToTop';

const TaskManagementFeature = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Scroll to top when component mounts
  useScrollToTop();

  const features = [
    {
      icon: <AIIcon sx={{ fontSize: 28, color: '#667eea' }} />,
      title: 'AI-Powered Creation',
      description: 'Simply describe what you need to do in natural language, and our AI will create organized tasks with smart scheduling.'
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 28, color: '#06B6D4' }} />,
      title: 'Smart Scheduling',
      description: 'AI analyzes your workload and suggests optimal times for task completion based on priority and deadlines.'
    },
    {
      icon: <NotificationIcon sx={{ fontSize: 28, color: '#10B981' }} />,
      title: 'Intelligent Reminders',
      description: 'Get contextual reminders at the right time with smart notifications that adapt to your schedule.'
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 28, color: '#F59E0B' }} />,
      title: 'Progress Analytics',
      description: 'Track your productivity with detailed insights and analytics to understand your work patterns.'
    },
    {
      icon: <SyncIcon sx={{ fontSize: 28, color: '#8B5CF6' }} />,
      title: 'Cross-Device Sync',
      description: 'Access your tasks anywhere with real-time synchronization across all your devices.'
    },
    {
      icon: <TeamIcon sx={{ fontSize: 28, color: '#EF4444' }} />,
      title: 'Collaboration Ready',
      description: 'Share tasks and collaborate with team members with built-in sharing and assignment features.'
    }
  ];

  const benefits = [
    'Create tasks using natural language - just tell AI what you need to do',
    'Automatic priority detection based on keywords and context',
    'Smart deadline suggestions based on task complexity',
    'Integration with calendar for seamless scheduling',
    'Recurring task automation with intelligent patterns',
    'Progress tracking with visual completion indicators',
    'Export tasks to popular project management tools',
    'Offline access with automatic sync when connected'
  ];

  const examples = [
    {
      input: '"Remind me to call the client about the project proposal tomorrow at 2 PM"',
      output: 'Creates: High priority task with reminder set for tomorrow 2 PM'
    },
    {
      input: '"I need to finish the quarterly report by Friday"',
      output: 'Creates: Task with Friday deadline and suggests breaking into subtasks'
    },
    {
      input: '"Schedule weekly team meetings every Monday at 10 AM"',
      output: 'Creates: Recurring task with automatic calendar integration'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0A0A0F 0%, #1A1A2E 100%)',
        color: 'white'
      }}
    >
      {/* Navigation */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: alpha('#0A0A0F', 0.95),
          borderBottom: `1px solid ${alpha('#667eea', 0.1)}`,
          height: { xs: 70, md: 80 }
        }}
      >
        <Toolbar sx={{ height: { xs: 70, md: 80 }, paddingX: { xs: 2, md: 4 } }}>
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              marginRight: 2,
              color: '#667eea',
              '&:hover': {
                backgroundColor: alpha('#667eea', 0.1)
              }
            }}
          >
            <BackIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <Box
              sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <SparkIcon sx={{ color: 'white', fontSize: { xs: 24, md: 28 } }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
              Spark AI
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate('/signup')}
            sx={{
              paddingX: { xs: 3, md: 4 },
              paddingY: 1.5,
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 700,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
              }
            }}
          >
            Get Started
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ paddingTop: { xs: 12, md: 16 }, paddingBottom: 12 }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', maxWidth: 1000, margin: '0 auto' }}>
            <Chip
              label="SMART TASK MANAGEMENT"
              sx={{
                backgroundColor: alpha('#7F9CF5', 0.15),
                color: '#7F9CF5',
                fontWeight: 700,
                fontSize: '0.9rem',
                marginBottom: 4,
                paddingX: 3,
                paddingY: 1,
                border: `1px solid ${alpha('#7F9CF5', 0.3)}`
              }}
            />
            
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.8rem', md: '4rem', lg: '4.5rem' },
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              AI-Powered Task Management That Actually Works
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.2rem', md: '1.4rem' },
                color: alpha('#ffffff', 0.85),
                lineHeight: 1.6,
                marginBottom: 6,
                fontWeight: 400
              }}
            >
              Transform how you organize and complete tasks with intelligent AI that understands your workflow and adapts to your needs.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{
                  paddingX: 6,
                  paddingY: 2.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #7F9CF5 0%, #667eea 100%)',
                  boxShadow: '0 8px 32px rgba(127, 156, 245, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6D7CE8 0%, #5568d3 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(127, 156, 245, 0.4)'
                  }
                }}
              >
                Start Managing Tasks
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  paddingX: 6,
                  paddingY: 2.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderColor: alpha('#7F9CF5', 0.6),
                  color: '#7F9CF5',
                  borderWidth: 2,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: '#7F9CF5',
                    backgroundColor: alpha('#7F9CF5', 0.1),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                View Demo
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Features Grid */}
      <Box sx={{ paddingY: 12, background: alpha('#1a1a2e', 0.3) }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', marginBottom: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                marginBottom: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Intelligent Task Features
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.75),
                maxWidth: 600,
                margin: '0 auto',
                fontSize: '1.2rem'
              }}
            >
              Experience task management powered by advanced AI technology
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(145deg, ${alpha('#1a1a2e', 0.6)} 0%, ${alpha('#16213e', 0.4)} 100%)`,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha('#7F9CF5', 0.2)}`,
                    borderRadius: 4,
                    padding: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      border: `1px solid ${alpha('#7F9CF5', 0.4)}`,
                      boxShadow: '0 20px 40px rgba(127, 156, 245, 0.15)',
                      background: `linear-gradient(145deg, ${alpha('#1a1a2e', 0.8)} 0%, ${alpha('#16213e', 0.6)} 100%)`
                    }
                  }}
                >
                  <CardContent sx={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: 3,
                      padding: 2,
                      borderRadius: 2,
                      background: alpha('#7F9CF5', 0.1)
                    }}>
                      {feature.icon}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          marginLeft: 2,
                          color: 'white',
                          fontSize: '1.2rem'
                        }}
                      >
                        {feature.title}
                      </Typography>
                    </Box>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        color: alpha('#ffffff', 0.8),
                        lineHeight: 1.7,
                        fontSize: '1rem',
                        flex: 1
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Examples Section */}
      <Box sx={{ paddingY: 12 }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', marginBottom: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                marginBottom: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              See AI in Action
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.75),
                maxWidth: 600,
                margin: '0 auto',
                fontSize: '1.2rem'
              }}
            >
              Watch how natural language becomes organized tasks
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {examples.map((example, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    background: alpha('#7F9CF5', 0.1),
                    border: `1px solid ${alpha('#7F9CF5', 0.3)}`,
                    borderRadius: 3,
                    padding: 4
                  }}
                >
                  <CardContent sx={{ padding: 0 }}>
                    <Grid container spacing={4} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: '#7F9CF5',
                            fontWeight: 700,
                            marginBottom: 1,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                          }}
                        >
                          You Say:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: alpha('#ffffff', 0.9),
                            fontSize: '1.1rem',
                            fontStyle: 'italic',
                            lineHeight: 1.6
                          }}
                        >
                          {example.input}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: '#10B981',
                            fontWeight: 700,
                            marginBottom: 1,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                          }}
                        >
                          AI Creates:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: alpha('#ffffff', 0.9),
                            fontSize: '1.1rem',
                            lineHeight: 1.6
                          }}
                        >
                          {example.output}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ paddingY: 12, background: alpha('#1a1a2e', 0.3) }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3rem' },
                  fontWeight: 800,
                  marginBottom: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Everything You Need
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: alpha('#ffffff', 0.85),
                  marginBottom: 4,
                  fontSize: '1.2rem'
                }}
              >
                Comprehensive task management with intelligent automation
              </Typography>
              
              <List sx={{ padding: 0 }}>
                {benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ padding: '8px 0' }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckIcon sx={{ color: '#10B981', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={benefit}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: alpha('#ffffff', 0.9),
                          fontSize: '1rem'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 400
                }}
              >
                <Box
                  sx={{
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7F9CF5 0%, #667eea 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 60px rgba(127, 156, 245, 0.3)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: '120%',
                      height: '120%',
                      borderRadius: '50%',
                      border: `2px solid ${alpha('#7F9CF5', 0.3)}`,
                      animation: 'rotate 10s linear infinite'
                    }
                  }}
                >
                  <CheckIcon sx={{ fontSize: 120, color: 'white' }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ paddingY: 12, background: alpha('#7F9CF5', 0.1) }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3rem' },
                fontWeight: 800,
                marginBottom: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Ready to Transform Your Productivity?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.85),
                marginBottom: 4,
                fontSize: '1.2rem'
              }}
            >
              Start managing tasks the intelligent way with AI-powered automation
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                paddingX: 6,
                paddingY: 2.5,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #7F9CF5 0%, #667eea 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6D7CE8 0%, #5568d3 100%)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Get Started Free
            </Button>
          </Box>
        </Container>
      </Box>

      <style jsx>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Box>
  );
};

export default TaskManagementFeature;