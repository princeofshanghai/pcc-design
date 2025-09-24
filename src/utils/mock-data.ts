// This file will contain all the mock data for the PCC prototype.
// It will serve as our single source of truth for products, SKUs, etc. 

import type { Product, Attribute, GTMMotion, GTMMotionStatus } from './types';
// @ts-ignore - PriceGroup type is used in inline object definitions
import type { PriceGroup } from './types';
import { TEAM_MEMBERS } from './users';
import { processPricePointStatuses } from './pricingUtils';

// PriceGroup type is used in inline object definitions below

// Define the folder structure independently of products
// This allows us to show empty folders in the sidebar
export const folderStructure = {
  "Premium": [
    "Premium Core",
    "Premium Multiseat", 
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
    "Sales Navigator",
    "Sales Insights"
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
    folder: 'Premium Core',
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
    totalActiveContracts: 4100000,
    totalSubscriptions: 4100000,
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
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/sa',
    productUrl: 'https://www.linkedin.com/talent/recruiter-lite',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    totalActiveContracts: 7500,
    totalSubscriptions: 7500,
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
    totalActiveContracts: 8500,
    totalSubscriptions: 8500,
    skus: [],
  },
  {
    id: '5073467',
    name: 'Sales Navigator Advanced',
    description: 'Forge deeper relationships by leveraging real-time sales intelligence and seamless collaboration with your team. Receive relevant, accurate insights on buyer interest and enhance the experience of other sales tools by embedding LinkedIn insights. Includes 50 InMail messages per month, Buyer Interest, BI Integrations, List Sharing, Smart Links, TeamLink, and other features.',
    lob: 'LSS',
    folder: 'Sales Navigator',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://business.linkedin.com/sales-solutions/sales-navigator',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: [
      'InMail messages (50/month)',
      'Buyer Interest insights',
      'BI Integrations', 
      'List Sharing',
      'Smart Links',
      'TeamLink',
      'Advanced search filters',
      'Real-time sales intelligence',
      'Team collaboration tools',
      'CRM sync capabilities'
    ],
    code: 'SalesNavAdvanced',
    family: 'SALESPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://business.linkedin.com/sales-solutions/sales-navigator',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    totalActiveContracts: 92400,
    totalSubscriptions: 92400,
    skus: [],
  },
  {
    id: '113000',
    name: 'Sales Navigator Advanced',
    description: 'Forge deeper relationships by leveraging real-time sales intelligence and seamless collaboration with your team. Receive relevant, accurate insights on buyer interest and enhance the experience of other sales tools by embedding LinkedIn insights. Includes 50 InMail messages per month, Buyer Interest, BI Integrations, List Sharing, Smart Links, TeamLink, and other features.',
    lob: 'LSS',
    folder: 'Sales Navigator',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://business.linkedin.com/sales-solutions/sales-navigator',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: [
      'InMail messages (50/month)',
      'Buyer Interest insights',
      'BI Integrations', 
      'List Sharing',
      'Smart Links',
      'TeamLink',
      'Advanced search filters',
      'Real-time sales intelligence',
      'Team collaboration tools',
      'CRM sync capabilities'
    ],
    code: 'SalesNavAdvanced113000',
    family: 'SALESPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://business.linkedin.com/sales-solutions/sales-navigator',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    totalActiveContracts: 3870,
    totalSubscriptions: 3870,
    skus: [],
  },
  {
    id: '5095305',
    name: 'Sales Navigator Core',
    description: 'Build trusted relationships by using the power of LinkedIn data to find, research, and communicate with customers/prospects. Identify targets quickly and connect with them faster. Includes 50 InMail messages per month, advanced search filters, real-time alerts and other foundational features.',
    lob: 'LSS',
    folder: 'Sales Navigator',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://business.linkedin.com/sales-solutions/sales-navigator/core',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: [
      'InMail messages (50/month)',
      'Advanced search filters',
      'Real-time alerts',
      'Lead recommendations',
      'Save leads and accounts',
      'Notes and tags',
      'Basic LinkedIn data access',
      'Mobile app access'
    ],
    code: 'SalesNavCore5095305',
    family: 'SALESPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://business.linkedin.com/sales-solutions/sales-navigator/core',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    totalActiveContracts: 1500000,
    totalSubscriptions: 1500000,
    skus: [],
  },
  {
    id: '5106528',
    name: 'Sales Navigator Core',
    description: 'Build trusted relationships by using the power of LinkedIn data to find, research, and communicate with customers/prospects. Identify targets quickly and connect with them faster. Includes 50 InMail messages per month, advanced search filters, real-time alerts and other foundational features.',
    lob: 'LSS',
    folder: 'Sales Navigator',
    status: 'Inactive',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://business.linkedin.com/sales-solutions/sales-navigator/core',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: [
      'InMail messages (50/month)',
      'Advanced search filters',
      'Real-time alerts',
      'Lead recommendations',
      'Save leads and accounts',
      'Notes and tags',
      'Basic LinkedIn data access',
      'Mobile app access'
    ],
    code: 'SalesNavCore5106528',
    family: 'SALESPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://business.linkedin.com/sales-navigator/core',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    totalActiveContracts: 583,
    totalSubscriptions: 583,
    skus: [],
  },
  {
    id: '5125000',
    name: 'Sales Navigator Advanced Plus',
    description: 'Strengthen relationships with customized intelligence generated through an integrated experience across Sales Navigator, CRM, and your sales tools. Improve sales effectiveness and productivity by automating key processes and leveraging better data to inform decision making. Includes 50 InMail Messages per month, CRM Lead and Contact Creation, CRM Activity writeback and other features.',
    lob: 'LSS',
    folder: 'Sales Navigator',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://business.linkedin.com/sales-solutions/sales-navigator/advanced-plus',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: [
      'InMail Messages (50/month)',
      'CRM Lead and Contact Creation',
      'CRM Activity writeback',
      'Customized intelligence',
      'Sales Navigator + CRM integration',
      'Automated key processes',
      'Enhanced data insights',
      'Advanced decision-making tools',
      'Sales effectiveness analytics',
      'Productivity automation'
    ],
    code: 'SalesNavAdvancedPlus',
    family: 'SALESPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://business.linkedin.com/sales-solutions/sales-navigator/advanced-plus',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
  },
  {
    id: '5095295',
    name: 'Premium Business',
    description: 'Get exclusive access to insights, search tools, and direct messaging to reach the right people to grow your business.',
    lob: 'Premium',
    folder: 'Premium Core',
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
    features: [
      'Unlimited LinkedIn Learning access',
      'Advanced search filters',
      'Direct messaging',
      'Business insights',
      'InMail credits (15)',
      'Who viewed your profile',
      'Applicant insights',
      'Salary insights',
      'Business growth tools',
      'Premium support'
    ],
    code: 'PremiumBusiness',
    family: 'SUBPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/premium/business',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    totalActiveContracts: 2300000,
    totalSubscriptions: 2300000,
    skus: [],
  },
  {
    id: '10036',
    name: 'Premium Career Subscription',
    description: 'Complete career advancement bundle combining Premium Career benefits with LinkedIn Learning and additional professional development tools. Get unlimited access to courses, exclusive job insights, expanded InMail credits, and advanced career growth features.',
    lob: 'Premium',
    folder: 'Premium Core',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/premium/career-subscription/',
    seatType: 'Single seat',
    isBundle: true,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: [
      'Premium Career access',
      'Unlimited LinkedIn Learning',
      'Enhanced InMail credits (25)',
      'Advanced job insights',
      'Salary insights and trends',
      'Career advice and coaching content',
      'Skills assessments and badges',
      'Private profile browsing',
      'Extended profile views history',
      'Priority customer support',
      'Professional development tracking',
      'Exclusive webinars and events'
    ],
    code: 'PremiumCareerBundle',
    family: 'BUNDLEPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/premium/career-subscription',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
  },
  {
    id: '5255644',
    name: 'Premium Business Suite',
    description: 'Comprehensive business solution designed for small businesses to build their brand, find talent, and grow their network. Includes advanced business insights, expanded search capabilities, enhanced messaging tools, and team collaboration features.',
    lob: 'Premium',
    folder: 'Premium Small Business',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/premium/business-suite/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: [
      'Advanced business insights',
      'Expanded search filters',
      'Enhanced messaging tools',
      'InMail credits (20)',
      'Company page analytics',
      'Team collaboration features',
      'Lead generation tools',
      'Industry benchmarking',
      'Business network growth',
      'Premium customer support'
    ],
    code: 'PremiumBusinessSuite',
    family: 'SUBPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/premium/business-suite',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [],
  },
  {
    id: '5124922',
    name: 'Premium Company Page',
    description: 'Enhance your company\'s LinkedIn presence with advanced company page features, detailed analytics, and powerful tools to attract top talent and grow your business. Build your brand, showcase your culture, and reach your target audience effectively.',
    lob: 'Premium',
    folder: 'Premium Company Page',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/premium/company-page/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    features: [
      'Advanced company page analytics',
      'Talent brand spotlight',
      'Custom company page themes',
      'Employee advocacy tools',
      'Targeted company updates',
      'Company page visitor insights',
      'Enhanced follower demographics',
      'Brand awareness campaigns',
      'Recruitment marketing tools',
      'Premium support'
    ],
    code: 'PremiumCompanyPage',
    family: 'SUBPKG',
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/premium/company-page',
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
      activeContracts: 0,
      subscriptions: 1350000,
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
      // SKU-level overrides to test Override Summary functionality
      paymentFailureFreeToPaidGracePeriod: 7, // Override: Product default is 0
      paymentFailurePaidToPaidGracePeriod: 14, // Override: Product default is 7
      isVisibleOnRenewalEmails: false, // Override: Product default is true
      origin: "manual",
      createdBy: "System",
      createdDate: "2021-03-01T08:00:00Z"
    },
    {
      id: "8435006",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Annual",
      activeContracts: 0,
      subscriptions: 1080000,
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
      createdBy: TEAM_MEMBERS.CHARLES_HU.fullName,
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

// Add SKUs to Sales Navigator Advanced product
const salesNavAdvancedProduct = rawMockProducts.find((p: Product) => p.id === '5073467');
if (salesNavAdvancedProduct) {
  salesNavAdvancedProduct.skus = [
    {
      id: "sna-monthly-001",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      priceGroup: {
        id: "SNA_MONTHLY",
        name: "SNA_FY25_MONTHLY_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "sna-pp-001", 
            currencyCode: "USD", 
            amount: 79.99, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    {
      id: "sna-annual-001",
      status: "Active",
      salesChannel: "Desktop", 
      billingCycle: "Annual",
      priceGroup: {
        id: "SNA_ANNUAL",
        name: "SNA_FY25_ANNUAL_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "sna-pp-002", 
            currencyCode: "USD", 
            amount: 959.88, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    }
  ];
}

// Add SKUs to Sales Navigator Advanced product (ID: 113000) 
const salesNavAdvanced113000Product = rawMockProducts.find((p: Product) => p.id === '113000');
if (salesNavAdvanced113000Product) {
  salesNavAdvanced113000Product.skus = [
    {
      id: "sna-field-annual-001",
      status: "Active",
      salesChannel: "Field",
      billingCycle: "Annual",
      activeContracts: 6500,
      subscriptions: 0,
      priceGroup: {
        id: "SNA_FIELD_ANNUAL",
        name: "SNA_FY25_FIELD_ANNUAL_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "sna-field-pp-001", 
            currencyCode: "USD", 
            amount: 1199.99, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    }
  ];
}

// Add SKUs to Sales Navigator Core product (ID: 5095305) - Active status
const salesNavCore5095305Product = rawMockProducts.find((p: Product) => p.id === '5095305');
if (salesNavCore5095305Product) {
  salesNavCore5095305Product.skus = [
    {
      id: "snc-5095305-monthly",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      priceGroup: {
        id: "SNC_5095305_MONTHLY",
        name: "SNC_FY25_MONTHLY_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "snc-5095305-pp-monthly", 
            currencyCode: "USD", 
            amount: 59.99, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    {
      id: "snc-5095305-annual",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Annual",
      priceGroup: {
        id: "SNC_5095305_ANNUAL",
        name: "SNC_FY25_ANNUAL_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "snc-5095305-pp-annual", 
            currencyCode: "USD", 
            amount: 719.88, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    }
  ];
}

// Add SKUs to Sales Navigator Core product (ID: 5106528) - Inactive status
const salesNavCore5106528Product = rawMockProducts.find((p: Product) => p.id === '5106528');
if (salesNavCore5106528Product) {
  salesNavCore5106528Product.skus = [
    {
      id: "snc-5106528-monthly",
      status: "Inactive",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      priceGroup: {
        id: "SNC_5106528_MONTHLY",
        name: "SNC_FY25_MONTHLY_SIMPLE_INACTIVE",
        status: "Inactive",
        pricePoints: [
          { 
            id: "snc-5106528-pp-monthly", 
            currencyCode: "USD", 
            amount: 59.99, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    {
      id: "snc-5106528-annual",
      status: "Inactive",
      salesChannel: "Desktop",
      billingCycle: "Annual",
      priceGroup: {
        id: "SNC_5106528_ANNUAL",
        name: "SNC_FY25_ANNUAL_SIMPLE_INACTIVE",
        status: "Inactive",
        pricePoints: [
          { 
            id: "snc-5106528-pp-annual", 
            currencyCode: "USD", 
            amount: 719.88, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    }
  ];
}

// Add SKUs to Sales Navigator Advanced Plus product (ID: 5125000)
const salesNavAdvancedPlusProduct = rawMockProducts.find((p: Product) => p.id === '5125000');
if (salesNavAdvancedPlusProduct) {
  salesNavAdvancedPlusProduct.skus = [
    {
      id: "snap-field-annual-001",
      status: "Active",
      salesChannel: "Field",
      billingCycle: "Annual",
      activeContracts: 8500,
      subscriptions: 0,
      priceGroup: {
        id: "SNAP_FIELD_ANNUAL",
        name: "SNAP_FY25_FIELD_ANNUAL_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "snap-field-pp-001", 
            currencyCode: "USD", 
            amount: 1599.99, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    }
  ];
}

// Add SKUs to Premium Business product (ID: 5095295)
const premiumBusinessProduct = rawMockProducts.find((p: Product) => p.id === '5095295');
if (premiumBusinessProduct) {
  premiumBusinessProduct.skus = [
    // Desktop Monthly
    {
      id: "pb-desktop-monthly-001",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      activeContracts: 0,
      subscriptions: 2300000,
      priceGroup: {
        id: "PB_DESKTOP_MONTHLY",
        name: "PB_FY25_DESKTOP_MONTHLY_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pb-desktop-monthly-pp-001", 
            currencyCode: "USD", 
            amount: 59.99, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // Desktop Annual
    {
      id: "pb-desktop-annual-001",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Annual",
      priceGroup: {
        id: "PB_DESKTOP_ANNUAL",
        name: "PB_FY25_DESKTOP_ANNUAL_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pb-desktop-annual-pp-001", 
            currencyCode: "USD", 
            amount: 719.88, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // iOS Monthly
    {
      id: "pb-ios-monthly-001",
      status: "Active",
      salesChannel: "iOS",
      billingCycle: "Monthly",
      activeContracts: 0,
      subscriptions: 720000,
      priceGroup: {
        id: "PB_IOS_MONTHLY",
        name: "PB_FY25_IOS_MONTHLY_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pb-ios-monthly-pp-001", 
            currencyCode: "USD", 
            amount: 59.99, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // iOS Annual
    {
      id: "pb-ios-annual-001",
      status: "Active",
      salesChannel: "iOS",
      billingCycle: "Annual",
      activeContracts: 0,
      subscriptions: 530000,
      priceGroup: {
        id: "PB_IOS_ANNUAL",
        name: "PB_FY25_IOS_ANNUAL_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pb-ios-annual-pp-001", 
            currencyCode: "USD", 
            amount: 719.88, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // GPB Monthly
    {
      id: "pb-gpb-monthly-001",
      status: "Active",
      salesChannel: "GPB",
      billingCycle: "Monthly",
      activeContracts: 0,
      subscriptions: 250000,
      priceGroup: {
        id: "PB_GPB_MONTHLY",
        name: "PB_FY25_GPB_MONTHLY_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pb-gpb-monthly-pp-001", 
            currencyCode: "USD", 
            amount: 59.99, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // GPB Annual
    {
      id: "pb-gpb-annual-001",
      status: "Active",
      salesChannel: "GPB",
      billingCycle: "Annual",
      activeContracts: 0,
      subscriptions: 170000,
      priceGroup: {
        id: "PB_GPB_ANNUAL",
        name: "PB_FY25_GPB_ANNUAL_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pb-gpb-annual-pp-001", 
            currencyCode: "USD", 
            amount: 719.88, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    }
  ];
}

// Add SKUs to Premium Career Subscription bundle (ID: 10036)
const premiumCareerBundleProduct = rawMockProducts.find((p: Product) => p.id === '10036');
if (premiumCareerBundleProduct) {
  premiumCareerBundleProduct.skus = [
    // Desktop Monthly
    {
      id: "pcb-desktop-monthly-001",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      activeContracts: 0,
      subscriptions: 800000,
      priceGroup: {
        id: "PCB_DESKTOP_MONTHLY",
        name: "PCB_FY25_DESKTOP_MONTHLY_BUNDLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pcb-desktop-monthly-pp-001", 
            currencyCode: "USD", 
            amount: 79.99, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // Desktop Annual
    {
      id: "pcb-desktop-annual-001",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Annual",
      priceGroup: {
        id: "PCB_DESKTOP_ANNUAL",
        name: "PCB_FY25_DESKTOP_ANNUAL_BUNDLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pcb-desktop-annual-pp-001", 
            currencyCode: "USD", 
            amount: 959.88, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // iOS Monthly
    {
      id: "pcb-ios-monthly-001",
      status: "Active",
      salesChannel: "iOS",
      billingCycle: "Monthly",
      priceGroup: {
        id: "PCB_IOS_MONTHLY",
        name: "PCB_FY25_IOS_MONTHLY_BUNDLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pcb-ios-monthly-pp-001", 
            currencyCode: "USD", 
            amount: 79.99, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // iOS Annual
    {
      id: "pcb-ios-annual-001",
      status: "Active",
      salesChannel: "iOS",
      billingCycle: "Annual",
      priceGroup: {
        id: "PCB_IOS_ANNUAL",
        name: "PCB_FY25_IOS_ANNUAL_BUNDLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pcb-ios-annual-pp-001", 
            currencyCode: "USD", 
            amount: 959.88, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // GPB Monthly
    {
      id: "pcb-gpb-monthly-001",
      status: "Active",
      salesChannel: "GPB",
      billingCycle: "Monthly",
      priceGroup: {
        id: "PCB_GPB_MONTHLY",
        name: "PCB_FY25_GPB_MONTHLY_BUNDLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pcb-gpb-monthly-pp-001", 
            currencyCode: "USD", 
            amount: 79.99, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // GPB Annual
    {
      id: "pcb-gpb-annual-001",
      status: "Active",
      salesChannel: "GPB",
      billingCycle: "Annual",
      priceGroup: {
        id: "PCB_GPB_ANNUAL",
        name: "PCB_FY25_GPB_ANNUAL_BUNDLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pcb-gpb-annual-pp-001", 
            currencyCode: "USD", 
            amount: 959.88, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    }
  ];
}

// Add SKUs to Premium Business Suite product (ID: 5255644)
const premiumBusinessSuiteProduct = rawMockProducts.find((p: Product) => p.id === '5255644');
if (premiumBusinessSuiteProduct) {
  premiumBusinessSuiteProduct.skus = [
    // Desktop Monthly
    {
      id: "pbs-desktop-monthly-001",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      priceGroup: {
        id: "PBS_DESKTOP_MONTHLY",
        name: "PBS_FY25_DESKTOP_MONTHLY_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pbs-desktop-monthly-pp-001", 
            currencyCode: "USD", 
            amount: 69.99, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // Desktop Annual
    {
      id: "pbs-desktop-annual-001",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Annual",
      priceGroup: {
        id: "PBS_DESKTOP_ANNUAL",
        name: "PBS_FY25_DESKTOP_ANNUAL_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pbs-desktop-annual-pp-001", 
            currencyCode: "USD", 
            amount: 839.88, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    }
  ];
}

// Add SKUs to Premium Company Page product (ID: 5124922)
const premiumCompanyPageProduct = rawMockProducts.find((p: Product) => p.id === '5124922');
if (premiumCompanyPageProduct) {
  premiumCompanyPageProduct.skus = [
    // Desktop Monthly
    {
      id: "pcp-desktop-monthly-001",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Monthly",
      priceGroup: {
        id: "PCP_DESKTOP_MONTHLY",
        name: "PCP_FY25_DESKTOP_MONTHLY_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pcp-desktop-monthly-pp-001", 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // Desktop Annual
    {
      id: "pcp-desktop-annual-001",
      status: "Active",
      salesChannel: "Desktop",
      billingCycle: "Annual",
      priceGroup: {
        id: "PCP_DESKTOP_ANNUAL",
        name: "PCP_FY25_DESKTOP_ANNUAL_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pcp-desktop-annual-pp-001", 
            currencyCode: "USD", 
            amount: 599.88, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // iOS Monthly
    {
      id: "pcp-ios-monthly-001",
      status: "Active",
      salesChannel: "iOS",
      billingCycle: "Monthly",
      priceGroup: {
        id: "PCP_IOS_MONTHLY",
        name: "PCP_FY25_IOS_MONTHLY_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pcp-ios-monthly-pp-001", 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // iOS Annual
    {
      id: "pcp-ios-annual-001",
      status: "Active",
      salesChannel: "iOS",
      billingCycle: "Annual",
      priceGroup: {
        id: "PCP_IOS_ANNUAL",
        name: "PCP_FY25_IOS_ANNUAL_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pcp-ios-annual-pp-001", 
            currencyCode: "USD", 
            amount: 599.88, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // GPB Monthly
    {
      id: "pcp-gpb-monthly-001",
      status: "Active",
      salesChannel: "GPB",
      billingCycle: "Monthly",
      priceGroup: {
        id: "PCP_GPB_MONTHLY",
        name: "PCP_FY25_GPB_MONTHLY_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pcp-gpb-monthly-pp-001", 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    },
    // GPB Annual
    {
      id: "pcp-gpb-annual-001",
      status: "Active",
      salesChannel: "GPB",
      billingCycle: "Annual",
      priceGroup: {
        id: "PCP_GPB_ANNUAL",
        name: "PCP_FY25_GPB_ANNUAL_SIMPLE",
        status: "Active",
        pricePoints: [
          { 
            id: "pcp-gpb-annual-pp-001", 
            currencyCode: "USD", 
            amount: 599.88, 
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
      createdBy: TEAM_MEMBERS.LUXI_KANAZIR.fullName,
      createdDate: "2025-01-01T00:00:00Z"
    }
  ];
}

// Add SKUs to Recruiter Corporate product (ID: 130200)
const recruiterCorporateProduct = rawMockProducts.find((p: Product) => p.id === '130200');
if (recruiterCorporateProduct) {
  recruiterCorporateProduct.skus = [
    {
      id: "8435006", // Unique ID for Recruiter Corporate
      status: "Active",
      salesChannel: "Field",
      billingCycle: "Annual",
      activeContracts: 850,
      subscriptions: 8500,
      priceGroup: {
        id: "1602004",
        status: "Active",
        pricePoints: [] // Will be loaded from JSON
      },
      revenueRecognition: "Accrual",
      switcherLogic: [],
      refundPolicy: { id: "NO_CREDIT", description: "No refund policy" },
      origin: "manual",
      createdBy: "System",
      createdDate: "2023-07-02T07:00:00Z"
    }
  ];
}

// Add 10 Demo Products for UI scaling testing
const demoProducts: Product[] = [
  {
    id: '0000001',
    name: 'Test',
    description: 'Demo product for UI scaling testing - Desktop only',
    lob: 'Premium',
    folder: 'Premium Core',
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
    name: 'Test',
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
    name: 'Test',
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
        activeContracts: 150,
        subscriptions: 0,
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
    name: 'Test',
    description: 'Demo product for UI scaling testing - Desktop only',
    lob: 'Premium',
    folder: 'Premium Multiseat',
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
    name: 'Test',
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
    name: 'Test',
    description: 'Demo product for UI scaling testing - Field only',
    lob: 'LSS',
    folder: 'Sales Navigator',
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
    name: 'Test',
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
    name: 'Test',
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
    name: 'Test',
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
    name: 'Test',
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

// Mock GTM Motion data for price editing workflow
export const mockGTMMotions: GTMMotion[] = [
  {
    id: "GTM001",
    name: "Q1 2024 Field Pricing Updates",
    description: "Quarterly price adjustments for field sales channels based on market analysis and competitive positioning",
    activationDate: "2024-03-01T09:00:00Z",
    status: "Draft" as GTMMotionStatus,
    createdBy: "lkanazir",
    createdDate: "2024-01-15T14:30:00Z",
    updatedDate: "2024-01-18T09:15:00Z",
    items: [
      {
        id: "gtm-item-001-1",
        type: "Price",
        productId: "premium-multiseat-1", 
        productName: "Premium Multiseat",
        details: "Updated price",
        status: "Approved",
        approvalRequirements: [
          {
            team: "Pricing",
            status: "Approved",
            approvedBy: "pricing.team",
            approvedDate: "2024-01-16T10:30:00Z"
          }
        ],
        createdBy: "lkanazir",
        createdDate: "2024-01-15T15:00:00Z",
        priceChange: {
          id: "pc-001-1",
          productId: "premium-multiseat-1",
          context: {
            productId: "premium-multiseat-1",
            channel: "Field",
            billingCycle: "Monthly",
            validityPeriod: {
              validFrom: "2024-03-01T00:00:00Z"
            },
            seatRange: {
              minQuantity: 1,
              maxQuantity: 100
            },
            pricingTier: "Standard",
            priceGroupAction: "update",
            selectedPriceGroup: {
              id: "pg-premium-multiseat-field-monthly-001",
              name: "Premium Multiseat Field Monthly"
            }
          },
          currencyChanges: [
            {
              currencyCode: "USD",
              currentAmount: 59.99,
              newAmount: 64.99,
              changeAmount: 5.00,
              changePercentage: 8.33
            },
            {
              currencyCode: "EUR", 
              currentAmount: 54.99,
              newAmount: 59.99,
              changeAmount: 5.00,
              changePercentage: 9.09
            },
            {
              currencyCode: "GBP",
              currentAmount: 49.99,
              newAmount: 54.99,
              changeAmount: 5.00,
              changePercentage: 10.00
            }
          ],
          impactType: "UPDATE_EXISTING_SKU",
          targetSkuId: "sku-premium-multiseat-field-monthly",
          createdBy: "lkanazir",
          createdDate: "2024-01-15T15:00:00Z",
          status: "Draft"
        }
      },
      {
        id: "gtm-item-001-2",
        type: "Product description",
        productId: "premium-multiseat-1",
        productName: "Premium Multiseat", 
        details: "Updated product description",
        status: "Pending approvals",
        beforeValue: "Scale your business with LinkedIn's premier recruiting solution, designed for teams.",
        afterValue: "Scale your business with LinkedIn's premier recruiting solution, designed for growing teams and enterprises.",
        approvalRequirements: [
          {
            team: "Legal",
            status: "Approved",
            approvedBy: "legal.team",
            approvedDate: "2024-01-17T14:20:00Z"
          },
          {
            team: "Tax",
            status: "Approved", 
            approvedBy: "tax.team",
            approvedDate: "2024-01-17T09:15:00Z"
          },
          {
            team: "StratFin",
            status: "Pending"
          },
          {
            team: "Revenue",
            status: "Approved",
            approvedBy: "revenue.team", 
            approvedDate: "2024-01-18T11:45:00Z"
          }
        ],
        createdBy: "lkanazir",
        createdDate: "2024-01-15T15:30:00Z"
      }
    ]
  },
  {
    id: "GTM002", 
    name: "Mobile App Pricing Experiment",
    description: "A/B test for mobile subscription pricing to optimize conversion rates",
    activationDate: "2024-02-15T12:00:00Z",
    status: "Review in Progress" as GTMMotionStatus,
    createdBy: "jbader",
    createdDate: "2024-01-10T11:20:00Z",
    updatedDate: "2024-01-20T16:45:00Z", 
    items: [
      {
        id: "gtm-item-002-1",
        type: "Price",
        productId: "premium-core-1",
        productName: "Premium Core",
        details: "New experimental price",
        status: "Pending approvals",
        approvalRequirements: [
          {
            team: "Pricing",
            status: "Pending"
          }
        ],
        createdBy: "jbader",
        createdDate: "2024-01-10T11:30:00Z",
        priceChange: {
          id: "pc-002-1",
          productId: "premium-core-1",
          context: {
            productId: "premium-core-1",
            channel: "Desktop",
            billingCycle: "Annual",
            validityPeriod: {
              validFrom: "2024-02-01T00:00:00Z"
            },
            seatRange: {
              minQuantity: 1,
              maxQuantity: 50
            },
            pricingTier: "Standard",
            priceGroupAction: "create",
            selectedPriceGroup: undefined
          },
          currencyChanges: [
            {
              currencyCode: "USD",
              currentAmount: 0,
              newAmount: 299.99,
              changeAmount: 299.99,
              changePercentage: 100
            },
            {
              currencyCode: "EUR", 
              currentAmount: 0,
              newAmount: 279.99,
              changeAmount: 279.99,
              changePercentage: 100
            }
          ],
          impactType: "CREATE_NEW_SKU",
          targetSkuId: undefined,
          createdBy: "jbader",
          createdDate: "2024-01-10T11:30:00Z",
          status: "Draft"
        }
      },
      {
        id: "gtm-item-002-2", 
        type: "Feature",
        productId: "premium-core-1",
        productName: "Premium Core",
        details: "A/B test feature toggle",
        status: "Pending approvals",
        beforeValue: "Advanced search filters (disabled)",
        afterValue: "Advanced search filters (enabled for 50% of users)",
        approvalRequirements: [
          {
            team: "Legal",
            status: "Pending"
          },
          {
            team: "Product",
            status: "Approved",
            approvedBy: "product.team",
            approvedDate: "2024-01-11T16:00:00Z"
          }
        ],
        createdBy: "jbader",
        createdDate: "2024-01-10T12:00:00Z"
      }
    ]
  },
  {
    id: "GTM003",
    name: "Enterprise Tier Price Restructure", 
    description: "Major pricing overhaul for enterprise customers with new tier structure and volume discounts",
    activationDate: "2024-04-01T08:00:00Z",
    status: "Scheduled for Activation" as GTMMotionStatus,
    createdBy: "ahoman",
    createdDate: "2023-12-01T09:00:00Z",
    updatedDate: "2024-01-05T14:30:00Z",
    items: [
      {
        id: "gtm-item-003-1",
        type: "Price",
        productId: "premium-enterprise-1",
        productName: "Premium Enterprise",
        details: "New tier pricing",
        status: "Draft",
        approvalRequirements: [
          {
            team: "Pricing",
            status: "Pending"
          },
          {
            team: "Revenue",
            status: "Pending"
          }
        ],
        createdBy: "ahoman",
        createdDate: "2023-12-01T10:00:00Z"
      }
    ]
  },
  {
    id: "GTM004",
    name: "Currency Parity Adjustment",
    description: "Adjusting European and Canadian pricing to account for exchange rate fluctuations",
    activationDate: "2024-01-31T10:00:00Z", 
    status: "Completed" as GTMMotionStatus,
    createdBy: "geso",
    createdDate: "2024-01-08T13:15:00Z",
    updatedDate: "2024-01-25T11:00:00Z",
    items: [
      {
        id: "gtm-item-004-1",
        type: "Price",
        productId: "premium-core-1",
        productName: "Premium Core",
        details: "EUR/CAD currency adjustment",
        status: "Approved",
        approvalRequirements: [
          {
            team: "Pricing",
            status: "Approved",
            approvedBy: "pricing.team",
            approvedDate: "2024-01-20T09:30:00Z"
          }
        ],
        createdBy: "geso",
        createdDate: "2024-01-08T14:00:00Z"
      }
    ]
  },
  {
    id: "GTM005",
    name: "Holiday Promotion Pricing",
    description: "Special promotional pricing for year-end holiday campaign",
    activationDate: "2023-12-01T00:00:00Z",
    status: "Cancelled" as GTMMotionStatus,
    createdBy: "chhu",
    createdDate: "2023-11-01T10:30:00Z", 
    updatedDate: "2024-01-02T09:00:00Z",
    items: [
      {
        id: "gtm-item-005-1",
        type: "Price",
        productId: "premium-core-1",
        productName: "Premium Core",
        details: "Holiday discount pricing",
        status: "Ready for deployment",
        approvalRequirements: [
          {
            team: "Pricing",
            status: "Approved",
            approvedBy: "pricing.team",
            approvedDate: "2023-11-15T11:00:00Z"
          },
          {
            team: "Revenue",
            status: "Approved", 
            approvedBy: "revenue.team",
            approvedDate: "2023-11-18T14:30:00Z"
          }
        ],
        createdBy: "chhu",
        createdDate: "2023-11-01T11:00:00Z"
      },
      {
        id: "gtm-item-005-2",
        type: "Product name",
        productId: "premium-core-1",
        productName: "Premium Core",
        details: "Holiday marketing product name",
        status: "Ready for deployment",
        beforeValue: "Premium Core",
        afterValue: "Premium Core Holiday Edition",
        approvalRequirements: [
          {
            team: "Legal",
            status: "Approved",
            approvedBy: "legal.team",
            approvedDate: "2023-11-20T10:15:00Z"
          }
        ],
        createdBy: "chhu",
        createdDate: "2023-11-01T11:15:00Z"
      }
    ]
  },
  {
    id: "GTM006",
    name: "B2B Platform Tier Rollout",
    description: "New tiered pricing structure for B2B platform with enhanced features and usage-based billing",
    activationDate: "2024-05-01T10:00:00Z",
    status: "Submitted" as GTMMotionStatus,
    createdBy: "lkanazir",
    createdDate: "2024-02-10T08:30:00Z",
    updatedDate: "2024-02-12T14:45:00Z",
    items: [
      {
        id: "gtm-item-006-1",
        type: "Price",
        productId: "business-platform-pro",
        productName: "Business Platform Pro",
        details: "Tier 1: $199/month, Tier 2: $399/month, usage overage: $0.05/unit",
        status: "Draft",
        approvalRequirements: [
          {
            team: "Product",
            status: "Pending"
          },
          {
            team: "Pricing",
            status: "Pending"
          }
        ],
        createdBy: "lkanazir",
        createdDate: "2024-02-10T08:30:00Z"
      }
    ]
  },
  {
    id: "GTM007", 
    name: "International Market Expansion Pricing",
    description: "Localized pricing strategy for expansion into APAC markets with currency and purchasing power adjustments",
    activationDate: "2024-06-15T07:00:00Z",
    status: "Activating in EI" as GTMMotionStatus,
    createdBy: "jbader",
    createdDate: "2024-03-01T10:15:00Z",
    updatedDate: "2024-03-18T16:20:00Z",
    items: [
      {
        id: "gtm-item-007-1",
        type: "Price",
        productId: "premium-enterprise-apac",
        productName: "Premium Enterprise (APAC)",
        details: "Singapore: $899 SGD, Japan: ¥89,900, Australia: $799 AUD",
        status: "Ready for deployment",
        approvalRequirements: [
          {
            team: "Legal",
            status: "Approved"
          },
          {
            team: "StratFin",
            status: "Approved"
          }
        ],
        createdBy: "jbader",
        createdDate: "2024-03-01T10:15:00Z"
      }
    ]
  },
  {
    id: "GTM008",
    name: "Startup Package Discount Program",
    description: "Special pricing program for qualified startups with 50% discount for first year and graduated pricing thereafter",
    activationDate: "2024-04-20T12:00:00Z", 
    status: "Ready for Approvals" as GTMMotionStatus,
    createdBy: "ahoman",
    createdDate: "2024-03-05T09:45:00Z",
    updatedDate: "2024-03-15T11:30:00Z",
    items: [
      {
        id: "gtm-item-008-1",
        type: "Price",
        productId: "startup-essentials",
        productName: "Startup Essentials",
        details: "Year 1: $49/month (50% off), Year 2: $79/month, Year 3+: $99/month",
        status: "Pending approvals",
        approvalRequirements: [
          {
            team: "Pricing",
            status: "Pending"
          },
          {
            team: "StratFin",
            status: "Pending"
          },
          {
            team: "Legal",
            status: "Pending"
          }
        ],
        createdBy: "ahoman", 
        createdDate: "2024-03-05T09:45:00Z"
      }
    ]
  },
  {
    id: "GTM009",
    name: "SMB Growth Plan Restructure",
    description: "Simplified pricing tiers for small-medium businesses with clearer feature differentiation and annual billing incentives",
    activationDate: "2024-07-01T08:00:00Z",
    status: "Approvals Completed" as GTMMotionStatus,
    createdBy: "geso",
    createdDate: "2024-04-01T13:20:00Z",
    updatedDate: "2024-04-15T17:10:00Z",
    items: [
      {
        id: "gtm-item-009-1", 
        type: "Price",
        productId: "smb-growth-plan",
        productName: "SMB Growth Plan",
        details: "Basic: $79/month, Professional: $149/month, Enterprise: $299/month (15% discount annual)",
        status: "Approved",
        approvalRequirements: [
          {
            team: "Product",
            status: "Approved"
          },
          {
            team: "StratFin",
            status: "Approved"
          },
          {
            team: "Pricing",
            status: "Approved"
          }
        ],
        createdBy: "geso",
        createdDate: "2024-04-01T13:20:00Z"
      }
    ]
  },
  {
    id: "GTM010",
    name: "Enterprise Volume Licensing",
    description: "Large enterprise volume licensing with custom pricing tiers based on user count and multi-year commitments",
    activationDate: "2024-03-25T09:00:00Z",
    status: "Activating in Prod" as GTMMotionStatus,
    createdBy: "chhu",
    createdDate: "2024-02-20T11:00:00Z", 
    updatedDate: "2024-03-20T14:25:00Z",
    items: [
      {
        id: "gtm-item-010-1",
        type: "Price",
        productId: "enterprise-volume-license",
        productName: "Enterprise Volume License",
        details: "500-999 users: $45/user/month, 1000+ users: $35/user/month, 3-year commitment: additional 10% discount",
        status: "Ready for deployment",
        approvalRequirements: [
          {
            team: "Legal",
            status: "Approved"
          },
          {
            team: "StratFin", 
            status: "Approved"
          },
          {
            team: "Revenue",
            status: "Approved"
          }
        ],
        createdBy: "chhu",
        createdDate: "2024-02-20T11:00:00Z"
      }
    ]
  }
];

// Utility functions for GTM Motion data
export const getGTMMotionById = (id: string): GTMMotion | undefined => {
  return mockGTMMotions.find(motion => motion.id === id);
};

export const getGTMMotionsByStatus = (status: GTMMotionStatus): GTMMotion[] => {
  return mockGTMMotions.filter(motion => motion.status === status);
};

export const createNewGTMMotion = (name: string, description: string, activationDate: string): GTMMotion => {
  // Find the highest existing GTM motion number
  const existingNumbers = mockGTMMotions
    .map(motion => motion.id)
    .filter(id => id.startsWith('GTM'))
    .map(id => parseInt(id.replace('GTM', ''), 10))
    .filter(num => !isNaN(num));
  
  const nextNumber = Math.max(...existingNumbers, 0) + 1;
  const newId = `GTM${nextNumber.toString().padStart(3, '0')}`;
  
  return {
    id: newId,
    name,
    description,
    activationDate,
    status: "Draft",
    createdBy: "chhu", // In real app, this would come from auth context
    createdDate: new Date().toISOString(),
    items: [
      {
        id: "gtm-item-003-1",
        type: "Price",
        productId: "premium-enterprise-1",
        productName: "Premium Enterprise",
        details: "New tier pricing",
        status: "Draft",
        approvalRequirements: [
          {
            team: "Pricing",
            status: "Pending"
          },
          {
            team: "Revenue",
            status: "Pending"
          }
        ],
        createdBy: "ahoman",
        createdDate: "2023-12-01T10:00:00Z"
      }
    ],
    updatedDate: new Date().toISOString()
  };
};

// Add price changes to existing GTM Motion
export const addPriceChangesToGTMMotion = (
  motionId: string, 
  productId: string, 
  productName: string, 
  priceChanges: any[], 
  selectedContext: any
): boolean => {
  const motionIndex = mockGTMMotions.findIndex(motion => motion.id === motionId);
  if (motionIndex === -1) return false;

  const motion = mockGTMMotions[motionIndex];
  const newItemId = `gtm-item-${Date.now()}-${motion.items.length + 1}`;
  
  // Create priceChange object from the actual changes
  const currencyChanges = priceChanges.map(change => {
    const currentAmount = change.currentPrice || 0;
    const newAmount = change.newPrice;
    const changeAmount = newAmount - currentAmount;
    const changePercentage = currentAmount === 0 ? (newAmount > 0 ? 100 : 0) : (changeAmount / currentAmount) * 100;
    
    return {
      currencyCode: change.currency,
      currentAmount: currentAmount,
      newAmount: newAmount,
      changeAmount: changeAmount,
      changePercentage: changePercentage
    };
  });

  // Add new price change item
  motion.items.push({
    id: newItemId,
    type: "Price",
    productId: productId,
    productName: productName,
    details: "Updated price",
    status: "Draft",
    approvalRequirements: [
      {
        team: "Pricing",
        status: "Pending"
      },
      {
        team: "Revenue",
        status: "Pending"
      }
    ],
    createdBy: "chhu",
    createdDate: new Date().toISOString(),
    priceChange: {
      id: `pc-${Date.now()}`,
      productId: productId,
      context: {
        productId: productId,
        channel: selectedContext.channel,
        billingCycle: selectedContext.billingCycle,
        validityPeriod: {
          validFrom: new Date().toISOString()
        },
        seatRange: {
          minQuantity: 1,
          maxQuantity: 100
        },
        pricingTier: "Standard",
        priceGroupAction: selectedContext.priceGroupAction || 'update',
        selectedPriceGroup: selectedContext.selectedPriceGroup || selectedContext.existingPriceGroup
      },
      currencyChanges: currencyChanges,
      impactType: selectedContext.priceGroupAction === 'create' ? 'CREATE_NEW_SKU' : 'UPDATE_EXISTING_SKU',
      targetSkuId: selectedContext.priceGroupAction === 'create' ? undefined : `sku-${productId}-${selectedContext.channel?.toLowerCase()}-${selectedContext.billingCycle?.toLowerCase()}`,
      createdBy: "chhu",
      createdDate: new Date().toISOString(),
      status: "Draft"
    }
  });

  // Update motion metadata
  motion.updatedDate = new Date().toISOString();
  
  return true;
};

// Create and add new GTM Motion to the list
export const createAndAddGTMMotion = (
  name: string, 
  description: string, 
  activationDate: string, 
  productId: string, 
  productName: string,
  priceChanges: any[], 
  selectedContext: any
): GTMMotion => {
  const newMotion = createNewGTMMotion(name, description, activationDate);
  
  // Create priceChange object from the actual changes
  const currencyChanges = priceChanges.map(change => {
    const currentAmount = change.currentPrice || 0;
    const newAmount = change.newPrice;
    const changeAmount = newAmount - currentAmount;
    const changePercentage = currentAmount === 0 ? (newAmount > 0 ? 100 : 0) : (changeAmount / currentAmount) * 100;
    
    return {
      currencyCode: change.currency,
      currentAmount: currentAmount,
      newAmount: newAmount,
      changeAmount: changeAmount,
      changePercentage: changePercentage
    };
  });
  
  // Replace the default item with actual product item
  newMotion.items = [{
    id: `gtm-item-${Date.now()}-1`,
    type: "Price",
    productId: productId,
    productName: productName,
    details: "Updated price",
    status: "Draft",
    approvalRequirements: [
      {
        team: "Pricing",
        status: "Pending"
      },
      {
        team: "Revenue",
        status: "Pending"
      }
    ],
    createdBy: "chhu",
    createdDate: new Date().toISOString(),
    priceChange: {
      id: `pc-${Date.now()}`,
      productId: productId,
      context: {
        productId: productId,
        channel: selectedContext.channel,
        billingCycle: selectedContext.billingCycle,
        validityPeriod: {
          validFrom: new Date().toISOString()
        },
        seatRange: {
          minQuantity: 1,
          maxQuantity: 100
        },
        pricingTier: "Standard",
        priceGroupAction: selectedContext.priceGroupAction || 'update',
        selectedPriceGroup: selectedContext.selectedPriceGroup || selectedContext.existingPriceGroup
      },
      currencyChanges: currencyChanges,
      impactType: selectedContext.priceGroupAction === 'create' ? 'CREATE_NEW_SKU' : 'UPDATE_EXISTING_SKU',
      targetSkuId: selectedContext.priceGroupAction === 'create' ? undefined : `sku-${productId}-${selectedContext.channel?.toLowerCase()}-${selectedContext.billingCycle?.toLowerCase()}`,
      createdBy: "chhu",
      createdDate: new Date().toISOString(),
      status: "Draft"
    }
  }];
  
  mockGTMMotions.push(newMotion);
  return newMotion;
};