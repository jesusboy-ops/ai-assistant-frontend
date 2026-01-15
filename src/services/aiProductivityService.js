// AI Productivity Service - Core AI intelligence for task prioritization and scheduling
import { showToast } from '../utils/toast';

export class AIProductivityService {
  constructor() {
    this.userBehaviorData = this.loadUserBehavior();
    this.productivityPatterns = this.loadProductivityPatterns();
  }

  // Task Prioritization Algorithm
  calculateTaskPriority(task, allTasks = [], calendarEvents = []) {
    let score = 0;
    const now = new Date();
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;

    // Base priority score
    const priorityScores = {
      'urgent': 100,
      'high': 75,
      'medium': 50,
      'low': 25
    };
    score += priorityScores[task.priority] || 25;

    // Deadline urgency (exponential decay)
    if (dueDate) {
      const daysUntilDue = (dueDate - now) / (1000 * 60 * 60 * 24);
      if (daysUntilDue < 0) {
        score += 200; // Overdue tasks get highest priority
      } else if (daysUntilDue < 1) {
        score += 150; // Due today
      } else if (daysUntilDue < 3) {
        score += 100; // Due within 3 days
      } else if (daysUntilDue < 7) {
        score += 50; // Due within a week
      }
    }

    // Estimated effort vs available time
    const estimatedMinutes = task.estimatedDuration || 60;
    const availableSlots = this.findAvailableTimeSlots(calendarEvents);
    const canFitToday = availableSlots.some(slot => slot.duration >= estimatedMinutes);
    if (canFitToday) score += 30;

    // Task dependencies
    const dependentTasks = allTasks.filter(t => t.dependencies?.includes(task.id));
    score += dependentTasks.length * 20; // Higher score if other tasks depend on this

    // User behavior patterns
    const behaviorScore = this.calculateBehaviorScore(task);
    score += behaviorScore;

    // Context switching penalty
    const recentTasks = this.getRecentTasks();
    const isSimilarContext = recentTasks.some(rt => 
      rt.category === task.category || rt.tags?.some(tag => task.tags?.includes(tag))
    );
    if (isSimilarContext) score += 15;

    return Math.round(score);
  }

  // Find optimal time slots for task scheduling
  findOptimalTimeSlots(task, calendarEvents = [], preferences = {}) {
    const slots = [];
    const now = new Date();
    const endOfWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const duration = task.estimatedDuration || 60; // minutes
    const preferredTimes = preferences.preferredTimes || ['09:00', '14:00'];
    const workingHours = preferences.workingHours || { start: 9, end: 17 };

    // Generate potential slots
    for (let day = new Date(now); day <= endOfWeek; day.setDate(day.getDate() + 1)) {
      // Skip weekends if preference set
      if (preferences.skipWeekends && (day.getDay() === 0 || day.getDay() === 6)) {
        continue;
      }

      for (let hour = workingHours.start; hour < workingHours.end; hour++) {
        const slotStart = new Date(day);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

        // Check if slot conflicts with existing events
        const hasConflict = calendarEvents.some(event => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          return (slotStart < eventEnd && slotEnd > eventStart);
        });

        if (!hasConflict && slotStart > now) {
          let score = this.calculateSlotScore(slotStart, task, preferences);
          
          slots.push({
            start: slotStart,
            end: slotEnd,
            score,
            reason: this.getSlotReason(slotStart, task, preferences)
          });
        }
      }
    }

    // Sort by score and return top options
    return slots.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  calculateSlotScore(slotStart, task, preferences) {
    let score = 50; // Base score
    const hour = slotStart.getHours();
    
    // Preferred time bonus
    const preferredHours = preferences.preferredTimes?.map(time => parseInt(time.split(':')[0])) || [9, 14];
    const closestPreferred = preferredHours.reduce((prev, curr) => 
      Math.abs(curr - hour) < Math.abs(prev - hour) ? curr : prev
    );
    const timeDistance = Math.abs(hour - closestPreferred);
    score += Math.max(0, 20 - timeDistance * 2);

    // Energy level matching
    const energyLevels = this.getUserEnergyPattern();
    const energyScore = energyLevels[hour] || 50;
    score += energyScore * 0.3;

    // Task type optimization
    if (task.category === 'creative' && hour >= 9 && hour <= 11) score += 15;
    if (task.category === 'administrative' && hour >= 14 && hour <= 16) score += 15;
    if (task.category === 'communication' && hour >= 10 && hour <= 12) score += 10;

    // Deadline pressure
    if (task.dueDate) {
      const daysUntilDue = (new Date(task.dueDate) - slotStart) / (1000 * 60 * 60 * 24);
      if (daysUntilDue < 1) score += 30;
      else if (daysUntilDue < 3) score += 15;
    }

    return Math.round(score);
  }

