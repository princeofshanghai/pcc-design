import type { ColumnConfig } from './types';

export const PRICE_GROUP_COLUMNS: ColumnConfig[] = [
  { key: 'id', label: 'Price ID', required: true },
  { key: 'channel', label: 'Channel', required: false },
  { key: 'billingCycle', label: 'Billing cycle', required: false },
  { key: 'price', label: 'List price', required: false },
  { key: 'lix', label: 'LIX', required: false },
  { key: 'status', label: 'Status', required: false },
];

export const DEFAULT_PRICE_GROUP_COLUMNS = ['id', 'price', 'channel', 'billingCycle', 'lix', 'status'];

export const PRICE_POINT_COLUMNS: ColumnConfig[] = [
  { key: 'id', label: 'Price point ID', required: true },
  { key: 'currency', label: 'Currency', required: true },
  { key: 'currencyType', label: 'Category', required: false },
  { key: 'amount', label: 'Amount', required: false },

  { key: 'pricingRule', label: 'Rule', required: false },
  { key: 'quantityRange', label: 'Seats', required: false },
  { key: 'priceType', label: 'Type', required: false },
  { key: 'pricingTier', label: 'Tier', required: false },
  { key: 'usdEquivalent', label: 'USD equivalent', required: false },
  { key: 'validity', label: 'Validity', required: false },
  { key: 'status', label: 'Status', required: false },
];

export const DEFAULT_PRICE_POINT_COLUMNS = ['id', 'currency', 'amount', 'currencyType', 'pricingRule', 'quantityRange', 'priceType', 'pricingTier', 'validity', 'status'];

// Sort options for price groups
export const PRICE_GROUP_SORT_OPTIONS = [
  'None',
  'ID (A-Z)',
  'ID (Z-A)',
  'Channel (A-Z)',
  'Channel (Z-A)',
  'Billing Cycle (A-Z)',
  'Billing Cycle (Z-A)',
  'LIX (A-Z)',
  'LIX (Z-A)',
  'Status (A-Z)',
  'Status (Z-A)',
];

// Group by options for price groups
export const PRICE_GROUP_GROUP_BY_OPTIONS = [
  'None',
  'Billing Cycle',
  'Channel',
  'LIX',
  'Status',
];

// Sort options for price points
export const PRICE_POINT_SORT_OPTIONS = [
  'None',
  'Amount (High to low)',
  'Amount (Low to high)',
  'Category',
  'Currency (A-Z)',
  'Currency (Z-A)', 
  'Price type (A-Z)',
  'Price type (Z-A)',
  'Pricing tier (A-Z)',
  'Pricing tier (Z-A)',
  'Status (A-Z)',
  'Status (Z-A)',
  'USD equivalent (High to low)',
  'USD equivalent (Low to high)',
  'Validity (Earliest to latest)',
  'Validity (Latest to earliest)',
];

// Group by options for price points
export const PRICE_POINT_GROUP_BY_OPTIONS = [
  'None',
  'Category',
  'Currency',
  'Price type',
  'Pricing rule',
  'Pricing tier',
  'Validity',
];

// Sort options for flattened price points (used in ProductDetail price point view)
export const FLATTENED_PRICE_POINT_SORT_OPTIONS = [
  'None',
  'ID (A-Z)',
  'ID (Z-A)',
  'Currency (A-Z)',
  'Currency (Z-A)',
  'Amount (Low to high)',
  'Amount (High to low)',
  'Channel (A-Z)',
  'Channel (Z-A)',
  'Billing Cycle (A-Z)',
  'Billing Cycle (Z-A)',
  'LIX (A-Z)',
  'LIX (Z-A)',
  'Validity (Earliest to latest)',
  'Validity (Latest to earliest)',
  'Status (A-Z)',
  'Status (Z-A)',
];

// Group by options for flattened price points (used in ProductDetail price point view)
export const FLATTENED_PRICE_POINT_GROUP_BY_OPTIONS = [
  'None',
  'Currency',
  'Channel',
  'Billing Cycle',
  'LIX Key',
  'Validity',
  'Status',
];

export const SKU_COLUMNS: ColumnConfig[] = [
  { key: 'id', label: 'SKU ID', required: true },
  { key: 'priceGroup', label: 'Price', required: false },
  { key: 'channel', label: 'Channel', required: false },
  { key: 'billingCycle', label: 'Billing cycle', required: false },
  { key: 'lix', label: 'LIX', required: false },
  { key: 'validity', label: 'Validity', required: false },
  { key: 'status', label: 'Status', required: false },
];

