import type { ColumnVisibility } from './types';
import { PRICE_POINT_GROUP_BY_OPTIONS } from './tableConfigurations';

export interface ChannelConfig {
  // Validity filter defaults
  defaultValidityFilter: 'most-recent' | 'all-periods';
  
  // Column visibility defaults
  defaultColumnVisibility: ColumnVisibility;
  
  // Available grouping options
  availableGroupByOptions: string[];
  
  // Other channel-specific settings
  showUsdEquivalent: boolean;
  
  // Future extensibility
  [key: string]: any;
}

// Channel configuration definitions
export const CHANNEL_CONFIGS: Record<string, ChannelConfig> = {
  'Field': {
    defaultValidityFilter: 'most-recent',
    defaultColumnVisibility: {
      id: true,
      currency: true,
      currencyType: true, // Category
      amount: true,
      usdEquivalent: true,
      validity: true,
      status: true,
      pricingRule: false,
      quantityRange: false,
      priceType: false,
      pricingTier: false,
    },
    availableGroupByOptions: [
      'None',
      'Validity', 
      'Currency',
      'Category',
      'Region'
    ],
    showUsdEquivalent: true,
  },
  
  'Desktop': {
    defaultValidityFilter: 'all-periods',
    defaultColumnVisibility: {
      id: true,
      currency: true,
      currencyType: true, // Category
      amount: true,
      usdEquivalent: false, // Desktop users may care less about USD equivalent
      validity: true,
      status: true,
      pricingRule: false,
      quantityRange: false,
      priceType: false,
      pricingTier: false,
    },
    availableGroupByOptions: [
      'None',
      'Validity',
      'Currency', 
      'Category',
      'Status',
      'Region',
      'Pricing rule',
      'Price type'
    ],
    showUsdEquivalent: false,
  },
  
  'iOS': {
    defaultValidityFilter: 'all-periods',
    defaultColumnVisibility: {
      id: true,
      currency: true,
      currencyType: true,
      amount: true,
      usdEquivalent: false,
      validity: true,
      status: true,
      pricingRule: false,
      quantityRange: false,
      priceType: false,
      pricingTier: false,
    },
    availableGroupByOptions: [
      'None',
      'Validity',
      'Currency',
      'Category',
      'Region'
    ],
    showUsdEquivalent: false,
  },
  
  'GPB': {
    defaultValidityFilter: 'all-periods',
    defaultColumnVisibility: {
      id: true,
      currency: true,
      currencyType: true,
      amount: true,
      usdEquivalent: false,
      validity: true,
      status: true,
      pricingRule: false,
      quantityRange: false,
      priceType: false,
      pricingTier: false,
    },
    availableGroupByOptions: [
      'None',
      'Validity',
      'Currency',
      'Category', 
      'Region'
    ],
    showUsdEquivalent: false,
  },
};

// Default fallback configuration (matches current behavior)
export const DEFAULT_CHANNEL_CONFIG: ChannelConfig = {
  defaultValidityFilter: 'most-recent',
  defaultColumnVisibility: {
    id: true,
    currency: true,
    currencyType: true,
    amount: true,
    usdEquivalent: true,
    validity: true,
    status: true,
    pricingRule: false,
    quantityRange: false,
    priceType: false,
    pricingTier: false,
  },
  availableGroupByOptions: PRICE_POINT_GROUP_BY_OPTIONS,
  showUsdEquivalent: true,
};

/**
 * Determines the primary channel from a list of channels.
 * Priority: Field > Desktop > iOS > GPB > others
 */
export const getPrimaryChannel = (channels: string[]): string => {
  const channelPriority = ['Field', 'Desktop', 'iOS', 'GPB'];
  
  for (const priorityChannel of channelPriority) {
    if (channels.includes(priorityChannel)) {
      return priorityChannel;
    }
  }
  
  // Return first channel if no priority match
  return channels[0] || 'Desktop';
};

/**
 * Gets the configuration for a specific channel or set of channels.
 * If multiple channels, uses priority logic to determine primary channel.
 */
export const getChannelConfig = (channels: string[]): ChannelConfig => {
  console.log('getChannelConfig - Input channels:', channels);
  
  if (!channels || channels.length === 0) {
    console.log('getChannelConfig - No channels provided, using DEFAULT_CHANNEL_CONFIG');
    return DEFAULT_CHANNEL_CONFIG;
  }
  
  const primaryChannel = getPrimaryChannel(channels);
  console.log('getChannelConfig - Primary channel determined:', primaryChannel);
  
  const config = CHANNEL_CONFIGS[primaryChannel] || DEFAULT_CHANNEL_CONFIG;
  console.log('getChannelConfig - Using config:', config);
  
  // Return specific channel config or fallback to default
  return config;
};

/**
 * Helper to determine if a channel configuration should show USD equivalent by default
 */
export const shouldShowUsdEquivalent = (channels: string[]): boolean => {
  const config = getChannelConfig(channels);
  return config.showUsdEquivalent;
};

/**
 * Helper to get the default validity filter for channels
 */
export const getDefaultValidityFilter = (channels: string[]): 'most-recent' | 'all-periods' => {
  const config = getChannelConfig(channels);
  return config.defaultValidityFilter;
};

/**
 * Helper to get available group-by options for channels  
 */
export const getAvailableGroupByOptions = (channels: string[]): string[] => {
  const config = getChannelConfig(channels);
  return config.availableGroupByOptions;
};

/**
 * Helper to get default column visibility for channels
 */
export const getDefaultColumnVisibility = (channels: string[]): ColumnVisibility => {
  const config = getChannelConfig(channels);
  return config.defaultColumnVisibility;
};
