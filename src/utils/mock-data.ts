// This file will contain all the mock data for the PCC prototype.
// It will serve as our single source of truth for products, SKUs, etc. 

import type { Product, PriceGroup, ConfigurationRequest } from './types';
import { TEAM_MEMBERS } from './users';

// Define the folder structure independently of products
// This allows us to show empty folders in the sidebar
export const folderStructure = {
  "Premium": [
    "Premium Core Products",
    "Premium Multiseat Products", 
    "Premium Company Page",
    "Premium Small Business",
    "Premium Entitlements"
  ],
  "LTS": [
    "Recruiter",
    "Learning",
    "Jobs",
    "Career Page",
    "API Products",
    "Glint",
    "Talent Insights"
  ],
  "LSS": [
    "All LSS Products"
  ],
  "LMS": [
    "All LMS Products"
  ],
  "Other": [
    "All Other Products"
  ]
};

export const mockConfigurationRequests: ConfigurationRequest[] = [];

export const mockProducts: Product[] = [
  {
    id: '5095285',
    name: 'Premium Career',
    description: 'Get exclusive access to insights, job search tools, and direct messaging to reach the right people to grow your career.',
    lob: 'Premium',
    folder: 'Premium Core Products',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/premium/career/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: [
      'Unlimited access to LinkedIn Learning',
      'Private browsing',
      'Applicant insights',
      'Direct messaging',
      'Who viewed your profile',
      'Who\'s viewed your profile insights availability (365)',
      'InMail credits (5)',
      'AI tools',
      'Top choice job',
    ],
    tags: [{ type: 'Customer Type', value: 'Individual member' }, { type: 'Sales Top of Funnel', value: 'Premium Chooser' }],
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/premium/career',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
  },
  {
    id: '5083684',
    name: 'Recruiter Lite',
    description: 'Find the right talent faster. Search for qualified candidates with 20+ filters, 30 InMail messages per month, saved search alerts, daily candidate recommendations, among other features.',
    lob: 'LTS',
    folder: 'Recruiter',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/talent/recruiter-lite/',
    seatType: 'Multi-seat fixed',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 50,
    features: ['Candidate Search', 'InMail Credits', 'Basic Analytics', 'Team Collaboration'],
    tags: [{ type: 'Customer Type', value: 'Enterprise customer' }, { type: 'Sales Top of Funnel', value: 'Premium Chooser' }],
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: false,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/talent/recruiter-lite',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
  }
]; 

