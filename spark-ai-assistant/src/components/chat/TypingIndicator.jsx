import React from 'react';
import { Box, Avatar, keyframes } from '@mui/material';

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
`;

const TypingIndicator = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        mb: 2,
        animation: `${pulse} 2s ease-in-out infinite`
      }}
    >
      <Avatar
        sx={{
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          width: 40,
          height: 40,
          border: '2px solid rgba(255, 255, 255, 0.1)',
          fontWeight: 700
        }}
      >
        AI
      </Avatar>
      
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: 3,
          padding: 2.5,
          minWidth: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              animation: `${bounce} 1.4s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TypingIndicator;