export const DEFAULT_SKU_COLUMNS = ['id', 'priceGroup', 'channel', 'billingCycle', 'lix', 'status'];

export const SKU_SORT_OPTIONS = [
  'None',
  'SKU ID (A-Z)',
  'SKU ID (Z-A)',
  'Price (A-Z)',
  'Price (Z-A)',
  'Channel (A-Z)',
  'Channel (Z-A)',
  'Billing Cycle (A-Z)',
  'Billing Cycle (Z-A)',
  'LIX (A-Z)',
  'LIX (Z-A)',
  'Status (A-Z)',
  'Status (Z-A)',
];

// Group by options for SKUs
export const SKU_GROUP_BY_OPTIONS = [
  'None',
  'Price',
  'Channel',
  'Billing Cycle',
  'LIX',
  'Status',
];

export const PRODUCT_COLUMNS: ColumnConfig[] = [
  { key: 'id', label: 'Product ID', required: true },
  { key: 'name', label: 'Name', required: true },
  { key: 'folder', label: 'Folder', required: false },
  { key: 'channel', label: 'Channel', required: false },
  { key: 'status', label: 'Status', required: false },
];

export const DEFAULT_PRODUCT_COLUMNS = ['id', 'name', 'folder', 'channel', 'status'];

// Sort options for products
export const PRODUCT_SORT_OPTIONS = [
  'None',
  'Folder (A-Z)',
  'Folder (Z-A)',
  'LOB (A-Z)',
  'LOB (Z-A)',
  'Name (A-Z)',
  'Name (Z-A)',
  'Product ID (A-Z)',
  'Product ID (Z-A)',
  'SKUs (High to low)',
  'SKUs (Low to high)',
];

// Group by options for products
export const PRODUCT_GROUP_BY_OPTIONS = [
  'None',
  'Channel',
  'Folder',
  'LOB',
  'Status',
];

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

/**
 * Centralized filter placeholder generator.
 * Generates consistent "All [items]" placeholders for filter dropdowns.
 * Uses centralized column configurations and handles pluralization.
 */
export const getFilterPlaceholder = (columnKey: string): string => {
  // Get the base label from centralized configuration
  const baseLabel = getColumnLabel(columnKey);
  
  // Special cases for proper pluralization and naming
  const pluralMap: Record<string, string> = {
    'status': 'statuses',
    'lix': 'LIX', // LIX is already an acronym, don't pluralize
    'currency': 'currencies', 
    'category': 'categories',
    'currencyType': 'categories', // Currency type column shows as "categories" in filters
    'channel': 'channels',
    'billingCycle': 'billing cycles',
    'priceGroup': 'price groups',
    'validity': 'validity',
    'priceType': 'price types',
    'pricingRule': 'pricing rules',
    'pricingTier': 'pricing tiers',
    'quantityRange': 'quantity ranges',
    'folder': 'folders',
    'lob': 'LOBs',
    'domain': 'domains',
    'type': 'types',
    'region': 'regions',
    'experiment': 'experiments', // Legacy fallback
  };
  
  // Check for exact key match first
  if (pluralMap[columnKey]) {
    return `All ${pluralMap[columnKey]}`;
  }
  
  // Check for label-based match (case insensitive)
  const labelKey = Object.keys(pluralMap).find(key => 
    getColumnLabel(key).toLowerCase() === baseLabel.toLowerCase()
  );
  if (labelKey) {
    return `All ${pluralMap[labelKey]}`;
  }
  
  // Default: try to pluralize the base label intelligently
  let pluralized = baseLabel.toLowerCase();
  
  // Simple pluralization rules
  if (pluralized.endsWith('y') && !pluralized.endsWith('ay') && !pluralized.endsWith('ey') && !pluralized.endsWith('oy')) {
    pluralized = pluralized.slice(0, -1) + 'ies'; // company -> companies
  } else if (pluralized.endsWith('s') || pluralized.endsWith('sh') || pluralized.endsWith('ch') || pluralized.endsWith('x') || pluralized.endsWith('z')) {
    pluralized = pluralized + 'es'; // status -> statuses
  } else if (pluralized !== pluralized.toUpperCase()) { // Don't pluralize acronyms
    pluralized = pluralized + 's'; // channel -> channels
  }
  
  return `All ${pluralized}`;
}; 