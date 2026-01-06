// Axios instance with JWT interceptor configuration
import axios from 'axios';

// Backend URL configuration with fallbacks
const isDevelopment = import.meta.env.DEV;
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'https://ai-assistant-backend-oqpp.onrender.com';

// Alternative backend URLs to try if primary fails
const FALLBACK_URLS = [
  'https://ai-assistant-backend-oqpp.onrender.com',
  // Add more fallback URLs here if needed
];

console.log('🔧 Environment:', isDevelopment ? 'Development' : 'Production');
console.log('🔧 Primary Backend URL:', BACKEND_URL);
console.log('🔧 Fallback URLs:', FALLBACK_URLS);

// Create axios instance with dynamic base URL
const createAxiosInstance = (baseURL) => {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    timeout: 2000, // ULTRA FAST 2 seconds
    withCredentials: false
  });
};

// Primary axios instance
let axiosInstance = createAxiosInstance(isDevelopment ? '' : BACKEND_URL);

// Direct backend instance for fallback
let directAxiosInstance = createAxiosInstance(BACKEND_URL);

// Request interceptor function
const addAuthInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 JWT Token added to request');
      }
      
      const fullUrl = config.baseURL ? config.baseURL + config.url : config.url;
      console.log('📤 API Request:', config.method?.toUpperCase(), fullUrl);
      
      return config;
    },
    (error) => {
      console.log('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  );
};

// Response interceptor function
const addResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => {
      console.log('📥 API Response:', response.status, response.config.url);
      return response;
    },
    (error) => {
      console.log('❌ API Error Details:');
      console.log('  Status:', error.response?.status || error.code);
      console.log('  URL:', error.config?.url);
      console.log('  Method:', error.config?.method?.toUpperCase());
      console.log('  Request Data:', error.config?.data);
      console.log('  Response Data:', error.response?.data);
      console.log('  Response Headers:', error.response?.headers);
      
      // Special handling for 400 errors
      if (error.response?.status === 400) {
        console.log('🚨 400 Bad Request Details:');
        console.log('  Error Message:', error.response?.data?.message || error.response?.data?.error || 'No error message provided');
        console.log('  Validation Errors:', error.response?.data?.errors || error.response?.data?.details || 'No validation details');
        console.log('  Full Response:', JSON.stringify(error.response?.data, null, 2));
        
        // Try to parse and format the error for better user experience
        if (error.response?.data) {
          const errorData = error.response.data;
          if (errorData.errors && Array.isArray(errorData.errors)) {
            const errorMessages = errorData.errors.map(err => {
              if (typeof err === 'string') return err;
              if (err.message) return err.message;
              if (err.msg) return err.msg;
              return JSON.stringify(err);
            });
            error.userMessage = errorMessages.join(', ');
          } else if (errorData.message) {
            error.userMessage = errorData.message;
          } else if (errorData.error) {
            error.userMessage = errorData.error;
          }
        }
      }
      
      if (error.response?.status === 401) {
        console.log('🔐 Token expired - logging out');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );
};

// Add interceptors to instances
addAuthInterceptor(axiosInstance);
addResponseInterceptor(axiosInstance);
addAuthInterceptor(directAxiosInstance);
addResponseInterceptor(directAxiosInstance);

// Smart request function with multiple fallback strategies
const smartRequest = async (config) => {
  const errors = [];

  // Strategy 1: Try proxy in development
  if (isDevelopment) {
    try {
      console.log('🔄 Trying proxy connection...');
      return await axiosInstance(config);
    } catch (proxyError) {
      console.log('❌ Proxy failed:', proxyError.message);
      errors.push({ method: 'proxy', error: proxyError.message });
    }
  }

  // Strategy 2: Try direct connection to primary backend
  try {
    console.log('🔄 Trying direct connection to primary backend...');
    return await directAxiosInstance(config);
  } catch (primaryError) {
    console.log('❌ Primary backend failed:', primaryError.message);
    errors.push({ method: 'primary', error: primaryError.message });
  }

  // Strategy 3: Try fallback URLs
  for (const fallbackUrl of FALLBACK_URLS) {
    if (fallbackUrl === BACKEND_URL) continue; // Skip if same as primary
    
    try {
      console.log(`🔄 Trying fallback URL: ${fallbackUrl}`);
      const fallbackInstance = createAxiosInstance(fallbackUrl);
      addAuthInterceptor(fallbackInstance);
      addResponseInterceptor(fallbackInstance);
      
      return await fallbackInstance(config);
    } catch (fallbackError) {
      console.log(`❌ Fallback ${fallbackUrl} failed:`, fallbackError.message);
      errors.push({ method: `fallback-${fallbackUrl}`, error: fallbackError.message });
    }
  }

  // All strategies failed
  console.log('❌ All connection strategies failed:', errors);
  
  // Create a comprehensive error message
  const errorMessage = `Backend connection failed. Tried ${errors.length} methods:\n${errors.map(e => `- ${e.method}: ${e.error}`).join('\n')}`;
  
  const error = new Error(errorMessage);
  error.code = 'BACKEND_UNAVAILABLE';
  error.attempts = errors;
  throw error;
};

// Create smart axios wrapper
const smartAxiosInstance = {
  get: (url, config = {}) => smartRequest({ ...config, method: 'GET', url }),
  post: (url, data, config = {}) => smartRequest({ ...config, method: 'POST', url, data }),
  put: (url, data, config = {}) => smartRequest({ ...config, method: 'PUT', url, data }),
  patch: (url, data, config = {}) => smartRequest({ ...config, method: 'PATCH', url, data }),
  delete: (url, config = {}) => smartRequest({ ...config, method: 'DELETE', url })
};

// Enhanced health check function with wake-up capability
export const checkBackendHealth = async () => {
  try {
    console.log('🔍 Checking backend health...');
    
    // First, try to wake up the backend with a simple request
    try {
      console.log('⏰ Attempting to wake up backend...');
      await smartRequest({ 
        method: 'GET', 
        url: '/', 
        timeout: 45000 // Extended timeout for wake-up
      });
    } catch (wakeUpError) {
      console.log('⏰ Wake-up request completed (may have failed, but backend should be starting)');
    }
    
    // Test endpoints in order of preference
    const testEndpoints = ['/api/health', '/api/tasks', '/api/life-admin/stats', '/'];
    
    for (const endpoint of testEndpoints) {
      try {
        const response = await smartRequest({ 
          method: 'GET', 
          url: endpoint, 
          timeout: 30000 
        });
        
        console.log(`✅ Backend responding at ${endpoint}:`, response.status);
        return { 
          status: 'connected', 
          data: { 
            message: `Backend is responding at ${endpoint}`, 
            status: response.status,
            endpoint: endpoint,
            url: response.config.baseURL || 'proxy'
          } 
        };
      } catch (endpointError) {
        console.log(`❌ Endpoint ${endpoint} failed:`, endpointError.message);
        
        // If we get HTTP status codes, the backend is responding
        if (endpointError.response?.status) {
          console.log(`✅ Backend is responding with status:`, endpointError.response.status);
          return { 
            status: 'connected', 
            data: { 
              message: 'Backend is responding', 
              status: endpointError.response.status,
              endpoint: endpoint,
              url: endpointError.config?.baseURL || 'proxy'
            } 
          };
        }
      }
    }
    
    return { 
      status: 'disconnected', 
      error: 'No responsive endpoints found. Backend may be down or unreachable.' 
    };
    
  } catch (error) {
    console.log('❌ Backend health check error:', error);
    
    return { 
      status: 'disconnected', 
      error: error.code === 'BACKEND_UNAVAILABLE' 
        ? 'Backend is not accessible. Please check if the backend server is running.'
        : error.message || 'Unknown connection error'
    };
  }
};

// Function to wake up the backend (useful for Render.com free tier)
export const wakeUpBackend = async () => {
  console.log('⏰ Waking up backend server...');
  
  try {
    // Make a simple request to wake up the server
    await smartRequest({ 
      method: 'GET', 
      url: '/', 
      timeout: 45000 // Long timeout for cold start
    });
    
    console.log('✅ Backend wake-up request completed');
    return { success: true, message: 'Backend is now active' };
  } catch (error) {
    console.log('⏰ Wake-up request completed (backend should be starting)');
    // Even if this fails, the backend might be starting up
    return { success: true, message: 'Backend wake-up initiated' };
  }
};

// Function to test backend connectivity and provide user-friendly messages
export const testBackendConnectivity = async () => {
  console.log('🧪 Testing backend connectivity...');
  
  try {
    const health = await checkBackendHealth();
    
    if (health.status === 'connected') {
      console.log('✅ Backend connectivity test passed');
      return {
        success: true,
        message: 'Backend is accessible and responding',
        details: health.data
      };
    } else {
      console.log('❌ Backend connectivity test failed');
      return {
        success: false,
        message: 'Backend is not accessible',
        error: health.error,
        suggestions: [
          'Check if the backend server is running',
          'Verify the backend URL in .env file',
          'Check your internet connection',
          'Try refreshing the page'
        ]
      };
    }
  } catch (error) {
    console.log('❌ Backend connectivity test error:', error);
    return {
      success: false,
      message: 'Failed to test backend connectivity',
      error: error.message,
      suggestions: [
        'Check your internet connection',
        'Verify the backend URL configuration',
        'Contact support if the issue persists'
      ]
    };
  }
};

export default smartAxiosInstance;
