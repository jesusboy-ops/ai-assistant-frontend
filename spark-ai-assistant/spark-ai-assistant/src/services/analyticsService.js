// Analytics Service - Productivity insights and reporting
export class AnalyticsService {
  constructor() {
    this.analyticsData = this.loadAnalyticsData();
  }

  // Generate comprehensive productivity insights
  generateProductivityInsights(tasks, calendarEvents, notes, timeframe = 'week') {
    const insights = {
      overview: this.generateOverview(tasks, calendarEvents, notes, timeframe),
      taskAnalytics: this.analyzeTaskPerformance(tasks, timeframe),
      timeAnalytics: this.analyzeTimeAllocation(tasks, calendarEvents, timeframe),
      productivityPatterns: this.analyzeProductivityPatterns(tasks, timeframe),
      calendarInsights: this.analyzeCalendarEfficiency(calendarEvents, timeframe),
      recommendations: this.generateRecommendations(tasks, calendarEvents, timeframe),
      trends: this.analyzeTrends(tasks, calendarEvents, timeframe),
      collaborationInsights: this.analyzeCollaboration(notes, calendarEvents, timeframe)
    };

    return insights;
  }

  // Generate overview statistics
  generateOverview(tasks, calendarEvents, notes, timeframe) {
    const now = new Date();
    const startDate = this.getStartDate(now, timeframe);
    
    const periodTasks = this.filterByTimeframe(tasks, startDate, now, 'createdAt');
    const periodEvents = this.filterByTimeframe(calendarEvents, startDate, now, 'start');
    const periodNotes = this.filterByTimeframe(notes, startDate, now, 'createdAt');

    const completedTasks = periodTasks.filter(task => task.completed);
    const overdueTasks = periodTasks.filter(task => 
      !task.completed && task.dueDate && new Date(task.dueDate) < now
    );

    return {
      totalTasks: periodTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: periodTasks.length - completedTasks.length,
      overdueTasks: overdueTasks.length,
      completionRate: periodTasks.length > 0 ? (completedTasks.length / periodTasks.length * 100).toFixed(1) : 0,
      totalMeetings: periodEvents.filter(e => e.type === 'meeting').length,
      totalNotes: periodNotes.length,
      productivityScore: this.calculateProductivityScore(periodTasks, periodEvents),
      timeframe: timeframe
    };
  }

  // Analyze task performance metrics
  analyzeTaskPerformance(tasks, timeframe) {
    const now = new Date();
    const startDate = this.getStartDate(now, timeframe);
    const periodTasks = this.filterByTimeframe(tasks, startDate, now, 'createdAt');

    // Task completion by priority
    const priorityBreakdown = {
      urgent: { total: 0, completed: 0 },
      high: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      low: { total: 0, completed: 0 }
    };

    periodTasks.forEach(task => {
      const priority = task.priority || 'medium';
      priorityBreakdown[priority].total++;
      if (task.completed) {
        priorityBreakdown[priority].completed++;
      }
    });

    // Task completion by category
    const categoryBreakdown = {};
    periodTasks.forEach(task => {
      const category = task.category || 'general';
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { total: 0, completed: 0 };
      }
      categoryBreakdown[category].total++;
      if (task.completed) {
        categoryBreakdown[category].completed++;
      }
    });

    // Average completion time
    const completedTasks = periodTasks.filter(task => task.completed && task.completedAt);
    const avgCompletionTime = this.calculateAverageCompletionTime(completedTasks);

    // Task velocity (tasks completed per day)
    const daysInPeriod = Math.max(1, (now - startDate) / (1000 * 60 * 60 * 24));
    const taskVelocity = completedTasks.length / daysInPeriod;

