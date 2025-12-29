// Calendar API service
import axiosInstance from './axios';

export const calendarApi = {
  // Get all events
  getEvents: async (startDate, endDate) => {
    const response = await axiosInstance.get('/api/calendar/events', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Get specific event
  getEvent: async (eventId) => {
    const response = await axiosInstance.get(`/api/calendar/events/${eventId}`);
    return response.data;
  },

  // Create new event
  createEvent: async (title, description, startTime, endTime, location) => {
    const response = await axiosInstance.post('/api/calendar/events', {
      title,
      description,
      startTime,
      endTime,
      location
    });
    return response.data;
  },

  // Update event
  updateEvent: async (eventId, data) => {
    const response = await axiosInstance.put(`/api/calendar/events/${eventId}`, data);
    return response.data;
  },

  // Delete event
  deleteEvent: async (eventId) => {
    const response = await axiosInstance.delete(`/api/calendar/events/${eventId}`);
    return response.data;
  }
};

export default calendarApi;
