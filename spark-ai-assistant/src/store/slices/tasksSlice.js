// Tasks slice for AI Task & To-Do Manager
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tasksApi } from '../../api/tasksApi';
import notificationService from '../../services/notificationService';

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    const result = await tasksApi.getTasks();
    if (!result.success) {
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to fetch tasks';
      return rejectWithValue(errorMessage);
    }
    return result.data;
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    const result = await tasksApi.createTask(taskData);
    if (!result.success) {
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to create task';
      return rejectWithValue(errorMessage);
    }
    return result.data;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updates }, { rejectWithValue }) => {
    const result = await tasksApi.updateTask(taskId, updates);
    if (!result.success) {
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to update task';
      return rejectWithValue(errorMessage);
    }
    return result.data;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    const result = await tasksApi.deleteTask(taskId);
    if (!result.success) {
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to delete task';
      return rejectWithValue(errorMessage);
    }
    return taskId;
  }
);

export const toggleTaskComplete = createAsyncThunk(
  'tasks/toggleTaskComplete',
  async ({ taskId, completed }, { rejectWithValue }) => {
    const result = await tasksApi.toggleTaskComplete(taskId, completed);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

export const createTaskFromMessage = createAsyncThunk(
  'tasks/createTaskFromMessage',
  async (message, { rejectWithValue }) => {
    const result = await tasksApi.createTaskFromMessage(message);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

export const getTaskSuggestions = createAsyncThunk(
  'tasks/getTaskSuggestions',
  async (taskTitle, { rejectWithValue }) => {
    const result = await tasksApi.getTaskSuggestions(taskTitle);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  suggestions: [],
  suggestionsLoading: false,
  filter: 'all', // all, pending, completed
  sortBy: 'dueDate', // dueDate, priority, createdAt
};

const tasksSlice = createSlice({
  name: 'tasks',
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
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different backend response formats
        const data = action.payload;
        console.log('📥 Tasks data received:', data);
        
        if (Array.isArray(data)) {
          state.tasks = data;
        } else if (data && Array.isArray(data.tasks)) {
          state.tasks = data.tasks;
        } else if (data && Array.isArray(data.data)) {
          state.tasks = data.data;
        } else if (data && data.success && Array.isArray(data.data)) {
          state.tasks = data.data;
        } else {
          console.warn('Unexpected tasks data format:', data);
          state.tasks = [];
        }
        
        console.log('📥 Tasks loaded:', state.tasks.length);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        const newTask = action.payload;
        console.log('📥 New task created:', newTask);
        if (newTask) {
          state.tasks.unshift(newTask);
          // Create system notification
          notificationService.taskCreated(newTask);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        console.log('📥 Task updated:', updatedTask);
        const index = state.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
          // Create system notification
          notificationService.taskUpdated(updatedTask);
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        const taskId = action.payload;
        const deletedTask = state.tasks.find(task => task.id === taskId);
        if (deletedTask) {
          // Create system notification before removing
          notificationService.taskDeleted(deletedTask.title);
        }
        state.tasks = state.tasks.filter(task => task.id !== taskId);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Toggle task complete
      .addCase(toggleTaskComplete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        console.log('📥 Task toggled:', updatedTask);
        const index = state.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
          // Create system notification if task was completed
          if (updatedTask.status === 'completed') {
            notificationService.taskCompleted(updatedTask);
          }
        }
      })
      .addCase(toggleTaskComplete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create task from message
      .addCase(createTaskFromMessage.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(createTaskFromMessage.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Get task suggestions
      .addCase(getTaskSuggestions.pending, (state) => {
        state.suggestionsLoading = true;
        state.error = null;
      })
      .addCase(getTaskSuggestions.fulfilled, (state, action) => {
        state.suggestionsLoading = false;
        const suggestions = action.payload;
        console.log('📥 Task suggestions received:', suggestions);
        
        // Handle different response formats
        if (Array.isArray(suggestions)) {
          state.suggestions = suggestions;
        } else if (suggestions && Array.isArray(suggestions.suggestions)) {
          state.suggestions = suggestions.suggestions;
        } else if (suggestions && Array.isArray(suggestions.data)) {
          state.suggestions = suggestions.data;
        } else {
          console.warn('Unexpected suggestions format:', suggestions);
          state.suggestions = [];
        }
      })
      .addCase(getTaskSuggestions.rejected, (state, action) => {
        state.suggestionsLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  setFilter,
  setSortBy,
  clearSuggestions
} = tasksSlice.actions;

export default tasksSlice.reducer;