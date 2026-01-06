// Custom hook for authentication
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout as logoutAction,
  loginUser,
  registerUser,
  forgotPasswordRequest
} from '../store/slices/authSlice';
import authApi from '../api/authApi';
import toast from '../utils/toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Login function using async thunk
  const login = async (email, password) => {
    try {
      console.log('🔐 Starting login process...');
      const result = await dispatch(loginUser({ email, password })).unwrap();
      
      toast.success('Login successful!');
      navigate('/dashboard');
      return result;
    } catch (err) {
      console.error('❌ Login failed:', err);
      toast.error(err);
      throw new Error(err);
    }
  };

  // Register function using async thunk
  const register = async (email, password, name) => {
    try {
      console.log('🔐 Starting registration process...');
      const result = await dispatch(registerUser({ email, password, name })).unwrap();
      
      toast.success('Registration successful!');
      navigate('/dashboard');
      return result;
    } catch (err) {
      console.error('❌ Registration failed:', err);
      toast.error(err);
      throw new Error(err);
    }
  };

  // Forgot password function using async thunk
  const forgotPassword = async (email) => {
    try {
      console.log('🔐 Starting forgot password process...');
      const result = await dispatch(forgotPasswordRequest(email)).unwrap();
      
      toast.success('Password reset email sent!');
      return result;
    } catch (err) {
      console.error('❌ Forgot password failed:', err);
      toast.error(err);
      throw new Error(err);
    }
  };

  // Google login function (keeping original implementation)
  const googleLogin = async (tokenOrIdToken, userData = null) => {
    try {
      dispatch(loginStart());
      
      let data;
      if (userData) {
        // If userData is provided, we already have the processed data from callback
        data = { token: tokenOrIdToken, user: userData };
      } else {
        // If only token is provided, call the backend API
        // Add timeout handling
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Google login timeout')), 10000);
        });
        
        const loginPromise = authApi.googleLogin(tokenOrIdToken);
        data = await Promise.race([loginPromise, timeoutPromise]);
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      dispatch(loginSuccess(data));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      let message = 'Google login failed';
      
      if (err.message === 'Google login timeout') {
        message = 'Google login timed out. Please try again.';
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        message = 'Connection timed out. Please try again.';
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      
      dispatch(loginFailure(message));
      toast.error(message);
      throw err;
    }
  };

  // Check if current token is valid (with timeout)
  const checkAuthStatus = async () => {
    try {
      if (!token) return false;
      
      // Add timeout handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Auth check timeout')), 3000); // Reduced to 3 seconds
      });
      
      const profilePromise = authApi.getProfile();
      const data = await Promise.race([profilePromise, timeoutPromise]);
      
      dispatch(loginSuccess({ user: data, token }));
      return true;
    } catch (err) {
      console.log('❌ Auth check failed:', err.message);
      // Token is invalid or timed out, logout user
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
    navigate('/'); // Redirect to main page instead of login
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
    checkAuthStatus,
    forgotPassword
  };
};

export default useAuth;
