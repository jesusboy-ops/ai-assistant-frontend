// Authentication Layout - Dark mode with neon styling
import { Outlet } from 'react-router-dom';
import { Box, Container, alpha } from '@mui/material';
import { AutoAwesome as SparkIcon } from '@mui/icons-material';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Animated Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, ${alpha('#667eea', 0.3)} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${alpha('#764ba2', 0.3)} 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, ${alpha('#06b6d4', 0.2)} 0%, transparent 50%)
          `,
          animation: 'pulse 4s ease-in-out infinite alternate'
        }}
      />

      {/* Logo */}
      <Box
        sx={{
          position: 'absolute',
          top: 32,
          left: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          zIndex: 2
        }}
      >
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
          <SparkIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Box
          sx={{
            fontSize: '1.5rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Spark
        </Box>
      </Box>

      {/* Form Container */}
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </Container>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </Box>
  );
};

export default AuthLayout;
