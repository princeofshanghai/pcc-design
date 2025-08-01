import type { PricePoint } from './types';

/**
 * Calculates and applies Active/Expired status to price points based on validFrom dates
 * within each unique combination of currency and pricing rule.
 * 
 * Business Logic:
 * - Price points are grouped by (currencyCode, pricingRule)
 * - Within each group, the price point with the most recent validFrom date becomes 'Active'
 * - All other price points in that group become 'Expired'
 * - Also auto-calculates validTo dates for expired price points without them
 */
export function calculatePricePointStatuses(pricePoints: PricePoint[]): PricePoint[] {
  if (!pricePoints || pricePoints.length === 0) {
    return pricePoints;
  }

  // Group price points by currency + pricing rule combination
  const groups = new Map<string, PricePoint[]>();
  
  pricePoints.forEach(point => {
    const groupKey = `${point.currencyCode}-${point.pricingRule}`;
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(point);
  });

  // Process each group to determine active/expired status
  const updatedPricePoints: PricePoint[] = [];

  groups.forEach((groupPoints) => {
    // Sort by validFrom date (most recent first)
    const sortedPoints = [...groupPoints].sort((a, b) => {
      const dateA = new Date(a.validFrom).getTime();
      const dateB = new Date(b.validFrom).getTime();
      return dateB - dateA; // Descending order (newest first)
    });

    // The first (most recent) becomes active, others become expired
    sortedPoints.forEach((point, index) => {
      const updatedPoint = { ...point };
      
      if (index === 0) {
        // Most recent validFrom date = Active
        updatedPoint.status = 'Active';
      } else {
        // All others = Expired
        updatedPoint.status = 'Expired';
        
        // Auto-calculate validTo if not already set
        if (!updatedPoint.validTo) {
          const activePoint = sortedPoints[0];
          updatedPoint.validTo = calculateDayBefore(activePoint.validFrom);
        }
      }
      
      updatedPricePoints.push(updatedPoint);
    });
  });

  return updatedPricePoints;
}

/**
 * Calculates the date that is one day before the given date string.
 * Used to auto-set validTo dates for expired price points.
 */
export function calculateDayBefore(dateString: string): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  
  // Return in ISO format (YYYY-MM-DD) to match the validFrom format
  return date.toISOString().split('T')[0];
}

/**
 * Applies default status to price points that don't have one.
 * Existing price points default to 'Active' for backward compatibility.
 */
export function applyDefaultStatuses(pricePoints: PricePoint[]): PricePoint[] {
  return pricePoints.map(point => ({
    ...point,
    status: point.status || 'Active'
  }));
}

/**
 * Main function to process price points: applies defaults then calculates statuses
 */
export function processPricePointStatuses(pricePoints: PricePoint[]): PricePoint[] {
  const withDefaults = applyDefaultStatuses(pricePoints);
  return calculatePricePointStatuses(withDefaults);
}