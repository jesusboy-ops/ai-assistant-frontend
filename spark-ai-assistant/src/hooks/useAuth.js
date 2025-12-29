// Custom hook for authentication
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from '../store/slices/authSlice';
import authApi from '../api/authApi';
import toast from '../utils/toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Login function
  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      dispatch(loginStart());
      
      const data = await authApi.login(email, password);
      console.log('✅ Login successful for:', email);
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      dispatch(loginSuccess(data));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      console.log('❌ Login failed for:', email, err);
      let message = 'Login failed';
      
      if (err.code === 'ERR_NETWORK') {
        message = 'Cannot connect to server. Please check your internet connection.';
        console.log('🔌 Network error during login - server unreachable');
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.status === 401) {
        message = 'Invalid email or password';
        console.log('🔑 Invalid credentials provided');
      } else if (err.response?.status === 405) {
        message = 'Server configuration error. Please contact support.';
        console.log('🚫 Method not allowed - backend API issue');
      } else if (err.response?.status >= 500) {
        message = 'Server error. Please try again later.';
        console.log('🔥 Server error during login:', err.response.status);
      }
      
      dispatch(loginFailure(message));
      toast.error(message);
      throw err;
    }
  };

  // Register function
  const register = async (email, password, name) => {
    try {
      dispatch(loginStart());
      
      const data = await authApi.register(email, password, name);
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      dispatch(loginSuccess(data));
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      let message = 'Registration failed';
      
      if (err.code === 'ERR_NETWORK') {
        if (err.message?.includes('CORS') || window.location.origin === 'http://localhost:5174') {
          message = 'CORS Error: The backend server needs to allow requests from http://localhost:5174. Please update the backend CORS configuration.';
        } else {
          message = 'Cannot connect to server. Please check your internet connection.';
        }
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.status === 400) {
        message = 'Invalid registration data. Please check your inputs.';
      } else if (err.response?.status === 409) {
        message = 'Email already exists. Please use a different email.';
      } else if (err.response?.status >= 500) {
        message = 'Server error. Please try again later.';
      }
      
      dispatch(loginFailure(message));
      toast.error(message);
      throw err;
    }
  };

  // Google login function
  const googleLogin = async (tokenOrIdToken, userData = null) => {
    try {
      dispatch(loginStart());
      
      let data;
      if (userData) {
        // If userData is provided, we already have the processed data from callback
        data = { token: tokenOrIdToken, user: userData };
      } else {
        // If only token is provided, call the backend API
        data = await authApi.googleLogin(tokenOrIdToken);
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      dispatch(loginSuccess(data));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Google login failed';
      dispatch(loginFailure(message));
      toast.error(message);
      throw err;
    }
  };

  // Check if current token is valid
  const checkAuthStatus = async () => {
    try {
      if (!token) return false;
      
      const data = await authApi.getProfile();
      dispatch(loginSuccess({ user: data, token }));
      return true;
    } catch (err) {
      // Token is invalid, logout user
      logout();
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    dispatch(logoutAction());
    toast.info('Logged out successfully');
    navigate('/');
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    googleLogin,
    logout,
    checkAuthStatus
  };
};

export default useAuth;
