// This file will contain all the TypeScript type definitions for our data structures.
// Defining these shapes helps us catch errors and ensures consistency across the app.

export type Status = 'Active' | 'Legacy' | 'Retired';

export type LOB = 'LTS' | 'LMS' | 'LSS' | 'Premium';

export type Region = 'NAMER' | 'EMEA' | 'APAC' | 'LATAM' | 'OTHER';

export type SalesChannel = 'Desktop' | 'Field' | 'Mobile';

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

export type PricePoint = {
  currencyCode: string;
  amount: number;
};

export type Price = {
  startDate?: string;
  endDate?: string;
  pricePoints: PricePoint[];
};

export type Sku = {
  id: string;
  status: Status;
  region: Region;
  salesChannel: SalesChannel;
  billingCycle: BillingCycle;
  price: Price;
  revenueRecognition: RevenueRecognition;
  switcherLogic: SwitcherPath[];
  refundPolicy: RefundPolicy;
  // Optional overrides for Product-level defaults
  taxClass?: string;
  paymentFailureFreeToPaidGracePeriod?: GracePeriod;
  paymentFailurePaidToPaidGracePeriod?: GracePeriod;
  seatMin?: number;
  seatMax?: number;
  digitalGoods?: string[];
  tags?: Tag[];
  lix?: {
    key: string;
    treatment: string;
  };
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  lob: LOB;
  category: string;
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
  digitalGoods: string[];
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
}; 