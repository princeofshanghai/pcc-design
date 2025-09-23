// Demo-optimized data loading system for PCC prototype
// Designed for smooth UX demonstration with 500+ products

import type { Product, PricePoint, RevenueRecognition, RefundPolicyId } from './types';
import { processPricePointStatuses } from './pricingUtils';

// Cache management for demo performance
const productListCache = new Map<string, any>();
const priceGroupCache = new Map<string, any>();
const pricePointCache = new Map<string, any>();

/**
 * Clear all caches - useful when data has been updated
 */
export function clearAllCaches(): void {
  productListCache.clear();
  priceGroupCache.clear();
  pricePointCache.clear();
  console.log('All caches cleared');
}

// Make cache clearing available globally for development
if (typeof window !== 'undefined') {
  (window as any).clearPccCaches = clearAllCaches;
}

/**
 * Load basic product catalog (fast initial load)
 * This is what powers the main product list view
 */
export async function loadProductCatalog(): Promise<Product[]> {
  const cacheKey = 'product-catalog';
  
  if (productListCache.has(cacheKey)) {
    return productListCache.get(cacheKey);
  }

  try {
    const response = await fetch('/data/products.json');
    if (!response.ok) {
      throw new Error('Failed to load product catalog');
    }
    
    const products = await response.json();
    productListCache.set(cacheKey, products);
    return products;
  } catch (error) {
    console.error('Error loading product catalog:', error);
    // Graceful fallback to existing embedded data
    const { mockProducts } = await import('./mock-data');
    return mockProducts;
  }
}

/**
 * Load price groups for a specific product (product detail view)
 * Only loads when user clicks into a product
 */
export async function loadProductPriceGroups(productId: string): Promise<any[]> {
  const cacheKey = `price-groups-${productId}`;
  
  if (priceGroupCache.has(cacheKey)) {
    return priceGroupCache.get(cacheKey);
  }

  try {
    const response = await fetch(`/data/price-groups/${productId}.json`);
    if (!response.ok) {
      console.warn(`No price groups found for product ${productId}`);
      return [];
    }
    
    const data = await response.json();
    priceGroupCache.set(cacheKey, data.priceGroups || []);
    return data.priceGroups || [];
  } catch (error) {
    console.error(`Error loading price groups for product ${productId}:`, error);
    return [];
  }
}

/**
 * Load price points for a specific price group (price group detail view)
 * Only loads when user drills down to price group level
 */
export async function loadPriceGroupPoints(priceGroupId: string): Promise<PricePoint[]> {
  const cacheKey = `price-points-${priceGroupId}`;
  
  if (pricePointCache.has(cacheKey)) {
    return pricePointCache.get(cacheKey);
  }

  try {
    const response = await fetch(`/data/price-points/${priceGroupId}.json`);
    if (!response.ok) {
      console.warn(`No price points found for price group ${priceGroupId}`);
      return [];
    }
    
    const data = await response.json();
    const processedPoints = processPricePointStatuses(data.pricePoints || []);
    pricePointCache.set(cacheKey, processedPoints);
    return processedPoints;
  } catch (error) {
    console.error(`Error loading price points for price group ${priceGroupId}:`, error);
    return [];
  }
}

/**
 * Scans all existing SKUs across all mock products to find the highest numeric ID
 * This prevents ID conflicts between manual and auto-generated SKUs
 * 
 * HOW IT WORKS:
 * 1. Scans ALL products and their manually-defined SKUs
 * 2. Extracts numeric parts from SKU IDs matching pattern "8435XXX" 
 * 3. Returns the highest found ID
 * 4. New SKU generation starts from this number + 1
 * 
 * EXAMPLE:
 * - Manual SKUs exist: 8435005, 8435008
 * - Function returns: 8435008
 * - New SKUs generated: 8435009, 8435010, 8435011...
 * - Future manual SKU 8435015 → next generated: 8435016+
 */
