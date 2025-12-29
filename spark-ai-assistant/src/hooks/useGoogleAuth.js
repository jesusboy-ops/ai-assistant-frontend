// Google OAuth hook
import { useCallback } from 'react';
import useAuth from './useAuth';
import toast from '../utils/toast';

const useGoogleAuth = () => {
  const { googleLogin } = useAuth();

  // Handle Google Sign-In button click with improved flow
  const handleGoogleSignIn = useCallback(async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    // Check if Google OAuth is properly configured
    if (!clientId || clientId === 'your_google_client_id_here' || clientId === 'test_client_id_for_ui_display') {
      toast.error('Google OAuth is not configured. Please set up a real Google Client ID in your environment variables.');
      return;
    }

    try {
      // TEMPORARY FIX: Generate OAuth URL directly on frontend
      // This bypasses the backend URL generation issue
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
      
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', scope);
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'select_account');

      console.log('Starting Google OAuth flow with redirect URI:', redirectUri);
      console.log('Generated OAuth URL:', authUrl.toString());
      
      // DEBUG: Alert to confirm we're using the frontend-generated URL
      alert(`Using frontend OAuth URL: ${authUrl.toString().substring(0, 100)}...`);
      
      // Redirect to the OAuth URL
      window.location.href = authUrl.toString();

    } catch (error) {
      console.error('Google Sign-In error:', error);
      toast.error('Failed to start Google Sign-In. Please try again.');
    }
  }, []);

  // Check if Google OAuth is configured
  const isGoogleConfigured = useCallback(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    return clientId && clientId !== 'your_google_client_id_here' && clientId !== 'test_client_id_for_ui_display';
  }, []);

  return {
    handleGoogleSignIn,
    isGoogleConfigured
  };
};

export default useGoogleAuth;