// Calendar page component
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Fab
} from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CalendarMonth as CalendarIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import { fetchEvents, createEvent, updateEvent, deleteEvent, setCurrentDate } from '../store/slices/calendarSlice';
import toast from '../utils/toast';

const Calendar = () => {
  const dispatch = useDispatch();
  const { events: rawEvents, loading, error, currentDate } = useSelector((state) => state.calendar);
  
  // Ensure events is always an array with proper fallback
  const events = Array.isArray(rawEvents) ? rawEvents : (rawEvents ? [] : []);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    color: '#667eea',
    location: ''
  });

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleCreateEvent = async () => {
    if (!eventForm.title.trim()) {
      toast.error('Event title is required');
      return;
    }

    if (!eventForm.date) {
      toast.error('Event date is required');
      return;
    }

    try {
      if (editingEvent) {
        await dispatch(updateEvent({ id: editingEvent.id, updates: eventForm })).unwrap();
        toast.success('Event updated successfully');
      } else {
        await dispatch(createEvent(eventForm)).unwrap();
        toast.success('Event created successfully');
      }
      
      setShowEventDialog(false);
      setEditingEvent(null);
      setEventForm({ title: '', description: '', date: '', time: '', duration: 60, color: '#667eea', location: '' });
    } catch (error) {
      toast.error(error || 'Failed to save event');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title || '',
      description: event.description || '',
      date: event.date || '',
      time: event.time || '',
      duration: event.duration || 60,
      color: event.color || '#667eea',
      location: event.location || ''
    });
    setShowEventDialog(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await dispatch(deleteEvent(eventId)).unwrap();
        toast.success('Event deleted successfully');
      } catch (error) {
        toast.error(error || 'Failed to delete event');
      }
    }
  };

  const handleDateClick = (date) => {
    setEventForm({ ...eventForm, date: date });
    setShowEventDialog(true);
  };

  const navigateMonth = (direction) => {
    const current = new Date(currentDate);
    const newDate = new Date(current.getFullYear(), current.getMonth() + direction, 1);
    dispatch(setCurrentDate(newDate.toISOString().split('T')[0]));
  };

  const goToToday = () => {
    dispatch(setCurrentDate(new Date().toISOString().split('T')[0]));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const current = new Date(currentDate);
    const year = current.getFullYear();
    const month = current.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const iteratorDate = new Date(startDate); // Renamed to avoid conflict
    
    for (let i = 0; i < 42; i++) {
      // Ensure events is always an array before filtering
      const safeEvents = Array.isArray(events) ? events : [];
      const dayEvents = safeEvents.filter(event => {
        if (!event || !event.date) return false;
        try {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === iteratorDate.toDateString();
        } catch (e) {
          console.warn('Invalid event date:', event);
          return false;
        }
      });
      
      days.push({
        date: new Date(iteratorDate),
        dayNumber: iteratorDate.getDate(),
        isCurrentMonth: iteratorDate.getMonth() === month,
        isToday: iteratorDate.toDateString() === new Date().toDateString(),
        events: dayEvents
      });
      
      iteratorDate.setDate(iteratorDate.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const currentMonthYear = new Date(currentDate).toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const todaysEvents = Array.isArray(events) ? events.filter(event => {
    if (!event || !event.date) return false;
    try {
      const eventDate = new Date(event.date);
      const today = new Date();
      return eventDate.toDateString() === today.toDateString();
    } catch (e) {
      console.warn('Invalid event date:', event);
      return false;
    }
  }) : [];

  const upcomingEvents = Array.isArray(events) ? events
    .filter(event => {
      if (!event || !event.date) return false;
      try {
        const eventDate = new Date(event.date);
        const today = new Date();
        return eventDate > today;
      } catch (e) {
        console.warn('Invalid event date:', event);
        return false;
      }
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5) : [];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700}>
              Calendar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your events and schedule
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
                {events.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Events
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {todaysEvents.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Today's Events
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                {upcomingEvents.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming Events
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main">
                {new Date(currentDate).toLocaleDateString('en-US', { month: 'long' })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Calendar */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              {/* Calendar Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={() => navigateMonth(-1)}>
                    <PrevIcon />
                  </IconButton>
                  <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
                    {currentMonthYear}
                  </Typography>
                  <IconButton onClick={() => navigateMonth(1)}>
                    <NextIcon />
                  </IconButton>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<TodayIcon />}
                  onClick={goToToday}
                  size="small"
                >
                  Today
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <LoadingSpinner size={32} type="pulse" color="#06b6d4" text="Loading events..." />
                </Box>
              ) : (
                <>
                  {/* Days of Week Header */}
                  <Grid container sx={{ mb: 1 }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <Grid item xs key={day} sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="caption" fontWeight={600} color="text.secondary">
                          {day}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Calendar Grid */}
                  <Grid container>
                    {calendarDays.map((day, index) => (
                      <Grid item xs key={index} sx={{ aspectRatio: '1', minHeight: 80 }}>
                        <Box
                          sx={{
                            height: '100%',
                            border: '1px solid',
                            borderColor: 'divider',
                            p: 0.5,
                            cursor: 'pointer',
                            backgroundColor: day.isToday ? 'primary.light' : 'transparent',
                            opacity: day.isCurrentMonth ? 1 : 0.3,
                            '&:hover': {
                              backgroundColor: day.isToday ? 'primary.main' : 'action.hover'
                            }
                          }}
                          onClick={() => handleDateClick(day.date.toISOString().split('T')[0])}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: day.isToday ? 700 : 400,
                              color: day.isToday ? 'primary.contrastText' : 'text.primary'
                            }}
                          >
                            {day.dayNumber}
                          </Typography>
                          {day.events.map((event, eventIndex) => (
                            <Box
                              key={eventIndex}
                              sx={{
                                backgroundColor: event.color || '#667eea',
                                color: 'white',
                                fontSize: '0.6rem',
                                p: 0.25,
                                borderRadius: 0.5,
                                mb: 0.25,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {event.title}
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Today's Events */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Events
              </Typography>
              {todaysEvents.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No events scheduled for today
                </Typography>
              ) : (
                todaysEvents.map((event) => (
                  <Box
                    key={event.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      mb: 1,
                      borderRadius: 1,
                      backgroundColor: 'action.hover'
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {event.title}
                      </Typography>
                      {event.time && (
                        <Typography variant="caption" color="text.secondary">
                          {event.time}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleEditEvent(event)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteEvent(event.id)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Events
              </Typography>
              {upcomingEvents.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No upcoming events
                </Typography>
              ) : (
                upcomingEvents.map((event) => (
                  <Box
                    key={event.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      mb: 1,
                      borderRadius: 1,
                      backgroundColor: 'action.hover'
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(event.date).toLocaleDateString()}
                        {event.time && ` at ${event.time}`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleEditEvent(event)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteEvent(event.id)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add event"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setShowEventDialog(true)}
      >
        <AddIcon />
      </Fab>

      {/* Event Dialog */}
      <Dialog open={showEventDialog} onClose={() => setShowEventDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEvent ? 'Edit Event' : 'Create New Event'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                value={eventForm.time}
                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={eventForm.duration}
                onChange={(e) => setEventForm({ ...eventForm, duration: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color"
                type="color"
                value={eventForm.color}
                onChange={(e) => setEventForm({ ...eventForm, color: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEventDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateEvent} variant="contained">
            {editingEvent ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;