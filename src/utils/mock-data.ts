// This file will contain all the mock data for the PCC prototype.
// It will serve as our single source of truth for products, SKUs, etc. 

import type { Product, Attribute } from './types';
// @ts-ignore - PriceGroup type is used in inline object definitions
import type { PriceGroup } from './types';
import { TEAM_MEMBERS } from './users';
import { processPricePointStatuses } from './pricingUtils';

// PriceGroup type is used in inline object definitions below

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



export const mockAttributes: Attribute[] = [
  {
    id: 'attr-001',
    name: 'showAdminCenterBanner',
    domain: 'CONTRACTS',
    type: 'boolean',
    defaultValue: false,
    description: 'Controls admin center banner visibility',
  },
  {
    id: 'attr-002',
    name: 'isEligibleForSelfServedFieldAddon',
    domain: 'QUOTING',
    type: 'boolean',
    defaultValue: false,
    description: 'Determines field addon eligibility',
  },
  {
    id: 'attr-003',
    name: 'hasPrepaidCredits',
    domain: 'PRODUCT_CATALOG',
    type: 'boolean',
    defaultValue: false,
    description: 'Indicates prepaid credit availability',
  },
  {
    id: 'attr-004',
    name: 'ineligibleAmendmentIntents',
    domain: 'CONTRACTS',
    type: 'set',
    defaultValue: null,
    description: 'List of ineligible amendment types',
    acceptableValues: ['upgrade', 'downgrade', 'renewal', 'cancellation'],
  },
];

const rawMockProducts: Product[] = [
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
    code: 'PremiumCareer',
    family: 'SUBPKG',
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
    code: 'RecruiterLiteTeams',
    family: 'RECRUITERPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: false,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/talent/recruiter-lite',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
  },
  {
    id: '130200',
    name: 'Recruiter Corporate',
    description: 'LinkedIn Recruiter account with team collaboration, auditing, and unparalleled network search capabilities. Includes at least 150 InMails/month per license as well as basic training and support.',
    lob: 'LTS',
    folder: 'Recruiter',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/talent/recruiter-corporate/',
    seatType: 'Multi-seat fixed',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 500,
    features: [
      'Advanced candidate search with 50+ filters',
      'InMail credits (150+/month per license)',
      'Team collaboration tools',
      'Advanced analytics and reporting',
      'Auditing capabilities',
      'Unparalleled network search',
      'Basic training and support',
      'Priority customer support'
    ],
    code: 'RecruiterCorporate',
    family: 'RECRUITERPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: false,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/talent/recruiter-corporate',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
  }
]; 

// Premium Career price groups - cleared for new realistic data











