import { useState, useMemo } from 'react';
import type { Sku, Region, SalesChannel, Status } from '../utils/types';
import { toSentenceCase } from '../utils/formatters';

export const useSkuFilters = (initialSkus: Sku[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<Region | null>(null);
  const [channelFilter, setChannelFilter] = useState<SalesChannel | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [billingCycleFilter, setBillingCycleFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('None');

  const filteredSkus = useMemo(() => {
    let skus = initialSkus;

    // Filtering
    if (regionFilter) skus = skus.filter(s => s.region === regionFilter);
    if (channelFilter) skus = skus.filter(s => s.salesChannel === channelFilter);
    if (statusFilter) skus = skus.filter(s => s.status === statusFilter);
    if (billingCycleFilter) skus = skus.filter(s => s.billingCycle === billingCycleFilter);

    // Searching
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      skus = skus.filter(s =>
        s.id.toLowerCase().includes(lowercasedQuery)
      );
    }

    return skus;
  }, [initialSkus, searchQuery, regionFilter, channelFilter, statusFilter, billingCycleFilter]);

  const sortedSkus = useMemo(() => {
    const sorted = [...filteredSkus]; // Create a new array to avoid mutating the original
    sorted.sort((a, b) => {
      if (sortOrder === 'Effective Date') {
        // Use price.startDate for sorting by date, handle undefined cases
        const dateA = a.price.startDate ? new Date(a.price.startDate).getTime() : 0;
        const dateB = b.price.startDate ? new Date(b.price.startDate).getTime() : 0;
        return dateA - dateB;
      }
      // Since SKU has no name, we remove name sorting for now.
      // We can add sorting by another field if you'd like.
      return 0; // None
    });
    return sorted;
  }, [filteredSkus, sortOrder]);

  const skuCount = sortedSkus.length;

  // Generate dynamic options for filters based on the *initial* list
  const regionOptions = useMemo(() => [...new Set(initialSkus.map(sku => sku.region))].map(r => ({ value: r, label: toSentenceCase(r) })), [initialSkus]);
  const channelOptions = useMemo(() => [...new Set(initialSkus.map(sku => sku.salesChannel))].map(c => ({ value: c, label: toSentenceCase(c) })), [initialSkus]);
  const statusOptions = useMemo(() => [...new Set(initialSkus.map(sku => sku.status))].map(s => ({ value: s, label: toSentenceCase(s) })), [initialSkus]);
  const billingCycleOptions = useMemo(() => [...new Set(initialSkus.map(sku => sku.billingCycle))].map(bc => ({ value: bc, label: toSentenceCase(bc) })), [initialSkus]);
  
  return {
    // States and Setters
    searchQuery, setSearchQuery,
    regionFilter, setRegionFilter,
    channelFilter, setChannelFilter,
    statusFilter, setStatusFilter,
    billingCycleFilter, setBillingCycleFilter,
    sortOrder, setSortOrder,

    // Derived Data
    sortedSkus,
    skuCount,

    // Filter Options
    regionOptions,
    channelOptions,
    statusOptions,
    billingCycleOptions,
  };
}; 