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

// iOS Monthly price group (same price points as Desktop Monthly)
const pcFy25iOSMonthly: PriceGroup = {
  id: "123458",
  name: "PC_FY25_IOS_MONTHLY",
  status: 'Active',
  validFrom: "2025-05-01",
  pricePoints: [
    { id: "6124001", currencyCode: "USD", amount: 39.99, exchangeRate: 1.0, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124002", currencyCode: "EUR", amount: 29.99, exchangeRate: 0.85, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124003", currencyCode: "CAD", amount: 49.99, exchangeRate: 1.35, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124004", currencyCode: "AUD", amount: 54.99, exchangeRate: 1.45, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124005", currencyCode: "CHF", amount: 39.99, exchangeRate: 0.90, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124006", currencyCode: "DKK", amount: 189.99, exchangeRate: 6.85, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124007", currencyCode: "NOK", amount: 274.99, exchangeRate: 9.90, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124008", currencyCode: "SEK", amount: 349.99, exchangeRate: 12.60, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124009", currencyCode: "GBP", amount: 29.99, exchangeRate: 0.75, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124010", currencyCode: "HKD", amount: 274.99, exchangeRate: 7.85, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124011", currencyCode: "SGD", amount: 49.99, exchangeRate: 1.35, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124012", currencyCode: "BRL", amount: 69.99, exchangeRate: 1.85, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124013", currencyCode: "NZD", amount: 39.99, exchangeRate: 1.60, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124014", currencyCode: "JPY", amount: 3999.00, exchangeRate: 110.0, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124015", currencyCode: "INR", amount: 999.00, exchangeRate: 83.0, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124016", currencyCode: "ZAR", amount: 249.00, exchangeRate: 18.5, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124017", currencyCode: "AED", amount: 94.99, exchangeRate: 3.67, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124018", currencyCode: "PLN", amount: 89.99, exchangeRate: 4.15, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124019", currencyCode: "SAR", amount: 99.99, exchangeRate: 3.75, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124020", currencyCode: "MXN", amount: 599.99, exchangeRate: 17.5, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124021", currencyCode: "EGP", amount: 499.99, exchangeRate: 31.0, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124022", currencyCode: "TRY", amount: 109.99, exchangeRate: 31.5, validFrom: "2025-05-01", pricingRule: "NONE" },
    // Long tail currencies
    { id: "6124023", currencyCode: "ARS", amount: 1599.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124024", currencyCode: "BDT", amount: 4399.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124025", currencyCode: "BGN", amount: 69.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124026", currencyCode: "CLP", amount: 35999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124027", currencyCode: "COP", amount: 159999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124028", currencyCode: "CRC", amount: 21999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124029", currencyCode: "CZK", amount: 899.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124030", currencyCode: "GTQ", amount: 309.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124031", currencyCode: "HNL", amount: 989.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124032", currencyCode: "HUF", amount: 13999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124033", currencyCode: "IDR", amount: 629999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124034", currencyCode: "ILS", amount: 149.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124035", currencyCode: "JOD", amount: 28.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124036", currencyCode: "KES", amount: 5199.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124037", currencyCode: "KRW", amount: 52999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124038", currencyCode: "KWD", amount: 12.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124039", currencyCode: "LBP", amount: 60299.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6124040", currencyCode: "LKR", amount: 11999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    {
      id: "6124041", currencyCode: "MAD", amount: 399.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124042", currencyCode: "MYR", amount: 179.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124043", currencyCode: "NGN", amount: 64999.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124044", currencyCode: "PEN", amount: 149.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124045", currencyCode: "PHP", amount: 2299.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124046", currencyCode: "PKR", amount: 11199.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124047", currencyCode: "QAR", amount: 145.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124048", currencyCode: "RON", amount: 179.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124049", currencyCode: "RSD", amount: 4199.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124050", currencyCode: "THB", amount: 1399.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124051", currencyCode: "TWD", amount: 1299.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124052", currencyCode: "TZS", amount: 99999.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124053", currencyCode: "UAH", amount: 1649.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124054", currencyCode: "UYU", amount: 1579.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124055", currencyCode: "VND", amount: 999999.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6124056", currencyCode: "XOF", amount: 23999.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
  ]
};

// iOS Annual price group (same price points as Desktop Annual)
const pcFy25iOSAnnual: PriceGroup = {
  id: "123459",
  name: "PC_FY25_IOS_ANNUAL",
  status: 'Active',
  validFrom: "2025-05-01",
  pricePoints: [
    {
      id: "6125001", currencyCode: "USD", amount: 239.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125002", currencyCode: "EUR", amount: 179.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125003", currencyCode: "CAD", amount: 299.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125004", currencyCode: "AUD", amount: 323.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125005", currencyCode: "CHF", amount: 239.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125006", currencyCode: "DKK", amount: 1139.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125007", currencyCode: "NOK", amount: 1679.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125008", currencyCode: "SEK", amount: 2099.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125009", currencyCode: "GBP", amount: 179.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125010", currencyCode: "HKD", amount: 1679.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125011", currencyCode: "SGD", amount: 299.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125012", currencyCode: "BRL", amount: 419.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125013", currencyCode: "NZD", amount: 239.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125014", currencyCode: "JPY", amount: 23988.00, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125015", currencyCode: "INR", amount: 5988.00, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125016", currencyCode: "ZAR", amount: 1499.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125017", currencyCode: "AED", amount: 575.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125018", currencyCode: "PLN", amount: 539.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125019", currencyCode: "SAR", amount: 599.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125020", currencyCode: "MXN", amount: 3599.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125021", currencyCode: "EGP", amount: 2999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125022", currencyCode: "TRY", amount: 659.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    // Long tail currencies
    {
      id: "6125023", currencyCode: "ARS", amount: 9599.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125024", currencyCode: "BDT", amount: 26399.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125025", currencyCode: "BGN", amount: 419.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125026", currencyCode: "CLP", amount: 215999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125027", currencyCode: "COP", amount: 959999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125028", currencyCode: "CRC", amount: 131999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125029", currencyCode: "CZK", amount: 5399.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125030", currencyCode: "GTQ", amount: 1859.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125031", currencyCode: "HNL", amount: 5939.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125032", currencyCode: "HUF", amount: 83999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125033", currencyCode: "IDR", amount: 3779999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125034", currencyCode: "ILS", amount: 899.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125035", currencyCode: "JOD", amount: 173.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125036", currencyCode: "KES", amount: 31199.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125037", currencyCode: "KRW", amount: 317999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125038", currencyCode: "KWD", amount: 77.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125039", currencyCode: "LBP", amount: 361799.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125040", currencyCode: "LKR", amount: 71999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125041", currencyCode: "MAD", amount: 2399.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125042", currencyCode: "MYR", amount: 1079.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125043", currencyCode: "NGN", amount: 389999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125044", currencyCode: "PEN", amount: 899.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125045", currencyCode: "PHP", amount: 13799.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125046", currencyCode: "PKR", amount: 67199.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125047", currencyCode: "QAR", amount: 875.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125048", currencyCode: "RON", amount: 1079.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125049", currencyCode: "RSD", amount: 25199.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125050", currencyCode: "THB", amount: 8399.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125051", currencyCode: "TWD", amount: 7799.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125052", currencyCode: "TZS", amount: 599999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125053", currencyCode: "UAH", amount: 9899.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125054", currencyCode: "UYU", amount: 9479.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125055", currencyCode: "VND", amount: 5999999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6125056", currencyCode: "XOF", amount: 143999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
  ]
};

// GPB Monthly price group (same price points as Desktop Monthly)
const pcFy25GPBMonthly: PriceGroup = {
  id: "123460",
  name: "PC_FY25_GPB_MONTHLY",
  status: 'Active',
  validFrom: "2025-05-01",
  pricePoints: [
    { id: "6126001", currencyCode: "USD", amount: 39.99, exchangeRate: 1.0, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126002", currencyCode: "EUR", amount: 29.99, exchangeRate: 0.85, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126003", currencyCode: "CAD", amount: 49.99, exchangeRate: 1.35, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126004", currencyCode: "AUD", amount: 54.99, exchangeRate: 1.45, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126005", currencyCode: "CHF", amount: 39.99, exchangeRate: 0.90, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126006", currencyCode: "DKK", amount: 189.99, exchangeRate: 6.85, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126007", currencyCode: "NOK", amount: 274.99, exchangeRate: 9.90, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126008", currencyCode: "SEK", amount: 349.99, exchangeRate: 12.60, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126009", currencyCode: "GBP", amount: 29.99, exchangeRate: 0.75, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126010", currencyCode: "HKD", amount: 274.99, exchangeRate: 7.85, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126011", currencyCode: "SGD", amount: 49.99, exchangeRate: 1.35, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126012", currencyCode: "BRL", amount: 69.99, exchangeRate: 1.85, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126013", currencyCode: "NZD", amount: 39.99, exchangeRate: 1.60, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126014", currencyCode: "JPY", amount: 3999.00, exchangeRate: 110.0, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126015", currencyCode: "INR", amount: 999.00, exchangeRate: 83.0, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126016", currencyCode: "ZAR", amount: 249.00, exchangeRate: 18.5, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126017", currencyCode: "AED", amount: 94.99, exchangeRate: 3.67, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126018", currencyCode: "PLN", amount: 89.99, exchangeRate: 4.15, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126019", currencyCode: "SAR", amount: 99.99, exchangeRate: 3.75, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126020", currencyCode: "MXN", amount: 599.99, exchangeRate: 17.5, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126021", currencyCode: "EGP", amount: 499.99, exchangeRate: 31.0, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126022", currencyCode: "TRY", amount: 109.99, exchangeRate: 31.5, validFrom: "2025-05-01", pricingRule: "NONE" },
    // Long tail currencies
    { id: "6126023", currencyCode: "ARS", amount: 1599.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126024", currencyCode: "BDT", amount: 4399.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126025", currencyCode: "BGN", amount: 69.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126026", currencyCode: "CLP", amount: 35999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126027", currencyCode: "COP", amount: 159999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126028", currencyCode: "CRC", amount: 21999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126029", currencyCode: "CZK", amount: 899.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126030", currencyCode: "GTQ", amount: 309.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126031", currencyCode: "HNL", amount: 989.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126032", currencyCode: "HUF", amount: 13999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126033", currencyCode: "IDR", amount: 629999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126034", currencyCode: "ILS", amount: 149.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126035", currencyCode: "JOD", amount: 28.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126036", currencyCode: "KES", amount: 5199.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126037", currencyCode: "KRW", amount: 52999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126038", currencyCode: "KWD", amount: 12.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126039", currencyCode: "LBP", amount: 60299.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    { id: "6126040", currencyCode: "LKR", amount: 11999.99, validFrom: "2025-05-01", pricingRule: "NONE" },
    {
      id: "6126041", currencyCode: "MAD", amount: 399.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126042", currencyCode: "MYR", amount: 179.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126043", currencyCode: "NGN", amount: 64999.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126044", currencyCode: "PEN", amount: 149.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126045", currencyCode: "PHP", amount: 2299.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126046", currencyCode: "PKR", amount: 11199.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126047", currencyCode: "QAR", amount: 145.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126048", currencyCode: "RON", amount: 179.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126049", currencyCode: "RSD", amount: 4199.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126050", currencyCode: "THB", amount: 1399.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126051", currencyCode: "TWD", amount: 1299.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126052", currencyCode: "TZS", amount: 99999.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126053", currencyCode: "UAH", amount: 1649.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126054", currencyCode: "UYU", amount: 1579.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126055", currencyCode: "VND", amount: 999999.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6126056", currencyCode: "XOF", amount: 23999.99, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
  ]
};

// GPB Annual price group (same price points as Desktop Annual)
const pcFy25GPBAnnual: PriceGroup = {
  id: "123461",
  name: "PC_FY25_GPB_ANNUAL",
  status: 'Active',
  validFrom: "2025-05-01",
  pricePoints: [
    {
      id: "6127001", currencyCode: "USD", amount: 239.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127002", currencyCode: "EUR", amount: 179.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127003", currencyCode: "CAD", amount: 299.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127004", currencyCode: "AUD", amount: 323.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127005", currencyCode: "CHF", amount: 239.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127006", currencyCode: "DKK", amount: 1139.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127007", currencyCode: "NOK", amount: 1679.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127008", currencyCode: "SEK", amount: 2099.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127009", currencyCode: "GBP", amount: 179.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127010", currencyCode: "HKD", amount: 1679.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127011", currencyCode: "SGD", amount: 299.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127012", currencyCode: "BRL", amount: 419.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127013", currencyCode: "NZD", amount: 239.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127014", currencyCode: "JPY", amount: 23988.00, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127015", currencyCode: "INR", amount: 5988.00, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127016", currencyCode: "ZAR", amount: 1499.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127017", currencyCode: "AED", amount: 575.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127018", currencyCode: "PLN", amount: 539.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127019", currencyCode: "SAR", amount: 599.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127020", currencyCode: "MXN", amount: 3599.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127021", currencyCode: "EGP", amount: 2999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127022", currencyCode: "TRY", amount: 659.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    // Long tail currencies
    {
      id: "6127023", currencyCode: "ARS", amount: 9599.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127024", currencyCode: "BDT", amount: 26399.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127025", currencyCode: "BGN", amount: 419.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127026", currencyCode: "CLP", amount: 215999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127027", currencyCode: "COP", amount: 959999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127028", currencyCode: "CRC", amount: 131999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127029", currencyCode: "CZK", amount: 5399.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127030", currencyCode: "GTQ", amount: 1859.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127031", currencyCode: "HNL", amount: 5939.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127032", currencyCode: "HUF", amount: 83999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127033", currencyCode: "IDR", amount: 3779999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127034", currencyCode: "ILS", amount: 899.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127035", currencyCode: "JOD", amount: 173.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127036", currencyCode: "KES", amount: 31199.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127037", currencyCode: "KRW", amount: 317999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127038", currencyCode: "KWD", amount: 77.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127039", currencyCode: "LBP", amount: 361799.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127040", currencyCode: "LKR", amount: 71999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127041", currencyCode: "MAD", amount: 2399.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127042", currencyCode: "MYR", amount: 1079.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127043", currencyCode: "NGN", amount: 389999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127044", currencyCode: "PEN", amount: 899.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127045", currencyCode: "PHP", amount: 13799.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127046", currencyCode: "PKR", amount: 67199.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127047", currencyCode: "QAR", amount: 875.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127048", currencyCode: "RON", amount: 1079.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127049", currencyCode: "RSD", amount: 25199.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127050", currencyCode: "THB", amount: 8399.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127051", currencyCode: "TWD", amount: 7799.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127052", currencyCode: "TZS", amount: 599999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127053", currencyCode: "UAH", amount: 9899.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127054", currencyCode: "UYU", amount: 9479.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127055", currencyCode: "VND", amount: 5999999.88, validFrom: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6127056", currencyCode: "XOF", amount: 143999.88, validFrom: "2025-05-01",
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
    {
      id: "8957368", 
      status: "Active",
      salesChannel: "iOS",
      billingCycle: "Monthly",
      priceGroup: pcFy25iOSMonthly,
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2024-02-15T10:00:00Z"
    },
    {
      id: "9068479", 
      status: "Active",
      salesChannel: "iOS",
      billingCycle: "Annual",
      priceGroup: pcFy25iOSAnnual,
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: TEAM_MEMBERS.JORDAN_BADER.fullName,
      createdDate: "2024-02-15T10:00:00Z"
    },
    {
      id: "9179580", 
      status: "Active",
      salesChannel: "GPB",
      billingCycle: "Monthly",
      priceGroup: pcFy25GPBMonthly,
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2024-02-15T10:00:00Z"
    },
    {
      id: "9280691", 
      status: "Active",
      salesChannel: "GPB",
      billingCycle: "Annual",
      priceGroup: pcFy25GPBAnnual,
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