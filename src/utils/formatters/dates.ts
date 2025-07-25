
/**
 * Formats a date range into a user-friendly string.
 * @param start - The valid from date string (e.g., "2024-01-01").
 * @param end - The valid to date string (e.g., "2024-12-31").
 * @returns A formatted date range string.
 */
export const formatValidityRange = (start?: string, end?: string): string => {
  if (!start) return 'N/A';

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC', // Assume dates are in UTC to prevent timezone shifts
  };

  const startDate = new Date(start);
  const formattedStart = startDate.toLocaleDateString('en-US', options);

  if (!end) {
    return `${formattedStart} - Present`;
  }

  const endDate = new Date(end);
  const formattedEnd = endDate.toLocaleDateString('en-US', options);

  return `${formattedStart} - ${formattedEnd}`;
};

export const formatFullDate = (dateString: string): string => {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
}; 