  // Auto-schedule tasks in calendar
  async autoScheduleTasks(tasks, calendarEvents, preferences = {}) {
    const scheduledTasks = [];
    const prioritizedTasks = tasks
      .filter(task => !task.completed && !task.scheduledTime)
      .map(task => ({
        ...task,
        priority_score: this.calculateTaskPriority(task, tasks, calendarEvents)
      }))
      .sort((a, b) => b.priority_score - a.priority_score);

    for (const task of prioritizedTasks) {
      const optimalSlots = this.findOptimalTimeSlots(task, calendarEvents, preferences);
      
      if (optimalSlots.length > 0) {
        const bestSlot = optimalSlots[0];
        scheduledTasks.push({
          ...task,
          scheduledTime: bestSlot.start,
          scheduledEndTime: bestSlot.end,
          autoScheduled: true,
          schedulingReason: bestSlot.reason,
          schedulingScore: bestSlot.score
        });

        // Add to calendar events to prevent conflicts with next tasks
        calendarEvents.push({
          id: `task_${task.id}`,
          title: task.title,
          start: bestSlot.start,
          end: bestSlot.end,
          type: 'task'
        });
      }
    }

    return scheduledTasks;
  }

  // Handle recurring tasks intelligently
  generateRecurringTaskInstances(recurringTask, startDate, endDate) {
    const instances = [];
    const { recurrencePattern } = recurringTask;
    
    if (!recurrencePattern) return instances;

    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      // Create task instance
      const instance = {
        ...recurringTask,
        id: `${recurringTask.id}_${currentDate.toISOString().split('T')[0]}`,
        parentTaskId: recurringTask.id,
        dueDate: new Date(currentDate),
        isRecurringInstance: true,
        instanceDate: new Date(currentDate)
      };

      instances.push(instance);

      // Calculate next occurrence
      switch (recurrencePattern.type) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + (recurrencePattern.interval || 1));
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7 * (recurrencePattern.interval || 1));
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + (recurrencePattern.interval || 1));
          break;
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + (recurrencePattern.interval || 1));
          break;
        default:
          break;
      }

      // Safety check to prevent infinite loops
      if (instances.length > 365) break;
    }

    return instances;
  }

  // Detect and handle task dependencies
  analyzeDependencies(tasks) {
    const dependencyGraph = new Map();
    const analysis = {
      chains: [],
      blockers: [],
      criticalPath: [],
      suggestions: []
    };

    // Build dependency graph
    tasks.forEach(task => {
      if (task.dependencies && task.dependencies.length > 0) {
        dependencyGraph.set(task.id, task.dependencies);
      }
    });

    // Find dependency chains
    tasks.forEach(task => {
      const chain = this.findDependencyChain(task.id, dependencyGraph, tasks);
      if (chain.length > 1) {
        analysis.chains.push(chain);
      }
    });

    // Find blocking tasks
    tasks.forEach(task => {
      if (!task.completed) {
        const blockedTasks = tasks.filter(t => 
          t.dependencies?.includes(task.id) && !t.completed
        );
        if (blockedTasks.length > 0) {
          analysis.blockers.push({
            blocker: task,
            blocked: blockedTasks,
            impact: blockedTasks.length
          });
        }
      }
    });

    // Calculate critical path
    analysis.criticalPath = this.calculateCriticalPath(tasks, dependencyGraph);

    // Generate suggestions
    analysis.suggestions = this.generateDependencySuggestions(analysis);

    return analysis;
  }

  // User behavior learning
  recordTaskCompletion(task, completionTime, actualDuration) {
    const behavior = this.userBehaviorData;
    const hour = new Date().getHours();
    const dayOfWeek = new Date().getDay();

    // Update completion patterns
    if (!behavior.completionPatterns) behavior.completionPatterns = {};
    if (!behavior.completionPatterns[task.category]) {
      behavior.completionPatterns[task.category] = {
        preferredHours: {},
        averageDuration: {},
        successRate: {}
      };
    }

    const category = behavior.completionPatterns[task.category];
    category.preferredHours[hour] = (category.preferredHours[hour] || 0) + 1;
    category.averageDuration[task.priority] = actualDuration;
    category.successRate[dayOfWeek] = (category.successRate[dayOfWeek] || 0) + 1;

    // Update productivity patterns
    if (!behavior.productivityHours) behavior.productivityHours = {};
    behavior.productivityHours[hour] = (behavior.productivityHours[hour] || 0) + 1;

    this.saveUserBehavior(behavior);
  }

  // Generate daily agenda
  generateDailyAgenda(tasks, calendarEvents, notes, date = new Date()) {
    const agenda = {
      date: date,
      summary: {
        totalTasks: 0,
        highPriorityTasks: 0,
        meetings: 0,
        estimatedWorkload: 0,
        availableTime: 0
      },
      timeBlocks: [],
      suggestions: [],
      insights: []
    };

    // Filter tasks for the day
    const dayTasks = tasks.filter(task => {
      if (task.completed) return false;
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === date.toDateString();
      }
      return task.scheduledTime && 
        new Date(task.scheduledTime).toDateString() === date.toDateString();
    });

    // Filter calendar events for the day
    const dayEvents = calendarEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });

    // Calculate summary
    agenda.summary.totalTasks = dayTasks.length;
    agenda.summary.highPriorityTasks = dayTasks.filter(t => 
      ['urgent', 'high'].includes(t.priority)
    ).length;
    agenda.summary.meetings = dayEvents.filter(e => e.type === 'meeting').length;
    agenda.summary.estimatedWorkload = dayTasks.reduce((sum, task) => 
      sum + (task.estimatedDuration || 60), 0
    );

    // Generate time blocks
    agenda.timeBlocks = this.generateTimeBlocks(dayTasks, dayEvents, date);

    // Generate suggestions
    agenda.suggestions = this.generateAgendaSuggestions(dayTasks, dayEvents, notes);

    // Generate insights
    agenda.insights = this.generateDailyInsights(dayTasks, dayEvents);

    return agenda;
  }

  // Helper methods
  calculateBehaviorScore(task) {
    const behavior = this.userBehaviorData;
    let score = 0;

    if (behavior.completionPatterns && behavior.completionPatterns[task.category]) {
      const pattern = behavior.completionPatterns[task.category];
      const currentHour = new Date().getHours();
      
      // Preferred time bonus
      const hourPreference = pattern.preferredHours[currentHour] || 0;
      score += hourPreference * 2;

      // Success rate bonus
      const dayOfWeek = new Date().getDay();
      const successRate = pattern.successRate[dayOfWeek] || 0;
      score += successRate;
    }

    return score;
  }

  getUserEnergyPattern() {
    const behavior = this.userBehaviorData;
    const defaultPattern = {
      6: 30, 7: 40, 8: 60, 9: 80, 10: 90, 11: 85,
      12: 70, 13: 60, 14: 75, 15: 80, 16: 70, 17: 60,
      18: 50, 19: 40, 20: 30, 21: 25, 22: 20, 23: 15
    };

    return behavior.energyPattern || defaultPattern;
  }

  getSlotReason(slotStart, task, preferences) {
    const hour = slotStart.getHours();
    const reasons = [];

    if (preferences.preferredTimes?.some(time => 
      Math.abs(parseInt(time.split(':')[0]) - hour) <= 1
    )) {
      reasons.push('Matches your preferred time');
    }

    if (task.category === 'creative' && hour >= 9 && hour <= 11) {
      reasons.push('Optimal time for creative work');
    }

    if (task.dueDate) {
      const daysUntilDue = (new Date(task.dueDate) - slotStart) / (1000 * 60 * 60 * 24);
      if (daysUntilDue < 1) {
        reasons.push('Due today - high priority');
      }
    }

    return reasons.join(', ') || 'Available time slot';
  }

  findAvailableTimeSlots(calendarEvents, date = new Date()) {
    const slots = [];
    const dayStart = new Date(date);
    dayStart.setHours(9, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(17, 0, 0, 0);

    // Sort events by start time
    const dayEvents = calendarEvents
      .filter(event => new Date(event.start).toDateString() === date.toDateString())
      .sort((a, b) => new Date(a.start) - new Date(b.start));

    let currentTime = dayStart;

    dayEvents.forEach(event => {
      const eventStart = new Date(event.start);
      if (currentTime < eventStart) {
        const duration = (eventStart - currentTime) / (1000 * 60);
        if (duration >= 30) { // Minimum 30-minute slots
          slots.push({
            start: new Date(currentTime),
            end: new Date(eventStart),
            duration: duration
          });
        }
      }
      currentTime = new Date(Math.max(currentTime, new Date(event.end)));
    });

    // Add final slot if there's time left
    if (currentTime < dayEnd) {
      const duration = (dayEnd - currentTime) / (1000 * 60);
      if (duration >= 30) {
        slots.push({
          start: new Date(currentTime),
          end: new Date(dayEnd),
          duration: duration
        });
      }
    }

    return slots;
  }

  getRecentTasks() {
    // This would typically come from user activity tracking
    return JSON.parse(localStorage.getItem('recentTasks') || '[]');
  }

  findDependencyChain(taskId, dependencyGraph, tasks, visited = new Set()) {
    if (visited.has(taskId)) return []; // Circular dependency
    visited.add(taskId);

    const task = tasks.find(t => t.id === taskId);
    if (!task) return [];

    const chain = [task];
    const dependencies = dependencyGraph.get(taskId) || [];

    dependencies.forEach(depId => {
      const depChain = this.findDependencyChain(depId, dependencyGraph, tasks, visited);
      chain.push(...depChain);
    });

    return chain;
  }

  calculateCriticalPath(tasks, dependencyGraph) {
    // Simplified critical path calculation
    const completedTasks = tasks.filter(t => t.completed);
    const pendingTasks = tasks.filter(t => !t.completed);
    
    return pendingTasks
      .filter(task => {
        const blockedTasks = tasks.filter(t => t.dependencies?.includes(task.id));
        return blockedTasks.length > 0;
      })
      .sort((a, b) => {
        const aBlocked = tasks.filter(t => t.dependencies?.includes(a.id)).length;
        const bBlocked = tasks.filter(t => t.dependencies?.includes(b.id)).length;
        return bBlocked - aBlocked;
      });
  }

  generateDependencySuggestions(analysis) {
    const suggestions = [];

    analysis.blockers.forEach(blocker => {
      if (blocker.impact > 2) {
        suggestions.push({
          type: 'priority',
          message: `Focus on "${blocker.blocker.title}" - it's blocking ${blocker.impact} other tasks`,
          action: 'prioritize',
          taskId: blocker.blocker.id
        });
      }
    });

    return suggestions;
  }

  generateTimeBlocks(tasks, events, date) {
    const blocks = [];
    const allItems = [
      ...tasks.map(t => ({ ...t, type: 'task' })),
      ...events.map(e => ({ ...e, type: 'event' }))
    ].sort((a, b) => {
      const aTime = new Date(a.scheduledTime || a.start);
      const bTime = new Date(b.scheduledTime || b.start);
      return aTime - bTime;
    });

    allItems.forEach(item => {
      blocks.push({
        id: item.id,
        title: item.title,
        type: item.type,
        start: item.scheduledTime || item.start,
        end: item.scheduledEndTime || item.end,
        priority: item.priority,
        category: item.category
      });
    });

    return blocks;
  }

  generateAgendaSuggestions(tasks, events, notes) {
    const suggestions = [];

    // Workload suggestions
    const totalWorkload = tasks.reduce((sum, task) => sum + (task.estimatedDuration || 60), 0);
    if (totalWorkload > 480) { // More than 8 hours
      suggestions.push({
        type: 'workload',
        message: 'Your day looks packed. Consider rescheduling some tasks.',
        priority: 'high'
      });
    }

    // Meeting preparation
    const meetings = events.filter(e => e.type === 'meeting');
    meetings.forEach(meeting => {
      const relatedNotes = notes.filter(note => 
        note.title.toLowerCase().includes(meeting.title.toLowerCase()) ||
        note.tags?.includes('meeting')
      );
      
      if (relatedNotes.length === 0) {
        suggestions.push({
          type: 'preparation',
          message: `Consider creating notes for "${meeting.title}"`,
          priority: 'medium'
        });
      }
    });

    return suggestions;
  }

  generateDailyInsights(tasks, events) {
    const insights = [];

    const highPriorityTasks = tasks.filter(t => ['urgent', 'high'].includes(t.priority));
    if (highPriorityTasks.length > 3) {
      insights.push({
        type: 'priority',
        message: `You have ${highPriorityTasks.length} high-priority tasks today. Focus on the most critical ones first.`
      });
    }

    const meetingTime = events.reduce((sum, event) => {
      const duration = (new Date(event.end) - new Date(event.start)) / (1000 * 60);
      return sum + duration;
    }, 0);

    if (meetingTime > 240) { // More than 4 hours in meetings
      insights.push({
        type: 'meetings',
        message: `You have ${Math.round(meetingTime / 60)} hours of meetings. Plan for limited deep work time.`
      });
    }

    return insights;
  }

  loadUserBehavior() {
    try {
      return JSON.parse(localStorage.getItem('userBehaviorData') || '{}');
    } catch {
      return {};
    }
  }

  saveUserBehavior(data) {
    localStorage.setItem('userBehaviorData', JSON.stringify(data));
  }

  loadProductivityPatterns() {
    try {
      return JSON.parse(localStorage.getItem('productivityPatterns') || '{}');
    } catch {
      return {};
    }
  }
}

// Create singleton instance
export const aiProductivityService = new AIProductivityService();
export default aiProductivityService;