    return {
      priorityBreakdown,
      categoryBreakdown,
      avgCompletionTime,
      taskVelocity: taskVelocity.toFixed(2),
      mostProductiveCategory: this.findMostProductiveCategory(categoryBreakdown),
      taskEfficiencyScore: this.calculateTaskEfficiency(periodTasks)
    };
  }

  // Analyze time allocation patterns
  analyzeTimeAllocation(tasks, calendarEvents, timeframe) {
    const now = new Date();
    const startDate = this.getStartDate(now, timeframe);
    
    const periodEvents = this.filterByTimeframe(calendarEvents, startDate, now, 'start');
    const completedTasks = tasks.filter(task => 
      task.completed && task.completedAt && 
      new Date(task.completedAt) >= startDate && new Date(task.completedAt) <= now
    );

    // Time spent in meetings
    const meetingTime = periodEvents.reduce((total, event) => {
      if (event.type === 'meeting') {
        const duration = (new Date(event.end) - new Date(event.start)) / (1000 * 60);
        return total + duration;
      }
      return total;
    }, 0);

    // Time spent on tasks by category
    const taskTimeByCategory = {};
    completedTasks.forEach(task => {
      const category = task.category || 'general';
      const duration = task.actualDuration || task.estimatedDuration || 60;
      taskTimeByCategory[category] = (taskTimeByCategory[category] || 0) + duration;
    });

    // Peak productivity hours
    const hourlyProductivity = this.analyzeHourlyProductivity(completedTasks);
    const peakHours = this.findPeakProductivityHours(hourlyProductivity);

    // Work-life balance indicators
    const workLifeBalance = this.analyzeWorkLifeBalance(tasks, calendarEvents, timeframe);

    return {
      meetingTimeMinutes: Math.round(meetingTime),
      meetingTimeHours: (meetingTime / 60).toFixed(1),
      taskTimeByCategory,
      totalTaskTime: Object.values(taskTimeByCategory).reduce((sum, time) => sum + time, 0),
      hourlyProductivity,
      peakHours,
      workLifeBalance,
      timeUtilization: this.calculateTimeUtilization(meetingTime, taskTimeByCategory)
    };
  }

  // Analyze productivity patterns
  analyzeProductivityPatterns(tasks, timeframe) {
    const now = new Date();
    const startDate = this.getStartDate(now, timeframe);
    const completedTasks = tasks.filter(task => 
      task.completed && task.completedAt && 
      new Date(task.completedAt) >= startDate && new Date(task.completedAt) <= now
    );

    // Daily productivity pattern
    const dailyPattern = this.analyzeDailyPattern(completedTasks);
    
    // Weekly productivity pattern
    const weeklyPattern = this.analyzeWeeklyPattern(completedTasks);
    
    // Task completion streaks
    const streaks = this.analyzeCompletionStreaks(tasks);
    
    // Procrastination indicators
    const procrastinationMetrics = this.analyzeProcrastination(tasks);

    // Focus time analysis
    const focusTimeAnalysis = this.analyzeFocusTime(completedTasks);

    return {
      dailyPattern,
      weeklyPattern,
      streaks,
      procrastinationMetrics,
      focusTimeAnalysis,
      consistencyScore: this.calculateConsistencyScore(dailyPattern),
      optimalWorkingHours: this.findOptimalWorkingHours(dailyPattern)
    };
  }

  // Analyze calendar efficiency
  analyzeCalendarEfficiency(calendarEvents, timeframe) {
    const now = new Date();
    const startDate = this.getStartDate(now, timeframe);
    const periodEvents = this.filterByTimeframe(calendarEvents, startDate, now, 'start');

    // Meeting efficiency metrics
    const meetings = periodEvents.filter(event => event.type === 'meeting');
    const avgMeetingDuration = meetings.length > 0 
      ? meetings.reduce((sum, meeting) => {
          const duration = (new Date(meeting.end) - new Date(meeting.start)) / (1000 * 60);
          return sum + duration;
        }, 0) / meetings.length
      : 0;

    // Calendar conflicts
    const conflicts = this.detectCalendarConflicts(periodEvents);
    
    // Meeting-free time blocks
    const focusBlocks = this.analyzeFocusBlocks(periodEvents);
    
    // Meeting patterns
    const meetingPatterns = this.analyzeMeetingPatterns(meetings);

    return {
      totalMeetings: meetings.length,
      avgMeetingDuration: Math.round(avgMeetingDuration),
      conflicts: conflicts.length,
      conflictDetails: conflicts,
      focusBlocks,
      meetingPatterns,
      calendarUtilization: this.calculateCalendarUtilization(periodEvents),
      suggestedOptimizations: this.suggestCalendarOptimizations(periodEvents)
    };
  }

  // Generate AI-powered recommendations
  generateRecommendations(tasks, calendarEvents, timeframe) {
    const recommendations = [];
    
    // Task management recommendations
    const taskRecommendations = this.generateTaskRecommendations(tasks);
    recommendations.push(...taskRecommendations);
    
    // Time management recommendations
    const timeRecommendations = this.generateTimeRecommendations(tasks, calendarEvents);
    recommendations.push(...timeRecommendations);
    
    // Calendar optimization recommendations
    const calendarRecommendations = this.generateCalendarRecommendations(calendarEvents);
    recommendations.push(...calendarRecommendations);
    
    // Productivity improvement recommendations
    const productivityRecommendations = this.generateProductivityRecommendations(tasks, calendarEvents);
    recommendations.push(...productivityRecommendations);

    // Sort by priority and impact
    return recommendations
      .sort((a, b) => (b.priority * b.impact) - (a.priority * a.impact))
      .slice(0, 10); // Top 10 recommendations
  }

  // Analyze trends over time
  analyzeTrends(tasks, calendarEvents, timeframe) {
    const trends = {
      taskCompletionTrend: this.analyzeTaskCompletionTrend(tasks, timeframe),
      productivityTrend: this.analyzeProductivityTrend(tasks, timeframe),
      meetingTrend: this.analyzeMeetingTrend(calendarEvents, timeframe),
      focusTrend: this.analyzeFocusTrend(tasks, calendarEvents, timeframe)
    };

    return trends;
  }

  // Analyze collaboration patterns
  analyzeCollaboration(notes, calendarEvents, timeframe) {
    const now = new Date();
    const startDate = this.getStartDate(now, timeframe);
    
    const periodNotes = this.filterByTimeframe(notes, startDate, now, 'createdAt');
    const periodEvents = this.filterByTimeframe(calendarEvents, startDate, now, 'start');

    // Shared notes analysis
    const sharedNotes = periodNotes.filter(note => note.sharedWith && note.sharedWith.length > 0);
    
    // Meeting collaboration
    const collaborativeMeetings = periodEvents.filter(event => 
      event.attendees && event.attendees.length > 1
    );

    // Collaboration frequency
    const collaborationFrequency = this.calculateCollaborationFrequency(sharedNotes, collaborativeMeetings);

    return {
      sharedNotesCount: sharedNotes.length,
      collaborativeMeetingsCount: collaborativeMeetings.length,
      collaborationFrequency,
      topCollaborators: this.findTopCollaborators(sharedNotes, collaborativeMeetings),
      collaborationTrends: this.analyzeCollaborationTrends(sharedNotes, collaborativeMeetings, timeframe)
    };
  }

  // Export analytics report
  exportReport(insights, format = 'json') {
    const report = {
      generatedAt: new Date().toISOString(),
      timeframe: insights.overview.timeframe,
      summary: insights.overview,
      insights: insights,
      metadata: {
        version: '1.0',
        format: format
      }
    };

    if (format === 'json') {
      return JSON.stringify(report, null, 2);
    }
    
    if (format === 'csv') {
      return this.convertToCSV(report);
    }
    
    if (format === 'markdown') {
      return this.convertToMarkdown(report);
    }

    return report;
  }

  // Helper methods
  getStartDate(now, timeframe) {
    const start = new Date(now);
    
    switch (timeframe) {
      case 'day':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(start.getDate() - start.getDay());
        start.setHours(0, 0, 0, 0);
        break;
      case 'month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'quarter':
        const quarter = Math.floor(start.getMonth() / 3);
        start.setMonth(quarter * 3, 1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'year':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        break;
      default:
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
    }
    
    return start;
  }

  filterByTimeframe(items, startDate, endDate, dateField) {
    return items.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  calculateProductivityScore(tasks, events) {
    const completedTasks = tasks.filter(task => task.completed);
    const totalTasks = tasks.length;
    
    if (totalTasks === 0) return 0;
    
    let score = (completedTasks.length / totalTasks) * 100;
    
    // Bonus for completing high-priority tasks
    const highPriorityCompleted = completedTasks.filter(task => 
      ['urgent', 'high'].includes(task.priority)
    ).length;
    score += highPriorityCompleted * 5;
    
    // Penalty for overdue tasks
    const overdueTasks = tasks.filter(task => 
      !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
    ).length;
    score -= overdueTasks * 10;
    
    // Meeting efficiency factor
    const meetings = events.filter(e => e.type === 'meeting');
    const avgMeetingDuration = meetings.length > 0 
      ? meetings.reduce((sum, m) => sum + ((new Date(m.end) - new Date(m.start)) / (1000 * 60)), 0) / meetings.length
      : 60;
    
    if (avgMeetingDuration > 90) score -= 5; // Penalty for long meetings
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  calculateAverageCompletionTime(completedTasks) {
    if (completedTasks.length === 0) return 0;
    
    const totalTime = completedTasks.reduce((sum, task) => {
      if (task.createdAt && task.completedAt) {
        const duration = new Date(task.completedAt) - new Date(task.createdAt);
        return sum + duration;
      }
      return sum;
    }, 0);
    
    return Math.round(totalTime / completedTasks.length / (1000 * 60 * 60 * 24)); // Days
  }

  findMostProductiveCategory(categoryBreakdown) {
    let bestCategory = null;
    let bestRate = 0;
    
    Object.entries(categoryBreakdown).forEach(([category, data]) => {
      if (data.total > 0) {
        const rate = data.completed / data.total;
        if (rate > bestRate) {
          bestRate = rate;
          bestCategory = category;
        }
      }
    });
    
    return {
      category: bestCategory,
      completionRate: (bestRate * 100).toFixed(1)
    };
  }

  calculateTaskEfficiency(tasks) {
    const completedTasks = tasks.filter(task => task.completed);
    const totalTasks = tasks.length;
    
    if (totalTasks === 0) return 0;
    
    // Base efficiency from completion rate
    let efficiency = (completedTasks.length / totalTasks) * 100;
    
    // Factor in on-time completion
    const onTimeCompletions = completedTasks.filter(task => {
      if (!task.dueDate || !task.completedAt) return true;
      return new Date(task.completedAt) <= new Date(task.dueDate);
    }).length;
    
    const onTimeRate = completedTasks.length > 0 ? onTimeCompletions / completedTasks.length : 1;
    efficiency *= onTimeRate;
    
    return Math.round(efficiency);
  }

  analyzeHourlyProductivity(completedTasks) {
    const hourlyData = {};
    
    // Initialize all hours
    for (let hour = 0; hour < 24; hour++) {
      hourlyData[hour] = { tasks: 0, totalDuration: 0 };
    }
    
    completedTasks.forEach(task => {
      if (task.completedAt) {
        const hour = new Date(task.completedAt).getHours();
        hourlyData[hour].tasks++;
        hourlyData[hour].totalDuration += task.actualDuration || task.estimatedDuration || 60;
      }
    });
    
    return hourlyData;
  }

  findPeakProductivityHours(hourlyProductivity) {
    const hours = Object.entries(hourlyProductivity)
      .map(([hour, data]) => ({
        hour: parseInt(hour),
        tasks: data.tasks,
        avgDuration: data.tasks > 0 ? data.totalDuration / data.tasks : 0
      }))
      .filter(h => h.tasks > 0)
      .sort((a, b) => b.tasks - a.tasks);
    
    return hours.slice(0, 3);
  }

  analyzeWorkLifeBalance(tasks, calendarEvents, timeframe) {
    const workTasks = tasks.filter(task => task.category === 'work');
    const personalTasks = tasks.filter(task => task.category === 'personal');
    
    const workEvents = calendarEvents.filter(event => 
      event.type === 'meeting' || event.category === 'work'
    );
    
    const personalEvents = calendarEvents.filter(event => 
      event.category === 'personal' || event.type === 'personal'
    );
    
    return {
      workTaskRatio: tasks.length > 0 ? (workTasks.length / tasks.length * 100).toFixed(1) : 0,
      personalTaskRatio: tasks.length > 0 ? (personalTasks.length / tasks.length * 100).toFixed(1) : 0,
      workEventRatio: calendarEvents.length > 0 ? (workEvents.length / calendarEvents.length * 100).toFixed(1) : 0,
      personalEventRatio: calendarEvents.length > 0 ? (personalEvents.length / calendarEvents.length * 100).toFixed(1) : 0,
      balanceScore: this.calculateBalanceScore(workTasks, personalTasks, workEvents, personalEvents)
    };
  }

  calculateBalanceScore(workTasks, personalTasks, workEvents, personalEvents) {
    const totalWork = workTasks.length + workEvents.length;
    const totalPersonal = personalTasks.length + personalEvents.length;
    const total = totalWork + totalPersonal;
    
    if (total === 0) return 50; // Neutral score
    
    const workRatio = totalWork / total;
    const idealRatio = 0.7; // 70% work, 30% personal is considered balanced
    
    const deviation = Math.abs(workRatio - idealRatio);
    const score = Math.max(0, 100 - (deviation * 200));
    
    return Math.round(score);
  }

  calculateTimeUtilization(meetingTime, taskTimeByCategory) {
    const totalTaskTime = Object.values(taskTimeByCategory).reduce((sum, time) => sum + time, 0);
    const totalTime = meetingTime + totalTaskTime;
    
    // Assume 8-hour workday
    const availableTime = 8 * 60; // 480 minutes
    
    return {
      utilization: totalTime > 0 ? Math.min(100, (totalTime / availableTime * 100)).toFixed(1) : 0,
      meetingPercentage: totalTime > 0 ? (meetingTime / totalTime * 100).toFixed(1) : 0,
      taskPercentage: totalTime > 0 ? (totalTaskTime / totalTime * 100).toFixed(1) : 0
    };
  }

  // Additional helper methods would continue here...
  // For brevity, I'll include key methods and indicate where others would go

  loadAnalyticsData() {
    try {
      return JSON.parse(localStorage.getItem('analyticsData') || '{}');
    } catch {
      return {};
    }
  }

  saveAnalyticsData(data) {
    localStorage.setItem('analyticsData', JSON.stringify(data));
  }

  // ... (additional helper methods for trends, patterns, etc.)
}

// Create singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;