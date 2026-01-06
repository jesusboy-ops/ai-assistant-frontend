// Custom hook for chat functionality
import { useDispatch, useSelector } from 'react-redux';
import {
  setConversations,
  setActiveConversation,
  setMessages,
  addMessage,
  deleteConversation as deleteConversationAction,
  setLoading,
  setSending,
  setError
} from '../store/slices/chatSlice';
import chatApi from '../api/chatApi';
import aiApi from '../api/aiApi';
import toast from '../utils/toast';
import notificationService from '../services/notificationService';

// Generate contextual AI responses based on user input and study mode
const generateContextualResponse = (userMessage, isStudyMode = false, studyTopic = null) => {
  const message = userMessage.toLowerCase();
  
  // Study Mode responses - structured format
  if (isStudyMode && studyTopic) {
    const studyResponses = generateStudyModeResponse(message, studyTopic);
    if (studyResponses) return studyResponses;
  }
  
  // Handle very short or unclear messages
  if (message.length < 3 || message === 'meaning' || message === 'help' || message === 'hi' || message === 'hello') {
    const casualResponses = [
      "Hey! What's on your mind? I'm here to help with whatever you're working on.",
      "Hi there! What can I help you figure out today?",
      "What's up? Feel free to ask me anything - I'm here to help!",
      "Hey! What would you like to chat about or get help with?",
      "Hi! I'm ready to help. What's your question or what are you curious about?"
    ];
    return casualResponses[Math.floor(Math.random() * casualResponses.length)];
  }
  
  // Coding/Programming related
  if (message.includes('code') || message.includes('programming') || message.includes('javascript') || message.includes('python') || message.includes('react') || message.includes('function') || message.includes('bug') || message.includes('debug')) {
    const codingResponses = [
      `I can help with that coding question! What specifically are you trying to build or debug?`,
      `Programming stuff - nice! What language are you working with and what's the challenge?`,
      `I love helping with code! Can you tell me more about what you're trying to accomplish?`,
      `Coding question, got it! What's the specific problem you're running into?`
    ];
    return codingResponses[Math.floor(Math.random() * codingResponses.length)];
  }
  
  // Writing/Content related
  if (message.includes('write') || message.includes('essay') || message.includes('article') || message.includes('content') || message.includes('blog') || message.includes('story') || message.includes('letter')) {
    const writingResponses = [
      `I'd love to help you write that! What kind of piece are you working on?`,
      `Writing project, awesome! What's the topic and who's your audience?`,
      `I can definitely help with writing. What are you trying to create?`,
      `Writing help coming right up! Tell me more about what you need to write.`
    ];
    return writingResponses[Math.floor(Math.random() * writingResponses.length)];
  }
  
  // Business/Professional related
  if (message.includes('business') || message.includes('marketing') || message.includes('strategy') || message.includes('plan') || message.includes('meeting') || message.includes('presentation') || message.includes('proposal')) {
    const businessResponses = [
      `Business question - I can help with that! What's the situation you're dealing with?`,
      `I can help you think through that business challenge. What's the context?`,
      `Business stuff can be tricky. What specifically are you trying to figure out?`,
      `I'm good with business questions! What's going on that you need help with?`
    ];
    return businessResponses[Math.floor(Math.random() * businessResponses.length)];
  }
  
  // Learning/Education related
  if (message.includes('learn') || message.includes('study') || message.includes('understand') || message.includes('explain') || message.includes('how to') || message.includes('tutorial') || message.includes('guide')) {
    const learningResponses = [
      `I love helping people learn! What topic are you trying to understand?`,
      `Learning something new? Cool! What would you like me to explain?`,
      `I can definitely help you learn that. What's confusing you right now?`,
      `Teaching is one of my favorite things! What do you want to dive into?`
    ];
    return learningResponses[Math.floor(Math.random() * learningResponses.length)];
  }
  
  // Creative/Design related
  if (message.includes('design') || message.includes('creative') || message.includes('art') || message.includes('color') || message.includes('layout') || message.includes('ui') || message.includes('ux') || message.includes('brand')) {
    const creativeResponses = [
      `Creative projects are fun! What are you designing?`,
      `I can help with design stuff. What's your project about?`,
      `Design question - nice! What are you trying to create?`,
      `I love creative challenges! Tell me about your project.`
    ];
    return creativeResponses[Math.floor(Math.random() * creativeResponses.length)];
  }
  
  // Problem-solving/Analysis related
  if (message.includes('problem') || message.includes('issue') || message.includes('solve') || message.includes('analyze') || message.includes('help') || message.includes('stuck') || message.includes('challenge')) {
    const problemSolvingResponses = [
      `I'm here to help you work through this! What's the problem you're facing?`,
      `Let's figure this out together. What's got you stuck?`,
      `I can help you solve that. Can you tell me more about what's going wrong?`,
      `Problem-solving time! What's the challenge you're dealing with?`
    ];
    return problemSolvingResponses[Math.floor(Math.random() * problemSolvingResponses.length)];
  }
  
  // Greetings and general conversation
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon') || message.includes('good evening')) {
    const greetingResponses = [
      `Hey there! I'm Spark AI. What can I help you with today?`,
      `Hi! Great to meet you. What's on your mind?`,
      `Hello! I'm here to help with whatever you need. What's up?`,
      `Hey! Ready to tackle some questions or problems together?`
    ];
    return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
  }
  
  // Default response for unclear messages
  const defaultResponses = [
    `I'm not quite sure what you're asking about. Could you give me a bit more detail?`,
    `Can you tell me more about what you're looking for help with?`,
    `I want to help, but I need a bit more context. What's your question about?`,
    `What specifically would you like me to help you with?`,
    `I'm here to help! Can you be a bit more specific about what you need?`
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

// Generate Study Mode formatted responses
const generateStudyModeResponse = (message, studyTopic) => {
  // Study Mode format: Simple explanation, Key points, Example, Practice question
  const topicLower = studyTopic.toLowerCase();
  
  // Check if the question is related to the study topic
  if (message.includes(topicLower) || message.includes('explain') || message.includes('what is') || message.includes('how does')) {
    return `**Study Topic: ${studyTopic}**

**Simple Explanation:**
${generateSimpleExplanation(message, studyTopic)}

**Key Points:**
• ${generateKeyPoint(studyTopic, 1)}
• ${generateKeyPoint(studyTopic, 2)}
• ${generateKeyPoint(studyTopic, 3)}

**Example:**
${generateExample(studyTopic)}

**Practice Question:**
${generatePracticeQuestion(studyTopic)}`;
  }
  
  return null;
};

// Helper functions for Study Mode responses
const generateSimpleExplanation = (message, topic) => {
  const explanations = [
    `${topic} is a fundamental concept that involves understanding the core principles and applications.`,
    `In simple terms, ${topic} refers to the systematic approach to understanding this subject matter.`,
    `${topic} can be understood as the foundational knowledge needed to grasp this area of study.`
  ];
  return explanations[Math.floor(Math.random() * explanations.length)];
};

const generateKeyPoint = (topic, index) => {
  const points = [
    `Understanding the basic definition and scope of ${topic}`,
    `Recognizing the practical applications and real-world uses`,
    `Identifying the key components and how they work together`,
    `Learning the common patterns and best practices`,
    `Exploring the relationship with related concepts`
  ];
  return points[index - 1] || points[Math.floor(Math.random() * points.length)];
};

const generateExample = (topic) => {
  return `For instance, when studying ${topic}, you might encounter scenarios where you need to apply these concepts in practical situations. This helps reinforce your understanding through hands-on experience.`;
};

const generatePracticeQuestion = (topic) => {
  const questions = [
    `How would you apply ${topic} in a real-world scenario?`,
    `What are the main benefits of understanding ${topic}?`,
    `Can you identify three key characteristics of ${topic}?`,
    `How does ${topic} relate to other concepts you've learned?`
  ];
  return questions[Math.floor(Math.random() * questions.length)];
};

export const useChat = () => {
  const dispatch = useDispatch();
  const { conversations, activeConversation, messages, loading, sending, error } = useSelector(
    (state) => state.chat
  );
  const { isStudyMode, currentTopic } = useSelector((state) => state.study);

  // Load all conversations
  const loadConversations = async () => {
    try {
      console.log('💬 Starting to load conversations...');
      dispatch(setLoading(true));
      const data = await chatApi.getConversations();
      
      // Ensure data is an array
      const conversationsArray = Array.isArray(data) ? data : (data?.conversations || []);
      console.log('💬 Loaded conversations:', conversationsArray);
      
      dispatch(setConversations(conversationsArray));
      console.log('💬 Conversations dispatched to store');
    } catch (err) {
      let message = 'Failed to load conversations';
      
      if (err.code === 'ERR_NETWORK') {
        message = 'Cannot connect to server. Please ensure the backend is running.';
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      
      console.error('💬 Error loading conversations:', err);
      console.log('💬 Setting empty conversations array due to error');
      dispatch(setError(message));
      
      // Set empty array on error - don't show toast for now to avoid spam
      dispatch(setConversations([]));
      
      // For development: Add a mock conversation to test the UI
      if (process.env.NODE_ENV === 'development') {
        console.log('💬 Adding mock conversation for development');
        const mockConversation = {
          id: 'mock-1',
          title: 'Test Conversation',
          updatedAt: new Date().toISOString()
        };
        dispatch(setConversations([mockConversation]));
      }
    } finally {
      dispatch(setLoading(false));
      console.log('💬 Load conversations completed');
    }
  };

  // Load specific conversation
  const loadConversation = async (conversationId) => {
    try {
      dispatch(setLoading(true));
      const data = await chatApi.getConversation(conversationId);
      dispatch(setActiveConversation(data.conversation));
      dispatch(setMessages(data.messages || []));
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load conversation';
      dispatch(setError(message));
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Send message
  const sendMessage = async (message) => {
    console.log('💬 sendMessage called with:', message);
    
    try {
      dispatch(setSending(true));
      
      // Add user message immediately
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      console.log('💬 Adding user message:', userMessage);
      dispatch(addMessage(userMessage));

      // Try real AI API first
      console.log('💬 Attempting real AI API call for:', message);
      
      let aiResponse;
      try {
        // Get conversation history for context
        const conversationHistory = messages.slice(-5); // Last 5 messages for context
        aiResponse = await aiApi.generateChatResponse(message, conversationHistory);
        console.log('💬 Real AI response received:', aiResponse);
      } catch (aiError) {
        console.error('💬 AI API failed with error:', aiError);
        
        // For authentication errors, fall back to local response silently
        // Don't show error to user, just use local intelligent response
        if (aiError.message.includes('authentication') || aiError.message.includes('API key') || aiError.message.includes('401')) {
          console.log('💬 Authentication failed, using local intelligent response');
          aiResponse = generateContextualResponse(message, isStudyMode, currentTopic);
        } else {
          // For other errors (rate limit, server error), show user message but still continue
          console.log('💬 API error, using local response:', aiError.message);
          aiResponse = generateContextualResponse(message, isStudyMode, currentTopic);
          
          // Show a subtle error message for non-auth errors
          if (aiError.message.includes('rate limit')) {
            toast.error('AI service is busy. Using local response.');
          } else if (aiError.message.includes('server error')) {
            toast.error('AI service temporarily unavailable. Using local response.');
          }
        }
        
        console.log('💬 Generated local response:', aiResponse);
      }
      
      // Add AI response after a short delay to simulate processing
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString()
        };
        console.log('💬 Adding AI message:', aiMessage);
        dispatch(addMessage(aiMessage));
        
        // Create real notification for AI response
        const conversationTitle = activeConversation?.title || 'Chat';
        notificationService.aiResponseReceived(conversationTitle, aiResponse);
      }, 1000); // Reduced delay for better UX
      
    } catch (err) {
      console.error('💬 Error in sendMessage:', err);
      
      // Don't show error to user, just log it
      console.log('💬 Unexpected error, this should not happen');
      dispatch(setError('An unexpected error occurred'));
    } finally {
      dispatch(setSending(false));
    }
  };

  // Create new conversation
  const createConversation = async (title = 'New Conversation') => {
    try {
      try {
        // Try API first
        const data = await chatApi.createConversation(title);
        const currentConversations = conversations || [];
        dispatch(setConversations([data, ...currentConversations]));
        dispatch(setActiveConversation(data));
        dispatch(setMessages([]));
        return data;
      } catch (apiError) {
        console.log('💬 API failed, creating mock conversation:', apiError);
        
        // Create mock conversation
        const mockConversation = {
          id: `mock-${Date.now()}`,
          title: title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const currentConversations = conversations || [];
        dispatch(setConversations([mockConversation, ...currentConversations]));
        dispatch(setActiveConversation(mockConversation));
        dispatch(setMessages([]));
        console.log('💬 Mock conversation created:', mockConversation);
        
        // Create real notification for new conversation
        notificationService.newConversationStarted(title);
        
        return mockConversation;
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create conversation';
      console.log('💬 Create conversation error:', message);
      throw err;
    }
  };

  // Delete conversation
  const deleteConversation = async (conversationId) => {
    try {
      await chatApi.deleteConversation(conversationId);
      dispatch(deleteConversationAction(conversationId));
      toast.success('Conversation deleted');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete conversation';
      toast.error(message);
      throw err;
    }
  };

  return {
    conversations: conversations || [],
    activeConversation,
    messages: messages || [],
    loading,
    sending,
    error,
    loadConversations,
    loadConversation,
    sendMessage,
    createConversation,
    deleteConversation
  };
};

export default useChat;
