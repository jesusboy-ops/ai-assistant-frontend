// Authentication slice - manages user auth state and JWT token
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';

// Async thunks with proper timeout and error handling
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Wake up backend first (especially important for Render.com free tier)
      try {
        await authApi.wakeUpServer();
      } catch (wakeUpError) {
        console.log('⏰ Backend wake-up completed, proceeding with login...');
      }
      
      const result = await authApi.login(email, password);
      return result;
    } catch (error) {
      // Handle timeout errors
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return rejectWithValue('Connection timeout. The server may be starting up. Please wait a moment and try again.');
      }
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        return rejectWithValue('Invalid email or password. Please check your credentials.');
      }
      
      // Handle validation errors
      if (error.response?.status === 400) {
        const message = error.response?.data?.message || 'Please check your login information.';
        return rejectWithValue(message);
      }
      
      // Handle server errors
      if (error.response?.status >= 500) {
        return rejectWithValue('Server temporarily unavailable. Please try again in a moment.');
      }
      
      // Handle network errors or backend unavailable
      if (!error.response || error.code === 'BACKEND_UNAVAILABLE') {
        return rejectWithValue('Unable to connect to server. The backend may be starting up. Please wait a moment and try again.');
      }
      
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      // Wake up backend first (especially important for Render.com free tier)
      try {
        await authApi.wakeUpServer();
      } catch (wakeUpError) {
        console.log('⏰ Backend wake-up completed, proceeding with registration...');
      }
      
      const result = await authApi.register(email, password, name);
      return result;
    } catch (error) {
      // Handle timeout errors
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return rejectWithValue('Connection timeout. The server may be starting up. Please wait a moment and try again.');
      }
      
      // Handle validation errors
      if (error.response?.status === 400) {
        const message = error.response?.data?.message || 'Please check your registration information.';
        return rejectWithValue(message);
      }
      
      // Handle duplicate account
      if (error.response?.status === 409) {
        return rejectWithValue('An account with this email already exists. Please use a different email or try logging in.');
      }
      
      // Handle server errors
      if (error.response?.status >= 500) {
        return rejectWithValue('Server temporarily unavailable. Please try again in a moment.');
      }
      
      // Handle network errors or backend unavailable
      if (!error.response || error.code === 'BACKEND_UNAVAILABLE') {
        return rejectWithValue('Unable to connect to server. The backend may be starting up. Please wait a moment and try again.');
      }
      
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

export const forgotPasswordRequest = createAsyncThunk(
  'auth/forgotPasswordRequest',
  async (email, { rejectWithValue }) => {
    try {
      console.log('🔄 Starting forgot password process...');
      
      // Direct request without timeout
      const result = await authApi.forgotPassword(email);
      
      console.log('✅ Forgot password request successful');
      return result;
    } catch (error) {
      console.error('❌ Forgot password request failed:', error);
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return rejectWithValue('Connection timed out. Please check your internet connection.');
      }
      
      return rejectWithValue(error.message || 'Failed to send reset email. Please try again.');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
      state.loading = false; // Also reset loading state
    }
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Forgot password
      .addCase(forgotPasswordRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordRequest.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPasswordRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearError
} = authSlice.actions;

export default authSlice.reducer;
