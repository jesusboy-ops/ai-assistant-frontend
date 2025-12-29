// Reminders API for Smart Reminders System
import axiosInstance from './axios';

export const remindersApi = {
  // Get all reminders for user
  getReminders: async () => {
    try {
      console.log('🔍 Fetching reminders from backend...');
      const response = await axiosInstance.get('/api/reminders');
      console.log('✅ Reminders response:', response.status, response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Get reminders error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch reminders'
      };
    }
  },

  // Create new reminder
  createReminder: async (reminderData) => {
    try {
      // Validate required fields
      if (!reminderData.title || !reminderData.reminder_time) {
        return {
          success: false,
          error: 'Title and reminder time are required'
        };
      }

      // Convert frontend format to backend format with proper validation
      // Backend expects snake_case field names
      const backendData = {
        title: String(reminderData.title).trim(),
        description: reminderData.description ? String(reminderData.description).trim() : '',
        reminder_time: reminderData.reminder_time, // snake_case as backend expects
        type: 'personal', // Default reminder type
      };

      // If the frontend sends a specific reminder type, use it
      if (reminderData.reminder_type && ['personal', 'meeting', 'task', 'event'].includes(reminderData.reminder_type)) {
        backendData.type = reminderData.reminder_type;
      }

      // Handle repeat information if backend supports it
      if (reminderData.repeat_type && reminderData.repeat_type !== 'none') {
        backendData.repeat_type = reminderData.repeat_type; // snake_case
        if (reminderData.repeat_interval) {
          backendData.repeat_interval = parseInt(reminderData.repeat_interval) || 1; // snake_case
        }
      }

      // Ensure reminder_time is a valid ISO string
      if (typeof backendData.reminder_time !== 'string') {
        if (backendData.reminder_time instanceof Date) {
          backendData.reminder_time = backendData.reminder_time.toISOString();
        } else {
          backendData.reminder_time = new Date(backendData.reminder_time).toISOString();
        }
      }

      // Validate the date
      const dateTest = new Date(backendData.reminder_time);
      if (isNaN(dateTest.getTime())) {
        return {
          success: false,
          error: 'Invalid reminder date format'
        };
      }

      // Ensure date is in the future (allow dates within 1 minute of now for testing)
      if (dateTest <= new Date(Date.now() - 60000)) {
        return {
          success: false,
          error: 'Reminder date must be in the future'
        };
      }
      
      console.log('🔍 Creating reminder with validated data:', backendData);
      const response = await axiosInstance.post('/api/reminders', backendData);
      console.log('✅ Create reminder response:', response.status, response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Create reminder error:', error.response?.status, error.response?.data, error.message);
      
      // Enhanced error handling for validation errors
      let errorMessage = 'Failed to create reminder';
      if (error.response?.data) {
        if (error.response.data.details && Array.isArray(error.response.data.details)) {
          const validationErrors = error.response.data.details.map(detail => 
            `${detail.field || 'Field'}: ${detail.message || detail}`
          ).join(', ');
          errorMessage = `Validation failed: ${validationErrors}`;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
        validationDetails: error.response?.data?.details
      };
    }
  },

  // Update reminder
  updateReminder: async (reminderId, updates) => {
    try {
      // Convert frontend format to backend format (snake_case)
      const backendUpdates = {
        title: updates.title,
        description: updates.description,
        reminder_time: updates.reminder_time, // snake_case
        type: updates.reminder_type || updates.type || 'personal'
      };

      // Handle repeat information
      if (updates.repeat_type && updates.repeat_type !== 'none') {
        backendUpdates.repeat_type = updates.repeat_type; // snake_case
        if (updates.repeat_interval) {
          backendUpdates.repeat_interval = parseInt(updates.repeat_interval) || 1; // snake_case
        }
      }
      
      const response = await axiosInstance.put(`/api/reminders/${reminderId}`, backendUpdates);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update reminder'
      };
    }
  },

  // Delete reminder
  deleteReminder: async (reminderId) => {
    try {
      await axiosInstance.delete(`/api/reminders/${reminderId}`);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete reminder'
      };
    }
  },

  // Mark reminder as completed
  completeReminder: async (reminderId) => {
    try {
      const response = await axiosInstance.patch(`/api/reminders/${reminderId}/complete`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to complete reminder'
      };
    }
  },

  // Create reminder from chat message using AI
  createReminderFromMessage: async (message) => {
    try {
      const response = await axiosInstance.post('/api/reminders/from-message', { message });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create reminder from message'
      };
    }
  },

  // Get upcoming reminders
  getUpcomingReminders: async (days = 7) => {
    try {
      const response = await axiosInstance.get(`/api/reminders/upcoming?days=${days}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch upcoming reminders'
      };
    }
  }
};

export default remindersApi;