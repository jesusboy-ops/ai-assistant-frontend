// Dictionary slice for managing dictionary state
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dictionaryApi } from '../../api/dictionaryApi';

// Async thunks
export const searchWord = createAsyncThunk(
  'dictionary/searchWord',
  async (word, { rejectWithValue }) => {
    try {
      console.log(`🔄 Starting dictionary search for: "${word}"`);
      const result = await dictionaryApi.searchWord(word);
      if (!result.success) {
        console.error('❌ Dictionary search failed:', result.error);
        return rejectWithValue(result.error);
      }
      console.log('✅ Dictionary search successful');
      return { word, data: result.data };
    } catch (error) {
      console.error('❌ Dictionary search error:', error);
      const errorMessage = error.code === 'ECONNABORTED' || error.message.includes('timeout')
        ? 'Dictionary search timed out. Please try again.'
        : error.message || 'Dictionary search failed';
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  currentWord: null,
  currentDefinition: null,
  searchHistory: JSON.parse(localStorage.getItem('dictionary_history') || '[]'),
  favorites: JSON.parse(localStorage.getItem('dictionary_favorites') || '[]'),
  loading: false,
  error: null
};

const dictionarySlice = createSlice({
  name: 'dictionary',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addToFavorites: (state, action) => {
      const { word, definition } = action.payload;
      const exists = state.favorites.find(fav => fav.word === word);
      if (!exists) {
        state.favorites.unshift({ word, definition, addedAt: new Date().toISOString() });
        localStorage.setItem('dictionary_favorites', JSON.stringify(state.favorites));
      }
    },
    removeFromFavorites: (state, action) => {
      const word = action.payload;
      state.favorites = state.favorites.filter(fav => fav.word !== word);
      localStorage.setItem('dictionary_favorites', JSON.stringify(state.favorites));
    },
    clearHistory: (state) => {
      state.searchHistory = [];
      localStorage.removeItem('dictionary_history');
    },
    clearFavorites: (state) => {
      state.favorites = [];
      localStorage.removeItem('dictionary_favorites');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchWord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchWord.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWord = action.payload.word;
        state.currentDefinition = action.payload.data;
        
        // Add to search history
        const historyItem = {
          word: action.payload.word,
          searchedAt: new Date().toISOString()
        };
        
        // Remove if already exists and add to beginning
        state.searchHistory = state.searchHistory.filter(item => item.word !== action.payload.word);
        state.searchHistory.unshift(historyItem);
        
        // Keep only last 50 searches
        if (state.searchHistory.length > 50) {
          state.searchHistory = state.searchHistory.slice(0, 50);
        }
        
        localStorage.setItem('dictionary_history', JSON.stringify(state.searchHistory));
      })
      .addCase(searchWord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentWord = null;
        state.currentDefinition = null;
      });
  }
});

export const {
  clearError,
  addToFavorites,
  removeFromFavorites,
  clearHistory,
  clearFavorites
} = dictionarySlice.actions;

export default dictionarySlice.reducer;