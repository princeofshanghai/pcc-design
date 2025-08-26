
/**
 * Formats a date range into a user-friendly string.
 * @param start - The valid from date string (e.g., "2024-01-01").
 * @param end - The valid to date string (e.g., "2024-12-31").
 * @returns A formatted date range string.
 */
export const formatValidityRange = (start?: string, end?: string): string => {
  // If no validFrom date, show as "Present" (always active)
  if (!start) return 'Present';

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC', // Assume dates are in UTC to prevent timezone shifts
  };

  // Helper function to ensure proper capitalization
  const formatDateWithProperCapitalization = (dateString: string): string => {
    const date = new Date(dateString);
    
    // Get individual date components
    const month = date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
    const day = date.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' });
    const year = date.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'UTC' });
    
    // Ensure month is properly capitalized and combine
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    return `${capitalizedMonth} ${day}, ${year}`;
  };

  const formattedStart = formatDateWithProperCapitalization(start);

  // If no validTo date, it's active from start date to present
  if (!end) {
    return `${formattedStart} - present`;
  }

  const formattedEnd = formatDateWithProperCapitalization(end);

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