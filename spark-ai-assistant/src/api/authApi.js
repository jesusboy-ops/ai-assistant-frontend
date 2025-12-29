// Authentication API service
import axiosInstance from './axios';

export const authApi = {
  // Register new user
  register: async (email, password, name) => {
    const response = await axiosInstance.post('/api/auth/register', {
      email,
      password,
      name
    });
    return response.data;
  },

  // Login with email and password
  login: async (email, password) => {
    // Try multiple request formats to handle different backend configurations
    const requestConfigs = [
      // Standard format
      {
        url: '/api/auth/login',
        data: { email, password },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      },
      // Alternative format with username field
      {
        url: '/api/auth/login',
        data: { username: email, password },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      },
      // Format with additional headers
      {
        url: '/api/auth/login',
        data: { email, password },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache'
        }
      }
    ];
    
    let lastError;
    
    for (const config of requestConfigs) {
      try {
        console.log('🔐 Trying login with config:', config);
        const response = await axiosInstance.post(config.url, config.data, {
          headers: config.headers
        });
        console.log('✅ Login successful with config:', config);
        return response.data;
      } catch (error) {
        console.log('❌ Login failed with config:', config, error.response?.status);
        lastError = error;
        
        // If we get a different error than 403, stop trying other configs
        if (error.response?.status !== 403) {
          break;
        }
      }
    }
    
    // If all configs failed, throw the last error
    throw lastError;
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
