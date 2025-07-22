// This file will contain all the TypeScript type definitions for our data structures.
// Defining these shapes helps us catch errors and ensures consistency across the app.

export type Status = 'Active' | 'Legacy' | 'Retired';

export type LOB = 'LTS' | 'LMS' | 'LSS' | 'Premium' | 'Other';

export type SalesChannel = 'Desktop' | 'Field' | 'iOS' | 'GPB';

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

// --- Smart Tag Definitions ---
export type SalesFunnelValue = 'Premium Chooser' | 'Solution Builder' | 'Admin Center' | 'Web CTA' | 'None';
export type CustomerTypeValue = 'Individual member' | 'Enterprise customer';
export type ContractTypeValue = 'Evergreen' | 'Fixed time';

export type SalesFunnelTag = {
  type: 'Sales Top of Funnel';
  value: SalesFunnelValue;
};

export type CustomerTypeTag = {
  type: 'Customer Type';
  value: CustomerTypeValue;
};

export type ContractTypeTag = {
  type: 'Contract Type';
  value: ContractTypeValue;
};

// The main Tag type is a union of all possible specific tags
export type Tag = SalesFunnelTag | CustomerTypeTag | ContractTypeTag;
// --- End Smart Tag Definitions ---

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
  startDate: string; // Mandatory effective start date
  endDate?: string; // Optional effective end date
};

export type PriceGroup = {
  id?: string;
  name: string;
  status?: Status;
  startDate?: string;
  endDate?: string;
  pricePoints: PricePoint[];
};

export type ChangeRequestStatus = 'Pending Review' | 'In EI' | 'Live' | 'Failed';

export type ChangeRequest = {
  id: string;
  targetProductId: string;
  salesChannel: SalesChannel;
  billingCycle: BillingCycle;
  priceAmount: number;
  priceGroupName?: string;
  lixKey?: string;
  lixTreatment?: string;
  status: ChangeRequestStatus;
  createdBy: string;
  createdDate: string;
  generatedSkuId?: string;
  generatedPriceGroupId?: string;
};

// Legacy type alias for backward compatibility during migration
export type ConfigurationRequest = ChangeRequest;

export type Sku = {
  id: string;
  name: string;
  status: Status;
  salesChannel: SalesChannel;
  billingCycle: BillingCycle;
  priceGroup: PriceGroup;
  revenueRecognition: RevenueRecognition;
  switcherLogic: SwitcherPath[];
  refundPolicy: RefundPolicy;
  // Optional overrides for Product-level defaults
  taxClass?: string;
  paymentFailureFreeToPaidGracePeriod?: GracePeriod;
  paymentFailurePaidToPaidGracePeriod?: GracePeriod;
  seatMin?: number;
  seatMax?: number;
  features?: string[];
  tags?: Tag[];
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
  tags?: Tag[];
  changeRequests?: ChangeRequest[];
  // Legacy field for backward compatibility during migration
  configurationRequests?: ConfigurationRequest[];
}; 