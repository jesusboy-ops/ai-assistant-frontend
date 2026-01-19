// Language Tools Feature Page
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
  Stack,
  Chip
} from '@mui/material';
import {
  AutoAwesome as SparkIcon,
  Translate as TranslateIcon,
  ArrowBack as BackIcon,
  Language as LanguageIcon,
  VolumeUp as VolumeIcon,
  MenuBook as DictionaryIcon,
  Speed as SpeedIcon,
  Psychology as AIIcon,
  Public as GlobalIcon
} from '@mui/icons-material';

const LanguageToolsFeature = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TranslateIcon sx={{ fontSize: 28, color: '#06B6D4' }} />,
      title: 'Instant Translation',
      description: 'Translate text between 100+ languages with AI-powered accuracy and context awareness.'
    },
    {
      icon: <DictionaryIcon sx={{ fontSize: 28, color: '#10B981' }} />,
      title: 'Smart Dictionary',
      description: 'Get definitions, synonyms, etymology, and usage examples with intelligent word analysis.'
    },
    {
      icon: <VolumeIcon sx={{ fontSize: 28, color: '#F59E0B' }} />,
      title: 'Pronunciation Guide',
      description: 'Learn correct pronunciation with phonetic transcriptions and audio examples.'
    },
    {
      icon: <AIIcon sx={{ fontSize: 28, color: '#8B5CF6' }} />,
      title: 'Context Understanding',
      description: 'AI analyzes context to provide the most accurate translations and definitions.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 28, color: '#EF4444' }} />,
      title: 'Real-time Processing',
      description: 'Get instant results as you type with lightning-fast language processing.'
    },
    {
      icon: <GlobalIcon sx={{ fontSize: 28, color: '#667eea' }} />,
      title: 'Global Language Support',
      description: 'Support for major world languages including regional dialects and variations.'
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
              '&:hover': { backgroundColor: alpha('#667eea', 0.1) }
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
                  label="LANGUAGE TOOLS"
                  sx={{
                    backgroundColor: alpha('#06B6D4', 0.2),
                    color: '#06B6D4',
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
                  Break Language Barriers with AI
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
                  Translate, define, and understand languages instantly with AI-powered tools that make communication effortless.
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
                      background: 'linear-gradient(135deg, #06B6D4 0%, #0891b2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Try Language Tools
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
                      borderColor: alpha('#06B6D4', 0.6),
                      color: '#06B6D4',
                      borderRadius: 3,
                      '&:hover': {
                        borderColor: '#06B6D4',
                        backgroundColor: alpha('#06B6D4', 0.1)
                      }
                    }}
                  >
                    View Demo
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
                    background: 'linear-gradient(135deg, #06B6D4 0%, #0891b2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 60px rgba(6, 182, 212, 0.3)',
                    animation: 'float 3s ease-in-out infinite'
                  }}
                >
                  <LanguageIcon sx={{ fontSize: { xs: 120, md: 150 }, color: 'white' }} />
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
              Powerful Language Features
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
              Everything you need to communicate across languages
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(145deg, ${alpha('#1a1a2e', 0.9)} 0%, ${alpha('#16213e', 0.7)} 100%)`,
                    border: `1px solid ${alpha('#06B6D4', 0.25)}`,
                    borderRadius: 3,
                    padding: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      border: `1px solid ${alpha('#06B6D4', 0.5)}`,
                      boxShadow: '0 20px 40px rgba(6, 182, 212, 0.15)'
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

      {/* CTA Section */}
      <Box sx={{ paddingY: 12, background: alpha('#06B6D4', 0.1) }}>
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
              Ready to Connect Globally?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.85),
                marginBottom: 4,
                fontSize: '1.2rem'
              }}
            >
              Start breaking language barriers with AI-powered translation and dictionary tools
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
                background: 'linear-gradient(135deg, #06B6D4 0%, #0891b2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
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
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </Box>
  );
};

export default LanguageToolsFeature;