// Reminders page component
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Fab
} from '@mui/material';
import {
  Notifications as ReminderIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  NotificationImportant as UrgentIcon
} from '@mui/icons-material';
import { fetchReminders, createReminder, updateReminder, deleteReminder, setFilter, setSortBy } from '../store/slices/remindersSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import notificationService from '../services/notificationService';
import toast from '../utils/toast';

const Reminders = () => {
  const dispatch = useDispatch();
  const { reminders = [], loading, error, filter, sortBy } = useSelector((state) => state.reminders);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reminderForm, setReminderForm] = useState({
    title: '',
    description: '',
    reminder_time: '',
    reminder_type: 'general',
    priority: 'medium'
  });

  useEffect(() => {
    dispatch(fetchReminders());
  }, [dispatch]);

  const handleCreateReminder = async () => {
    if (!reminderForm.title.trim()) {
      toast.error('Reminder title is required');
      return;
    }

    if (!reminderForm.reminder_time) {
      toast.error('Reminder time is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingReminder) {
        await dispatch(updateReminder({ id: editingReminder.id, updates: reminderForm })).unwrap();
        toast.success('Reminder updated successfully');
        notificationService.createNotification(
          'success',
          'Reminder Updated',
          `"${reminderForm.title}" has been updated`,
          { type: 'reminder_updated', actionUrl: '/reminders' }
        );
      } else {
        await dispatch(createReminder(reminderForm)).unwrap();
        toast.success('Reminder created successfully');
        notificationService.createNotification(
          'success',
          'Reminder Created',
          `"${reminderForm.title}" reminder has been created`,
          { type: 'reminder_created', actionUrl: '/reminders' }
        );
      }
      
      setShowReminderDialog(false);
      setEditingReminder(null);
      setReminderForm({ title: '', description: '', reminder_time: '', reminder_type: 'general', priority: 'medium' });
    } catch (error) {
      console.error('Reminder creation error:', error);
      toast.error(error || 'Failed to save reminder');
      notificationService.systemError(new Error(error || 'Failed to save reminder'), { context: 'reminder_creation' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder);
    setReminderForm({
      title: reminder.title || '',
      description: reminder.description || '',
      reminder_time: reminder.reminder_time ? new Date(reminder.reminder_time).toISOString().slice(0, 16) : '',
      reminder_type: reminder.reminder_type || 'general',
      priority: reminder.priority || 'medium'
    });
    setShowReminderDialog(true);
  };

  const handleDeleteReminder = async (reminderId) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await dispatch(deleteReminder(reminderId)).unwrap();
        toast.success('Reminder deleted successfully');
        notificationService.createNotification(
          'info',
          'Reminder Deleted',
          'Reminder has been deleted',
          { type: 'reminder_deleted', actionUrl: '/reminders' }
        );
      } catch (error) {
        toast.error(error || 'Failed to delete reminder');
        notificationService.systemError(new Error(error || 'Failed to delete reminder'), { context: 'reminder_deletion' });
      }
    }
  };

  const filteredReminders = Array.isArray(reminders) ? reminders.filter(reminder => {
    const now = new Date();
    const reminderTime = new Date(reminder.reminder_time);
    
    if (filter === 'all') return true;
    if (filter === 'upcoming') return reminderTime > now && !reminder.triggered;
    if (filter === 'past') return reminderTime <= now || reminder.triggered;
    return true;
  }) : [];

  const sortedReminders = [...filteredReminders].sort((a, b) => {
    if (sortBy === 'reminderTime') {
      return new Date(a.reminder_time) - new Date(b.reminder_time);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'created') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'meeting': return 'primary';
      case 'task': return 'secondary';
      case 'event': return 'success';
      case 'general': return 'default';
      default: return 'default';
    }
  };

  const isOverdue = (reminderTime) => {
    return new Date(reminderTime) < new Date();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ReminderIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700}>
              Reminders
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Never miss important events and tasks
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                {reminders.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Reminders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {Array.isArray(reminders) ? reminders.filter(r => new Date(r.reminder_time) > new Date() && !r.triggered).length : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                {Array.isArray(reminders) ? reminders.filter(r => new Date(r.reminder_time) < new Date() && !r.triggered).length : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overdue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                {Array.isArray(reminders) ? reminders.filter(r => r.triggered).length : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Sort */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            label="Filter"
            onChange={(e) => dispatch(setFilter(e.target.value))}
          >
            <MenuItem value="all">All Reminders</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="past">Past</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => dispatch(setSortBy(e.target.value))}
          >
            <MenuItem value="reminderTime">Reminder Time</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="created">Created</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Reminders List */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <LoadingSpinner 
                size={32} 
                type="modern" 
                color="#667eea" 
                text="Loading reminders..." 
              />
            </Box>
          ) : sortedReminders.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <ReminderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No reminders found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create your first reminder to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowReminderDialog(true)}
              >
                Create Reminder
              </Button>
            </Box>
          ) : (
            <List>
              {sortedReminders.map((reminder, index) => (
                <ListItem
                  key={reminder.id}
                  divider={index < sortedReminders.length - 1}
                  sx={{
                    opacity: reminder.triggered ? 0.7 : 1,
                    backgroundColor: isOverdue(reminder.reminder_time) && !reminder.triggered ? 'rgba(244, 67, 54, 0.1)' : 'transparent'
                  }}
                >
                  <ListItemIcon>
                    {isOverdue(reminder.reminder_time) && !reminder.triggered ? (
                      <UrgentIcon color="error" />
                    ) : (
                      <ReminderIcon color={reminder.triggered ? 'disabled' : 'primary'} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight={reminder.triggered ? 400 : 600}>
                          {reminder.title}
                        </Typography>
                        <Chip
                          label={reminder.priority}
                          size="small"
                          color={getPriorityColor(reminder.priority)}
                          variant="outlined"
                        />
                        <Chip
                          label={reminder.reminder_type}
                          size="small"
                          color={getTypeColor(reminder.reminder_type)}
                        />
                        {reminder.triggered && (
                          <Chip
                            label="Completed"
                            size="small"
                            color="success"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        {reminder.description && (
                          <Typography variant="body2" color="text.secondary">
                            {reminder.description}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography 
                            variant="caption" 
                            color={isOverdue(reminder.reminder_time) && !reminder.triggered ? 'error' : 'text.secondary'}
                          >
                            {new Date(reminder.reminder_time).toLocaleString()}
                            {isOverdue(reminder.reminder_time) && !reminder.triggered && ' (Overdue)'}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditReminder(reminder)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteReminder(reminder.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add reminder"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setShowReminderDialog(true)}
      >
        <AddIcon />
      </Fab>

      {/* Reminder Dialog */}
      <Dialog open={showReminderDialog} onClose={() => setShowReminderDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingReminder ? 'Edit Reminder' : 'Create New Reminder'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reminder Title"
                value={reminderForm.title}
                onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={reminderForm.description}
                onChange={(e) => setReminderForm({ ...reminderForm, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reminder Time"
                type="datetime-local"
                value={reminderForm.reminder_time}
                onChange={(e) => setReminderForm({ ...reminderForm, reminder_time: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={reminderForm.reminder_type}
                  label="Type"
                  onChange={(e) => setReminderForm({ ...reminderForm, reminder_type: e.target.value })}
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="task">Task</MenuItem>
                  <MenuItem value="event">Event</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={reminderForm.priority}
                  label="Priority"
                  onChange={(e) => setReminderForm({ ...reminderForm, priority: e.target.value })}
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
          <Button onClick={() => setShowReminderDialog(false)} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleCreateReminder} 
            variant="contained" 
            disabled={submitting}
            startIcon={submitting ? <LoadingSpinner size={16} type="spin" color="#fff" /> : null}
          >
            {submitting ? 'Saving...' : (editingReminder ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reminders;