// Dashboard Layout - Dark mode with sidebar and header
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import UnifiedSearch from '../components/UnifiedSearch';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

const DashboardLayout = () => {
  console.log('🏠 DashboardLayout rendering...');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [unifiedSearchOpen, setUnifiedSearchOpen] = useState(false);

  // Global keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlKey: true,
      callback: () => setUnifiedSearchOpen(true)
    },
    {
      key: '/',
      callback: (e) => {
        // Only trigger if not in an input field
        if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
          setUnifiedSearchOpen(true);
        }
      }
    }
  ]);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleUnifiedSearchClose = () => {
    setUnifiedSearchOpen(false);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#0f0f23',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen}
        onClose={handleSidebarClose}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          marginLeft: isMobile ? 0 : sidebarCollapsed ? '90px' : '290px',
          transition: 'margin-left 0.3s ease',
          position: 'relative'
        }}
      >
        {/* Header */}
        <Header 
          onSidebarToggle={handleSidebarToggle} 
          onSearchOpen={() => setUnifiedSearchOpen(true)}
        />

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            height: 'calc(100vh - 64px)', // Subtract header height
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: { xs: 1.5, sm: 2, md: 3 },
            paddingLeft: { xs: 1.5, sm: 2, md: 2 }, // Closer to sidebar
          }}
        >
          {console.log('🏠 DashboardLayout rendering Outlet...')}
          <Outlet />
        </Box>

        {/* Global Unified Search */}
        <UnifiedSearch 
          open={unifiedSearchOpen} 
          onClose={handleUnifiedSearchClose} 
        />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
