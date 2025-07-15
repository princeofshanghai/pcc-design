import { useState, useMemo } from 'react';
import type { Sku, SalesChannel } from '../utils/types';
import { toSentenceCase } from '../utils/formatters';

export const usePriceGroupFilters = (initialSkus: Sku[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<SalesChannel | null>(null);
  const [billingCycleFilter, setBillingCycleFilter] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<string>('None');

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

  // Apply grouping
  const groupedPriceGroups = useMemo(() => {
    if (groupBy === 'None') {
      return null;
    }

    const grouped: Record<string, typeof filteredPriceGroups> = {};
    
    filteredPriceGroups.forEach((group: { priceGroup: any; skus: any[] }) => {
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

    return grouped;
  }, [filteredPriceGroups, groupBy]);

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

    // Derived Data
    filteredPriceGroups,
    groupedPriceGroups,
    priceGroupCount,

    // Filter Options
    channelOptions,
    billingCycleOptions,
  };
}; 