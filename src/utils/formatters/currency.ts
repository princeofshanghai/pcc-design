import type { PricePoint } from '../types';

/**
 * Core currencies used across LinkedIn products.
 * These are the primary currencies that get prominent display.
 */
export const CORE_CURRENCIES = [
  'USD', 'EUR', 'CAD', 'AUD', 'CHF', 'DKK', 'NOK', 'SEK', 
  'GBP', 'HKD', 'SGD', 'BRL', 'NZD', 'JPY', 'INR', 'ZAR', 
  'AED', 'PLN', 'SAR', 'MXN', 'EGP', 'TRY'
] as const;

/**
 * Long tail currencies with lower usage.
 * These are shown in a separate, condensed section.
 */
export const LONG_TAIL_CURRENCIES = [
  'ARS', 'BDT', 'BGN', 'CLP', 'COP', 'CRC', 'CZK', 'GTQ', 
  'HNL', 'HUF', 'IDR', 'ILS', 'JOD', 'KES', 'KRW', 'KWD', 
  'LBP', 'LKR', 'MAD', 'MYR', 'NGN', 'PEN', 'PHP', 'PKR', 
  'QAR', 'RON', 'RSD', 'THB', 'TWD', 'TZS', 'UAH', 'UYU', 
  'VND', 'XOF'
] as const;

/**
 * A list of currencies that should not have decimal places in their display.
 * Based on business context and ISO 4217 currency standards.
 * 
 * These currencies do not use decimal places in their standard representation:
 * BIF - Burundian Franc
 * CLP - Chilean Peso
 * DJF - Djiboutian Franc
 * GNF - Guinean Franc
 * JPY - Japanese Yen
 * KMF - Comorian Franc
 * KRW - South Korean Won
 * MGA - Malagasy Ariary
 * PYG - Paraguayan Guaraní
 * RWF - Rwandan Franc
 * UGX - Ugandan Shilling
 * VND - Vietnamese Dong
 * VUV - Vanuatu Vatu
 * XAF - CFA Franc BEAC
 * XOF - CFA Franc BCEAO
 * XPF - CFP Franc
 */
const zeroDecimalCurrencies = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
  'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
]);

/**
 * Check if a currency is in the core currencies list.
 * @param currencyCode - The currency code to check
 * @returns True if the currency is a core currency
 */
export const isCoreCurrency = (currencyCode: string): boolean => {
  return CORE_CURRENCIES.includes(currencyCode as any);
};

/**
 * Check if a currency is in the long tail currencies list.
 * @param currencyCode - The currency code to check
 * @returns True if the currency is a long tail currency
 */
export const isLongTailCurrency = (currencyCode: string): boolean => {
  return LONG_TAIL_CURRENCIES.includes(currencyCode as any);
};

/**
 * Categorize an array of price points into core and long tail currencies.
 * @param pricePoints - Array of price points to categorize
 * @returns Object with core and longTail arrays
 */
export const categorizePricePoints = (pricePoints: PricePoint[]) => {
  const core: PricePoint[] = [];
  const longTail: PricePoint[] = [];
  
  pricePoints.forEach(pricePoint => {
    if (isCoreCurrency(pricePoint.currencyCode)) {
      core.push(pricePoint);
    } else {
      longTail.push(pricePoint);
    }
  });
  
  return { core, longTail };
};

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