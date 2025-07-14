// This file will contain all the mock data for the PCC prototype.
// It will serve as our single source of truth for products, SKUs, etc. 

import type { Product } from './types';

// Define the folder structure independently of products
// This allows us to show empty folders in the sidebar
export const folderStructure = {
  "Premium": [
    "Premium Company Page",
    "Premium Generic Products"
  ],
  "LTS": [
    "RLite",
    "Learning",
    "Glint",
    "Jobs"
  ],
  "LSS": [
    "Sales Navigator"
  ],
  "LMS": [
    "Ads"
  ]
};

export const mockProducts: Product[] = [
  {
    id: '5124922',
    name: 'Premium Company Page',
    description: 'Get exclusive access to insights, invite your page followers and customized your page to market to the right people to grow your business.',
    lob: 'Premium',
    folder: 'Premium Company Page',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/company/premium/',
    seatType: 'Multi-seat fixed',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 7,
    paymentFailurePaidToPaidGracePeriod: 14,
    seatMin: 1,
    seatMax: 10,
    digitalGoods: ['Customized Page', 'Follower Insights', 'Advanced Analytics'],
    tags: [{ type: 'Customer Type', value: 'Enterprise customer' }, { type: 'Sales Top of Funnel', value: 'Web CTA' }],
    isCancellable: true,
    isEligibleForAmendment: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    howToCancelUrl: 'https://www.linkedin.com/help/linkedin/answer/a134000',
    productUrl: 'https://www.linkedin.com/premium/company-page',
    skus: [
      {
        id: 'sku_5124922a',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Annual',
        price: { startDate: '2024-01-01', endDate: '2024-12-31', pricePoints: [
          { currencyCode: 'AUD', amount: 1829.68 }, { currencyCode: 'ARS', amount: 1442397 }, { currencyCode: 'BDT', amount: 147081.33 }, { currencyCode: 'BGN', amount: 1994.89 }, { currencyCode: 'BYN', amount: 3764.86 }, { currencyCode: 'BRL', amount: 6511.97 }, { currencyCode: 'GBP', amount: 872.91 }, { currencyCode: 'CAD', amount: 1642.63 }, { currencyCode: 'CLP', amount: 1109075 }, { currencyCode: 'COP', amount: 4697682 }, { currencyCode: 'CRC', amount: 613888 }, { currencyCode: 'CZK', amount: 27337.2 }, { currencyCode: 'DKK', amount: 8249.12 }, { currencyCode: 'EGP', amount: 59290.55 }, { currencyCode: 'EUR', amount: 1016.99 }, { currencyCode: 'GTQ', amount: 9220.31 }, { currencyCode: 'HNL', amount: 31341.86 }, { currencyCode: 'HKD', amount: 9352.2 }, { currencyCode: 'HUF', amount: 405677.57 }, { currencyCode: 'INR', amount: 100116.5 }, { currencyCode: 'IDR', amount: 19492143 }, { currencyCode: 'ILS', amount: 4436.3 }, { currencyCode: 'JPY', amount: 171996.57 }, { currencyCode: 'JOD', amount: 850.09 }, { currencyCode: 'KES', amount: 154970.75 }, { currencyCode: 'KWD', amount: 365.69 }, { currencyCode: 'LBP', amount: 107310500 }, { currencyCode: 'MYR', amount: 5035.77 }, { currencyCode: 'MXN', amount: 22464.63 }, { currencyCode: 'MAD', amount: 10767.02 }, { currencyCode: 'TWD', amount: 38721.7 }, { currencyCode: 'NZD', amount: 1954.37 }, { currencyCode: 'NGN', amount: 1774520 }, { currencyCode: 'NOK', amount: 12625.47 }, { currencyCode: 'PKR', amount: 340336.15 }, { currencyCode: 'PEN', amount: 4244.46 }, { currencyCode: 'PHP', amount: 70381.3 }, { currencyCode: 'AED', amount: 4400.33 }, { currencyCode: 'COP', amount: 4697682 }, { currencyCode: 'SAR', amount: 4496.25 }, { currencyCode: 'MYR', amount: 5635.3 }, { currencyCode: 'RON', amount: 5515.4 }, { currencyCode: 'ARS', amount: 1075503 }, { currencyCode: 'BDT', amount: 140283 }, { currencyCode: 'VND', amount: 30522943 }, { currencyCode: 'UAH', amount: 48559.5 }, { currencyCode: 'QAR', amount: 4364.36 }, { currencyCode: 'KZT', amount: 535953 }, { currencyCode: 'EGP', amount: 57076.4 }, { currencyCode: 'PKR', amount: 333322 }, { currencyCode: 'OMR', amount: 455.62 }, { currencyCode: 'LKR', amount: 360899 }, { currencyCode: 'NGN', amount: 1774520 }, { currencyCode: 'IQD', amount: 1569491 }, { currencyCode: 'DZD', amount: 160666 }, { currencyCode: 'MAD', amount: 11990 }, { currencyCode: 'PAB', amount: 1199 }, { currencyCode: 'PEN', amount: 4496.25 }, { currencyCode: 'UYU', amount: 46761 }, { currencyCode: 'VEF', amount: 4340080500 }, { currencyCode: 'CRC', amount: 613888 }
        ] },
        revenueRecognition: 'Accrual',
        switcherLogic: [],
        refundPolicy: { id: 'YES_MANUAL', description: 'Yes (the field sales rep can decide)' },
        taxClass: 'Taxable (US Specific)',
      },
    ],
  },
  {
    id: '5095285',
    name: 'Premium Career',
    description: 'Get exclusive access to insights, job search tools, and direct messaging to reach the right people to grow your career.',
    lob: 'Premium',
    folder: 'Premium Generic Products',
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
    digitalGoods: ['Applicant Insights', '5 InMail Messages/month', 'Resume Insights'],
    tags: [{ type: 'Customer Type', value: 'Individual member' }, { type: 'Sales Top of Funnel', value: 'Premium Chooser' }],
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/premium/career',
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    skus: [
      {
        id: 'sku_5095285l',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Monthly',
        price: {
          startDate: '2023-06-01',
          endDate: '2023-09-30',
          pricePoints: [
            { currencyCode: 'USD', amount: 39.99 }, { currencyCode: 'EUR', amount: 39.99 }, { currencyCode: 'CAD', amount: 49.99 }, { currencyCode: 'AUD', amount: 54.99 }, { currencyCode: 'CHF', amount: 39.99 }, { currencyCode: 'DKK', amount: 249.99 }, { currencyCode: 'NOK', amount: 349.99 }, { currencyCode: 'SEK', amount: 349.99 }, { currencyCode: 'GBP', amount: 34.99 }, { currencyCode: 'HKD', amount: 299.99 }, { currencyCode: 'SGD', amount: 50.46 }, { currencyCode: 'BRL', amount: 89.99 }, { currencyCode: 'NZD', amount: 44.99 }, { currencyCode: 'JPY', amount: 3999 }, { currencyCode: 'INR', amount: 1850 }, { currencyCode: 'ZAR', amount: 450.00 }, { currencyCode: 'AED', amount: 138.99 }, { currencyCode: 'PLN', amount: 149.00 }, { currencyCode: 'SAR', amount: 167.99 }, { currencyCode: 'MXN', amount: 729.00 }, { currencyCode: 'EGP', amount: 529.00 }, { currencyCode: 'TRY', amount: 133.99 }
          ]
        },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [{ type: 'Upgrade', targetProductId: '5095295' }],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      },
      {
        id: 'sku_5095285m',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Annual',
        price: {
          startDate: '2023-06-01',
          endDate: '2023-09-30',
          pricePoints: [
            { currencyCode: 'USD', amount: 239.88 }, { currencyCode: 'EUR', amount: 239.88 }, { currencyCode: 'CAD', amount: 299.88 }, { currencyCode: 'AUD', amount: 299.88 }, { currencyCode: 'CHF', amount: 239.88 }, { currencyCode: 'DKK', amount: 1499.88 }, { currencyCode: 'NOK', amount: 2099.88 }, { currencyCode: 'SEK', amount: 2099.88 }, { currencyCode: 'GBP', amount: 179.88 }, { currencyCode: 'HKD', amount: 1799.88 }, { currencyCode: 'SGD', amount: 302.68 }, { currencyCode: 'BRL', amount: 539.88 }, { currencyCode: 'NZD', amount: 239.88 }, { currencyCode: 'JPY', amount: 23988 }, { currencyCode: 'INR', amount: 11100 }, { currencyCode: 'ZAR', amount: 2699.88 }, { currencyCode: 'AED', amount: 1127.88 }, { currencyCode: 'PLN', amount: 1188.00 }, { currencyCode: 'SAR', amount: 1355.88 }, { currencyCode: 'MXN', amount: 5868.00 }, { currencyCode: 'EGP', amount: 4308.00 }, { currencyCode: 'TRY', amount: 1079.88 }
          ]
        },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [{ type: 'Upgrade', targetProductId: '5095295' }],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      },
      {
        id: 'sku_5095285j',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Monthly',
        price: {
          startDate: '2023-10-01',
          endDate: '2024-07-31',
          pricePoints: [
            { currencyCode: 'USD', amount: 39.99 }, { currencyCode: 'EUR', amount: 39.99 }, { currencyCode: 'CAD', amount: 49.99 }, { currencyCode: 'AUD', amount: 54.99 }, { currencyCode: 'CHF', amount: 39.99 }, { currencyCode: 'DKK', amount: 249.99 }, { currencyCode: 'NOK', amount: 349.99 }, { currencyCode: 'SEK', amount: 349.99 }, { currencyCode: 'GBP', amount: 34.99 }, { currencyCode: 'HKD', amount: 299.99 }, { currencyCode: 'SGD', amount: 50.46 }, { currencyCode: 'BRL', amount: 89.99 }, { currencyCode: 'NZD', amount: 44.99 }, { currencyCode: 'JPY', amount: 3999 }, { currencyCode: 'INR', amount: 1850 }, { currencyCode: 'ZAR', amount: 450.00 }, { currencyCode: 'AED', amount: 104.99 }, { currencyCode: 'PLN', amount: 99.99 }, { currencyCode: 'SAR', amount: 114.99 }, { currencyCode: 'MXN', amount: 661.19 }, { currencyCode: 'EGP', amount: 603.06 }, { currencyCode: 'TRY', amount: 117.99 }
          ]
        },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [{ type: 'Upgrade', targetProductId: '5095295' }],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      },
      {
        id: 'sku_5095285k',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Annual',
        price: {
          startDate: '2023-10-01',
          endDate: '2024-07-31',
          pricePoints: [
            { currencyCode: 'USD', amount: 239.88 }, { currencyCode: 'EUR', amount: 239.88 }, { currencyCode: 'CAD', amount: 299.88 }, { currencyCode: 'AUD', amount: 299.88 }, { currencyCode: 'CHF', amount: 239.88 }, { currencyCode: 'DKK', amount: 1499.88 }, { currencyCode: 'NOK', amount: 2099.88 }, { currencyCode: 'SEK', amount: 2099.88 }, { currencyCode: 'GBP', amount: 179.88 }, { currencyCode: 'HKD', amount: 1799.88 }, { currencyCode: 'SGD', amount: 302.68 }, { currencyCode: 'BRL', amount: 539.88 }, { currencyCode: 'NZD', amount: 239.88 }, { currencyCode: 'JPY', amount: 23988 }, { currencyCode: 'INR', amount: 11100 }, { currencyCode: 'ZAR', amount: 2699.88 }, { currencyCode: 'AED', amount: 1007.87 }, { currencyCode: 'PLN', amount: 959.88 }, { currencyCode: 'SAR', amount: 1103.86 }, { currencyCode: 'MXN', amount: 6542.26 }, { currencyCode: 'EGP', amount: 6041.86 }, { currencyCode: 'TRY', amount: 1132.66 }
          ]
        },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [{ type: 'Upgrade', targetProductId: '5095295' }],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      },
      {
        id: 'sku_5095285h',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Monthly',
        price: { 
          id: 'price_prem_q4_2024_monthly',
          status: 'Active',
          startDate: '2024-08-01', 
          endDate: '2024-12-31',
          pricePoints: [
            { currencyCode: 'USD', amount: 39.99 }, { currencyCode: 'EUR', amount: 29.99 }, { currencyCode: 'CAD', amount: 49.99 }, { currencyCode: 'AUD', amount: 54.99 }, { currencyCode: 'CHF', amount: 39.99 }, { currencyCode: 'DKK', amount: 189.99 }, { currencyCode: 'NOK', amount: 274.99 }, { currencyCode: 'SEK', amount: 349.99 }, { currencyCode: 'GBP', amount: 29.99 }, { currencyCode: 'HKD', amount: 274.99 }, { currencyCode: 'SGD', amount: 49.99 }, { currencyCode: 'BRL', amount: 69.99 }, { currencyCode: 'NZD', amount: 39.99 }, { currencyCode: 'JPY', amount: 3999.00 }, { currencyCode: 'INR', amount: 999.00 }, { currencyCode: 'ZAR', amount: 249.00 }, { currencyCode: 'AED', amount: 94.99 }, { currencyCode: 'PLN', amount: 89.99 }, { currencyCode: 'SAR', amount: 99.99 }, { currencyCode: 'MXN', amount: 599.99 }, { currencyCode: 'EGP', amount: 499.99 }, { currencyCode: 'TRY', amount: 109.99 }
          ] 
        },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [{ type: 'Upgrade', targetProductId: '5095295' }],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      },
      {
        id: 'sku_5095285i',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Annual',
        price: { 
          startDate: '2024-08-01', 
          endDate: '2024-12-31',
          pricePoints: [
            { currencyCode: 'USD', amount: 239.88 }, { currencyCode: 'EUR', amount: 179.88 }, { currencyCode: 'CAD', amount: 299.88 }, { currencyCode: 'AUD', amount: 323.88 }, { currencyCode: 'CHF', amount: 239.88 }, { currencyCode: 'DKK', amount: 1139.88 }, { currencyCode: 'NOK', amount: 1679.88 }, { currencyCode: 'SEK', amount: 2099.88 }, { currencyCode: 'GBP', amount: 179.88 }, { currencyCode: 'HKD', amount: 1679.88 }, { currencyCode: 'SGD', amount: 299.88 }, { currencyCode: 'BRL', amount: 419.88 }, { currencyCode: 'NZD', amount: 239.88 }, { currencyCode: 'JPY', amount: 23988 }, { currencyCode: 'INR', amount: 5988 }, { currencyCode: 'ZAR', amount: 1499.88 }, { currencyCode: 'AED', amount: 575.88 }, { currencyCode: 'PLN', amount: 539.88 }, { currencyCode: 'SAR', amount: 599.88 }, { currencyCode: 'MXN', amount: 3599.88 }, { currencyCode: 'EGP', amount: 2999.88 }, { currencyCode: 'TRY', amount: 659.88 }
          ]
        },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [{ type: 'Upgrade', targetProductId: '5095295' }],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      },
      {
        id: 'sku_5095285f',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Monthly',
        price: { 
          id: 'price_prem_q1_2025_monthly',
          status: 'Active',
          startDate: '2025-01-01', 
          endDate: '2025-04-30',
          pricePoints: [
            { currencyCode: 'USD', amount: 39.99 }, { currencyCode: 'EUR', amount: 29.99 }, { currencyCode: 'CAD', amount: 49.99 }, { currencyCode: 'AUD', amount: 54.99 }, { currencyCode: 'CHF', amount: 39.99 }, { currencyCode: 'DKK', amount: 189.99 }, { currencyCode: 'NOK', amount: 274.99 }, { currencyCode: 'SEK', amount: 349.99 }, { currencyCode: 'GBP', amount: 29.99 }, { currencyCode: 'HKD', amount: 274.99 }, { currencyCode: 'SGD', amount: 49.99 }, { currencyCode: 'BRL', amount: 69.99 }, { currencyCode: 'NZD', amount: 39.99 }, { currencyCode: 'JPY', amount: 3999.00 }, { currencyCode: 'INR', amount: 999.00 }, { currencyCode: 'ZAR', amount: 249.00 }, { currencyCode: 'AED', amount: 94.99 }, { currencyCode: 'PLN', amount: 89.99 }, { currencyCode: 'SAR', amount: 99.99 }, { currencyCode: 'MXN', amount: 599.99 }, { currencyCode: 'EGP', amount: 499.99 }, { currencyCode: 'TRY', amount: 109.99 }
          ] 
        },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [{ type: 'Upgrade', targetProductId: '5095295' }],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      },
      {
        id: 'sku_5095285g',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Annual',
        price: { 
          startDate: '2025-01-01', 
          endDate: '2025-04-30',
          pricePoints: [
            { currencyCode: 'USD', amount: 239.88 }, { currencyCode: 'EUR', amount: 179.88 }, { currencyCode: 'CAD', amount: 299.88 }, { currencyCode: 'AUD', amount: 323.88 }, { currencyCode: 'CHF', amount: 239.88 }, { currencyCode: 'DKK', amount: 1139.88 }, { currencyCode: 'NOK', amount: 1679.88 }, { currencyCode: 'SEK', amount: 2099.88 }, { currencyCode: 'GBP', amount: 179.88 }, { currencyCode: 'HKD', amount: 1679.88 }, { currencyCode: 'SGD', amount: 299.88 }, { currencyCode: 'BRL', amount: 419.88 }, { currencyCode: 'NZD', amount: 239.88 }, { currencyCode: 'JPY', amount: 23988.00 }, { currencyCode: 'INR', amount: 5988.00 }, { currencyCode: 'ZAR', amount: 1499.88 }, { currencyCode: 'AED', amount: 575.88 }, { currencyCode: 'PLN', amount: 539.88 }, { currencyCode: 'SAR', amount: 599.88 }, { currencyCode: 'MXN', amount: 3599.88 }, { currencyCode: 'EGP', amount: 2999.88 }, { currencyCode: 'TRY', amount: 659.88 }
          ]
        },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [{ type: 'Upgrade', targetProductId: '5095295' }],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      },
      {
        id: 'sku_5095285c',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Monthly',
        price: { 
          startDate: '2025-05-01', 
          pricePoints: [
            { currencyCode: 'USD', amount: 39.99 }, { currencyCode: 'EUR', amount: 29.99 }, { currencyCode: 'CAD', amount: 49.99 }, { currencyCode: 'AUD', amount: 54.99 }, { currencyCode: 'CHF', amount: 39.99 }, { currencyCode: 'DKK', amount: 189.99 }, { currencyCode: 'NOK', amount: 274.99 }, { currencyCode: 'SEK', amount: 349.99 }, { currencyCode: 'GBP', amount: 29.99 }, { currencyCode: 'HKD', amount: 274.99 }, { currencyCode: 'SGD', amount: 49.99 }, { currencyCode: 'BRL', amount: 69.99 }, { currencyCode: 'NZD', amount: 39.99 }, { currencyCode: 'JPY', amount: 3999.00 }, { currencyCode: 'INR', amount: 999.00 }, { currencyCode: 'ZAR', amount: 249.00 }, { currencyCode: 'AED', amount: 94.99 }, { currencyCode: 'PLN', amount: 89.99 }, { currencyCode: 'SAR', amount: 99.99 }, { currencyCode: 'MXN', amount: 599.99 }, { currencyCode: 'EGP', amount: 499.99 }, { currencyCode: 'TRY', amount: 109.99 }
          ] 
        },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [{ type: 'Upgrade', targetProductId: '5095295' }],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      },
      {
        id: 'sku_5095285d',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Quarterly',
        price: { 
          startDate: '2025-05-01', 
          pricePoints: [
            { currencyCode: 'USD', amount: 89.97 }, { currencyCode: 'EUR', amount: 68.97 }, { currencyCode: 'CAD', amount: 113.97 }, { currencyCode: 'AUD', amount: 125.97 }, { currencyCode: 'CHF', amount: 90.31 }, { currencyCode: 'DKK', amount: 428.98 }, { currencyCode: 'NOK', amount: 620.98 }, { currencyCode: 'SEK', amount: 788.98 }, { currencyCode: 'GBP', amount: 68.98 }, { currencyCode: 'HKD', amount: 620.97 }, { currencyCode: 'SGD', amount: 115.03 }, { currencyCode: 'BRL', amount: 158.97 }, { currencyCode: 'NZD', amount: 89.96 }, { currencyCode: 'JPY', amount: 8999.97 }, { currencyCode: 'INR', amount: 2249.97 }, { currencyCode: 'ZAR', amount: 560.97 }, { currencyCode: 'AED', amount: 215.97 }, { currencyCode: 'PLN', amount: 203.97 }, { currencyCode: 'SAR', amount: 224.97 }, { currencyCode: 'MXN', amount: 1349.97 }, { currencyCode: 'EGP', amount: 1282.47 }, { currencyCode: 'TRY', amount: 248.97 }
          ] 
        },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [{ type: 'Upgrade', targetProductId: '5095295' }],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      },
      {
        id: 'sku_5095285e',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Annual',
        price: { 
          startDate: '2025-05-01', 
          pricePoints: [
            { currencyCode: 'USD', amount: 239.88 }, { currencyCode: 'EUR', amount: 179.88 }, { currencyCode: 'CAD', amount: 299.88 }, { currencyCode: 'AUD', amount: 323.88 }, { currencyCode: 'CHF', amount: 239.88 }, { currencyCode: 'DKK', amount: 1139.88 }, { currencyCode: 'NOK', amount: 1679.88 }, { currencyCode: 'SEK', amount: 2099.88 }, { currencyCode: 'GBP', amount: 179.88 }, { currencyCode: 'HKD', amount: 1679.88 }, { currencyCode: 'SGD', amount: 299.88 }, { currencyCode: 'BRL', amount: 419.88 }, { currencyCode: 'NZD', amount: 239.88 }, { currencyCode: 'JPY', amount: 23988.00 }, { currencyCode: 'INR', amount: 5988.00 }, { currencyCode: 'ZAR', amount: 1499.88 }, { currencyCode: 'AED', amount: 575.88 }, { currencyCode: 'PLN', amount: 539.88 }, { currencyCode: 'SAR', amount: 599.88 }, { currencyCode: 'MXN', amount: 3599.88 }, { currencyCode: 'EGP', amount: 2999.88 }, { currencyCode: 'TRY', amount: 659.88 }
          ]
        },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [{ type: 'Upgrade', targetProductId: '5095295' }],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      },
    ],
  },
  {
    id: '5095295',
    name: 'Premium Business',
    description: 'Get exclusive access to insights, search tools, and direct messaging to reach the right people to grow your business.',
    lob: 'Premium',
    folder: 'Premium Generic Products',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/premium/business/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 7,
    paymentFailurePaidToPaidGracePeriod: 14,
    seatMin: 1,
    seatMax: 1,
    digitalGoods: ['Business Insights', '15 InMail Messages/month', 'Unlimited Searches'],
    tags: [{ type: 'Customer Type', value: 'Individual member' }],
    isCancellable: false,
    isPrimaryForGracePeriod: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/premium/business',
    skus: [
      {
        id: 'sku_5095295a',
        status: 'Active',
        region: 'EMEA',
        salesChannel: 'Desktop',
        billingCycle: 'Monthly',
        price: { 
          startDate: '2024-01-01', 
          pricePoints: [
            { currencyCode: 'AUD', amount: 89.99 }, { currencyCode: 'ARS', amount: 71199.95 }, { currencyCode: 'BDT', amount: 72589.33 }, { currencyCode: 'BGN', amount: 982.5 }, { currencyCode: 'BYN', amount: 1850.5 }, { currencyCode: 'BRL', amount: 3210.97 }, { currencyCode: 'GBP', amount: 43.01 }, { currencyCode: 'CAD', amount: 82.19 }, { currencyCode: 'CLP', amount: 56155.95 }, { currencyCode: 'COP', amount: 244553.18 }, { currencyCode: 'CRC', amount: 30269.3 }, { currencyCode: 'CZK', amount: 1254.56 }, { currencyCode: 'DKK', amount: 379.11 }, { currencyCode: 'EGP', amount: 2965.76 }, { currencyCode: 'EUR', amount: 50.87 }, { currencyCode: 'GTQ', amount: 461.12 }, { currencyCode: 'HNL', amount: 1567.55 }, { currencyCode: 'HKD', amount: 470.81 }, { currencyCode: 'HUF', amount: 20289.41 }, { currencyCode: 'INR', amount: 5138.99 }, { currencyCode: 'IDR', amount: 972271.43 }, { currencyCode: 'ILS', amount: 202.32 }, { currencyCode: 'JPY', amount: 8597.11 }, { currencyCode: 'JOD', amount: 42.53 }, { currencyCode: 'KES', amount: 7750.51 }, { currencyCode: 'KWD', amount: 18.29 }, { currencyCode: 'LBP', amount: 5369105 }, { currencyCode: 'MYR', amount: 251.84 }, { currencyCode: 'MXN', amount: 1027.62 }, { currencyCode: 'MAD', amount: 4486.57 }, { currencyCode: 'TWD', amount: 14534.59 }, { currencyCode: 'NZD', amount: 823.2 }, { currencyCode: 'NGN', amount: 765819.99 }, { currencyCode: 'NOK', amount: 5039.14 }, { currencyCode: 'PKR', amount: 142017.62 }, { currencyCode: 'PEN', amount: 1771.79 }, { currencyCode: 'PHP', amount: 28165.43 }, { currencyCode: 'PLN', amount: 1801.14 }, { currencyCode: 'QAR', amount: 1820 }, { currencyCode: 'RON', amount: 2132.17 }, { currencyCode: 'RUB', amount: 38819.61 }, { currencyCode: 'SAR', amount: 1856.25 }, { currencyCode: 'RSD', amount: 49122.94 }, { currencyCode: 'SGD', amount: 631.06 }, { currencyCode: 'LKR', amount: 148415.89 }, { currencyCode: 'ZAR', amount: 8716.95 }, { currencyCode: 'KRW', amount: 670164.3 }, { currencyCode: 'SEK', amount: 4703.05 }, { currencyCode: 'CHF', amount: 391.29 }, { currencyCode: 'TZS', amount: 1297027.32 }, { currencyCode: 'THB', amount: 16057.8 }, { currencyCode: 'TRY', amount: 19742.51 }, { currencyCode: 'UAH', amount: 20699.99 }, { currencyCode: 'AED', amount: 1816.65 }, { currencyCode: 'USD', amount: 59.99 }, { currencyCode: 'UYU', amount: 2396.4 }, { currencyCode: 'VND', amount: 1559401.41 }, { currencyCode: 'XOF', amount: 33363.6 }
          ] 
        },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [{ type: 'Downgrade', targetProductId: '5095285' }],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      },
    ],
  },
  {
    id: '5083684',
    name: 'Recruiter Lite',
    description: 'Find the right talent faster. Search for qualified candidates with 20+ filters, 30 InMail messages per month, saved search alerts, daily candidate recommendations, among other features.',
    lob: 'LTS',
    folder: 'RLite',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/talent/recruiter-lite/',
    seatType: 'Single seat',
    isBundle: true,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 7,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    digitalGoods: ['20+ Search Filters', '30 InMail Messages/month', 'Candidate Recommendations'],
    tags: [{ type: 'Customer Type', value: 'Enterprise customer' }],
    isCancellable: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/talent/recruiter-lite',
    skus: [
       {
        id: 'sku_5083684a',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Monthly',
        price: { startDate: '2024-01-01', pricePoints: [
          { currencyCode: 'AUD', amount: 258.98 }, { currencyCode: 'ARS', amount: 2026848 }, { currencyCode: 'BDT', amount: 206604.48 }, { currencyCode: 'BGN', amount: 2792.16 }, { currencyCode: 'BYN', amount: 5271.36 }, { currencyCode: 'BRL', amount: 9143.52 }, { currencyCode: 'GBP', amount: 1225.97 }, { currencyCode: 'CAD', amount: 2292.53 }, { currencyCode: 'CLP', amount: 1569103.2 }, { currencyCode: 'COP', amount: 6848623.2 }, { currencyCode: 'CRC', amount: 847240.32 }, { currencyCode: 'CZK', amount: 35136.48 }, { currencyCode: 'DKK', amount: 10611.36 }, { currencyCode: 'EGP', amount: 83016 }, { currencyCode: 'EUR', amount: 1424.35 }, { currencyCode: 'GTQ', amount: 12906.72 }, { currencyCode: 'HNL', amount: 43888.56 }, { currencyCode: 'HKD', amount: 13271.28 }, { currencyCode: 'HUF', amount: 568058.4 }, { currencyCode: 'INR', amount: 143841.6 }, { currencyCode: 'IDR', amount: 27258352.8 }, { currencyCode: 'ILS', amount: 5661.36 }, { currencyCode: 'JPY', amount: 240124.8 }, { currencyCode: 'JOD', amount: 1190.88 }, { currencyCode: 'KES', amount: 217140 }, { currencyCode: 'KWD', amount: 512.16 }, { currencyCode: 'LBP', amount: 150288000 }, { currencyCode: 'MYR', amount: 7068.24 }, { currencyCode: 'MXN', amount: 31448.88 }, { currencyCode: 'MAD', amount: 15074.88 }, { currencyCode: 'TWD', amount: 48835.2 }, { currencyCode: 'NZD', amount: 2766.96 }, { currencyCode: 'NGN', amount: 2573157.6 }, { currencyCode: 'NOK', amount: 16931.52 }, { currencyCode: 'PKR', amount: 467040 }, { currencyCode: 'PEN', amount: 5836.8 }, { currencyCode: 'PHP', amount: 9336.48 }, { currencyCode: 'PLN', amount: 5942.4 }, { currencyCode: 'QAR', amount: 6000 }, { currencyCode: 'RON', amount: 7128 }, { currencyCode: 'RUB', amount: 13329.6 }, { currencyCode: 'SAR', amount: 6300 }, { currencyCode: 'RSD', amount: 166704 }, { currencyCode: 'SGD', amount: 2142.72 }, { currencyCode: 'LKR', amount: 502958.64 }, { currencyCode: 'ZAR', amount: 29645.28 }, { currencyCode: 'KRW', amount: 2273066.88 }, { currencyCode: 'SEK', amount: 15961.92 }, { currencyCode: 'CHF', amount: 1333.1 }, { currencyCode: 'TZS', amount: 445581.6 }, { currencyCode: 'THB', amount: 55155.6 }, { currencyCode: 'TRY', amount: 6763.6 }, { currencyCode: 'UAH', amount: 70284.48 }, { currencyCode: 'AED', amount: 6165.12 }, { currencyCode: 'USD', amount: 1680 }, { currencyCode: 'UYU', amount: 67121.28 }, { currencyCode: 'VND', amount: 43690624.56 }, { currencyCode: 'XOF', amount: 934509.36 }
        ] },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [],
        refundPolicy: { id: 'NO_CREDIT', description: 'No (field sales rep can however give customer a credit toward next invoice)' },
      },
       {
        id: 'sku_5083684b',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Annual',
        price: { startDate: '2024-01-01', pricePoints: [
          { currencyCode: 'AUD', amount: 2568.48 }, { currencyCode: 'ARS', amount: 2026848 }, { currencyCode: 'BDT', amount: 206604.48 }, { currencyCode: 'BGN', amount: 2792.16 }, { currencyCode: 'BYN', amount: 5271.36 }, { currencyCode: 'BRL', amount: 9143.52 }, { currencyCode: 'GBP', amount: 1225.97 }, { currencyCode: 'CAD', amount: 2292.53 }, { currencyCode: 'CLP', amount: 1569103.2 }, { currencyCode: 'COP', amount: 6848623.2 }, { currencyCode: 'CRC', amount: 847240.32 }, { currencyCode: 'CZK', amount: 35136.48 }, { currencyCode: 'DKK', amount: 10611.36 }, { currencyCode: 'EGP', amount: 83016 }, { currencyCode: 'EUR', amount: 1424.35 }, { currencyCode: 'GTQ', amount: 12906.72 }, { currencyCode: 'HNL', amount: 43888.56 }, { currencyCode: 'HKD', amount: 13271.28 }, { currencyCode: 'HUF', amount: 568058.4 }, { currencyCode: 'INR', amount: 143841.6 }, { currencyCode: 'IDR', amount: 27258352.8 }, { currencyCode: 'ILS', amount: 5661.36 }, { currencyCode: 'JPY', amount: 240124.8 }, { currencyCode: 'JOD', amount: 1190.88 }, { currencyCode: 'KES', amount: 217140 }, { currencyCode: 'KWD', amount: 512.16 }, { currencyCode: 'LBP', amount: 150288000 }, { currencyCode: 'MYR', amount: 7068.24 }, { currencyCode: 'MXN', amount: 31448.88 }, { currencyCode: 'MAD', amount: 15074.88 }, { currencyCode: 'TWD', amount: 48835.2 }, { currencyCode: 'NZD', amount: 2766.96 }, { currencyCode: 'NGN', amount: 2573157.6 }, { currencyCode: 'NOK', amount: 16931.52 }, { currencyCode: 'PKR', amount: 467040 }, { currencyCode: 'PEN', amount: 5836.8 }, { currencyCode: 'PHP', amount: 9336.48 }, { currencyCode: 'PLN', amount: 5942.4 }, { currencyCode: 'QAR', amount: 6000 }, { currencyCode: 'RON', amount: 7128 }, { currencyCode: 'RUB', amount: 13329.6 }, { currencyCode: 'SAR', amount: 6300 }, { currencyCode: 'RSD', amount: 166704 }, { currencyCode: 'SGD', amount: 2142.72 }, { currencyCode: 'LKR', amount: 502958.64 }, { currencyCode: 'ZAR', amount: 29645.28 }, { currencyCode: 'KRW', amount: 2273066.88 }, { currencyCode: 'SEK', amount: 15961.92 }, { currencyCode: 'CHF', amount: 1333.1 }, { currencyCode: 'TZS', amount: 445581.6 }, { currencyCode: 'THB', amount: 55155.6 }, { currencyCode: 'TRY', amount: 6763.6 }, { currencyCode: 'UAH', amount: 70284.48 }, { currencyCode: 'AED', amount: 6165.12 }, { currencyCode: 'USD', amount: 1680 }, { currencyCode: 'UYU', amount: 67121.28 }, { currencyCode: 'VND', amount: 43690624.56 }, { currencyCode: 'XOF', amount: 934509.36 }
        ] },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [],
        refundPolicy: { id: 'NO_CREDIT', description: 'No (field sales rep can however give customer a credit toward next invoice)' },
      }
    ],
  },
  {
    id: '5073467',
    name: 'Sales Navigator Advanced',
    description: 'Forge deeper relationships by leveraging real-time sales intelligence and seamless collaboration with your team.',
    lob: 'LSS',
    folder: 'Sales Navigator',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/sales/',
    seatType: 'Multi-seat enterprise',
    isBundle: true,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 30,
    paymentFailurePaidToPaidGracePeriod: 30,
    seatMin: 5,
    seatMax: 100,
    digitalGoods: ['TeamLink', '50 InMail Messages/month', 'Buyer Interest'],
    tags: [{ type: 'Customer Type', value: 'Enterprise customer' }, { type: 'Contract Type', value: 'Fixed time' }],
    isPrimaryForContractAggregation: true,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/sales/',
    contactUsUrl: 'https://www.linkedin.com/help/linkedin/ask/li-salesnav',
    skus: [
      {
        id: 'sku_5073467a',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Field',
        billingCycle: 'Annual',
        price: { startDate: '2024-01-01', pricePoints: [
          { currencyCode: 'AUD', amount: 2446.16 }, { currencyCode: 'ARS', amount: 1930331.43 }, { currencyCode: 'BDT', amount: 196766.17 }, { currencyCode: 'BGN', amount: 2659.21 }, { currencyCode: 'BYN', amount: 5020.34 }, { currencyCode: 'BRL', amount: 8708.11 }, { currencyCode: 'GBP', amount: 10931.25 }, { currencyCode: 'CAD', amount: 20631.43 }, { currencyCode: 'CLP', amount: 14062425 }, { currencyCode: 'COP', amount: 61148587.5 }, { currencyCode: 'CRC', amount: 7575908.57 }, { currencyCode: 'CZK', amount: 313706.25 }, { currencyCode: 'DKK', amount: 94744.64 }, { currencyCode: 'EGP', amount: 741714.29 }, { currencyCode: 'EUR', amount: 12718.75 }, { currencyCode: 'GTQ', amount: 115264.29 }, { currencyCode: 'HNL', amount: 391891.07 }, { currencyCode: 'HKD', amount: 118439.29 }, { currencyCode: 'HUF', amount: 5079062.5 }, { currencyCode: 'INR', amount: 1283250 }, { currencyCode: 'IDR', amount: 242629031.25 }, { currencyCode: 'ILS', amount: 50531.25 }, { currencyCode: 'JPY', amount: 2160107.14 }, { currencyCode: 'JOD', amount: 10631.25 }, { currencyCode: 'KES', amount: 1938750 }, { currencyCode: 'KWD', amount: 4577.68 }, { currencyCode: 'LBP', amount: 1342500000 }, { currencyCode: 'MYR', amount: 63108.75 }, { currencyCode: 'MXN', amount: 281263.95 }, { currencyCode: 'MAD', amount: 284164.29 }, { currencyCode: 'TWD', amount: 434593.75 }, { currencyCode: 'NZD', amount: 24575 }, { currencyCode: 'NGN', amount: 23003250 }, { currencyCode: 'NOK', amount: 151193.75 }, { currencyCode: 'PKR', amount: 4251108.75 }, { currencyCode: 'PEN', amount: 53179.46 }, { currencyCode: 'PHP', amount: 844838.25 }, { currencyCode: 'PLN', amount: 54032.14 }, { currencyCode: 'QAR', amount: 54600 }, { currencyCode: 'RON', amount: 64593.75 }, { currencyCode: 'RUB', amount: 9123.64 }, { currencyCode: 'SAR', amount: 436.94 }, { currencyCode: 'RSD', amount: 11539.11 }, { currencyCode: 'SGD', amount: 148.1 }, { currencyCode: 'LKR', amount: 34833.64 }, { currencyCode: 'ZAR', amount: 2046.7 }, { currencyCode: 'KRW', amount: 157434.69 }, { currencyCode: 'SEK', amount: 1104.2 }, { currencyCode: 'CHF', amount: 92.09 }, { currencyCode: 'TZS', amount: 304928.36 }, { currencyCode: 'THB', amount: 3771.07 }, { currencyCode: 'TRY', amount: 4635.79 }, { currencyCode: 'UAH', amount: 4862.65 }, { currencyCode: 'AED', amount: 427.55 }, { currencyCode: 'USD', amount: 1600 }, { currencyCode: 'UYU', amount: 599418.75 }, { currencyCode: 'VND', amount: 390159562.5 }, { currencyCode: 'XOF', amount: 8344237.5 }
        ] },
        revenueRecognition: 'Accrual',
        switcherLogic: [],
        refundPolicy: { id: 'NO_CREDIT', description: 'No (field sales rep can however give customer a credit toward next invoice)' },
      },
    ],
  },
  {
    id: '5095305',
    name: 'Sales Navigator Core',
    description: 'Build trusted relationships by using the power of LinkedIn data to find, research, and communicate with customers/prospects.',
    lob: 'LSS',
    folder: 'Sales Navigator',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/sales/core',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 7,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: 1,
    seatMax: 1,
    digitalGoods: ['Core Sales Nav Features', '50 InMail Messages/month'],
    tags: [{ type: 'Customer Type', value: 'Individual member' }, { type: 'Sales Top of Funnel', value: 'Web CTA' }],
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: 'https://www.linkedin.com/sales/core',
    skus: [
      {
        id: 'sku_5095305a',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Annual',
        price: { startDate: '2024-01-01', pricePoints: [
          { currencyCode: 'AUD', amount: 1466.42 }, { currencyCode: 'ARS', amount: 1157.04 }, { currencyCode: 'BDT', amount: 117941.75 }, { currencyCode: 'BGN', amount: 1594.18 }, { currencyCode: 'BYN', amount: 3010.02 }, { currencyCode: 'BRL', amount: 5418.58 }, { currencyCode: 'GBP', amount: 726.54 }, { currencyCode: 'CAD', amount: 1360.24 }, { currencyCode: 'CLP', amount: 930331.01 }, { currencyCode: 'COP', amount: 4061618.38 }, { currencyCode: 'CRC', amount: 503264.54 }, { currencyCode: 'CZK', amount: 20849.08 }, { currencyCode: 'DKK', amount: 6309.47 }, { currencyCode: 'EGP', amount: 49260.55 }, { currencyCode: 'EUR', amount: 844.75 }, { currencyCode: 'GTQ', amount: 7654.01 }, { currencyCode: 'HNL', amount: 26047.85 }, { currencyCode: 'HKD', amount: 7824.18 }, { currencyCode: 'HUF', amount: 337105.89 }, { currencyCode: 'INR', amount: 9961.4 }, { currencyCode: 'IDR', amount: 1885408.82 }, { currencyCode: 'ILS', amount: 391.95 }, { currencyCode: 'JPY', amount: 16672.01 }, { currencyCode: 'JOD', amount: 82.59 }, { currencyCode: 'KES', amount: 15008.82 }, { currencyCode: 'KWD', amount: 35.46 }, { currencyCode: 'LBP', amount: 10416350 }, { currencyCode: 'MYR', amount: 4208.57 }, { currencyCode: 'MXN', amount: 17986.95 }, { currencyCode: 'MAD', amount: 8607.72 }, { currencyCode: 'TWD', amount: 27883.9 }, { currencyCode: 'NZD', amount: 1579.16 }, { currencyCode: 'NGN', amount: 1469145.42 }, { currencyCode: 'NOK', amount: 9667.33 }, { currencyCode: 'PKR', amount: 282800.15 }, { currencyCode: 'PEN', amount: 3529.14 }, { currencyCode: 'PHP', amount: 56158.67 }, { currencyCode: 'PLN', amount: 3600.36 }, { currencyCode: 'QAR', amount: 3636.36 }, { currencyCode: 'RON', amount: 4291.19 }, { currencyCode: 'RUB', amount: 78225.5 }, { currencyCode: 'SAR', amount: 3746.25 }, { currencyCode: 'RSD', amount: 98933.77 }, { currencyCode: 'SGD', amount: 1222.84 }, { currencyCode: 'LKR', amount: 298711.17 }, { currencyCode: 'ZAR', amount: 17551.99 }, { currencyCode: 'KRW', amount: 1298154.68 }, { currencyCode: 'SEK', amount: 9467.92 }, { currencyCode: 'CHF', amount: 789.71 }, { currencyCode: 'TZS', amount: 2614885.91 }, { currencyCode: 'THB', amount: 32341.69 }, { currencyCode: 'TRY', amount: 39756.24 }, { currencyCode: 'UAH', amount: 41697.18 }, { currencyCode: 'AED', amount: 3666.33 }, { currencyCode: 'USD', amount: 959 }, { currencyCode: 'UYU', amount: 39836.04 }, { currencyCode: 'VND', amount: 25933355.51 }, { currencyCode: 'XOF', amount: 554359.84 }
        ] },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [{type: 'Upgrade', targetProductId: '5073467'}],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      },
      {
        id: 'sku_5095305b',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Monthly',
        price: { startDate: '2024-01-01', pricePoints: [
          { currencyCode: 'AUD', amount: 152.88 }, { currencyCode: 'ARS', amount: 120619.39 }, { currencyCode: 'BDT', amount: 12294.77 }, { currencyCode: 'BGN', amount: 166.19 }, { currencyCode: 'BYN', amount: 313.78 }, { currencyCode: 'BRL', amount: 544.03 }, { currencyCode: 'GBP', amount: 72.97 }, { currencyCode: 'CAD', amount: 136.45 }, { currencyCode: 'CLP', amount: 93389.61 }, { currencyCode: 'COP', amount: 4061618.38 }, { currencyCode: 'CRC', amount: 503264.54 }, { currencyCode: 'CZK', amount: 20849.08 }, { currencyCode: 'DKK', amount: 6309.47 }, { currencyCode: 'EGP', amount: 49260.55 }, { currencyCode: 'EUR', amount: 844.75 }, { currencyCode: 'GTQ', amount: 7654.01 }, { currencyCode: 'HNL', amount: 26047.85 }, { currencyCode: 'HKD', amount: 7824.18 }, { currencyCode: 'HUF', amount: 337105.89 }, { currencyCode: 'INR', amount: 9961.4 }, { currencyCode: 'IDR', amount: 1885408.82 }, { currencyCode: 'ILS', amount: 391.95 }, { currencyCode: 'JPY', amount: 16672.01 }, { currencyCode: 'JOD', amount: 82.59 }, { currencyCode: 'KES', amount: 15008.82 }, { currencyCode: 'KWD', amount: 35.46 }, { currencyCode: 'LBP', amount: 10416350 }, { currencyCode: 'MYR', amount: 4208.57 }, { currencyCode: 'MXN', amount: 17986.95 }, { currencyCode: 'MAD', amount: 8607.72 }, { currencyCode: 'TWD', amount: 27883.9 }, { currencyCode: 'NZD', amount: 1579.16 }, { currencyCode: 'NGN', amount: 1469145.42 }, { currencyCode: 'NOK', amount: 9667.33 }, { currencyCode: 'PKR', amount: 282800.15 }, { currencyCode: 'PEN', amount: 3529.14 }, { currencyCode: 'PHP', amount: 56158.67 }, { currencyCode: 'PLN', amount: 3600.36 }, { currencyCode: 'QAR', amount: 3636.36 }, { currencyCode: 'RON', amount: 4291.19 }, { currencyCode: 'RUB', amount: 78225.5 }, { currencyCode: 'SAR', amount: 3746.25 }, { currencyCode: 'RSD', amount: 98933.77 }, { currencyCode: 'SGD', amount: 1222.84 }, { currencyCode: 'LKR', amount: 298711.17 }, { currencyCode: 'ZAR', amount: 17551.99 }, { currencyCode: 'KRW', amount: 1298154.68 }, { currencyCode: 'SEK', amount: 9467.92 }, { currencyCode: 'CHF', amount: 789.71 }, { currencyCode: 'TZS', amount: 2614885.91 }, { currencyCode: 'THB', amount: 32341.69 }, { currencyCode: 'TRY', amount: 39756.24 }, { currencyCode: 'UAH', amount: 41697.18 }, { currencyCode: 'AED', amount: 3666.33 }, { currencyCode: 'USD', amount: 99.99 }, { currencyCode: 'UYU', amount: 39836.04 }, { currencyCode: 'VND', amount: 25933355.51 }, { currencyCode: 'XOF', amount: 554359.84 }
        ] },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [{type: 'Upgrade', targetProductId: '5073467'}],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
        seatMax: 40,
        lix: {
          key: 'rc-simplified-pricing',
          treatment: 'enabled',
        },
      },
    ],
  },
  {
    id: '5138141',
    name: 'LinkedIn Learning for Business',
    description: 'Provide your entire organization with unlimited access to over 16,000 expert-led courses.',
    lob: 'LTS',
    folder: 'Learning',
    status: 'Active',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://learning.linkedin.com/for-business',
    seatType: 'Multi-seat enterprise',
    isBundle: true,
    taxClass: 'Varies by region',
    paymentFailureFreeToPaidGracePeriod: 14,
    paymentFailurePaidToPaidGracePeriod: 14,
    seatMin: 2,
    seatMax: 1000,
    digitalGoods: ['Full Course Catalog', 'Admin Analytics', 'Learning Paths'],
    isCancellable: true,
    termsOfServiceUrl: 'https://learning.linkedin.com/legal-terms',
    productUrl: 'https://learning.linkedin.com/for-business',
    skus: [
      {
        id: 'sku_5138141a',
        status: 'Active',
        region: 'EMEA',
        salesChannel: 'Field',
        billingCycle: 'Annual',
        price: {
          pricePoints: [
            { currencyCode: 'AUD', amount: 2400 }, { currencyCode: 'CAD', amount: 3288 }, { currencyCode: 'GBP', amount: 1896 }, { currencyCode: 'EUR', amount: 2208 }, { currencyCode: 'AUD', amount: 3600 }, { currencyCode: 'SGD', amount: 3240 }, { currencyCode: 'INR', amount: 200400 }, { currencyCode: 'HKD', amount: 18720 }, { currencyCode: 'CNY', amount: 17400 }, { currencyCode: 'JPY', amount: 376800 }
          ]
        },
        revenueRecognition: 'Accrual',
        switcherLogic: [],
        refundPolicy: { id: 'NO_CREDIT', description: 'No (field sales rep can however give customer a credit toward next invoice)' },
      }
    ],
  },
  {
    id: '5102113',
    name: 'LinkedIn Ads - Sponsored Content',
    description: 'Promote your company updates to targeted audiences on desktop, mobile, and tablet.',
    lob: 'LMS',
    folder: 'Ads',
    status: 'Active',
    billingModel: 'Usage',
    postPurchaseLandingUrl: 'https://business.linkedin.com/marketing-solutions/ads',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 0,
    seatMin: 1,
    seatMax: 1,
    digitalGoods: ['Ad Campaign Management'],
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/ads-terms',
    productUrl: 'https://business.linkedin.com/marketing-solutions/ads',
    skus: [
      {
        id: 'sku_5102113a',
        status: 'Active',
        region: 'APAC',
        salesChannel: 'Desktop',
        billingCycle: 'Monthly',
        price: {
          pricePoints: [
            { currencyCode: 'AUD', amount: 500 }, { currencyCode: 'EUR', amount: 460 }, { currencyCode: 'JPY', amount: 78500 }, { currencyCode: 'GBP', amount: 395 }, { currencyCode: 'AUD', amount: 750 }, { currencyCode: 'CAD', amount: 685 }, { currencyCode: 'CHF', amount: 450 }, { currencyCode: 'CNY', amount: 3625 }, { currencyCode: 'HKD', amount: 3900 }, { currencyCode: 'NZD', amount: 815 }, { currencyCode: 'SEK', amount: 5225 }, { currencyCode: 'KRW', amount: 688500 }, { currencyCode: 'SGD', amount: 675 }, { currencyCode: 'NOK', amount: 5265 }, { currencyCode: 'MXN', amount: 8565 }, { currencyCode: 'INR', amount: 41750 }, { currencyCode: 'RUB', amount: 45000 }, { currencyCode: 'TRY', amount: 16100 }, { currencyCode: 'BRL', amount: 2575 }, { currencyCode: 'TWD', amount: 16150 }, { currencyCode: 'DKK', amount: 3440 }, { currencyCode: 'PLN', amount: 1975 }, { currencyCode: 'THB', amount: 18350 }, { currencyCode: 'IDR', amount: 8128500 }, { currencyCode: 'HUF', amount: 179500 }, { currencyCode: 'CZK', amount: 11286 }, { currencyCode: 'ILS', amount: 1850 }, { currencyCode: 'CLP', amount: 462500 }, { currencyCode: 'PHP', amount: 29056.5 }, { currencyCode: 'AED', amount: 1835 }, { currencyCode: 'COP', amount: 1959000 }, { currencyCode: 'SAR', amount: 1875 }, { currencyCode: 'MYR', amount: 2350 }, { currencyCode: 'RON', amount: 2300 }, { currencyCode: 'ARS', amount: 448500 }, { currencyCode: 'BDT', amount: 58500 }, { currencyCode: 'VND', amount: 12728500 }, { currencyCode: 'UAH', amount: 20250 }, { currencyCode: 'QAR', amount: 1820 }, { currencyCode: 'KZT', amount: 223500 }, { currencyCode: 'EGP', amount: 23800 }, { currencyCode: 'PKR', amount: 139000 }, { currencyCode: 'OMR', amount: 190 }, { currencyCode: 'LKR', amount: 150500 }, { currencyCode: 'NGN', amount: 740000 }, { currencyCode: 'IQD', amount: 654500 }, { currencyCode: 'DZD', amount: 67000 }, { currencyCode: 'MAD', amount: 5000 }, { currencyCode: 'PAB', amount: 500 }, { currencyCode: 'PEN', amount: 1875 }, { currencyCode: 'UYU', amount: 19500 }, { currencyCode: 'VEF', amount: 1809250000 }, { currencyCode: 'CRC', amount: 256000 }
          ]
        },
        revenueRecognition: 'On invoicing',
        switcherLogic: [],
        refundPolicy: { id: 'YES_TAX_ONLY', description: 'Yes (only for applicable taxes)' },
      }
    ],
  },
  {
    id: '5099987',
    name: 'Glint Employee Engagement',
    description: 'Understand and improve employee engagement with real-time data and insights.',
    lob: 'LTS',
    folder: 'Glint',
    status: 'Legacy',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.glintinc.com/',
    seatType: 'Multi-seat enterprise',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 30,
    paymentFailurePaidToPaidGracePeriod: 30,
    seatMin: 100,
    seatMax: 10000,
    digitalGoods: ['Engagement Surveys', 'Manager Dashboards', 'Action Plans'],
    termsOfServiceUrl: 'https://www.glintinc.com/terms-of-service/',
    productUrl: 'https://www.glintinc.com/',
    skus: [
      {
        id: 'sku_5099987a',
        status: 'Legacy',
        region: 'NAMER',
        salesChannel: 'Field',
        billingCycle: 'Annual',
        price: { pricePoints: [
          { currencyCode: 'AUD', amount: 15000 }, { currencyCode: 'CAD', amount: 20550 }, { currencyCode: 'GBP', amount: 11850 }, { currencyCode: 'EUR', amount: 13800 }, { currencyCode: 'AUD', amount: 22500 }, { currencyCode: 'SGD', amount: 20250 }, { currencyCode: 'INR', amount: 1252500 }, { currencyCode: 'HKD', amount: 117000 }, { currencyCode: 'CNY', amount: 108750 }, { currencyCode: 'JPY', amount: 2355000 }
        ] },
        revenueRecognition: 'Accrual',
        switcherLogic: [],
        refundPolicy: { id: 'NO_CREDIT', description: 'No (field sales rep can however give customer a credit toward next invoice)' },
      }
    ]
  },
  {
    id: '5083690',
    name: 'LinkedIn Jobs - Job Slot',
    description: 'Post a job to reach qualified candidates across the LinkedIn network.',
    lob: 'LTS',
    folder: 'Jobs',
    status: 'Active',
    billingModel: 'One-time',
    postPurchaseLandingUrl: 'https://www.linkedin.com/talent/post-a-job',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 0,
    seatMin: 1,
    seatMax: 1,
    digitalGoods: ['Single Job Posting'],
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/jobs-terms',
    productUrl: 'https://www.linkedin.com/talent/post-a-job',
    skus: [
      {
        id: 'sku_5083690a',
        status: 'Active',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Monthly', // Note: One-time purchase, but cycle can denote duration
        price: { pricePoints: [
          { currencyCode: 'AUD', amount: 495 }, { currencyCode: 'EUR', amount: 455.4 }, { currencyCode: 'JPY', amount: 77715 }, { currencyCode: 'GBP', amount: 391.05 }, { currencyCode: 'AUD', amount: 742.5 }, { currencyCode: 'CAD', amount: 678.15 }, { currencyCode: 'CHF', amount: 445.5 }, { currencyCode: 'CNY', amount: 3588.75 }, { currencyCode: 'HKD', amount: 3861 }, { currencyCode: 'NZD', amount: 806.85 }, { currencyCode: 'SEK', amount: 5172.75 }, { currencyCode: 'KRW', amount: 681615 }, { currencyCode: 'SGD', amount: 668.25 }, { currencyCode: 'NOK', amount: 5212.35 }, { currencyCode: 'MXN', amount: 8479.35 }, { currencyCode: 'INR', amount: 41332.5 }, { currencyCode: 'RUB', amount: 44550 }, { currencyCode: 'ZAR', amount: 9256.5 }, { currencyCode: 'TRY', amount: 15939 }, { currencyCode: 'BRL', amount: 2549.25 }, { currencyCode: 'TWD', amount: 15988.5 }, { currencyCode: 'DKK', amount: 3405.6 }, { currencyCode: 'PLN', amount: 1955.25 }, { currencyCode: 'THB', amount: 18166.5 }, { currencyCode: 'IDR', amount: 8047215 }, { currencyCode: 'HUF', amount: 142800 }, { currencyCode: 'CZK', amount: 9094.8 }, { currencyCode: 'ILS', amount: 1476.3 }, { currencyCode: 'CLP', amount: 368725 }, { currencyCode: 'PHP', amount: 23415.3 }, { currencyCode: 'AED', amount: 1464.03 }, { currencyCode: 'COP', amount: 1562018 }, { currencyCode: 'SAR', amount: 1496.25 }, { currencyCode: 'MYR', amount: 1875.3 }, { currencyCode: 'RON', amount: 1835.4 }, { currencyCode: 'ARS', amount: 35871.03 }, { currencyCode: 'BDT', amount: 46683 }, { currencyCode: 'VND', amount: 10153457 }, { currencyCode: 'UAH', amount: 1619.6 }, { currencyCode: 'QAR', amount: 145.56 }, { currencyCode: 'KZT', amount: 17859.63 }, { currencyCode: 'EGP', amount: 1903.52 }, { currencyCode: 'PKR', amount: 11117.22 }, { currencyCode: 'OMR', amount: 15.19 }, { currencyCode: 'LKR', amount: 12036.99 }, { currencyCode: 'NGN', amount: 590520 }, { currencyCode: 'IQD', amount: 522291 }, { currencyCode: 'DZD', amount: 5358.66 }, { currencyCode: 'MAD', amount: 399.9 }, { currencyCode: 'PAB', amount: 39.99 }, { currencyCode: 'PEN', amount: 149.96 }, { currencyCode: 'UYU', amount: 1559.61 }, { currencyCode: 'VEF', amount: 144680000 }, { currencyCode: 'CRC', amount: 20474.88 }
        ] },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      },
      {
        id: 'sku_5083690b',
        status: 'Active',
        region: 'EMEA',
        salesChannel: 'Desktop',
        billingCycle: 'Monthly',
        price: {
          pricePoints: [
            { currencyCode: 'AUD', amount: 495 }, { currencyCode: 'EUR', amount: 450 }, { currencyCode: 'JPY', amount: 77715 }, { currencyCode: 'GBP', amount: 391.05 }, { currencyCode: 'AUD', amount: 742.5 }, { currencyCode: 'CAD', amount: 678.15 }, { currencyCode: 'CHF', amount: 445.5 }, { currencyCode: 'CNY', amount: 3588.75 }, { currencyCode: 'HKD', amount: 3861 }, { currencyCode: 'NZD', amount: 806.85 }, { currencyCode: 'SEK', amount: 5172.75 }, { currencyCode: 'KRW', amount: 681615 }, { currencyCode: 'SGD', amount: 668.25 }, { currencyCode: 'NOK', amount: 5212.35 }, { currencyCode: 'MXN', amount: 8479.35 }, { currencyCode: 'INR', amount: 41332.5 }, { currencyCode: 'RUB', amount: 44550 }, { currencyCode: 'ZAR', amount: 9256.5 }, { currencyCode: 'TRY', amount: 15939 }, { currencyCode: 'BRL', amount: 2549.25 }, { currencyCode: 'TWD', amount: 15988.5 }, { currencyCode: 'DKK', amount: 3405.6 }, { currencyCode: 'PLN', amount: 1955.25 }, { currencyCode: 'THB', amount: 18166.5 }, { currencyCode: 'IDR', amount: 8047215 }, { currencyCode: 'HUF', amount: 142800 }, { currencyCode: 'CZK', amount: 9094.8 }, { currencyCode: 'ILS', amount: 1476.3 }, { currencyCode: 'CLP', amount: 368725 }, { currencyCode: 'PHP', amount: 23415.3 }, { currencyCode: 'AED', amount: 1464.03 }, { currencyCode: 'COP', amount: 1562018 }, { currencyCode: 'SAR', amount: 1496.25 }, { currencyCode: 'MYR', amount: 1875.3 }, { currencyCode: 'RON', amount: 1835.4 }, { currencyCode: 'ARS', amount: 357803 }, { currencyCode: 'BDT', amount: 46683 }, { currencyCode: 'VND', amount: 10153457 }, { currencyCode: 'UAH', amount: 16159.5 }, { currencyCode: 'QAR', amount: 1452.36 }, { currencyCode: 'KZT', amount: 178153 }, { currencyCode: 'EGP', amount: 1903.52 }, { currencyCode: 'PKR', amount: 110882 }, { currencyCode: 'OMR', amount: 151.62 }, { currencyCode: 'LKR', amount: 120099 }, { currencyCode: 'NGN', amount: 590520 }, { currencyCode: 'IQD', amount: 522291 }, { currencyCode: 'DZD', amount: 53466 }, { currencyCode: 'MAD', amount: 4950 }, { currencyCode: 'PAB', amount: 495 }, { currencyCode: 'PEN', amount: 1856.25 }, { currencyCode: 'UYU', amount: 19305 }, { currencyCode: 'VEF', amount: 1791160000 }, { currencyCode: 'CRC', amount: 253440 }
          ]
        },
        revenueRecognition: 'On payment receipt',
        switcherLogic: [],
        refundPolicy: { id: 'YES_AUTOMATED', description: 'Yes (automated/robo-refund)' },
      }
    ]
  },
  {
    id: '9999999',
    name: 'Retired Product Example',
    description: 'This is an example of a product that has been retired and is no longer available for purchase.',
    lob: 'Premium',
    folder: 'Premium Generic Products',
    status: 'Retired',
    billingModel: 'Subscription',
    postPurchaseLandingUrl: 'https://www.linkedin.com/company/premium/',
    seatType: 'Single seat',
    isBundle: false,
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 0,
    seatMin: 1,
    seatMax: 1,
    digitalGoods: ['Legacy Feature A', 'Legacy Feature B'],
    tags: [{ type: 'Customer Type', value: 'Individual member' }],
    isCancellable: true,
    isEligibleForAmendment: false,
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    howToCancelUrl: 'https://www.linkedin.com/help/linkedin/answer/a134000',
    productUrl: 'https://www.linkedin.com/premium/company-page',
    skus: [
      {
        id: 'sku_9999999a',
        status: 'Retired',
        region: 'NAMER',
        salesChannel: 'Desktop',
        billingCycle: 'Annual',
        price: { startDate: '2022-01-01', endDate: '2023-12-31', pricePoints: [
          { currencyCode: 'AUD', amount: 999 },
        ] },
        revenueRecognition: 'Accrual',
        switcherLogic: [],
        refundPolicy: { id: 'NO_CREDIT', description: 'No' },
        taxClass: 'Taxable (US Specific)',
      },
      {
        id: 'sku_9999999b',
        status: 'Retired',
        region: 'EMEA',
        salesChannel: 'Desktop',
        billingCycle: 'Monthly',
        price: { startDate: '2022-01-01', endDate: '2023-12-31', pricePoints: [
          { currencyCode: 'EUR', amount: 99 },
        ] },
        revenueRecognition: 'Accrual',
        switcherLogic: [],
        refundPolicy: { id: 'NO_CREDIT', description: 'No' },
        taxClass: 'Taxable',
      },
    ],
  },
]; 