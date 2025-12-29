// Document Summarizer slice for File & Document Summarizer
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { documentSummarizerApi } from '../../api/documentSummarizerApi';

// Async thunks
export const summarizeDocument = createAsyncThunk(
  'documentSummarizer/summarizeDocument',
  async ({ file, options }, { rejectWithValue }) => {
    const result = await documentSummarizerApi.summarizeDocument(file, options);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

export const fetchUserSummaries = createAsyncThunk(
  'documentSummarizer/fetchUserSummaries',
  async (_, { rejectWithValue }) => {
    const result = await documentSummarizerApi.getUserSummaries();
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

export const deleteSummary = createAsyncThunk(
  'documentSummarizer/deleteSummary',
  async (summaryId, { rejectWithValue }) => {
    const result = await documentSummarizerApi.deleteSummary(summaryId);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return summaryId;
  }
);

export const extractKeyPoints = createAsyncThunk(
  'documentSummarizer/extractKeyPoints',
  async (file, { rejectWithValue }) => {
    const result = await documentSummarizerApi.extractKeyPoints(file);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

export const saveToNotes = createAsyncThunk(
  'documentSummarizer/saveToNotes',
  async ({ summaryId, noteTitle }, { rejectWithValue }) => {
    const result = await documentSummarizerApi.saveToNotes(summaryId, noteTitle);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

const initialState = {
  summaries: [],
  currentSummary: null,
  currentKeyPoints: null,
  loading: false,
  error: null,
  uploadProgress: 0,
  processingFile: null
};

const documentSummarizerSlice = createSlice({
  name: 'documentSummarizer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSummary: (state) => {
      state.currentSummary = null;
      state.currentKeyPoints = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    setProcessingFile: (state, action) => {
      state.processingFile = action.payload;
    },
    clearProcessingFile: (state) => {
      state.processingFile = null;
      state.uploadProgress = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Summarize document
      .addCase(summarizeDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(summarizeDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSummary = action.payload;
        state.summaries.unshift(action.payload);
        state.processingFile = null;
        state.uploadProgress = 0;
      })
      .addCase(summarizeDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.processingFile = null;
        state.uploadProgress = 0;
      })
      
      // Fetch user summaries
      .addCase(fetchUserSummaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSummaries.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        if (Array.isArray(data)) {
          state.summaries = data;
        } else if (data && Array.isArray(data.summaries)) {
          state.summaries = data.summaries;
        } else if (data && Array.isArray(data.data)) {
          state.summaries = data.data;
        } else {
          console.warn('Unexpected summaries data format:', data);
          state.summaries = [];
        }
      })
      .addCase(fetchUserSummaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete summary
      .addCase(deleteSummary.fulfilled, (state, action) => {
        state.summaries = state.summaries.filter(summary => summary.id !== action.payload);
        if (state.currentSummary?.id === action.payload) {
          state.currentSummary = null;
        }
      })
      .addCase(deleteSummary.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Extract key points
      .addCase(extractKeyPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extractKeyPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.currentKeyPoints = action.payload;
      })
      .addCase(extractKeyPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save to notes
      .addCase(saveToNotes.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  clearCurrentSummary,
  setUploadProgress,
  setProcessingFile,
  clearProcessingFile
} = documentSummarizerSlice.actions;

export default documentSummarizerSlice.reducer;