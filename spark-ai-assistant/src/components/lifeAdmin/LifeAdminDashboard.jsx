// Life Admin Dashboard Component - Overview and statistics
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Assignment as ObligationsIcon,
  Task as TasksIcon,
  Notifications as RemindersIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

import { checkDeadlines, renewRecurring, fetchDashboardStats } from '../../store/slices/lifeAdminSlice';
import toast from '../../utils/toast';

const LifeAdminDashboard = ({ stats, loading, onCreateObligation }) => {
  const dispatch = useDispatch();
  const [jobsRunning, setJobsRunning] = useState(false);

  // Handle background jobs
  const handleCheckDeadlines = async () => {
    setJobsRunning(true);
    try {
      await dispatch(checkDeadlines()).unwrap();
      toast.success('Deadline check completed');
      dispatch(fetchDashboardStats());
    } catch (error) {
      toast.error('Failed to check deadlines');
    } finally {
      setJobsRunning(false);
    }
  };

  const handleRenewRecurring = async () => {
    setJobsRunning(true);
    try {
      await dispatch(renewRecurring()).unwrap();
      toast.success('Recurring obligations renewed');
      dispatch(fetchDashboardStats());
    } catch (error) {
      toast.error('Failed to renew recurring obligations');
    } finally {
      setJobsRunning(false);
    }
  };

  const handleRefreshStats = () => {
    dispatch(fetchDashboardStats());
  };

  // Calculate completion percentage
  const getCompletionPercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  // Get urgency color
  const getUrgencyColor = (count, total) => {
    if (total === 0) return 'success';
    const percentage = (count / total) * 100;
    if (percentage > 20) return 'error';
    if (percentage > 10) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Life Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefreshStats}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateObligation}
          >
            Add Obligation
          </Button>
        </Box>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Obligations Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ObligationsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Obligations</Typography>
              </Box>
              
              <Typography variant="h3" color="primary" gutterBottom>
                {stats.obligations?.total || 0}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Completion Rate</Typography>
                  <Typography variant="body2">
                    {getCompletionPercentage(stats.obligations?.completed || 0, stats.obligations?.total || 0)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={getCompletionPercentage(stats.obligations?.completed || 0, stats.obligations?.total || 0)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Chip
                    icon={<SuccessIcon />}
                    label={`${stats.obligations?.active || 0} Active`}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    icon={<SuccessIcon />}
                    label={`${stats.obligations?.completed || 0} Done`}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tasks Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TasksIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Tasks</Typography>
              </Box>
              
              <Typography variant="h3" color="secondary" gutterBottom>
                {stats.tasks?.total || 0}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Completion Rate</Typography>
                  <Typography variant="body2">
                    {getCompletionPercentage(stats.tasks?.completed || 0, stats.tasks?.total || 0)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={getCompletionPercentage(stats.tasks?.completed || 0, stats.tasks?.total || 0)}
                  color="secondary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Chip
                    icon={<ScheduleIcon />}
                    label={`${stats.tasks?.pending || 0} Pending`}
                    color="secondary"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    icon={<TrendingUpIcon />}
                    label={`${stats.tasks?.high_priority || 0} High Priority`}
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Reminders Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RemindersIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Reminders</Typography>
              </Box>
              
              <Typography variant="h3" color="info.main" gutterBottom>
                {stats.reminders?.total || 0}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>Status Overview</Typography>
              </Box>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Chip
                    icon={<SuccessIcon />}
                    label={`${stats.reminders?.active || 0} Active`}
                    color="info"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    icon={<ScheduleIcon />}
                    label={`${stats.reminders?.upcoming || 0} Upcoming`}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Urgent Items and Actions */}
      <Grid container spacing={3}>
        {/* Urgent Items */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Urgent Items Requiring Attention
              </Typography>

              {/* Overdue Obligations */}
              {stats.obligations?.overdue > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {stats.obligations.overdue} Overdue Obligations
                      </Typography>
                      <Typography variant="body2">
                        These obligations have passed their due date and need immediate attention.
                      </Typography>
                    </Box>
                    <ErrorIcon />
                  </Box>
                </Alert>
              )}

              {/* High Risk Items */}
              {stats.obligations?.high_risk > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {stats.obligations.high_risk} High Risk Obligations
                      </Typography>
                      <Typography variant="body2">
                        These obligations have severe consequences if missed.
                      </Typography>
                    </Box>
                    <WarningIcon />
                  </Box>
                </Alert>
              )}

              {/* Due Soon */}
              {stats.obligations?.due_soon > 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {stats.obligations.due_soon} Obligations Due Soon
                      </Typography>
                      <Typography variant="body2">
                        These obligations are due within the next 7 days.
                      </Typography>
                    </Box>
                    <ScheduleIcon />
                  </Box>
                </Alert>
              )}

              {/* Overdue Reminders */}
              {stats.reminders?.overdue > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {stats.reminders.overdue} Overdue Reminders
                      </Typography>
                      <Typography variant="body2">
                        These reminders have been triggered and need your attention.
                      </Typography>
                    </Box>
                    <RemindersIcon />
                  </Box>
                </Alert>
              )}

              {/* No urgent items */}
              {(!stats.obligations?.overdue && !stats.obligations?.high_risk && 
                !stats.obligations?.due_soon && !stats.reminders?.overdue) && (
                <Alert severity="success">
                  <Typography variant="subtitle2" gutterBottom>
                    All Clear!
                  </Typography>
                  <Typography variant="body2">
                    No urgent items requiring immediate attention.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>

              <List>
                <ListItem>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleCheckDeadlines}
                    disabled={jobsRunning}
                  >
                    Check Deadlines
                  </Button>
                </ListItem>

                <ListItem>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ScheduleIcon />}
                    onClick={handleRenewRecurring}
                    disabled={jobsRunning}
                  >
                    Renew Recurring
                  </Button>
                </ListItem>

                <Divider sx={{ my: 1 }} />

                <ListItem>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onCreateObligation}
                  >
                    Add New Obligation
                  </Button>
                </ListItem>
              </List>

              {jobsRunning && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Running background job...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LifeAdminDashboard;