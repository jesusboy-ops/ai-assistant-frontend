import { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Tooltip,
  Fade,
  keyframes,
  Avatar,
  useTheme
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  VolumeUp as SpeakIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon
} from '@mui/icons-material';
import { formatSmartDate } from '../../utils/formatDate';
import StudyActions from '../study/StudyActions';
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
  const theme = useTheme();

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
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 4,
        animation: isNew ? `${slideIn} 0.4s ease-out` : 'none'
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Box
        sx={{
          maxWidth: { xs: '75%', sm: '70%', md: '65%' },
          display: 'flex',
          gap: 2,
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start'
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            backgroundColor: isUser 
              ? theme.palette.primary.main
              : theme.palette.secondary.main,
            width: 32,
            height: 32,
            fontSize: '14px',
            fontWeight: 600,
            flexShrink: 0,
            border: `2px solid ${theme.palette.divider}`
          }}
        >
          {isUser ? 'U' : 'AI'}
        </Avatar>

        {/* Message Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              position: 'relative',
              padding: { xs: '8px 12px', sm: '12px 16px' },
              borderRadius: { xs: '12px', sm: '16px' },
              background: isUser 
                ? theme.palette.primary.main
                : theme.palette.background.paper,
              border: isUser 
                ? 'none'
                : `1px solid ${theme.palette.divider}`,
              color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              fontSize: { xs: '14px', sm: '16px' },
              lineHeight: 1.5
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'inherit',
                lineHeight: 'inherit',
                fontSize: 'inherit',
                whiteSpace: 'pre-wrap',
                fontWeight: 400,
                margin: 0
              }}
            >
              {message}
            </Typography>

            {/* Action Buttons for AI messages */}
            {!isUser && showActions && (
              <Fade in timeout={200}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: 8,
                    display: 'flex',
                    gap: 0.5,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    padding: '4px',
                    border: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Tooltip title="Copy message">
                    <IconButton size="small" onClick={handleCopy}>
                      <CopyIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Read aloud">
                    <IconButton size="small" onClick={handleSpeak}>
                      <SpeakIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Good response">
                    <IconButton 
                      size="small" 
                      onClick={() => handleLike(true)}
                      sx={{ color: liked === true ? theme.palette.success.main : theme.palette.text.secondary }}
                    >
                      <ThumbUpIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Bad response">
                    <IconButton 
                      size="small" 
                      onClick={() => handleLike(false)}
                      sx={{ color: liked === false ? theme.palette.error.main : theme.palette.text.secondary }}
                    >
                      <ThumbDownIcon sx={{ fontSize: 14 }} />
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
              color: theme.palette.text.disabled,
              textAlign: isUser ? 'right' : 'left',
              fontSize: '12px'
            }}
          >
            {formatSmartDate(timestamp)}
          </Typography>

          {/* Study Actions for AI messages - Always visible in study mode */}
          {!isUser && (
            <StudyActions messageContent={message} isVisible={true} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MessageBubble;