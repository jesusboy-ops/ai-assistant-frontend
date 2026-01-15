// Simple, reliable loading spinner that actually works
import { Box } from '@mui/material';

const SimpleSpinner = ({ 
  size = 20, 
  color = '#06b6d4',
  text = null 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: text ? 1 : 0
      }}
    >
      <Box
        sx={{
          width: size,
          height: size,
          border: `2px solid transparent`,
          borderTop: `2px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }}
      />
      {text && (
        <Box
          sx={{
            color: color,
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          {text}
        </Box>
      )}
    </Box>
  );
};

export default SimpleSpinner;