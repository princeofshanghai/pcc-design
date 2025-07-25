import type { Product, ConfigurationRequest, Sku } from './types';
import { mockProducts } from './mock-data';

/**
 * Generates a unique SKU ID based on existing app patterns
 * Format: "8" + 6-digit random number (matches existing SKU pattern)
 */
export function generateSkuId(_product: Product, _changeRequest: ConfigurationRequest): string {
  return "8" + Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generates a unique price group ID based on new pattern
 * Format: 6-digit number starting with 1 (e.g., "123456")
 */
export function generatePriceGroupId(_changeRequest: ConfigurationRequest): string {
  return "1" + Math.floor(10000 + Math.random() * 90000).toString();
}

/**
 * Generates a unique price point ID based on new pattern
 * Format: 7-digit number starting with 6 (e.g., "6123456")
 */
export function generatePricePointId(): string {
  return "6" + Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generates a unique change request ID based on existing app patterns
 * Format: "3" + 5-digit random number (matches existing change request pattern)
 */
export function generateChangeRequestId(): string {
  return "3" + Math.floor(10000 + Math.random() * 90000).toString();
}

/**
 * Generates a price group name based on existing app patterns
 * Format: "Product Prefix FY25 Billing Cycle"
 */
export function generatePriceGroupName(product: Product, changeRequest: ConfigurationRequest): string {
  // If a custom price group name is provided, use that
  if (changeRequest.priceGroupName && changeRequest.priceGroupName.trim()) {
    return changeRequest.priceGroupName.trim();
  }
  
  // Otherwise, auto-generate the name
  // Create product prefix (e.g., "Premium Career" -> "PC")
  const words = product.name.split(' ');
  const productPrefix = words.length > 1 
    ? words.map(word => word.charAt(0)).join('')
    : product.name.substring(0, 2);
  
  // Format billing cycle to sentence case
  const formattedBillingCycle = changeRequest.billingCycle.charAt(0).toUpperCase() + 
    changeRequest.billingCycle.slice(1).toLowerCase();
  
  return `${productPrefix.toUpperCase()} FY25 ${formattedBillingCycle}`;
}

/**
 * Generates a SKU name based on existing app patterns
 * Format: "Product Name FY25 Channel Billing"
 */
export function generateSkuName(product: Product, changeRequest: ConfigurationRequest): string {
  return `${product.name} FY25 ${changeRequest.salesChannel} ${changeRequest.billingCycle}`;
}

/**
 * Generates a preview SKU object showing what would be created
 */
export function generatePreviewSku(product: Product, changeRequest: ConfigurationRequest): Sku {
  const skuId = generateSkuId(product, changeRequest);
  const priceGroupId = generatePriceGroupId(changeRequest);
  
  // Create the SKU name based on product name and configuration
  const skuName = generateSkuName(product, changeRequest);
  
  // Create the price group for this configuration
  const priceGroup = {
    id: priceGroupId,
    name: generatePriceGroupName(product, changeRequest),
    status: 'Active' as const,
    validFrom: new Date().toISOString().split('T')[0], // Today's date
    pricePoints: [
      {
        id: generatePricePointId(),
        currencyCode: 'USD',
        amount: changeRequest.priceAmount,
        exchangeRate: 1.0, // USD always has exchange rate of 1.0
        validFrom: new Date().toISOString().split('T')[0], // Today's date
        pricingRule: 'NONE' as const // Default pricing rule for new price points
      }
    ]
  };
  
  // Build the preview SKU with product defaults
  const previewSku: Sku = {
    id: skuId,
    name: skuName,
    status: 'Active', // New SKUs start as Active
    salesChannel: changeRequest.salesChannel,
    billingCycle: changeRequest.billingCycle,
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
  if (changeRequest.lixKey && changeRequest.lixTreatment) {
    previewSku.lix = {
      key: changeRequest.lixKey,
      treatment: changeRequest.lixTreatment
    };
  }
  
  return previewSku;
}

/**
 * Checks if a change request already exists for a product
 */
export function checkChangeRequestConflicts(product: Product, changeRequest: ConfigurationRequest): string[] {
  const conflicts: string[] = [];
  
  // Check existing SKUs for the same channel + billing cycle combination
  const existingSku = product.skus.find(sku => 
    sku.salesChannel === changeRequest.salesChannel && 
    sku.billingCycle === changeRequest.billingCycle
  );
  
  if (existingSku) {
    conflicts.push(`A ${changeRequest.salesChannel} + ${changeRequest.billingCycle} configuration already exists (SKU: ${existingSku.id})`);
  }
  
  // Check existing change requests for the same combination
  const existingRequest = product.configurationRequests?.find(req => 
    req.salesChannel === changeRequest.salesChannel && 
    req.billingCycle === changeRequest.billingCycle &&
    req.id !== changeRequest.id && // Don't flag self when editing
    req.status !== 'Failed' // Ignore failed requests
  );
  
  if (existingRequest) {
    conflicts.push(`A ${changeRequest.salesChannel} + ${changeRequest.billingCycle} change request is already ${existingRequest.status.toLowerCase()} (Request: ${existingRequest.id})`);
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

export function checkDetailedChangeRequestConflicts(product: Product, changeRequest: ConfigurationRequest): ConflictDetail[] {
  const conflicts: ConflictDetail[] = [];
  
  // 1. Check for existing SKUs with same channel + billing cycle
  const existingSku = product.skus.find(sku => 
    sku.salesChannel === changeRequest.salesChannel && 
    sku.billingCycle === changeRequest.billingCycle
  );
  
  if (existingSku) {
    conflicts.push({
      type: 'existing_sku',
      severity: 'error',
      title: 'Duplicate Configuration Detected',
      description: `An active SKU already exists with the same sales channel (${changeRequest.salesChannel}) and billing cycle (${changeRequest.billingCycle}) combination.`,
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
  
  // 2. Check for pending change requests
  const pendingRequest = product.configurationRequests?.find(req => 
    req.salesChannel === changeRequest.salesChannel && 
    req.billingCycle === changeRequest.billingCycle &&
    req.id !== changeRequest.id &&
    ['Draft', 'Pending Review', 'In EI'].includes(req.status)
  );
  
  if (pendingRequest) {
    conflicts.push({
      type: 'pending_request',
      severity: 'error',
      title: 'Change Request in Progress',
      description: `A change request for ${changeRequest.salesChannel} + ${changeRequest.billingCycle} is already ${pendingRequest.status.toLowerCase()}.`,
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
    req.salesChannel === changeRequest.salesChannel && 
    req.billingCycle === changeRequest.billingCycle &&
    req.id !== changeRequest.id &&
    req.status === 'Failed'
  );
  
  if (recentFailedRequest) {
    conflicts.push({
      type: 'failed_request',
      severity: 'warning',
      title: 'Previous Change Request Failed',
      description: `A recent change request for ${changeRequest.salesChannel} + ${changeRequest.billingCycle} failed. This might indicate underlying issues.`,
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
    sku.salesChannel === changeRequest.salesChannel && 
    sku.billingCycle !== changeRequest.billingCycle &&
    Math.abs(sku.priceGroup.pricePoints[0]?.amount - changeRequest.priceAmount) > 100
  );
  
  if (similarSku && changeRequest.priceAmount > 0) {
    conflicts.push({
      type: 'price_mismatch',
      severity: 'warning',
      title: 'Significant Price Difference',
      description: `The price ($${changeRequest.priceAmount.toFixed(2)}) differs significantly from similar configurations in the same sales channel.`,
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
    req.salesChannel === changeRequest.salesChannel && 
    req.billingCycle === changeRequest.billingCycle &&
    req.id !== changeRequest.id &&
    req.status === 'Live' &&
    Math.abs(req.priceAmount - changeRequest.priceAmount) < 5
  );
  
  if (similarRequest) {
    conflicts.push({
      type: 'similar_config',
      severity: 'info',
      title: 'Similar Configuration Exists',
      description: `A very similar configuration already exists with nearly identical pricing ($${similarRequest.priceAmount.toFixed(2)} vs $${changeRequest.priceAmount.toFixed(2)}).`,
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
 * Validates if a change request is valid
 */
export function validateChangeRequest(product: Product, changeRequest: ConfigurationRequest): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required field validation
  if (!changeRequest.salesChannel) {
    errors.push('Sales channel is required');
  }
  
  if (!changeRequest.billingCycle) {
    errors.push('Billing cycle is required');
  }
  
  if (!changeRequest.priceAmount || changeRequest.priceAmount <= 0) {
    errors.push('Price amount must be greater than 0');
  }
  
  // Business logic validation
  if (product.billingModel !== 'Subscription' && changeRequest.billingCycle !== 'Monthly') {
    warnings.push('Non-subscription products typically use monthly billing');
  }
  
  // LIX validation
  if (changeRequest.lixKey && !changeRequest.lixTreatment) {
    errors.push('LIX treatment is required when LIX key is provided');
  }
  
  if (changeRequest.lixTreatment && !changeRequest.lixKey) {
    errors.push('LIX key is required when LIX treatment is provided');
  }
  
  // Check for conflicts
  const conflicts = checkChangeRequestConflicts(product, changeRequest);
  errors.push(...conflicts);
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
} 

/**
 * Change request submission service for handling form submission and data persistence
 */
export interface ChangeRequestSubmissionResult {
  success: boolean;
  changeRequest?: ConfigurationRequest;
  generatedSku?: any;
  generatedPriceGroup?: any;
  error?: string;
}

/**
 * Submits a change request and updates the mock data
 * In a real application, this would make API calls to the backend
 */
export function submitChangeRequest(
  product: Product, 
  changeRequestData: {
    salesChannel: string;
    billingCycle: string;
    priceAmount: number;
    priceGroupName?: string;
    lixKey?: string;
    lixTreatment?: string;
  }
): ChangeRequestSubmissionResult {
  try {
    // Generate unique change request ID
    const requestId = generateChangeRequestId();
    
    // Create the change request
    const changeRequest: ConfigurationRequest = {
      id: requestId,
      targetProductId: product.id,
      salesChannel: changeRequestData.salesChannel as any,
      billingCycle: changeRequestData.billingCycle as any,
      priceAmount: changeRequestData.priceAmount,
      priceGroupName: changeRequestData.priceGroupName,
      lixKey: changeRequestData.lixKey,
      lixTreatment: changeRequestData.lixTreatment,
      status: 'Draft' as any,
      createdBy: 'Current User',
      createdDate: new Date().toISOString()
    };

    // Validate the change request
    const validation = validateChangeRequest(product, changeRequest);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    // Check for conflicts
    const conflicts = checkDetailedChangeRequestConflicts(product, changeRequest);
    const criticalConflicts = conflicts.filter(c => c.severity === 'error');
    
    if (criticalConflicts.length > 0) {
      return {
        success: false,
        error: `Critical conflicts detected: ${criticalConflicts.map(c => c.title).join(', ')}`
      };
    }

    // Generate SKU and price group (in a real app, this would be done by the backend)
    const generatedSku = generatePreviewSku(product, changeRequest);
    const generatedPriceGroup = generatedSku.priceGroup;

    // Update change request with generated asset IDs
    changeRequest.generatedSkuId = generatedSku.id;
    changeRequest.generatedPriceGroupId = generatedPriceGroup.id;

    // For demo purposes, all change requests start as "Pending Review"
    // This allows demonstrating the workflow progression through the status buttons
    changeRequest.status = 'Pending Review' as any;
    
    // Don't automatically add SKUs to the product - this should only happen when 
    // the change request is manually progressed to "Live" status through the UI

    // Add the change request to the product's change requests
    addChangeRequestToProduct(product, changeRequest);

    return {
      success: true,
      changeRequest: changeRequest,
      // For demo purposes, don't return generated assets until configuration goes live
      generatedSku: undefined,
      generatedPriceGroup: undefined
    };

  } catch (error) {
    console.error('Error submitting change request:', error);
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
function updateProductWithNewSku(product: Product, newSku: any, changeRequest: ConfigurationRequest) {
  // Add configuration origin metadata to the SKU
  const skuWithOrigin = {
    ...newSku,
    configurationRequestId: changeRequest.id,
    createdFromConfiguration: true,
    createdBy: changeRequest.createdBy,
    createdDate: changeRequest.createdDate
  };

  // Add to product's SKUs array
  product.skus.push(skuWithOrigin);
}

/**
 * Adds a change request to the product's change requests array
 */
function addChangeRequestToProduct(product: Product, changeRequest: ConfigurationRequest) {
  if (!product.configurationRequests) {
    product.configurationRequests = [];
  }
  
  product.configurationRequests.push(changeRequest);
  
  // Sort by creation date (newest first)
  product.configurationRequests.sort((a, b) => 
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );
}

/**
 * Generates a human-readable success message for change request submission
 */
export function getSubmissionSuccessMessage(result: ChangeRequestSubmissionResult): string {
  if (!result.success || !result.changeRequest) {
    return 'Change request submission failed';
  }

  const request = result.changeRequest;
  const isExperimental = request.lixKey ? 'experimental ' : '';
  
  // For demo purposes, all change requests start as "Pending Review"
  return `${isExperimental}Change request ${request.id} has been submitted and is pending review. Use the status progression buttons to advance it through the workflow.`;
}

/**
 * Generates next steps recommendations after successful submission
 */
export function getSubmissionNextSteps(result: ChangeRequestSubmissionResult): string[] {
  if (!result.success || !result.changeRequest) {
    return [];
  }

  const request = result.changeRequest;
  const steps: string[] = [];

  // For demo purposes, all change requests start as "Pending Review"
  steps.push('View the change request details');
  steps.push('Use the "Approve & Move to Staging" button to progress the workflow');
  steps.push('After staging, use "Deploy to Production" to make it live');
  steps.push('Monitor the change request through the complete workflow');

  if (request.lixKey) {
    steps.push('Set up tracking for the experimental configuration');
    steps.push('Monitor experiment metrics and performance');
  }

  return steps;
} 

/**
 * Updates the status of a change request in the mock data
 * This is a simple UI prototype function - in a real app this would be an API call
 */
export function updateChangeRequestStatus(
  productId: string, 
  requestId: string, 
  newStatus: 'Pending Review' | 'In EI' | 'Live' | 'Failed'
): boolean {
  // Find the product
  const product = mockProducts.find((p: Product) => p.id === productId);
  if (!product || !product.configurationRequests) {
    return false;
  }
  
  // Find the change request
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
      
      console.log(`Change request ${requestId} went live - SKU ${generatedSku.id} added to product`);
    } catch (error) {
      console.error('Error generating SKU for live change request:', error);
      return false;
    }
  }
  
  // Update the status
  request.status = newStatus;
  
  console.log(`Change request ${requestId} status updated to: ${newStatus}`);
  return true;
}

/**
 * Gets the next possible status transitions for a change request
 * This defines the allowed workflow progression
 */
export function getNextStatusOptions(currentStatus: 'Pending Review' | 'In EI' | 'Live' | 'Failed'): Array<{
  status: 'Pending Review' | 'In EI' | 'Live' | 'Failed';
  label: string;
  description: string;
  buttonType: 'primary' | 'default' | 'danger';
  icon: string;
}> {
  switch (currentStatus) {
    case 'Pending Review':
      return [
        {
          status: 'In EI',
          label: 'Approve & Move to EI',
          description: 'Approve this change request and deploy to EI environment',
          buttonType: 'primary',
          icon: 'eye'
        },
        {
          status: 'Failed',
          label: 'Reject Request',
          description: 'Reject this change request',
          buttonType: 'danger',
          icon: 'x-circle'
        }
      ];
    
    case 'In EI':
      return [
        {
          status: 'Live',
          label: 'Deploy to Production',
          description: 'Deploy this change request to production environment',
          buttonType: 'primary',
          icon: 'check-circle'
        },
        {
          status: 'Failed',
          label: 'Mark as Failed',
          description: 'Mark this change request as failed',
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
          description: 'Retry this change request',
          buttonType: 'default',
          icon: 'refresh-cw'
        }
      ];
    
    default:
      return [];
  }
} 