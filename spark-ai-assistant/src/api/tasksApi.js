// Tasks API service
import axiosInstance from './axios';

// Create timeout wrapper for task operations
const withTimeout = async (promise, timeoutMs, operation) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`${operation} timed out`)), timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
};

export const tasksApi = {
  // Get all tasks
  getTasks: async () => {
    try {
      console.log('🔍 Fetching tasks...');
      const response = await withTimeout(
        axiosInstance.get('/api/tasks'),
        8000, // 8 second timeout
        'Get tasks'
      );
      console.log('✅ Tasks fetched successfully:', response.status, response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Get tasks error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.message.includes('timed out') 
          ? 'Loading tasks timed out. Please try again.'
          : error.response?.data?.message || error.message || 'Failed to fetch tasks'
      };
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      console.log('🔍 Creating task:', taskData);
      
      // Validate required fields
      if (!taskData.title?.trim()) {
        return {
          success: false,
          error: 'Task title is required'
        };
      }

      const response = await withTimeout(
        axiosInstance.post('/api/tasks', taskData),
        8000, // 8 second timeout
        'Create task'
      );
      console.log('✅ Task created successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Create task error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.message.includes('timed out') 
          ? 'Creating task timed out. Please try again.'
          : error.response?.data?.message || error.message || 'Failed to create task'
      };
    }
  },

  // Update task
  updateTask: async (taskId, updates) => {
    try {
      console.log('🔍 Updating task:', taskId, updates);
      const response = await withTimeout(
        axiosInstance.put(`/api/tasks/${taskId}`, updates),
        8000, // 8 second timeout
        'Update task'
      );
      console.log('✅ Task updated successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Update task error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update task'
      };
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      console.log('🔍 Deleting task:', taskId);
      const response = await axiosInstance.delete(`/api/tasks/${taskId}`);
      console.log('✅ Task deleted successfully:', response.status);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Delete task error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete task'
      };
    }
  },

  // Get task by ID
  getTask: async (taskId) => {
    try {
      console.log('🔍 Fetching task:', taskId);
      const response = await axiosInstance.get(`/api/tasks/${taskId}`);
      console.log('✅ Task fetched successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Get task error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch task'
      };
    }
  },

  // Mark task as completed
  completeTask: async (taskId) => {
    try {
      console.log('🔍 Completing task:', taskId);
      const response = await axiosInstance.patch(`/api/tasks/${taskId}/complete`);
      console.log('✅ Task completed successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Complete task error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to complete task'
      };
    }
  },

  // Get tasks by status
  getTasksByStatus: async (status) => {
    try {
      console.log('🔍 Fetching tasks by status:', status);
      const response = await axiosInstance.get(`/api/tasks?status=${status}`);
      console.log('✅ Tasks by status fetched successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Get tasks by status error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch tasks by status'
      };
    }
  }
};

export default tasksApi;