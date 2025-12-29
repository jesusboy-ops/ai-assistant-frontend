// Translator slice for Language Translator
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { translatorApi } from '../../api/translatorApi';
import notificationService from '../../services/notificationService';

// Async thunks
export const fetchLanguages = createAsyncThunk(
  'translator/fetchLanguages',
  async (_, { rejectWithValue }) => {
    const result = await translatorApi.getLanguages();
    if (!result.success) {
      // Ensure error is always a string
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to fetch languages';
      return rejectWithValue(errorMessage);
    }
    return result.data;
  }
);

export const translateText = createAsyncThunk(
  'translator/translateText',
  async ({ text, sourceLang, targetLang }, { rejectWithValue }) => {
    const result = await translatorApi.translateText(text, sourceLang, targetLang);
    if (!result.success) {
      // Ensure error is always a string
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Translation failed';
      return rejectWithValue(errorMessage);
    }
    return result.data;
  }
);

export const detectLanguage = createAsyncThunk(
  'translator/detectLanguage',
  async (text, { rejectWithValue }) => {
    const result = await translatorApi.detectLanguage(text);
    if (!result.success) {
      // Ensure error is always a string
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Language detection failed';
      return rejectWithValue(errorMessage);
    }
    return result.data;
  }
);

const initialState = {
  languages: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' }
  ],
  sourceLang: 'auto',
  targetLang: 'en',
  originalText: '',
  translatedText: '',
  translationHistory: JSON.parse(localStorage.getItem('translation_history') || '[]'),
  loading: false,
  error: null,
  detectedLanguage: null
};

const translatorSlice = createSlice({
  name: 'translator',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSourceLang: (state, action) => {
      state.sourceLang = action.payload;
    },
    setTargetLang: (state, action) => {
      state.targetLang = action.payload;
    },
    setOriginalText: (state, action) => {
      state.originalText = action.payload;
    },
    clearTranslation: (state) => {
      state.originalText = '';
      state.translatedText = '';
      state.detectedLanguage = null;
    },
    swapLanguages: (state) => {
      if (state.sourceLang !== 'auto') {
        const temp = state.sourceLang;
        state.sourceLang = state.targetLang;
        state.targetLang = temp;
        
        // Swap texts too
        const tempText = state.originalText;
        state.originalText = state.translatedText;
        state.translatedText = tempText;
      }
    },
    clearHistory: (state) => {
      state.translationHistory = [];
      localStorage.removeItem('translation_history');
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch languages
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.languages = action.payload;
      })
      
      // Translate text
      .addCase(translateText.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(translateText.fulfilled, (state, action) => {
        state.loading = false;
        state.translatedText = action.payload.translatedText;
        
        // Add to history
        const historyItem = {
          originalText: action.payload.originalText,
          translatedText: action.payload.translatedText,
          sourceLang: action.payload.sourceLang,
          targetLang: action.payload.targetLang,
          timestamp: new Date().toISOString()
        };
        
        // Remove duplicates and add to beginning
        state.translationHistory = state.translationHistory.filter(
          item => !(item.originalText === historyItem.originalText && 
                   item.sourceLang === historyItem.sourceLang && 
                   item.targetLang === historyItem.targetLang)
        );
        state.translationHistory.unshift(historyItem);
        
        // Keep only last 100 translations
        if (state.translationHistory.length > 100) {
          state.translationHistory = state.translationHistory.slice(0, 100);
        }
        
        localStorage.setItem('translation_history', JSON.stringify(state.translationHistory));
        
        // Create system notification
        notificationService.translationCompleted(
          action.payload.originalText,
          action.payload.targetLang
        );
      })
      .addCase(translateText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Detect language
      .addCase(detectLanguage.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.detectedLanguage = action.payload[0];
        }
      });
  }
});

export const {
  clearError,
  setSourceLang,
  setTargetLang,
  setOriginalText,
  clearTranslation,
  swapLanguages,
  clearHistory
} = translatorSlice.actions;

export default translatorSlice.reducer;