// Add price groups for Premium Career
const pcFy25Monthly: PriceGroup = {
  id: "123456", // Fixed ID instead of random
  name: "PC_FY25_MONTHLY",
  status: 'Active',
  validFrom: "2025-05-01",
  pricePoints: [
    { id: "6123001", currencyCode: "USD", amount: 39.99, exchangeRate: 1.0, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123002", currencyCode: "EUR", amount: 29.99, exchangeRate: 0.85, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123003", currencyCode: "CAD", amount: 49.99, exchangeRate: 1.35, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123004", currencyCode: "AUD", amount: 54.99, exchangeRate: 1.45, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123005", currencyCode: "CHF", amount: 39.99, exchangeRate: 0.90, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123006", currencyCode: "DKK", amount: 189.99, exchangeRate: 6.85, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123007", currencyCode: "NOK", amount: 274.99, exchangeRate: 9.90, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123008", currencyCode: "SEK", amount: 349.99, exchangeRate: 12.60, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123009", currencyCode: "GBP", amount: 29.99, exchangeRate: 0.75, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123010", currencyCode: "HKD", amount: 274.99, exchangeRate: 7.85, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123011", currencyCode: "SGD", amount: 49.99, exchangeRate: 1.35, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123012", currencyCode: "BRL", amount: 69.99, exchangeRate: 1.85, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123013", currencyCode: "NZD", amount: 39.99, exchangeRate: 1.60, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123014", currencyCode: "JPY", amount: 3999.00, exchangeRate: 110.0, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123015", currencyCode: "INR", amount: 999.00, exchangeRate: 83.0, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123016", currencyCode: "ZAR", amount: 249.00, exchangeRate: 18.5, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123017", currencyCode: "AED", amount: 94.99, exchangeRate: 3.67, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123018", currencyCode: "PLN", amount: 89.99, exchangeRate: 4.15, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123019", currencyCode: "SAR", amount: 99.99, exchangeRate: 3.75, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123020", currencyCode: "MXN", amount: 599.99, exchangeRate: 17.5, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123021", currencyCode: "EGP", amount: 499.99, exchangeRate: 31.0, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123022", currencyCode: "TRY", amount: 109.99, exchangeRate: 31.5, validFrom: "2025-05-01", pricingRule: "NONE" },
    // Long tail currencies
    { id: "6123023", currencyCode: "ARS", amount: 1599.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123024", currencyCode: "BDT", amount: 4399.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123025", currencyCode: "BGN", amount: 69.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123026", currencyCode: "CLP", amount: 35999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123027", currencyCode: "COP", amount: 159999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123028", currencyCode: "CRC", amount: 21999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123029", currencyCode: "CZK", amount: 899.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123030", currencyCode: "GTQ", amount: 309.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123031", currencyCode: "HNL", amount: 989.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123032", currencyCode: "HUF", amount: 13999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123033", currencyCode: "IDR", amount: 629999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123034", currencyCode: "ILS", amount: 149.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123035", currencyCode: "JOD", amount: 28.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123036", currencyCode: "KES", amount: 5199.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123037", currencyCode: "KRW", amount: 52999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123038", currencyCode: "KWD", amount: 12.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123039", currencyCode: "LBP", amount: 60299.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6123040", currencyCode: "LKR", amount: 11999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    {
      id: "6123041", currencyCode: "MAD", amount: 399.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123042", currencyCode: "MYR", amount: 179.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123043", currencyCode: "NGN", amount: 64999.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123044", currencyCode: "PEN", amount: 149.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123045", currencyCode: "PHP", amount: 2299.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123046", currencyCode: "PKR", amount: 11199.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123047", currencyCode: "QAR", amount: 145.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123048", currencyCode: "RON", amount: 179.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123049", currencyCode: "RSD", amount: 4199.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123050", currencyCode: "THB", amount: 1399.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123051", currencyCode: "TWD", amount: 1299.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123052", currencyCode: "TZS", amount: 99999.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123053", currencyCode: "UAH", amount: 1649.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123054", currencyCode: "UYU", amount: 1579.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123055", currencyCode: "VND", amount: 999999.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123056", currencyCode: "XOF", amount: 23999.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
  ]
};

const pcFy25Annual: PriceGroup = {
  id: "123457", // Fixed ID instead of random
  name: "PC_FY25_ANNUAL",
  status: 'Active',
  validFrom: "2025-05-01",
  pricePoints: [
    {
      id: "6123101", currencyCode: "USD", amount: 239.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123102", currencyCode: "EUR", amount: 179.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123103", currencyCode: "CAD", amount: 299.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123104", currencyCode: "AUD", amount: 323.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123105", currencyCode: "CHF", amount: 239.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123106", currencyCode: "DKK", amount: 1139.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123107", currencyCode: "NOK", amount: 1679.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123108", currencyCode: "SEK", amount: 2099.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123109", currencyCode: "GBP", amount: 179.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123110", currencyCode: "HKD", amount: 1679.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123111", currencyCode: "SGD", amount: 299.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123112", currencyCode: "BRL", amount: 419.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123113", currencyCode: "NZD", amount: 239.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123114", currencyCode: "JPY", amount: 23988.00, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123115", currencyCode: "INR", amount: 5988.00, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123116", currencyCode: "ZAR", amount: 1499.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123117", currencyCode: "AED", amount: 575.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123118", currencyCode: "PLN", amount: 539.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123119", currencyCode: "SAR", amount: 599.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123120", currencyCode: "MXN", amount: 3599.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123121", currencyCode: "EGP", amount: 2999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123122", currencyCode: "TRY", amount: 659.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    // Long tail currencies
    {
      id: "6123123", currencyCode: "ARS", amount: 9599.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123124", currencyCode: "BDT", amount: 26399.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123125", currencyCode: "BGN", amount: 419.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123126", currencyCode: "CLP", amount: 215999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123127", currencyCode: "COP", amount: 959999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123128", currencyCode: "CRC", amount: 131999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123129", currencyCode: "CZK", amount: 5399.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123130", currencyCode: "GTQ", amount: 1859.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123131", currencyCode: "HNL", amount: 5939.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123132", currencyCode: "HUF", amount: 83999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123133", currencyCode: "IDR", amount: 3779999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123134", currencyCode: "ILS", amount: 899.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123135", currencyCode: "JOD", amount: 173.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123136", currencyCode: "KES", amount: 31199.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123137", currencyCode: "KRW", amount: 317999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123138", currencyCode: "KWD", amount: 77.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123139", currencyCode: "LBP", amount: 361799.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123140", currencyCode: "LKR", amount: 71999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123141", currencyCode: "MAD", amount: 2399.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123142", currencyCode: "MYR", amount: 1079.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123143", currencyCode: "NGN", amount: 389999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123144", currencyCode: "PEN", amount: 899.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123145", currencyCode: "PHP", amount: 13799.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123146", currencyCode: "PKR", amount: 67199.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123147", currencyCode: "QAR", amount: 875.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123148", currencyCode: "RON", amount: 1079.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123149", currencyCode: "RSD", amount: 25199.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123150", currencyCode: "THB", amount: 8399.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123151", currencyCode: "TWD", amount: 7799.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123152", currencyCode: "TZS", amount: 599999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123153", currencyCode: "UAH", amount: 9899.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123154", currencyCode: "UYU", amount: 9479.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123155", currencyCode: "VND", amount: 5999999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123156", currencyCode: "XOF", amount: 143999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
  ]
};

// Add SKUs to Premium Career product
const premiumCareerProduct = mockProducts.find(p => p.id === '5095285');
if (premiumCareerProduct) {
  premiumCareerProduct.skus = [
    {
      id: "8735294", // Fixed ID instead of random
      name: "Premium Career FY25 Desktop Monthly",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      priceGroup: pcFy25Monthly,
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2024-02-15T10:00:00Z"
    },
    {
      id: "8846157", // Fixed ID instead of random
      name: "Premium Career FY25 Desktop Annual",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Annual",
      priceGroup: pcFy25Annual,
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: TEAM_MEMBERS.JORDAN_BADER.fullName,
      createdDate: "2024-02-15T10:00:00Z"
    },

  ];
}

// Add SKUs to Recruiter Lite product with slab pricing examples
const recruiterLiteProduct = mockProducts.find(p => p.id === '5083684');
if (recruiterLiteProduct) {
  recruiterLiteProduct.skus = [
    {
      id: "8435001",
      name: "Recruiter Lite FY25 Desktop Monthly (1-2 seats)",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      priceGroup: {
        id: "112007",
        name: "RL_FY25_MONTHLY_SLAB",
        status: "Active",
        validFrom: "2025-01-01",
        pricePoints: [
          { 
            id: "6485069", 
            currencyCode: "USD", 
            amount: 169.99, 
            validFrom: "2025-01-01",
            pricingRule: "SLAB",
            minQuantity: 1,
            maxQuantity: 2,
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6485079", 
            currencyCode: "USD", 
            amount: 269.99, 
            validFrom: "2025-01-01",
            pricingRule: "SLAB",
            minQuantity: 2,
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6485169", 
            currencyCode: "EUR", 
            amount: 140.49, 
            validFrom: "2025-01-01",
            pricingRule: "SLAB",
            minQuantity: 1,
            maxQuantity: 2,
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6485179", 
            currencyCode: "EUR", 
            amount: 224.78, 
            validFrom: "2025-01-01",
            pricingRule: "SLAB",
            minQuantity: 2,
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: TEAM_MEMBERS.CHARLES_HU.fullName,
      createdDate: "2024-02-15T10:00:00Z"
    },
    {
      id: "8435002",
      name: "Recruiter Lite FY25 Desktop Annual (1-2 seats)",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Annual",
      priceGroup: {
        id: "115003",
        name: "RL_FY25_ANNUAL_SLAB", 
        status: "Active",
        validFrom: "2025-01-01",
        pricePoints: [
          { 
            id: "6485089", 
            currencyCode: "USD", 
            amount: 1679.88, 
            validFrom: "2025-01-01",
            pricingRule: "SLAB",
            minQuantity: 1,
            maxQuantity: 2,
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6485099", 
            currencyCode: "USD", 
            amount: 2599.88, 
            validFrom: "2025-01-01",
            pricingRule: "SLAB",
            minQuantity: 2,
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: TEAM_MEMBERS.JORDAN_BADER.fullName,
      createdDate: "2024-02-15T10:00:00Z"
    },
    {
      id: "8435003",
      name: "Recruiter Lite FY25 Desktop Monthly (Simple)",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      priceGroup: {
        id: "116001",
        name: "RL_FY25_MONTHLY_SIMPLE",
        status: "Active",
        validFrom: "2025-01-01",
        pricePoints: [
          { 
            id: "6336603", 
            currencyCode: "USD", 
            amount: 169.99, 
            validFrom: "2025-01-01",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: TEAM_MEMBERS.TANMAY_KHEMKA.fullName,
      createdDate: "2024-02-15T10:00:00Z"
    },
    {
      id: "8435004",
      name: "Recruiter Lite FY25 Desktop Annual (Simple)",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Annual",
      priceGroup: {
        id: "116002",
        name: "RL_FY25_ANNUAL_SIMPLE",
        status: "Active",
        validFrom: "2025-01-01",
        pricePoints: [
          { 
            id: "6336613", 
            currencyCode: "USD", 
            amount: 1679.88, 
            validFrom: "2025-01-01",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2024-02-15T10:00:00Z"
    }
  ];
} 