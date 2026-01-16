// Notes API service
import axiosInstance from './axios';

export const notesApi = {
  // Get all notes
  getNotes: async () => {
    try {
      const response = await axiosInstance.get('/api/notes');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch notes'
      };
    }
  },

  // Get specific note
  getNote: async (noteId) => {
    try {
      const response = await axiosInstance.get(`/api/notes/${noteId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch note'
      };
    }
  },

  // Create new note
  createNote: async (noteData) => {
    try {
      const response = await axiosInstance.post('/api/notes', noteData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create note'
      };
    }
  },

  // Update note
  updateNote: async (noteId, updates) => {
    try {
      const response = await axiosInstance.put(`/api/notes/${noteId}`, updates);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update note'
      };
    }
  },

  // Delete note
  deleteNote: async (noteId) => {
    try {
      await axiosInstance.delete(`/api/notes/${noteId}`);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete note'
      };
    }
  }
};

export default notesApi;
