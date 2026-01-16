// Notification service for creating and managing real system notifications only
import { store } from '../store/store';
import { addNotification } from '../store/slices/notificationsSlice';

class NotificationService {
  // Create a new notification for real system events only
  createNotification(type, title, message, data = {}) {
    const notification = {
      id: Date.now() + Math.random(),
      type, // 'success', 'info', 'warning', 'error', 'chat'
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      data, // Additional data related to the notification
    };

    // Add to Redux store
    store.dispatch(addNotification(notification));

    return notification;
  }

  // AI Chat notifications - REAL system events
  aiResponseReceived(conversationTitle, messagePreview) {
    return this.createNotification(
      'chat',
      'AI Response Received',
      `Spark AI replied: "${messagePreview.substring(0, 60)}${messagePreview.length > 60 ? '...' : ''}"`,
      { 
        type: 'ai_response', 
        conversationTitle,
        actionUrl: '/chat'
      }
    );
  }

  newConversationStarted(conversationTitle) {
    return this.createNotification(
      'chat',
      'New Conversation Started',
      `Started new chat: "${conversationTitle}"`,
      { 
        type: 'conversation_started',
        conversationTitle,
        actionUrl: '/chat'
      }
    );
  }

  // System error notifications - REAL errors only
  systemError(error, context = {}) {
    return this.createNotification(
      'error',
      'System Error',
      error.message || 'An unexpected error occurred',
      { type: 'system_error', error: error.message, context }
    );
  }

  // Authentication notifications - REAL events
  userLoggedIn() {
    return this.createNotification(
      'success',
      'Welcome Back',
      'You have successfully logged in',
      { type: 'auth_login' }
    );
  }

  userLoggedOut() {
    return this.createNotification(
      'info',
      'Logged Out',
      'You have been logged out successfully',
      { type: 'auth_logout' }
    );
  }

  // API connection notifications - REAL connection events
  backendConnected() {
    return this.createNotification(
      'success',
      'Backend Connected',
      'Successfully connected to backend services',
      { type: 'backend_connected' }
    );
  }

  backendDisconnected() {
    return this.createNotification(
      'warning',
      'Backend Disconnected',
      'Lost connection to backend services. Retrying...',
      { type: 'backend_disconnected' }
    );
  }

  // File operations - REAL file events only
  fileUploadSuccess(fileName) {
    return this.createNotification(
      'success',
      'File Uploaded',
      `"${fileName}" uploaded successfully`,
      { type: 'file_uploaded', fileName }
    );
  }

  fileUploadError(fileName, error) {
    return this.createNotification(
      'error',
      'Upload Failed',
      `Failed to upload "${fileName}": ${error}`,
      { type: 'file_upload_error', fileName, error }
    );
  }

  // Translation notifications - REAL translation events
  translationCompleted(sourceText, targetLanguage) {
    return this.createNotification(
      'success',
      'Translation Complete',
      `Text translated to ${targetLanguage}`,
      { 
        type: 'translation_completed', 
        sourceText: sourceText.substring(0, 50),
        targetLanguage,
        actionUrl: '/translator'
      }
    );
  }

  translationError(error) {
    return this.createNotification(
      'error',
      'Translation Failed',
      `Translation failed: ${error}`,
      { type: 'translation_error', error }
    );
  }

  // Task notifications - REAL task events only (when backend confirms)
  taskSyncSuccess(count) {
    return this.createNotification(
      'success',
      'Tasks Synced',
      `${count} tasks synced with backend`,
      { type: 'task_sync', count, actionUrl: '/tasks' }
    );
  }

  taskSyncError(error) {
    return this.createNotification(
      'error',
      'Sync Failed',
      `Failed to sync tasks: ${error}`,
      { type: 'task_sync_error', error }
    );
  }

  // Life Admin notifications - REAL events only
  lifeAdminSyncSuccess(count) {
    return this.createNotification(
      'success',
      'Life Admin Synced',
      `${count} obligations synced with backend`,
      { type: 'lifeadmin_sync', count, actionUrl: '/life-admin' }
    );
  }

  // System maintenance notifications
  systemMaintenanceScheduled(date) {
    return this.createNotification(
      'info',
      'Maintenance Scheduled',
      `System maintenance scheduled for ${date}`,
      { type: 'maintenance_scheduled', date }
    );
  }

  // Remove all fake/mock notification methods
  // Only keep methods that represent real system events
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;