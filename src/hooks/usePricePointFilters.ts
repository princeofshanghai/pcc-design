import { useState, useMemo } from 'react';
import type { PricePoint } from '../utils/types';
import { categorizePricePoints } from '../utils/formatters';

export const usePricePointFilters = (initialPricePoints: PricePoint[]) => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState<string | null>(null);
  
  // View options
  const [sortOrder, setSortOrder] = useState('None');
  const [groupBy, setGroupBy] = useState('None');

  // Get unique currencies for filter options
  const currencyOptions = useMemo(() => {
    const currencies = [...new Set(initialPricePoints.map(p => p.currencyCode))];
    return currencies.sort().map(currency => ({ label: currency, value: currency }));
  }, [initialPricePoints]);

  // Apply filters and search
  const filteredPricePoints = useMemo(() => {
    let filtered = [...initialPricePoints];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(point =>
        point.currencyCode.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply currency filter
    if (currencyFilter) {
      filtered = filtered.filter(point => point.currencyCode === currencyFilter);
    }

    return filtered;
  }, [initialPricePoints, searchQuery, currencyFilter]);

  // Apply sorting
  const sortedPricePoints = useMemo(() => {
    if (sortOrder === 'None') return filteredPricePoints;

    const sorted = [...filteredPricePoints];
    
    switch (sortOrder) {
      case 'Amount (High to Low)':
        return sorted.sort((a, b) => b.amount - a.amount);
      case 'Amount (Low to High)':
        return sorted.sort((a, b) => a.amount - b.amount);
      case 'Alphabetical A-Z':
        return sorted.sort((a, b) => a.currencyCode.localeCompare(b.currencyCode));
      default:
        return sorted;
    }
  }, [filteredPricePoints, sortOrder]);

  // Apply grouping
  const groupedPricePoints = useMemo(() => {
    if (groupBy === 'None') return null;

    if (groupBy === 'Core / Long Tail') {
      const { core, longTail } = categorizePricePoints(sortedPricePoints);
      const groups: Record<string, PricePoint[]> = {};
      
      if (core.length > 0) {
        groups['Core'] = core;
      }
      if (longTail.length > 0) {
        groups['Long Tail'] = longTail;
      }
      
      return groups;
    }

    return null;
  }, [sortedPricePoints, groupBy]);

  return {
    // Filter controls
    searchQuery,
    setSearchQuery,
    currencyFilter,
    setCurrencyFilter,
    currencyOptions,
    
    // View controls
    sortOrder,
    setSortOrder,
    groupBy,
    setGroupBy,
    
    // Filtered data
    filteredPricePoints: sortedPricePoints,
    groupedPricePoints,
    pricePointCount: sortedPricePoints.length,
  };
}; 