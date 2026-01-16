// Sync Service - Handle offline/online synchronization
import { offlineStorage } from '../utils/offlineStorage';
import { notesApi } from '../api/notesApi';
import { tasksApi } from '../api/tasksApi';
import { showToast } from '../utils/toast';

export class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOffline();
    });
  }

  handleOnline() {
    showToast.success('Connection restored - syncing data...');
    this.syncAll();
  }

  handleOffline() {
    showToast.info('Working offline - changes will sync when connection is restored');
  }

  async syncAll() {
    if (this.syncInProgress || !this.isOnline) return;

    this.syncInProgress = true;
    try {
      const syncQueue = offlineStorage.getSyncQueue();
      let successCount = 0;
      let errorCount = 0;

      for (const syncItem of syncQueue) {
        try {
          await this.processSyncItem(syncItem);
          offlineStorage.removeFromSyncQueue(syncItem.id);
          successCount++;
        } catch (error) {
          console.error('Sync error for item:', syncItem, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        showToast.success(`Synced ${successCount} items successfully`);
        offlineStorage.setLastSyncTime();
      }

      if (errorCount > 0) {
        showToast.error(`Failed to sync ${errorCount} items`);
      }

      // Fetch latest data from server to merge
      await this.fetchAndMergeData();

    } catch (error) {
      console.error('Sync process error:', error);
      showToast.error('Sync failed - will retry later');
    } finally {
      this.syncInProgress = false;
    }
  }

  async processSyncItem(syncItem) {
    const { action, entity, data, entityId } = syncItem;

    switch (entity) {
      case 'note':
        return await this.syncNote(action, data, entityId);
      case 'task':
        return await this.syncTask(action, data, entityId);
      default:
        throw new Error(`Unknown entity type: ${entity}`);
    }
  }

  async syncNote(action, data, entityId) {
    switch (action) {
      case 'CREATE':
        const createResult = await notesApi.createNote({
          title: data.title,
          content: data.content,
          tags: data.tags || []
        });
        if (createResult.success) {
          // Update local storage with server ID
          this.updateOfflineItemWithServerId('note', entityId, createResult.data.id);
          return createResult.data;
        }
        throw new Error(createResult.error);

      case 'UPDATE':
        const updateResult = await notesApi.updateNote(entityId, {
          title: data.title,
          content: data.content,
          tags: data.tags || []
        });
        if (updateResult.success) {
          return updateResult.data;
        }
        throw new Error(updateResult.error);

      case 'DELETE':
        const deleteResult = await notesApi.deleteNote(entityId);
        if (deleteResult.success) {
          return true;
        }
        throw new Error(deleteResult.error);

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async syncTask(action, data, entityId) {
    switch (action) {
      case 'CREATE':
        const createResult = await tasksApi.createTask({
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          priority: data.priority,
          completed: data.completed || false
        });
        if (createResult.success) {
          // Update local storage with server ID
          this.updateOfflineItemWithServerId('task', entityId, createResult.data.id);
          return createResult.data;
        }
        throw new Error(createResult.error);

      case 'UPDATE':
        const updateResult = await tasksApi.updateTask(entityId, {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          priority: data.priority,
          completed: data.completed
        });
        if (updateResult.success) {
          return updateResult.data;
        }
        throw new Error(updateResult.error);

      case 'DELETE':
        const deleteResult = await tasksApi.deleteTask(entityId);
        if (deleteResult.success) {
          return true;
        }
        throw new Error(deleteResult.error);

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  updateOfflineItemWithServerId(entityType, offlineId, serverId) {
    if (entityType === 'note') {
      const notes = offlineStorage.getNotes();
      const noteIndex = notes.findIndex(note => note.id === offlineId);
      if (noteIndex !== -1) {
        notes[noteIndex].id = serverId;
        notes[noteIndex].isOffline = false;
        notes[noteIndex].needsSync = false;
        offlineStorage.saveNotes(notes);
      }
    } else if (entityType === 'task') {
      const tasks = offlineStorage.getTasks();
      const taskIndex = tasks.findIndex(task => task.id === offlineId);
      if (taskIndex !== -1) {
        tasks[taskIndex].id = serverId;
        tasks[taskIndex].isOffline = false;
        tasks[taskIndex].needsSync = false;
        offlineStorage.saveTasks(tasks);
      }
    }
  }

  async fetchAndMergeData() {
    try {
      // Fetch notes from server
      const notesResult = await notesApi.getNotes();
      if (notesResult.success) {
        const serverNotes = Array.isArray(notesResult.data) ? notesResult.data : notesResult.data?.notes || [];
        const offlineNotes = offlineStorage.getNotes();
        const mergedNotes = offlineStorage.mergeData(serverNotes, offlineNotes, 'note');
        offlineStorage.saveNotes(mergedNotes);
      }

      // Fetch tasks from server
      const tasksResult = await tasksApi.getTasks();
      if (tasksResult.success) {
        const serverTasks = Array.isArray(tasksResult.data) ? tasksResult.data : tasksResult.data?.tasks || [];
        const offlineTasks = offlineStorage.getTasks();
        const mergedTasks = offlineStorage.mergeData(serverTasks, offlineTasks, 'task');
        offlineStorage.saveTasks(mergedTasks);
      }

    } catch (error) {
      console.error('Error fetching and merging data:', error);
    }
  }

  // Manual sync trigger
  async forcSync() {
    if (!this.isOnline) {
      showToast.error('Cannot sync while offline');
      return false;
    }

    showToast.info('Starting manual sync...');
    await this.syncAll();
    return true;
  }

  // Get sync status
  getSyncStatus() {
    const syncQueue = offlineStorage.getSyncQueue();
    const lastSync = offlineStorage.getLastSyncTime();
    
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      pendingItems: syncQueue.length,
      lastSync: lastSync ? new Date(lastSync) : null,
      offlineModeEnabled: offlineStorage.isOfflineModeEnabled()
    };
  }

  // Enable/disable offline mode
  setOfflineMode(enabled) {
    offlineStorage.setOfflineMode(enabled);
    if (enabled && this.isOnline) {
      // Sync before going offline
      this.syncAll();
    }
  }
}

// Create singleton instance
export const syncService = new SyncService();
export default syncService;