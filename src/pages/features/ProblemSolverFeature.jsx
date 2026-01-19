// Problem Solver Feature Page
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
  Calculate as MathIcon,
  ArrowBack as BackIcon,
  Functions as FormulaIcon,
  TrendingUp as GraphIcon,
  Psychology as AIIcon,
  Speed as SpeedIcon,
  School as LearnIcon
} from '@mui/icons-material';
import useScrollToTop from '../../hooks/useScrollToTop';

const ProblemSolverFeature = () => {
  const navigate = useNavigate();
  
  // Scroll to top when component mounts
  useScrollToTop();

  const features = [
    {
      icon: <MathIcon sx={{ fontSize: 28, color: '#22D3EE' }} />,
      title: 'Advanced Mathematics',
      description: 'Solve complex equations, calculus problems, and mathematical expressions with detailed explanations.'
    },
    {
      icon: <FormulaIcon sx={{ fontSize: 28, color: '#10B981' }} />,
      title: 'Step-by-Step Solutions',
      description: 'Get detailed breakdowns of problem-solving processes to understand the methodology.'
    },
    {
      icon: <GraphIcon sx={{ fontSize: 28, color: '#F59E0B' }} />,
      title: 'Visual Representations',
      description: 'Generate graphs, charts, and visual aids to better understand mathematical concepts.'
    },
    {
      icon: <AIIcon sx={{ fontSize: 28, color: '#8B5CF6' }} />,
      title: 'AI-Powered Analysis',
      description: 'Intelligent problem recognition and solution strategies tailored to your learning level.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 28, color: '#EF4444' }} />,
      title: 'Instant Results',
      description: 'Get immediate solutions and explanations for mathematical problems of any complexity.'
    },
    {
      icon: <LearnIcon sx={{ fontSize: 28, color: '#667eea' }} />,
      title: 'Learning Support',
      description: 'Educational explanations that help you understand concepts, not just get answers.'
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
      <Box sx={{ paddingTop: { xs: 12, md: 16 }, paddingBottom: 12 }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', maxWidth: 1000, margin: '0 auto' }}>
            <Chip
              label="PROBLEM SOLVER"
              sx={{
                backgroundColor: alpha('#22D3EE', 0.15),
                color: '#22D3EE',
                fontWeight: 700,
                fontSize: '0.9rem',
                marginBottom: 4,
                paddingX: 3,
                paddingY: 1,
                border: `1px solid ${alpha('#22D3EE', 0.3)}`
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
              Solve Any Mathematical Problem
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
              From basic arithmetic to advanced calculus, get step-by-step solutions with AI-powered mathematical intelligence.
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
                  background: 'linear-gradient(135deg, #22D3EE 0%, #0891b2 100%)',
                  boxShadow: '0 8px 32px rgba(34, 211, 238, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #06B6D4 0%, #0e7490 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(34, 211, 238, 0.4)'
                  }
                }}
              >
                Solve Problems Now
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
                  borderColor: alpha('#22D3EE', 0.6),
                  color: '#22D3EE',
                  borderWidth: 2,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: '#22D3EE',
                    backgroundColor: alpha('#22D3EE', 0.1),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                View Examples
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
              Mathematical Intelligence
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
              Advanced AI capabilities for solving mathematical problems of any complexity
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
                    border: `1px solid ${alpha('#22D3EE', 0.2)}`,
                    borderRadius: 4,
                    padding: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      border: `1px solid ${alpha('#22D3EE', 0.4)}`,
                      boxShadow: '0 20px 40px rgba(34, 211, 238, 0.15)',
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
                      background: alpha('#22D3EE', 0.1)
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

      {/* CTA Section */}
      <Box sx={{ paddingY: 12, background: alpha('#22D3EE', 0.1) }}>
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
              Ready to Solve Complex Problems?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.85),
                marginBottom: 4,
                fontSize: '1.2rem'
              }}
            >
              Start solving mathematical problems with AI-powered step-by-step guidance
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
                background: 'linear-gradient(135deg, #22D3EE 0%, #0891b2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #06B6D4 0%, #0e7490 100%)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Get Started Free
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ProblemSolverFeature;