const ACRONYMS = new Set([
  'ID', 'URL', 'LOB', 'SKU', 'CTA', 'NAMER', 'EMEA', 'APAC', 'LATAM', 'LIX', 'API', 'EI',
  // Common currency codes
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 'SEK', 'KRW', 'SGD', 'INR', 'MXN', 'BRL', 'ZAR'
]);

/**
 * Converts a string to sentence case while preserving specified acronyms.
 * Handles special cases like:
 * - Preserving acronyms (e.g., "SKU" remains "SKU")
 * - Handling plural acronyms (e.g., "SKUs")
 * - Preserving parenthesized numbers (e.g., "(123)")
 * 
 * @param str - The string to convert to sentence case
 * @returns The formatted string in sentence case with preserved special cases
 */
export function toSentenceCase(str: string): string {
  if (!str) return '';

  const finalSentence = str
    .split(' ')
    .map(word => {
      // Preserve anything in parentheses
      if (word.startsWith('(') && word.endsWith(')')) {
        return word;
      }
      
      const upperWord = word.toUpperCase();
      // Handle plural acronyms (e.g., SKUs)
      if (upperWord.endsWith('S') && ACRONYMS.has(upperWord.slice(0, -1))) {
        return upperWord.slice(0, -1) + 's';
      }

      // Handle acronyms
      if (ACRONYMS.has(upperWord)) {
        return word.toUpperCase();
      }
      // Lowercase everything else
      return word.toLowerCase();
    })
    .join(' ');

  // Capitalize the first letter of the whole sentence
  return finalSentence.charAt(0).toUpperCase() + finalSentence.slice(1);
} 