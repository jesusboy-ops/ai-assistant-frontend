// Files API service
import axiosInstance from './axios';

export const filesApi = {
  // Upload file(s)
  uploadFiles: async (files, onUploadProgress) => {
    const formData = new FormData();
    
    // Handle multiple files
    if (Array.isArray(files)) {
      files.forEach(file => {
        formData.append('files', file);
      });
    } else {
      formData.append('files', files);
    }

    const response = await axiosInstance.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      }
    });
    return response.data;
  },

  // Get all files
  getFiles: async () => {
    const response = await axiosInstance.get('/api/upload/files');
    return response.data;
  },

  // Delete file
  deleteFile: async (fileId) => {
    const response = await axiosInstance.delete(`/api/upload/files/${fileId}`);
    return response.data;
  },

  // Download file
  downloadFile: async (fileId, filename) => {
    const response = await axiosInstance.get(`/api/upload/files/${fileId}/download`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};

export default filesApi;
