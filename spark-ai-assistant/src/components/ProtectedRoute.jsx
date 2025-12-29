// Protected Route component - redirects to login if not authenticated
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  
  console.log('🔐 ProtectedRoute check:', { 
    isAuthenticated, 
    hasToken: !!token, 
    currentPath: window.location.pathname 
  });

  // Check normal authentication
  if (!isAuthenticated && !token) {
    console.log('🔐 Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('🔐 Authenticated, rendering children');
  return children;
};

export default ProtectedRoute;
