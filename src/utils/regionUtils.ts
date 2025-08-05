/**
 * Currency to geographic region mapping utility.
 * Based on industry standards and business geographic classifications.
 */

export type GeographicRegion = 'NAMER' | 'EMEA' | 'APAC' | 'LATAM' | 'Other';

/**
 * Mapping of currency codes to geographic regions.
 * Based on standard business geographic classifications:
 * - NAMER: North America
 * - EMEA: Europe, Middle East, Africa
 * - APAC: Asia-Pacific
 * - LATAM: Latin America
 * - Other: Unmapped currencies
 */
const CURRENCY_REGION_MAP: Record<string, GeographicRegion> = {
  // NAMER (North America)
  'USD': 'NAMER', // United States Dollar
  'CAD': 'NAMER', // Canadian Dollar
  'MXN': 'NAMER', // Mexican Peso

  // EMEA (Europe, Middle East, Africa)
  // Europe
  'EUR': 'EMEA', // Euro
  'GBP': 'EMEA', // British Pound Sterling
  'CHF': 'EMEA', // Swiss Franc
  'DKK': 'EMEA', // Danish Krone
  'NOK': 'EMEA', // Norwegian Krone
  'SEK': 'EMEA', // Swedish Krona
  'PLN': 'EMEA', // Polish Zloty
  'CZK': 'EMEA', // Czech Koruna
  'HUF': 'EMEA', // Hungarian Forint
  'RON': 'EMEA', // Romanian Leu
  'BGN': 'EMEA', // Bulgarian Lev
  'ISK': 'EMEA', // Icelandic Krona
  'RUB': 'EMEA', // Russian Ruble
  'UAH': 'EMEA', // Ukrainian Hryvnia
  'BYN': 'EMEA', // Belarusian Ruble
  'RSD': 'EMEA', // Serbian Dinar
  'TRY': 'EMEA', // Turkish Lira
  
  // Middle East
  'AED': 'EMEA', // UAE Dirham
  'SAR': 'EMEA', // Saudi Riyal
  'QAR': 'EMEA', // Qatari Riyal
  'KWD': 'EMEA', // Kuwaiti Dinar
  'BHD': 'EMEA', // Bahraini Dinar
  'OMR': 'EMEA', // Omani Rial
  'JOD': 'EMEA', // Jordanian Dinar
  'LBP': 'EMEA', // Lebanese Pound
  'ILS': 'EMEA', // Israeli New Shekel
  'IRR': 'EMEA', // Iranian Rial
  'IQD': 'EMEA', // Iraqi Dinar
  'AFN': 'EMEA', // Afghan Afghani
  
  // Africa
  'ZAR': 'EMEA', // South African Rand
  'EGP': 'EMEA', // Egyptian Pound
  'MAD': 'EMEA', // Moroccan Dirham
  'TND': 'EMEA', // Tunisian Dinar
  'NGN': 'EMEA', // Nigerian Naira
  'KES': 'EMEA', // Kenyan Shilling
  'GHS': 'EMEA', // Ghanaian Cedi
  'ETB': 'EMEA', // Ethiopian Birr
  'TZS': 'EMEA', // Tanzanian Shilling
  'UGX': 'EMEA', // Ugandan Shilling
  'RWF': 'EMEA', // Rwandan Franc
  'ZMW': 'EMEA', // Zambian Kwacha
  'BWP': 'EMEA', // Botswanan Pula
  'NAD': 'EMEA', // Namibian Dollar
  'SZL': 'EMEA', // Swazi Lilangeni
  'LSL': 'EMEA', // Lesotho Loti
  'MUR': 'EMEA', // Mauritian Rupee
  'SCR': 'EMEA', // Seychellois Rupee
  'XOF': 'EMEA', // West African CFA Franc
  'XAF': 'EMEA', // Central African CFA Franc
  'DJF': 'EMEA', // Djiboutian Franc
  'ERN': 'EMEA', // Eritrean Nakfa
  'SOS': 'EMEA', // Somali Shilling
  'SDP': 'EMEA', // Sudanese Pound
  'LYD': 'EMEA', // Libyan Dinar
  'DZD': 'EMEA', // Algerian Dinar

  // APAC (Asia-Pacific)
  // East Asia
  'JPY': 'APAC', // Japanese Yen
  'KRW': 'APAC', // South Korean Won
  'CNY': 'APAC', // Chinese Yuan
  'HKD': 'APAC', // Hong Kong Dollar
  'TWD': 'APAC', // Taiwan Dollar
  'MOP': 'APAC', // Macanese Pataca
  'MNT': 'APAC', // Mongolian Tugrik
  'KPW': 'APAC', // North Korean Won
  
  // Southeast Asia
  'SGD': 'APAC', // Singapore Dollar
  'MYR': 'APAC', // Malaysian Ringgit
  'THB': 'APAC', // Thai Baht
  'IDR': 'APAC', // Indonesian Rupiah
  'PHP': 'APAC', // Philippine Peso
  'VND': 'APAC', // Vietnamese Dong
  'LAK': 'APAC', // Lao Kip
  'KHR': 'APAC', // Cambodian Riel
  'MMK': 'APAC', // Myanmar Kyat
  'BND': 'APAC', // Brunei Dollar
  'TLS': 'APAC', // Timor-Leste Dollar
  
  // South Asia
  'INR': 'APAC', // Indian Rupee
  'PKR': 'APAC', // Pakistani Rupee
  'BDT': 'APAC', // Bangladeshi Taka
  'LKR': 'APAC', // Sri Lankan Rupee
  'NPR': 'APAC', // Nepalese Rupee
  'BTN': 'APAC', // Bhutanese Ngultrum
  'MVR': 'APAC', // Maldivian Rufiyaa
  
  // Central Asia
  'KZT': 'APAC', // Kazakhstani Tenge
  'UZS': 'APAC', // Uzbekistani Som
  'TJS': 'APAC', // Tajikistani Somoni
  'KGS': 'APAC', // Kyrgyzstani Som
  'TMT': 'APAC', // Turkmenistani Manat
  
  // Pacific
  'AUD': 'APAC', // Australian Dollar
  'NZD': 'APAC', // New Zealand Dollar
  'FJD': 'APAC', // Fijian Dollar
  'PGK': 'APAC', // Papua New Guinean Kina
  'SBD': 'APAC', // Solomon Islands Dollar
  'VUV': 'APAC', // Vanuatu Vatu
  'TOP': 'APAC', // Tongan Pa'anga
  'WST': 'APAC', // Samoan Tala
  'XPF': 'APAC', // CFP Franc (Pacific)

  // LATAM (Latin America)
  'BRL': 'LATAM', // Brazilian Real
  'ARS': 'LATAM', // Argentine Peso
  'CLP': 'LATAM', // Chilean Peso
  'COP': 'LATAM', // Colombian Peso
  'PEN': 'LATAM', // Peruvian Sol
  'UYU': 'LATAM', // Uruguayan Peso
  'PYG': 'LATAM', // Paraguayan Guarani
  'BOB': 'LATAM', // Bolivian Boliviano
  'VED': 'LATAM', // Venezuelan Bolívar Digital
  'VES': 'LATAM', // Venezuelan Bolívar Soberano
  'GYD': 'LATAM', // Guyanese Dollar
  'SRD': 'LATAM', // Surinamese Dollar
  'TTD': 'LATAM', // Trinidad and Tobago Dollar
  'JMD': 'LATAM', // Jamaican Dollar
  'HTG': 'LATAM', // Haitian Gourde
  'DOP': 'LATAM', // Dominican Peso
  'CUP': 'LATAM', // Cuban Peso
  'CUC': 'LATAM', // Cuban Convertible Peso
  'GTQ': 'LATAM', // Guatemalan Quetzal
  'HNL': 'LATAM', // Honduran Lempira
  'NIO': 'LATAM', // Nicaraguan Córdoba
  'CRC': 'LATAM', // Costa Rican Colón
  'PAB': 'LATAM', // Panamanian Balboa
  'BBD': 'LATAM', // Barbadian Dollar
  'XCD': 'LATAM', // East Caribbean Dollar
  'BZD': 'LATAM', // Belize Dollar
  'AWG': 'LATAM', // Aruban Florin
  'ANG': 'LATAM', // Netherlands Antillean Guilder
  'KYD': 'LATAM', // Cayman Islands Dollar
  'BMD': 'LATAM', // Bermudian Dollar
};

