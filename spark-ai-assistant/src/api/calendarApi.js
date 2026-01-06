// Calendar API service
import axiosInstance from './axios';

export const calendarApi = {
  // Get all events
  getEvents: async () => {
    try {
      console.log('🔍 Fetching calendar events...');
      const response = await axiosInstance.get('/api/calendar/events');
      console.log('✅ Events fetched successfully:', response.status, response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Get events error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch events'
      };
    }
  },

  // Create new event
  createEvent: async (eventData) => {
    try {
      console.log('🔍 Creating event:', eventData);
      
      // Validate required fields
      if (!eventData.title?.trim()) {
        return {
          success: false,
          error: 'Event title is required'
        };
      }

      if (!eventData.date) {
        return {
          success: false,
          error: 'Event date is required'
        };
      }

      const response = await axiosInstance.post('/api/calendar/events', eventData);
      console.log('✅ Event created successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Create event error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create event'
      };
    }
  },

  // Update event
  updateEvent: async (eventId, updates) => {
    try {
      console.log('🔍 Updating event:', eventId, updates);
      const response = await axiosInstance.put(`/api/calendar/events/${eventId}`, updates);
      console.log('✅ Event updated successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Update event error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update event'
      };
    }
  },

  // Delete event
  deleteEvent: async (eventId) => {
    try {
      console.log('🔍 Deleting event:', eventId);
      const response = await axiosInstance.delete(`/api/calendar/events/${eventId}`);
      console.log('✅ Event deleted successfully:', response.status);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Delete event error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete event'
      };
    }
  },

  // Get event by ID
  getEvent: async (eventId) => {
    try {
      console.log('🔍 Fetching event:', eventId);
      const response = await axiosInstance.get(`/api/calendar/events/${eventId}`);
      console.log('✅ Event fetched successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Get event error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch event'
      };
    }
  },

  // Get events by date range
  getEventsByDateRange: async (startDate, endDate) => {
    try {
      console.log('🔍 Fetching events by date range:', startDate, 'to', endDate);
      const response = await axiosInstance.get(`/api/calendar/events/range?start=${startDate}&end=${endDate}`);
      console.log('✅ Events by date range fetched successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Get events by date range error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch events by date range'
      };
    }
  },

  // Get today's events
  getTodaysEvents: async () => {
    try {
      console.log('🔍 Fetching today\'s events...');
      const today = new Date().toISOString().split('T')[0];
      const response = await axiosInstance.get(`/api/calendar/events/date/${today}`);
      console.log('✅ Today\'s events fetched successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Get today\'s events error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch today\'s events'
      };
    }
  },

  // Get upcoming events
  getUpcomingEvents: async (days = 7) => {
    try {
      console.log('🔍 Fetching upcoming events for next', days, 'days');
      const response = await axiosInstance.get(`/api/calendar/events/upcoming?days=${days}`);
      console.log('✅ Upcoming events fetched successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Get upcoming events error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch upcoming events'
      };
    }
  }
};

export default calendarApi;