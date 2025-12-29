// Main App component with routing
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import ThemeContextProvider from './contexts/ThemeContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
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
import DocumentSummarizer from './pages/DocumentSummarizer';
import LifeAdmin from './pages/LifeAdmin';
import SharedNote from './pages/SharedNote';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Toast Notification Component
import ToastNotification from './components/ToastNotification';

function App() {
  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Landing />} />
            
            {/* Auth Routes - Two-sided design for Login/Signup */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
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
              <Route path="/life-admin" element={<LifeAdmin />} />
              <Route path="/dictionary" element={<Dictionary />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/translator" element={<Translator />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/math" element={<Math />} />
              <Route path="/document-summarizer" element={<DocumentSummarizer />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <ToastNotification />
      </ThemeContextProvider>
    </Provider>
  );
}

export default App;
