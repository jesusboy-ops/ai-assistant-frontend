// Natural Language Processing Service - Parse and execute natural language commands
import { aiProductivityService } from './aiProductivityService';
import { showToast } from '../utils/toast';

export class NaturalLanguageService {
  constructor() {
    this.commandPatterns = this.initializePatterns();
    this.contextHistory = [];
  }

  // Initialize command patterns for natural language processing
  initializePatterns() {
    return {
      // Task creation patterns
      createTask: [
        /^(?:create|add|make|new)\s+(?:a\s+)?task\s+(.+)$/i,
        /^(?:i\s+need\s+to|todo|task)\s+(.+)$/i,
        /^remind\s+me\s+to\s+(.+)$/i,
        /^(.+)\s+(?:by|due|before)\s+(.+)$/i
      ],
      
      // Task management patterns
      completeTask: [
        /^(?:complete|finish|done|mark\s+complete)\s+(.+)$/i,
        /^(.+)\s+(?:is\s+)?(?:done|completed|finished)$/i
      ],
      
      rescheduleTask: [
        /^(?:reschedule|move|change)\s+(.+)\s+to\s+(.+)$/i,
        /^move\s+(.+)\s+(?:to\s+)?(.+)$/i
      ],
      
      // Calendar patterns
      createEvent: [
        /^(?:schedule|book|add)\s+(?:a\s+)?(?:meeting|event|appointment)\s+(.+)$/i,
        /^(?:meeting|event)\s+(.+)\s+(?:at|on)\s+(.+)$/i
      ],
      
      checkSchedule: [
        /^(?:what's|show|check)\s+(?:my\s+)?(?:schedule|calendar|agenda)(?:\s+for\s+(.+))?$/i,
        /^(?:do\s+i\s+have|any)\s+(?:meetings|events|appointments)(?:\s+(.+))?$/i
      ],
      
      // Note patterns
      createNote: [
        /^(?:create|add|make|new)\s+(?:a\s+)?note\s+(.+)$/i,
        /^note\s+(.+)$/i,
        /^write\s+down\s+(.+)$/i
      ],
      
      findNote: [
        /^(?:find|search|show)\s+(?:note|notes)\s+(?:about\s+)?(.+)$/i,
        /^(?:where\s+is|show\s+me)\s+(?:the\s+)?note\s+(?:about\s+)?(.+)$/i
      ],
      
      // Reminder patterns
      createReminder: [
        /^remind\s+me\s+(?:to\s+)?(.+)\s+(?:at|on|in)\s+(.+)$/i,
        /^(?:set\s+)?(?:a\s+)?reminder\s+(?:to\s+)?(.+)\s+(?:for\s+)?(.+)$/i
      ],
      
      // Query patterns
      productivity: [
        /^(?:how\s+am\s+i\s+doing|productivity|progress|stats)(?:\s+(.+))?$/i,
        /^(?:show|what's)\s+my\s+(?:productivity|progress|stats)$/i
      ],
      
      suggestions: [
        /^(?:what\s+should\s+i\s+do|suggestions|recommend|next)(?:\s+(.+))?$/i,
        /^(?:help\s+me\s+)?(?:prioritize|organize)(?:\s+(.+))?$/i
      ]
    };
  }

  // Main method to process natural language input
  async processCommand(input, context = {}) {
    const normalizedInput = input.trim().toLowerCase();
    
    // Add to context history
    this.contextHistory.push({
      input: normalizedInput,
      timestamp: new Date(),
      context
    });

    // Keep only last 10 commands for context
    if (this.contextHistory.length > 10) {
      this.contextHistory.shift();
    }

    try {
      // Try to match against patterns
      for (const [commandType, patterns] of Object.entries(this.commandPatterns)) {
        for (const pattern of patterns) {
          const match = normalizedInput.match(pattern);
          if (match) {
            return await this.executeCommand(commandType, match, context);
          }
        }
      }

      // If no pattern matches, try contextual interpretation
      return await this.handleContextualCommand(normalizedInput, context);
      
    } catch (error) {
      console.error('Error processing command:', error);
      return {
        success: false,
        message: 'Sorry, I couldn\'t understand that command. Try being more specific.',
        suggestions: this.generateHelpSuggestions()
      };
    }
  }

  // Execute matched commands
  async executeCommand(commandType, match, context) {
    switch (commandType) {
      case 'createTask':
        return await this.handleCreateTask(match, context);
      
      case 'completeTask':
        return await this.handleCompleteTask(match, context);
      
      case 'rescheduleTask':
        return await this.handleRescheduleTask(match, context);
      
      case 'createEvent':
        return await this.handleCreateEvent(match, context);
      
      case 'checkSchedule':
        return await this.handleCheckSchedule(match, context);
      
      case 'createNote':
        return await this.handleCreateNote(match, context);
      
      case 'findNote':
        return await this.handleFindNote(match, context);
      
      case 'createReminder':
        return await this.handleCreateReminder(match, context);
      
      case 'productivity':
        return await this.handleProductivityQuery(match, context);
      
      case 'suggestions':
        return await this.handleSuggestions(match, context);
      
      default:
        return {
          success: false,
          message: 'Command recognized but not implemented yet.'
        };
    }
  }

  // Task creation handler
  async handleCreateTask(match, context) {
    const taskText = match[1];
    const dueDate = match[2] ? this.parseDateTime(match[2]) : null;
    
    const taskData = this.extractTaskDetails(taskText);
    
    if (dueDate) {
      taskData.dueDate = dueDate;
    }

    // Determine priority based on keywords
    taskData.priority = this.determinePriority(taskText);
    
    // Estimate duration based on task description
    taskData.estimatedDuration = this.estimateDuration(taskText);
    
    // Extract category
    taskData.category = this.extractCategory(taskText);

    return {
      success: true,
      action: 'createTask',
      data: taskData,
      message: `I'll create a ${taskData.priority} priority task: "${taskData.title}"${dueDate ? ` due ${dueDate.toLocaleDateString()}` : ''}`
    };
  }

  // Task completion handler
  async handleCompleteTask(match, context) {
    const taskDescription = match[1];
    
    // Find matching tasks
    const tasks = context.tasks || [];
    const matchingTasks = this.findMatchingTasks(taskDescription, tasks);
    
    if (matchingTasks.length === 0) {
      return {
        success: false,
        message: `I couldn't find a task matching "${taskDescription}". Could you be more specific?`
      };
    }
    
    if (matchingTasks.length === 1) {
      return {
        success: true,
        action: 'completeTask',
        data: { taskId: matchingTasks[0].id },
        message: `Great! I'll mark "${matchingTasks[0].title}" as completed.`
      };
    }
    
    return {
      success: true,
      action: 'selectTask',
      data: { tasks: matchingTasks },
      message: `I found ${matchingTasks.length} tasks matching "${taskDescription}". Which one did you mean?`
    };
  }

  // Event creation handler
  async handleCreateEvent(match, context) {
    const eventText = match[1];
    const timeText = match[2] || match[1];
    
    const eventData = {
      title: this.extractEventTitle(eventText),
      start: this.parseDateTime(timeText),
      duration: this.estimateEventDuration(eventText),
      type: this.determineEventType(eventText)
    };
    
    if (eventData.start) {
      eventData.end = new Date(eventData.start.getTime() + eventData.duration * 60 * 1000);
    }

    return {
      success: true,
      action: 'createEvent',
      data: eventData,
      message: `I'll schedule "${eventData.title}" for ${eventData.start?.toLocaleString()}`
    };
  }

  // Schedule checking handler
  async handleCheckSchedule(match, context) {
    const dateText = match[1] || 'today';
    const targetDate = this.parseDateTime(dateText) || new Date();
    
    return {
      success: true,
      action: 'checkSchedule',
      data: { date: targetDate },
      message: `Here's your schedule for ${targetDate.toLocaleDateString()}:`
    };
  }

  // Note creation handler
  async handleCreateNote(match, context) {
    const noteText = match[1];
    
    const noteData = {
      title: this.extractNoteTitle(noteText),
      content: noteText,
      tags: this.extractTags(noteText),
      category: this.extractCategory(noteText)
    };

    return {
      success: true,
      action: 'createNote',
      data: noteData,
      message: `I'll create a note: "${noteData.title}"`
    };
  }

  // Reminder creation handler
  async handleCreateReminder(match, context) {
    const reminderText = match[1];
    const timeText = match[2];
    
    const reminderData = {
      title: this.extractReminderTitle(reminderText),
      description: reminderText,
      reminder_time: this.parseDateTime(timeText),
      type: this.determineReminderType(reminderText)
    };

    return {
      success: true,
      action: 'createReminder',
      data: reminderData,
      message: `I'll remind you to "${reminderData.title}" at ${reminderData.reminder_time?.toLocaleString()}`
    };
  }

  // Productivity query handler
  async handleProductivityQuery(match, context) {
    const period = match[1] || 'today';
    
    return {
      success: true,
      action: 'showProductivity',
      data: { period },
      message: `Here's your productivity summary for ${period}:`
    };
  }

  // Suggestions handler
  async handleSuggestions(match, context) {
    const area = match[1] || 'general';
    
    const suggestions = await this.generateIntelligentSuggestions(context, area);
    
    return {
      success: true,
      action: 'showSuggestions',
      data: { suggestions, area },
      message: `Here are some suggestions to improve your productivity:`
    };
  }

  // Contextual command handler for unmatched inputs
  async handleContextualCommand(input, context) {
    // Check if it's a follow-up to previous command
    const lastCommand = this.contextHistory[this.contextHistory.length - 2];
    
    if (lastCommand && this.isFollowUp(input)) {
      return await this.handleFollowUp(input, lastCommand, context);
    }
    
    // Try to infer intent from keywords
    const intent = this.inferIntent(input);
    
    if (intent) {
      return await this.handleInferredIntent(intent, input, context);
    }
    
    return {
      success: false,
      message: 'I\'m not sure what you want me to do. Try commands like "create task", "schedule meeting", or "show my agenda".',
      suggestions: this.generateHelpSuggestions()
    };
  }

  // Helper methods for parsing and extraction
  extractTaskDetails(text) {
    const title = text.replace(/\s+(?:by|due|before)\s+.+$/i, '').trim();
    
    return {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      description: '',
      tags: this.extractTags(text)
    };
  }

  determinePriority(text) {
    const urgentKeywords = ['urgent', 'asap', 'immediately', 'critical', 'emergency'];
    const highKeywords = ['important', 'high', 'priority', 'soon'];
    const lowKeywords = ['later', 'sometime', 'eventually', 'low'];
    
    const lowerText = text.toLowerCase();
    
    if (urgentKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'urgent';
    }
    if (highKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'high';
    }
    if (lowKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'low';
    }
    
    return 'medium';
  }

  estimateDuration(text) {
    // Look for explicit duration mentions
    const durationMatch = text.match(/(\d+)\s*(hour|hr|minute|min)s?/i);
    if (durationMatch) {
      const value = parseInt(durationMatch[1]);
      const unit = durationMatch[2].toLowerCase();
      return unit.startsWith('hour') || unit === 'hr' ? value * 60 : value;
    }
    
    // Estimate based on task complexity keywords
    const complexKeywords = ['research', 'analyze', 'develop', 'create', 'design', 'write'];
    const simpleKeywords = ['call', 'email', 'check', 'review', 'update'];
    
    const lowerText = text.toLowerCase();
    
    if (complexKeywords.some(keyword => lowerText.includes(keyword))) {
      return 120; // 2 hours
    }
    if (simpleKeywords.some(keyword => lowerText.includes(keyword))) {
      return 30; // 30 minutes
    }
    
    return 60; // Default 1 hour
  }

  extractCategory(text) {
    const categories = {
      'work': ['work', 'office', 'business', 'meeting', 'project', 'client'],
      'personal': ['personal', 'home', 'family', 'health', 'exercise'],
      'creative': ['design', 'write', 'create', 'art', 'music', 'creative'],
      'administrative': ['admin', 'paperwork', 'taxes', 'bills', 'organize'],
      'communication': ['call', 'email', 'message', 'contact', 'reach out']
    };
    
    const lowerText = text.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return category;
      }
    }
    
    return 'general';
  }