// Premium Career SKUs - now loads dynamically from JSON files
// This keeps the initial load fast and allows for easy bulk updates
const premiumCareerProduct = rawMockProducts.find((p: Product) => p.id === '5095285');
if (premiumCareerProduct) {
  premiumCareerProduct.skus = [
    {
      id: "8435005",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      priceGroup: {
        id: "117004",
        status: "Active",
        pricePoints: [
          { 
            id: "6462461", 
            currencyCode: "USD", 
            amount: 39.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462641", 
            currencyCode: "BDT", 
            amount: 2549, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462651", 
            currencyCode: "BGN", 
            amount: 44.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462661", 
            currencyCode: "BYN", 
            amount: 61.66, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462681", 
            currencyCode: "COP", 
            amount: 101596.64, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462691", 
            currencyCode: "CRC", 
            amount: 16999, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462721", 
            currencyCode: "GTQ", 
            amount: 229, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462731", 
            currencyCode: "HNL", 
            amount: 749, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462741", 
            currencyCode: "HUF", 
            amount: 7739.37, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462751", 
            currencyCode: "IDR", 
            amount: 462400, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462761", 
            currencyCode: "ILS", 
            amount: 104.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462771", 
            currencyCode: "JOD", 
            amount: 20.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462781", 
            currencyCode: "KES", 
            amount: 3219, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462791", 
            currencyCode: "KRW", 
            amount: 33380.91, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462801", 
            currencyCode: "KWD", 
            amount: 8.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462811", 
            currencyCode: "LBP", 
            amount: 45399, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462821", 
            currencyCode: "LKR", 
            amount: 5779, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462831", 
            currencyCode: "MAD", 
            amount: 298.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462861", 
            currencyCode: "NGN", 
            amount: 11699, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462911", 
            currencyCode: "QAR", 
            amount: 108.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462931", 
            currencyCode: "RSD", 
            amount: 3259, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462941", 
            currencyCode: "RUB", 
            amount: 2239, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462961", 
            currencyCode: "THB", 
            amount: 969, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462981", 
            currencyCode: "TWD", 
            amount: 856.19, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462991", 
            currencyCode: "TZS", 
            amount: 69000, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463001", 
            currencyCode: "UAH", 
            amount: 809, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463011", 
            currencyCode: "UYU", 
            amount: 1299, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463021", 
            currencyCode: "VND", 
            amount: 703000, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463031", 
            currencyCode: "XOF", 
            amount: 18139, 
            validFrom: "2021-03-01T08:00:00Z",
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
      createdBy: "System",
      createdDate: "2021-03-01T08:00:00Z"
    },
    {
      id: "8435006",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Annual",
      priceGroup: {
        id: "118003",
        status: "Active",
        pricePoints: [
          { 
            id: "6463041", 
            currencyCode: "USD", 
            amount: 239.88, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463221", 
            currencyCode: "BDT", 
            amount: 20388, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463231", 
            currencyCode: "BGN", 
            amount: 359.9, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463241", 
            currencyCode: "BYN", 
            amount: 489.9, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463261", 
            currencyCode: "COP", 
            amount: 812773.11, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463271", 
            currencyCode: "CRC", 
            amount: 135948, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463301", 
            currencyCode: "GTQ", 
            amount: 1788, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463311", 
            currencyCode: "HNL", 
            amount: 5988, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463321", 
            currencyCode: "HUF", 
            amount: 61880.31, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463331", 
            currencyCode: "IDR", 
            amount: 3698400, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463341", 
            currencyCode: "ILS", 
            amount: 839.88, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463351", 
            currencyCode: "JOD", 
            amount: 167.88, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463361", 
            currencyCode: "KES", 
            amount: 25668, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463371", 
            currencyCode: "KRW", 
            amount: 266934.54, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463381", 
            currencyCode: "KWD", 
            amount: 71.88, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463391", 
            currencyCode: "LBP", 
            amount: 363108, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463401", 
            currencyCode: "LKR", 
            amount: 46188, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463411", 
            currencyCode: "MAD", 
            amount: 2387.88, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463441", 
            currencyCode: "NGN", 
            amount: 93588, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463491", 
            currencyCode: "QAR", 
            amount: 875.88, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463511", 
            currencyCode: "RSD", 
            amount: 26028, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463521", 
            currencyCode: "RUB", 
            amount: 17868, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463541", 
            currencyCode: "THB", 
            amount: 7788, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463561", 
            currencyCode: "TWD", 
            amount: 6845.71, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463571", 
            currencyCode: "TZS", 
            amount: 552000, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463581", 
            currencyCode: "UAH", 
            amount: 6468, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463591", 
            currencyCode: "UYU", 
            amount: 10308, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463601", 
            currencyCode: "VND", 
            amount: 5628000, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463611", 
            currencyCode: "XOF", 
            amount: 145068, 
            validFrom: "2021-03-01T08:00:00Z",
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
      createdBy: "System",
      createdDate: "2021-03-01T08:00:00Z"
    },
    {
      id: "8435007",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      priceGroup: {
        id: "124001",
        status: "Active",
        pricePoints: [
          { 
            id: "6462471", 
            currencyCode: "AUD", 
            amount: 49.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462481", 
            currencyCode: "BRL", 
            amount: 89.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462491", 
            currencyCode: "CAD", 
            amount: 47.61, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462501", 
            currencyCode: "CHF", 
            amount: 37.13, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462511", 
            currencyCode: "DKK", 
            amount: 199.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462521", 
            currencyCode: "EUR", 
            amount: 33.05, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462531", 
            currencyCode: "GBP", 
            amount: 29.16, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462541", 
            currencyCode: "HKD", 
            amount: 299.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462551", 
            currencyCode: "INR", 
            amount: 1567.8, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462561", 
            currencyCode: "JPY", 
            amount: 3635, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462571", 
            currencyCode: "NOK", 
            amount: 279.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462581", 
            currencyCode: "NZD", 
            amount: 39.12, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462591", 
            currencyCode: "SEK", 
            amount: 279.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462601", 
            currencyCode: "SGD", 
            amount: 46.29, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462611", 
            currencyCode: "ZAR", 
            amount: 391.3, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462621", 
            currencyCode: "AED", 
            amount: 99.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462631", 
            currencyCode: "ARS", 
            amount: 1999, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462671", 
            currencyCode: "CLP", 
            amount: 21596.64, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462701", 
            currencyCode: "CZK", 
            amount: 627.27, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462711", 
            currencyCode: "EGP", 
            amount: 529.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462841", 
            currencyCode: "MXN", 
            amount: 569.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462851", 
            currencyCode: "MYR", 
            amount: 123.58, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462871", 
            currencyCode: "PEN", 
            amount: 101.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462881", 
            currencyCode: "PHP", 
            amount: 1519, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462891", 
            currencyCode: "PKR", 
            amount: 4819, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462901", 
            currencyCode: "PLN", 
            amount: 81.29, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462921", 
            currencyCode: "RON", 
            amount: 112.6, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462951", 
            currencyCode: "SAR", 
            amount: 99.99, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6462971", 
            currencyCode: "TRY", 
            amount: 99.99, 
            validFrom: "2021-03-01T08:00:00Z",
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
      createdBy: "System",
      createdDate: "2021-03-01T08:00:00Z"
    },
    {
      id: "8435008",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Annual",
      priceGroup: {
        id: "122002",
        status: "Active",
        pricePoints: [
          { 
            id: "6463051", 
            currencyCode: "AUD", 
            amount: 272.62, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463061", 
            currencyCode: "BRL", 
            amount: 539.88, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463071", 
            currencyCode: "CAD", 
            amount: 285.6, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463081", 
            currencyCode: "CHF", 
            amount: 222.73, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463091", 
            currencyCode: "DKK", 
            amount: 1199.9, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463101", 
            currencyCode: "EUR", 
            amount: 198.25, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463111", 
            currencyCode: "GBP", 
            amount: 149.9, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463121", 
            currencyCode: "HKD", 
            amount: 1799.88, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463131", 
            currencyCode: "INR", 
            amount: 9406.78, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463141", 
            currencyCode: "JPY", 
            amount: 21807, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463151", 
            currencyCode: "NOK", 
            amount: 1679.9, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463161", 
            currencyCode: "NZD", 
            amount: 208.59, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463171", 
            currencyCode: "SEK", 
            amount: 1679.9, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463181", 
            currencyCode: "SGD", 
            amount: 277.67, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463191", 
            currencyCode: "ZAR", 
            amount: 2347.72, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463201", 
            currencyCode: "AED", 
            amount: 959.88, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463211", 
            currencyCode: "ARS", 
            amount: 15948, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463251", 
            currencyCode: "CLP", 
            amount: 172436.97, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463281", 
            currencyCode: "CZK", 
            amount: 4948.76, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463291", 
            currencyCode: "EGP", 
            amount: 5299.88, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463421", 
            currencyCode: "MXN", 
            amount: 5639.88, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463431", 
            currencyCode: "MYR", 
            amount: 984.79, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463451", 
            currencyCode: "PEN", 
            amount: 815.88, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463461", 
            currencyCode: "PHP", 
            amount: 12108, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463471", 
            currencyCode: "PKR", 
            amount: 38508, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463481", 
            currencyCode: "PLN", 
            amount: 780.39, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463501", 
            currencyCode: "RON", 
            amount: 897.38, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463531", 
            currencyCode: "SAR", 
            amount: 959.88, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6463551", 
            currencyCode: "TRY", 
            amount: 959.88, 
            validFrom: "2021-03-01T08:00:00Z",
            pricingRule: "NONE",
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      lix: {
        key: "premium-quarterly-billing-2025",
        treatment: "treatment"
      },
      origin: "manual",
      createdBy: "System",
      createdDate: "2025-03-04T08:00:00Z"
    }
  ];
}

// Add SKUs to Recruiter Lite product with slab pricing examples
const recruiterLiteProduct = rawMockProducts.find((p: Product) => p.id === '5083684');
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

// Add 10 Demo Products for UI scaling testing
const demoProducts: Product[] = [
  {
    id: '0000001',
    name: 'Demo Product',
    description: 'Demo product for UI scaling testing - Desktop only',
    lob: 'Premium',
    folder: 'Premium Core Products',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://demo.example.com/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: ['Demo feature 1', 'Demo feature 2'],
    code: 'DemoProduct001',
    family: 'SUBPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://demo.example.com/terms',
    productUrl: 'https://demo.example.com/product',
    helpCenterUrl: 'https://demo.example.com/help',
    skus: [
      {
        id: "demo-sku-001",
        status: "Active",
        salesChannel: "Desktop",
        billingCycle: "Monthly",
        priceGroup: {
          id: "demo-pg-001",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-001", 
              currencyCode: "USD", 
              amount: 29.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      }
    ],
  },
  {
    id: '0000002',
    name: 'Demo Product',
    description: 'Demo product for UI scaling testing - Desktop + iOS + GPB',
    lob: 'LTS',
    folder: 'Recruiter',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://demo.example.com/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: ['Demo feature 1', 'Demo feature 2'],
    code: 'DemoProduct002',
    family: 'RECRUITERPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://demo.example.com/terms',
    productUrl: 'https://demo.example.com/product',
    helpCenterUrl: 'https://demo.example.com/help',
    skus: [
      {
        id: "demo-sku-002a",
        status: "Active",
        salesChannel: "Desktop",
        billingCycle: "Monthly",
        priceGroup: {
          id: "demo-pg-002a",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-002a", 
              currencyCode: "USD", 
              amount: 39.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      },
      {
        id: "demo-sku-002b",
        status: "Active",
        salesChannel: "iOS",
        billingCycle: "Monthly",
        priceGroup: {
          id: "demo-pg-002b",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-002b", 
              currencyCode: "USD", 
              amount: 39.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      },
      {
        id: "demo-sku-002c",
        status: "Active",
        salesChannel: "GPB",
        billingCycle: "Monthly",
        priceGroup: {
          id: "demo-pg-002c",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-002c", 
              currencyCode: "USD", 
              amount: 39.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      }
    ],
  },
  {
    id: '0000003',
    name: 'Demo Product',
    description: 'Demo product for UI scaling testing - Field only',
    lob: 'LMS',
    folder: 'All LMS Products',
    status: 'Inactive',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://demo.example.com/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: ['Demo feature 1', 'Demo feature 2'],
    code: 'DemoProduct003',
    family: 'LMS',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://demo.example.com/terms',
    productUrl: 'https://demo.example.com/product',
    helpCenterUrl: 'https://demo.example.com/help',
    skus: [
      {
        id: "demo-sku-003",
        status: "Inactive",
        salesChannel: "Field",
        billingCycle: "Annual",
        priceGroup: {
          id: "demo-pg-003",
          status: "Inactive",
          pricePoints: [
            { 
              id: "demo-pp-003", 
              currencyCode: "USD", 
              amount: 199.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      }
    ],
  },
  {
    id: '0000004',
    name: 'Demo Product',
    description: 'Demo product for UI scaling testing - Desktop only',
    lob: 'Premium',
    folder: 'Premium Multiseat Products',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://demo.example.com/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: ['Demo feature 1', 'Demo feature 2'],
    code: 'DemoProduct004',
    family: 'SUBPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://demo.example.com/terms',
    productUrl: 'https://demo.example.com/product',
    helpCenterUrl: 'https://demo.example.com/help',
    skus: [
      {
        id: "demo-sku-004",
        status: "Active",
        salesChannel: "Desktop",
        billingCycle: "Annual",
        priceGroup: {
          id: "demo-pg-004",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-004", 
              currencyCode: "USD", 
              amount: 299.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      }
    ],
  },
  {
    id: '0000005',
    name: 'Demo Product',
    description: 'Demo product for UI scaling testing - Desktop + iOS + GPB',
    lob: 'LTS',
    folder: 'Learning',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://demo.example.com/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: ['Demo feature 1', 'Demo feature 2'],
    code: 'DemoProduct005',
    family: 'RECRUITERPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://demo.example.com/terms',
    productUrl: 'https://demo.example.com/product',
    helpCenterUrl: 'https://demo.example.com/help',
    skus: [
      {
        id: "demo-sku-005a",
        status: "Active",
        salesChannel: "Desktop",
        billingCycle: "Annual",
        priceGroup: {
          id: "demo-pg-005a",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-005a", 
              currencyCode: "USD", 
              amount: 399.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      },
      {
        id: "demo-sku-005b",
        status: "Active",
        salesChannel: "iOS",
        billingCycle: "Annual",
        priceGroup: {
          id: "demo-pg-005b",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-005b", 
              currencyCode: "USD", 
              amount: 399.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      },
      {
        id: "demo-sku-005c",
        status: "Active",
        salesChannel: "GPB",
        billingCycle: "Annual",
        priceGroup: {
          id: "demo-pg-005c",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-005c", 
              currencyCode: "USD", 
              amount: 399.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      }
    ],
  },
  {
    id: '0000006',
    name: 'Demo Product',
    description: 'Demo product for UI scaling testing - Field only',
    lob: 'LSS',
    folder: 'All LSS Products',
    status: 'Archived',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://demo.example.com/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: ['Demo feature 1', 'Demo feature 2'],
    code: 'DemoProduct006',
    family: 'LSS',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://demo.example.com/terms',
    productUrl: 'https://demo.example.com/product',
    helpCenterUrl: 'https://demo.example.com/help',
    skus: [
      {
        id: "demo-sku-006",
        status: "Archived",
        salesChannel: "Field",
        billingCycle: "Monthly",
        priceGroup: {
          id: "demo-pg-006",
          status: "Archived",
          pricePoints: [
            { 
              id: "demo-pp-006", 
              currencyCode: "USD", 
              amount: 49.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      }
    ],
  },
  {
    id: '0000007',
    name: 'Demo Product',
    description: 'Demo product for UI scaling testing - Desktop + iOS + GPB',
    lob: 'Premium',
    folder: 'Premium Company Page',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://demo.example.com/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: ['Demo feature 1', 'Demo feature 2'],
    code: 'DemoProduct007',
    family: 'SUBPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://demo.example.com/terms',
    productUrl: 'https://demo.example.com/product',
    helpCenterUrl: 'https://demo.example.com/help',
    skus: [
      {
        id: "demo-sku-007a",
        status: "Active",
        salesChannel: "Desktop",
        billingCycle: "Monthly",
        priceGroup: {
          id: "demo-pg-007a",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-007a", 
              currencyCode: "USD", 
              amount: 19.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      },
      {
        id: "demo-sku-007b",
        status: "Active",
        salesChannel: "iOS",
        billingCycle: "Monthly",
        priceGroup: {
          id: "demo-pg-007b",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-007b", 
              currencyCode: "USD", 
              amount: 19.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      },
      {
        id: "demo-sku-007c",
        status: "Active",
        salesChannel: "GPB",
        billingCycle: "Monthly",
        priceGroup: {
          id: "demo-pg-007c",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-007c", 
              currencyCode: "USD", 
              amount: 19.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      }
    ],
  },
  {
    id: '0000008',
    name: 'Demo Product',
    description: 'Demo product for UI scaling testing - Field only',
    lob: 'LTS',
    folder: 'Jobs',
    status: 'Inactive',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://demo.example.com/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: ['Demo feature 1', 'Demo feature 2'],
    code: 'DemoProduct008',
    family: 'RECRUITERPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://demo.example.com/terms',
    productUrl: 'https://demo.example.com/product',
    helpCenterUrl: 'https://demo.example.com/help',
    skus: [
      {
        id: "demo-sku-008",
        status: "Inactive",
        salesChannel: "Field",
        billingCycle: "Annual",
        priceGroup: {
          id: "demo-pg-008",
          status: "Inactive",
          pricePoints: [
            { 
              id: "demo-pp-008", 
              currencyCode: "USD", 
              amount: 249.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      }
    ],
  },
  {
    id: '0000009',
    name: 'Demo Product',
    description: 'Demo product for UI scaling testing - Desktop only',
    lob: 'Premium',
    folder: 'Premium Small Business',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://demo.example.com/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: ['Demo feature 1', 'Demo feature 2'],
    code: 'DemoProduct009',
    family: 'SUBPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://demo.example.com/terms',
    productUrl: 'https://demo.example.com/product',
    helpCenterUrl: 'https://demo.example.com/help',
    skus: [
      {
        id: "demo-sku-009",
        status: "Active",
        salesChannel: "Desktop",
        billingCycle: "Monthly",
        priceGroup: {
          id: "demo-pg-009",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-009", 
              currencyCode: "USD", 
              amount: 34.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      }
    ],
  },
  {
    id: '0000010',
    name: 'Demo Product',
    description: 'Demo product for UI scaling testing - Desktop + iOS + GPB',
    lob: 'Other',
    folder: 'All Other Products',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://demo.example.com/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: ['Demo feature 1', 'Demo feature 2'],
    code: 'DemoProduct010',
    family: 'OTHER',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://demo.example.com/terms',
    productUrl: 'https://demo.example.com/product',
    helpCenterUrl: 'https://demo.example.com/help',
    skus: [
      {
        id: "demo-sku-010a",
        status: "Active",
        salesChannel: "Desktop",
        billingCycle: "Annual",
        priceGroup: {
          id: "demo-pg-010a",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-010a", 
              currencyCode: "USD", 
              amount: 349.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      },
      {
        id: "demo-sku-010b",
        status: "Active",
        salesChannel: "iOS",
        billingCycle: "Annual",
        priceGroup: {
          id: "demo-pg-010b",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-010b", 
              currencyCode: "USD", 
              amount: 349.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      },
      {
        id: "demo-sku-010c",
        status: "Active",
        salesChannel: "GPB",
        billingCycle: "Annual",
        priceGroup: {
          id: "demo-pg-010c",
          status: "Active",
          pricePoints: [
            { 
              id: "demo-pp-010c", 
              currencyCode: "USD", 
              amount: 349.99, 
              validFrom: "2025-01-01T00:00:00Z",
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
        createdBy: "System",
        createdDate: "2025-01-01T00:00:00Z"
      }
    ],
  }
];

// Process all price points to calculate statuses and auto-fill validTo dates
export const mockProducts: Product[] = [
  ...rawMockProducts.map(product => ({
    ...product,
    skus: product.skus.map(sku => ({
      ...sku,
      priceGroup: {
        ...sku.priceGroup,
        pricePoints: processPricePointStatuses(sku.priceGroup.pricePoints)
      }
    }))
  })),
  ...demoProducts.map(product => ({
    ...product,
    skus: product.skus.map(sku => ({
      ...sku,
      priceGroup: {
        ...sku.priceGroup,
        pricePoints: processPricePointStatuses(sku.priceGroup.pricePoints)
      }
    }))
  }))
];