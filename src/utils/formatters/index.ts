import { toSentenceCase } from './text';
import type { ColumnsType } from 'antd/es/table';

/**
 * Automatically applies sentence casing to all table column titles for consistency.
 * This ensures all tables across the app have consistent title formatting.
 * 
 * @param columns - Array of table column definitions
 * @returns The same columns with sentence-cased titles
 */
export function formatColumnTitles<T = any>(columns: ColumnsType<T>): ColumnsType<T> {
  return columns.map(column => {
    if (!column) return column;
    
    // Apply sentence casing to the title if it exists
    const formattedColumn = { ...column };
    if (typeof column.title === 'string') {
      formattedColumn.title = toSentenceCase(column.title);
    }
    
    return formattedColumn;
  }) as ColumnsType<T>;
}

// Re-export everything from existing files
export * from './currency';
export * from './dates';
export * from './text';

// Format customer numbers with M/K suffixes
export const formatCustomerNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toString();
};

// Generate a fake percentage change for demo purposes
export const generateFakePercentageChange = (isActive: boolean): { value: number; isPositive: boolean } => {
  // For inactive products, always show negative change
  if (!isActive) {
    const change = -(Math.random() * 6 + 2); // -2% to -8%
    return { value: Math.abs(change), isPositive: false };
  }
  
  // For active products, show small positive or negative change
  const change = (Math.random() * 6 + 2) * (Math.random() > 0.5 ? 1 : -1); // ±2% to ±8%
  return { value: Math.abs(change), isPositive: change > 0 };
}; 