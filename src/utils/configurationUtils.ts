import type { Product, ConfigurationRequest, Sku } from './types';
import { mockProducts } from './mock-data';

/**
 * Generates a unique SKU ID based on existing app patterns
 * Format: "8" + 7-digit random number (matches existing SKU pattern)
 */
export function generateSkuId(_product: Product, _configRequest: ConfigurationRequest): string {
  return "8" + Math.floor(1000000 + Math.random() * 9000000).toString();
}

/**
 * Generates a unique price group ID based on existing app patterns
 * Format: "9" + 7-digit random number (matches existing price group pattern)
 */
export function generatePriceGroupId(_configRequest: ConfigurationRequest): string {
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
 * Enhanced conflict detection with detailed information and resolution suggestions
 */
export interface ConflictDetail {
  type: 'existing_sku' | 'pending_request' | 'failed_request' | 'price_mismatch' | 'similar_config';
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  conflictingId?: string;
  conflictingEntity?: any;
  suggestions: string[];
  canOverride: boolean;
}

export function checkDetailedConfigurationConflicts(product: Product, configRequest: ConfigurationRequest): ConflictDetail[] {
  const conflicts: ConflictDetail[] = [];
  
  // 1. Check for existing SKUs with same channel + billing cycle
  const existingSku = product.skus.find(sku => 
    sku.salesChannel === configRequest.salesChannel && 
    sku.billingCycle === configRequest.billingCycle
  );
  
  if (existingSku) {
    conflicts.push({
      type: 'existing_sku',
      severity: 'error',
      title: 'Duplicate Configuration Detected',
      description: `An active SKU already exists with the same sales channel (${configRequest.salesChannel}) and billing cycle (${configRequest.billingCycle}) combination.`,
      conflictingId: existingSku.id,
      conflictingEntity: existingSku,
      suggestions: [
        'Use a different sales channel or billing cycle combination',
        'Consider updating the existing SKU instead of creating a new one',
        'Review if this duplicate configuration is intentional'
      ],
      canOverride: false
    });
  }
  
  // 2. Check for pending configuration requests
  const pendingRequest = product.configurationRequests?.find(req => 
    req.salesChannel === configRequest.salesChannel && 
    req.billingCycle === configRequest.billingCycle &&
    req.id !== configRequest.id &&
    ['Draft', 'Pending Review', 'In Staging'].includes(req.status)
  );
  
  if (pendingRequest) {
    conflicts.push({
      type: 'pending_request',
      severity: 'error',
      title: 'Configuration Request in Progress',
      description: `A configuration request for ${configRequest.salesChannel} + ${configRequest.billingCycle} is already ${pendingRequest.status.toLowerCase()}.`,
      conflictingId: pendingRequest.id,
      conflictingEntity: pendingRequest,
      suggestions: [
        'Wait for the existing request to complete or be cancelled',
        'Use a different sales channel or billing cycle combination',
        'Contact the creator of the pending request to coordinate'
      ],
      canOverride: false
    });
  }
  
  // 3. Check for recent failed requests (might indicate a problem)
  const recentFailedRequest = product.configurationRequests?.find(req => 
    req.salesChannel === configRequest.salesChannel && 
    req.billingCycle === configRequest.billingCycle &&
    req.id !== configRequest.id &&
    req.status === 'Failed'
  );
  
  if (recentFailedRequest) {
    conflicts.push({
      type: 'failed_request',
      severity: 'warning',
      title: 'Previous Configuration Failed',
      description: `A recent configuration request for ${configRequest.salesChannel} + ${configRequest.billingCycle} failed. This might indicate underlying issues.`,
      conflictingId: recentFailedRequest.id,
      conflictingEntity: recentFailedRequest,
      suggestions: [
        'Review the failure reason before proceeding',
        'Ensure this configuration addresses the previous failure',
        'Consider contacting support if the issue persists'
      ],
      canOverride: true
    });
  }
  
  // 4. Check for price mismatches with similar configurations
  const similarSku = product.skus.find(sku => 
    sku.salesChannel === configRequest.salesChannel && 
    sku.billingCycle !== configRequest.billingCycle &&
    Math.abs(sku.priceGroup.pricePoints[0]?.amount - configRequest.priceAmount) > 100
  );
  
  if (similarSku && configRequest.priceAmount > 0) {
    conflicts.push({
      type: 'price_mismatch',
      severity: 'warning',
      title: 'Significant Price Difference',
      description: `The price ($${configRequest.priceAmount.toFixed(2)}) differs significantly from similar configurations in the same sales channel.`,
      conflictingId: similarSku.id,
      conflictingEntity: similarSku,
      suggestions: [
        'Verify this price aligns with business strategy',
        'Check if this difference is intentional',
        'Consider pricing consistency across billing cycles'
      ],
      canOverride: true
    });
  }
  
  // 5. Check for similar configurations that might be redundant
  const similarRequest = product.configurationRequests?.find(req => 
    req.salesChannel === configRequest.salesChannel && 
    req.billingCycle === configRequest.billingCycle &&
    req.id !== configRequest.id &&
    req.status === 'Live' &&
    Math.abs(req.priceAmount - configRequest.priceAmount) < 5
  );
  
  if (similarRequest) {
    conflicts.push({
      type: 'similar_config',
      severity: 'info',
      title: 'Similar Configuration Exists',
      description: `A very similar configuration already exists with nearly identical pricing ($${similarRequest.priceAmount.toFixed(2)} vs $${configRequest.priceAmount.toFixed(2)}).`,
      conflictingId: similarRequest.id,
      conflictingEntity: similarRequest,
      suggestions: [
        'Consider if this new configuration is necessary',
        'Evaluate if the existing configuration can be updated instead',
        'Ensure this duplication serves a specific business purpose'
      ],
      canOverride: true
    });
  }
  
  return conflicts;
}

/**
 * Get conflict resolution suggestions based on conflict types
 */
export function getConflictResolutionSuggestions(conflicts: ConflictDetail[]): string[] {
  const suggestions: string[] = [];
  
  if (conflicts.some(c => c.type === 'existing_sku')) {
    suggestions.push('Consider using different sales channel or billing cycle combinations');
    suggestions.push('Review existing SKUs to avoid duplicates');
  }
  
  if (conflicts.some(c => c.type === 'pending_request')) {
    suggestions.push('Wait for pending requests to complete before creating new ones');
    suggestions.push('Coordinate with teams working on similar configurations');
  }
  
  if (conflicts.some(c => c.type === 'failed_request')) {
    suggestions.push('Investigate and resolve the root cause of previous failures');
    suggestions.push('Ensure new configurations address known issues');
  }
  
  if (conflicts.some(c => c.type === 'price_mismatch')) {
    suggestions.push('Verify pricing strategy alignment across configurations');
    suggestions.push('Consider business impact of price differences');
  }
  
  return suggestions;
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

/**
 * Configuration submission service for handling form submission and data persistence
 */
export interface ConfigurationSubmissionResult {
  success: boolean;
  configurationRequest?: ConfigurationRequest;
  generatedSku?: any;
  generatedPriceGroup?: any;
  error?: string;
}

/**
 * Submits a configuration request and updates the mock data
 * In a real application, this would make API calls to the backend
 */
export function submitConfigurationRequest(
  product: Product, 
  configurationData: {
    salesChannel: string;
    billingCycle: string;
    priceAmount: number;
    lixKey?: string;
    lixTreatment?: string;
  }
): ConfigurationSubmissionResult {
  try {
    // Generate unique configuration request ID
    const requestId = `config-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    // Create the configuration request
    const configRequest: ConfigurationRequest = {
      id: requestId,
      targetProductId: product.id,
      salesChannel: configurationData.salesChannel as any,
      billingCycle: configurationData.billingCycle as any,
      priceAmount: configurationData.priceAmount,
      lixKey: configurationData.lixKey,
      lixTreatment: configurationData.lixTreatment,
      status: 'Draft' as any,
      createdBy: 'Current User',
      createdDate: new Date().toISOString()
    };

    // Validate the configuration request
    const validation = validateConfigurationRequest(product, configRequest);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    // Check for conflicts
    const conflicts = checkDetailedConfigurationConflicts(product, configRequest);
    const criticalConflicts = conflicts.filter(c => c.severity === 'error');
    
    if (criticalConflicts.length > 0) {
      return {
        success: false,
        error: `Critical conflicts detected: ${criticalConflicts.map(c => c.title).join(', ')}`
      };
    }

    // Generate SKU and price group (in a real app, this would be done by the backend)
    const generatedSku = generatePreviewSku(product, configRequest);
    const generatedPriceGroup = generatedSku.priceGroup;

    // Update configuration request with generated asset IDs
    configRequest.generatedSkuId = generatedSku.id;
    configRequest.generatedPriceGroupId = generatedPriceGroup.id;

    // For demo purposes, all configurations start as "Pending Review"
    // This allows demonstrating the workflow progression through the status buttons
    configRequest.status = 'Pending Review' as any;
    
    // Don't automatically add SKUs to the product - this should only happen when 
    // the configuration is manually progressed to "Live" status through the UI

    // Add the configuration request to the product's configuration requests
    addConfigurationRequestToProduct(product, configRequest);

    return {
      success: true,
      configurationRequest: configRequest,
      // For demo purposes, don't return generated assets until configuration goes live
      generatedSku: undefined,
      generatedPriceGroup: undefined
    };

  } catch (error) {
    console.error('Error submitting configuration request:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during submission'
    };
  }
}

/**
 * Updates the product with a new SKU (for prototype purposes)
 * In a real application, this would be handled by the backend
 */
function updateProductWithNewSku(product: Product, newSku: any, configRequest: ConfigurationRequest) {
  // Add configuration origin metadata to the SKU
  const skuWithOrigin = {
    ...newSku,
    configurationRequestId: configRequest.id,
    createdFromConfiguration: true,
    createdBy: configRequest.createdBy,
    createdDate: configRequest.createdDate
  };

  // Add to product's SKUs array
  product.skus.push(skuWithOrigin);
}

/**
 * Adds a configuration request to the product's configuration requests array
 */
function addConfigurationRequestToProduct(product: Product, configRequest: ConfigurationRequest) {
  if (!product.configurationRequests) {
    product.configurationRequests = [];
  }
  
  product.configurationRequests.push(configRequest);
  
  // Sort by creation date (newest first)
  product.configurationRequests.sort((a, b) => 
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );
}

/**
 * Generates a human-readable success message for configuration submission
 */
export function getSubmissionSuccessMessage(result: ConfigurationSubmissionResult): string {
  if (!result.success || !result.configurationRequest) {
    return 'Configuration submission failed';
  }

  const request = result.configurationRequest;
  const isExperimental = request.lixKey ? 'experimental ' : '';
  
  // For demo purposes, all configurations start as "Pending Review"
  return `${isExperimental}Configuration request ${request.id} has been submitted and is pending review. Use the status progression buttons to advance it through the workflow.`;
}

/**
 * Generates next steps recommendations after successful submission
 */
export function getSubmissionNextSteps(result: ConfigurationSubmissionResult): string[] {
  if (!result.success || !result.configurationRequest) {
    return [];
  }

  const request = result.configurationRequest;
  const steps: string[] = [];

  // For demo purposes, all configurations start as "Pending Review"
  steps.push('View the configuration request details');
  steps.push('Use the "Approve & Move to Staging" button to progress the workflow');
  steps.push('After staging, use "Deploy to Production" to make it live');
  steps.push('Monitor the configuration through the complete workflow');

  if (request.lixKey) {
    steps.push('Set up tracking for the experimental configuration');
    steps.push('Monitor experiment metrics and performance');
  }

  return steps;
} 

/**
 * Updates the status of a configuration request in the mock data
 * This is a simple UI prototype function - in a real app this would be an API call
 */
export function updateConfigurationRequestStatus(
  productId: string, 
  requestId: string, 
  newStatus: 'Pending Review' | 'In Staging' | 'Live' | 'Failed'
): boolean {
  // Find the product
  const product = mockProducts.find((p: Product) => p.id === productId);
  if (!product || !product.configurationRequests) {
    return false;
  }
  
  // Find the configuration request
  const request = product.configurationRequests.find((r: ConfigurationRequest) => r.id === requestId);
  if (!request) {
    return false;
  }
  
  // If progressing to "Live" status, generate and add the SKU to the product
  if (newStatus === 'Live' && request.status !== 'Live') {
    try {
      // Generate the SKU that should be created
      const generatedSku = generatePreviewSku(product, request);
      
      // Add the SKU to the product
      updateProductWithNewSku(product, generatedSku, request);
      
      console.log(`Configuration request ${requestId} went live - SKU ${generatedSku.id} added to product`);
    } catch (error) {
      console.error('Error generating SKU for live configuration:', error);
      return false;
    }
  }
  
  // Update the status
  request.status = newStatus;
  
  console.log(`Configuration request ${requestId} status updated to: ${newStatus}`);
  return true;
}

/**
 * Gets the next possible status transitions for a configuration request
 * This defines the allowed workflow progression
 */
export function getNextStatusOptions(currentStatus: 'Pending Review' | 'In Staging' | 'Live' | 'Failed'): Array<{
  status: 'Pending Review' | 'In Staging' | 'Live' | 'Failed';
  label: string;
  description: string;
  buttonType: 'primary' | 'default' | 'danger';
  icon: string;
}> {
  switch (currentStatus) {
    case 'Pending Review':
      return [
        {
          status: 'In Staging',
          label: 'Approve & Move to Staging',
          description: 'Approve this configuration and deploy to staging environment',
          buttonType: 'primary',
          icon: 'eye'
        },
        {
          status: 'Failed',
          label: 'Reject Request',
          description: 'Reject this configuration request',
          buttonType: 'danger',
          icon: 'x-circle'
        }
      ];
    
    case 'In Staging':
      return [
        {
          status: 'Live',
          label: 'Deploy to Production',
          description: 'Deploy this configuration to production environment',
          buttonType: 'primary',
          icon: 'check-circle'
        },
        {
          status: 'Failed',
          label: 'Mark as Failed',
          description: 'Mark this configuration as failed',
          buttonType: 'danger',
          icon: 'x-circle'
        }
      ];
    
    case 'Live':
      return []; // No transitions from Live status
    
    case 'Failed':
      return [
        {
          status: 'Pending Review',
          label: 'Retry Request',
          description: 'Retry this configuration request',
          buttonType: 'default',
          icon: 'refresh-cw'
        }
      ];
    
    default:
      return [];
  }
} 