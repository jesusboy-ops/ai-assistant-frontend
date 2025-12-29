// Smart Bookshelf Redux slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { smartBookshelfApi } from '../../api/smartBookshelfApi';

// Async thunks
export const fetchBooks = createAsyncThunk(
  'smartBookshelf/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await smartBookshelfApi.getBooks();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBook = createAsyncThunk(
  'smartBookshelf/addBook',
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await smartBookshelfApi.saveBook(bookData);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBook = createAsyncThunk(
  'smartBookshelf/updateBook',
  async ({ bookId, updates }, { rejectWithValue }) => {
    try {
      const response = await smartBookshelfApi.updateBook(bookId, updates);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBook = createAsyncThunk(
  'smartBookshelf/deleteBook',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await smartBookshelfApi.deleteBook(bookId);
      if (response.success) {
        return bookId;
      }
      throw new Error(response.error);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getRecommendations = createAsyncThunk(
  'smartBookshelf/getRecommendations',
  async (userContext, { rejectWithValue }) => {
    try {
      const response = await smartBookshelfApi.getPersonalizedRecommendations(userContext);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  books: [],
  recommendations: [],
  selectedBook: null,
  categories: [
    {
      id: 'productivity',
      name: 'Productivity & Focus',
      color: '#667eea',
      description: 'Master your time and attention'
    },
    {
      id: 'career',
      name: 'Career & Skills',
      color: '#10b981',
      description: 'Advance your professional growth'
    },
    {
      id: 'communication',
      name: 'Communication & Writing',
      color: '#06b6d4',
      description: 'Express ideas with clarity and impact'
    },
    {
      id: 'thinking',
      name: 'Thinking & Mental Models',
      color: '#8b5cf6',
      description: 'Improve decision-making and reasoning'
    },
    {
      id: 'technology',
      name: 'Technology & AI',
      color: '#f59e0b',
      description: 'Stay ahead in the digital age'
    }
  ],
  loading: false,
  error: null,
  searchQuery: '',
  activeCategory: 'all',
  readingMode: false
};

const smartBookshelfSlice = createSlice({
  name: 'smartBookshelf',
  initialState,
  reducers: {
    setSelectedBook: (state, action) => {
      state.selectedBook = action.payload;
    },
    clearSelectedBook: (state) => {
      state.selectedBook = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    setReadingMode: (state, action) => {
      state.readingMode = action.payload;
    },
    addHighlight: (state, action) => {
      const { bookId, highlight } = action.payload;
      const book = state.books.find(b => b.id === bookId);
      if (book) {
        if (!book.highlights) book.highlights = [];
        book.highlights.push({
          ...highlight,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        });
      }
    },
    addNote: (state, action) => {
      const { bookId, note } = action.payload;
      const book = state.books.find(b => b.id === bookId);
      if (book) {
        if (!book.notes) book.notes = [];
        book.notes.push({
          ...note,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        });
      }
    },
    updateProgress: (state, action) => {
      const { bookId, progress } = action.payload;
      const book = state.books.find(b => b.id === bookId);
      if (book) {
        book.progress = progress;
        book.updatedAt = new Date().toISOString();
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add book
      .addCase(addBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update book
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex(book => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      
      // Delete book
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter(book => book.id !== action.payload);
        if (state.selectedBook?.id === action.payload) {
          state.selectedBook = null;
        }
      })
      
      // Get recommendations
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      });
  }
});

export const {
  setSelectedBook,
  clearSelectedBook,
  setSearchQuery,
  setActiveCategory,
  setReadingMode,
  addHighlight,
  addNote,
  updateProgress,
  clearError
} = smartBookshelfSlice.actions;

export default smartBookshelfSlice.reducer;