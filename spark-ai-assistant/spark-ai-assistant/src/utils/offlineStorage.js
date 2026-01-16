// Offline Storage Utilities - Local storage + sync when online
export const offlineStorage = {
  // Storage keys
  KEYS: {
    NOTES: 'offline_notes',
    TASKS: 'offline_tasks',
    SYNC_QUEUE: 'sync_queue',
    LAST_SYNC: 'last_sync_timestamp',
    OFFLINE_MODE: 'offline_mode_enabled'
  },

  // Check if offline mode is enabled
  isOfflineModeEnabled: () => {
    return localStorage.getItem(offlineStorage.KEYS.OFFLINE_MODE) === 'true';
  },

  // Enable/disable offline mode
  setOfflineMode: (enabled) => {
    localStorage.setItem(offlineStorage.KEYS.OFFLINE_MODE, enabled.toString());
  },

  // Get offline notes
  getNotes: () => {
    try {
      const notes = localStorage.getItem(offlineStorage.KEYS.NOTES);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Error reading offline notes:', error);
      return [];
    }
  },

  // Save notes offline
  saveNotes: (notes) => {
    try {
      localStorage.setItem(offlineStorage.KEYS.NOTES, JSON.stringify(notes));
      return true;
    } catch (error) {
      console.error('Error saving offline notes:', error);
      return false;
    }
  },

  // Get offline tasks
  getTasks: () => {
    try {
      const tasks = localStorage.getItem(offlineStorage.KEYS.TASKS);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error reading offline tasks:', error);
      return [];
    }
  },

  // Save tasks offline
  saveTasks: (tasks) => {
    try {
      localStorage.setItem(offlineStorage.KEYS.TASKS, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error saving offline tasks:', error);
      return false;
    }
  },

  // Add item to sync queue
  addToSyncQueue: (action) => {
    try {
      const queue = offlineStorage.getSyncQueue();
      const syncItem = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        action: action.type, // 'CREATE', 'UPDATE', 'DELETE'
        entity: action.entity, // 'note', 'task'
        data: action.data,
        entityId: action.entityId
      };
      queue.push(syncItem);
      localStorage.setItem(offlineStorage.KEYS.SYNC_QUEUE, JSON.stringify(queue));
      return syncItem.id;
    } catch (error) {
      console.error('Error adding to sync queue:', error);
      return null;
    }
  },

  // Get sync queue
  getSyncQueue: () => {
    try {
      const queue = localStorage.getItem(offlineStorage.KEYS.SYNC_QUEUE);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error reading sync queue:', error);
      return [];
    }
  },

  // Clear sync queue
  clearSyncQueue: () => {
    localStorage.setItem(offlineStorage.KEYS.SYNC_QUEUE, JSON.stringify([]));
  },

  // Remove item from sync queue
  removeFromSyncQueue: (syncId) => {
    try {
      const queue = offlineStorage.getSyncQueue();
      const filteredQueue = queue.filter(item => item.id !== syncId);
      localStorage.setItem(offlineStorage.KEYS.SYNC_QUEUE, JSON.stringify(filteredQueue));
      return true;
    } catch (error) {
      console.error('Error removing from sync queue:', error);
      return false;
    }
  },

  // Get last sync timestamp
  getLastSyncTime: () => {
    return localStorage.getItem(offlineStorage.KEYS.LAST_SYNC);
  },

  // Set last sync timestamp
  setLastSyncTime: (timestamp = new Date().toISOString()) => {
    localStorage.setItem(offlineStorage.KEYS.LAST_SYNC, timestamp);
  },

  // Create offline note
  createNote: (noteData) => {
    const notes = offlineStorage.getNotes();
    const newNote = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...noteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOffline: true,
      needsSync: true
    };
    
    notes.unshift(newNote);
    offlineStorage.saveNotes(notes);
    
    // Add to sync queue
    offlineStorage.addToSyncQueue({
      type: 'CREATE',
      entity: 'note',
      data: newNote,
      entityId: newNote.id
    });
    
    return newNote;
  },

  // Update offline note
  updateNote: (noteId, updates) => {
    const notes = offlineStorage.getNotes();
    const noteIndex = notes.findIndex(note => note.id === noteId);
    
    if (noteIndex !== -1) {
      notes[noteIndex] = {
        ...notes[noteIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
        needsSync: true
      };
      
      offlineStorage.saveNotes(notes);
      
      // Add to sync queue
      offlineStorage.addToSyncQueue({
        type: 'UPDATE',
        entity: 'note',
        data: notes[noteIndex],
        entityId: noteId
      });
      
      return notes[noteIndex];
    }
    
    return null;
  },

  // Delete offline note
  deleteNote: (noteId) => {
    const notes = offlineStorage.getNotes();
    const noteIndex = notes.findIndex(note => note.id === noteId);
    
    if (noteIndex !== -1) {
      const deletedNote = notes[noteIndex];
      notes.splice(noteIndex, 1);
      offlineStorage.saveNotes(notes);
      
      // Add to sync queue
      offlineStorage.addToSyncQueue({
        type: 'DELETE',
        entity: 'note',
        data: deletedNote,
        entityId: noteId
      });
      
      return true;
    }
    
    return false;
  },

  // Create offline task
  createTask: (taskData) => {
    const tasks = offlineStorage.getTasks();
    const newTask = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOffline: true,
      needsSync: true
    };
    
    tasks.unshift(newTask);
    offlineStorage.saveTasks(tasks);
    
    // Add to sync queue
    offlineStorage.addToSyncQueue({
      type: 'CREATE',
      entity: 'task',
      data: newTask,
      entityId: newTask.id
    });
    
    return newTask;
  },

  // Update offline task
  updateTask: (taskId, updates) => {
    const tasks = offlineStorage.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
        needsSync: true
      };
      
      offlineStorage.saveTasks(tasks);
      
      // Add to sync queue
      offlineStorage.addToSyncQueue({
        type: 'UPDATE',
        entity: 'task',
        data: tasks[taskIndex],
        entityId: taskId
      });
      
      return tasks[taskIndex];
    }
    
    return null;
  },

  // Delete offline task
  deleteTask: (taskId) => {
    const tasks = offlineStorage.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
      const deletedTask = tasks[taskIndex];
      tasks.splice(taskIndex, 1);
      offlineStorage.saveTasks(tasks);
      
      // Add to sync queue
      offlineStorage.addToSyncQueue({
        type: 'DELETE',
        entity: 'task',
        data: deletedTask,
        entityId: taskId
      });
      
      return true;
    }
    
    return false;
  },

  // Merge online and offline data
  mergeData: (onlineData, offlineData, entityType) => {
    const merged = [...onlineData];
    
    // Add offline items that don't exist online
    offlineData.forEach(offlineItem => {
      const existsOnline = merged.find(onlineItem => 
        onlineItem.id === offlineItem.id || 
        (onlineItem.tempId && onlineItem.tempId === offlineItem.id)
      );
      
      if (!existsOnline) {
        merged.push(offlineItem);
      }
    });
    
    // Sort by updatedAt or createdAt
    merged.sort((a, b) => {
      const aDate = new Date(a.updatedAt || a.createdAt);
      const bDate = new Date(b.updatedAt || b.createdAt);
      return bDate - aDate;
    });
    
    return merged;
  },

  // Get storage usage info
  getStorageInfo: () => {
    try {
      const notes = offlineStorage.getNotes();
      const tasks = offlineStorage.getTasks();
      const syncQueue = offlineStorage.getSyncQueue();
      
      return {
        notesCount: notes.length,
        tasksCount: tasks.length,
        syncQueueCount: syncQueue.length,
        lastSync: offlineStorage.getLastSyncTime(),
        offlineModeEnabled: offlineStorage.isOfflineModeEnabled(),
        storageUsed: JSON.stringify({
          notes,
          tasks,
          syncQueue
        }).length
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        notesCount: 0,
        tasksCount: 0,
        syncQueueCount: 0,
        lastSync: null,
        offlineModeEnabled: false,
        storageUsed: 0
      };
    }
  },

  // Clear all offline data
  clearAllData: () => {
    try {
      localStorage.removeItem(offlineStorage.KEYS.NOTES);
      localStorage.removeItem(offlineStorage.KEYS.TASKS);
      localStorage.removeItem(offlineStorage.KEYS.SYNC_QUEUE);
      localStorage.removeItem(offlineStorage.KEYS.LAST_SYNC);
      return true;
    } catch (error) {
      console.error('Error clearing offline data:', error);
      return false;
    }
  }
};

export default offlineStorage;