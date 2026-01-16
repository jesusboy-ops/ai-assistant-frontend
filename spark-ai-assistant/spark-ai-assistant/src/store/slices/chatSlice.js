// Chat slice - manages conversations and messages
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  loading: false,
  sending: false,
  error: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action) => {
      const index = state.messages.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.messages[index] = { ...state.messages[index], ...action.payload };
      }
    },
    deleteConversation: (state, action) => {
      state.conversations = state.conversations.filter(c => c.id !== action.payload);
      if (state.activeConversation?.id === action.payload) {
        state.activeConversation = null;
        state.messages = [];
      }
    },
    toggleFavoriteMessage: (state, action) => {
      const message = state.messages.find(m => m.id === action.payload);
      if (message) {
        message.isFavorite = !message.isFavorite;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSending: (state, action) => {
      state.sending = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setConversations,
  setActiveConversation,
  setMessages,
  addMessage,
  updateMessage,
  deleteConversation,
  toggleFavoriteMessage,
  setLoading,
  setSending,
  setError,
  clearError
} = chatSlice.actions;

export default chatSlice.reducer;
