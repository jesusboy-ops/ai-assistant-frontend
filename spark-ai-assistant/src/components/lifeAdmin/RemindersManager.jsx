// Reminders Manager Component - Handle obligation and task reminders
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationImportant as UrgentIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CompletedIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Snooze as SnoozeIcon
} from '@mui/icons-material';

import lifeAdminApi from '../../api/lifeAdminApi';
import { createReminder, updateReminder, deleteReminder } from '../../store/slices/remindersSlice';
import toast from '../../utils/toast';

const RemindersManager = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [reminders, setReminders] = useState({
    active: [],
    upcoming: [],
    overdue: []
  });
  const [loading, setLoading] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  
  const [reminderForm, setReminderForm] = useState({
    title: '',
    description: '',
    reminder_date: '',
    priority: 'medium',
    obligation_id: '',
    task_id: ''
  });

  // Load reminders on component mount
  useEffect(() => {
    loadReminders();
  }, []);

  // Load reminders from API
  const loadReminders = async () => {
    setLoading(true);
    try {
      const [active, upcoming, overdue] = await Promise.all([
        lifeAdminApi.reminders.getActive(),
        lifeAdminApi.reminders.getUpcoming(),
        lifeAdminApi.reminders.getOverdue()
      ]);
      
      setReminders({
        active: active.data || [],
        upcoming: upcoming.data || [],
        overdue: overdue.data || []
      });
    } catch (error) {
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle reminder form changes
  const handleReminderFormChange = (field, value) => {
    setReminderForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle new reminder
  const handleNewReminder = () => {
    setSelectedReminder(null);
    setReminderForm({
      title: '',
      description: '',
      reminder_date: '',
      priority: 'medium',
      obligation_id: '',
      task_id: ''
    });
    setShowReminderDialog(true);
  };

  // Handle edit reminder
  const handleEditReminder = (reminder) => {
    setSelectedReminder(reminder);
    setReminderForm({
      title: reminder.title || '',
      description: reminder.description || '',
      reminder_date: reminder.reminder_date || '',
      priority: reminder.priority || 'medium',
      obligation_id: reminder.obligation_id || '',
      task_id: reminder.task_id || ''
    });
    setShowReminderDialog(true);
  };

  // Handle save reminder
  const handleSaveReminder = async () => {
    if (!reminderForm.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      if (selectedReminder) {
        await dispatch(updateReminder({
          id: selectedReminder.id,
          data: reminderForm
        })).unwrap();
        toast.success('Reminder updated successfully');
      } else {
        await dispatch(createReminder(reminderForm)).unwrap();
        toast.success('Reminder created successfully');
      }
      
      setShowReminderDialog(false);
      loadReminders();
    } catch (error) {
      toast.error('Failed to save reminder');
    }
  };

  // Handle delete reminder
  const handleDeleteReminder = async (reminderId) => {
    try {
      await dispatch(deleteReminder(reminderId)).unwrap();
      toast.success('Reminder deleted successfully');
      loadReminders();
    } catch (error) {
      toast.error('Failed to delete reminder');
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <UrgentIcon />;
      case 'medium': return <WarningIcon />;
      case 'low': return <NotificationsIcon />;
      default: return <NotificationsIcon />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render reminder list
  const renderReminderList = (reminderList, type) => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (reminderList.length === 0) {
      return (
        <Alert severity="info">
          No {type} reminders found.
        </Alert>
      );
    }

    return (
      <List>
        {reminderList.map((reminder) => (
          <ListItem key={reminder.id} divider>
            <ListItemIcon>
              {getPriorityIcon(reminder.priority)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2">
                    {reminder.title}
                  </Typography>
                  <Chip 
                    label={reminder.priority} 
                    color={getPriorityColor(reminder.priority)}
                    size="small"
                  />
                </Box>
              }
              secondary={
                <Box>
                  {reminder.description && (
                    <Typography variant="body2" color="text.secondary">
                      {reminder.description}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(reminder.reminder_date)}
                  </Typography>
                  {reminder.obligation_title && (
                    <Typography variant="caption" color="primary" sx={{ display: 'block' }}>
                      Related to: {reminder.obligation_title}
                    </Typography>
                  )}
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleEditReminder(reminder)}
                size="small"
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleDeleteReminder(reminder.id)}
                size="small"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  };

  const tabs = [
    { 
      label: 'Active', 
      count: reminders.active.length,
      icon: <NotificationsIcon />
    },
    { 
      label: 'Upcoming', 
      count: reminders.upcoming.length,
      icon: <ScheduleIcon />
    },
    { 
      label: 'Overdue', 
      count: reminders.overdue.length,
      icon: <WarningIcon />
    }
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NotificationsIcon color="primary" sx={{ mr: 2 }} />
          <Box>
            <Typography variant="h5" component="h2">
              Reminders Manager
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage reminders for obligations and tasks
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewReminder}
        >
          Add Reminder
        </Button>
      </Box>

      {/* Reminder Categories */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Badge badgeContent={tab.count} color="primary">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tab.icon}
                      {tab.label}
                    </Box>
                  </Badge>
                }
              />
            ))}
          </Tabs>
        </Box>

        <CardContent>
          {/* Active Reminders */}
          {activeTab === 0 && renderReminderList(reminders.active, 'active')}
          
          {/* Upcoming Reminders */}
          {activeTab === 1 && renderReminderList(reminders.upcoming, 'upcoming')}
          
          {/* Overdue Reminders */}
          {activeTab === 2 && renderReminderList(reminders.overdue, 'overdue')}
        </CardContent>
      </Card>

      {/* Reminder Schedule Info */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Automatic Reminder Schedule
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Alert severity="error">
                <Typography variant="subtitle2" gutterBottom>
                  High Risk Obligations
                </Typography>
                <Typography variant="body2">
                  Reminders: 14, 7, 3, 1 days before due date
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={4}>
              <Alert severity="warning">
                <Typography variant="subtitle2" gutterBottom>
                  Medium Risk Obligations
                </Typography>
                <Typography variant="body2">
                  Reminders: 7, 3, 1 days before due date
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={4}>
              <Alert severity="success">
                <Typography variant="subtitle2" gutterBottom>
                  Low Risk Obligations
                </Typography>
                <Typography variant="body2">
                  Reminders: 3, 1 days before due date
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reminder Form Dialog */}
      <Dialog 
        open={showReminderDialog} 
        onClose={() => setShowReminderDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedReminder ? 'Edit Reminder' : 'Create New Reminder'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={reminderForm.title}
                onChange={(e) => handleReminderFormChange('title', e.target.value)}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={reminderForm.description}
                onChange={(e) => handleReminderFormChange('description', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reminder Date & Time"
                type="datetime-local"
                value={reminderForm.reminder_date}
                onChange={(e) => handleReminderFormChange('reminder_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={reminderForm.priority}
                  label="Priority"
                  onChange={(e) => handleReminderFormChange('priority', e.target.value)}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReminderDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveReminder} 
            variant="contained"
          >
            {selectedReminder ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RemindersManager;