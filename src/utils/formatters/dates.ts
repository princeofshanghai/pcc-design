
/**
 * Formats a date range into a user-friendly string.
 * @param validFrom - The valid from date string (required, e.g., "2024-01-01").
 * @param validUntil - The valid until date string (optional, e.g., "2024-12-31").
 * @returns A formatted date range string.
 */
export const formatValidityRange = (validFrom: string, validUntil?: string): string => {
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

  const formattedStart = formatDateWithProperCapitalization(validFrom);

  // If no validUntil date, it's active from start date to present
  if (!validUntil) {
    return `${formattedStart} - present`;
  }

  const formattedEnd = formatDateWithProperCapitalization(validUntil);

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

export const formatShortDate = (dateString: string): string => {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const formatFullDateTimeUTC = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  };
  return date.toLocaleDateString('en-US', options);
}; 