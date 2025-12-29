import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  Fade,
  keyframes
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  AttachFile as AttachIcon,
  EmojiEmotions as EmojiIcon,
  Stop as StopIcon
} from '@mui/icons-material';

const pulse = keyframes`
  0% {
    transform: scale(1);
    
  }
  50% {
    transform: scale(1.05);
    
  }
  100% {
    transform: scale(1);
    
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const ChatInput = ({ 
  value, 
  onChange, 
  onSend, 
  onKeyPress, 
  disabled = false, 
  sending = false,
  placeholder = "Type your message to Spark AI..."
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const fileInputRef = useRef(null);

  const handleMicClick = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
    } else {
      // Start recording
      setIsRecording(true);
      // In a real app, you'd implement voice recording here
      setTimeout(() => setIsRecording(false), 3000); // Auto-stop after 3s for demo
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle file upload
      console.log('Files selected:', files);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 2,
        p: 3,
        borderTop: '1px solid rgba(102, 126, 234, 0.2)',
        background: 'linear-gradient(90deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)',
        borderRadius: '0 0 12px 12px'
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*,text/*,.pdf,.doc,.docx"
      />

      {/* Action Buttons */}
      <Fade in={showActions && !sending} timeout={200}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Tooltip title="Attach file">
            <IconButton
              size="small"
              onClick={handleFileAttach}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#06b6d4',
                  background: 'rgba(6, 182, 212, 0.1)'
                }
              }}
            >
              <AttachIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Add emoji">
            <IconButton
              size="small"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#fbbf24',
                  background: 'rgba(251, 191, 36, 0.1)'
                }
              }}
            >
              <EmojiIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Fade>

      {/* Text Input */}
      <TextField
        fullWidth
        multiline
        maxRows={4}
        minRows={1}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        disabled={disabled}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            background: 'rgba(15, 15, 35, 0.8)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            '&:hover': {
              border: '1px solid rgba(102, 126, 234, 0.5)',
              background: 'rgba(15, 15, 35, 0.9)',
              transform: 'translateY(-1px)'
              },
            '&.Mui-focused': {
              border: '1px solid #06b6d4',
              background: 'rgba(15, 15, 35, 0.95)',
              transform: 'translateY(-2px)'
            },
            '&.Mui-disabled': {
              background: 'rgba(15, 15, 35, 0.4)',
              opacity: 0.7
            }
          },
          '& .MuiInputBase-input': {
            color: 'white',
            padding: '16px',
            '&::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '1rem'
            }
          }
        }}
      />

      {/* Voice Recording Button */}
      <Tooltip title={isRecording ? "Stop recording" : "Voice message"}>
        <IconButton
          onClick={handleMicClick}
          disabled={disabled}
          sx={{
            width: 56,
            height: 56,
            background: isRecording 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'rgba(102, 126, 234, 0.2)',
            color: 'white',
            border: isRecording 
              ? '2px solid #fca5a5'
              : '2px solid rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            animation: isRecording ? `${pulse} 1.5s ease-in-out infinite` : 'none',
            '&:hover': {
              background: isRecording 
                ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                : 'rgba(102, 126, 234, 0.4)',
              transform: 'scale(1.05)'
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'none'
            }
          }}
        >
          {isRecording ? <StopIcon /> : <MicIcon />}
        </IconButton>
      </Tooltip>

      {/* Send Button */}
      <Tooltip title="Send message">
        <IconButton
          onClick={onSend}
          disabled={!value.trim() || sending || disabled}
          sx={{
            width: 56,
            height: 56,
            background: sending 
              ? 'rgba(102, 126, 234, 0.6)' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: sending 
              ? '0 2px 8px rgba(102, 126, 234, 0.3)' 
              : '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
            animation: sending ? `${spin} 1s linear infinite` : 'none',
            '&:hover': {
              background: sending 
                ? 'rgba(102, 126, 234, 0.6)' 
                : 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              boxShadow: sending 
                ? '0 2px 8px rgba(102, 126, 234, 0.3)' 
                : '0 6px 20px rgba(102, 126, 234, 0.6)',
              transform: sending ? 'none' : 'translateY(-2px) scale(1.05)'
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'none',
              cursor: 'not-allowed'
            }
          }}
        >
          <SendIcon sx={{ 
            fontSize: 24,
            transform: sending ? 'rotate(360deg)' : 'none',
            transition: 'transform 0.3s ease'
          }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ChatInput;