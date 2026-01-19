// AI Chat Assistant Feature Page
import React from 'react';
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
  Chat as ChatIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckIcon,
  Psychology as BrainIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  School as StudyIcon,
  Assignment as TaskIcon
} from '@mui/icons-material';

const AIChatFeature = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      <Box sx={{ paddingTop: { xs: 12, md: 16 }, paddingBottom: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Chip
                  label="AI CHAT ASSISTANT"
                  sx={{
                    backgroundColor: alpha('#667eea', 0.2),
                    color: '#667eea',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    marginBottom: 3,
                    paddingX: 2,
                    paddingY: 1
                  }}
                />
                
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    fontWeight: 900,
                    lineHeight: 1.1,
                    marginBottom: 3,
                    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Intelligent Conversations That Get Things Done
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    color: alpha('#ffffff', 0.85),
                    lineHeight: 1.6,
                    marginBottom: 4,
                    maxWidth: 500
                  }}
                >
                  Experience AI that understands context, remembers your preferences, and helps you accomplish tasks through natural conversation.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
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
                      paddingX: 5,
                      paddingY: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderColor: alpha('#667eea', 0.6),
                      color: '#667eea',
                      borderRadius: 3,
                      '&:hover': {
                        borderColor: '#667eea',
                        backgroundColor: alpha('#667eea', 0.1)
                      }
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: 300, md: 400 }
                }}
              >
                <Box
                  sx={{
                    width: { xs: 280, md: 350 },
                    height: { xs: 280, md: 350 },
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
                    animation: 'pulse 2s infinite'
                  }}
                >
                  <ChatIcon sx={{ fontSize: { xs: 120, md: 150 }, color: 'white' }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Grid */}
      <Box sx={{ paddingY: 12, background: alpha('#1a1a2e', 0.3) }}>
        <Container maxWidth="lg">
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
              Powerful AI Features
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
              Discover what makes our AI chat assistant the perfect productivity companion
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(145deg, ${alpha('#1a1a2e', 0.9)} 0%, ${alpha('#16213e', 0.7)} 100%)`,
                    border: `1px solid ${alpha('#667eea', 0.25)}`,
                    borderRadius: 3,
                    padding: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      border: `1px solid ${alpha('#667eea', 0.5)}`,
                      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ padding: 0 }}>
                    <Box sx={{ marginBottom: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        marginBottom: 1,
                        color: 'white',
                        fontSize: '1.2rem'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: alpha('#ffffff', 0.8),
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
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
        <Container maxWidth="lg">
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
              Perfect For Every Need
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
              See how our AI chat assistant can help you in different scenarios
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {useCases.map((useCase, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: alpha('#667eea', 0.1),
                    border: `1px solid ${alpha('#667eea', 0.3)}`,
                    borderRadius: 3,
                    padding: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: alpha('#667eea', 0.15),
                      border: `1px solid ${alpha('#667eea', 0.5)}`,
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <CardContent sx={{ padding: 0 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        marginBottom: 2,
                        color: 'white',
                        fontSize: '1.3rem'
                      }}
                    >
                      {useCase.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: alpha('#ffffff', 0.8),
                        lineHeight: 1.6,
                        marginBottom: 3,
                        fontSize: '1rem'
                      }}
                    >
                      {useCase.description}
                    </Typography>
                    <Box
                      sx={{
                        padding: 2,
                        background: alpha('#0A0A0F', 0.4),
                        borderRadius: 2,
                        border: `1px solid ${alpha('#667eea', 0.2)}`
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#667eea',
                          fontStyle: 'italic',
                          fontSize: '0.9rem'
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
      <Box sx={{ paddingY: 12, background: alpha('#667eea', 0.1) }}>
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
              Ready to Experience AI Chat?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.85),
                marginBottom: 4,
                fontSize: '1.2rem'
              }}
            >
              Start having intelligent conversations that boost your productivity
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
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
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 25px 80px rgba(102, 126, 234, 0.4);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
          }
        }
      `}</style>
    </Box>
  );
};

export default AIChatFeature;