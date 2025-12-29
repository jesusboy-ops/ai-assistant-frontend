import { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Tooltip,
  Fade,
  keyframes,
  Avatar
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  VolumeUp as SpeakIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon
} from '@mui/icons-material';
import { formatSmartDate } from '../../utils/formatDate';
import toast from '../../utils/toast';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const MessageBubble = ({ message, isUser, timestamp, isNew = false }) => {
  const [showActions, setShowActions] = useState(false);
  const [liked, setLiked] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    toast.success('Message copied!');
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Speech synthesis not supported');
    }
  };

  const handleLike = (isLike) => {
    setLiked(isLike);
    toast.success(isLike ? 'Feedback: Helpful' : 'Feedback: Not helpful');
  };

  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          mb: 3,
          animation: isNew ? `${slideIn} 0.4s ease-out` : 'none'
        }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <Box
          sx={{
            maxWidth: { xs: '85%', sm: '80%', md: '70%' },
            display: 'flex',
            gap: 1.5,
            flexDirection: isUser ? 'row-reverse' : 'row',
            alignItems: 'flex-start'
          }}
        >
          {/* Avatar */}
          <Avatar
            sx={{
              background: isUser 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              width: 40,
              height: 40,
              boxShadow: isUser
                ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                : '0 4px 15px rgba(6, 182, 212, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              fontWeight: 700,
              fontSize: '0.9rem',
              flexShrink: 0,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: isUser
                  ? '0 6px 20px rgba(102, 126, 234, 0.6)'
                  : '0 6px 20px rgba(6, 182, 212, 0.6)'
              }
            }}
          >
            {isUser ? 'U' : 'AI'}
          </Avatar>

          {/* Message Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                position: 'relative',
                padding: 2.5,
                borderRadius: 3,
                background: isUser
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
                border: isUser 
                  ? 'none'
                  : '1px solid rgba(6, 182, 212, 0.3)',
                boxShadow: isUser
                  ? '0 8px 25px rgba(102, 126, 234, 0.3)'
                  : '0 8px 25px rgba(6, 182, 212, 0.15)',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isUser
                    ? '0 12px 35px rgba(102, 126, 234, 0.4)'
                    : '0 12px 35px rgba(6, 182, 212, 0.25)'
                },
                // Message tail
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 15,
                  [isUser ? 'right' : 'left']: -8,
                  width: 0,
                  height: 0,
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  [isUser ? 'borderLeft' : 'borderRight']: isUser 
                    ? '8px solid #667eea'
                    : '8px solid rgba(6, 182, 212, 0.3)'
                }
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  color: isUser ? 'white' : 'rgba(255, 255, 255, 0.95)',
                  lineHeight: 1.6,
                  fontSize: '1rem',
                  whiteSpace: 'pre-wrap',
                  fontWeight: 400
                }}
              >
                {message}
              </Typography>

              {/* Action Buttons */}
              {!isUser && (
                <Fade in={showActions} timeout={200}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -15,
                      right: 10,
                      display: 'flex',
                      gap: 0.5,
                      background: 'rgba(15, 15, 35, 0.9)',
                      borderRadius: 2,
                      padding: 0.5,
                      border: '1px solid rgba(6, 182, 212, 0.3)'
                      }}
                  >
                    <Tooltip title="Copy message">
                      <IconButton size="small" onClick={handleCopy}>
                        <CopyIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Read aloud">
                      <IconButton size="small" onClick={handleSpeak}>
                        <SpeakIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Helpful">
                      <IconButton 
                        size="small" 
                        onClick={() => handleLike(true)}
                        sx={{ color: liked === true ? '#4ade80' : 'rgba(255, 255, 255, 0.7)' }}
                      >
                        <ThumbUpIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Not helpful">
                      <IconButton 
                        size="small" 
                        onClick={() => handleLike(false)}
                        sx={{ color: liked === false ? '#f87171' : 'rgba(255, 255, 255, 0.7)' }}
                      >
                        <ThumbDownIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Fade>
              )}
            </Box>

            {/* Timestamp */}
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 1,
                color: 'rgba(255, 255, 255, 0.5)',
                textAlign: isUser ? 'right' : 'left',
                fontSize: '0.75rem',
                fontWeight: 400
              }}
            >
              {formatSmartDate(timestamp)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default MessageBubble;