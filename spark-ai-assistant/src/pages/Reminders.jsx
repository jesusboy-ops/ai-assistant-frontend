// Reminders page - Smart Reminders System
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  NotificationsActive as NotificationsActiveIcon,
  Schedule as ScheduleIcon,
  Check as CheckIcon,
  SmartToy as SmartToyIcon,
  AccessTime as AccessTimeIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  fetchReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  completeReminder,
  fetchUpcomingReminders,
  setFilter,
  setSortBy
} from '../store/slices/remindersSlice';
import { showToast } from '../utils/toast';
import PageHeader from '../components/PageHeader';

const Reminders = () => {
  const dispatch = useDispatch();
  const {
    reminders,
    upcomingReminders,
    loading,
    error,
    filter,
    sortBy
  } = useSelector((state) => state.reminders);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [reminderForm, setReminderForm] = useState({
    title: '',
    description: '',
    reminder_time: null,
    reminder_type: 'personal', // Add reminder type field
    repeat_type: 'none',
    repeat_interval: 1
  });

  useEffect(() => {
    dispatch(fetchReminders());
    dispatch(fetchUpcomingReminders());
  }, [dispatch]);

  const handleCreateReminder = async () => {
    if (!reminderForm.title.trim()) {
      showToast.error('Reminder title is required');
      return;
    }

    if (!reminderForm.reminder_time) {
      showToast.error('Reminder date is required');
      return;
    }

    try {
      // Format the data to match backend expectations
      const formattedReminderData = {
        title: reminderForm.title,
        description: reminderForm.description,
        reminder_time: reminderForm.reminder_time instanceof Date 
          ? reminderForm.reminder_time.toISOString()
          : new Date(reminderForm.reminder_time).toISOString(),
        reminder_type: reminderForm.reminder_type, // Add reminder type
        repeat_type: reminderForm.repeat_type,
        repeat_interval: reminderForm.repeat_interval
      };

      if (editingReminder) {
        await dispatch(updateReminder({
          reminderId: editingReminder.id,
          updates: formattedReminderData
        })).unwrap();
        showToast.success('Reminder updated successfully');
      } else {
        await dispatch(createReminder(formattedReminderData)).unwrap();
        showToast.success('Reminder created successfully');
      }
      
      setDialogOpen(false);
      resetForm();
      dispatch(fetchUpcomingReminders());
    } catch (error) {
      showToast.error(error);
    }
  };

  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder);
    setReminderForm({
      title: reminder.title,
      description: reminder.description || '',
      reminder_time: new Date(reminder.reminderDate || reminder.reminder_time), // Handle both field names
      reminder_type: reminder.type || 'personal', // Add reminder type handling
      repeat_type: reminder.repeatType || reminder.repeat_type || 'none',
      repeat_interval: reminder.repeat_interval || 1
    });
    setDialogOpen(true);
  };

  const handleDeleteReminder = async (reminderId) => {
    try {
      await dispatch(deleteReminder(reminderId)).unwrap();
      showToast.success('Reminder deleted successfully');
      dispatch(fetchUpcomingReminders());
    } catch (error) {
      showToast.error(error);
    }
  };

  const handleCompleteReminder = async (reminderId) => {
    try {
      await dispatch(completeReminder(reminderId)).unwrap();
      showToast.success('Reminder completed');
      dispatch(fetchUpcomingReminders());
    } catch (error) {
      showToast.error(error);
    }
  };

  const resetForm = () => {
    setReminderForm({
      title: '',
      description: '',
      reminder_time: null,
      reminder_type: 'personal',
      repeat_type: 'none',
      repeat_interval: 1
    });
    setEditingReminder(null);
  };

  const getFilteredReminders = () => {
    let filtered = [...reminders];

    // Apply filter
    switch (filter) {
      case 'pending':
        filtered = filtered.filter(reminder => !reminder.completed);
        break;
      case 'completed':
        filtered = filtered.filter(reminder => reminder.completed);
        break;
      case 'overdue':
        filtered = filtered.filter(reminder => {
          const reminderDate = reminder.reminderDate || reminder.reminder_time;
          return !reminder.completed && new Date(reminderDate) < new Date();
        });
        break;
      default:
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          const aDate = new Date(a.reminderDate || a.reminder_time);
          const bDate = new Date(b.reminderDate || b.reminder_time);
          return aDate - bDate;
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getTypeColor = (repeat_type) => {
    switch (repeat_type) {
      case 'daily': return '#3b82f6';
      case 'weekly': return '#f59e0b';
      case 'monthly': return '#10b981';
      case 'yearly': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const isOverdue = (reminder) => {
    const reminderDate = reminder.reminderDate || reminder.reminder_time;
    return !reminder.completed && new Date(reminderDate) < new Date();
  };

  const formatTimeUntil = (date) => {
    const now = new Date();
    const reminderDate = new Date(date);
    const diff = reminderDate - now;

    if (diff < 0) return 'Overdue';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const renderReminderDialog = () => (
    <Dialog
      open={dialogOpen}
      onClose={() => {
        setDialogOpen(false);
        resetForm();
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {editingReminder ? 'Edit Reminder' : 'Create New Reminder'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <TextField
            fullWidth
            label="Reminder Title"
            value={reminderForm.title}
            onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Description (Optional)"
            value={reminderForm.description}
            onChange={(e) => setReminderForm({ ...reminderForm, description: e.target.value })}
            multiline
            rows={3}
            variant="outlined"
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Reminder Date & Time"
              value={reminderForm.reminder_time}
              onChange={(newValue) => setReminderForm({ ...reminderForm, reminder_time: newValue })}
              renderInput={(params) => <TextField {...params} fullWidth />}
              minDateTime={new Date()}
            />
          </LocalizationProvider>

          <FormControl fullWidth>
            <InputLabel>Reminder Type</InputLabel>
            <Select
              value={reminderForm.reminder_type}
              onChange={(e) => setReminderForm({ ...reminderForm, reminder_type: e.target.value })}
              label="Reminder Type"
            >
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="meeting">Meeting</MenuItem>
              <MenuItem value="task">Task</MenuItem>
              <MenuItem value="event">Event</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Repeat Type</InputLabel>
            <Select
              value={reminderForm.repeat_type}
              onChange={(e) => setReminderForm({ ...reminderForm, repeat_type: e.target.value })}
              label="Repeat Type"
            >
              <MenuItem value="none">No Repeat</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>

          {reminderForm.repeat_type !== 'none' && (
            <TextField
              fullWidth
              label="Repeat Interval"
              type="number"
              value={reminderForm.repeat_interval}
              onChange={(e) => setReminderForm({ ...reminderForm, repeat_interval: parseInt(e.target.value) || 1 })}
              helperText={`Repeat every ${reminderForm.repeat_interval} ${reminderForm.repeat_type === 'daily' ? 'day(s)' : 
                reminderForm.repeat_type === 'weekly' ? 'week(s)' : 
                reminderForm.repeat_type === 'monthly' ? 'month(s)' : 'year(s)'}`}
              inputProps={{ min: 1, max: 365 }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setDialogOpen(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button
          onClick={handleCreateReminder}
          variant="contained"
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          {editingReminder ? 'Update' : 'Create'} Reminder
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderUpcomingReminders = () => (
    <Card sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#06b6d4', mb: 2 }}>
          Upcoming Reminders (Next 7 Days)
        </Typography>
        
        {upcomingReminders.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            No upcoming reminders
          </Typography>
        ) : (
          <List>
            {upcomingReminders.slice(0, 5).map((reminder) => (
              <ListItem key={reminder.id} disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={reminder.title}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={formatTimeUntil(reminder.reminderDate || reminder.reminder_time)}
                          size="small"
                          sx={{
                            backgroundColor: isOverdue(reminder) 
                              ? 'rgba(239, 68, 68, 0.2)' 
                              : 'rgba(6, 182, 212, 0.2)',
                            color: isOverdue(reminder) ? '#ef4444' : '#06b6d4'
                          }}
                        />
                        <Chip
                          label={reminder.type || reminder.repeat_type || 'none'}
                          size="small"
                          sx={{
                            backgroundColor: `${getTypeColor(reminder.type || reminder.repeat_type)}20`,
                            color: getTypeColor(reminder.type || reminder.repeat_type)
                          }}
                        />
                      </Box>
                    }
                    sx={{
                      '& .MuiListItemText-primary': { color: 'white' }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const renderReminderList = () => {
    const filteredReminders = getFilteredReminders();

    if (filteredReminders.length === 0) {
      return (
        <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
              No reminders found
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              {filter === 'all' ? 'Create your first reminder to get started' : `No ${filter} reminders`}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <List>
        {filteredReminders.map((reminder) => (
          <Card
            key={reminder.id}
            sx={{
              mb: 2,
              background: reminder.completed 
                ? 'rgba(16, 185, 129, 0.1)' 
                : isOverdue(reminder)
                ? 'rgba(239, 68, 68, 0.1)'
                : 'rgba(255, 255, 255, 0.05)',
              border: isOverdue(reminder) ? '1px solid rgba(239, 68, 68, 0.3)' : 'none'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      textDecoration: reminder.completed ? 'line-through' : 'none',
                      color: reminder.completed ? 'rgba(255, 255, 255, 0.5)' : 'white',
                      mb: 1
                    }}
                  >
                    {reminder.title}
                  </Typography>
                  
                  {reminder.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 2,
                        textDecoration: reminder.completed ? 'line-through' : 'none'
                      }}
                    >
                      {reminder.description}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={reminder.type || reminder.repeat_type || 'none'}
                      size="small"
                      sx={{
                        backgroundColor: `${getTypeColor(reminder.type || reminder.repeat_type)}20`,
                        color: getTypeColor(reminder.type || reminder.repeat_type)
                      }}
                    />
                    
                    <Chip
                      icon={<ScheduleIcon />}
                      label={new Date(reminder.reminderDate || reminder.reminder_time).toLocaleString()}
                      size="small"
                      sx={{
                        backgroundColor: isOverdue(reminder) 
                          ? 'rgba(239, 68, 68, 0.2)' 
                          : 'rgba(6, 182, 212, 0.2)',
                        color: isOverdue(reminder) ? '#ef4444' : '#06b6d4'
                      }}
                    />
                    
                    {!reminder.completed && (
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={formatTimeUntil(reminder.reminderDate || reminder.reminder_time)}
                        size="small"
                        sx={{
                          backgroundColor: isOverdue(reminder) 
                            ? 'rgba(239, 68, 68, 0.2)' 
                            : 'rgba(245, 158, 11, 0.2)',
                          color: isOverdue(reminder) ? '#ef4444' : '#f59e0b'
                        }}
                      />
                    )}

                    {(reminder.repeat_type !== 'none' || reminder.type !== 'general') && reminder.repeat_interval > 1 && (
                      <Chip
                        label={`Every ${reminder.repeat_interval} ${reminder.repeat_type || reminder.type}`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(139, 92, 246, 0.2)',
                          color: '#8b5cf6'
                        }}
                      />
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {!reminder.completed && (
                    <Tooltip title="Mark as completed">
                      <IconButton
                        onClick={() => handleCompleteReminder(reminder.id)}
                        sx={{ color: '#10b981' }}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Edit reminder">
                    <IconButton
                      onClick={() => handleEditReminder(reminder)}
                      sx={{ color: '#06b6d4' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete reminder">
                    <IconButton
                      onClick={() => handleDeleteReminder(reminder.id)}
                      sx={{ color: '#ef4444' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </List>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <PageHeader
        title="Reminders"
        subtitle="Smart reminders system with AI context detection"
        icon={<NotificationsActiveIcon />}
      />

      {/* Upcoming Reminders */}
      {renderUpcomingReminders()}

      {/* Controls */}
      <Card sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              variant="contained"
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              Create Reminder
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filter}
                  onChange={(e) => dispatch(setFilter(e.target.value))}
                  label="Filter"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => dispatch(setSortBy(e.target.value))}
                  label="Sort By"
                >
                  <MenuItem value="dueDate">Due Date</MenuItem>
                  <MenuItem value="createdAt">Created</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          {/* Reminder Stats */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#06b6d4', fontWeight: 700 }}>
                  {reminders.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Total Reminders
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                  {reminders.filter(r => !r.completed).length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Pending
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                  {reminders.filter(r => r.completed).length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Completed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 700 }}>
                  {reminders.filter(r => {
                    const reminderDate = r.reminderDate || r.reminder_time;
                    return !r.completed && new Date(reminderDate) < new Date();
                  }).length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Overdue
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Reminder List */}
      {!loading && renderReminderList()}

      {/* Reminder Dialog */}
      {renderReminderDialog()}
    </Container>
  );
};

export default Reminders;