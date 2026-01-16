import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Skeleton,
  Fade,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Chat as ChatIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { formatSmartDate } from '../../utils/formatDate';

const ConversationList = ({
  conversations = [],
  activeConversation,
  loading = false,
  onConversationClick,
  onNewChat,
  onDeleteConversation,
  onRenameConversation
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const theme = useTheme();

  const handleMenuOpen = (event, convId) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedConvId(convId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedConvId(null);
  };

  const handleDelete = () => {
    if (selectedConvId && onDeleteConversation) {
      onDeleteConversation(selectedConvId);
    }
    handleMenuClose();
  };

  const handleRename = () => {
    if (selectedConvId && onRenameConversation) {
      onRenameConversation(selectedConvId);
    }
    handleMenuClose();
  };

  const getConversationPreview = (conv) => {
    if (conv.lastMessage) {
      return conv.lastMessage.length > 40 
        ? conv.lastMessage.substring(0, 40) + '...'
        : conv.lastMessage;
    }
    return 'No messages yet';
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewChat}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            py: 1.5,
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              transform: 'translateY(-1px)'
            }
          }}
        >
          New chat
        </Button>
      </Box>

      {/* Conversations List */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <List sx={{ p: 1, height: '100%', overflowY: 'auto' }}>
          {loading && conversations.length === 0 ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <ListItem key={i} sx={{ px: 1, py: 0.5 }}>
                <Box sx={{ width: '100%' }}>
                  <Skeleton 
                    variant="text" 
                    width="80%" 
                    height={20}
                    sx={{ mb: 0.5, bgcolor: theme.palette.action?.disabled }}
                  />
                  <Skeleton 
                    variant="text" 
                    width="60%" 
                    height={16}
                    sx={{ bgcolor: theme.palette.action?.disabled }}
                  />
                </Box>
              </ListItem>
            ))
          ) : conversations.length === 0 ? (
            // Empty state
            <Box 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChatIcon sx={{ fontSize: 48, mb: 2, color: theme.palette.text.disabled }} />
              <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                No conversations yet
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                Start a new chat to begin
              </Typography>
            </Box>
          ) : (
            // Conversation items
            conversations.map((conv, index) => (
              <Fade in timeout={300 + index * 50} key={conv.id}>
                <ListItem
                  disablePadding
                  sx={{
                    mb: 0.5,
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <ListItemButton
                    selected={activeConversation?.id === conv.id}
                    onClick={() => onConversationClick(conv.id)}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.action?.selected || theme.palette.primary.main + '20',
                        borderLeft: `3px solid ${theme.palette.primary.main}`,
                        '&:hover': {
                          backgroundColor: theme.palette.action?.hover || theme.palette.primary.main + '30'
                        },
                        '& .MuiTypography-root': {
                          color: theme.palette.text.primary
                        }
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.action?.hover,
                        transform: 'translateX(2px)'
                      }
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                      {/* Conversation Title */}
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: activeConversation?.id === conv.id ? 600 : 500,
                          color: activeConversation?.id === conv.id ? theme.palette.text.primary : theme.palette.text.secondary,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '14px',
                          mb: 0.5
                        }}
                      >
                        {conv.title || 'New Conversation'}
                      </Typography>

                      {/* Last Message Preview */}
                      <Typography
                        variant="caption"
                        sx={{
                          color: activeConversation?.id === conv.id ? theme.palette.text.secondary : theme.palette.text.disabled,
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '12px'
                        }}
                      >
                        {getConversationPreview(conv)}
                      </Typography>
                    </Box>

                    {/* Menu Button */}
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, conv.id)}
                      sx={{
                        opacity: 0.7,
                        color: activeConversation?.id === conv.id ? theme.palette.text.primary : theme.palette.text.secondary,
                        '&:hover': {
                          opacity: 1,
                          backgroundColor: theme.palette.action?.hover
                        }
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              </Fade>
            ))
          )}
        </List>
      </Box>

      {/* Context Menu */}
      <Menu 
        anchorEl={menuAnchor} 
        open={Boolean(menuAnchor)} 
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            minWidth: 160
          }
        }}
      >
        <MenuItem 
          onClick={handleRename}
          sx={{ 
            color: theme.palette.text.primary,
            fontSize: '14px',
            '&:hover': { backgroundColor: theme.palette.action?.hover }
          }}
        >
          <EditIcon sx={{ mr: 1, fontSize: 16 }} />
          Rename
        </MenuItem>
        
        <MenuItem 
          onClick={handleDelete}
          sx={{ 
            color: theme.palette.error.main,
            fontSize: '14px',
            '&:hover': { backgroundColor: theme.palette.error.main + '20' }
          }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 16 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ConversationList;