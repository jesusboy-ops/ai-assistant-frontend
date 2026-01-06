// Tasks Redux slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tasksApi from '../../api/tasksApi';

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tasksApi.getTasks();
      if (response.success) {
        const tasks = response.data || [];
        return Array.isArray(tasks) ? tasks : [];
      } else {
        return rejectWithValue(response.error || 'Failed to fetch tasks');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await tasksApi.createTask(taskData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to create task');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await tasksApi.updateTask(id, updates);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to update task');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await tasksApi.deleteTask(taskId);
      if (response.success) {
        return taskId;
      } else {
        return rejectWithValue(response.error || 'Failed to delete task');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete task');
    }
  }
);

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filter: 'all', // all, pending, completed, overdue
  sortBy: 'dueDate' // dueDate, priority, created
};

const tasksSlice = createSlice({
  name: 'tasks',
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
    // Local task management for offline support
    addTaskLocal: (state, action) => {
      state.tasks.push({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isLocal: true
      });
    },
    updateTaskLocal: (state, action) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
      }
    },
    deleteTaskLocal: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
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
        console.log('🔄 Redux: Tasks fetched, payload:', action.payload);
        // Sanitize task data to handle null values
        const sanitizedTasks = Array.isArray(action.payload) ? action.payload.map(task => ({
          ...task,
          title: task.title && task.title !== 'null' ? task.title : '',
          description: task.description && task.description !== 'null' ? task.description : '',
          priority: task.priority && task.priority !== 'null' ? task.priority : 'medium',
          status: task.status && task.status !== 'null' ? task.status : 'pending'
        })) : [];
        state.tasks = sanitizedTasks;
        console.log('🔄 Redux: Sanitized tasks array set to:', state.tasks);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Ensure tasks remains an array even on error
        if (!Array.isArray(state.tasks)) {
          state.tasks = [];
        }
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        console.log('🔄 Redux: Task created, payload:', action.payload);
        // Sanitize created task data
        const sanitizedTask = {
          ...action.payload,
          title: action.payload.title && action.payload.title !== 'null' ? action.payload.title : '',
          description: action.payload.description && action.payload.description !== 'null' ? action.payload.description : '',
          priority: action.payload.priority && action.payload.priority !== 'null' ? action.payload.priority : 'medium',
          status: action.payload.status && action.payload.status !== 'null' ? action.payload.status : 'pending'
        };
        state.tasks.push(sanitizedTask);
        console.log('🔄 Redux: Updated tasks array:', state.tasks);
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
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          // Sanitize updated task data
          const sanitizedTask = {
            ...action.payload,
            title: action.payload.title && action.payload.title !== 'null' ? action.payload.title : '',
            description: action.payload.description && action.payload.description !== 'null' ? action.payload.description : '',
            priority: action.payload.priority && action.payload.priority !== 'null' ? action.payload.priority : 'medium',
            status: action.payload.status && action.payload.status !== 'null' ? action.payload.status : 'pending'
          };
          state.tasks[index] = sanitizedTask;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setFilter,
  setSortBy,
  clearError,
  addTaskLocal,
  updateTaskLocal,
  deleteTaskLocal
} = tasksSlice.actions;

export default tasksSlice.reducer;