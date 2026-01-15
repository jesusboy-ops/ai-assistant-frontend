// Professional enterprise landing page
import { useState } from 'react';
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
  Collapse
} from '@mui/material';
import {
  AutoAwesome as SparkIcon,
  Chat as ChatIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
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
      {/* Clean Navigation - Reduced size */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <Box
              sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                borderRadius: 3,
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
              <SparkIcon sx={{ color: 'white', fontSize: { xs: 24, md: 28 } }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.8rem' } }}>
              Spark AI
            </Typography>
          </Box>

          {!isMobile ? (
            <Stack direction="row" spacing={3}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  paddingX: 4,
                  paddingY: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderColor: alpha('#667eea', 0.5),
                  color: '#667eea',
                  borderWidth: 2,
                  borderRadius: 3,
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
                  paddingX: 4,
                  paddingY: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: 3,
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
                padding: 2,
                '&:hover': {
                  backgroundColor: alpha('#667eea', 0.1)
                }
              }}
            >
              <MenuIcon sx={{ fontSize: 28 }} />
            </IconButton>
          )}
        </Toolbar>

        {/* Mobile Menu */}
        {isMobile && (
          <Collapse in={mobileMenuOpen}>
            <Box sx={{ 
              backgroundColor: alpha('#0A0A0F', 0.98),
              borderTop: `1px solid ${alpha('#667eea', 0.2)}`,
              p: 3
            }}>
              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  sx={{
                    paddingY: 1.5,
                    borderColor: alpha('#667eea', 0.5),
                    color: '#667eea',
                    '&:hover': {
                      borderColor: '#667eea',
                      backgroundColor: alpha('#667eea', 0.1)
                    }
                  }}
                >
                  Sign In
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    navigate('/signup');
                    setMobileMenuOpen(false);
                  }}
                  sx={{
                    paddingY: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
                    }
                  }}
                >
                  Get Started Free
                </Button>
              </Stack>
            </Box>
          </Collapse>
        )}
      </AppBar>

      {/* Hero Section - Reduced padding */}
      <Box
        sx={{
          paddingTop: { xs: 12, md: 16 },
          paddingBottom: 8,
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

      {/* Features Section - 2 Column, 3 Row Grid */}
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

          {/* 2 Column, 3 Row Grid Layout with CSS Grid */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: '1fr 1fr'
            },
            gridTemplateRows: { 
              xs: 'repeat(6, auto)', 
              sm: 'repeat(3, auto)' 
            },
            gap: 4,
            maxWidth: '1000px',
            margin: '0 auto',
            width: '100%'
          }}>
            {coreFeatures.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  height: '100%',
                  minHeight: { xs: '280px', sm: '320px', md: '360px' },
                  display: 'flex'
                }}
              >
                <Card
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    background: `linear-gradient(145deg, ${alpha('#1a1a2e', 0.9)} 0%, ${alpha('#16213e', 0.7)} 100%)`,
                    border: `1px solid ${alpha('#667eea', 0.25)}`,
                    borderRadius: 4,
                    padding: { xs: 3, sm: 4 },
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      border: `1px solid ${alpha('#667eea', 0.5)}`,
                      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
                      '& .feature-icon': {
                        transform: 'scale(1.1)',
                        filter: 'brightness(1.2)'
                      }
                    }
                  }}
                >
                  <CardContent 
                    sx={{ 
                      padding: 0, 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      gap: 2
                    }}
                  >
                    <Box 
                      className="feature-icon"
                      sx={{ 
                        marginBottom: 2,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        background: alpha('#667eea', 0.1),
                        border: `1px solid ${alpha('#667eea', 0.2)}`
                      }}
                    >
                      {feature.icon}
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        marginBottom: 1, 
                        color: 'white',
                        fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.4rem' },
                        lineHeight: 1.3
                      }}
                    >
                      {feature.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: alpha('#ffffff', 0.8), 
                        lineHeight: 1.6,
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.05rem' },
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {feature.description}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 1,
                      marginTop: 2,
                      color: '#667eea',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      <ArrowIcon sx={{ fontSize: 16 }} />
                      <span>Learn more</span>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* App Preview Section with Real Phone Image */}
      <Box sx={{ paddingY: 12, background: alpha('#1a1a2e', 0.3) }}>
        <Container maxWidth="lg">
          <Grid 
            container 
            spacing={6} 
            alignItems="center" 
            justifyContent="center"
            sx={{ minHeight: '600px' }}
          >
            {/* Phone Image Side - LEFT on desktop, TOP on mobile */}
            <Grid 
              item 
              xs={12} 
              md={6} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                order: { xs: 1, md: 1 }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                width: '100%',
                height: { xs: '450px', md: '550px' }
              }}>
                <Box
                  component="img"
                  src="/spark_phone-removebg-preview.png"
                  alt="Spark AI Mobile App"
                  sx={{
                    width: { xs: '320px', sm: '400px', md: '450px', lg: '500px' },
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px) scale(1.02)',
                      filter: 'drop-shadow(0 35px 60px rgba(102, 126, 234, 0.2))'
                    }
                  }}
                />
              </Box>
            </Grid>

            {/* Content Side - RIGHT on desktop, BOTTOM on mobile */}
            <Grid 
              item 
              xs={12} 
              md={6} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                order: { xs: 2, md: 2 }
              }}
            >
              <Box sx={{ 
                textAlign: { xs: 'center', md: 'left' }, 
                width: '100%', 
                maxWidth: '500px',
                px: { xs: 2, md: 0 }
              }}>
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
                  MOBILE EXPERIENCE
                </Typography>
                
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    marginBottom: 4,
                    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1
                  }}
                >
                  AI Assistant in Your Pocket
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: alpha('#ffffff', 0.8),
                    marginBottom: 4,
                    lineHeight: 1.6,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Access powerful AI tools anywhere, anytime. Study Mode, task management, 
                  and intelligent conversations - all optimized for mobile devices.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <CheckIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.9), fontSize: '1.1rem', textAlign: { xs: 'center', md: 'left' } }}>
                      <strong>Study Mode:</strong> Generate questions, flashcards, and summaries instantly
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <CheckIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.9), fontSize: '1.1rem', textAlign: { xs: 'center', md: 'left' } }}>
                      <strong>Smart Tasks:</strong> AI-powered task management with natural language
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <CheckIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.9), fontSize: '1.1rem', textAlign: { xs: 'center', md: 'left' } }}>
                      <strong>Responsive Design:</strong> Perfect experience on any device size
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/signup')}
                    sx={{
                      paddingX: 5,
                      paddingY: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Try It Now
                  </Button>
                </Box>
              </Box>
            </Grid>
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

      {/* Why Choose Spark - Explanatory Section */}
      <Box sx={{ paddingY: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left Side - Content */}
            <Grid item xs={12} lg={7}>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: 2
                  }}
                >
                  Your Complete Productivity Platform
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#06b6d4',
                    fontWeight: 600,
                    marginBottom: 3,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Everything you need to boost productivity, powered by AI
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: alpha('#ffffff', 0.8),
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    marginBottom: 4
                  }}
                >
                  Manage tasks, study with AI assistance, organize your calendar, take smart notes, 
                  and access powerful tools - all in one place. Sync your data across all devices 
                  and unlock the full potential of AI-powered productivity.
                </Typography>

                {/* Key Benefits */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      marginBottom: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <CheckIcon sx={{ color: '#06b6d4', marginRight: 1 }} />
                    Key Benefits:
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      'Sync your data across all devices',
                      'Save your study sessions and progress',
                      'Access advanced AI features and personalization',
                      'Secure cloud storage for all your content'
                    ].map((benefit, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckIcon sx={{ color: '#06b6d4', fontSize: 20 }} />
                        <Typography
                          variant="body1"
                          sx={{
                            color: alpha('#ffffff', 0.8),
                            fontSize: '0.95rem'
                          }}
                        >
                          {benefit}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Feature Highlights */}
            <Grid item xs={12} lg={5}>
              <Grid container spacing={2}>
                {[
                  { icon: <ChatIcon />, title: 'AI Chat Assistant', desc: 'Study mode with questions, flashcards, and summaries' },
                  { icon: <TaskIcon />, title: 'Task Management', desc: 'Organize and track your daily tasks' },
                  { icon: <DocumentIcon />, title: 'Smart Notes', desc: 'Create, organize, and share your notes' },
                  { icon: <TranslateIcon />, title: 'Language Tools', desc: 'Translation and dictionary services' }
                ].map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box 
                      sx={{ 
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(6, 182, 212, 0.2)',
                        borderRadius: 2,
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(6, 182, 212, 0.1)',
                          border: '1px solid rgba(6, 182, 212, 0.4)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{ color: '#06b6d4', mt: 0.5 }}>
                          {feature.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: '#ffffff',
                              fontWeight: 600,
                              marginBottom: 0.5
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: alpha('#ffffff', 0.7),
                              fontSize: '0.85rem'
                            }}
                          >
                            {feature.desc}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
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