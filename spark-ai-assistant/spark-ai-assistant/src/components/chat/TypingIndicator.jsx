import { Box, Avatar, keyframes } from '@mui/material';

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
`;

const TypingIndicator = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 4
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start'
        }}
      >
        {/* AI Avatar */}
        <Avatar
          sx={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            width: 32,
            height: 32,
            fontSize: '14px',
            fontWeight: 600,
            flexShrink: 0,
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          AI
        </Avatar>

        {/* Typing bubble */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {/* Animated dots */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  animation: `${bounce} 1.4s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TypingIndicator;