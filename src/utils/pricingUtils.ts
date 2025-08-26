import type { PricePoint } from './types';

/**
 * Simple price point processing that trusts the status field from your data.
 * No complex calculations - just applies defaults for missing status fields.
 * 
 * Business Logic:
 * - Trust the existing status field in your data (converted from A/E to Active/Expired)
 * - Only apply default status if completely missing
 * - No auto-calculation of validTo dates
 * - No grouping or date-based overrides
 */
export function calculatePricePointStatuses(pricePoints: PricePoint[]): PricePoint[] {
  if (!pricePoints || pricePoints.length === 0) {
    return pricePoints;
  }

  // Simple approach: trust the data, only apply defaults if missing
  return pricePoints.map(point => ({
    ...point,
    // Keep original status from data, default to 'Active' only if completely missing
    status: point.status || 'Active'
    // Don't auto-calculate validTo - keep whatever is in the data or undefined
  }));
}

/**
 * Main function to process price points - now simplified to just trust your data
 */
export function processPricePointStatuses(pricePoints: PricePoint[]): PricePoint[] {
  return calculatePricePointStatuses(pricePoints);
}