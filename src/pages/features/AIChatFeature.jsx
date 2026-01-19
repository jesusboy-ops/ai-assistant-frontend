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
  Chip
} from '@mui/material';
import {
  AutoAwesome as SparkIcon,
  ArrowBack as BackIcon,
  Psychology as BrainIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  School as StudyIcon,
  Assignment as TaskIcon
} from '@mui/icons-material';
import useScrollToTop from '../../hooks/useScrollToTop';

const AIChatFeature = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Scroll to top when component mounts
  useScrollToTop();

  const features = [
    {
      icon: <BrainIcon sx={{ fontSize: 28, color: '#667eea' }} />,
      title: 'Contextual Understanding',
      description: 'Our AI remembers your conversation history and understands context, making interactions feel natural and productive.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 28, color: '#06B6D4' }} />,
      title: 'Instant Responses',
      description: 'Get immediate answers to your questions with lightning-fast response times powered by advanced AI models.'
    },
    {
      icon: <StudyIcon sx={{ fontSize: 28, color: '#10B981' }} />,
      title: 'Study Mode',
      description: 'Transform any content into interactive study materials with questions, flashcards, and summaries.'
    },
    {
      icon: <TaskIcon sx={{ fontSize: 28, color: '#F59E0B' }} />,
      title: 'Task Creation',
      description: 'Simply tell the AI what you need to do, and it will automatically create organized tasks and reminders.'
    },
    {
      icon: <LanguageIcon sx={{ fontSize: 28, color: '#8B5CF6' }} />,
      title: 'Multi-Language Support',
      description: 'Communicate in your preferred language with built-in translation and language detection capabilities.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 28, color: '#EF4444' }} />,
      title: 'Privacy First',
      description: 'Your conversations are secure and private. We never store sensitive information or share your data.'
    }
  ];

  const useCases = [
    {
      title: 'Academic Research',
      description: 'Get help with research questions, paper writing, and academic analysis',
      example: '"Help me understand quantum physics concepts for my thesis"'
    },
    {
      title: 'Creative Writing',
      description: 'Brainstorm ideas, improve your writing, and overcome creative blocks',
      example: '"Help me write a compelling opening for my novel about time travel"'
    },
    {
      title: 'Problem Solving',
      description: 'Work through complex problems step-by-step with AI guidance',
      example: '"Walk me through solving this calculus problem step by step"'
    },
    {
      title: 'Learning Assistant',
      description: 'Get explanations, create study materials, and test your knowledge',
      example: '"Create flashcards about the French Revolution for my history exam"'
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
              label="AI CHAT ASSISTANT"
              sx={{
                backgroundColor: alpha('#667eea', 0.15),
                color: '#667eea',
                fontWeight: 700,
                fontSize: '0.9rem',
                marginBottom: 4,
                paddingX: 3,
                paddingY: 1,
                border: `1px solid ${alpha('#667eea', 0.3)}`
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
              Intelligent Conversations That Get Things Done
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
              Experience AI that understands context, remembers your preferences, and helps you accomplish tasks through natural conversation.
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
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
                  }
                }}
              >
                Try AI Chat Now
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
                  borderColor: alpha('#667eea', 0.6),
                  color: '#667eea',
                  borderWidth: 2,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: '#667eea',
                    backgroundColor: alpha('#667eea', 0.1),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ paddingY: 12, background: alpha('#1a1a2e', 0.3) }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', marginBottom: 10 }}>
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
              Powerful AI Features
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.75),
                maxWidth: 600,
                margin: '0 auto',
                fontSize: '1.2rem',
                lineHeight: 1.6
              }}
            >
              Discover what makes our AI chat assistant the perfect productivity companion
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
                    border: `1px solid ${alpha('#667eea', 0.2)}`,
                    borderRadius: 4,
                    padding: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      border: `1px solid ${alpha('#667eea', 0.4)}`,
                      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
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
                      background: alpha('#667eea', 0.1)
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

      {/* Use Cases Section */}
      <Box sx={{ paddingY: 12 }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', marginBottom: 10 }}>
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
              Perfect For Every Need
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.75),
                maxWidth: 600,
                margin: '0 auto',
                fontSize: '1.2rem',
                lineHeight: 1.6
              }}
            >
              See how our AI chat assistant can help you in different scenarios
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {useCases.map((useCase, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(145deg, ${alpha('#667eea', 0.08)} 0%, ${alpha('#764ba2', 0.05)} 100%)`,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha('#667eea', 0.2)}`,
                    borderRadius: 4,
                    padding: 5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: `linear-gradient(145deg, ${alpha('#667eea', 0.12)} 0%, ${alpha('#764ba2', 0.08)} 100%)`,
                      border: `1px solid ${alpha('#667eea', 0.4)}`,
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 32px rgba(102, 126, 234, 0.2)'
                    }
                  }}
                >
                  <CardContent sx={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        marginBottom: 3,
                        color: 'white',
                        fontSize: '1.4rem'
                      }}
                    >
                      {useCase.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: alpha('#ffffff', 0.85),
                        lineHeight: 1.7,
                        marginBottom: 4,
                        fontSize: '1.05rem',
                        flex: 1
                      }}
                    >
                      {useCase.description}
                    </Typography>
                    <Box
                      sx={{
                        padding: 3,
                        background: alpha('#0A0A0F', 0.6),
                        borderRadius: 3,
                        border: `1px solid ${alpha('#667eea', 0.3)}`,
                        position: 'relative',
                        '&::before': {
                          content: '"💬"',
                          position: 'absolute',
                          top: -10,
                          left: 20,
                          fontSize: '1.2rem'
                        }
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#667eea',
                          fontStyle: 'italic',
                          fontSize: '0.95rem',
                          lineHeight: 1.5
                        }}
                      >
                        {useCase.example}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        paddingY: 12, 
        background: `linear-gradient(135deg, ${alpha('#667eea', 0.1)} 0%, ${alpha('#764ba2', 0.05)} 100%)`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 70%)'
        }
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.2rem' },
                fontWeight: 800,
                marginBottom: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Ready to Experience AI Chat?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.85),
                marginBottom: 5,
                fontSize: '1.3rem',
                lineHeight: 1.6,
                maxWidth: 500,
                margin: '0 auto 2rem'
              }}
            >
              Start having intelligent conversations that boost your productivity
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                paddingX: 8,
                paddingY: 3,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 16px 50px rgba(102, 126, 234, 0.5)'
                }
              }}
            >
              Get Started Free
            </Button>
            <Typography
              variant="body2"
              sx={{
                marginTop: 3,
                color: alpha('#ffffff', 0.6),
                fontSize: '0.95rem'
              }}
            >
              No credit card required • Start chatting in seconds
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AIChatFeature;