// Files slice - manages file uploads and list
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  files: [],
  uploadProgress: {},
  loading: false,
  error: null
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    addFile: (state, action) => {
      state.files.unshift(action.payload);
    },
    deleteFile: (state, action) => {
      state.files = state.files.filter(f => f.id !== action.payload);
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress[action.payload.fileId] = action.payload.progress;
    },
    clearUploadProgress: (state, action) => {
      delete state.uploadProgress[action.payload];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
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
  setFiles,
  addFile,
  deleteFile,
  setUploadProgress,
  clearUploadProgress,
  setLoading,
  setError,
  clearError
} = filesSlice.actions;

export default filesSlice.reducer;
