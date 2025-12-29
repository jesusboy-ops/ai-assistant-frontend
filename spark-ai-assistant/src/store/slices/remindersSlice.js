// Reminders slice for Smart Reminders System
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { remindersApi } from '../../api/remindersApi';
import notificationService from '../../services/notificationService';

// Async thunks
export const fetchReminders = createAsyncThunk(
  'reminders/fetchReminders',
  async (_, { rejectWithValue }) => {
    const result = await remindersApi.getReminders();
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

export const createReminder = createAsyncThunk(
  'reminders/createReminder',
  async (reminderData, { rejectWithValue }) => {
    const result = await remindersApi.createReminder(reminderData);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

export const updateReminder = createAsyncThunk(
  'reminders/updateReminder',
  async ({ reminderId, updates }, { rejectWithValue }) => {
    const result = await remindersApi.updateReminder(reminderId, updates);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

export const deleteReminder = createAsyncThunk(
  'reminders/deleteReminder',
  async (reminderId, { rejectWithValue }) => {
    const result = await remindersApi.deleteReminder(reminderId);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return reminderId;
  }
);

export const completeReminder = createAsyncThunk(
  'reminders/completeReminder',
  async (reminderId, { rejectWithValue }) => {
    const result = await remindersApi.completeReminder(reminderId);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

export const createReminderFromMessage = createAsyncThunk(
  'reminders/createReminderFromMessage',
  async (message, { rejectWithValue }) => {
    const result = await remindersApi.createReminderFromMessage(message);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

export const fetchUpcomingReminders = createAsyncThunk(
  'reminders/fetchUpcomingReminders',
  async (days = 7, { rejectWithValue }) => {
    const result = await remindersApi.getUpcomingReminders(days);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

const initialState = {
  reminders: [],
  upcomingReminders: [],
  loading: false,
  error: null,
  filter: 'all', // all, pending, completed
  sortBy: 'dueDate', // dueDate, createdAt
};

const remindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
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
        // Handle different backend response formats
        const data = action.payload;
        if (Array.isArray(data)) {
          state.reminders = data;
        } else if (data && Array.isArray(data.reminders)) {
          state.reminders = data.reminders;
        } else if (data && Array.isArray(data.data)) {
          state.reminders = data.data;
        } else {
          console.warn('Unexpected reminders data format:', data);
          state.reminders = [];
        }
      })
      .addCase(fetchReminders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create reminder
      .addCase(createReminder.fulfilled, (state, action) => {
        const newReminder = action.payload;
        if (newReminder) {
          state.reminders.unshift(newReminder);
          // Create system notification
          notificationService.reminderCreated(newReminder);
        }
      })
      .addCase(createReminder.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Update reminder
      .addCase(updateReminder.fulfilled, (state, action) => {
        const index = state.reminders.findIndex(reminder => reminder.id === action.payload.id);
        if (index !== -1) {
          state.reminders[index] = action.payload;
        }
      })
      .addCase(updateReminder.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Delete reminder
      .addCase(deleteReminder.fulfilled, (state, action) => {
        state.reminders = state.reminders.filter(reminder => reminder.id !== action.payload);
      })
      .addCase(deleteReminder.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Complete reminder
      .addCase(completeReminder.fulfilled, (state, action) => {
        const index = state.reminders.findIndex(reminder => reminder.id === action.payload.id);
        if (index !== -1) {
          state.reminders[index] = action.payload;
        }
      })
      .addCase(completeReminder.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Create reminder from message
      .addCase(createReminderFromMessage.fulfilled, (state, action) => {
        state.reminders.unshift(action.payload);
      })
      .addCase(createReminderFromMessage.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Fetch upcoming reminders
      .addCase(fetchUpcomingReminders.fulfilled, (state, action) => {
        const data = action.payload;
        if (Array.isArray(data)) {
          state.upcomingReminders = data;
        } else if (data && Array.isArray(data.reminders)) {
          state.upcomingReminders = data.reminders;
        } else if (data && Array.isArray(data.data)) {
          state.upcomingReminders = data.data;
        } else {
          console.warn('Unexpected upcoming reminders data format:', data);
          state.upcomingReminders = [];
        }
      })
      .addCase(fetchUpcomingReminders.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  setFilter,
  setSortBy
} = remindersSlice.actions;

export default remindersSlice.reducer;