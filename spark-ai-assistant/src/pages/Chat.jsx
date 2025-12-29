import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  IconButton
} from '@mui/material';
import {
  AutoAwesome as SparkIcon,
  MoreHoriz as MoreIcon
} from '@mui/icons-material';
import { useChat } from '../hooks/useChat';
import MessageBubble from '../components/chat/MessageBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import ChatInput from '../components/chat/ChatInput';
import ConversationList from '../components/chat/ConversationList';
import WelcomeMessage from '../components/chat/WelcomeMessage';

const ChatNew = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    conversations,
    activeConversation,
    messages,
    loading,
    sending,
    loadConversations,
    loadConversation,
    sendMessage,
    createConversation,
    deleteConversation
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Ensure arrays are safe
  const safeConversations = Array.isArray(conversations) ? conversations : [];
  const safeMessages = Array.isArray(messages) ? messages : [];

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [safeMessages]);

  useEffect(() => {
    // Simulate typing indicator when sending
    if (sending) {
      setIsTyping(true);
    } else {
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [sending]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || sending) return;

    const message = messageInput;
    setMessageInput('');

    try {
      // Create conversation if none exists
      if (!activeConversation) {
        await createConversation('New Conversation');
      }

      await sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleStartChatWithPrompt = async (prompt) => {
    setMessageInput(prompt);
    // Auto-send after a brief delay to show the typing
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationClick = (convId) => {
    loadConversation(convId);
  };

  const handleNewChat = async () => {
    const newConv = await createConversation('New Conversation');
    await loadConversation(newConv.id);
  };

  const handleDeleteConversation = (convId) => {
    setConversationToDelete(convId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (conversationToDelete) {
      await deleteConversation(conversationToDelete);
    }
    setDeleteDialogOpen(false);
    setConversationToDelete(null);
  };

  return (
    <Box 
      sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 0, md: 2 },
        p: { xs: 0, sm: 1, md: 2 },
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Conversations Sidebar */}
      <Box 
        sx={{ 
          width: { xs: '100%', md: '320px' },
          height: { xs: '35%', md: '100%' },
          display: { xs: isMobile && activeConversation ? 'none' : 'block', md: 'block' },
          mb: { xs: 1, md: 0 },
          flexShrink: 0
        }}
      >
        <ConversationList
          conversations={safeConversations}
          activeConversation={activeConversation}
          loading={loading}
          onConversationClick={handleConversationClick}
          onNewChat={handleNewChat}
          onDeleteConversation={handleDeleteConversation}
        />
      </Box>

      {/* Chat Area - ChatGPT Style */}
      <Box 
        sx={{ 
          flex: 1,
          height: { xs: activeConversation ? '65%' : '100%', md: '100%' },
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          maxWidth: { xs: '100%', md: '100%', lg: '900px' },
          mx: { lg: 'auto' }
        }}
      >
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: { 
              xs: 'transparent', 
              md: 'rgba(26, 32, 46, 0.4)' 
            },
            backdropFilter: { xs: 'none', md: 'blur(20px)' },
            border: { xs: 'none', md: '1px solid rgba(255, 255, 255, 0.1)' },
            borderRadius: { xs: 0, md: 3 },
            boxShadow: { xs: 'none', md: '0 8px 32px rgba(0, 0, 0, 0.3)' },
            overflow: 'hidden'
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(26, 32, 46, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                  }}
              >
                <SparkIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  {activeConversation?.title || 'Spark AI'}
                </Typography>
                
                {activeConversation && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.75rem'
                    }}
                  >
                    Online
                  </Typography>
                )}
              </Box>
            </Box>

            <IconButton
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <MoreIcon />
            </IconButton>
          </Box>

          {/* Messages Area - ChatGPT Style */}
          <Box 
            sx={{ 
              flex: 1,
              overflowY: 'auto',
              p: { xs: 1, sm: 2, md: 3 },
              // ChatGPT-style wide container
              maxWidth: { xs: '100%', sm: '100%', md: '800px', lg: '900px' },
              mx: 'auto',
              width: '100%',
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '3px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(102, 126, 234, 0.5)',
                borderRadius: '3px',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.7)'
                }
              }
            }}
          >
            {!activeConversation ? (
              <WelcomeMessage onStartChat={handleStartChatWithPrompt} />
            ) : safeMessages.length === 0 ? (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <Fade in timeout={600}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 2,
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      Start the conversation
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.6)'
                      }}
                    >
                      Type a message below to begin chatting with Spark AI
                    </Typography>
                  </Box>
                </Fade>
              </Box>
            ) : (
              <Box>
                {safeMessages.map((msg, index) => (
                  <MessageBubble
                    key={msg.id || index}
                    message={msg.content}
                    isUser={msg.role === 'user'}
                    timestamp={msg.timestamp}
                    isNew={index === safeMessages.length - 1}
                  />
                ))}
                
                {isTyping && <TypingIndicator />}
                
                <div ref={messagesEndRef} />
              </Box>
            )}
          </Box>

          {/* Chat Input */}
          <ChatInput
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            disabled={loading}
            sending={sending}
            placeholder={
              isMobile 
                ? "Message Spark AI..." 
                : "Type your message to Spark AI..."
            }
          />
        </Card>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        slotProps={{
          paper: {
            sx: {
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: 3
            }
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          Delete Conversation?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to delete this conversation? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatNew;