// Tasks API service
import axiosInstance from './axios';

export const tasksApi = {
  // Get all tasks
  getTasks: async () => {
    try {
      console.log('📋 Fetching tasks...');
      const response = await axiosInstance.get('/api/tasks');
      console.log('✅ Tasks fetched successfully:', response.status, response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Get tasks error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.userMessage || error.response?.data?.message || error.message || 'Failed to fetch tasks'
      };
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      console.log('📋 Creating task:', taskData);
      
      // Validate required fields
      if (!taskData.title?.trim()) {
        return {
          success: false,
          error: 'Task title is required'
        };
      }

      const response = await axiosInstance.post('/api/tasks', taskData);
      console.log('✅ Task created successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Create task error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.userMessage || error.response?.data?.message || error.message || 'Failed to create task'
      };
    }
  },

  // Update a task
  updateTask: async (taskId, taskData) => {
    try {
      console.log('📋 Updating task:', taskId, taskData);
      const response = await axiosInstance.put(`/api/tasks/${taskId}`, taskData);
      console.log('✅ Task updated successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Update task error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.userMessage || error.response?.data?.message || error.message || 'Failed to update task'
      };
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    try {
      console.log('📋 Deleting task:', taskId);
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
        error: error.userMessage || error.response?.data?.message || error.message || 'Failed to delete task'
      };
    }
  },

  // Toggle task completion
  toggleTask: async (taskId) => {
    try {
      console.log('📋 Toggling task:', taskId);
      const response = await axiosInstance.patch(`/api/tasks/${taskId}/toggle`);
      console.log('✅ Task toggled successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Toggle task error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.userMessage || error.response?.data?.message || error.message || 'Failed to toggle task'
      };
    }
  }
};

export default tasksApi;