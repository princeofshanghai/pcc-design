import { useState, useMemo } from 'react';
import type { Sku, SalesChannel, Status, Product } from '../utils/types';
import { toSentenceCase } from '../utils/formatters';

export const useSkuFilters = (initialSkus: Sku[], product?: Product) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<SalesChannel | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [billingCycleFilter, setBillingCycleFilter] = useState<string | null>(null);
  const [lixKeyFilter, setLixKeyFilter] = useState<string | null>(null);
  const [featuresFilter, setFeaturesFilter] = useState<'Standard' | 'Overrides' | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('None');
  const [groupBy, setGroupBy] = useState<string>('None');

  const filteredSkus = useMemo(() => {
    let skus = initialSkus;

    if (channelFilter) skus = skus.filter(s => s.salesChannel === channelFilter);
    if (statusFilter) skus = skus.filter(s => s.status === statusFilter);
    if (billingCycleFilter) skus = skus.filter(s => s.billingCycle === billingCycleFilter);
    if (lixKeyFilter) skus = skus.filter(s => (s.lix?.key ?? 'No LIX') === lixKeyFilter);
    if (featuresFilter && product) {
      skus = skus.filter(sku => {
        const isStandard = JSON.stringify(sku.features ?? product.features) === JSON.stringify(product.features);
        return featuresFilter === 'Standard' ? isStandard : !isStandard;
      });
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      skus = skus.filter(s =>
        s.id.toLowerCase().includes(lowercasedQuery)
      );
    }

    return skus;
  }, [initialSkus, searchQuery, channelFilter, statusFilter, billingCycleFilter, lixKeyFilter, featuresFilter, product]);

  // Helper function to sort SKUs
  const sortSkus = (skus: Sku[]) => {
    const sorted = [...skus];
    sorted.sort((a, b) => {
      if (sortOrder === 'Effective Date') {
        // Use priceGroup.startDate for sorting by date, handle undefined cases
        const dateA = a.priceGroup.startDate ? new Date(a.priceGroup.startDate).getTime() : 0;
        const dateB = b.priceGroup.startDate ? new Date(b.priceGroup.startDate).getTime() : 0;
        return dateA - dateB;
      }
      // Since SKU has no name, we remove name sorting for now.
      // We can add sorting by another field if you'd like.
      return 0; // None
    });
    return sorted;
  };

  const sortedSkus = useMemo(() => {
    // If no grouping, sort all filtered SKUs
    if (groupBy === 'None') {
      return sortSkus(filteredSkus);
    }
    // If grouping is active, return filtered SKUs (sorting happens within groups)
    return filteredSkus;
  }, [filteredSkus, sortOrder, groupBy]);

  const groupedSkus = useMemo(() => {
    if (groupBy === 'None') return null;

    // First group the filtered SKUs
    const grouped = filteredSkus.reduce((acc, sku) => {
      let key: string;
      switch (groupBy) {
        case 'Price Group':
          key = sku.priceGroup.id || 'No Price Group';
          break;
        case 'Effective Date':
          key = sku.priceGroup.startDate ? new Date(sku.priceGroup.startDate).toISOString().split('T')[0] : 'No Date';
          break;
        case 'LIX':
          key = sku.lix ? sku.lix.key : 'No LIX';
          break;
        case 'Status':
          key = sku.status;
          break;
        case 'Sales Channel':
          key = sku.salesChannel;
          break;
        case 'Billing Cycle':
          key = sku.billingCycle;
          break;
        default:
          key = 'Other';
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

    return grouped;
  }, [filteredSkus, groupBy, sortOrder]);

  const skuCount = sortedSkus.length;

  // Generate dynamic options for filters based on the *initial* list
  const channelOptions = useMemo(() => [...new Set(initialSkus.map(sku => sku.salesChannel))].map(c => ({ value: c, label: toSentenceCase(c) })), [initialSkus]);
  const statusOptions = useMemo(() => [...new Set(initialSkus.map(sku => sku.status))].map(s => ({ value: s, label: toSentenceCase(s) })), [initialSkus]);
  const billingCycleOptions = useMemo(() => [...new Set(initialSkus.map(sku => sku.billingCycle))].map(bc => ({ value: bc, label: toSentenceCase(bc) })), [initialSkus]);
  const lixKeyOptions = useMemo(() => {
    const keys = initialSkus.map(sku => sku.lix?.key ?? 'No LIX');
    return [...new Set(keys)].map(key => ({ value: key, label: key }));
  }, [initialSkus]);
  const featuresOptions = [
    { value: 'Standard', label: 'Standard' },
    { value: 'Overrides', label: 'Overrides' },
  ];

  return {
    // States and Setters
    searchQuery, setSearchQuery,
    channelFilter, setChannelFilter,
    statusFilter, setStatusFilter,
    billingCycleFilter, setBillingCycleFilter,
    lixKeyFilter, setLixKeyFilter,
    featuresFilter, setFeaturesFilter,
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
    featuresOptions,
  };
}; 