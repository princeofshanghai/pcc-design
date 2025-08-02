import type { ColumnConfig } from './types';

export const PRICE_GROUP_COLUMNS: ColumnConfig[] = [
  { key: 'id', label: 'Price ID', required: true },
  { key: 'name', label: 'Name', required: false },
  { key: 'channel', label: 'Channel', required: false },
  { key: 'billingCycle', label: 'Billing cycle', required: false },
  { key: 'usdPrice', label: 'USD price', required: false },
  { key: 'currencies', label: 'Price points', required: false },
  { key: 'lix', label: 'LIX', required: false },
  { key: 'validity', label: 'Validity', required: false },
];

export const DEFAULT_PRICE_GROUP_COLUMNS = ['id', 'name', 'channel', 'billingCycle', 'usdPrice', 'currencies', 'lix', 'validity'];

export const PRICE_POINT_COLUMNS: ColumnConfig[] = [
  { key: 'id', label: 'Price point ID', required: true },
  { key: 'currency', label: 'Currency', required: true },
  { key: 'currencyType', label: 'Category', required: false },
  { key: 'amount', label: 'Amount', required: false },
  { key: 'pricingRule', label: 'Pricing rule', required: false },
  { key: 'quantityRange', label: 'Quantity range', required: false },
  { key: 'priceType', label: 'Price type', required: false },
  { key: 'usdEquivalent', label: 'USD equivalent', required: false },
  { key: 'validity', label: 'Validity', required: false },
];

export const DEFAULT_PRICE_POINT_COLUMNS = ['id', 'currency', 'currencyType', 'amount', 'pricingRule', 'quantityRange', 'usdEquivalent', 'validity'];

// Sort options for price groups
export const PRICE_GROUP_SORT_OPTIONS = [
  'None',
  'ID (A-Z)',
  'ID (Z-A)',
  'Name (A-Z)',
  'Name (Z-A)',
  'Channel (A-Z)',
  'Channel (Z-A)',
  'Billing Cycle (A-Z)',
  'Billing Cycle (Z-A)',
  'USD Price (Low to High)',
  'USD Price (High to Low)',
  'LIX Key (A-Z)',
  'LIX Key (Z-A)',
  'Validity (Earliest to Latest)',
  'Validity (Latest to Earliest)',
];

// Group by options for price groups
export const PRICE_GROUP_GROUP_BY_OPTIONS = [
  'None',
  'Channel',
  'Billing Cycle',
  'LIX Key',
  'Validity',
];

// Sort options for price points
export const PRICE_POINT_SORT_OPTIONS = [
  'None',
  'Currency (A-Z)',
  'Currency (Z-A)', 
  'Amount (Low to high)',
  'Amount (High to low)',
  'USD equivalent (High to low)',
  'USD equivalent (Low to high)',
  'Category',
  'Price type (A-Z)',
  'Price type (Z-A)',
  'Validity (Earliest to latest)',
  'Validity (Latest to earliest)',
];

export const SKU_COLUMNS: ColumnConfig[] = [
  { key: 'id', label: 'SKU ID', required: true },
  { key: 'channel', label: 'Channel', required: false },
  { key: 'billingCycle', label: 'Billing cycle', required: false },
  { key: 'priceGroup', label: 'Price group', required: false },
  { key: 'lix', label: 'LIX', required: false },
  { key: 'validity', label: 'Validity', required: false },
  { key: 'status', label: 'Status', required: false },
];

export const DEFAULT_SKU_COLUMNS = ['id', 'channel', 'billingCycle', 'priceGroup', 'lix', 'validity', 'status'];

export const SKU_SORT_OPTIONS = [
  'None', 
  'Validity', 
  'Channel (A-Z)', 
  'Channel (Z-A)', 
  'Billing Cycle (A-Z)', 
  'Billing Cycle (Z-A)'
];

// Group by options for SKUs
export const SKU_GROUP_BY_OPTIONS = [
  'None',
  'Status', 
  'Channel',
  'Billing Cycle',
  'LIX Key'
];

export const PRODUCT_COLUMNS: ColumnConfig[] = [
  { key: 'id', label: 'Product ID', required: true },
  { key: 'name', label: 'Name', required: true },
  { key: 'folder', label: 'Folder', required: false },
  { key: 'channel', label: 'Channel', required: false },
  { key: 'skus', label: 'SKUs', required: false },
  { key: 'status', label: 'Status', required: false },
];

export const DEFAULT_PRODUCT_COLUMNS = ['id', 'name', 'folder', 'channel', 'skus', 'status'];

// Helper to get column label, using fallback if not found
export const getColumnLabel = (columnKey: string): string => {
  const allColumns = [
    ...PRICE_GROUP_COLUMNS,
    ...PRICE_POINT_COLUMNS,
    ...SKU_COLUMNS,
    ...PRODUCT_COLUMNS,
  ];
  
  const column = allColumns.find(col => col.key === columnKey);
  if (column) {
    return column.label || columnKey;
  }
  
  // Fallback logic for dynamic columns
  if (columnKey === 'validity') {
    return 'Validity';
  }
  
  return columnKey;
}; 