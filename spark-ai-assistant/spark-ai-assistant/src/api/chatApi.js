// Chat API service
import axiosInstance from './axios';

export const chatApi = {
  // Send a message to AI
  sendMessage: async (conversationId, message) => {
    console.log('💬 Sending chat message...');
    try {
      const response = await axiosInstance.post('/api/chat/message', {
        conversationId,
        message
      });
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
      const response = await axiosInstance.get('/api/chat/conversations');
      console.log('✅ Conversations fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch conversations:', error.message);
      throw error;
    }
  },

  // Get a specific conversation
  getConversation: async (conversationId) => {
    console.log(`📋 Fetching conversation ${conversationId}...`);
    try {
      const response = await axiosInstance.get(`/api/chat/conversations/${conversationId}`);
      console.log('✅ Conversation fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch conversation:', error.message);
      throw error;
    }
  },

  // Create a new conversation
  createConversation: async (title) => {
    console.log('➕ Creating new conversation...');
    try {
      const response = await axiosInstance.post('/api/chat/conversations', {
        title
      });
      console.log('✅ Conversation created successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create conversation:', error.message);
      throw error;
    }
  },

  // Update a conversation
  updateConversation: async (conversationId, data) => {
    console.log(`✏️ Updating conversation ${conversationId}...`);
    try {
      const response = await axiosInstance.put(`/api/chat/conversations/${conversationId}`, data);
      console.log('✅ Conversation updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update conversation:', error.message);
      throw error;
    }
  },

  // Delete a conversation
  deleteConversation: async (conversationId) => {
    console.log(`🗑️ Deleting conversation ${conversationId}...`);
    try {
      const response = await axiosInstance.delete(`/api/chat/conversations/${conversationId}`);
      console.log('✅ Conversation deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to delete conversation:', error.message);
      throw error;
    }
  }
};

export default chatApi;