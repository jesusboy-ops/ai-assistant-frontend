import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Drawer
} from '@mui/material';
import {
  Menu as MenuIcon,
  AutoAwesome as SparkIcon
} from '@mui/icons-material';
import { useChat } from '../hooks/useChat';
import MessageBubble from '../components/chat/MessageBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import ChatInput from '../components/chat/ChatInput';
import ConversationList from '../components/chat/ConversationList';
import WelcomeMessage from '../components/chat/WelcomeMessage';
import StudyModeToggle from '../components/study/StudyModeToggle';

const Chat = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // More granular breakpoint control for better responsiveness
  const isTablet = useMediaQuery('(max-width: 1100px)'); // Hide sidebar below 1100px
  const isSmallDesktop = useMediaQuery('(max-width: 1350px)'); // Adjust layout for smaller desktops
  
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      // Only hide typing indicator if we're not sending
      if (!sending) {
        const timer = setTimeout(() => setIsTyping(false), 500);
        return () => clearTimeout(timer);
      }
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
    if (isTablet) setSidebarOpen(false);
  };

  const handleNewChat = async () => {
    const newConv = await createConversation('New Conversation');
    await loadConversation(newConv.id);
    if (isTablet) setSidebarOpen(false);
  };

  const handleDeleteConversation = (convId) => {
    deleteConversation(convId);
  };

  // Sidebar component
  const SidebarContent = () => (
    <ConversationList
      conversations={safeConversations}
      activeConversation={activeConversation}
      loading={loading}
      onConversationClick={handleConversationClick}
      onNewChat={handleNewChat}
      onDeleteConversation={handleDeleteConversation}
    />
  );

  return (
    <Box 
      sx={{ 
        height: '100vh',
        display: 'flex',
        backgroundColor: theme.palette.background.default,
        overflow: 'hidden'
      }}
    >
      {/* Desktop Sidebar - Only show on screens > 1100px */}
      {!isTablet && (
        <Box 
          sx={{ 
            width: isSmallDesktop ? 260 : 280, // Slightly narrower sidebar on smaller desktops
            height: '100%',
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            flexShrink: 0
          }}
        >
          <SidebarContent />
        </Box>
      )}

      {/* Mobile/Tablet Drawer - Show on screens ≤ 1100px */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          display: isTablet ? 'block' : 'none',
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`
          }
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* Main Chat Area */}
      <Box 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundColor: theme.palette.background.default,
          position: 'relative'
        }}
      >
        {/* Chat Header - Mobile optimized */}
        <Box
          sx={{
            height: { xs: 56, sm: 64 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 1, sm: 2, md: 3 },
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            flexShrink: 0,
            zIndex: 10
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flex: 1, minWidth: 0 }}>
            {/* Mobile/Tablet menu button - Show on screens ≤ 1100px */}
            {isTablet && (
              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{ 
                  mr: { xs: 0.5, sm: 1 }, 
                  color: theme.palette.text.secondary,
                  p: { xs: 1, sm: 1.5 }
                }}
              >
                <MenuIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </IconButton>
            )}

            <Box
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <SparkIcon sx={{ 
                color: theme.palette.primary.contrastText, 
                fontSize: { xs: 16, sm: 18 } 
              }} />
            </Box>
            
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.125rem' },
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                Spark AI
              </Typography>
              {!isMobile && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  How can I help you today?
                </Typography>
              )}
            </Box>
          </Box>

          {/* Study Mode Toggle - Responsive */}
          <Box sx={{ flexShrink: 0 }}>
            <StudyModeToggle />
          </Box>
        </Box>

        {/* Messages Area - Scrollable with space for fixed input */}
        <Box 
          sx={{ 
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            pb: { xs: '100px', sm: '110px', md: '120px' }, // Space for fixed input
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              background: theme.palette.action?.hover || 'rgba(255, 255, 255, 0.1)'
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.text.disabled,
              borderRadius: '3px',
              '&:hover': {
                background: theme.palette.text.secondary
              }
            }
          }}
        >
          {!activeConversation ? (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WelcomeMessage onStartChat={handleStartChatWithPrompt} />
            </Box>
          ) : safeMessages.length === 0 ? (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4
              }}
            >
              <Fade in timeout={600}>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      color: theme.palette.text.primary,
                      fontWeight: 500
                    }}
                  >
                    How can I help you today?
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.secondary
                    }}
                  >
                    Type a message below to start our conversation
                  </Typography>
                </Box>
              </Fade>
            </Box>
          ) : (
            <Box sx={{ 
              maxWidth: { 
                xs: '100%', 
                sm: '768px', 
                md: isTablet ? '900px' : (isSmallDesktop ? '700px' : '800px') // Responsive max width
              },
              mx: 'auto',
              width: '100%',
              px: { xs: 2, sm: 3, md: isTablet ? 4 : 3 },
              py: 3
            }}>
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

        {/* Fixed Chat Input - Centered within the chat container */}
        <Box sx={{ 
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: { 
            xs: 'calc(100% - 40px)', 
            sm: 'min(600px, calc(100% - 60px))', 
            md: 'min(700px, calc(100% - 80px))',
            lg: 'min(750px, calc(100% - 100px))'
          },
          maxWidth: 'calc(100% - 40px)',
          zIndex: 1000
        }}>
          <ChatInput
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            disabled={loading}
            sending={sending}
            placeholder="Type a message..."
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;