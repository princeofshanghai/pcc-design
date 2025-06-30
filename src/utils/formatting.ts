import type { PricePoint } from './types';
import { format, parseISO } from 'date-fns';

/**
 * A list of currencies that should not have decimal places in their display.
 * Based on business context.
 */
const zeroDecimalCurrencies = new Set(['JPY', 'KRW', 'CLP', 'VND']);

/**
 * Formats a PricePoint object into a consistent string based on business rules.
 * e.g., { currencyCode: 'USD', amount: 49.99 } => "USD 49.99"
 * e.g., { currencyCode: 'JPY', amount: 5000 } => "JPY 5000"
 * @param pricePoint - The price point object to format.
 * @returns A formatted currency string.
 */
export const formatCurrency = (pricePoint: PricePoint): string => {
  if (zeroDecimalCurrencies.has(pricePoint.currencyCode)) {
    // No decimals for specific currencies
    return `${pricePoint.currencyCode} ${Math.round(pricePoint.amount)}`;
  }
  // Default to 2 decimal places for all other currencies
  return `${pricePoint.currencyCode} ${pricePoint.amount.toFixed(2)}`;
};

const ACRONYMS = new Set(['ID', 'URL', 'LOB', 'SKU', 'CTA', 'NAMER', 'EMEA', 'APAC', 'LATAM']);

export function toSentenceCase(str: string): string {
  if (!str) return '';

  const finalSentence = str
    .split(' ')
    .map(word => {
      // Preserve parenthesized numbers entirely
      if (/^\(\d+\)$/.test(word)) {
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
