import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowUpward as ArrowUpIcon
} from '@mui/icons-material';

const ChatInput = ({ 
  value, 
  onChange, 
  onSend, 
  onKeyPress, 
  disabled = false, 
  sending = false,
  placeholder = "Type a message..."
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '25px',
        border: `1px solid ${theme.palette.divider}`,
        padding: '8px 12px',
        transition: 'all 0.2s ease',
        '&:focus-within': {
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.background.paper
        }
      }}
    >
      {/* Text Input */}
      <TextField
        fullWidth
        multiline
        maxRows={3}
        minRows={1}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        disabled={disabled}
        sx={{
          '& .MuiOutlinedInput-root': {
            border: 'none',
            borderRadius: 0,
            backgroundColor: 'transparent',
            fontSize: { xs: '16px', sm: '14px' },
            '& fieldset': {
              border: 'none'
            },
            '&:hover fieldset': {
              border: 'none'
            },
            '&.Mui-focused fieldset': {
              border: 'none'
            }
          },
          '& .MuiInputBase-input': {
            color: theme.palette.text.primary,
            padding: '8px 0',
            lineHeight: 1.5,
            '&::placeholder': {
              color: theme.palette.text.disabled,
              opacity: 1
            }
          },
          '& .MuiInputBase-inputMultiline': {
            resize: 'none'
          }
        }}
      />

      {/* Send Button */}
      <IconButton
        onClick={onSend}
        disabled={!value.trim() || sending || disabled}
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: value.trim() && !disabled 
            ? theme.palette.primary.main
            : theme.palette.action?.disabled || 'rgba(255, 255, 255, 0.1)',
          color: value.trim() && !disabled ? theme.palette.primary.contrastText : theme.palette.text.disabled,
          transition: 'all 0.2s ease',
          flexShrink: 0,
          '&:hover': {
            background: value.trim() && !disabled 
              ? theme.palette.primary.dark
              : theme.palette.action?.disabled || 'rgba(255, 255, 255, 0.1)',
            transform: value.trim() && !disabled ? 'scale(1.05)' : 'none'
          },
          '&:disabled': {
            background: theme.palette.action?.disabled || 'rgba(255, 255, 255, 0.1)',
            color: theme.palette.text.disabled
          }
        }}
      >
        <ArrowUpIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Box>
  );
};

export default ChatInput;