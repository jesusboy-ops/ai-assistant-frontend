// Notes slice - manages notes state
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notesApi } from '../../api/notesApi';
import notificationService from '../../services/notificationService';

// Async thunks
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (_, { rejectWithValue }) => {
    const result = await notesApi.getNotes();
    if (!result.success) {
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to fetch notes';
      return rejectWithValue(errorMessage);
    }
    return result.data;
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData, { rejectWithValue }) => {
    const result = await notesApi.createNote(noteData);
    if (!result.success) {
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to create note';
      return rejectWithValue(errorMessage);
    }
    return result.data;
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, updates }, { rejectWithValue }) => {
    const result = await notesApi.updateNote(id, updates);
    if (!result.success) {
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to update note';
      return rejectWithValue(errorMessage);
    }
    return result.data;
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (noteId, { rejectWithValue }) => {
    const result = await notesApi.deleteNote(noteId);
    if (!result.success) {
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to delete note';
      return rejectWithValue(errorMessage);
    }
    return noteId;
  }
);

const initialState = {
  notes: [],
  activeNote: null,
  loading: false,
  error: null
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setActiveNote: (state, action) => {
      state.activeNote = action.payload;
    },
    togglePinNote: (state, action) => {
      const note = state.notes.find(n => n.id === action.payload);
      if (note) {
        note.isPinned = !note.isPinned;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different backend response formats
        const data = action.payload;
        if (Array.isArray(data)) {
          state.notes = data;
        } else if (data && Array.isArray(data.notes)) {
          state.notes = data.notes;
        } else if (data && Array.isArray(data.data)) {
          state.notes = data.data;
        } else {
          console.warn('Unexpected notes data format:', data);
          state.notes = [];
        }
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create note
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.unshift(action.payload);
        // Create system notification
        notificationService.noteCreated(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update note
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
        if (state.activeNote?.id === action.payload.id) {
          state.activeNote = action.payload;
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete note
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter(n => n.id !== action.payload);
        if (state.activeNote?.id === action.payload) {
          state.activeNote = null;
        }
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setActiveNote,
  togglePinNote,
  clearError
} = notesSlice.actions;

export default notesSlice.reducer;
