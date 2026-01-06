// Custom Loading Spinner Component with Auto-Timeout
import { Box, keyframes } from '@mui/material';
import { useState, useEffect } from 'react';

// Define keyframes for different animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.95); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const dots = keyframes`
  0%, 20% { color: transparent; text-shadow: 0.25em 0 0 transparent, 0.5em 0 0 transparent; }
  40% { color: #06b6d4; text-shadow: 0.25em 0 0 transparent, 0.5em 0 0 transparent; }
  60% { text-shadow: 0.25em 0 0 #06b6d4, 0.5em 0 0 transparent; }
  80%, 100% { text-shadow: 0.25em 0 0 #06b6d4, 0.5em 0 0 #06b6d4; }
`;

const LoadingSpinner = ({ 
  size = 24, 
  type = 'spin', 
  color = '#06b6d4',
  text = null,
  fullScreen = false,
  timeout = null, // Auto-timeout in milliseconds
  onTimeout = null // Callback when timeout occurs
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (timeout && timeout > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onTimeout) {
          onTimeout();
        }
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [timeout, onTimeout]);

  if (!isVisible) {
    return null;
  }

  const renderSpinner = () => {
    switch (type) {
      case 'pulse':
        return (
          <Box
            sx={{
              width: size,
              height: size,
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${color}, ${color}80)`,
              animation: `${pulse} 1.5s ease-in-out infinite`,
            }}
          />
        );
      
      case 'bounce':
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: size / 3,
                  height: size / 3,
                  borderRadius: '50%',
                  backgroundColor: color,
                  animation: `${bounce} 1.4s ease-in-out infinite`,
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
          </Box>
        );
      
      case 'dots':
        return (
          <Box
            sx={{
              fontSize: size,
              color: color,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              '&::before': {
                content: '"..."',
                animation: `${dots} 1.5s steps(5, end) infinite`,
              }
            }}
          />
        );
      
      case 'modern':
        return (
          <Box
            sx={{
              width: size,
              height: size,
              border: `3px solid transparent`,
              borderTop: `3px solid ${color}`,
              borderRight: `3px solid ${color}40`,
              borderRadius: '50%',
              animation: `${spin} 0.8s linear infinite`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -3,
                left: -3,
                right: -3,
                bottom: -3,
                border: `2px solid transparent`,
                borderTop: `2px solid ${color}60`,
                borderRadius: '50%',
                animation: `${spin} 1.2s linear infinite reverse`,
              }
            }}
          />
        );
      
      default: // 'spin'
        return (
          <Box
            sx={{
              width: size,
              height: size,
              border: `3px solid rgba(6, 182, 212, 0.2)`,
              borderTop: `3px solid ${color}`,
              borderRadius: '50%',
              animation: `${spin} 1s linear infinite`,
              willChange: 'transform', // Optimize for animation
            }}
          />
        );
    }
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: text ? 2 : 0,
        ...(fullScreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
        })
      }}
    >
      {renderSpinner()}
      {text && (
        <Box
          sx={{
            color: color,
            fontSize: '14px',
            fontWeight: 500,
            textAlign: 'center',
            maxWidth: '200px',
          }}
        >
          {text}
        </Box>
      )}
    </Box>
  );

  return content;
};

export default LoadingSpinner;