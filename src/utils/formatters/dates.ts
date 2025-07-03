import { format, parseISO } from 'date-fns';

/**
 * Formats a date range into a user-friendly string.
 * @param startDate - The start date string (e.g., "2024-01-01").
 * @param endDate - The end date string (e.g., "2024-12-31").
 * @returns A formatted date range string.
 */
export const formatEffectiveDateRange = (startDate?: string, endDate?: string): string => {
  const dateFormat = 'MMM d, yyyy';

  if (startDate && endDate) {
    return `${format(parseISO(startDate), dateFormat)} - ${format(parseISO(endDate), dateFormat)}`;
  }
  if (startDate) {
    return `${format(parseISO(startDate), dateFormat)} - Present`;
  }
  if (endDate) {
    return `Until ${format(parseISO(endDate), dateFormat)}`;
  }
  return 'N/A';
}; 