// Study Mode Redux slice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isStudyMode: false,
  currentTopic: null,
  currentFile: null,
  sessionNotes: [],
  sessionQuestions: [],
  sessionFlashcards: [],
  studyHistory: [],
  loading: false,
  error: null
};

const studySlice = createSlice({
  name: 'study',
  initialState,
  reducers: {
    toggleStudyMode: (state) => {
      state.isStudyMode = !state.isStudyMode;
      if (!state.isStudyMode) {
        // Clear session when exiting study mode
        state.currentTopic = null;
        state.currentFile = null;
      }
    },
    setStudyTopic: (state, action) => {
      state.currentTopic = action.payload;
      state.isStudyMode = true;
    },
    setStudyFile: (state, action) => {
      state.currentFile = action.payload;
      state.isStudyMode = true;
    },
    addSessionNote: (state, action) => {
      state.sessionNotes.push({
        id: Date.now(),
        content: action.payload.content,
        topic: state.currentTopic,
        timestamp: new Date().toISOString()
      });
    },
    addSessionQuestion: (state, action) => {
      state.sessionQuestions.push({
        id: Date.now(),
        question: action.payload.question,
        answer: action.payload.answer,
        topic: state.currentTopic,
        timestamp: new Date().toISOString()
      });
    },
    addSessionFlashcard: (state, action) => {
      state.sessionFlashcards.push({
        id: Date.now(),
        front: action.payload.front,
        back: action.payload.back,
        topic: state.currentTopic,
        timestamp: new Date().toISOString()
      });
    },
    clearSession: (state) => {
      // Save current session to history before clearing
      if (state.sessionNotes.length > 0 || state.sessionQuestions.length > 0 || state.sessionFlashcards.length > 0) {
        state.studyHistory.push({
          id: Date.now(),
          topic: state.currentTopic,
          file: state.currentFile,
          notes: [...state.sessionNotes],
          questions: [...state.sessionQuestions],
          flashcards: [...state.sessionFlashcards],
          timestamp: new Date().toISOString()
        });
      }
      
      state.sessionNotes = [];
      state.sessionQuestions = [];
      state.sessionFlashcards = [];
      state.currentTopic = null;
      state.currentFile = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  toggleStudyMode,
  setStudyTopic,
  setStudyFile,
  addSessionNote,
  addSessionQuestion,
  addSessionFlashcard,
  clearSession,
  setLoading,
  setError
} = studySlice.actions;

export default studySlice.reducer;