// Calendar page
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  IconButton,
  alpha
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { addEvent, deleteEvent, updateEvent } from '../store/slices/calendarSlice';
import PageHeader from '../components/PageHeader';
import toast from '../utils/toast';

const Calendar = () => {
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.calendar);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    color: '#667eea'
  });

  const eventColors = [
    { name: 'Blue', value: '#667eea' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Cyan', value: '#06b6d4' }
  ];

  const handleOpenDialog = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description || '',
        date: event.date,
        time: event.time,
        color: event.color
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        color: '#667eea'
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEvent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter an event title');
      return;
    }

    const eventData = {
      ...formData,
      id: editingEvent ? editingEvent.id : Date.now().toString(),
      createdAt: editingEvent ? editingEvent.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingEvent) {
      dispatch(updateEvent(eventData));
      toast.success('Event updated successfully');
    } else {
      dispatch(addEvent(eventData));
      toast.success('Event created successfully');
    }

    handleCloseDialog();
  };

  const handleDeleteEvent = (eventId) => {
    dispatch(deleteEvent(eventId));
    toast.success('Event deleted successfully');
  };

  const formatEventDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEventTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
      <PageHeader
        title="Calendar"
        subtitle="Manage your events and schedule"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              paddingX: 3,
              paddingY: 1.25,
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
                }
            }}
          >
            Create Event
          </Button>
        }
      />

      {/* Events List */}
      {events.length === 0 ? (
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: 3
            }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
                color: 'text.secondary'
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha('#f59e0b', 0.2)} 0%, ${alpha('#f59e0b', 0.1)} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 3
                }}
              >
                <CalendarIcon sx={{ fontSize: 64, color: '#f59e0b' }} />
              </Box>
              <Typography variant="h5" sx={{ marginBottom: 1.5, fontWeight: 600 }}>
                No Events Yet
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 4, textAlign: 'center', maxWidth: 500, opacity: 0.8 }}>
                Create your first event to start organizing your schedule
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  paddingX: 4,
                  paddingY: 1.5,
                  fontWeight: 600
                }}
              >
                Create Your First Event
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {events
            .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
            .map((event) => (
              <Grid item xs={12} md={6} lg={4} key={event.id}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
                    border: `1px solid ${alpha(event.color, 0.3)}`,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                      }
                  }}
                >
                  <CardContent sx={{ padding: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${event.color} 0%, ${alpha(event.color, 0.8)} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                          }}
                      >
                        <EventIcon sx={{ color: 'white', fontSize: 24 }} />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(event)}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              color: event.color,
                              backgroundColor: alpha(event.color, 0.1)
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteEvent(event.id)}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              color: '#ef4444',
                              backgroundColor: alpha('#ef4444', 0.1)
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 1, color: 'white' }}>
                      {event.title}
                    </Typography>

                    {event.description && (
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: 2, lineHeight: 1.5 }}>
                        {event.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip
                        label={formatEventDate(event.date)}
                        size="small"
                        sx={{
                          backgroundColor: alpha(event.color, 0.2),
                          color: event.color,
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                      <Chip
                        label={formatEventTime(event.time)}
                        size="small"
                        sx={{
                          backgroundColor: alpha(event.color, 0.1),
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}

      {/* Create/Edit Event Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.5rem' }}>
          {editingEvent ? 'Edit Event' : 'Create New Event'}
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ marginBottom: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                Event Color
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {eventColors.map((color) => (
                  <Box
                    key={color.value}
                    onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: color.value,
                      cursor: 'pointer',
                      border: formData.color === color.value ? '3px solid white' : '2px solid transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: 3, gap: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              paddingX: 3,
              fontWeight: 600
            }}
          >
            {editingEvent ? 'Update Event' : 'Create Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
