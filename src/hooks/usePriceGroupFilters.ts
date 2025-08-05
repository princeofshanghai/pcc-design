import { useState, useMemo } from 'react';
import type { Sku, SalesChannel, PricePoint } from '../utils/types';
import { formatValidityRange, toSentenceCase } from '../utils/formatters';
import { generateDynamicOptionsWithCounts } from '../utils/filterUtils';

/**
 * Determines the common validity range for a price group based on its price points
 */
const getCommonValidityRange = (pricePoints: PricePoint[]): string => {
  if (!pricePoints || pricePoints.length === 0) return 'N/A';

  // Count frequency of valid from dates
  const validFromCounts: Record<string, number> = {};
  const validToCounts: Record<string, number> = {};
  
  pricePoints.forEach(point => {
    const validFrom = point.validFrom || '';
    const validTo = point.validTo || '';
    
    validFromCounts[validFrom] = (validFromCounts[validFrom] || 0) + 1;
    validToCounts[validTo] = (validToCounts[validTo] || 0) + 1;
  });

  // Find most common valid from date
  const validFromEntries = Object.entries(validFromCounts);
  const mostCommonValidFromEntry = validFromEntries.reduce((prev, current) => 
    current[1] > prev[1] ? current : prev
  );
  const mostCommonValidFrom = mostCommonValidFromEntry[0];
  const validFromFrequency = mostCommonValidFromEntry[1];

  // Find most common valid to date
  const validToEntries = Object.entries(validToCounts);
  const mostCommonValidToEntry = validToEntries.reduce((prev, current) => 
    current[1] > prev[1] ? current : prev
  );
  const mostCommonValidTo = mostCommonValidToEntry[0];
  const validToFrequency = mostCommonValidToEntry[1];

  // Check if dates are mixed
  const hasMultipleValidFromDates = validFromEntries.length > 1;
  const hasMultipleValidToDates = validToEntries.length > 1;
  
  // If valid from dates vary significantly, show "Mixed validity"
  if (hasMultipleValidFromDates && validFromFrequency < pricePoints.length * 0.7) {
    return 'Mixed validity';
  }
  
  // If valid to dates vary significantly, but valid from dates are consistent
  if (hasMultipleValidToDates && validToFrequency < pricePoints.length * 0.7) {
    return formatValidityRange(mostCommonValidFrom, undefined) + ' - Mixed validity end dates';
  }
  
  // Use most common dates
  return formatValidityRange(
    mostCommonValidFrom || undefined, 
    mostCommonValidTo || undefined
  );
};

/**
 * Gets the earliest validFrom date from price points for sorting purposes
 * Returns timestamp (number) for easy comparison
 */
const getEarliestValidFrom = (pricePoints: PricePoint[]): number => {
  if (!pricePoints || pricePoints.length === 0) return 0;
  
  const validFromDates = pricePoints
    .map(p => p.validFrom)
    .filter((date): date is string => Boolean(date))
    .map(date => new Date(date).getTime());
    
  if (validFromDates.length === 0) return 0;
  
  return Math.min(...validFromDates);
};

