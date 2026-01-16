import React from 'react';
import { Box, Typography, Card, Fade, Grow, useTheme } from '@mui/material';
import {
  AutoAwesome as SparkIcon,
  Chat as ChatIcon,
  Psychology as AIIcon,
  Lightbulb as IdeaIcon,
  Code as CodeIcon,
  School as LearnIcon
} from '@mui/icons-material';

const WelcomeMessage = ({ onStartChat }) => {
  const theme = useTheme();
  const suggestions = [
    {
      icon: <IdeaIcon />,
      title: "Get Ideas",
      description: "Brainstorm creative solutions",
      prompt: "Help me brainstorm ideas for..."
    },
    {
      icon: <CodeIcon />,
      title: "Code Help",
      description: "Debug and write code",
      prompt: "Can you help me with this code..."
    },
    {
      icon: <LearnIcon />,
      title: "Learn Something",
      description: "Explain complex topics",
      prompt: "Explain to me how..."
    },
    {
      icon: <ChatIcon />,
      title: "Just Chat",
      description: "Have a conversation",
      prompt: "Let's have a conversation about..."
    }
  ];

  const handleSuggestionClick = (prompt) => {
    if (onStartChat) {
      onStartChat(prompt);
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: { xs: 3, sm: 4, md: 6 },
        maxWidth: { xs: '100%', sm: 600, md: 700 },
        mx: 'auto'
      }}
    >
      {/* Main Welcome Section */}
      <Grow in timeout={800}>
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              mx: 'auto'
            }}
          >
            <SparkIcon sx={{ fontSize: 40, color: theme.palette.primary.contrastText }} />
          </Box>
          
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 2,
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            How can I help you today?
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme.palette.text.secondary,
              lineHeight: 1.6,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              maxWidth: 500,
              mx: 'auto'
            }}
          >
            I'm Spark AI, your intelligent assistant. I can help with coding, writing, analysis, and much more.
          </Typography>
        </Box>
      </Grow>

      {/* Suggestion Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 3,
          width: '100%',
          maxWidth: 600
        }}
      >
        {suggestions.map((suggestion, index) => (
          <Fade in timeout={1000 + index * 200} key={index}>
            <Card
              sx={{
                p: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: theme.palette.primary.main,
                  backgroundColor: theme.palette.action?.hover || theme.palette.background.paper
                }
              }}
              onClick={() => handleSuggestionClick(suggestion.prompt)}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  mx: 'auto'
                }}
              >
                {React.cloneElement(suggestion.icon, { 
                  sx: { color: theme.palette.primary.contrastText, fontSize: 24 } 
                })}
              </Box>
              
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 1,
                  fontSize: '1rem'
                }}
              >
                {suggestion.title}
              </Typography>
              
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.875rem'
                }}
              >
                {suggestion.description}
              </Typography>
            </Card>
          </Fade>
        ))}
      </Box>

      {/* Call to Action */}
      <Fade in timeout={1800}>
        <Box sx={{ mt: 6 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.5)',
              mb: 2
            }}
          >
            Or start typing your own message below
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default WelcomeMessage;