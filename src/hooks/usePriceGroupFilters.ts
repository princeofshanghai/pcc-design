import { useState, useMemo } from 'react';
import type { Sku, SalesChannel, PricePoint } from '../utils/types';
import { toSentenceCase } from '../utils/formatters';
import { generateDynamicOptionsWithCounts } from '../utils/filterUtils';

type PriceGroupStatus = 'Active' | 'Expired';

/**
 * Calculates the status of a price group based on its price points
 * Logic: Active if ANY price point is Active, Expired if ALL price points are Expired
 */
const calculatePriceGroupStatus = (pricePoints: PricePoint[]): PriceGroupStatus => {
  if (!pricePoints || pricePoints.length === 0) {
    return 'Expired';
  }

  const now = new Date();

  // Check each price point's status
  const pricePointStatuses = pricePoints.map(pricePoint => {
    const validFrom = pricePoint.validFrom ? new Date(pricePoint.validFrom) : null;
    const validTo = pricePoint.validTo ? new Date(pricePoint.validTo) : null;

    // If no validFrom date, consider it active
    if (!validFrom) {
      return 'Active';
    }

    // If current time is before validFrom, it's not yet active
    if (now < validFrom) {
      return 'Expired';
    }

    // If no validTo date, it's active indefinitely
    if (!validTo) {
      return 'Active';
    }

    // If current time is after validTo, it's expired
    if (now > validTo) {
      return 'Expired';
    }

    // Otherwise, it's active
    return 'Active';
  });

  // If ANY price point is active, the price group is active
  const hasActivePoints = pricePointStatuses.some(status => status === 'Active');
  
  return hasActivePoints ? 'Active' : 'Expired';
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
  const [statusFilters, setStatusFilters] = useState<PriceGroupStatus[]>([]);
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
        (group.priceGroup.id || '').toLowerCase().includes(lowercasedQuery)
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

    // Status filter (multi-select)
    if (statusFilters.length > 0) {
      filtered = filtered.filter((group: { priceGroup: any }) => {
        const status = calculatePriceGroupStatus(group.priceGroup.pricePoints);
        return statusFilters.includes(status);
      });
    }

    return filtered;
  }, [priceGroupMap, searchQuery, channelFilter, channelFilters, billingCycleFilter, experimentFilter, statusFilters]);

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
      if (sortOrder === 'Status (A-Z)') {
        const aStatus = calculatePriceGroupStatus(a.priceGroup.pricePoints);
        const bStatus = calculatePriceGroupStatus(b.priceGroup.pricePoints);
        return aStatus.localeCompare(bStatus);
      }
      if (sortOrder === 'Status (Z-A)') {
        const aStatus = calculatePriceGroupStatus(a.priceGroup.pricePoints);
        const bStatus = calculatePriceGroupStatus(b.priceGroup.pricePoints);
        return bStatus.localeCompare(aStatus);
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
      } else if (groupBy === 'Status') {
        // Group by price group status
        groupKey = calculatePriceGroupStatus(group.priceGroup.pricePoints);
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

  const statusOptions = useMemo(() => {
    // Get all unique price groups and calculate their statuses
    const uniquePriceGroups = Array.from(new Set(initialSkus.map(sku => sku.priceGroup.id)))
      .map(id => initialSkus.find(sku => sku.priceGroup.id === id)?.priceGroup)
      .filter(Boolean);

    const statusCounts: Record<PriceGroupStatus, number> = { Active: 0, Expired: 0 };
    
    uniquePriceGroups.forEach(priceGroup => {
      if (priceGroup && priceGroup.pricePoints) {
        const status = calculatePriceGroupStatus(priceGroup.pricePoints);
        statusCounts[status]++;
      }
    });

    return Object.entries(statusCounts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        value: status,
        label: `${status} (${count})`
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
    statusFilters, setStatusFilters,
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
    statusOptions,
  };
}; 