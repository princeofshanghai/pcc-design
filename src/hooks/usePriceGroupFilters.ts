import { useState, useMemo } from 'react';
import type { Sku, SalesChannel } from '../utils/types';
import { toSentenceCase } from '../utils/formatters';

export const usePriceGroupFilters = (initialSkus: Sku[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<SalesChannel | null>(null);
  const [billingCycleFilter, setBillingCycleFilter] = useState<string | null>(null);
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

    // Channel filter
    if (channelFilter) {
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

    return filtered;
  }, [priceGroupMap, searchQuery, channelFilter, billingCycleFilter]);

  // Helper function to sort price groups
  const sortPriceGroups = (priceGroups: typeof filteredPriceGroups) => {
    const sorted = [...priceGroups];
    sorted.sort((a, b) => {
      if (sortOrder === 'Name (A-Z)') { 
        return a.priceGroup.name.localeCompare(b.priceGroup.name); 
      }
      if (sortOrder === 'Name (Z-A)') { 
        return b.priceGroup.name.localeCompare(a.priceGroup.name); 
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
        const aChannel = a.skus[0]?.salesChannel || '';
        const bChannel = b.skus[0]?.salesChannel || '';
        return aChannel.localeCompare(bChannel);
      }
      if (sortOrder === 'Channel (Z-A)') {
        const aChannel = a.skus[0]?.salesChannel || '';
        const bChannel = b.skus[0]?.salesChannel || '';
        return bChannel.localeCompare(aChannel);
      }
      if (sortOrder === 'Billing Cycle (A-Z)') {
        const aCycle = a.skus[0]?.billingCycle || '';
        const bCycle = b.skus[0]?.billingCycle || '';
        return aCycle.localeCompare(bCycle);
      }
      if (sortOrder === 'Billing Cycle (Z-A)') {
        const aCycle = a.skus[0]?.billingCycle || '';
        const bCycle = b.skus[0]?.billingCycle || '';
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
      if (sortOrder === 'Effective Date (Earliest to Latest)') { 
        const aDate = new Date(a.priceGroup.startDate).getTime();
        const bDate = new Date(b.priceGroup.startDate).getTime();
        return aDate - bDate; 
      }
      if (sortOrder === 'Effective Date (Latest to Earliest)') { 
        const aDate = new Date(a.priceGroup.startDate).getTime();
        const bDate = new Date(b.priceGroup.startDate).getTime();
        return bDate - aDate; 
      }
      return 0;
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

    return grouped;
  }, [sortedPriceGroups, groupBy, sortOrder]);

  // Generate filter options from initial SKU data
  const channelOptions = useMemo(() => {
    const channels = Array.from(new Set(initialSkus.map(sku => sku.salesChannel))).sort();
    return channels.map(channel => ({ value: channel, label: toSentenceCase(channel) }));
  }, [initialSkus]);

  const billingCycleOptions = useMemo(() => {
    const cycles = Array.from(new Set(initialSkus.map(sku => sku.billingCycle))).sort();
    return cycles.map(cycle => ({ value: cycle, label: toSentenceCase(cycle) }));
  }, [initialSkus]);

  const priceGroupCount = filteredPriceGroups.length;

  return {
    // States and Setters
    searchQuery, setSearchQuery,
    channelFilter, setChannelFilter,
    billingCycleFilter, setBillingCycleFilter,
    groupBy, setGroupBy,
    sortOrder, setSortOrder,

    // Derived Data
    filteredPriceGroups: sortedPriceGroups,
    groupedPriceGroups,
    priceGroupCount,

    // Filter Options
    channelOptions,
    billingCycleOptions,
  };
}; 