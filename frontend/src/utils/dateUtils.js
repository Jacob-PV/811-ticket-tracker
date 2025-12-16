/**
 * Date utility functions using date-fns
 */

import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';

/**
 * Format a date string for display
 */
export function formatDate(dateString, formatString = 'MMM dd, yyyy') {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, formatString);
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(dateString) {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Get days until/since a date (negative if past)
 */
export function getDaysUntil(dateString) {
  if (!dateString) return null;
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return differenceInDays(date, new Date());
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(dateString) {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'yyyy-MM-dd');
}
