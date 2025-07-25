// Utility functions for filter state management

/**
 * Helper to check if a multiselect filter has active selections
 */
export const hasMultiSelectValues = (values: string[] | undefined): boolean => {
  return (values?.length ?? 0) > 0;
};

/**
 * Helper to check if a single-select filter has an active selection
 */
export const hasSingleSelectValue = (value: string | null | undefined): boolean => {
  return value != null;
};

/**
 * Helper to clear multiselect filter values
 */
export const clearMultiSelectFilter = (): string[] => {
  return [];
};

/**
 * Helper to clear single-select filter value
 */
export const clearSingleSelectFilter = (): null => {
  return null;
};

/**
 * Helper to toggle a value in a multiselect array
 */
export const toggleMultiSelectValue = (currentValues: string[], valueToToggle: string): string[] => {
  if (currentValues.includes(valueToToggle)) {
    return currentValues.filter(v => v !== valueToToggle);
  } else {
    return [...currentValues, valueToToggle];
  }
};

/**
 * Helper to check if any value in an array matches the multiselect filter
 */
export const matchesMultiSelectFilter = <T>(
  items: T[], 
  filterValues: string[], 
  getValue: (item: T) => string
): T[] => {
  if (filterValues.length === 0) return items;
  return items.filter(item => filterValues.includes(getValue(item)));
};

/**
 * Helper to check if a value matches the single-select filter
 */
export const matchesSingleSelectFilter = <T>(
  items: T[], 
  filterValue: string | null, 
  getValue: (item: T) => string
): T[] => {
  if (filterValue == null) return items;
  return items.filter(item => getValue(item) === filterValue);
};

/**
 * Generate dynamic filter options that only show available values
 * from the current filtered dataset
 */
export const generateDynamicOptions = <T>(
  items: T[],
  getValue: (item: T) => string,
  getLabel?: (value: string) => string
): Array<{ value: string; label: string }> => {
  const uniqueValues = [...new Set(items.map(getValue))];
  return uniqueValues
    .sort()
    .map(value => ({
      value,
      label: getLabel ? getLabel(value) : value
    }));
};

/**
 * Generate dynamic filter options with counts for better UX
 */
export const generateDynamicOptionsWithCounts = <T>(
  items: T[],
  getValue: (item: T) => string,
  getLabel?: (value: string) => string
): Array<{ value: string; label: string; count: number }> => {
  const valueCounts = items.reduce((acc, item) => {
    const value = getValue(item);
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(valueCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([value, count]) => ({
      value,
      label: getLabel ? getLabel(value) : value,
      count
    }));
}; 