function findHighestSkuId(mockProducts: any[]): number {
  let highestId = 0;
  
  // Scan all products and their SKUs
  mockProducts.forEach(product => {
    if (product.skus && Array.isArray(product.skus)) {
      product.skus.forEach((sku: any) => {
        if (sku.id && typeof sku.id === 'string') {
          // Extract numeric part from SKU IDs that match pattern like "8435XXX"
          const match = sku.id.match(/^8435(\d+)$/);
          if (match) {
            const numericPart = parseInt(match[1], 10);
            const fullId = 8435000 + numericPart;
            if (fullId > highestId) {
              highestId = fullId;
            }
          }
        }
      });
    }
  });
  
  return highestId;
}

/**
 * Enhanced product loading with smart lazy loading and conflict-free SKU ID generation
 * Combines basic product info with price groups only when needed
 */
export async function loadProductWithPricing(productId: string): Promise<Product | null> {
  try {
    // First try to load from enhanced data system
    const priceGroups = await loadProductPriceGroups(productId);
    
    if (priceGroups.length > 0) {
      // We have JSON price groups, use them
      const { mockProducts } = await import('./mock-data');
      const baseProduct = mockProducts.find(p => p.id === productId);
      
      if (!baseProduct) {
        return null;
      }

      // Find the highest existing SKU ID to prevent conflicts
      const highestExistingId = findHighestSkuId(mockProducts);
      let nextAvailableId = Math.max(highestExistingId + 1, 8435020); // Ensure minimum starting point
      

      // Create SKUs from price groups (one SKU per price group for demo purposes)
      const enhancedSkus = priceGroups.map((priceGroup: any, index: number) => {
        const salesChannel = priceGroup.channel || 'Desktop';
        
        // Preserve customer data from original SKUs if they exist (EXACT price group ID match only)
        const billingCycle = priceGroup.billingCycle || 'Monthly';
        const originalSku = baseProduct.skus?.find(sku => 
          sku.priceGroup?.id === priceGroup.id
        );
        
        // Generate proper sequential SKU IDs if no original SKU exists
        const generateSkuId = () => {
          if (originalSku?.id) {
            return originalSku.id;
          }
          
          // Generate conflict-free ID by using next available ID
          const newId = `8435${String(nextAvailableId - 8435000).padStart(3, '0')}`;
          nextAvailableId++; // Increment for next SKU
          return newId;
        };
        
        return {
          id: generateSkuId(),
          status: priceGroup.status,
          salesChannel: salesChannel,
          billingCycle: priceGroup.billingCycle || 'Monthly',
          // Preserve customer data from original SKUs
          activeContracts: originalSku?.activeContracts,
          subscriptions: originalSku?.subscriptions,
          // Preserve all override attributes from original SKU (CRITICAL FOR OVERRIDES)
          taxClass: originalSku?.taxClass,
          seatMin: originalSku?.seatMin,
          seatMax: originalSku?.seatMax,
          seatType: originalSku?.seatType,
          paymentFailureFreeToPaidGracePeriod: originalSku?.paymentFailureFreeToPaidGracePeriod,
          paymentFailurePaidToPaidGracePeriod: originalSku?.paymentFailurePaidToPaidGracePeriod,
          isVisibleOnRenewalEmails: originalSku?.isVisibleOnRenewalEmails,
          // Preserve any other original SKU properties
          revenueRecognition: originalSku?.revenueRecognition || "Accrual" as RevenueRecognition,
          switcherLogic: originalSku?.switcherLogic || [],
          refundPolicy: originalSku?.refundPolicy || { id: "YES_MANUAL" as RefundPolicyId, description: "Manual refund" },
          origin: originalSku?.origin || "manual" as const,
          createdBy: originalSku?.createdBy || "Demo System",
          createdDate: originalSku?.createdDate || new Date().toISOString(),
          // Add LIX data to SKU if available (prioritize original SKU LIX, fallback to price group)
          lix: originalSku?.lix || (priceGroup.lixKey ? {
            key: priceGroup.lixKey,
            treatment: priceGroup.lixTreatment
          } : undefined),
          priceGroup: {
            id: priceGroup.id,
            name: priceGroup.name || null, // Don't generate fake names
            status: priceGroup.status,
            validFrom: priceGroup.validFrom,
            validUntil: priceGroup.validUntil,
            pricePoints: processPricePointStatuses(priceGroup.pricePoints || [])
          }
        };
      });

      return {
        ...baseProduct,
        skus: enhancedSkus
      };
    } else {
      // Fallback to existing embedded data
      const { mockProducts } = await import('./mock-data');
      return mockProducts.find(p => p.id === productId) || null;
    }

  } catch (error) {
    console.error(`Error loading product ${productId} with pricing:`, error);
    // Graceful fallback to embedded data
    const { mockProducts } = await import('./mock-data');
    return mockProducts.find(p => p.id === productId) || null;
  }
}

