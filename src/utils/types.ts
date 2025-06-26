// This file will contain all the TypeScript type definitions for our data structures.
// Defining these shapes helps us catch errors and ensures consistency across the app.

export type Status = 'Active' | 'Legacy' | 'Retired';

export type LOB = 'LTS' | 'LMS' | 'LSS' | 'Premium';

export type Region = 'NAMER' | 'EMEA' | 'APAC' | 'LATAM' | 'OTHER';

export type SalesChannel = 'Desktop' | 'Field' | 'Mobile';

export type BillingCycle = 'Monthly' | 'Quarterly' | 'Annual';

export type ProductType = 'Subscription' | 'One-time' | 'Usage';

export type PricePoint = {
  currencyCode: string;
  amount: number;
};

export type Price = {
  status: Status;
  startDate?: string; // Optional for prices that have no end date
  endDate?: string; // Optional for prices that have no end date
  pricePoints: PricePoint[];
};

export type Sku = {
  id: string;
  status: Status;
  region: Region;
  salesChannel: SalesChannel;
  billingCycle: BillingCycle;
  billingFrequency: string; // e.g., "1 Month", "12 Months"
  digitalGoods: string[];
  taxClass: string;
  prices: Price[];
};

export type Product = {
  id: string;
  name: string;
  description?: string; // Optional property
  lob: LOB;
  category: string;
  status: Status;
  productType: ProductType;
  skus: Sku[];
}; 