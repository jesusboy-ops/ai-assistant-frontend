// Tasks API service
import axiosInstance from './axios';

export const tasksApi = {
  // Get all tasks
  getTasks: async () => {
    console.log('📋 Fetching tasks...');
    try {
      const response = await axiosInstance.get('/api/tasks');
      console.log('✅ Tasks fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch tasks:', error.message);
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    console.log('➕ Creating new task...');
    try {
      const response = await axiosInstance.post('/api/tasks', taskData);
      console.log('✅ Task created successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create task:', error.message);
      throw error;
    }
  },

  // Update a task
  updateTask: async (taskId, taskData) => {
    console.log(`✏️ Updating task ${taskId}...`);
    try {
      const response = await axiosInstance.put(`/api/tasks/${taskId}`, taskData);
      console.log('✅ Task updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update task:', error.message);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    console.log(`🗑️ Deleting task ${taskId}...`);
    try {
      const response = await axiosInstance.delete(`/api/tasks/${taskId}`);
      console.log('✅ Task deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to delete task:', error.message);
      throw error;
    }
  },

  // Toggle task completion
  toggleTask: async (taskId) => {
    console.log(`🔄 Toggling task ${taskId}...`);
    try {
      const response = await axiosInstance.patch(`/api/tasks/${taskId}/toggle`);
      console.log('✅ Task toggled successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to toggle task:', error.message);
      throw error;
    }
  }
};

export default tasksApi;