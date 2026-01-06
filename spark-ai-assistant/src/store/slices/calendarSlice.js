// Calendar Redux slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import calendarApi from '../../api/calendarApi';

// Async thunks
export const fetchEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await calendarApi.getEvents();
      if (response.success) {
        const events = response.data || [];
        return Array.isArray(events) ? events : [];
      } else {
        return rejectWithValue(response.error || 'Failed to fetch events');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch events');
    }
  }
);

export const createEvent = createAsyncThunk(
  'calendar/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await calendarApi.createEvent(eventData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to create event');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'calendar/updateEvent',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await calendarApi.updateEvent(id, updates);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to update event');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'calendar/deleteEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await calendarApi.deleteEvent(eventId);
      if (response.success) {
        return eventId;
      } else {
        return rejectWithValue(response.error || 'Failed to delete event');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete event');
    }
  }
);

const initialState = {
  events: [],
  loading: false,
  error: null,
  currentDate: new Date().toISOString().split('T')[0],
  view: 'month', // month, week, day
  selectedEvent: null
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload;
    },
    setView: (state, action) => {
      state.view = action.payload;
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Local event management
    addEventLocal: (state, action) => {
      state.events.push({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isLocal: true
      });
    },
    updateEventLocal: (state, action) => {
      const { id, updates } = action.payload;
      const eventIndex = state.events.findIndex(event => event.id === id);
      if (eventIndex !== -1) {
        state.events[eventIndex] = { ...state.events[eventIndex], ...updates };
      }
    },
    deleteEventLocal: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Ensure events remains an array even on error
        if (!Array.isArray(state.events)) {
          state.events = [];
        }
      })
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(event => event.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setCurrentDate,
  setView,
  setSelectedEvent,
  clearError,
  addEventLocal,
  updateEventLocal,
  deleteEventLocal
} = calendarSlice.actions;

export default calendarSlice.reducer;