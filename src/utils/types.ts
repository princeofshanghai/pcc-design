// This file will contain all the TypeScript type definitions for our data structures.
// Defining these shapes helps us catch errors and ensures consistency across the app.

export type Status = 'Active' | 'Inactive' | 'Archived';

export type LOB = 'LTS' | 'LMS' | 'LSS' | 'Premium' | 'Other';

export type SalesChannel = 'Desktop' | 'Field' | 'iOS' | 'GPB';

export type AttributeDomain = 'CONTRACTS' | 'QUOTING' | 'PRODUCT_CATALOG';

export type AttributeType = 'boolean' | 'set' | 'enum' | 'string' | 'number';

export type Attribute = {
  id: string;
  name: string;
  domain: AttributeDomain;
  type: AttributeType;
  defaultValue?: string | boolean | null;
  description: string;
  acceptableValues?: string[];
};

export type BillingCycle = 'Monthly' | 'Quarterly' | 'Annual';

export type BillingModel = 'Subscription' | 'One-time' | 'Usage';

export type SeatType = 'Single seat' | 'Multi-seat fixed' | 'Multi-seat floating' | 'Multi-seat enterprise';

export type RevenueRecognition = 'Accrual' | 'On invoicing' | 'On payment receipt';

export type GracePeriod = 0 | 7 | 14 | 30;

export type SwitcherPath = {
  type: 'Upgrade' | 'Downgrade';
  targetProductId: string;
};

export type RefundPolicyId = 'YES_MANUAL' | 'YES_TAX_ONLY' | 'YES_AUTOMATED' | 'NO_CREDIT';

export type RefundPolicy = {
  id: RefundPolicyId;
  description: string;
};

// Price editing context interface - used across pricing components
export interface PriceEditingContext {
  channel: string | null;
  billingCycle: string | null;
  priceGroupAction: string | null; // 'create' or 'update'
  existingPriceGroup: any | null; // Selected existing price group for updates
  lixKey?: string | null;
  lixTreatment?: string | null;
  clonePriceGroup?: any | null; // Selected price group for cloning
  existingSkusForContext?: any[]; // Existing SKUs matching the current context
}

// Common table props interface - used across table components
export interface CommonTableProps {
  visibleColumns?: ColumnVisibility;
  columnOrder?: ColumnOrder;
}

// Grouped table props interface - used across grouped table components  
export interface GroupedTableProps extends CommonTableProps {
  // Additional props for grouped tables can be added here
}

// Column configuration for table visibility controls
export type ColumnConfig = {
  key: string;           // Unique identifier for the column
  label: string;         // Display name in the Show Columns section
  required: boolean;     // Whether this column can be hidden (false = toggleable)
  order?: number;        // Optional: display order for the column
};

export type ColumnVisibility = Record<string, boolean>; // key -> visible state

export type ColumnOrder = string[]; // Array of column keys in display order

export type PricePoint = {
  id?: string; // Optional for now during migration
  currencyCode: string;
  amount: number;
  exchangeRate?: number; // Rate to convert to USD (1 USD = exchangeRate * currency)
  validFrom: string; // Required validity start date
  validUntil?: string; // Optional validity end date
  status?: 'Active' | 'Expired'; // Status from your data (A/E converted to Active/Expired)
  // Pricing rule fields
  pricingRule: 'NONE' | 'SLAB' | 'RANGE' | 'BLOCK' | 'SPREADSHEET';
  minQuantity?: number;
  maxQuantity?: number;
  priceType?: 'BASE_AMOUNT' | 'BASE_PRICER' | 'ADJUSTMENT_AMOUNT' | 'ADJUSTMENT_PERCENT' | string; // Price type from data
  pricingTier?: string; // Pricing tier identifier (e.g., 'CORP TIER 1', 'STFF', etc.)
  isTaxInclusive?: boolean;
};

export type PriceGroup = {
  id: string;
  name?: string; // Made optional
  status: Status;
  pricePoints: PricePoint[];
};



