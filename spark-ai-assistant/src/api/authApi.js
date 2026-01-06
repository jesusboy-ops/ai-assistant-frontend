// Authentication API service
import axiosInstance, { wakeUpBackend } from './axios';

export const authApi = {
  // Register new user
  register: async (email, password, name) => {
    const response = await axiosInstance.post('/api/auth/register', {
      email,
      password,
      name
    }, {
      timeout: 8000 // 8 seconds for production
    });
    return response.data;
  },

  // Login with email and password
  login: async (email, password) => {
    console.log('🔐 Attempting login for:', email);
    
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password
      }, {
        timeout: 8000, // 8 seconds for production
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('✅ Login successful for:', email);
      return response.data;
    } catch (error) {
      console.log('❌ Login failed for:', email, error.response?.data || error.message);
      throw error;
    }
  },

  // Google OAuth login
  googleLogin: async (idToken) => {
    const response = await axiosInstance.post('/api/auth/oauth/google', {
      idToken
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await axiosInstance.post('/api/auth/verify-email', {
      token
    });
    return response.data;
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await axiosInstance.post('/api/auth/forgot-password', {
      email
    });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const response = await axiosInstance.post('/api/auth/reset-password', {
      token,
      newPassword
    });
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await axiosInstance.get('/api/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data) => {
    const response = await axiosInstance.put('/api/auth/profile', data);
    return response.data;
  }
};

export default authApi;
