import type { PricePoint } from './types';

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