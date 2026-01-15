// Main App component with routing
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import CssBaseline from '@mui/material/CssBaseline';
import { store, persistor } from './store/store';
import ThemeContextProvider from './contexts/ThemeContext';
import LoadingSpinner from './components/LoadingSpinner';
import { wakeUpBackend } from './api/axios';
import { debugEnvironment } from './utils/envDebug';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignupPage from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// OAuth Components
import GoogleOAuthCallback from './components/GoogleOAuthCallback';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Emails from './pages/Emails';
import Notes from './pages/Notes';
import Calendar from './pages/Calendar';
import Files from './pages/Files';
import Settings from './pages/Settings';
import PdfScanner from './pages/PdfScanner';
import Dictionary from './pages/Dictionary';
import Tasks from './pages/Tasks';
import Translator from './pages/Translator';
import Reminders from './pages/Reminders';
import Math from './pages/Math';
import SharedNote from './pages/SharedNote';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Toast Notification Component
import ToastNotification from './components/ToastNotification';

function App() {
  // Debug environment variables on app load
  useEffect(() => {
    debugEnvironment();
    wakeUpBackend();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner size={32} type="modern" text="Loading..." fullScreen />} persistor={persistor}>
        <ThemeContextProvider>
          <CssBaseline />
          <Router>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Landing />} />
            
            {/* Auth Routes - Two-sided design for Login/Signup */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* OAuth Callback Route */}
            <Route path="/auth/google/callback" element={<GoogleOAuthCallback />} />
            
            {/* Shared Content Routes - Public */}
            <Route path="/shared/notes/:noteId" element={<SharedNote />} />
            
            {/* Other Auth Routes - Use AuthLayout */}
            <Route element={<AuthLayout />}>
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Dashboard Routes - Protected */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/emails" element={<Emails />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/files" element={<Files />} />
              <Route path="/pdf-scanner" element={<PdfScanner />} />
              <Route path="/dictionary" element={<Dictionary />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/translator" element={<Translator />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/math" element={<Math />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <ToastNotification />
      </ThemeContextProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
