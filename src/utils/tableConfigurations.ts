import type { ColumnConfig } from './types';

export const PRICE_GROUP_COLUMNS: ColumnConfig[] = [
  { key: 'name', label: 'Name', required: true },
  { key: 'channel', label: 'Channel', required: false },
  { key: 'billingCycle', label: 'Billing cycle', required: false },
  { key: 'usdPrice', label: 'USD price', required: false },
  { key: 'currencies', label: 'Currencies', required: false },
  { key: 'sku', label: 'SKU', required: false },
  { key: 'validity', label: 'Validity', required: false },
];

export const DEFAULT_PRICE_GROUP_COLUMNS = ['name', 'channel', 'billingCycle', 'usdPrice', 'currencies', 'sku', 'validity'];

export const PRICE_POINT_COLUMNS: ColumnConfig[] = [
  { key: 'id', label: 'ID', required: true },
  { key: 'currency', label: 'Currency', required: true },
  { key: 'currencyType', label: 'Category', required: false },
  { key: 'amount', label: 'Amount', required: false },
  { key: 'pricingRule', label: 'Pricing rule', required: false },
  { key: 'quantityRange', label: 'Quantity range', required: false },
  { key: 'usdEquivalent', label: 'USD equivalent', required: false },
  { key: 'validity', label: 'Validity', required: false },
];

export const DEFAULT_PRICE_POINT_COLUMNS = ['id', 'currency', 'amount', 'usdEquivalent', 'validity'];

// Sort options for price groups
export const PRICE_GROUP_SORT_OPTIONS = [
  'None',
  'Name (A-Z)',
  'Name (Z-A)',
  'USD Price (Low to High)',
  'USD Price (High to Low)',
  'Validity (Earliest to Latest)',
  'Validity (Latest to Earliest)',
];

// Sort options for price points
export const PRICE_POINT_SORT_OPTIONS = [
  'None',
  'Currency (A-Z)',
  'Currency (Z-A)',
  'Amount (Low to High)',
  'Amount (High to Low)',
  'Category',
  'Validity (Earliest to Latest)',
  'Validity (Latest to Earliest)',
];

export const SKU_COLUMNS: ColumnConfig[] = [
  { key: 'skuId', label: 'SKU ID', required: true },
  { key: 'name', label: 'Name', required: false },
  { key: 'salesChannel', label: 'Sales channel', required: false },
  { key: 'billingCycle', label: 'Billing cycle', required: false },
  { key: 'usdPrice', label: 'USD price', required: false },
  { key: 'priceGroup', label: 'Price group', required: false },
  { key: 'currencies', label: 'Currencies', required: false },
  { key: 'validity', label: 'Validity', required: false },
  { key: 'lix', label: 'LIX', required: false },
  { key: 'status', label: 'Status', required: false },
  { key: 'origin', label: 'Origin', required: false },
];

export const DEFAULT_SKU_COLUMNS = ['skuId', 'name', 'salesChannel', 'billingCycle', 'usdPrice', 'priceGroup', 'currencies', 'validity', 'lix', 'status', 'origin'];

export const SKU_SORT_OPTIONS = ['None', 'Validity']; // SKUs have simpler sorting

// Helper to get column label, using fallback if not found
export const getColumnLabel = (columnKey: string): string => {
  const allColumns = [
    ...PRICE_GROUP_COLUMNS,
    ...PRICE_POINT_COLUMNS,
    ...SKU_COLUMNS,
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