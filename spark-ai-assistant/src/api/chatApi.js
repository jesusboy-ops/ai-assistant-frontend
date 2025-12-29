// Chat API service
import axiosInstance from './axios';

export const chatApi = {
  // Send a message to AI
  sendMessage: async (conversationId, message) => {
    const response = await axiosInstance.post('/api/chat/message', {
      conversationId,
      message
    });
    return response.data;
  },

  // Get all conversations
  getConversations: async () => {
    const response = await axiosInstance.get('/api/chat/conversations');
    return response.data;
  },

  // Get specific conversation with messages
  getConversation: async (conversationId) => {
    const response = await axiosInstance.get(`/api/chat/conversations/${conversationId}`);
    return response.data;
  },

  // Create new conversation
  createConversation: async (title) => {
    const response = await axiosInstance.post('/api/chat/conversations', {
      title
    });
    return response.data;
  },

  // Update conversation (rename)
  updateConversation: async (conversationId, data) => {
    const response = await axiosInstance.put(`/api/chat/conversations/${conversationId}`, data);
    return response.data;
  },

  // Delete conversation
  deleteConversation: async (conversationId) => {
    const response = await axiosInstance.delete(`/api/chat/conversations/${conversationId}`);
    return response.data;
  }
};

export default chatApi;