/**
 * Gets the geographic region for a given currency code.
 * @param currencyCode - The ISO 4217 currency code (e.g., 'USD', 'EUR')
 * @returns The geographic region or 'Other' if not mapped
 */
export const getCurrencyRegion = (currencyCode: string): GeographicRegion => {
  return CURRENCY_REGION_MAP[currencyCode] || 'Other';
};

/**
 * Gets all currencies for a specific region.
 * @param region - The geographic region
 * @returns Array of currency codes in that region
 */
export const getCurrenciesForRegion = (region: GeographicRegion): string[] => {
  if (region === 'Other') {
    return []; // Other is for unmapped currencies, can't list them
  }
  
  return Object.entries(CURRENCY_REGION_MAP)
    .filter(([_, mappedRegion]) => mappedRegion === region)
    .map(([currency, _]) => currency)
    .sort();
};

/**
 * Gets a sorted list of all available regions.
 * @returns Array of all geographic regions
 */
export const getAllRegions = (): GeographicRegion[] => {
  return ['NAMER', 'EMEA', 'APAC', 'LATAM', 'Other'];
};

/**
 * Gets a human-readable name for a region.
 * @param region - The geographic region code
 * @returns The full name of the region
 */
export const getRegionDisplayName = (region: GeographicRegion): string => {
  const regionNames: Record<GeographicRegion, string> = {
    'NAMER': 'North America',
    'EMEA': 'Europe, Middle East & Africa',
    'APAC': 'Asia-Pacific',
    'LATAM': 'Latin America',
    'Other': 'Other'
  };
  
  return regionNames[region];
};