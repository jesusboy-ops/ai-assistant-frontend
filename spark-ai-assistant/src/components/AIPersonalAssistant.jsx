// AI Personal Assistant Component - Natural language command interface
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Collapse,
  Avatar,
  Divider,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import LoadingSpinner from './LoadingSpinner';
import {
  Send as SendIcon,
  Mic as MicIcon,
  SmartToy as AIIcon,
  Task as TaskIcon,
  Event as EventIcon,
  Note as NoteIcon,
  NotificationsActive as ReminderIcon,
  TrendingUp as InsightsIcon,
  Lightbulb as SuggestionIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { naturalLanguageService } from '../services/naturalLanguageService';
import { aiProductivityService } from '../services/aiProductivityService';
import { analyticsService } from '../services/analyticsService';
import { createTask } from '../store/slices/tasksSlice';
import { createNote } from '../store/slices/notesSlice';
import { createReminder } from '../store/slices/remindersSlice';
import { showToast } from '../utils/toast';

const AIPersonalAssistant = ({ 
  isOpen = true, 
  onClose,
  initialMessage = null 
}) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  
  // Redux state
  const { tasks } = useSelector(state => state.tasks);
  const { notes } = useSelector(state => state.notes);
  const { reminders } = useSelector(state => state.reminders);
  const { events } = useSelector(state => state.calendar);

  // Component state
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [dailyAgenda, setDailyAgenda] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Voice recognition
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
        showToast.error('Voice recognition failed');
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }

    // Load initial suggestions and agenda
    loadInitialData();

    // Process initial message if provided
    if (initialMessage) {
      handleCommand(initialMessage);
    }
  }, []);

  // Load initial data and suggestions
  const loadInitialData = async () => {
    try {
      // Generate daily agenda
      const agenda = aiProductivityService.generateDailyAgenda(tasks, events, notes);
      setDailyAgenda(agenda);

      // Generate contextual suggestions
      const contextualSuggestions = await generateContextualSuggestions();
      setSuggestions(contextualSuggestions);

      // Add welcome message
      addMessage('assistant', 'Hello! I\'m your AI assistant. I can help you manage tasks, schedule events, create notes, and provide productivity insights. What would you like to do?', 'greeting');

    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  // Handle user input
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    await handleCommand(input.trim());
    setInput('');
  };

  // Process natural language command
  const handleCommand = async (command) => {
    setIsProcessing(true);
    addMessage('user', command);

    try {
      // Process command with natural language service
      const result = await naturalLanguageService.processCommand(command, {
        tasks,
        notes,
        reminders,
        events
      });

      if (result.success) {
        await executeCommand(result);
      } else {
        addMessage('assistant', result.message, 'error', {
          suggestions: result.suggestions
        });
      }

    } catch (error) {
      console.error('Command processing failed:', error);
      addMessage('assistant', 'Sorry, I encountered an error processing your request. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Execute parsed command
  const executeCommand = async (commandResult) => {
    const { action, data, message } = commandResult;

    try {
      switch (action) {
        case 'createTask':
          await handleCreateTask(data, message);
          break;
        
        case 'createNote':
          await handleCreateNote(data, message);
          break;
        
        case 'createReminder':
          await handleCreateReminder(data, message);
          break;
        
        case 'createEvent':
          await handleCreateEvent(data, message);
          break;
        
        case 'completeTask':
          await handleCompleteTask(data, message);
          break;
        
        case 'checkSchedule':
          await handleCheckSchedule(data, message);
          break;
        
        case 'showProductivity':
          await handleShowProductivity(data, message);
          break;
        
        case 'showSuggestions':
          await handleShowSuggestions(data, message);
          break;
        
        case 'selectTask':
          await handleTaskSelection(data, message);
          break;
        
        default:
          addMessage('assistant', message || 'Command executed successfully', 'success');
      }

      // Update suggestions after command execution
      const newSuggestions = await generateContextualSuggestions();
      setSuggestions(newSuggestions);

    } catch (error) {
      console.error('Command execution failed:', error);
      addMessage('assistant', 'Failed to execute command. Please try again.', 'error');
    }
  };

  // Command handlers
  const handleCreateTask = async (taskData, message) => {
    try {
      const result = await dispatch(createTask(taskData)).unwrap();
      addMessage('assistant', message, 'success', {
        createdItem: { type: 'task', data: result }
      });
    } catch (error) {
      addMessage('assistant', 'Failed to create task. Please try again.', 'error');
    }
  };

  const handleCreateNote = async (noteData, message) => {
    try {
      const result = await dispatch(createNote(noteData)).unwrap();
      addMessage('assistant', message, 'success', {
        createdItem: { type: 'note', data: result }
      });
    } catch (error) {
      addMessage('assistant', 'Failed to create note. Please try again.', 'error');
    }
  };

  const handleCreateReminder = async (reminderData, message) => {
    try {
      const result = await dispatch(createReminder(reminderData)).unwrap();
      addMessage('assistant', message, 'success', {
        createdItem: { type: 'reminder', data: result }
      });
    } catch (error) {
      addMessage('assistant', 'Failed to create reminder. Please try again.', 'error');
    }
  };

  const handleCreateEvent = async (eventData, message) => {
    // This would integrate with calendar service
    addMessage('assistant', message, 'success', {
      createdItem: { type: 'event', data: eventData }
    });
  };

  const handleCompleteTask = async (data, message) => {
    // This would update task completion status
    addMessage('assistant', message, 'success');
  };

  const handleCheckSchedule = async (data, message) => {
    const { date } = data;
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });

    const dayTasks = tasks.filter(task => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === date.toDateString();
      }
      return false;
    });

    addMessage('assistant', message, 'info', {
      schedule: {
        date: date,
        events: dayEvents,
        tasks: dayTasks
      }
    });
  };

  const handleShowProductivity = async (data, message) => {
    const { period } = data;
    const insights = analyticsService.generateProductivityInsights(
      tasks, events, notes, period
    );

    addMessage('assistant', message, 'info', {
      productivity: insights
    });
  };

  const handleShowSuggestions = async (data, message) => {
    const { suggestions } = data;
    addMessage('assistant', message, 'info', {
      suggestions: suggestions
    });
  };

  const handleTaskSelection = async (data, message) => {
    const { tasks: taskOptions } = data;
    addMessage('assistant', message, 'info', {
      taskSelection: taskOptions
    });
  };

  // Voice input
  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  // Add message to conversation
  const addMessage = (sender, content, type = 'info', metadata = {}) => {
    const message = {
      id: Date.now() + Math.random(),
      sender,
      content,
      type,
      metadata,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, message]);
  };

  // Generate contextual suggestions
  const generateContextualSuggestions = async () => {
    const suggestions = [];
    const now = new Date();
    const currentHour = now.getHours();

    // Time-based suggestions
    if (currentHour >= 9 && currentHour <= 11) {
      suggestions.push({
        text: 'Plan your day',
        command: 'show my agenda for today',
        icon: <EventIcon />,
        priority: 'high'
      });
    }

    if (currentHour >= 17 && currentHour <= 19) {
      suggestions.push({
        text: 'Review today\'s progress',
        command: 'show my productivity stats',
        icon: <InsightsIcon />,
        priority: 'medium'
      });
    }

    // Task-based suggestions
    const overdueTasks = tasks.filter(task => 
      !task.completed && task.dueDate && new Date(task.dueDate) < now
    );

    if (overdueTasks.length > 0) {
      suggestions.push({
        text: `You have ${overdueTasks.length} overdue tasks`,
        command: 'show overdue tasks',
        icon: <TaskIcon />,
        priority: 'urgent'
      });
    }

    // Meeting preparation suggestions
    const upcomingMeetings = events.filter(event => {
      const eventStart = new Date(event.start);
      const timeDiff = eventStart - now;
      return timeDiff > 0 && timeDiff < 60 * 60 * 1000; // Within 1 hour
    });

    if (upcomingMeetings.length > 0) {
      suggestions.push({
        text: 'Prepare for upcoming meeting',
        command: `create note for ${upcomingMeetings[0].title}`,
        icon: <NoteIcon />,
        priority: 'high'
      });
    }

    return suggestions.slice(0, 4); // Limit to 4 suggestions
  };

  // Toggle expanded items
  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Render message content based on type and metadata
  const renderMessageContent = (message) => {
    const { content, type, metadata } = message;

    return (
      <Box>
        <Typography variant="body1" sx={{ mb: metadata ? 1 : 0 }}>
          {content}
        </Typography>

        {/* Render created item */}
        {metadata.createdItem && (
          <Card sx={{ mt: 1, backgroundColor: 'rgba(6, 182, 212, 0.1)' }}>
            <CardContent sx={{ py: 1 }}>
              <Typography variant="subtitle2" color="primary">
                Created {metadata.createdItem.type}: {metadata.createdItem.data.title}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Render schedule */}
        {metadata.schedule && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Schedule for {metadata.schedule.date.toLocaleDateString()}:
            </Typography>
            {metadata.schedule.events.length === 0 && metadata.schedule.tasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No events or tasks scheduled
              </Typography>
            ) : (
              <List dense>
                {metadata.schedule.events.map(event => (
                  <ListItem key={event.id}>
                    <ListItemIcon><EventIcon fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary={event.title}
                      secondary={new Date(event.start).toLocaleTimeString()}
                    />
                  </ListItem>
                ))}
                {metadata.schedule.tasks.map(task => (
                  <ListItem key={task.id}>
                    <ListItemIcon><TaskIcon fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary={task.title}
                      secondary={`Due: ${new Date(task.dueDate).toLocaleTimeString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}

        {/* Render productivity insights */}
        {metadata.productivity && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Productivity Overview:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={`${metadata.productivity.overview.completionRate}% completion rate`}
                color="primary"
                size="small"
              />
              <Chip 
                label={`${metadata.productivity.overview.completedTasks} tasks completed`}
                color="primary"
                size="small"
              />
              <Chip 
                label={`Score: ${metadata.productivity.overview.productivityScore}`}
                color="primary"
                size="small"
              />
            </Box>
          </Box>
        )}

        {/* Render task selection */}
        {metadata.taskSelection && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Which task did you mean?
            </Typography>
            <List dense>
              {metadata.taskSelection.map((task, index) => (
                <ListItem 
                  key={task.id}
                  button
                  onClick={() => handleCommand(`complete task ${index + 1}`)}
                >
                  <ListItemText 
                    primary={`${index + 1}. ${task.title}`}
                    secondary={task.description}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Render suggestions */}
        {metadata.suggestions && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Try these commands:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {metadata.suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  onClick={() => handleCommand(suggestion)}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {suggestion}
                </Button>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  // Get message icon based on sender and type
  const getMessageIcon = (message) => {
    if (message.sender === 'user') {
      return <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>U</Avatar>;
    }

    const iconProps = { sx: { width: 32, height: 32 } };
    
    switch (message.type) {
      case 'success':
        return <Avatar sx={{ ...iconProps.sx, bgcolor: 'success.main' }}><SuccessIcon /></Avatar>;
      case 'error':
        return <Avatar sx={{ ...iconProps.sx, bgcolor: 'error.main' }}><ErrorIcon /></Avatar>;
      case 'greeting':
        return <Avatar sx={{ ...iconProps.sx, bgcolor: 'info.main' }}><AIIcon /></Avatar>;
      default:
        return <Avatar sx={{ ...iconProps.sx, bgcolor: 'secondary.main' }}><InfoIcon /></Avatar>;
    }
  };

  if (!isOpen) return null;

  return (
    <Paper 
      elevation={8}
      sx={{ 
        width: 400,
        height: 600,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1300,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AIIcon color="primary" />
          AI Assistant
        </Typography>
      </Box>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SuggestionIcon fontSize="small" />
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion.text}
                size="small"
                onClick={() => handleCommand(suggestion.command)}
                sx={{ cursor: 'pointer' }}
                color={suggestion.priority === 'urgent' ? 'error' : 
                       suggestion.priority === 'high' ? 'warning' : 'default'}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Conversation */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
        <List>
          {conversation.map((message) => (
            <ListItem key={message.id} alignItems="flex-start">
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getMessageIcon(message)}
              </ListItemIcon>
              <ListItemText
                primary={renderMessageContent(message)}
                secondary={message.timestamp.toLocaleTimeString()}
              />
            </ListItem>
          ))}
          {isProcessing && (
            <ListItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LoadingSpinner size={24} type="modern" />
              </ListItemIcon>
              <ListItemText primary="Processing..." />
            </ListItem>
          )}
        </List>
      </Box>

      {/* Input */}
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            ref={inputRef}
            fullWidth
            size="small"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }
              }
            }}
          />
          
          {recognition && (
            <Tooltip title={isListening ? 'Listening...' : 'Voice input'}>
              <IconButton 
                onClick={startListening}
                disabled={isProcessing || isListening}
                color={isListening ? 'error' : 'default'}
              >
                <MicIcon />
              </IconButton>
            </Tooltip>
          )}
          
          <IconButton 
            type="submit" 
            disabled={!input.trim() || isProcessing}
            color="primary"
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default AIPersonalAssistant;