import React from 'react';
import { Box, Typography, Button, Card, Fade, Grow } from '@mui/material';
import {
  AutoAwesome as SparkIcon,
  Chat as ChatIcon,
  Psychology as AIIcon,
  Lightbulb as IdeaIcon,
  Code as CodeIcon,
  School as LearnIcon
} from '@mui/icons-material';

const WelcomeMessage = ({ onStartChat }) => {
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
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: { xs: '100%', sm: 600, md: 700 },
        mx: 'auto',
        // Ensure proper spacing and prevent overflow
        minHeight: 'fit-content',
        overflow: 'visible'
      }}
    >
      {/* Main Welcome Section */}
      <Grow in timeout={800}>
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              mx: 'auto',
              animation: 'float 3s ease-in-out infinite',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -10,
                left: -10,
                right: -10,
                bottom: -10,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                opacity: 0.3,
                animation: 'pulse 2s ease-in-out infinite',
                zIndex: -1
              }
            }}
          >
            <SparkIcon sx={{ fontSize: 60, color: 'white' }} />
          </Box>
          
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 2,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              // Fallback for browsers that don't support gradient text
              color: '#667eea',
              // Ensure text is visible and not clipped - FIXED
              lineHeight: 1.3,
              textAlign: 'center',
              wordBreak: 'normal',
              whiteSpace: 'normal',
              overflow: 'visible',
              // Add text shadow for better visibility
              textShadow: '0 2px 4px rgba(102, 126, 234, 0.3)',
              // Ensure proper spacing and prevent cut-off
              padding: '0.2em 0',
              minHeight: 'fit-content'
            }}
          >
            Welcome to Spark AI
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 400,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              textAlign: 'center',
              // Ensure subtitle is visible and responsive
              lineHeight: 1.5,
              maxWidth: '100%',
              wordWrap: 'break-word',
              overflow: 'visible'
            }}
          >
            Your intelligent assistant is ready to help
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: 1.7,
              fontSize: { xs: '0.95rem', sm: '1rem' }
            }}
          >
            I can help you with coding, creative writing, problem-solving, learning new topics, 
            and much more. What would you like to explore today?
          </Typography>
        </Box>
      </Grow>

      {/* Suggestion Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 2,
          width: '100%',
          maxWidth: 500
        }}
      >
        {suggestions.map((suggestion, index) => (
          <Fade in timeout={1000 + index * 200} key={index}>
            <Card
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px) scale(1.02)',
                  border: '1px solid rgba(6, 182, 212, 0.5)'
                }
              }}
              onClick={() => handleSuggestionClick(suggestion.prompt)}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  mx: 'auto'
                  }}
              >
                {React.cloneElement(suggestion.icon, { 
                  sx: { color: 'white', fontSize: 24 } 
                })}
              </Box>
              
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  mb: 1,
                  fontSize: '1.1rem'
                }}
              >
                {suggestion.title}
              </Typography>
              
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem'
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
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '0.9rem'
            }}
          >
            <AIIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">
              Powered by advanced AI technology
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default WelcomeMessage;