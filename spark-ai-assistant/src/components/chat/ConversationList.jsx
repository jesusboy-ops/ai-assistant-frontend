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
  Chip,
  Fade,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Chat as ChatIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Archive as ArchiveIcon
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
      return conv.lastMessage.length > 50 
        ? conv.lastMessage.substring(0, 50) + '...'
        : conv.lastMessage;
    }
    return 'No messages yet';
  };

  const getMessageCount = (conv) => {
    return conv.messageCount || 0;
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 3, 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(90deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <ChatIcon />
          Conversations
        </Typography>
        
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewChat}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 1.25,
            fontWeight: 600,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          New Chat
        </Button>
      </Box>

      {/* Conversations List */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <List sx={{ p: 0, height: '100%', overflowY: 'auto' }}>
          {loading && conversations.length === 0 ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <ListItem key={i} sx={{ px: 2, py: 1.5 }}>
                <Box sx={{ width: '100%' }}>
                  <Skeleton 
                    variant="text" 
                    width="80%" 
                    height={24}
                    sx={{ mb: 0.5, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                  />
                  <Skeleton 
                    variant="text" 
                    width="60%" 
                    height={16}
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
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
                color: 'text.secondary',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChatIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" sx={{ mb: 1, opacity: 0.7 }}>
                No conversations yet
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.5 }}>
                Start a new chat to begin
              </Typography>
            </Box>
          ) : (
            // Conversation items
            conversations.map((conv, index) => (
              <Fade in timeout={300 + index * 100} key={conv.id}>
                <ListItem
                  disablePadding
                  sx={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    '&:last-child': { borderBottom: 'none' }
                  }}
                >
                  <ListItemButton
                    selected={activeConversation?.id === conv.id}
                    onClick={() => onConversationClick(conv.id)}
                    sx={{
                      px: 2,
                      py: 2,
                      transition: 'all 0.3s ease',
                      '&.Mui-selected': {
                        background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                        borderLeft: '4px solid #06b6d4',
                        '&:hover': {
                          background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%)'
                        }
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                      {/* Conversation Title */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: activeConversation?.id === conv.id ? 700 : 500,
                            color: activeConversation?.id === conv.id ? 'white' : 'rgba(255, 255, 255, 0.9)',
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {conv.title || 'New Conversation'}
                        </Typography>
                        
                        {conv.isStarred && (
                          <StarIcon 
                            sx={{ 
                              fontSize: 16, 
                              color: '#fbbf24',
                              ml: 1
                            }} 
                          />
                        )}
                      </Box>

                      {/* Last Message Preview */}
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mb: 0.5
                        }}
                      >
                        {getConversationPreview(conv)}
                      </Typography>

                      {/* Metadata */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.7rem'
                          }}
                        >
                          {formatSmartDate(conv.updatedAt)}
                        </Typography>
                        
                        {getMessageCount(conv) > 0 && (
                          <Chip
                            label={getMessageCount(conv)}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.7rem',
                              background: activeConversation?.id === conv.id 
                                ? 'rgba(6, 182, 212, 0.3)'
                                : 'rgba(255, 255, 255, 0.1)',
                              color: 'rgba(255, 255, 255, 0.8)',
                              border: 'none'
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Menu Button */}
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, conv.id)}
                      sx={{
                        opacity: 0.7,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          opacity: 1,
                          background: 'rgba(255, 255, 255, 0.1)'
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
            background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: 2
            }
        }}
      >
        <MenuItem 
          onClick={handleRename}
          sx={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            '&:hover': { background: 'rgba(102, 126, 234, 0.2)' }
          }}
        >
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Rename
        </MenuItem>
        
        <MenuItem 
          onClick={handleMenuClose}
          sx={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            '&:hover': { background: 'rgba(102, 126, 234, 0.2)' }
          }}
        >
          <StarIcon sx={{ mr: 1, fontSize: 18 }} />
          Star
        </MenuItem>
        
        <MenuItem 
          onClick={handleMenuClose}
          sx={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            '&:hover': { background: 'rgba(102, 126, 234, 0.2)' }
          }}
        >
          <ArchiveIcon sx={{ mr: 1, fontSize: 18 }} />
          Archive
        </MenuItem>
        
        <MenuItem 
          onClick={handleDelete}
          sx={{ 
            color: '#f87171',
            '&:hover': { background: 'rgba(248, 113, 113, 0.2)' }
          }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ConversationList;