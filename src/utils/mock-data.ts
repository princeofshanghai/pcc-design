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

export const mockConfigurationRequests: ConfigurationRequest[] = [
  {
    id: '3' + Math.floor(10000 + Math.random() * 90000).toString(),
    targetProductId: '5095295', // Sales Navigator Core
    salesChannel: 'iOS',
    billingCycle: 'Monthly',
    priceAmount: 79.99,
    status: 'In EI',
    createdBy: TEAM_MEMBERS.CHARLES_HU.fullName,
    createdDate: '2024-03-20T14:15:00Z',
  },
  {
    id: '3' + Math.floor(10000 + Math.random() * 90000).toString(),
    targetProductId: '5095310', // Learning Hub Pro
    salesChannel: 'Field',
    billingCycle: 'Annual',
    priceAmount: 1199.99,
    status: 'Failed',
    createdBy: TEAM_MEMBERS.TANMAY_KHEMKA.fullName,
    createdDate: '2024-03-18T16:20:00Z',
  },
  {
    id: '3' + Math.floor(10000 + Math.random() * 90000).toString(),
    targetProductId: '5095295', // Sales Navigator Core
    salesChannel: 'Desktop',
    billingCycle: 'Quarterly',
    priceAmount: 239.99,
    lixKey: 'quarterly_nav_test',
    lixTreatment: 'standard_price',
    status: 'Live',
    createdBy: TEAM_MEMBERS.CHARLES_HU.fullName,
    createdDate: '2024-03-12T11:10:00Z',
    generatedSkuId: '8' + Math.floor(100000 + Math.random() * 900000).toString(),
    generatedPriceGroupId: '1' + Math.floor(10000 + Math.random() * 90000).toString(),
  },
  // DEMO Product change requests
  {
    id: '3' + Math.floor(10000 + Math.random() * 90000).toString(),
    targetProductId: '9999999', // DEMO Product
    salesChannel: 'Desktop',
    billingCycle: 'Monthly',
    priceAmount: 24.99,
    status: 'Pending Review',
    createdBy: TEAM_MEMBERS.ANTHONY_HOMAN.fullName,
    createdDate: '2024-03-25T10:00:00Z',
  },
  {
    id: '3' + Math.floor(10000 + Math.random() * 90000).toString(),
    targetProductId: '9999999', // DEMO Product
    salesChannel: 'GPB',
    billingCycle: 'Annual',
    priceAmount: 199.99,
    lixKey: 'mobile_annual_test',
    lixTreatment: 'discounted_price',
    status: 'In EI',
    createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
    createdDate: '2024-03-24T15:30:00Z',
  },
  // Successful DEMO Product change requests (Live status)
  {
    id: '3' + Math.floor(10000 + Math.random() * 90000).toString(),
    targetProductId: '9999999', // DEMO Product
    salesChannel: 'iOS',
    billingCycle: 'Monthly',
    priceAmount: 19.99,
    lixKey: 'mobile_pricing_test_2024',
    lixTreatment: 'discount_treatment',
    status: 'Live',
    createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
    createdDate: '2024-03-20T09:30:00Z',
    generatedSkuId: '8' + Math.floor(100000 + Math.random() * 900000).toString(),
    generatedPriceGroupId: '1' + Math.floor(10000 + Math.random() * 90000).toString(),
  },
  {
    id: '3' + Math.floor(10000 + Math.random() * 90000).toString(),
    targetProductId: '9999999', // DEMO Product
    salesChannel: 'Field',
    billingCycle: 'Monthly',
    priceAmount: 89.99,
    lixKey: 'premium_features_upsell',
    lixTreatment: 'enhanced_package',
    status: 'Live',
    createdBy: TEAM_MEMBERS.JORDAN_BADER.fullName,
    createdDate: '2024-03-18T11:45:00Z',
    generatedSkuId: '8' + Math.floor(100000 + Math.random() * 900000).toString(),
    generatedPriceGroupId: '9' + Math.floor(100000 + Math.random() * 900000).toString(),
  },
  {
    id: '3' + Math.floor(10000 + Math.random() * 90000).toString(),
    targetProductId: '9999999', // DEMO Product
    salesChannel: 'GPB',
    billingCycle: 'Quarterly',
    priceAmount: 59.99,
    lixKey: 'mobile_pricing_test_2024',
    lixTreatment: 'control',
    status: 'Live',
    createdBy: TEAM_MEMBERS.JORDAN_BADER.fullName,
    createdDate: '2024-03-22T16:20:00Z',
    generatedSkuId: '8' + Math.floor(100000 + Math.random() * 900000).toString(),
    generatedPriceGroupId: '9' + Math.floor(100000 + Math.random() * 900000).toString(),
  },
  {
    id: '3' + Math.floor(10000 + Math.random() * 90000).toString(),
    targetProductId: '9999999', // DEMO Product
    salesChannel: 'Field',
    billingCycle: 'Annual',
    priceAmount: 899.99,
    status: 'Live',
    createdBy: TEAM_MEMBERS.TANMAY_KHEMKA.fullName,
    createdDate: '2024-02-20T13:30:00Z',
    generatedSkuId: '8' + Math.floor(100000 + Math.random() * 900000).toString(),
    generatedPriceGroupId: '9' + Math.floor(100000 + Math.random() * 900000).toString(),
  },
  {
    id: '3' + Math.floor(10000 + Math.random() * 90000).toString(),
    targetProductId: '9999999', // DEMO Product
    salesChannel: 'Desktop',
    billingCycle: 'Annual',
    priceAmount: 449.99,
    lixKey: 'extended_billing_cycle_test',
    lixTreatment: 'biannual_option',
    status: 'Live',
    createdBy: TEAM_MEMBERS.ANTHONY_HOMAN.fullName,
    createdDate: '2024-03-25T14:15:00Z',
    generatedSkuId: '8' + Math.floor(100000 + Math.random() * 900000).toString(),
    generatedPriceGroupId: '9' + Math.floor(100000 + Math.random() * 900000).toString(),
  },
  {
    id: '3' + Math.floor(10000 + Math.random() * 90000).toString(),
    targetProductId: '9999999', // DEMO Product
    salesChannel: 'Field',
    billingCycle: 'Quarterly',
    priceAmount: 74.99,
    status: 'Pending Review',
    createdBy: TEAM_MEMBERS.CHARLES_HU.fullName,
    createdDate: '2024-03-26T08:45:00Z',
  },
  {
    id: '3' + Math.floor(10000 + Math.random() * 90000).toString(),
    targetProductId: '9999999', // DEMO Product
    salesChannel: 'Desktop',
    billingCycle: 'Annual',
    priceAmount: 249.99,
    lixKey: 'annual_pricing_experiment',
    lixTreatment: 'premium_price',
    status: 'Failed',
    createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
    createdDate: '2024-03-23T12:20:00Z',
  },
];

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
    id: '5255644',
    name: 'Premium Small Business',
    description: 'Premium features designed for small business owners and entrepreneurs.',
    lob: 'Premium',
    folder: 'Premium Small Business',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/premium/small-business/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: ['Business Insights', 'InMail Messages', 'Lead Builder'],
    tags: [{ type: 'Customer Type', value: 'Individual member' }, { type: 'Sales Top of Funnel', value: 'Premium Chooser' }],
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/premium/small-business',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
  },
  {
    id: '5095310',
    name: 'Learning Hub Pro',
    description: 'Advanced learning tools and analytics for professional development.',
    lob: 'LTS',
    folder: 'Learning',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/learning/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: ['Learning Analytics', 'Skill Assessments', 'Certificates', 'Advanced Courses'],
    tags: [{ type: 'Customer Type', value: 'Individual member' }, { type: 'Sales Top of Funnel', value: 'Premium Chooser' }],
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/learning',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
    configurationRequests: [
      mockConfigurationRequests[1], // Sarah's failed field annual config
    ],
  },
  {
    id: '5095300',
    name: 'Sales Navigator Advanced',
    description: 'Advanced sales intelligence and lead generation tools.',
    lob: 'LSS',
    folder: 'All LSS Products',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/sales/navigator/',
    seatType: 'Multi-seat fixed',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 100,
    features: ['Advanced Search', 'Lead Builder', 'CRM Integration', 'Team Link'],
    tags: [{ type: 'Customer Type', value: 'Enterprise customer' }, { type: 'Sales Top of Funnel', value: 'Premium Chooser' }],
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: false,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/sales/navigator',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
  },
  {
    id: '5095320',
    name: 'Campaign Manager Pro',
    description: 'Professional advertising and campaign management tools.',
    lob: 'LMS',
    folder: 'All LMS Products',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/campaignmanager/',
    seatType: 'Multi-seat fixed',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 50,
    features: ['Page Analytics', 'Sponsored Content', 'Company Insights', 'Page Entitlements'],
    tags: [{ type: 'Customer Type', value: 'Enterprise customer' }, { type: 'Sales Top of Funnel', value: 'Premium Chooser' }],
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: false,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/campaignmanager',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
  },
  {
    id: '5095295',
    name: 'Premium Business',
    description: 'Premium features designed for business professionals and teams.',
    lob: 'Premium',
    folder: 'Premium Core Products',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/premium/business/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: ['Advanced Search', 'InMail Messages', 'Business Insights'],
    tags: [{ type: 'Customer Type', value: 'Individual member' }, { type: 'Sales Top of Funnel', value: 'Premium Chooser' }],
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/premium/business',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
    configurationRequests: [
      mockConfigurationRequests[0], // Anand's iOS channel addition
      mockConfigurationRequests[2], // Anand's successful quarterly experiment
    ],
  },
  {
    id: '5255645',
    name: 'Premium Multiseat Business',
    description: 'Multi-seat premium business features for teams and organizations.',
    lob: 'Premium',
    folder: 'Premium Multiseat Products',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/premium/multiseat/',
    seatType: 'Multi-seat fixed',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 2,
    seatMax: 100,
    features: ['Team Management', 'Bulk InMail', 'Analytics Dashboard', 'Admin Controls'],
    tags: [{ type: 'Customer Type', value: 'Enterprise customer' }, { type: 'Sales Top of Funnel', value: 'Premium Chooser' }],
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: false,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/premium/multiseat',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
  },
  {
    id: '5255646',
    name: 'Company Page Plus',
    description: 'Enhanced company page features and analytics.',
    lob: 'Premium',
    folder: 'Premium Company Page',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/company-page-plus/',
    seatType: 'Multi-seat fixed',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 25,
    features: ['Page Analytics', 'Sponsored Content', 'Company Insights', 'Page Entitlements'],
    tags: [{ type: 'Customer Type', value: 'Enterprise customer' }, { type: 'Sales Top of Funnel', value: 'Premium Chooser' }],
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: false,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/company-page-plus',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
  },
  {
    id: '5255647',
    name: 'Premium Entitlements Bundle',
    description: 'Comprehensive bundle of premium features and entitlements.',
    lob: 'Premium',
    folder: 'Premium Entitlements',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/premium/entitlements/',
    seatType: 'Single seat',
    isBundle: true,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: ['Feature Access', 'Content Library', 'Advanced Analytics', 'Priority Support'],
    tags: [{ type: 'Customer Type', value: 'Individual member' }, { type: 'Sales Top of Funnel', value: 'Premium Chooser' }],
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/premium/entitlements',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
  },
  {
    id: '9999999', // DEMO Product
    name: 'DEMO Product',
    description: 'A placeholder product for demonstration purposes.',
    lob: 'Other',
    folder: 'All Other Products',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/demo/',
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
      'Advanced Search',
      'InMail Messages',
      'Business Insights',
      'Page Analytics',
      'Sponsored Content',
      'Company Insights',
      'Page Entitlements',
      'Feature Access',
    ],
    tags: [{ type: 'Customer Type', value: 'Individual member' }, { type: 'Sales Top of Funnel', value: 'Premium Chooser' }],
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/demo',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
    configurationRequests: [
      mockConfigurationRequests[3], // Alex's desktop monthly pending review
      mockConfigurationRequests[4], // Sarah's annual GPB test (In EI)
      mockConfigurationRequests[5], // Sarah's iOS monthly (Live)
      mockConfigurationRequests[6], // Chris's field monthly premium (Live)
      mockConfigurationRequests[7], // Jordan's GPB quarterly control (Live)
      mockConfigurationRequests[8], // Taylor's field annual enterprise (Live)
      mockConfigurationRequests[9], // Mike's desktop annual biannual (Live)
    ],
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
  startDate: "2025-05-01",
  pricePoints: [
    { id: "6123001", currencyCode: "USD", amount: 39.99, exchangeRate: 1.0, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123002", currencyCode: "EUR", amount: 29.99, exchangeRate: 0.85, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123003", currencyCode: "CAD", amount: 49.99, exchangeRate: 1.35, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123004", currencyCode: "AUD", amount: 54.99, exchangeRate: 1.45, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123005", currencyCode: "CHF", amount: 39.99, exchangeRate: 0.90, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123006", currencyCode: "DKK", amount: 189.99, exchangeRate: 6.85, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123007", currencyCode: "NOK", amount: 274.99, exchangeRate: 9.90, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123008", currencyCode: "SEK", amount: 349.99, exchangeRate: 12.60, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123009", currencyCode: "GBP", amount: 29.99, exchangeRate: 0.75, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123010", currencyCode: "HKD", amount: 274.99, exchangeRate: 7.85, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123011", currencyCode: "SGD", amount: 49.99, exchangeRate: 1.35, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123012", currencyCode: "BRL", amount: 69.99, exchangeRate: 1.85, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123013", currencyCode: "NZD", amount: 39.99, exchangeRate: 1.60, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123014", currencyCode: "JPY", amount: 3999.00, exchangeRate: 110.0, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123015", currencyCode: "INR", amount: 999.00, exchangeRate: 83.0, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123016", currencyCode: "ZAR", amount: 249.00, exchangeRate: 18.5, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123017", currencyCode: "AED", amount: 94.99, exchangeRate: 3.67, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123018", currencyCode: "PLN", amount: 89.99, exchangeRate: 4.15, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123019", currencyCode: "SAR", amount: 99.99, exchangeRate: 3.75, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123020", currencyCode: "MXN", amount: 599.99, exchangeRate: 17.5, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123021", currencyCode: "EGP", amount: 499.99, exchangeRate: 31.0, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123022", currencyCode: "TRY", amount: 109.99, exchangeRate: 31.5, startDate: "2025-05-01", pricingRule: "NONE" },
    // Long tail currencies
    { id: "6123023", currencyCode: "ARS", amount: 1599.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123024", currencyCode: "BDT", amount: 4399.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123025", currencyCode: "BGN", amount: 69.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123026", currencyCode: "CLP", amount: 35999.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123027", currencyCode: "COP", amount: 159999.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123028", currencyCode: "CRC", amount: 21999.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123029", currencyCode: "CZK", amount: 899.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123030", currencyCode: "GTQ", amount: 309.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123031", currencyCode: "HNL", amount: 989.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123032", currencyCode: "HUF", amount: 13999.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123033", currencyCode: "IDR", amount: 629999.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123034", currencyCode: "ILS", amount: 149.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123035", currencyCode: "JOD", amount: 28.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123036", currencyCode: "KES", amount: 5199.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123037", currencyCode: "KRW", amount: 52999.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123038", currencyCode: "KWD", amount: 12.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123039", currencyCode: "LBP", amount: 60299.99, startDate: "2025-05-01", pricingRule: "NONE" },
    { id: "6123040", currencyCode: "LKR", amount: 11999.99, startDate: "2025-05-01", pricingRule: "NONE" },
    {
      id: "6123041", currencyCode: "MAD", amount: 399.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123042", currencyCode: "MYR", amount: 179.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123043", currencyCode: "NGN", amount: 64999.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123044", currencyCode: "PEN", amount: 149.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123045", currencyCode: "PHP", amount: 2299.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123046", currencyCode: "PKR", amount: 11199.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123047", currencyCode: "QAR", amount: 145.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123048", currencyCode: "RON", amount: 179.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123049", currencyCode: "RSD", amount: 4199.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123050", currencyCode: "THB", amount: 1399.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123051", currencyCode: "TWD", amount: 1299.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123052", currencyCode: "TZS", amount: 99999.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123053", currencyCode: "UAH", amount: 1649.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123054", currencyCode: "UYU", amount: 1579.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123055", currencyCode: "VND", amount: 999999.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123056", currencyCode: "XOF", amount: 23999.99, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
  ]
};

const pcFy25Annual: PriceGroup = {
  id: "123457", // Fixed ID instead of random
  name: "PC_FY25_ANNUAL",
  status: 'Active',
  startDate: "2025-05-01",
  pricePoints: [
    {
      id: "6123101", currencyCode: "USD", amount: 239.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123102", currencyCode: "EUR", amount: 179.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123103", currencyCode: "CAD", amount: 299.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123104", currencyCode: "AUD", amount: 323.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123105", currencyCode: "CHF", amount: 239.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123106", currencyCode: "DKK", amount: 1139.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123107", currencyCode: "NOK", amount: 1679.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123108", currencyCode: "SEK", amount: 2099.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123109", currencyCode: "GBP", amount: 179.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123110", currencyCode: "HKD", amount: 1679.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123111", currencyCode: "SGD", amount: 299.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123112", currencyCode: "BRL", amount: 419.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123113", currencyCode: "NZD", amount: 239.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123114", currencyCode: "JPY", amount: 23988.00, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123115", currencyCode: "INR", amount: 5988.00, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123116", currencyCode: "ZAR", amount: 1499.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123117", currencyCode: "AED", amount: 575.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123118", currencyCode: "PLN", amount: 539.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123119", currencyCode: "SAR", amount: 599.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123120", currencyCode: "MXN", amount: 3599.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123121", currencyCode: "EGP", amount: 2999.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123122", currencyCode: "TRY", amount: 659.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    // Long tail currencies
    {
      id: "6123123", currencyCode: "ARS", amount: 9599.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123124", currencyCode: "BDT", amount: 26399.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123125", currencyCode: "BGN", amount: 419.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123126", currencyCode: "CLP", amount: 215999.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123127", currencyCode: "COP", amount: 959999.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123128", currencyCode: "CRC", amount: 131999.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123129", currencyCode: "CZK", amount: 5399.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123130", currencyCode: "GTQ", amount: 1859.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123131", currencyCode: "HNL", amount: 5939.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123132", currencyCode: "HUF", amount: 83999.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123133", currencyCode: "IDR", amount: 3779999.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123134", currencyCode: "ILS", amount: 899.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123135", currencyCode: "JOD", amount: 173.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123136", currencyCode: "KES", amount: 31199.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123137", currencyCode: "KRW", amount: 317999.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123138", currencyCode: "KWD", amount: 77.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123139", currencyCode: "LBP", amount: 361799.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123140", currencyCode: "LKR", amount: 71999.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123141", currencyCode: "MAD", amount: 2399.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123142", currencyCode: "MYR", amount: 1079.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123143", currencyCode: "NGN", amount: 389999.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123144", currencyCode: "PEN", amount: 899.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123145", currencyCode: "PHP", amount: 13799.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123146", currencyCode: "PKR", amount: 67199.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123147", currencyCode: "QAR", amount: 875.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123148", currencyCode: "RON", amount: 1079.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123149", currencyCode: "RSD", amount: 25199.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123150", currencyCode: "THB", amount: 8399.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123151", currencyCode: "TWD", amount: 7799.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123152", currencyCode: "TZS", amount: 599999.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123153", currencyCode: "UAH", amount: 9899.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123154", currencyCode: "UYU", amount: 9479.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123155", currencyCode: "VND", amount: 5999999.88, startDate: "2025-05-01",
      pricingRule: 'NONE'
    },
    {
      id: "6123156", currencyCode: "XOF", amount: 143999.88, startDate: "2025-05-01",
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

// Add SKUs to Premium Business product
const premiumBusinessProduct = mockProducts.find(p => p.id === '5095295');
if (premiumBusinessProduct) {
  premiumBusinessProduct.skus = [
    {
      id: "8" + Math.floor(100000 + Math.random() * 900000).toString(),
      name: "Premium Business FY25 Desktop Monthly",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      priceGroup: {
        id: "134567", // Fixed ID instead of random
        name: "PB_FY25_MONTHLY",
        status: "Active",
        startDate: "2025-01-01",
        pricePoints: [
          {
            id: "6134001", currencyCode: "USD", amount: 59.99, exchangeRate: 1.0, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            id: "6134002", currencyCode: "EUR", amount: 49.99, exchangeRate: 0.85, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            id: "6134003", currencyCode: "GBP", amount: 39.99, exchangeRate: 0.75, startDate: "2025-01-01",
            pricingRule: 'NONE'
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: TEAM_MEMBERS.CHARLES_HU.fullName,
      createdDate: "2024-02-01T14:00:00Z"
    },
    {
      id: "8" + Math.floor(100000 + Math.random() * 900000).toString(),
      name: "Premium Business FY25 Desktop Quarterly",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Quarterly",
      priceGroup: {
        id: "9" + Math.floor(100000 + Math.random() * 900000).toString(),
        name: "PB_FY25_QUARTERLY",
        status: "Active",
        startDate: "2025-01-01",
        pricePoints: [
          {
            currencyCode: "USD", amount: 239.99, exchangeRate: 1.0, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "EUR", amount: 199.99, exchangeRate: 0.85, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "GBP", amount: 179.99, exchangeRate: 0.75, startDate: "2025-01-01",
            pricingRule: 'NONE'
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "configuration_request",
      createdBy: TEAM_MEMBERS.TANMAY_KHEMKA.fullName,
      createdDate: "2024-03-12T11:10:00Z",
      configurationRequestId: mockConfigurationRequests[2].id,
      lix: {
        key: "quarterly_nav_test",
        treatment: "standard_price"
      }
    }
  ];
} 

// Add SKUs for the DEMO Product
const demoProduct = mockProducts.find(p => p.id === '9999999');
if (demoProduct) {
  demoProduct.skus = [
    {
      id: "8" + Math.floor(100000 + Math.random() * 900000).toString(),
      name: "DEMO Product FY25 Desktop Monthly",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      priceGroup: {
        id: "9" + Math.floor(100000 + Math.random() * 900000).toString(),
        name: "PD_FY25_MONTHLY",
        status: "Active",
        startDate: "2025-01-01",
        pricePoints: [
          {
            currencyCode: "USD", amount: 24.99, exchangeRate: 1.0, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "EUR", amount: 19.99, exchangeRate: 0.85, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "GBP", amount: 16.99, exchangeRate: 0.75, startDate: "2025-01-01",
            pricingRule: 'NONE'
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: "Alex Demo (PM)",
      createdDate: "2024-02-15T10:00:00Z"
    },
    {
      id: "8" + Math.floor(100000 + Math.random() * 900000).toString(),
      name: "DEMO Product FY25 Desktop Annual",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Annual",
      priceGroup: {
        id: "9" + Math.floor(100000 + Math.random() * 900000).toString(),
        name: "PD_FY25_ANNUAL",
        status: "Active",
        startDate: "2025-01-01",
        pricePoints: [
          {
            currencyCode: "USD", amount: 249.99, exchangeRate: 1.0, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "EUR", amount: 199.99, exchangeRate: 0.85, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "GBP", amount: 174.99, exchangeRate: 0.75, startDate: "2025-01-01",
            pricingRule: 'NONE'
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: "Alex Demo (PM)",
      createdDate: "2024-02-15T10:00:00Z"
    },
    {
      id: "8" + Math.floor(100000 + Math.random() * 900000).toString(),
      name: "DEMO Product FY25 Desktop Quarterly",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Quarterly",
      priceGroup: {
        id: "9" + Math.floor(100000 + Math.random() * 900000).toString(),
        name: "PD_FY25_QUARTERLY",
        status: "Active",
        startDate: "2025-01-01",
        pricePoints: [
          {
            currencyCode: "USD", amount: 24.99, exchangeRate: 1.0, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "EUR", amount: 19.99, exchangeRate: 0.85, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "GBP", amount: 16.99, exchangeRate: 0.75, startDate: "2025-01-01",
            pricingRule: 'NONE'
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: "Alex Demo (PM)",
      createdDate: "2024-02-15T10:00:00Z"
    },
    {
      id: "8" + Math.floor(100000 + Math.random() * 900000).toString(),
      name: "DEMO Product FY25 iOS Annual",
      status: "Active",
      salesChannel: "iOS",
      billingCycle: "Annual",
      priceGroup: {
        id: "9" + Math.floor(100000 + Math.random() * 900000).toString(),
        name: "PD_FY25_ANNUAL",
        status: "Active",
        startDate: "2025-01-01",
        pricePoints: [
          {
            currencyCode: "USD", amount: 199.99, exchangeRate: 1.0, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "EUR", amount: 159.99, exchangeRate: 0.85, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "GBP", amount: 139.99, exchangeRate: 0.75, startDate: "2025-01-01",
            pricingRule: 'NONE'
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: "Alex Demo (PM)",
      createdDate: "2024-02-01T14:00:00Z"
    },
    {
      id: "8" + Math.floor(100000 + Math.random() * 900000).toString(),
      name: "DEMO Product FY25 Field Quarterly",
      status: "Active",
      salesChannel: "Field",
      billingCycle: "Quarterly",
      priceGroup: {
        id: "9" + Math.floor(100000 + Math.random() * 900000).toString(),
        name: "PD_FY25_QUARTERLY",
        status: "Active",
        startDate: "2025-01-01",
        pricePoints: [
          {
            currencyCode: "USD", amount: 74.99, exchangeRate: 1.0, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "EUR", amount: 59.99, exchangeRate: 0.85, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "GBP", amount: 51.99, exchangeRate: 0.75, startDate: "2025-01-01",
            pricingRule: 'NONE'
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: "Alex Demo (PM)",
      createdDate: "2024-03-15T10:00:00Z"
    },
    // SKUs generated from Live change requests
    {
      id: mockConfigurationRequests[5].generatedSkuId!,
      name: "DEMO Product FY25 iOS Monthly",
      status: "Active",
      salesChannel: "iOS",
      billingCycle: "Monthly",
      priceGroup: {
        id: mockConfigurationRequests[5].generatedPriceGroupId!,
        name: "PD_MOBILE_MONTHLY_EXP",
        status: "Active",
        startDate: "2025-01-01",
        pricePoints: [
          {
            currencyCode: "USD", amount: 19.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "EUR", amount: 16.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "GBP", amount: 14.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "configuration_request",
      createdBy: "Sarah Demo (Pricing)",
      createdDate: "2024-03-20T09:30:00Z",
      configurationRequestId: mockConfigurationRequests[5].id,
      lix: {
        key: "mobile_pricing_test_2024",
        treatment: "discount_treatment"
      }
    },
    {
      id: mockConfigurationRequests[6].generatedSkuId!,
      name: "DEMO Product FY25 Field Monthly",
      status: "Active",
      salesChannel: "Field",
      billingCycle: "Monthly",
      priceGroup: {
        id: mockConfigurationRequests[6].generatedPriceGroupId!,
        name: "PD_FIELD_MONTHLY_PREMIUM",
        status: "Active",
        startDate: "2025-01-01",
        pricePoints: [
          {
            currencyCode: "USD", amount: 89.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "EUR", amount: 74.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "GBP", amount: 64.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "configuration_request",
      createdBy: "Chris Demo (Engineering)",
      createdDate: "2024-03-18T11:45:00Z",
      configurationRequestId: mockConfigurationRequests[6].id,
      lix: {
        key: "premium_features_upsell",
        treatment: "enhanced_package"
      }
    },
    {
      id: mockConfigurationRequests[7].generatedSkuId!,
      name: "DEMO Product FY25 GPB Quarterly",
      status: "Active",
      salesChannel: "GPB",
      billingCycle: "Quarterly",
      priceGroup: {
        id: mockConfigurationRequests[7].generatedPriceGroupId!,
        name: "PD_MOBILE_QUARTERLY_CONTROL",
        status: "Active",
        startDate: "2025-01-01",
        pricePoints: [
          {
            currencyCode: "USD", amount: 59.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "EUR", amount: 49.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "GBP", amount: 42.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "configuration_request",
      createdBy: "Jordan Demo (Analytics)",
      createdDate: "2024-03-22T16:20:00Z",
      configurationRequestId: mockConfigurationRequests[7].id,
      lix: {
        key: "mobile_pricing_test_2024",
        treatment: "control"
      }
    },
    // Additional manual SKUs without LIX
    {
      id: "8" + Math.floor(100000 + Math.random() * 900000).toString(),
      name: "DEMO Product FY25 Desktop Weekly (Limited)",
      status: "Legacy",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      priceGroup: {
        id: "9" + Math.floor(100000 + Math.random() * 900000).toString(),
        name: "PD_WEEKLY_LIMITED",
        status: "Active",
        startDate: "2025-01-01",
        endDate: "2024-03-31",
        pricePoints: [
          {
            currencyCode: "USD", amount: 6.99, startDate: "2025-01-01", endDate: "2024-03-31",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "EUR", amount: 5.99, startDate: "2025-01-01", endDate: "2024-03-31",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "GBP", amount: 4.99, startDate: "2025-01-01", endDate: "2024-03-31",
            pricingRule: 'NONE'
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "manual",
      createdBy: "Pat Demo (Marketing)",
      createdDate: "2024-01-15T08:00:00Z"
    },
    // SKU from Field Annual Enterprise change request (no LIX)
    {
      id: mockConfigurationRequests[8].generatedSkuId!,
      name: "DEMO Product FY25 Field Annual",
      status: "Active",
      salesChannel: "Field",
      billingCycle: "Annual",
      priceGroup: {
        id: mockConfigurationRequests[8].generatedPriceGroupId!,
        name: "PD_ENTERPRISE_ANNUAL",
        status: "Active",
        startDate: "2025-01-01",
        pricePoints: [
          {
            currencyCode: "USD", amount: 899.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "EUR", amount: 799.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "GBP", amount: 699.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "configuration_request",
      createdBy: "Taylor Demo (Enterprise)",
      createdDate: "2024-02-20T13:30:00Z",
      configurationRequestId: mockConfigurationRequests[8].id
    },
    // SKU from Desktop Annual Biannual change request with LIX
    {
      id: mockConfigurationRequests[9].generatedSkuId!,
      name: "DEMO Product FY25 Desktop Annual",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Annual",
      priceGroup: {
        id: mockConfigurationRequests[9].generatedPriceGroupId!,
        name: "PD_BIANNUAL_EXPERIMENT",
        status: "Active",
        startDate: "2025-01-01",
        pricePoints: [
          {
            currencyCode: "USD", amount: 449.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "EUR", amount: 379.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          },
          {
            currencyCode: "GBP", amount: 329.99, startDate: "2025-01-01",
            pricingRule: 'NONE'
          }
        ]
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "YES_MANUAL", description: "Manual refund" },
      origin: "configuration_request",
      createdBy: "Mike Demo (Product)",
      createdDate: "2024-03-25T14:15:00Z",
      configurationRequestId: mockConfigurationRequests[9].id,
      lix: {
        key: "extended_billing_cycle_test",
        treatment: "biannual_option"
      }
    }
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
        startDate: "2025-01-01",
        pricePoints: [
          { 
            id: "6485069", 
            currencyCode: "USD", 
            amount: 169.99, 
            startDate: "2025-01-01",
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
            startDate: "2025-01-01",
            pricingRule: "SLAB",
            minQuantity: 2,
            priceType: "BASE_AMOUNT",
            isTaxInclusive: false
          },
          { 
            id: "6485169", 
            currencyCode: "EUR", 
            amount: 140.49, 
            startDate: "2025-01-01",
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
            startDate: "2025-01-01",
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
        startDate: "2025-01-01",
        pricePoints: [
          { 
            id: "6485089", 
            currencyCode: "USD", 
            amount: 1679.88, 
            startDate: "2025-01-01",
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
            startDate: "2025-01-01",
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
        startDate: "2025-01-01",
        pricePoints: [
          { 
            id: "6336603", 
            currencyCode: "USD", 
            amount: 169.99, 
            startDate: "2025-01-01",
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
        startDate: "2025-01-01",
        pricePoints: [
          { 
            id: "6336613", 
            currencyCode: "USD", 
            amount: 1679.88, 
            startDate: "2025-01-01",
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