/**
 * Load products with accurate SKU counts for the product list view
 * This ensures SKU counts match what users see in Product Detail
 */
export async function loadProductsWithAccurateCounts(): Promise<Product[]> {
  const cacheKey = 'products-with-counts';
  
  if (productListCache.has(cacheKey)) {
    return productListCache.get(cacheKey);
  }

  try {
    // Start with base products
    const { mockProducts } = await import('./mock-data');
    
    // For each product, check if it has JSON price group data and update SKU count
    const productsWithAccurateCounts = await Promise.all(
      mockProducts.map(async (product) => {
        try {
          const priceGroups = await loadProductPriceGroups(product.id);
          
          if (priceGroups.length > 0) {
            // Product has JSON data - SKU count = number of price groups
            return {
              ...product,
              skus: priceGroups.map((priceGroup: any) => {
                const salesChannel = priceGroup.channel || 'Desktop';
                
                // Preserve customer data from original SKUs if they exist
                const billingCycle = priceGroup.billingCycle || 'Monthly';
                const originalSku = product.skus?.find(sku => 
                  sku.priceGroup?.id === priceGroup.id || 
                  (sku.salesChannel === salesChannel && sku.billingCycle === billingCycle)
                );
                
                return {
                  id: `sku-${priceGroup.id}`,
                  status: priceGroup.status,
                  salesChannel: salesChannel,
                  billingCycle: priceGroup.billingCycle || 'Monthly',
                  // Preserve customer data from original SKUs
                  activeContracts: originalSku?.activeContracts,
                  subscriptions: originalSku?.subscriptions,
                  // Lightweight SKU structure for list view performance
                  priceGroup: { 
                    id: priceGroup.id, 
                    status: priceGroup.status || 'Active',
                    validFrom: priceGroup.validFrom || new Date().toISOString(),
                    pricePoints: [] 
                  },
                  revenueRecognition: "Accrual" as RevenueRecognition,
                  switcherLogic: [],
                  refundPolicy: { id: "YES_MANUAL" as RefundPolicyId, description: "Manual refund" },
                  origin: "manual" as const
                };
              })
            };
          } else {
            // No JSON data - use original embedded SKU count
            return product;
          }
        } catch (error) {
          // On error, use original product data
          return product;
        }
      })
    );

    productListCache.set(cacheKey, productsWithAccurateCounts);
    return productsWithAccurateCounts;
  } catch (error) {
    console.error('Error loading products with accurate counts:', error);
    // Fallback to original data
    const { mockProducts } = await import('./mock-data');
    return mockProducts;
  }
}

/**
 * Clear all caches (useful for demo resets)
 */
export function clearDemoCache(): void {
  productListCache.clear();
  priceGroupCache.clear();
  pricePointCache.clear();
}

/**
 * Preload commonly accessed data (optional performance boost)
 */
export async function preloadDemoData(productIds: string[] = []): Promise<void> {
  // Preload product catalog
  await loadProductCatalog();
  
  // Optionally preload price groups for specific products
  if (productIds.length > 0) {
    await Promise.all(productIds.map(loadProductPriceGroups));
  }
}

/**
 * Demo stats for performance monitoring
 */
export function getDemoStats(): {
  productsLoaded: number;
  priceGroupsLoaded: number;
  pricePointsLoaded: number;
} {
  return {
    productsLoaded: productListCache.size,
    priceGroupsLoaded: priceGroupCache.size,
    pricePointsLoaded: pricePointCache.size
  };
}