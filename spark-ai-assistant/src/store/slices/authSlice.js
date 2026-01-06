// Authentication slice - manages user auth state and JWT token
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';

// Async thunks with timeout handling
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('🔄 Starting login process...');
      
      // Create a timeout promise - ULTRA FAST 2 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Login timeout')), 2000);
      });

      // Create the login promise
      const loginPromise = authApi.login(email, password);

      // Race between login and timeout
      const result = await Promise.race([loginPromise, timeoutPromise]);
      
      console.log('✅ Login successful');
      return result;
    } catch (error) {
      console.error('❌ Login failed:', error);
      
      if (error.message === 'Login timeout') {
        return rejectWithValue('Login is taking too long. Please try again.');
      }
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return rejectWithValue('Connection timed out. Please check your internet connection.');
      }
      
      if (error.response?.status === 401) {
        return rejectWithValue('Invalid email or password.');
      }
      
      if (error.response?.status === 400) {
        return rejectWithValue(error.userMessage || error.response?.data?.message || 'Invalid login credentials.');
      }
      
      return rejectWithValue(error.message || 'Login failed. Please try again.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      console.log('🔄 Starting registration process...');
      
      // Create a timeout promise - ULTRA FAST 2 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Registration timeout')), 2000);
      });

      // Create the registration promise
      const registerPromise = authApi.register(email, password, name);

      // Race between registration and timeout
      const result = await Promise.race([registerPromise, timeoutPromise]);
      
      console.log('✅ Registration successful');
      return result;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      
      if (error.message === 'Registration timeout') {
        return rejectWithValue('Registration is taking too long. Please try again.');
      }
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return rejectWithValue('Connection timed out. Please check your internet connection.');
      }
      
      if (error.response?.status === 400) {
        return rejectWithValue(error.userMessage || error.response?.data?.message || 'Registration failed. Please check your information.');
      }
      
      if (error.response?.status === 409) {
        return rejectWithValue('An account with this email already exists.');
      }
      
      return rejectWithValue(error.message || 'Registration failed. Please try again.');
    }
  }
);

export const forgotPasswordRequest = createAsyncThunk(
  'auth/forgotPasswordRequest',
  async (email, { rejectWithValue }) => {
    try {
      console.log('🔄 Starting forgot password process...');
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
      });

      // Create the forgot password promise
      const forgotPromise = authApi.forgotPassword(email);

      // Race between request and timeout
      const result = await Promise.race([forgotPromise, timeoutPromise]);
      
      console.log('✅ Forgot password request successful');
      return result;
    } catch (error) {
      console.error('❌ Forgot password request failed:', error);
      
      if (error.message === 'Request timeout') {
        return rejectWithValue('Request timed out. Please try again.');
      }
      
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
