// Chat API service
import axiosInstance from './axios';

// Create timeout wrapper for chat operations
const withTimeout = async (promise, timeoutMs, operation) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`${operation} timed out`)), timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
};

export const chatApi = {
  // Send a message to AI
  sendMessage: async (conversationId, message) => {
    console.log('💬 Sending chat message...');
    try {
      const response = await withTimeout(
        axiosInstance.post('/api/chat/message', {
          conversationId,
          message
        }),
        20000, // 20 second timeout for AI responses
        'Chat message'
      );
      console.log('✅ Chat message sent successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Chat message failed:', error.message);
      throw error;
    }
  },

  // Get all conversations
  getConversations: async () => {
    console.log('📋 Fetching conversations...');
    try {
      const response = await withTimeout(
        axiosInstance.get('/api/chat/conversations'),
        8000, // 8 second timeout
        'Get conversations'
      );
      console.log('✅ Conversations fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Get conversations failed:', error.message);
      throw error;
    }
  },

  // Get specific conversation with messages
  getConversation: async (conversationId) => {
    console.log(`📋 Fetching conversation ${conversationId}...`);
    try {
      const response = await withTimeout(
        axiosInstance.get(`/api/chat/conversations/${conversationId}`),
        8000, // 8 second timeout
        'Get conversation'
      );
      console.log('✅ Conversation fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Get conversation failed:', error.message);
      throw error;
    }
  },

  // Create new conversation
  createConversation: async (title) => {
    console.log('➕ Creating new conversation...');
    try {
      const response = await withTimeout(
        axiosInstance.post('/api/chat/conversations', {
          title
        }),
        8000, // 8 second timeout
        'Create conversation'
      );
      console.log('✅ Conversation created successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Create conversation failed:', error.message);
      throw error;
    }
  },

  // Update conversation (rename)
  updateConversation: async (conversationId, data) => {
    console.log(`✏️ Updating conversation ${conversationId}...`);
    try {
      const response = await withTimeout(
        axiosInstance.put(`/api/chat/conversations/${conversationId}`, data),
        8000, // 8 second timeout
        'Update conversation'
      );
      console.log('✅ Conversation updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Update conversation failed:', error.message);
      throw error;
    }
  },

  // Delete conversation
  deleteConversation: async (conversationId) => {
    console.log(`🗑️ Deleting conversation ${conversationId}...`);
    try {
      const response = await withTimeout(
        axiosInstance.delete(`/api/chat/conversations/${conversationId}`),
        8000, // 8 second timeout
        'Delete conversation'
      );
      console.log('✅ Conversation deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Delete conversation failed:', error.message);
      throw error;
    }
  }
};

export default chatApi;
