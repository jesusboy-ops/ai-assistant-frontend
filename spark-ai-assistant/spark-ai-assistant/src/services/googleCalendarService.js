// Google Calendar Integration Service - Deep integration with Google Calendar
import { showToast } from '../utils/toast';

export class GoogleCalendarService {
  constructor() {
    this.isInitialized = false;
    this.gapi = null;
    this.syncInProgress = false;
    this.lastSyncTime = null;
    this.conflictResolutionQueue = [];
  }

  // Initialize Google Calendar API
  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Load Google API
      await this.loadGoogleAPI();
      
      // Initialize with your Google Calendar API credentials
      await this.gapi.load('client:auth2', async () => {
        await this.gapi.client.init({
          apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
          clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          scope: 'https://www.googleapis.com/auth/calendar'
        });
        
        this.isInitialized = true;
        console.log('Google Calendar API initialized');
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize Google Calendar API:', error);
      return false;
    }
  }

  // Load Google API script
  loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        this.gapi = window.gapi;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        this.gapi = window.gapi;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Authenticate user
  async authenticate() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }

      return {
        success: true,
        user: authInstance.currentUser.get().getBasicProfile()
      };
    } catch (error) {
      console.error('Authentication failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Sync events bidirectionally
  async syncEvents(localEvents = [], options = {}) {
    if (this.syncInProgress) {
      return { success: false, message: 'Sync already in progress' };
    }

    this.syncInProgress = true;
    
    try {
      const {
        calendarId = 'primary',
        syncDirection = 'bidirectional', // 'up', 'down', 'bidirectional'
        conflictResolution = 'prompt' // 'local', 'remote', 'prompt', 'merge'
      } = options;

      // Get Google Calendar events
      const googleEvents = await this.getGoogleCalendarEvents(calendarId);
      
      if (!googleEvents.success) {
        throw new Error(googleEvents.error);
      }

      const syncResult = {
        success: true,
        created: 0,
        updated: 0,
        deleted: 0,
        conflicts: [],
        errors: []
      };

      // Sync based on direction
      if (syncDirection === 'up' || syncDirection === 'bidirectional') {
        const uploadResult = await this.uploadLocalEvents(localEvents, googleEvents.events, calendarId, conflictResolution);
        syncResult.created += uploadResult.created;
        syncResult.updated += uploadResult.updated;
        syncResult.conflicts.push(...uploadResult.conflicts);
        syncResult.errors.push(...uploadResult.errors);
      }

      if (syncDirection === 'down' || syncDirection === 'bidirectional') {
        const downloadResult = await this.downloadGoogleEvents(googleEvents.events, localEvents, conflictResolution);
        syncResult.created += downloadResult.created;
        syncResult.updated += downloadResult.updated;
        syncResult.conflicts.push(...downloadResult.conflicts);
        syncResult.errors.push(...downloadResult.errors);
      }

      this.lastSyncTime = new Date();
      this.saveSyncMetadata();

      return syncResult;

    } catch (error) {
      console.error('Sync failed:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  // Get events from Google Calendar
  async getGoogleCalendarEvents(calendarId = 'primary', timeRange = {}) {
    try {
      const now = new Date();
      const timeMin = timeRange.start || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      const timeMax = timeRange.end || new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days ahead

      const response = await this.gapi.client.calendar.events.list({
        calendarId: calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 2500
      });

      const events = response.result.items.map(event => this.convertGoogleEventToLocal(event));

      return {
        success: true,
        events: events,
        nextSyncToken: response.result.nextSyncToken
      };

    } catch (error) {
      console.error('Failed to get Google Calendar events:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create event in Google Calendar
  async createGoogleEvent(eventData, calendarId = 'primary') {
    try {
      const googleEvent = this.convertLocalEventToGoogle(eventData);
      
      const response = await this.gapi.client.calendar.events.insert({
        calendarId: calendarId,
        resource: googleEvent
      });

      return {
        success: true,
        event: this.convertGoogleEventToLocal(response.result),
        googleEventId: response.result.id
      };

    } catch (error) {
      console.error('Failed to create Google Calendar event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update event in Google Calendar
  async updateGoogleEvent(eventId, eventData, calendarId = 'primary') {
    try {
      const googleEvent = this.convertLocalEventToGoogle(eventData);
      
      const response = await this.gapi.client.calendar.events.update({
        calendarId: calendarId,
        eventId: eventId,
        resource: googleEvent
      });

      return {
        success: true,
        event: this.convertGoogleEventToLocal(response.result)
      };

    } catch (error) {
      console.error('Failed to update Google Calendar event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete event from Google Calendar
  async deleteGoogleEvent(eventId, calendarId = 'primary') {
    try {
      await this.gapi.client.calendar.events.delete({
        calendarId: calendarId,
        eventId: eventId
      });

      return { success: true };

    } catch (error) {
      console.error('Failed to delete Google Calendar event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Auto-schedule tasks in Google Calendar
  async autoScheduleTasksInCalendar(tasks, preferences = {}) {
    try {
      const calendarEvents = await this.getGoogleCalendarEvents();
      if (!calendarEvents.success) {
        throw new Error('Failed to get calendar events');
      }

      const scheduledTasks = [];
      const { aiProductivityService } = await import('./aiProductivityService');
      
      // Use AI service to find optimal slots
      const optimalSchedule = await aiProductivityService.autoScheduleTasks(
        tasks, 
        calendarEvents.events, 
        preferences
      );

      // Create calendar events for scheduled tasks
      for (const scheduledTask of optimalSchedule) {
        const eventData = {
          title: `Task: ${scheduledTask.title}`,
          description: scheduledTask.description || '',
          start: scheduledTask.scheduledTime,
          end: scheduledTask.scheduledEndTime,
          type: 'task',
          taskId: scheduledTask.id,
          category: scheduledTask.category,
          priority: scheduledTask.priority
        };

        const createResult = await this.createGoogleEvent(eventData);
        
        if (createResult.success) {
          scheduledTasks.push({
            ...scheduledTask,
            googleEventId: createResult.googleEventId,
            calendarEvent: createResult.event
          });
        }
      }

      return {
        success: true,
        scheduledTasks: scheduledTasks,
        message: `Successfully scheduled ${scheduledTasks.length} tasks in your calendar`
      };

    } catch (error) {
      console.error('Auto-scheduling failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Detect and resolve calendar conflicts
  async detectConflicts(events) {
    const conflicts = [];
    const sortedEvents = events.sort((a, b) => new Date(a.start) - new Date(b.start));

    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const currentEvent = sortedEvents[i];
      const nextEvent = sortedEvents[i + 1];

      const currentEnd = new Date(currentEvent.end);
      const nextStart = new Date(nextEvent.start);

      if (currentEnd > nextStart) {
        conflicts.push({
          type: 'overlap',
          events: [currentEvent, nextEvent],
          overlapDuration: (currentEnd - nextStart) / (1000 * 60), // minutes
          severity: this.calculateConflictSeverity(currentEvent, nextEvent),
          suggestions: this.generateConflictResolutions(currentEvent, nextEvent)
        });
      }
    }

    return conflicts;
  }

  // Generate conflict resolution suggestions
  generateConflictResolutions(event1, event2) {
    const suggestions = [];

    // Suggest moving the less important event
    const priority1 = this.getEventPriority(event1);
    const priority2 = this.getEventPriority(event2);

    if (priority1 > priority2) {
      suggestions.push({
        type: 'reschedule',
        event: event2,
        reason: `${event1.title} has higher priority`,
        action: 'reschedule_event2'
      });
    } else if (priority2 > priority1) {
      suggestions.push({
        type: 'reschedule',
        event: event1,
        reason: `${event2.title} has higher priority`,
        action: 'reschedule_event1'
      });
    }

    // Suggest shortening events
    suggestions.push({
      type: 'shorten',
      event: event1,
      reason: 'Reduce duration to avoid conflict',
      action: 'shorten_event1'
    });

    // Suggest combining if similar
    if (this.areEventsSimilar(event1, event2)) {
      suggestions.push({
        type: 'combine',
        events: [event1, event2],
        reason: 'Similar events can be combined',
        action: 'combine_events'
      });
    }

    return suggestions;
  }

  // Smart event categorization
  categorizeEvent(eventData) {
    const title = (eventData.title || '').toLowerCase();
    const description = (eventData.description || '').toLowerCase();
    const text = `${title} ${description}`;

    const categories = {
      meeting: ['meeting', 'call', 'conference', 'discussion', 'standup', 'sync'],
      appointment: ['appointment', 'doctor', 'dentist', 'medical', 'checkup'],
      personal: ['personal', 'family', 'birthday', 'anniversary', 'vacation'],
      work: ['work', 'project', 'deadline', 'presentation', 'review'],
      social: ['lunch', 'dinner', 'coffee', 'drinks', 'party', 'social'],
      travel: ['flight', 'travel', 'trip', 'commute', 'drive'],
      learning: ['training', 'course', 'workshop', 'seminar', 'class'],
      health: ['gym', 'workout', 'exercise', 'fitness', 'yoga']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }

    return 'general';
  }

  // Intelligent event duration estimation
  estimateEventDuration(eventData) {
    const title = (eventData.title || '').toLowerCase();
    const category = this.categorizeEvent(eventData);

    // Duration patterns by category
    const durationMap = {
      meeting: 60,
      standup: 15,
      'one-on-one': 30,
      interview: 60,
      presentation: 90,
      lunch: 60,
      dinner: 90,
      coffee: 30,
      workout: 60,
      appointment: 30,
      'doctor appointment': 45
    };

    // Check for specific patterns
    for (const [pattern, duration] of Object.entries(durationMap)) {
      if (title.includes(pattern)) {
        return duration;
      }
    }

    // Category-based defaults
    const categoryDefaults = {
      meeting: 60,
      appointment: 30,
      personal: 120,
      work: 90,
      social: 90,
      travel: 180,
      learning: 120,
      health: 60
    };

    return categoryDefaults[category] || 60;
  }

  // Convert between Google Calendar and local event formats
  convertGoogleEventToLocal(googleEvent) {
    return {
      id: googleEvent.id,
      googleEventId: googleEvent.id,
      title: googleEvent.summary || 'Untitled Event',
      description: googleEvent.description || '',
      start: googleEvent.start.dateTime || googleEvent.start.date,
      end: googleEvent.end.dateTime || googleEvent.end.date,
      location: googleEvent.location || '',
      attendees: googleEvent.attendees?.map(attendee => ({
        email: attendee.email,
        name: attendee.displayName,
        status: attendee.responseStatus
      })) || [],
      category: this.categorizeEvent(googleEvent),
      type: 'event',
      source: 'google',
      lastModified: googleEvent.updated,
      isAllDay: !googleEvent.start.dateTime,
      recurrence: googleEvent.recurrence,
      reminders: googleEvent.reminders
    };
  }

  convertLocalEventToGoogle(localEvent) {
    const googleEvent = {
      summary: localEvent.title,
      description: localEvent.description || '',
      location: localEvent.location || '',
      start: {
        dateTime: new Date(localEvent.start).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: new Date(localEvent.end).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    // Add attendees if present
    if (localEvent.attendees && localEvent.attendees.length > 0) {
      googleEvent.attendees = localEvent.attendees.map(attendee => ({
        email: attendee.email,
        displayName: attendee.name
      }));
    }

    // Add recurrence if present
    if (localEvent.recurrence) {
      googleEvent.recurrence = localEvent.recurrence;
    }

    return googleEvent;
  }

  // Upload local events to Google Calendar
  async uploadLocalEvents(localEvents, googleEvents, calendarId, conflictResolution) {
    const result = { created: 0, updated: 0, conflicts: [], errors: [] };

    for (const localEvent of localEvents) {
      try {
        // Check if event already exists in Google Calendar
        const existingGoogleEvent = googleEvents.find(ge => 
          ge.googleEventId === localEvent.googleEventId ||
          (ge.title === localEvent.title && 
           Math.abs(new Date(ge.start) - new Date(localEvent.start)) < 60000) // Within 1 minute
        );

        if (existingGoogleEvent) {
          // Check for conflicts
          if (this.hasEventChanged(localEvent, existingGoogleEvent)) {
            const conflict = {
              type: 'update_conflict',
              localEvent,
              googleEvent: existingGoogleEvent,
              resolution: conflictResolution
            };

            if (conflictResolution === 'local') {
              await this.updateGoogleEvent(existingGoogleEvent.googleEventId, localEvent, calendarId);
              result.updated++;
            } else if (conflictResolution === 'prompt') {
              result.conflicts.push(conflict);
            }
          }
        } else {
          // Create new event
          const createResult = await this.createGoogleEvent(localEvent, calendarId);
          if (createResult.success) {
            result.created++;
          } else {
            result.errors.push({
              event: localEvent,
              error: createResult.error
            });
          }
        }
      } catch (error) {
        result.errors.push({
          event: localEvent,
          error: error.message
        });
      }
    }

    return result;
  }

  // Download Google events to local storage
  async downloadGoogleEvents(googleEvents, localEvents, conflictResolution) {
    const result = { created: 0, updated: 0, conflicts: [], errors: [] };

    for (const googleEvent of googleEvents) {
      try {
        // Check if event already exists locally
        const existingLocalEvent = localEvents.find(le => 
          le.googleEventId === googleEvent.googleEventId ||
          (le.title === googleEvent.title && 
           Math.abs(new Date(le.start) - new Date(googleEvent.start)) < 60000)
        );

        if (existingLocalEvent) {
          // Check for conflicts
          if (this.hasEventChanged(googleEvent, existingLocalEvent)) {
            const conflict = {
              type: 'download_conflict',
              googleEvent,
              localEvent: existingLocalEvent,
              resolution: conflictResolution
            };

            if (conflictResolution === 'remote') {
              // Update local event with Google data
              Object.assign(existingLocalEvent, googleEvent);
              result.updated++;
            } else if (conflictResolution === 'prompt') {
              result.conflicts.push(conflict);
            }
          }
        } else {
          // Add new local event
          localEvents.push(googleEvent);
          result.created++;
        }
      } catch (error) {
        result.errors.push({
          event: googleEvent,
          error: error.message
        });
      }
    }

    return result;
  }

  // Helper methods
  hasEventChanged(event1, event2) {
    const fields = ['title', 'description', 'start', 'end', 'location'];
    return fields.some(field => {
      const val1 = event1[field];
      const val2 = event2[field];
      
      if (field === 'start' || field === 'end') {
        return Math.abs(new Date(val1) - new Date(val2)) > 60000; // More than 1 minute difference
      }
      
      return val1 !== val2;
    });
  }

  getEventPriority(event) {
    let priority = 50; // Base priority
    
    // Increase priority for work events
    if (event.category === 'work' || event.category === 'meeting') {
      priority += 20;
    }
    
    // Increase priority for events with attendees
    if (event.attendees && event.attendees.length > 0) {
      priority += 15;
    }
    
    // Increase priority for events with specific keywords
    const highPriorityKeywords = ['urgent', 'important', 'critical', 'deadline'];
    const text = `${event.title} ${event.description}`.toLowerCase();
    
    if (highPriorityKeywords.some(keyword => text.includes(keyword))) {
      priority += 25;
    }
    
    return priority;
  }

  calculateConflictSeverity(event1, event2) {
    let severity = 1; // Base severity
    
    // Higher severity for work events
    if (event1.category === 'work' || event2.category === 'work') {
      severity += 2;
    }
    
    // Higher severity for events with attendees
    if ((event1.attendees?.length || 0) + (event2.attendees?.length || 0) > 0) {
      severity += 2;
    }
    
    return Math.min(5, severity); // Max severity of 5
  }

  areEventsSimilar(event1, event2) {
    const title1 = event1.title.toLowerCase();
    const title2 = event2.title.toLowerCase();
    
    // Check for similar titles
    const words1 = title1.split(/\s+/);
    const words2 = title2.split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    
    return commonWords.length >= Math.min(2, Math.min(words1.length, words2.length));
  }

  saveSyncMetadata() {
    const metadata = {
      lastSyncTime: this.lastSyncTime,
      syncCount: (this.getSyncMetadata().syncCount || 0) + 1
    };
    
    localStorage.setItem('googleCalendarSyncMetadata', JSON.stringify(metadata));
  }

  getSyncMetadata() {
    try {
      return JSON.parse(localStorage.getItem('googleCalendarSyncMetadata') || '{}');
    } catch {
      return {};
    }
  }
}

// Create singleton instance
export const googleCalendarService = new GoogleCalendarService();
export default googleCalendarService;