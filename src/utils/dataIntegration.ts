// Integration layer to seamlessly merge embedded and JSON data
// This ensures backward compatibility while enabling bulk data updates

import type { Product, Sku, PriceGroup } from './types';
import { loadProductPricingData } from './dataLoader';

/**
 * Enhanced product loading that combines embedded data with JSON data
 * This maintains full backward compatibility with existing tables and views
 */
export async function enhanceProductWithPricingData(product: Product): Promise<Product> {
  try {
    // Try to load additional pricing data from JSON
    const jsonData = await loadProductPricingData(product.id);
    
    if (!jsonData.priceGroups || jsonData.priceGroups.length === 0) {
      // No JSON data found, return product with existing embedded data
      return product;
    }

    // Merge JSON data with existing SKUs
    const enhancedSkus = await Promise.all(
      product.skus.map(async (sku) => {
        // Find matching price group in JSON data
        const jsonPriceGroup = jsonData.priceGroups.find(
          (pg: any) => pg.id === sku.priceGroup.id
        );

        if (jsonPriceGroup) {
          // Use JSON data (this allows bulk updates to override embedded data)
          return {
            ...sku,
            priceGroup: {
              ...sku.priceGroup,
              ...jsonPriceGroup,
              // Ensure price points maintain the exact same structure
              pricePoints: jsonPriceGroup.pricePoints || sku.priceGroup.pricePoints
            }
          };
        }

        // No JSON override found, use existing embedded data
        return sku;
      })
    );

    return {
      ...product,
      skus: enhancedSkus
    };

  } catch (error) {
    console.warn(`Failed to enhance product ${product.id} with JSON data:`, error);
    // On any error, return the original product (graceful fallback)
    return product;
  }
}

/**
 * Enhanced mock products that seamlessly integrates JSON data
 * This is a drop-in replacement for the original mockProducts export
 */
let cachedEnhancedProducts: Product[] | null = null;

export async function getEnhancedMockProducts(): Promise<Product[]> {
  if (cachedEnhancedProducts) {
    return cachedEnhancedProducts;
  }

  // Import the original mock products (avoiding circular imports)
  const { mockProducts } = await import('./mock-data');
  
  // Enhance each product with JSON data if available
  const enhancedProducts = await Promise.all(
    mockProducts.map(enhanceProductWithPricingData)
  );

  cachedEnhancedProducts = enhancedProducts;
  return enhancedProducts;
}

/**
 * Clear cache when new data is uploaded
 * Call this after uploading new JSON files
 */
export function clearProductCache(): void {
  cachedEnhancedProducts = null;
}