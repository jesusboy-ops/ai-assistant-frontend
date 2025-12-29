// Notification service for creating and managing system notifications
import { store } from '../store/store';
import { addNotification } from '../store/slices/notificationsSlice';

class NotificationService {
  // Create a new notification
  createNotification(type, title, message, data = {}) {
    const notification = {
      id: Date.now() + Math.random(),
      type, // 'success', 'info', 'warning', 'error'
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

  // Task-related notifications
  taskCreated(task) {
    return this.createNotification(
      'success',
      'Task Created',
      `"${task.title}" has been created successfully`,
      { taskId: task.id, type: 'task_created' }
    );
  }

  taskUpdated(task) {
    return this.createNotification(
      'info',
      'Task Updated',
      `"${task.title}" has been updated`,
      { taskId: task.id, type: 'task_updated' }
    );
  }

  taskCompleted(task) {
    return this.createNotification(
      'success',
      'Task Completed',
      `"${task.title}" has been marked as completed`,
      { taskId: task.id, type: 'task_completed' }
    );
  }

  taskDeleted(taskTitle) {
    return this.createNotification(
      'info',
      'Task Deleted',
      `"${taskTitle}" has been deleted`,
      { type: 'task_deleted' }
    );
  }

  // Life Admin notifications
  obligationCreated(obligation) {
    return this.createNotification(
      'success',
      'Obligation Created',
      `"${obligation.title}" has been added to your life admin`,
      { obligationId: obligation.id, type: 'obligation_created' }
    );
  }

  obligationUpdated(obligation) {
    return this.createNotification(
      'info',
      'Obligation Updated',
      `"${obligation.title}" has been updated`,
      { obligationId: obligation.id, type: 'obligation_updated' }
    );
  }

  obligationCompleted(obligation) {
    return this.createNotification(
      'success',
      'Obligation Completed',
      `"${obligation.title}" has been completed`,
      { obligationId: obligation.id, type: 'obligation_completed' }
    );
  }

  obligationDueSoon(obligation) {
    const dueDate = new Date(obligation.due_date);
    const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
    
    return this.createNotification(
      'warning',
      'Obligation Due Soon',
      `"${obligation.title}" is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`,
      { obligationId: obligation.id, type: 'obligation_due_soon', daysUntilDue }
    );
  }

  // General notifications
  noteCreated(note) {
    return this.createNotification(
      'success',
      'Note Created',
      `Note "${note.title}" has been saved`,
      { noteId: note.id, type: 'note_created' }
    );
  }

  reminderCreated(reminder) {
    return this.createNotification(
      'success',
      'Reminder Set',
      `Reminder "${reminder.title}" has been created`,
      { reminderId: reminder.id, type: 'reminder_created' }
    );
  }

  calendarEventCreated(event) {
    return this.createNotification(
      'success',
      'Event Created',
      `Calendar event "${event.title}" has been added`,
      { eventId: event.id, type: 'event_created' }
    );
  }

  fileUploaded(file) {
    return this.createNotification(
      'success',
      'File Uploaded',
      `"${file.name}" has been uploaded successfully`,
      { fileId: file.id, type: 'file_uploaded' }
    );
  }

  // AI-related notifications
  aiResponseGenerated(type, context) {
    return this.createNotification(
      'info',
      'AI Response Generated',
      `AI has generated a ${type} response`,
      { type: 'ai_response', context }
    );
  }

  translationCompleted(sourceText, targetLanguage) {
    return this.createNotification(
      'success',
      'Translation Completed',
      `Text translated to ${targetLanguage}`,
      { type: 'translation_completed', sourceText: sourceText.substring(0, 50) }
    );
  }

  // System notifications
  systemError(error, context = {}) {
    return this.createNotification(
      'error',
      'System Error',
      error.message || 'An unexpected error occurred',
      { type: 'system_error', error: error.message, context }
    );
  }

  systemInfo(title, message, data = {}) {
    return this.createNotification(
      'info',
      title,
      message,
      { type: 'system_info', ...data }
    );
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;