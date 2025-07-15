import type { Product, ConfigurationRequest, Sku } from './types';

/**
 * Generates a unique SKU ID based on existing app patterns
 * Format: "8" + 7-digit random number (matches existing SKU pattern)
 */
export function generateSkuId(product: Product, configRequest: ConfigurationRequest): string {
  return "8" + Math.floor(1000000 + Math.random() * 9000000).toString();
}

/**
 * Generates a unique price group ID based on existing app patterns
 * Format: "9" + 7-digit random number (matches existing price group pattern)
 */
export function generatePriceGroupId(configRequest: ConfigurationRequest): string {
  return "9" + Math.floor(1000000 + Math.random() * 9000000).toString();
}

/**
 * Generates a price group name based on existing app patterns
 * Format: "PRODUCT_PREFIX_FY25_BILLING_CYCLE"
 */
export function generatePriceGroupName(product: Product, configRequest: ConfigurationRequest): string {
  // Create product prefix (e.g., "Premium Career" -> "PC")
  const words = product.name.split(' ');
  const productPrefix = words.length > 1 
    ? words.map(word => word.charAt(0)).join('')
    : product.name.substring(0, 2);
  
  return `${productPrefix.toUpperCase()}_FY25_${configRequest.billingCycle.toUpperCase()}`;
}

/**
 * Generates a SKU name based on existing app patterns
 * Format: "Product Name FY25 Channel Billing"
 */
export function generateSkuName(product: Product, configRequest: ConfigurationRequest): string {
  return `${product.name} FY25 ${configRequest.salesChannel} ${configRequest.billingCycle}`;
}

/**
 * Generates a preview SKU object showing what would be created
 */
export function generatePreviewSku(product: Product, configRequest: ConfigurationRequest): Sku {
  const skuId = generateSkuId(product, configRequest);
  const priceGroupId = generatePriceGroupId(configRequest);
  
  // Create the SKU name based on product name and configuration
  const skuName = generateSkuName(product, configRequest);
  
  // Create the price group for this configuration
  const priceGroup = {
    id: priceGroupId,
    name: generatePriceGroupName(product, configRequest),
    status: 'Active' as const,
    startDate: new Date().toISOString().split('T')[0], // Today's date
    pricePoints: [
      {
        currencyCode: 'USD',
        amount: configRequest.priceAmount
      }
    ]
  };
  
  // Build the preview SKU with product defaults
  const previewSku: Sku = {
    id: skuId,
    name: skuName,
    status: 'Active', // New SKUs start as Active
    salesChannel: configRequest.salesChannel,
    billingCycle: configRequest.billingCycle,
    priceGroup: priceGroup,
    revenueRecognition: 'Accrual', // Default for new SKUs
    switcherLogic: [], // Empty for new SKUs
    refundPolicy: { id: 'YES_MANUAL', description: 'Manual refund' }, // Default policy
    // Inherit product-level defaults
    taxClass: product.taxClass,
    paymentFailureFreeToPaidGracePeriod: product.paymentFailureFreeToPaidGracePeriod,
    paymentFailurePaidToPaidGracePeriod: product.paymentFailurePaidToPaidGracePeriod,
    seatMin: product.seatMin,
    seatMax: product.seatMax,
    features: [...product.features], // Copy product features
    tags: product.tags ? [...product.tags] : undefined // Copy product tags if they exist
  };
  
  // Add LIX information if this is an experimental configuration
  if (configRequest.lixKey && configRequest.lixTreatment) {
    previewSku.lix = {
      key: configRequest.lixKey,
      treatment: configRequest.lixTreatment
    };
  }
  
  return previewSku;
}

/**
 * Checks if a configuration already exists for a product
 */
export function checkConfigurationConflicts(product: Product, configRequest: ConfigurationRequest): string[] {
  const conflicts: string[] = [];
  
  // Check existing SKUs for the same channel + billing cycle combination
  const existingSku = product.skus.find(sku => 
    sku.salesChannel === configRequest.salesChannel && 
    sku.billingCycle === configRequest.billingCycle
  );
  
  if (existingSku) {
    conflicts.push(`A ${configRequest.salesChannel} + ${configRequest.billingCycle} configuration already exists (SKU: ${existingSku.id})`);
  }
  
  // Check existing configuration requests for the same combination
  const existingRequest = product.configurationRequests?.find(req => 
    req.salesChannel === configRequest.salesChannel && 
    req.billingCycle === configRequest.billingCycle &&
    req.id !== configRequest.id && // Don't flag self when editing
    req.status !== 'Failed' // Ignore failed requests
  );
  
  if (existingRequest) {
    conflicts.push(`A ${configRequest.salesChannel} + ${configRequest.billingCycle} configuration request is already ${existingRequest.status.toLowerCase()} (Request: ${existingRequest.id})`);
  }
  
  return conflicts;
}

/**
 * Validates if a configuration request is valid
 */
export function validateConfigurationRequest(product: Product, configRequest: ConfigurationRequest): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required field validation
  if (!configRequest.salesChannel) {
    errors.push('Sales channel is required');
  }
  
  if (!configRequest.billingCycle) {
    errors.push('Billing cycle is required');
  }
  
  if (!configRequest.priceAmount || configRequest.priceAmount <= 0) {
    errors.push('Price amount must be greater than 0');
  }
  
  // Business logic validation
  if (product.billingModel !== 'Subscription' && configRequest.billingCycle !== 'Monthly') {
    warnings.push('Non-subscription products typically use monthly billing');
  }
  
  // LIX validation
  if (configRequest.lixKey && !configRequest.lixTreatment) {
    errors.push('LIX treatment is required when LIX key is provided');
  }
  
  if (configRequest.lixTreatment && !configRequest.lixKey) {
    errors.push('LIX key is required when LIX treatment is provided');
  }
  
  // Check for conflicts
  const conflicts = checkConfigurationConflicts(product, configRequest);
  errors.push(...conflicts);
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
} 