// Utility for loading product pricing data from JSON files
import type { PriceGroup } from './types';

// Cache to avoid loading the same data multiple times
const priceDataCache = new Map<string, any>();

/**
 * Load pricing data for a specific product
 * This replaces the large embedded data in mock-data.ts
 */
export async function loadProductPricingData(productId: string): Promise<any> {
  // Check cache first
  if (priceDataCache.has(productId)) {
    return priceDataCache.get(productId);
  }

  try {
    const response = await fetch(`/data/products/${productId}.json`);
    if (!response.ok) {
      console.warn(`No pricing data found for product ${productId}`);
      return { productId, priceGroups: [] };
    }
    
    const data = await response.json();
    priceDataCache.set(productId, data);
    return data;
  } catch (error) {
    console.error(`Error loading pricing data for product ${productId}:`, error);
    return { productId, priceGroups: [] };
  }
}

/**
 * Convert Excel row data to our JSON format
 * Use this to help convert your spreadsheet data
 */
export function convertExcelRowToJson(row: {
  PRICE_ID: string;
  PRICE_POINT_ID: string;
  PRODUCT_ID: string;
  AMOUNT: number;
  CURRENCY: string;
  PRICING_RULE: string;
  PRICE_TYPE: string;
  IS_TAX_INCLUSIVE: string;
  VALID_FROM: string;
  VALID_UNTIL?: string;
  STATE: string;
}): any {
  return {
    id: row.PRICE_POINT_ID,
    currencyCode: row.CURRENCY,
    amount: row.AMOUNT,
    validFrom: new Date(row.VALID_FROM).toISOString(),
    validTo: row.VALID_UNTIL ? new Date(row.VALID_UNTIL).toISOString() : undefined,
    pricingRule: row.PRICING_RULE,
    priceType: row.PRICE_TYPE,
    isTaxInclusive: row.IS_TAX_INCLUSIVE === 'Y' || row.IS_TAX_INCLUSIVE === 'true',
    status: row.STATE === 'A' ? 'Active' : row.STATE === 'I' ? 'Inactive' : row.STATE
  };
}

/**
 * Helper to group price points by price group ID
 */
export function groupPricePointsByPriceGroup(rows: any[]): any {
  const priceGroups = new Map();
  
  rows.forEach(row => {
    const priceGroupId = row.PRICE_ID;
    const pricePoint = convertExcelRowToJson(row);
    
    if (!priceGroups.has(priceGroupId)) {
      priceGroups.set(priceGroupId, {
        id: priceGroupId,
        status: 'Active', // You can adjust this based on your needs
        validFrom: pricePoint.validFrom,
        pricePoints: []
      });
    }
    
    priceGroups.get(priceGroupId).pricePoints.push(pricePoint);
  });
  
  return Array.from(priceGroups.values());
}