export const usePriceGroupFilters = (initialSkus: Sku[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<SalesChannel | null>(null);
  const [channelFilters, setChannelFilters] = useState<SalesChannel[]>([]);
  const [billingCycleFilter, setBillingCycleFilter] = useState<string | null>(null);
  const [experimentFilter, setExperimentFilter] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<string>('None');
  const [sortOrder, setSortOrder] = useState<string>('None');

  // Derive unique price groups and their associated SKUs
  const priceGroupMap = useMemo(() => {
    const map: Record<string, { priceGroup: any; skus: any[] }> = {};
    initialSkus.forEach(sku => {
      const id = sku.priceGroup.id || '';
      if (!map[id]) {
        map[id] = { priceGroup: sku.priceGroup, skus: [] };
      }
      map[id].skus.push(sku);
    });
    return map;
  }, [initialSkus]);

  // Apply filters
  const filteredPriceGroups = useMemo(() => {
    let filtered = Object.values(priceGroupMap);

    // Search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((group: { priceGroup: any; skus: any[] }) => 
        (group.priceGroup.id || '').toLowerCase().includes(lowercasedQuery) ||
        (group.priceGroup.name || '').toLowerCase().includes(lowercasedQuery)
      );
    }

    // Channel filter - use multiselect if active, otherwise single-select
    if (channelFilters.length > 0) {
      filtered = filtered.filter((group: { skus: any[] }) => 
        group.skus.some((sku: any) => channelFilters.includes(sku.salesChannel))
      );
    } else if (channelFilter) {
      filtered = filtered.filter((group: { skus: any[] }) => 
        group.skus.some((sku: any) => sku.salesChannel === channelFilter)
      );
    }

    // Billing cycle filter
    if (billingCycleFilter) {
      filtered = filtered.filter((group: { skus: any[] }) => 
        group.skus.some((sku: any) => sku.billingCycle === billingCycleFilter)
      );
    }

    // Experiment filter (by LIX key)
    if (experimentFilter) {
      filtered = filtered.filter((group: { skus: any[] }) => 
        group.skus.some((sku: any) => sku.lix?.key === experimentFilter)
      );
    }

    return filtered;
  }, [priceGroupMap, searchQuery, channelFilter, channelFilters, billingCycleFilter, experimentFilter]);

  // Helper function to get billing cycle priority (for default sort)
  const getBillingCyclePriority = (cycle: string): number => {
    switch (cycle.toLowerCase()) {
      case 'monthly': return 1;
      case 'annual': return 2;
      case 'quarterly': return 3;
      default: return 999; // Unknown cycles go to end
    }
  };

  // Helper function to get primary channel from a price group's SKUs
  const getPrimaryChannel = (skus: any[]): string => {
    if (skus.length === 0) return '';
    // Get all unique channels and return the first one alphabetically for consistency
    const uniqueChannels = [...new Set(skus.map(sku => sku.salesChannel))];
    return uniqueChannels.sort()[0] || '';
  };

  // Helper function to get primary billing cycle from a price group's SKUs
  const getPrimaryBillingCycle = (skus: any[]): string => {
    if (skus.length === 0) return '';
    // Get all unique billing cycles and return the one with highest priority
    const uniqueCycles = [...new Set(skus.map(sku => sku.billingCycle))];
    return uniqueCycles.sort((a, b) => getBillingCyclePriority(a) - getBillingCyclePriority(b))[0] || '';
  };

  // Helper function to sort price groups
  const sortPriceGroups = (priceGroups: typeof filteredPriceGroups) => {
    const sorted = [...priceGroups];
    sorted.sort((a, b) => {
      if (sortOrder === 'ID (A-Z)') { 
        return (a.priceGroup.id || '').localeCompare(b.priceGroup.id || ''); 
      }
      if (sortOrder === 'ID (Z-A)') { 
        return (b.priceGroup.id || '').localeCompare(a.priceGroup.id || ''); 
      }
      if (sortOrder === 'Name (A-Z)') { 
        // Handle optional names: sort missing names to end, then by ID as secondary
        const aName = a.priceGroup.name || '';
        const bName = b.priceGroup.name || '';
        if (!aName && !bName) return (a.priceGroup.id || '').localeCompare(b.priceGroup.id || '');
        if (!aName) return 1; // a goes to end
        if (!bName) return -1; // b goes to end
        return aName.localeCompare(bName); 
      }
      if (sortOrder === 'Name (Z-A)') { 
        // Handle optional names: sort missing names to end, then by ID as secondary
        const aName = a.priceGroup.name || '';
        const bName = b.priceGroup.name || '';
        if (!aName && !bName) return (b.priceGroup.id || '').localeCompare(a.priceGroup.id || '');
        if (!aName) return 1; // a goes to end
        if (!bName) return -1; // b goes to end
        return bName.localeCompare(aName); 
      }
      if (sortOrder === 'Price points (Low to High)') { 
        return a.priceGroup.pricePoints.length - b.priceGroup.pricePoints.length; 
      }
      if (sortOrder === 'Price points (High to Low)') { 
        return b.priceGroup.pricePoints.length - a.priceGroup.pricePoints.length; 
      }
      if (sortOrder === 'SKU (Low to High)') { 
        return a.skus.length - b.skus.length; 
      }
      if (sortOrder === 'SKU (High to Low)') { 
        return b.skus.length - a.skus.length; 
      }
      if (sortOrder === 'Channel (A-Z)') {
        // Get primary channel (most common) for each price group
        const getChannelCounts = (skus: any[]) => skus.reduce((acc: Record<string, number>, sku: any) => {
          acc[sku.salesChannel] = (acc[sku.salesChannel] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const aChannel = Object.entries(getChannelCounts(a.skus)).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '';
        const bChannel = Object.entries(getChannelCounts(b.skus)).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '';
        return aChannel.localeCompare(bChannel);
      }
      if (sortOrder === 'Channel (Z-A)') {
        // Get primary channel (most common) for each price group
        const getChannelCounts = (skus: any[]) => skus.reduce((acc: Record<string, number>, sku: any) => {
          acc[sku.salesChannel] = (acc[sku.salesChannel] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const aChannel = Object.entries(getChannelCounts(a.skus)).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '';
        const bChannel = Object.entries(getChannelCounts(b.skus)).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '';
        return bChannel.localeCompare(aChannel);
      }
      if (sortOrder === 'Billing Cycle (A-Z)') {
        // Get primary billing cycle (most common) for each price group
        const getCycleCounts = (skus: any[]) => skus.reduce((acc: Record<string, number>, sku: any) => {
          acc[sku.billingCycle] = (acc[sku.billingCycle] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const aCycle = Object.entries(getCycleCounts(a.skus)).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '';
        const bCycle = Object.entries(getCycleCounts(b.skus)).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '';
        return aCycle.localeCompare(bCycle);
      }
      if (sortOrder === 'Billing Cycle (Z-A)') {
        // Get primary billing cycle (most common) for each price group
        const getCycleCounts = (skus: any[]) => skus.reduce((acc: Record<string, number>, sku: any) => {
          acc[sku.billingCycle] = (acc[sku.billingCycle] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const aCycle = Object.entries(getCycleCounts(a.skus)).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '';
        const bCycle = Object.entries(getCycleCounts(b.skus)).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '';
        return bCycle.localeCompare(aCycle);
      }
      if (sortOrder === 'USD Price (Low to High)') {
        const aUsd = a.priceGroup.pricePoints.find((p: any) => p.currencyCode === 'USD');
        const bUsd = b.priceGroup.pricePoints.find((p: any) => p.currencyCode === 'USD');
        const aAmount = aUsd?.amount || 0;
        const bAmount = bUsd?.amount || 0;
        return aAmount - bAmount;
      }
      if (sortOrder === 'USD Price (High to Low)') {
        const aUsd = a.priceGroup.pricePoints.find((p: any) => p.currencyCode === 'USD');
        const bUsd = b.priceGroup.pricePoints.find((p: any) => p.currencyCode === 'USD');
        const aAmount = aUsd?.amount || 0;
        const bAmount = bUsd?.amount || 0;
        return bAmount - aAmount;
      }
      if (sortOrder === 'Validity (Earliest to Latest)') {
        const aDate = new Date(a.priceGroup.validFrom).getTime();
        const bDate = new Date(b.priceGroup.validFrom).getTime();
        return aDate - bDate;
      }
      if (sortOrder === 'Validity (Latest to Earliest)') {
        const aDate = new Date(a.priceGroup.validFrom).getTime();
        const bDate = new Date(b.priceGroup.validFrom).getTime();
        return bDate - aDate;
      }
      if (sortOrder === 'LIX Key (A-Z)') {
        // Get LIX key from the first SKU with LIX data, handle missing LIX keys
        const aLixKey = a.skus.find((sku: any) => sku.lix?.key)?.lix?.key || '';
        const bLixKey = b.skus.find((sku: any) => sku.lix?.key)?.lix?.key || '';
        
        // Sort missing LIX keys to the end
        if (!aLixKey && !bLixKey) return (a.priceGroup.id || '').localeCompare(b.priceGroup.id || '');
        if (!aLixKey) return 1; // a goes to end
        if (!bLixKey) return -1; // b goes to end
        return aLixKey.localeCompare(bLixKey);
      }
      if (sortOrder === 'LIX Key (Z-A)') {
        // Get LIX key from the first SKU with LIX data, handle missing LIX keys
        const aLixKey = a.skus.find((sku: any) => sku.lix?.key)?.lix?.key || '';
        const bLixKey = b.skus.find((sku: any) => sku.lix?.key)?.lix?.key || '';
        
        // Sort missing LIX keys to the end
        if (!aLixKey && !bLixKey) return (b.priceGroup.id || '').localeCompare(a.priceGroup.id || '');
        if (!aLixKey) return 1; // a goes to end
        if (!bLixKey) return -1; // b goes to end
        return bLixKey.localeCompare(aLixKey);
      }
      
      // Default multi-level sort when sortOrder is 'None' or unrecognized
      // 1. Primary: Validity (most recent first) - calculated from price points
      const aValidFrom = getEarliestValidFrom(a.priceGroup.pricePoints);
      const bValidFrom = getEarliestValidFrom(b.priceGroup.pricePoints);
      if (aValidFrom !== bValidFrom) {
        return bValidFrom - aValidFrom; // Most recent first (descending)
      }
      
      // 2. Secondary: Channel (A-Z)
      const aChannel = getPrimaryChannel(a.skus);
      const bChannel = getPrimaryChannel(b.skus);
      if (aChannel !== bChannel) {
        return aChannel.localeCompare(bChannel);
      }
      
      // 3. Tertiary: Billing Cycle (Monthly, Annual, Quarterly)
      const aBillingCycle = getPrimaryBillingCycle(a.skus);
      const bBillingCycle = getPrimaryBillingCycle(b.skus);
      const aPriority = getBillingCyclePriority(aBillingCycle);
      const bPriority = getBillingCyclePriority(bBillingCycle);
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // 4. Final fallback: ID (for consistency)
      return (a.priceGroup.id || '').localeCompare(b.priceGroup.id || '');
    });
    return sorted;
  };

  const sortedPriceGroups = useMemo(() => {
    // If no grouping, sort all filtered price groups
    if (groupBy === 'None') {
      return sortPriceGroups(filteredPriceGroups);
    }
    // If grouping is active, return filtered price groups (sorting happens within groups)
    return filteredPriceGroups;
  }, [filteredPriceGroups, sortOrder, groupBy]);

  // Apply grouping
  const groupedPriceGroups = useMemo(() => {
    if (groupBy === 'None') {
      return null;
    }

    const grouped: Record<string, typeof sortedPriceGroups> = {};
    
    sortedPriceGroups.forEach((group: { priceGroup: any; skus: any[] }) => {
      let groupKey: string;
      
      if (groupBy === 'Channel') {
        // Group by the primary channel (most common channel in the group)
        const channelCounts = group.skus.reduce((acc: Record<string, number>, sku: any) => {
          acc[sku.salesChannel] = (acc[sku.salesChannel] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        groupKey = Object.entries(channelCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0][0];
      } else if (groupBy === 'Billing Cycle') {
        // Group by the primary billing cycle
        const cycleCounts = group.skus.reduce((acc: Record<string, number>, sku: any) => {
          acc[sku.billingCycle] = (acc[sku.billingCycle] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        groupKey = Object.entries(cycleCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0][0];
      } else if (groupBy === 'Validity') {
        // Group by validity range of the price group
        groupKey = getCommonValidityRange(group.priceGroup.pricePoints);
      } else if (groupBy === 'Experiment') {
        // Group by experiment key
        const skuWithLix = group.skus.find((sku: any) => sku.lix?.key);
        groupKey = skuWithLix?.lix?.key || 'No Experiment';
      } else {
        groupKey = 'Other';
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(group);
    });

    // Sort within each group
    Object.keys(grouped).forEach(key => {
      grouped[key] = sortPriceGroups(grouped[key]);
    });

    // Apply alphabetical ordering to group keys consistent with ViewOptions.tsx
    const sortedGroups: Record<string, typeof sortedPriceGroups> = {};
    Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .forEach(groupKey => {
        sortedGroups[groupKey] = grouped[groupKey];
      });

    return sortedGroups;
  }, [sortedPriceGroups, groupBy, sortOrder]);

  // Generate filter options from initial SKU data with counts
  const channelOptions = useMemo(() => {
    const optionsWithCounts = generateDynamicOptionsWithCounts(
      initialSkus,
      sku => sku.salesChannel,
      channel => channel === 'iOS' ? 'iOS' : toSentenceCase(channel)
    );
    return optionsWithCounts.map(option => ({
      value: option.value,
      label: `${option.label} (${option.count})`
    }));
  }, [initialSkus]);

  const billingCycleOptions = useMemo(() => {
    const optionsWithCounts = generateDynamicOptionsWithCounts(
      initialSkus,
      sku => sku.billingCycle,
      cycle => toSentenceCase(cycle)
    );
    return optionsWithCounts.map(option => ({
      value: option.value,
      label: `${option.label} (${option.count})`
    }));
  }, [initialSkus]);

  const experimentOptions = useMemo(() => {
    const optionsWithCounts = generateDynamicOptionsWithCounts(
      initialSkus.filter(sku => sku.lix?.key), // Only include SKUs with LIX keys
      sku => sku.lix?.key || '',
      lixKey => lixKey
    );
    return optionsWithCounts.map(option => ({
      value: option.value,
      label: `${option.label} (${option.count})`
    }));
  }, [initialSkus]);

  const priceGroupCount = filteredPriceGroups.length;

  return {
    // States and Setters
    searchQuery, setSearchQuery,
    channelFilter, setChannelFilter,
    channelFilters, setChannelFilters,
    billingCycleFilter, setBillingCycleFilter,
    experimentFilter, setExperimentFilter,
    groupBy, setGroupBy,
    sortOrder, setSortOrder,

    // Derived Data
    filteredPriceGroups: sortedPriceGroups,
    groupedPriceGroups,
    priceGroupCount,

    // Filter Options
    channelOptions,
    billingCycleOptions,
    experimentOptions,
  };
}; 