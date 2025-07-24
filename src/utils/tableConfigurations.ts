import type { ColumnConfig } from './types';

// Price Group Table Configuration
export const PRICE_GROUP_COLUMNS: ColumnConfig[] = [
  { key: 'name', label: 'Name', required: true },
  { key: 'channel', label: 'Channel', required: false },
  { key: 'billingCycle', label: 'Billing cycle', required: false },
  { key: 'usdPrice', label: 'USD price', required: false },
  { key: 'currencies', label: 'Price points', required: false },
  { key: 'sku', label: 'SKU', required: false },
  { key: 'effectiveDate', label: 'Effective date', required: false },
];

// Generate sort options from column configurations
export const generateSortOptionsFromColumns = (columns: ColumnConfig[]): string[] => {
  const sortOptions = ['None'];
  
  columns.forEach(column => {
    const label = column.label || column.key;
    
    // Add directional sorting based on column type
    if (column.key === 'name') {
      // Text fields - alphabetical sorting
      sortOptions.push(`${label} (A-Z)`);
      sortOptions.push(`${label} (Z-A)`);
    } else if (column.key === 'currencies' || column.key === 'sku') {
      // Count fields - numerical sorting
      sortOptions.push(`${label} (Low to high)`);
      sortOptions.push(`${label} (High to low)`);
    } else if (column.key === 'effectiveDate') {
      // Date fields - chronological sorting
      sortOptions.push(`${label} (Earliest to latest)`);
      sortOptions.push(`${label} (Latest to earliest)`);
    } else if (column.key === 'channel' || column.key === 'billingCycle') {
      // Categorical fields - alphabetical sorting (but different labels)
      sortOptions.push(`${label} (A-Z)`);
      sortOptions.push(`${label} (Z-A)`);
    } else if (column.key === 'usdPrice') {
      // Price fields - monetary sorting
      sortOptions.push(`${label} (Low to high)`);
      sortOptions.push(`${label} (High to low)`);
    }
  });
  
  return sortOptions;
};

// Generate group by options from column configurations
export const generateGroupByOptionsFromColumns = (columns: ColumnConfig[]): string[] => {
  const groupByOptions = ['None'];
  
  columns.forEach(column => {
    // Only certain columns make sense for grouping
    if (['channel', 'billingCycle'].includes(column.key)) {
      groupByOptions.push(column.label || column.key);
    }
  });
  
  return groupByOptions;
};

// Default column visibility for price groups
export const DEFAULT_PRICE_GROUP_COLUMN_VISIBILITY = PRICE_GROUP_COLUMNS.reduce((acc, col) => {
  acc[col.key] = true;
  return acc;
}, {} as Record<string, boolean>);

// Default column order for price groups
export const DEFAULT_PRICE_GROUP_COLUMN_ORDER = PRICE_GROUP_COLUMNS.map(col => col.key);

// Generated configurations
export const PRICE_GROUP_SORT_OPTIONS = generateSortOptionsFromColumns(PRICE_GROUP_COLUMNS);
export const PRICE_GROUP_GROUP_BY_OPTIONS = generateGroupByOptionsFromColumns(PRICE_GROUP_COLUMNS);

// SKU Table Configuration
export const SKU_COLUMNS: ColumnConfig[] = [
  { key: 'name', label: 'Name', required: true },
  { key: 'effectiveDate', label: 'Effective date', required: false },
  { key: 'priceGroup', label: 'Price group', required: false },
  { key: 'lix', label: 'LIX', required: false },
  { key: 'status', label: 'Status', required: false },
];

// Price Point Table Configuration
export const PRICE_POINT_COLUMNS: ColumnConfig[] = [
  { key: 'id', label: 'ID', required: false },
  { key: 'currency', label: 'Currency', required: true },
  { key: 'currencyType', label: 'Currency type', required: false },
  { key: 'amount', label: 'Amount', required: true },
  { key: 'pricingRule', label: 'Pricing rule', required: false },
  { key: 'quantityRange', label: 'Quantity range', required: false },
  { key: 'usdEquivalent', label: 'USD equivalent', required: false },
  { key: 'effectiveDate', label: 'Effective date', required: false },
];

// Generate sort options for specific table types
export const generatePricePointSortOptions = (columns: ColumnConfig[]): string[] => {
  const sortOptions = ['None'];
  
  columns.forEach(column => {
    const label = column.label || column.key;
    
    // Add specific sorting for price point columns
    if (column.key === 'currency') {
      sortOptions.push(`${label} (A-Z)`);
      sortOptions.push(`${label} (Z-A)`);
    } else if (column.key === 'amount') {
      sortOptions.push(`${label} (Low to high)`);
      sortOptions.push(`${label} (High to low)`);
    } else if (column.key === 'usdEquivalent') {
      sortOptions.push(`${label} (High to low)`);
      sortOptions.push(`${label} (Low to high)`);
    } else if (column.key === 'effectiveDate') {
      sortOptions.push(`${label} (Earliest to latest)`);
      sortOptions.push(`${label} (Latest to earliest)`);
    }
  });
  
  // Add custom sort options specific to price points
  sortOptions.push('Currency type'); // Core vs Long tail
  
  return sortOptions;
};

// Default configurations for SKU table
export const DEFAULT_SKU_COLUMN_VISIBILITY = SKU_COLUMNS.reduce((acc, col) => {
  acc[col.key] = true;
  return acc;
}, {} as Record<string, boolean>);

export const DEFAULT_SKU_COLUMN_ORDER = SKU_COLUMNS.map(col => col.key);

// Default configurations for Price Point table
export const DEFAULT_PRICE_POINT_COLUMN_VISIBILITY = PRICE_POINT_COLUMNS.reduce((acc, col) => {
  // Set specific defaults for price point visibility
  if (col.key === 'id') acc[col.key] = false; // ID hidden by default
  else if (col.key === 'currencyType') acc[col.key] = false; // Currency type hidden by default
  else acc[col.key] = true; // Others visible by default
  return acc;
}, {} as Record<string, boolean>);

export const DEFAULT_PRICE_POINT_COLUMN_ORDER = PRICE_POINT_COLUMNS.map(col => col.key);

// Generated sort options for each table
export const SKU_SORT_OPTIONS = ['None', 'Effective Date']; // SKUs have simpler sorting
export const PRICE_POINT_SORT_OPTIONS = generatePricePointSortOptions(PRICE_POINT_COLUMNS); 