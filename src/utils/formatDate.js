// Date formatting utilities using date-fns
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

// Format date for display
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

// Format date and time
export const formatDateTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy h:mm a');
};

// Format time only
export const formatTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
};

// Relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

// Smart date format - shows relative for recent, absolute for older
export const formatSmartDate = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return `Today at ${formatTime(dateObj)}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday at ${formatTime(dateObj)}`;
  }
  
  // For dates within a week, show relative time
  const daysDiff = Math.floor((new Date() - dateObj) / (1000 * 60 * 60 * 24));
  if (daysDiff < 7) {
    return formatRelativeTime(dateObj);
  }
  
  // For older dates, show absolute date
  return formatDateTime(dateObj);
};

export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatSmartDate
};
