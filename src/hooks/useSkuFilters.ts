import { useState, useMemo } from 'react';
import type { Sku, SalesChannel, Status, Product } from '../utils/types';
import { toSentenceCase } from '../utils/formatters';
import { generateDynamicOptionsWithCounts } from '../utils/filterUtils';

export const useSkuFilters = (initialSkus: Sku[], product?: Product) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilters, setChannelFilters] = useState<SalesChannel[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [billingCycleFilter, setBillingCycleFilter] = useState<string | null>(null);
  const [lixKeyFilter, setLixKeyFilter] = useState<string | null>(null);

  const [sortOrder, setSortOrder] = useState<string>('None');
  const [groupBy, setGroupBy] = useState<string>('None');

  const filteredSkus = useMemo(() => {
    let skus = initialSkus;

    if (channelFilters.length > 0) skus = skus.filter(s => channelFilters.includes(s.salesChannel));
    if (statusFilter) skus = skus.filter(s => s.status === statusFilter);
    if (billingCycleFilter) skus = skus.filter(s => s.billingCycle === billingCycleFilter);
    if (lixKeyFilter) skus = skus.filter(s => (s.lix?.key ?? 'No LIX') === lixKeyFilter);


    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      skus = skus.filter(s =>
        s.id.toLowerCase().includes(lowercasedQuery)
      );
    }

    return skus;
  }, [initialSkus, searchQuery, channelFilters, statusFilter, billingCycleFilter, lixKeyFilter, product]);

  // Helper function to sort SKUs
  const sortSkus = (skus: Sku[]) => {
    const sorted = [...skus];
    sorted.sort((a, b) => {
      if (sortOrder === 'Validity') {
        // Use priceGroup.validFrom for sorting by date, handle undefined cases
        const dateA = a.priceGroup.validFrom ? new Date(a.priceGroup.validFrom).getTime() : 0;
        const dateB = b.priceGroup.validFrom ? new Date(b.priceGroup.validFrom).getTime() : 0;
        return dateA - dateB;
      }
      if (sortOrder === 'Channel (A-Z)') {
        return a.salesChannel.localeCompare(b.salesChannel);
      }
      if (sortOrder === 'Channel (Z-A)') {
        return b.salesChannel.localeCompare(a.salesChannel);
      }
      if (sortOrder === 'Billing Cycle (A-Z)') {
        return a.billingCycle.localeCompare(b.billingCycle);
      }
      if (sortOrder === 'Billing Cycle (Z-A)') {
        return b.billingCycle.localeCompare(a.billingCycle);
      }
      return 0; // None
    });
    return sorted;
  };

  const sortedSkus = useMemo(() => {
    if (!filteredSkus) return [];
    return sortSkus(filteredSkus);
  }, [filteredSkus, sortOrder]);

  const groupedSkus = useMemo(() => {
    if (groupBy === 'None') return null;

    // First group the sorted SKUs
    const grouped = sortedSkus.reduce((acc, sku) => {
      let key: string;
      switch (groupBy) {
        case 'Status':
          key = sku.status;
          break;
        case 'Channel':
          key = sku.salesChannel;
          break;
        case 'Billing Cycle':
          key = sku.billingCycle;
          break;
        case 'LIX Key':
          key = sku.lix ? sku.lix.key : 'No LIX';
          break;
        default:
          key = 'Other';
          break;
      }
      
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(sku);
      return acc;
    }, {} as Record<string, Sku[]>);

    // Then sort within each group
    Object.keys(grouped).forEach(key => {
      grouped[key] = sortSkus(grouped[key]);
    });

    // Apply alphabetical ordering to group keys consistent with ViewOptions.tsx
    const sortedGroups: Record<string, Sku[]> = {};
    Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .forEach(groupKey => {
        sortedGroups[groupKey] = grouped[groupKey];
      });

    return sortedGroups;
  }, [sortedSkus, groupBy, sortOrder]);

  const skuCount = sortedSkus.length;

  // Generate dynamic options for filters based on the *initial* list with counts
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

  const statusOptions = useMemo(() => {
    const optionsWithCounts = generateDynamicOptionsWithCounts(
      initialSkus,
      sku => sku.status,
      status => toSentenceCase(status)
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
  const lixKeyOptions = useMemo(() => {
    const optionsWithCounts = generateDynamicOptionsWithCounts(
      initialSkus,
      sku => sku.lix?.key ?? 'No LIX',
      key => key
    );
    return optionsWithCounts.map(option => ({
      value: option.value,
      label: `${option.label} (${option.count})`
    }));
  }, [initialSkus]);


  return {
    // States and Setters
    searchQuery, setSearchQuery,
    channelFilters, setChannelFilters,
    statusFilter, setStatusFilter,
    billingCycleFilter, setBillingCycleFilter,
    lixKeyFilter, setLixKeyFilter,

    sortOrder, setSortOrder,
    groupBy, setGroupBy,

    // Derived Data
    sortedSkus,
    groupedSkus,
    skuCount,

    // Filter Options
    channelOptions,
    statusOptions,
    billingCycleOptions,
    lixKeyOptions,

  };
}; 