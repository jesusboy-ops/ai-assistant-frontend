// Professional enterprise landing page
import { useState, useEffect, useRef } from 'react';
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
  Stack
} from '@mui/material';
import {
  AutoAwesome as SparkIcon,
  Chat as ChatIcon,
  Email as EmailIcon,
  Note as NoteIcon,
  CalendarMonth as CalendarIcon,
  Folder as FolderIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Cloud as CloudIcon,
  Menu as MenuIcon,
  Assignment as TaskIcon,
  Translate as TranslateIcon,
  Calculate as MathIcon,
  Description as DocumentIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core features data
  const coreFeatures = [
    {
      icon: <ChatIcon sx={{ fontSize: 32, color: '#667eea' }} />,
      title: 'AI Chat Assistant',
      description: 'Intelligent conversations that understand context and execute tasks automatically.'
    },
    {
      icon: <TaskIcon sx={{ fontSize: 32, color: '#7F9CF5' }} />,
      title: 'Smart Task Management',
      description: 'Create, organize, and track tasks with AI-powered scheduling and reminders.'
    },
    {
      icon: <TranslateIcon sx={{ fontSize: 32, color: '#06B6D4' }} />,
      title: 'Language Tools',
      description: 'Instant translation and dictionary lookup with pronunciation guides.'
    },
    {
      icon: <DocumentIcon sx={{ fontSize: 32, color: '#A78BFA' }} />,
      title: 'Document Analysis',
      description: 'Extract key insights and summaries from any document in seconds.'
    },
    {
      icon: <MathIcon sx={{ fontSize: 32, color: '#22D3EE' }} />,
      title: 'Problem Solver',
      description: 'Solve mathematical equations with detailed step-by-step explanations.'
    },
    {
      icon: <EmailIcon sx={{ fontSize: 32, color: '#10B981' }} />,
      title: 'Email Generator',
      description: 'Craft professional emails with AI assistance in multiple tones and styles.'
    }
  ];

  // Interactive demos
  const quickDemos = [
    {
      title: 'Create Task from Text',
      example: '"Remind me to call the client tomorrow at 3 PM"',
      action: () => navigate('/tasks'),
      color: '#7F9CF5'
    },
    {
      title: 'Instant Translation',
      example: '"Translate: Hello, how are you today?"',
      action: () => navigate('/translator'),
      color: '#06B6D4'
    },
    {
      title: 'Word Definition',
      example: '"What does serendipity mean?"',
      action: () => navigate('/dictionary'),
      color: '#3B82F6'
    },
    {
      title: 'Math Problem',
      example: '"Calculate: 15% of 240 + 30"',
      action: () => navigate('/math'),
      color: '#22D3EE'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0A0A0F 0%, #1A1A2E 100%)',
        color: 'white',
        position: 'relative'
      }}
    >
      {/* Clean Navigation */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: alpha('#0A0A0F', 0.95),
          borderBottom: `1px solid ${alpha('#667eea', 0.1)}`,
          height: { xs: 100, md: 120 }
        }}
      >
        <Toolbar sx={{ height: { xs: 100, md: 120 }, paddingX: { xs: 3, md: 6 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexGrow: 1 }}>
            <Box
              sx={{
                width: { xs: 56, md: 64 },
                height: { xs: 56, md: 64 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                  }
              }}
            >
              <SparkIcon sx={{ color: 'white', fontSize: { xs: 32, md: 36 } }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              Spark AI
            </Typography>
          </Box>

          {!isMobile ? (
            <Stack direction="row" spacing={4}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  paddingX: 5,
                  paddingY: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderColor: alpha('#667eea', 0.5),
                  color: '#667eea',
                  borderWidth: 2,
                  borderRadius: 4,
                  '&:hover': {
                    borderColor: '#667eea',
                    backgroundColor: alpha('#667eea', 0.1),
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/signup')}
                sx={{
                  paddingX: 5,
                  paddingY: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started Free
              </Button>
            </Stack>
          ) : (
            <IconButton 
              color="inherit" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{
                padding: 2.5,
                '&:hover': {
                  backgroundColor: alpha('#667eea', 0.1)
                }
              }}
            >
              <MenuIcon sx={{ fontSize: 36 }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section - Clean & Professional */}
      <Box
        sx={{
          paddingTop: { xs: 20, md: 24 },
          paddingBottom: 12,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            sx={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#667eea',
              letterSpacing: '0.15em',
              marginBottom: 4,
              display: 'block',
              textTransform: 'uppercase'
            }}
          >
            AI-POWERED PRODUCTIVITY SUITE
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3.8rem', sm: '5rem', md: '6.5rem', lg: '7.5rem' },
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: 5,
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em'
            }}
          >
            Your Intelligent
            <br />
            Work Assistant
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              fontWeight: 400,
              color: alpha('#ffffff', 0.85),
              marginBottom: 7,
              maxWidth: 700,
              margin: '0 auto 4rem',
              lineHeight: 1.7
            }}
          >
            Transform your productivity with AI that understands, learns, and acts. 
            From intelligent chat to smart tasks, document analysis to instant calculations—all completely free.
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={4} 
            justifyContent="center"
            sx={{ marginBottom: 10 }}
          >
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                paddingX: 6,
                paddingY: 2.5,
                fontSize: '1.2rem',
                fontWeight: 600,
                borderColor: alpha('#667eea', 0.6),
                borderWidth: 2,
                color: '#667eea',
                borderRadius: 4,
                '&:hover': {
                  borderColor: '#667eea',
                  backgroundColor: alpha('#667eea', 0.1),
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Watch Demo
            </Button>
          </Stack>

          {/* Trust Indicators */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={5} 
            justifyContent="center"
            alignItems="center"
            sx={{
              padding: 4,
              borderRadius: 3,
              background: alpha('#1a1a2e', 0.4),
              border: `1px solid ${alpha('#667eea', 0.2)}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckIcon sx={{ fontSize: 20, color: '#10b981' }} />
              <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.8), fontWeight: 500 }}>
                100% Free Forever
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SecurityIcon sx={{ fontSize: 20, color: '#667eea' }} />
              <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.8), fontWeight: 500 }}>
                Enterprise Security
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CloudIcon sx={{ fontSize: 20, color: '#667eea' }} />
              <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.8), fontWeight: 500 }}>
                No Setup Required
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Features Section - Clean Grid */}
      <Box sx={{ paddingY: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', marginBottom: 10 }}>
            <Typography
              variant="overline"
              sx={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#667eea',
                letterSpacing: '0.15em',
                marginBottom: 3,
                display: 'block',
                textTransform: 'uppercase'
              }}
            >
              POWERFUL FEATURES
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.8rem', md: '4rem' },
                fontWeight: 800,
                marginBottom: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.01em'
              }}
            >
              Everything You Need
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.75),
                maxWidth: 650,
                margin: '0 auto',
                lineHeight: 1.7,
                fontSize: '1.2rem'
              }}
            >
              Comprehensive AI tools designed to streamline your workflow and boost productivity
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            {coreFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: { xs: 320, sm: 360 },
                    background: `linear-gradient(145deg, ${alpha('#1a1a2e', 0.9)} 0%, ${alpha('#16213e', 0.7)} 100%)`,
                    border: `1px solid ${alpha('#667eea', 0.25)}`,
                    borderRadius: 5,
                    padding: { xs: 3, sm: 4 },
                    cursor: 'pointer',
                    perspective: '1000px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformStyle: 'preserve-3d',
                    '&:hover': {
                      transform: 'translateY(-16px) rotateX(8deg) rotateY(8deg)',
                      border: `1px solid ${alpha('#667eea', 0.5)}`,
                      '& .feature-icon': {
                        transform: 'scale(1.25) rotateZ(5deg)'
                      },
                      '& .feature-content': {
                        transform: 'translateZ(25px)'
                      }
                    }
                  }}
                >
                  <CardContent 
                    className="feature-content"
                    sx={{ 
                      padding: 0, 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <Box 
                      className="feature-icon"
                      sx={{ 
                        marginBottom: { xs: 3, sm: 4 },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transformOrigin: 'center'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        marginBottom: { xs: 2, sm: 3 }, 
                        color: 'white',
                        fontSize: { xs: '1.1rem', sm: '1.4rem' },
                        textAlign: 'center'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: alpha('#ffffff', 0.8), 
                        lineHeight: 1.7,
                        fontSize: { xs: '0.9rem', sm: '1.05rem' },
                        flex: 1,
                        textAlign: 'center'
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

      {/* Interactive Demo Section */}
      <Box sx={{ paddingY: 12, background: alpha('#0A0A0F', 0.6) }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', marginBottom: 10 }}>
            <Typography
              variant="overline"
              sx={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#667eea',
                letterSpacing: '0.15em',
                marginBottom: 3,
                display: 'block',
                textTransform: 'uppercase'
              }}
            >
              TRY IT NOW
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.8rem', md: '4rem' },
                fontWeight: 800,
                marginBottom: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.01em'
              }}
            >
              See Spark AI in Action
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.75),
                maxWidth: 650,
                margin: '0 auto',
                lineHeight: 1.7,
                fontSize: '1.2rem'
              }}
            >
              Click any example below to experience our AI capabilities instantly
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {quickDemos.map((demo, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  onClick={demo.action}
                  sx={{
                    padding: 5,
                    background: alpha('#1a1a2e', 0.7),
                    border: `2px solid ${alpha(demo.color, 0.25)}`,
                    borderRadius: 4,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      border: `2px solid ${alpha(demo.color, 0.5)}`
                    }
                  }}
                >
                  <CardContent sx={{ padding: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', fontSize: '1.3rem' }}>
                        {demo.title}
                      </Typography>
                      <ArrowIcon sx={{ color: demo.color, fontSize: 24 }} />
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: alpha('#ffffff', 0.85),
                        fontStyle: 'italic',
                        fontSize: '1.1rem',
                        lineHeight: 1.6
                      }}
                    >
                      {demo.example}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box sx={{ paddingY: 12 }}>
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: 'center',
              padding: 10,
              borderRadius: 5,
              background: alpha('#667eea', 0.12),
              border: `1px solid ${alpha('#667eea', 0.35)}`
              }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800, 
                marginBottom: 4,
                fontSize: { xs: '2.8rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.01em'
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                marginBottom: 6, 
                color: alpha('#ffffff', 0.85),
                lineHeight: 1.7,
                fontSize: '1.2rem'
              }}
            >
              Join thousands of professionals already using Spark AI completely free
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                paddingX: 7,
                paddingY: 3,
                fontSize: '1.3rem',
                fontWeight: 700,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Get Started Free
            </Button>
            <Typography 
              variant="body1" 
              sx={{ 
                marginTop: 4,
                color: alpha('#ffffff', 0.65),
                fontSize: '1rem'
              }}
            >
              No credit card required • 100% Free Forever • No hidden fees
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Clean Footer */}
      <Box
        sx={{
          borderTop: `1px solid ${alpha('#667eea', 0.2)}`,
          paddingY: 6,
          background: alpha('#0A0A0F', 0.8)
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <SparkIcon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Spark AI
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
                  © 2025 Spark AI Assistant. All rights reserved.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;