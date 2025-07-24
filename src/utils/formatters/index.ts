import { toSentenceCase, toTitleCase } from './text';
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