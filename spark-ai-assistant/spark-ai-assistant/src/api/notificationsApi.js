// Notifications API service
import axiosInstance from './axios';

export const notificationsApi = {
  // Get VAPID public key for push notifications
  getVapidPublicKey: async () => {
    const response = await axiosInstance.get('/api/notifications/vapid-public-key');
    return response.data;
  },

  // Subscribe to push notifications
  subscribe: async (subscription) => {
    const response = await axiosInstance.post('/api/notifications/subscribe', {
      subscription
    });
    return response.data;
  },

  // Unsubscribe from push notifications
  unsubscribe: async (endpoint) => {
    const response = await axiosInstance.post('/api/notifications/unsubscribe', {
      endpoint
    });
    return response.data;
  },

  // Send test notification
  sendTestNotification: async () => {
    const response = await axiosInstance.post('/api/notifications/test');
    return response.data;
  },

  // Get all notifications
  getNotifications: async () => {
    const response = await axiosInstance.get('/api/notifications');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await axiosInstance.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await axiosInstance.put('/api/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await axiosInstance.delete(`/api/notifications/${notificationId}`);
    return response.data;
  }
};

export default notificationsApi;
