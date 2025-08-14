const ACRONYMS = new Set([
  'ID', 'URL', 'LOB', 'SKU', 'CTA', 'NAMER', 'EMEA', 'APAC', 'LATAM', 'LIX', 'API', 'EI', 'NPI',
  // Official LOB acronyms
  'LMS', 'LSS', 'LTS',
  // Common currency codes
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 'SEK', 'KRW', 'SGD', 'INR', 'MXN', 'BRL', 'ZAR'
]);

// Words that should always be capitalized (proper nouns, important words)
const PROPER_NOUNS = new Set([
  // LinkedIn product/brand names
  'LinkedIn', 'Premium', 'Sales', 'Solutions', 'Marketing', 'Talent', 'Learning', 
  'Core', 'Multiseat', 'Company', 'Page', 'Small', 'Business', 
  'Entitlements', 'Career', 'Picasso', 'Navigator', 'Campaign', 'Manager',
  'Recruiter', 'Lite', 'Hub', 'Pro', 'Plus', 'Bundle', 'Advanced',
  // LinkedIn-specific product terms
  'InMail', 'Analytics', 'Insights', 'Search', 'Builder', 'Integration',
  'Team', 'Link', 'Content', 'Sponsored', 'Access', 'Library', 'Support',
  'Feature', 'Credits', 'Messages', 'Tools', 'Choice', 'Job', 'Jobs',
  'Applicant', 'Profile', 'Browsing', 'Private', 'Direct', 'Messaging',
  'Unlimited', 'Priority', 'Certificates', 'Assessments', 'Skill', 'Courses',
  'Collaboration', 'Management', 'Bulk', 'Dashboard', 'Admin', 'Controls',
  'Glint',
  // Platform/technology names
  'Desktop', 'Mobile', 'iOS', 'Android', 'Web', 'Enterprise', 'Professional',
  'Basic', 'Standard', 'Advanced', 'Ultimate', 'Starter', 'Growth', 'Scale',
  'Field', 'GPB',
  // Status and attribute terms that should be capitalized
  'Active', 'Inactive', 'Draft', 'Pending', 'Approved', 'Rejected', 'Expired',
  'Live', 'Failed', 'Review',
  'Monthly', 'Annual', 'Weekly', 'Daily', 'Quarterly', 'Biannual',
  // Geographic regions
  'North', 'South', 'East', 'West', 'America', 'Europe', 'Asia', 'Pacific'
]);

// Small words that should be lowercase in title case (except when first word)
const TITLE_CASE_SMALL_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'is', 'it',
  'of', 'on', 'or', 'the', 'to', 'up', 'via', 'with', 'from', 'into', 'onto',
  'per', 'than', 'over', 'upon', 'down', 'off', 'out', 'near', 'like', 'this',
  // Special exceptions for LinkedIn folder names
  'products', 'other'
]);

/**
 * Converts a string to true sentence case while preserving important words and acronyms.
 * 
 * TRUE SENTENCE CASE RULES:
 * - First word is always capitalized
 * - All other words are lowercase by default
 * - Exceptions: Acronyms and proper nouns are always capitalized regardless of position
 * 
 * Examples:
 * - "sales and marketing solutions" → "Sales and marketing solutions"
 * - "SKU overrides in USD" → "SKU overrides in USD" 
 * - "premium core products" → "Premium core products"
 * - "all LTS products" → "All LTS products"
 * 
 * @param str - The string to convert to sentence case
 * @returns The formatted string with proper sentence casing
 */
export function toSentenceCase(str: string): string {
  if (!str) return '';

  const words = str.split(' ');
  
  return words
    .map((word, index) => {
      // Preserve anything in parentheses as-is
      if (word.startsWith('(') && word.endsWith(')')) {
        return word;
      }
      
      // Extract the core word without punctuation for acronym/proper noun checking
      const coreWord = word.replace(/[^a-zA-Z]/g, '').toUpperCase();
      
      // Handle plural acronyms (e.g., SKUs)
      if (coreWord.endsWith('S') && ACRONYMS.has(coreWord.slice(0, -1))) {
        // Preserve original punctuation but use acronym casing
        const acronymPart = coreWord.slice(0, -1) + 's';
        return word.replace(/[a-zA-Z]+/, acronymPart);
      }

      // Handle acronyms - always uppercase
      if (ACRONYMS.has(coreWord)) {
        // Preserve original punctuation but use acronym casing
        return word.replace(/[a-zA-Z]+/, coreWord);
      }

      // Handle proper nouns - preserve exact casing from the set
      if (PROPER_NOUNS.has(coreWord)) {
        // Find the exact proper noun from our set to preserve correct casing
        for (const properNoun of PROPER_NOUNS) {
          if (properNoun.toUpperCase() === coreWord) {
            return word.replace(/[a-zA-Z]+/, properNoun);
          }
        }
        // Fallback to capitalize first letter
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }

      // First word: always capitalize first letter, rest lowercase
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }

      // All other words: lowercase by default
      return word.toLowerCase();
    })
    .join(' ');
}

/**
 * Converts a string to Title Case for LinkedIn product names and folder names.
 * 
 * TITLE CASE RULES FOR PRODUCT/FOLDER NAMES:
 * - Most words are capitalized 
 * - Small words (like "and", "of", "the") are lowercase unless they're the first word
 * - Acronyms and proper nouns preserve their special casing
 * - Special LinkedIn exceptions: "products" and "other" stay lowercase (except when first)
 * 
 * Examples:
 * - "premium core products" → "Premium Core Products"
 * - "all LTS products" → "All LTS Products"  
 * - "sales navigator advanced" → "Sales Navigator Advanced"
 * - "all other products" → "All Other Products"
 * 
 * @param str - The string to convert to title case
 * @returns The formatted string with proper title casing for product/folder names
 */
export function toTitleCase(str: string): string {
  if (!str) return '';

  const words = str.split(' ');
  
  return words
    .map((word, index) => {
      // Preserve anything in parentheses as-is
      if (word.startsWith('(') && word.endsWith(')')) {
        return word;
      }
      
      const upperWord = word.toUpperCase();
      const lowerWord = word.toLowerCase();
      
      // Handle plural acronyms (e.g., SKUs)
      if (upperWord.endsWith('S') && ACRONYMS.has(upperWord.slice(0, -1))) {
        return upperWord.slice(0, -1) + 's';
      }

      // Handle acronyms - always uppercase
      if (ACRONYMS.has(upperWord)) {
        return upperWord;
      }

      // Handle proper nouns - preserve exact casing from the set
      if (PROPER_NOUNS.has(upperWord)) {
        // Find the exact proper noun from our set to preserve correct casing
        for (const properNoun of PROPER_NOUNS) {
          if (properNoun.toUpperCase() === upperWord) {
            return properNoun;
          }
        }
        // Fallback to capitalize first letter
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }

      // Handle small words (lowercase unless first word)
      if (TITLE_CASE_SMALL_WORDS.has(lowerWord) && index !== 0) {
        return lowerWord;
      }

      // Default: capitalize first letter, lowercase the rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
} 