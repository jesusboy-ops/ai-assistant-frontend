// Calendar slice - manages calendar events
import { createSlice } from '@reduxjs/toolkit';

// Load events from localStorage
const loadEventsFromStorage = () => {
  try {
    const savedEvents = localStorage.getItem('spark_calendar_events');
    return savedEvents ? JSON.parse(savedEvents) : [];
  } catch (error) {
    console.error('Error loading events from localStorage:', error);
    return [];
  }
};

// Save events to localStorage
const saveEventsToStorage = (events) => {
  try {
    localStorage.setItem('spark_calendar_events', JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events to localStorage:', error);
  }
};

const initialState = {
  events: loadEventsFromStorage(),
  view: 'month', // month, week, day
  selectedDate: new Date().toISOString(),
  loading: false,
  error: null
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
      saveEventsToStorage(state.events);
    },
    addEvent: (state, action) => {
      state.events.push(action.payload);
      saveEventsToStorage(state.events);
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...action.payload };
        saveEventsToStorage(state.events);
      }
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter(e => e.id !== action.payload);
      saveEventsToStorage(state.events);
    },
    setView: (state, action) => {
      state.view = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  setView,
  setSelectedDate,
  setLoading,
  setError,
  clearError
} = calendarSlice.actions;

export default calendarSlice.reducer;
