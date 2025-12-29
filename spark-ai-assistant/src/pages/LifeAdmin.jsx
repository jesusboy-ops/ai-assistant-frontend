// Life Admin Manager - Main page for managing life obligations
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Badge,
  Button
} from '@mui/material';
import { 
  Assignment as ObligationsIcon,
  Dashboard as DashboardIcon,
  Psychology as AIIcon,
  Email as EmailIcon,
  Notifications as RemindersIcon,
  Notes as NotesIcon
} from '@mui/icons-material';

import PageHeader from '../components/PageHeader';
import ObligationsList from '../components/lifeAdmin/ObligationsList';
import ObligationForm from '../components/lifeAdmin/ObligationForm';
import AIPlanGenerator from '../components/lifeAdmin/AIPlanGenerator';
import LifeAdminDashboard from '../components/lifeAdmin/LifeAdminDashboard';
import EmailManager from '../components/lifeAdmin/EmailManager';
import RemindersManager from '../components/lifeAdmin/RemindersManager';
import NotesAnalysis from '../components/lifeAdmin/NotesAnalysis';
import { 
  fetchObligations, 
  fetchDashboardStats,
  setFilters,
  setPagination 
} from '../store/slices/lifeAdminSlice';

const LifeAdmin = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [showObligationForm, setShowObligationForm] = useState(false);
  
  const { 
    obligations, 
    obligationsLoading, 
    obligationsError,
    stats,
    statsLoading,
    filters,
    pagination 
  } = useSelector((state) => state.lifeAdmin);

  useEffect(() => {
    // Load initial data only if authenticated
    if (isAuthenticated) {
      dispatch(fetchDashboardStats());
      dispatch(fetchObligations({ 
        ...filters, 
        page: pagination.page, 
        limit: pagination.limit 
      }));
    }
  }, [dispatch, isAuthenticated, filters, pagination.page, pagination.limit]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCreateObligation = () => {
    setShowObligationForm(true);
  };

  const handleCloseForm = () => {
    setShowObligationForm(false);
  };

  // Calculate urgent counts for badges
  const getUrgentCount = () => {
    return (stats.obligations?.overdue || 0) + 
           (stats.obligations?.high_risk || 0) + 
           (stats.reminders?.overdue || 0);
  };

  const tabs = [
    { 
      label: 'Dashboard', 
      icon: <DashboardIcon />,
      badge: getUrgentCount()
    },
    { 
      label: 'Obligations', 
      icon: <ObligationsIcon />,
      badge: stats.obligations?.overdue || 0
    },
    { 
      label: 'AI Planner', 
      icon: <AIIcon />
    },
    { 
      label: 'Email Manager', 
      icon: <EmailIcon />
    },
    { 
      label: 'Reminders', 
      icon: <RemindersIcon />,
      badge: stats.reminders?.overdue || 0
    },
    { 
      label: 'Notes Analysis', 
      icon: <NotesIcon />
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader
        title="Life Admin Manager"
        subtitle="Manage your life obligations, tasks, and deadlines with AI assistance"
      />

      {/* Authentication Check */}
      {!isAuthenticated && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please log in to access your life admin features.
        </Alert>
      )}

      {/* Error Display */}
      {(obligationsError || statsLoading) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {obligationsError}
        </Alert>
      )}

      {isAuthenticated && (
        <>
          {/* Urgent Items Alert */}
          {getUrgentCount() > 0 && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                {getUrgentCount()} Urgent Items Require Attention
              </Typography>
              <Typography variant="body2">
                You have {stats.obligations?.overdue || 0} overdue obligations, {' '}
                {stats.obligations?.high_risk || 0} high-risk items, and {' '}
                {stats.reminders?.overdue || 0} overdue reminders.
          </Typography>
        </Alert>
      )}

      {/* Main Content */}
      <Paper sx={{ mt: 3 }}>
        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  tab.badge > 0 ? (
                    <Badge badgeContent={tab.badge} color="error">
                      {tab.label}
                    </Badge>
                  ) : tab.label
                }
                icon={tab.icon}
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {/* Dashboard Tab */}
          {activeTab === 0 && (
            <LifeAdminDashboard 
              stats={stats}
              loading={statsLoading}
              onCreateObligation={handleCreateObligation}
            />
          )}

          {/* Obligations Tab */}
          {activeTab === 1 && (
            <Box>
              <ObligationsList
                obligations={obligations}
                loading={obligationsLoading}
                onCreateObligation={handleCreateObligation}
              />
              
              {/* Obligation Form Modal */}
              <ObligationForm
                open={showObligationForm}
                onClose={handleCloseForm}
                obligation={null}
              />
            </Box>
          )}

          {/* AI Planner Tab */}
          {activeTab === 2 && (
            <AIPlanGenerator />
          )}

          {/* Email Manager Tab */}
          {activeTab === 3 && (
            <EmailManager />
          )}

          {/* Reminders Tab */}
          {activeTab === 4 && (
            <RemindersManager />
          )}

          {/* Notes Analysis Tab */}
          {activeTab === 5 && (
            <NotesAnalysis />
          )}
        </Box>
      </Paper>
        </>
      )}
    </Container>
  );
};

export default LifeAdmin;