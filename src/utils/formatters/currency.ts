import type { PricePoint } from '../types';

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