export type Sku = {
  id: string;
  status: Status;
  salesChannel: SalesChannel;
  billingCycle: BillingCycle;
  priceGroup: PriceGroup;
  revenueRecognition: RevenueRecognition;
  switcherLogic: SwitcherPath[];
  refundPolicy: RefundPolicy;
  // Customer data
  activeContracts?: number;
  subscriptions?: number;
  // Optional overrides for Product-level defaults
  taxClass?: string;
  paymentFailureFreeToPaidGracePeriod?: GracePeriod;
  paymentFailurePaidToPaidGracePeriod?: GracePeriod;
  seatMin?: number;
  seatMax?: number;
  seatType?: string;
  features?: string[];
  isVisibleOnRenewalEmails?: boolean;
  lix?: {
    key: string;
    treatment: string;
  };
  // Origin information for audit trail
  origin?: 'manual' | 'configuration_request';
  createdBy?: string;
  createdDate?: string;
  configurationRequestId?: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  lob: LOB;
  folder: string;
  status: Status;
  billingModel: BillingModel;
  skus: Sku[];
  // Customer data
  totalActiveContracts?: number;
  totalSubscriptions?: number;
  // Product-level attributes
  postPurchaseLandingUrl: string;
  seatType: SeatType;
  isBundle: boolean;
  // Shared attributes (defaults for SKUs)
  taxClass: string;
  paymentFailureFreeToPaidGracePeriod: GracePeriod;
  paymentFailurePaidToPaidGracePeriod: GracePeriod;
  seatMin: number;
  seatMax: number;
  features: string[];
  // Legacy attributes
  code?: string;
  family?: string;
  // Optional miscellaneous attributes
  isVisibleOnBillingEmails?: boolean;
  isVisibleOnRenewalEmails?: boolean;
  isCancellable?: boolean;
  isEligibleForAmendment?: boolean;
  isEligibleForRoboRefund?: boolean;
  isPrimaryProductForPricing?: boolean;
  isPrimaryForGracePeriod?: boolean;
  isPrimaryForContractAggregation?: boolean;
  confirmationInfoCtaText?: string;
  confirmationInfoSubTitle?: string;
  termsOfServiceUrl?: string;
  howToCancelUrl?: string;
  refundPolicyUrl?: string;
  ctaLink?: string;
  productUrl?: string;
  helpCenterUrl?: string;
  ctaUrl?: string;
  confirmationCtaUrl?: string;
  contactUsUrl?: string;
  accountLink?: string;
};

// GTM Motion types for price editing workflow
export type GTMMotionStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Activating in EI'
  | 'Ready for Approvals'
  | 'Review in Progress'
  | 'Approvals Completed'
  | 'Scheduled for Activation'
  | 'Activating in Prod'
  | 'Completed'
  | 'Cancelled';

// Individual GTM item status
export type GTMItemStatus = 'Draft' | 'Pending approvals' | 'Approved' | 'Ready for deployment';

// GTM item types
export type GTMItemType = 'Price' | 'Product name' | 'Product description' | 'Feature' | 'Archive';

// Approval status for individual approvers
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

// Extended approval status for UI display (includes pre-request state)
export type ExtendedApprovalStatus = ApprovalStatus | 'Not requested';

// Approver teams
export type ApproverTeam = 'Pricing' | 'Legal' | 'Tax' | 'StratFin' | 'Revenue' | 'Product';

// Individual approval requirement
export type ApprovalRequirement = {
  team: ApproverTeam;
  status: ApprovalStatus;
  approvedBy?: string;
  approvedDate?: string; // ISO date string
  comments?: string;
};

// Individual GTM item
export type GTMItem = {
  id: string;
  type: GTMItemType;
  productId: string;
  productName: string;
  details: string; // Short description like "New price", "Product name change"
  status: GTMItemStatus;
  approvalRequirements: ApprovalRequirement[];
  createdBy: string;
  createdDate: string; // ISO date string
  // For price items, include the price change data
  priceChange?: PriceChange;
  // For non-price items, include before/after values
  beforeValue?: string;
  afterValue?: string;
};

export type GTMMotion = {
  id: string;
  name: string;
  description: string;
  activationDate: string; // ISO date string
  status: GTMMotionStatus;
  createdBy: string;
  createdDate: string; // ISO date string
  updatedDate?: string; // ISO date string
  items: GTMItem[];
};

// Price editing context for step 1 of the editing flow
export type PriceEditContext = {
  productId: string;
  // Context selections - can be new or existing
  channel: SalesChannel | string; // Allow new channels as string
  billingCycle: BillingCycle | string; // Allow new billing cycles as string
  validityPeriod: {
    validFrom: string; // ISO date string
    validUntil?: string; // ISO date string, optional for ongoing validity
  };
  // Existing selections only
  seatRange: {
    minQuantity: number;
    maxQuantity?: number; // undefined = unlimited
  };
  pricingTier: string;
  // Optional LIX experiment
  lixExperiment?: {
    key: string;
    treatment: string;
  };
  // Added for GTM workflow
  selectedPriceGroup?: {
    id: string;
    name: string;
  };
  priceGroupAction?: 'create' | 'update';
};

// Individual price change tracking
export type PriceChange = {
  id: string;
  productId: string;
  context: PriceEditContext;
  currencyChanges: CurrencyPriceChange[];
  impactType: 'CREATE_NEW_SKU' | 'UPDATE_EXISTING_SKU';
  targetSkuId?: string; // Present for updates, undefined for new SKU creation
  createdBy: string;
  createdDate: string; // ISO date string
  status: 'Draft' | 'Submitted' | 'Applied';
};

// Individual currency price change
export type CurrencyPriceChange = {
  currencyCode: string;
  currentAmount: number;
  newAmount: number;
  changeAmount: number; // newAmount - currentAmount
  changePercentage: number; // (changeAmount / currentAmount) * 100
}; 