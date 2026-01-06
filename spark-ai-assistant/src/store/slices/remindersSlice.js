// Reminders Redux slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import remindersApi from '../../api/remindersApi';

// Async thunks
export const fetchReminders = createAsyncThunk(
  'reminders/fetchReminders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await remindersApi.getReminders();
      if (response.success) {
        const reminders = response.data || [];
        return Array.isArray(reminders) ? reminders : [];
      } else {
        return rejectWithValue(response.error || 'Failed to fetch reminders');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch reminders');
    }
  }
);

export const createReminder = createAsyncThunk(
  'reminders/createReminder',
  async (reminderData, { rejectWithValue }) => {
    try {
      const response = await remindersApi.createReminder(reminderData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to create reminder');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create reminder');
    }
  }
);

export const updateReminder = createAsyncThunk(
  'reminders/updateReminder',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await remindersApi.updateReminder(id, updates);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to update reminder');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update reminder');
    }
  }
);

export const deleteReminder = createAsyncThunk(
  'reminders/deleteReminder',
  async (reminderId, { rejectWithValue }) => {
    try {
      const response = await remindersApi.deleteReminder(reminderId);
      if (response.success) {
        return reminderId;
      } else {
        return rejectWithValue(response.error || 'Failed to delete reminder');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete reminder');
    }
  }
);

const initialState = {
  reminders: [],
  loading: false,
  error: null,
  filter: 'upcoming', // upcoming, past, all
  sortBy: 'reminderTime' // reminderTime, created, priority
};

const remindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Local reminder management
    addReminderLocal: (state, action) => {
      state.reminders.push({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isLocal: true
      });
    },
    updateReminderLocal: (state, action) => {
      const { id, updates } = action.payload;
      const reminderIndex = state.reminders.findIndex(reminder => reminder.id === id);
      if (reminderIndex !== -1) {
        state.reminders[reminderIndex] = { ...state.reminders[reminderIndex], ...updates };
      }
    },
    deleteReminderLocal: (state, action) => {
      state.reminders = state.reminders.filter(reminder => reminder.id !== action.payload);
    },
    markAsTriggered: (state, action) => {
      const reminder = state.reminders.find(r => r.id === action.payload);
      if (reminder) {
        reminder.triggered = true;
        reminder.triggeredAt = new Date().toISOString();
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch reminders
      .addCase(fetchReminders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.loading = false;
        // Sanitize reminder data to handle null values
        const sanitizedReminders = Array.isArray(action.payload) ? action.payload.map(reminder => ({
          ...reminder,
          title: reminder.title && reminder.title !== 'null' ? reminder.title : '',
          description: reminder.description && reminder.description !== 'null' ? reminder.description : '',
          priority: reminder.priority && reminder.priority !== 'null' ? reminder.priority : 'medium'
        })) : [];
        state.reminders = sanitizedReminders;
      })
      .addCase(fetchReminders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Ensure reminders remains an array even on error
        if (!Array.isArray(state.reminders)) {
          state.reminders = [];
        }
      })
      // Create reminder
      .addCase(createReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReminder.fulfilled, (state, action) => {
        state.loading = false;
        // Sanitize created reminder data
        const sanitizedReminder = {
          ...action.payload,
          title: action.payload.title && action.payload.title !== 'null' ? action.payload.title : '',
          description: action.payload.description && action.payload.description !== 'null' ? action.payload.description : '',
          priority: action.payload.priority && action.payload.priority !== 'null' ? action.payload.priority : 'medium'
        };
        state.reminders.push(sanitizedReminder);
      })
      .addCase(createReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update reminder
      .addCase(updateReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReminder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reminders.findIndex(reminder => reminder.id === action.payload.id);
        if (index !== -1) {
          // Sanitize updated reminder data
          const sanitizedReminder = {
            ...action.payload,
            title: action.payload.title && action.payload.title !== 'null' ? action.payload.title : '',
            description: action.payload.description && action.payload.description !== 'null' ? action.payload.description : '',
            priority: action.payload.priority && action.payload.priority !== 'null' ? action.payload.priority : 'medium'
          };
          state.reminders[index] = sanitizedReminder;
        }
      })
      .addCase(updateReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete reminder
      .addCase(deleteReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReminder.fulfilled, (state, action) => {
        state.loading = false;
        state.reminders = state.reminders.filter(reminder => reminder.id !== action.payload);
      })
      .addCase(deleteReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setFilter,
  setSortBy,
  clearError,
  addReminderLocal,
  updateReminderLocal,
  deleteReminderLocal,
  markAsTriggered
} = remindersSlice.actions;

export default remindersSlice.reducer;