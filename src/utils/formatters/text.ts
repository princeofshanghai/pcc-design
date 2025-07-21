const ACRONYMS = new Set([
  'ID', 'URL', 'LOB', 'SKU', 'CTA', 'NAMER', 'EMEA', 'APAC', 'LATAM', 'LIX', 'API', 'EI',
  // Common currency codes
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 'SEK', 'KRW', 'SGD', 'INR', 'MXN', 'BRL', 'ZAR'
]);

// Words that should always be capitalized (proper nouns, important words)
const PROPER_NOUNS = new Set([
  // LinkedIn product/brand names
  'LinkedIn', 'Premium', 'Sales', 'Solutions', 'Marketing', 'Talent', 'Learning', 
  'Core', 'Products', 'Multiseat', 'Company', 'Page', 'Small', 'Business', 
  'Entitlements', 'Career', 'LSS', 'LMS',
  // Common business terms that should be capitalized
  'Desktop', 'Mobile', 'iOS', 'Android', 'Web', 'Enterprise', 'Professional',
  'Basic', 'Standard', 'Advanced', 'Ultimate', 'Starter', 'Growth', 'Scale',
  // Status and attribute terms
  'Active', 'Inactive', 'Draft', 'Pending', 'Approved', 'Rejected', 'Expired',
  'Monthly', 'Annual', 'Weekly', 'Daily', 'Quarterly',
  // Geographic regions
  'North', 'South', 'East', 'West', 'America', 'Europe', 'Asia', 'Pacific'
]);

// Small words that should typically be lowercase (unless first word)
const SMALL_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'is', 'it',
  'of', 'on', 'or', 'the', 'to', 'up', 'via', 'with', 'from', 'into', 'onto',
  'per', 'than', 'over', 'upon', 'down', 'off', 'out', 'near', 'like',
  // Action words that should be lowercase unless first
  'all', 'clear', 'show', 'view', 'sort', 'group', 'filter', 'search',
  'default', 'reset', 'none', 'option', 'settings', 'preferences',
  'columns', 'rows', 'items', 'data', 'content', 'details'
]);

/**
 * Converts a string to proper case while preserving important words and acronyms.
 * Handles special cases like:
 * - Preserving acronyms (e.g., "SKU" remains "SKU")
 * - Handling plural acronyms (e.g., "SKUs")
 * - Preserving proper nouns (e.g., "Premium Core Products")
 * - Keeping small words lowercase except when first (e.g., "Sales and Marketing")
 * - Preserving parenthesized numbers (e.g., "(123)")
 * 
 * @param str - The string to convert to proper case
 * @returns The formatted string with preserved special cases
 */
export function toSentenceCase(str: string): string {
  if (!str) return '';

  const words = str.split(' ');
  
  const finalSentence = words
    .map((word, index) => {
      // Preserve anything in parentheses
      if (word.startsWith('(') && word.endsWith(')')) {
        return word;
      }
      
      const upperWord = word.toUpperCase();
      const lowerWord = word.toLowerCase();
      
      // Handle plural acronyms (e.g., SKUs)
      if (upperWord.endsWith('S') && ACRONYMS.has(upperWord.slice(0, -1))) {
        return upperWord.slice(0, -1) + 's';
      }

      // Handle acronyms
      if (ACRONYMS.has(upperWord)) {
        return word.toUpperCase();
      }

      // Handle proper nouns (always capitalize)
      if (PROPER_NOUNS.has(upperWord)) {
        return upperWord;
      }

      // Handle small words (lowercase unless first word)
      if (SMALL_WORDS.has(lowerWord) && index !== 0) {
        // Special case: "All" should be capitalized in product names like "All LSS Products"
        if (lowerWord === 'all' && index < words.length - 1) {
          const nextWord = words[index + 1]?.toUpperCase();
          if (nextWord && (ACRONYMS.has(nextWord) || nextWord === 'PRODUCTS')) {
            return 'All';
          }
        }
        return lowerWord;
      }

      // Default: capitalize first letter, lowercase the rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

  return finalSentence;
} 