  extractTags(text) {
    const tags = [];
    
    // Extract hashtags
    const hashtagMatches = text.match(/#\w+/g);
    if (hashtagMatches) {
      tags.push(...hashtagMatches.map(tag => tag.substring(1)));
    }
    
    // Extract common tag patterns
    const tagPatterns = [
      /project\s+(\w+)/i,
      /client\s+(\w+)/i,
      /team\s+(\w+)/i
    ];
    
    tagPatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        tags.push(match[1].toLowerCase());
      }
    });
    
    return tags;
  }

  parseDateTime(text) {
    if (!text) return null;
    
    const now = new Date();
    const lowerText = text.toLowerCase().trim();
    
    // Handle relative dates
    if (lowerText === 'today') {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0);
    }
    
    if (lowerText === 'tomorrow') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0);
    }
    
    if (lowerText.includes('next week')) {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 9, 0);
    }
    
    // Handle specific times
    const timeMatch = lowerText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2] || '0');
      const ampm = timeMatch[3];
      
      if (ampm === 'pm' && hours !== 12) hours += 12;
      if (ampm === 'am' && hours === 12) hours = 0;
      
      const date = new Date(now);
      date.setHours(hours, minutes, 0, 0);
      
      // If time has passed today, schedule for tomorrow
      if (date <= now) {
        date.setDate(date.getDate() + 1);
      }
      
      return date;
    }
    
    // Handle day names
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayIndex = days.findIndex(day => lowerText.includes(day));
    
    if (dayIndex !== -1) {
      const targetDate = new Date(now);
      const currentDay = now.getDay();
      let daysToAdd = dayIndex - currentDay;
      
      if (daysToAdd <= 0) daysToAdd += 7; // Next occurrence
      
      targetDate.setDate(targetDate.getDate() + daysToAdd);
      targetDate.setHours(9, 0, 0, 0);
      return targetDate;
    }
    
    // Try to parse as regular date
    try {
      const parsed = new Date(text);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    } catch (e) {
      // Ignore parsing errors
    }
    
    return null;
  }

  findMatchingTasks(description, tasks) {
    const lowerDescription = description.toLowerCase();
    
    return tasks.filter(task => {
      const lowerTitle = task.title.toLowerCase();
      const lowerTaskDescription = (task.description || '').toLowerCase();
      
      // Exact match
      if (lowerTitle === lowerDescription) return true;
      
      // Partial match
      if (lowerTitle.includes(lowerDescription) || lowerDescription.includes(lowerTitle)) {
        return true;
      }
      
      // Word match
      const descriptionWords = lowerDescription.split(/\s+/);
      const titleWords = lowerTitle.split(/\s+/);
      
      const matchingWords = descriptionWords.filter(word => 
        titleWords.some(titleWord => titleWord.includes(word) || word.includes(titleWord))
      );
      
      return matchingWords.length >= Math.min(2, descriptionWords.length);
    });
  }

  extractEventTitle(text) {
    // Remove time-related words to get clean title
    return text
      .replace(/\s+(?:at|on|from|to)\s+\d+/gi, '')
      .replace(/\s+(?:meeting|event|appointment)\s*/gi, ' ')
      .trim();
  }

  determineEventType(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('meeting') || lowerText.includes('call')) return 'meeting';
    if (lowerText.includes('appointment') || lowerText.includes('doctor')) return 'appointment';
    if (lowerText.includes('lunch') || lowerText.includes('dinner')) return 'meal';
    if (lowerText.includes('interview')) return 'interview';
    
    return 'event';
  }

  estimateEventDuration(text) {
    const lowerText = text.toLowerCase();
    
    // Look for explicit duration
    const durationMatch = text.match(/(\d+)\s*(hour|hr|minute|min)s?/i);
    if (durationMatch) {
      const value = parseInt(durationMatch[1]);
      const unit = durationMatch[2].toLowerCase();
      return unit.startsWith('hour') || unit === 'hr' ? value * 60 : value;
    }
    
    // Estimate based on event type
    if (lowerText.includes('lunch') || lowerText.includes('coffee')) return 60;
    if (lowerText.includes('dinner')) return 90;
    if (lowerText.includes('interview')) return 60;
    if (lowerText.includes('standup') || lowerText.includes('daily')) return 15;
    
    return 60; // Default 1 hour
  }

  extractNoteTitle(text) {
    // Take first few words as title
    const words = text.split(/\s+/);
    return words.slice(0, Math.min(5, words.length)).join(' ');
  }

  extractReminderTitle(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  determineReminderType(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('meeting') || lowerText.includes('call')) return 'meeting';
    if (lowerText.includes('task') || lowerText.includes('work')) return 'task';
    if (lowerText.includes('appointment') || lowerText.includes('doctor')) return 'appointment';
    
    return 'personal';
  }

  async generateIntelligentSuggestions(context, area) {
    const suggestions = [];
    
    // Analyze current workload
    const tasks = context.tasks || [];
    const overdueTasks = tasks.filter(task => {
      return !task.completed && task.dueDate && new Date(task.dueDate) < new Date();
    });
    
    if (overdueTasks.length > 0) {
      suggestions.push({
        type: 'urgent',
        message: `You have ${overdueTasks.length} overdue tasks. Focus on these first.`,
        action: 'showOverdueTasks'
      });
    }
    
    // Suggest task prioritization
    const highPriorityTasks = tasks.filter(task => 
      !task.completed && ['urgent', 'high'].includes(task.priority)
    );
    
    if (highPriorityTasks.length > 3) {
      suggestions.push({
        type: 'prioritization',
        message: 'You have many high-priority tasks. Consider breaking them into smaller chunks.',
        action: 'suggestTaskBreakdown'
      });
    }
    
    // Time management suggestions
    const currentHour = new Date().getHours();
    if (currentHour >= 9 && currentHour <= 11) {
      suggestions.push({
        type: 'timing',
        message: 'This is typically a high-energy time. Consider tackling creative or complex tasks.',
        action: 'suggestCreativeTasks'
      });
    }
    
    return suggestions;
  }

  isFollowUp(input) {
    const followUpKeywords = ['yes', 'no', 'that one', 'the first', 'the second', 'option'];
    return followUpKeywords.some(keyword => input.toLowerCase().includes(keyword));
  }

  handleFollowUp(input, lastCommand, context) {
    // Handle follow-up responses based on last command
    if (lastCommand.action === 'selectTask') {
      // User is selecting from multiple tasks
      const selection = this.parseSelection(input);
      return {
        success: true,
        action: 'completeSelectedTask',
        data: { selection },
        message: 'Got it! I\'ll complete that task.'
      };
    }
    
    return {
      success: false,
      message: 'I\'m not sure what you\'re referring to.'
    };
  }

  parseSelection(input) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('first') || lowerInput.includes('1')) return 0;
    if (lowerInput.includes('second') || lowerInput.includes('2')) return 1;
    if (lowerInput.includes('third') || lowerInput.includes('3')) return 2;
    
    return 0; // Default to first option
  }

  inferIntent(input) {
    const intentKeywords = {
      task: ['task', 'todo', 'do', 'complete', 'finish'],
      schedule: ['schedule', 'calendar', 'meeting', 'appointment', 'time'],
      note: ['note', 'write', 'remember', 'jot'],
      reminder: ['remind', 'alert', 'notification'],
      query: ['show', 'what', 'how', 'when', 'where']
    };
    
    const lowerInput = input.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        return intent;
      }
    }
    
    return null;
  }

  handleInferredIntent(intent, input, context) {
    switch (intent) {
      case 'task':
        return {
          success: true,
          action: 'createTask',
          data: this.extractTaskDetails(input),
          message: `I think you want to create a task. Is this correct: "${input}"?`
        };
      
      case 'schedule':
        return {
          success: true,
          action: 'checkSchedule',
          data: { date: new Date() },
          message: 'Here\'s your schedule:'
        };
      
      default:
        return {
          success: false,
          message: 'I\'m not sure what you want me to do.'
        };
    }
  }

  generateHelpSuggestions() {
    return [
      'Try: "Create task: Review project proposal"',
      'Try: "Schedule meeting with John tomorrow at 2pm"',
      'Try: "Remind me to call Sarah at 3pm"',
      'Try: "What\'s my schedule for today?"',
      'Try: "Show my productivity stats"'
    ];
  }
}

// Create singleton instance
export const naturalLanguageService = new NaturalLanguageService();
export default naturalLanguageService;