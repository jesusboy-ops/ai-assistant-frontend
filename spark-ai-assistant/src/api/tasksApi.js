// Tasks API for AI Task & To-Do Manager
import axiosInstance from './axios';

export const tasksApi = {
  // Get all tasks for user
  getTasks: async (filters = {}) => {
    try {
      console.log('🔍 Fetching tasks from backend...');
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.offset) params.append('offset', filters.offset);
      
      const url = `/api/tasks${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await axiosInstance.get(url);
      
      console.log('✅ Tasks response:', response.status, response.data);
      return {
        success: true,
        data: response.data.tasks || response.data
      };
    } catch (error) {
      console.error('❌ Get tasks error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch tasks'
      };
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      console.log('🔍 Creating task with data:', taskData);
      
      // Ensure required fields are present and properly formatted
      if (!taskData.title || !taskData.title.trim()) {
        throw new Error('Task title is required');
      }
      
      // Format data according to backend specification
      const formattedData = {
        title: taskData.title.trim(),
        description: taskData.description?.trim() || '',
        priority: taskData.priority || 'medium',
        tags: Array.isArray(taskData.tags) ? taskData.tags : []
      };
      
      // Only add due_date if it's provided and valid
      if (taskData.due_date) {
        const dueDate = new Date(taskData.due_date);
        if (!isNaN(dueDate.getTime())) {
          formattedData.due_date = dueDate.toISOString();
        }
      }
      
      console.log('🔍 Formatted task data:', formattedData);
      
      const response = await axiosInstance.post('/api/tasks', formattedData);
      console.log('✅ Create task response:', response.status, response.data);
      
      return {
        success: true,
        data: response.data.task || response.data
      };
    } catch (error) {
      console.error('❌ Create task error:', error.response?.status, error.response?.data, error.message);
      
      let errorMessage = 'Failed to create task';
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(e => e.message).join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Update task
  updateTask: async (taskId, updates) => {
    try {
      console.log('🔍 Updating task:', taskId, updates);
      
      // Format updates according to backend specification
      const formattedUpdates = {};
      if (updates.title !== undefined) formattedUpdates.title = updates.title?.trim();
      if (updates.description !== undefined) formattedUpdates.description = updates.description?.trim() || '';
      if (updates.status !== undefined) formattedUpdates.status = updates.status;
      if (updates.priority !== undefined) formattedUpdates.priority = updates.priority;
      if (updates.due_date !== undefined) formattedUpdates.due_date = updates.due_date;
      if (updates.tags !== undefined) formattedUpdates.tags = updates.tags;
      if (updates.completed !== undefined) {
        // Map completed boolean to status
        formattedUpdates.status = updates.completed ? 'completed' : 'pending';
      }
      
      const response = await axiosInstance.put(`/api/tasks/${taskId}`, formattedUpdates);
      console.log('✅ Update task response:', response.status, response.data);
      
      return {
        success: true,
        data: response.data.task || response.data
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
      await axiosInstance.delete(`/api/tasks/${taskId}`);
      console.log('✅ Task deleted successfully');
      return {
        success: true
      };
    } catch (error) {
      console.error('❌ Delete task error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete task'
      };
    }
  },

  // Mark task as complete/incomplete
  toggleTaskComplete: async (taskId, completed) => {
    try {
      console.log('🔍 Toggling task completion:', taskId, completed);
      
      const response = await axiosInstance.put(`/api/tasks/${taskId}`, { 
        status: completed ? 'completed' : 'pending' 
      });
      
      console.log('✅ Toggle task response:', response.status, response.data);
      return {
        success: true,
        data: response.data.task || response.data
      };
    } catch (error) {
      console.error('❌ Toggle task error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update task status'
      };
    }
  },

  // Convert chat message to task using AI
  createTaskFromMessage: async (message, messageId = null) => {
    try {
      console.log('🔍 Creating task from message:', message);
      
      const requestData = { message };
      if (messageId) requestData.messageId = messageId;
      
      const response = await axiosInstance.post('/api/tasks/from-message', requestData);
      console.log('✅ Task from message response:', response.status, response.data);
      
      return {
        success: true,
        data: response.data.tasks || response.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Create task from message error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create task from message'
      };
    }
  },

  // Get AI suggestions for task breakdown
  getTaskSuggestions: async (taskTitle) => {
    try {
      console.log('🔍 Getting task suggestions for:', taskTitle);
      const response = await axiosInstance.post('/api/tasks/suggestions', { taskTitle });
      console.log('✅ Task suggestions response:', response.status, response.data);
      
      return {
        success: true,
        data: response.data.suggestions || response.data
      };
    } catch (error) {
      console.error('❌ Get task suggestions error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get task suggestions'
      };
    }
  }
};

export default tasksApi;