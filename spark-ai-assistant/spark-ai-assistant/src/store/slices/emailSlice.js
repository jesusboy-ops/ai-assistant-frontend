// Email slice - manages email generation and history
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  generatedEmail: null,
  emailHistory: [],
  loading: false,
  sending: false,
  error: null
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setGeneratedEmail: (state, action) => {
      state.generatedEmail = action.payload;
    },
    setEmailHistory: (state, action) => {
      state.emailHistory = action.payload;
    },
    addToHistory: (state, action) => {
      state.emailHistory.unshift(action.payload);
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
    },
    clearGeneratedEmail: (state) => {
      state.generatedEmail = null;
    }
  }
});

export const {
  setGeneratedEmail,
  setEmailHistory,
  addToHistory,
  setLoading,
  setSending,
  setError,
  clearError,
  clearGeneratedEmail
} = emailSlice.actions;

export default emailSlice.reducer;
