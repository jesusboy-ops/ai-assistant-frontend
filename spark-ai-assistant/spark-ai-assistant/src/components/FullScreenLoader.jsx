// Full screen loading overlay
import { Box, Typography } from '@mui/material';

const FullScreenLoader = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        gap: 3
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          border: '4px solid rgba(6, 182, 212, 0.3)',
          borderTop: '4px solid #06b6d4',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }}
      />
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontWeight: 500,
          textAlign: 'center'
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default FullScreenLoader;