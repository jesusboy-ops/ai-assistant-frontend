// Reminders API service
import axiosInstance from './axios';

export const remindersApi = {
  // Get all reminders
  getReminders: async () => {
    try {
      console.log('🔍 Fetching reminders...');
      const response = await axiosInstance.get('/api/reminders');
      console.log('✅ Reminders fetched successfully:', response.status, response.data);
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
      console.log('🔍 Creating reminder:', reminderData);
      
      // Validate required fields
      if (!reminderData.title?.trim()) {
        return {
          success: false,
          error: 'Reminder title is required'
        };
      }

      if (!reminderData.reminder_time) {
        return {
          success: false,
          error: 'Reminder time is required'
        };
      }

      const response = await axiosInstance.post('/api/reminders', reminderData);
      console.log('✅ Reminder created successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Create reminder error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create reminder'
      };
    }
  },

  // Update reminder
  updateReminder: async (reminderId, updates) => {
    try {
      console.log('🔍 Updating reminder:', reminderId, updates);
      const response = await axiosInstance.put(`/api/reminders/${reminderId}`, updates);
      console.log('✅ Reminder updated successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Update reminder error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update reminder'
      };
    }
  },

  // Delete reminder
  deleteReminder: async (reminderId) => {
    try {
      console.log('🔍 Deleting reminder:', reminderId);
      const response = await axiosInstance.delete(`/api/reminders/${reminderId}`);
      console.log('✅ Reminder deleted successfully:', response.status);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Delete reminder error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete reminder'
      };
    }
  },

  // Get reminder by ID
  getReminder: async (reminderId) => {
    try {
      console.log('🔍 Fetching reminder:', reminderId);
      const response = await axiosInstance.get(`/api/reminders/${reminderId}`);
      console.log('✅ Reminder fetched successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Get reminder error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch reminder'
      };
    }
  },

  // Get upcoming reminders
  getUpcomingReminders: async (hours = 24) => {
    try {
      console.log('🔍 Fetching upcoming reminders for next', hours, 'hours');
      const response = await axiosInstance.get(`/api/reminders/upcoming?hours=${hours}`);
      console.log('✅ Upcoming reminders fetched successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Get upcoming reminders error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch upcoming reminders'
      };
    }
  },

  // Mark reminder as triggered
  triggerReminder: async (reminderId) => {
    try {
      console.log('🔍 Triggering reminder:', reminderId);
      const response = await axiosInstance.patch(`/api/reminders/${reminderId}/trigger`);
      console.log('✅ Reminder triggered successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Trigger reminder error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to trigger reminder'
      };
    }
  }
};

export default remindersApi;