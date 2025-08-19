import { useState, useMemo } from 'react';
import type { PricePoint } from '../utils/types';
import { categorizePricePoints, toSentenceCase } from '../utils/formatters';
import { generateDynamicOptionsWithCounts } from '../utils/filterUtils';


export const usePricePointFilters = (initialPricePoints: PricePoint[]) => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Multi-select filters
  const [currencyFilters, setCurrencyFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  
  // View options
  const [sortOrder, setSortOrder] = useState('None');
  const [groupBy, setGroupBy] = useState('None');

  // Get unique currencies for filter options with counts
  const currencyOptions = useMemo(() => {
    // Count occurrences of each currency
    const currencyCounts = initialPricePoints.reduce((acc, point) => {
      acc[point.currencyCode] = (acc[point.currencyCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Create options with counts in the label
    const currencies = Object.keys(currencyCounts).sort();
    return currencies.map(currency => ({ 
      label: `${currency} (${currencyCounts[currency]})`, 
      value: currency 
    }));
  }, [initialPricePoints]);

  // Get unique status options with counts
  const statusOptions = useMemo(() => {
    const optionsWithCounts = generateDynamicOptionsWithCounts(
      initialPricePoints,
      point => point.status || 'Unspecified',
      status => toSentenceCase(status)
    );
    return optionsWithCounts.map(option => ({
      value: option.value,
      label: `${option.label} (${option.count})`
    }));
  }, [initialPricePoints]);



  // Get unique category options with counts
  const categoryOptions = useMemo(() => {
    const { core, longTail } = categorizePricePoints(initialPricePoints);
    const options = [];
    
    if (core.length > 0) {
      options.push({ 
        label: `Core (${core.length})`, 
        value: 'Core' 
      });
    }
    if (longTail.length > 0) {
      options.push({ 
        label: `Long Tail (${longTail.length})`, 
        value: 'Long Tail' 
      });
    }
    
    return options;
  }, [initialPricePoints]);

  // Apply filters and search
  const filteredPricePoints = useMemo(() => {
    let filtered = [...initialPricePoints];

    // Apply search filter - search by currency code or price point ID
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(point =>
        point.currencyCode.toLowerCase().includes(lowercaseQuery) ||
        (point.id || '').toLowerCase().includes(lowercaseQuery)
      );
    }

    // Apply currency filter - use multiselect if active, otherwise single-select
    if (currencyFilters.length > 0) {
      filtered = filtered.filter(point => currencyFilters.includes(point.currencyCode));
    } else if (currencyFilter) {
      filtered = filtered.filter(point => point.currencyCode === currencyFilter);
    }

    // Apply status filter - use multiselect if active, otherwise single-select
    if (statusFilters.length > 0) {
      filtered = filtered.filter(point => statusFilters.includes(point.status || 'Unspecified'));
    } else if (statusFilter) {
      filtered = filtered.filter(point => point.status === statusFilter);
    }



    // Apply category filter
    if (categoryFilters.length > 0) {
      filtered = filtered.filter(point => {
        const { core } = categorizePricePoints([point]);
        const isCore = core.length > 0;
        return categoryFilters.includes(isCore ? 'Core' : 'Long Tail');
      });
    }

    return filtered;
  }, [initialPricePoints, searchQuery, currencyFilter, currencyFilters, statusFilter, statusFilters, categoryFilters]);

  // Helper function to sort price points
  const sortPricePoints = (pricePoints: PricePoint[]) => {
    if (sortOrder === 'None') {
      // Smart default sort: USD first, Active before Expired, then alphabetical
      return [...pricePoints].sort((a, b) => {
        // 1. USD always first
        if (a.currencyCode === 'USD' && b.currencyCode !== 'USD') return -1;
        if (b.currencyCode === 'USD' && a.currencyCode !== 'USD') return 1;
        
        // 2. Active before expired
        if (a.status === 'Active' && b.status === 'Expired') return -1;
        if (b.status === 'Active' && a.status === 'Expired') return 1;
        
        // 3. Alphabetical within same status
        return a.currencyCode.localeCompare(b.currencyCode);
      });
    }

    const sorted = [...pricePoints];
    
    switch (sortOrder) {
      case 'Amount (High to low)':
        return sorted.sort((a, b) => b.amount - a.amount);
      case 'Amount (Low to high)':
        return sorted.sort((a, b) => a.amount - b.amount);
      case 'Currency (A-Z)':
        return sorted.sort((a, b) => a.currencyCode.localeCompare(b.currencyCode));
      case 'Currency (Z-A)':
        return sorted.sort((a, b) => b.currencyCode.localeCompare(a.currencyCode));
      default:
        return sorted;
    }
  };

  const sortedPricePoints = useMemo(() => {
    // If no grouping, sort all filtered price points
    if (groupBy === 'None') {
      return sortPricePoints(filteredPricePoints);
    }
    // If grouping is active, return filtered price points (sorting happens within groups)
    return filteredPricePoints;
  }, [filteredPricePoints, sortOrder, groupBy]);

  // Apply grouping
  const groupedPricePoints = useMemo(() => {
    if (groupBy === 'None') return null;

    if (groupBy === 'Category') {
      const { core, longTail } = categorizePricePoints(filteredPricePoints);
      const groups: Record<string, PricePoint[]> = {};
      
      if (core.length > 0) {
        groups['Core'] = sortPricePoints(core);
      }
      if (longTail.length > 0) {
        groups['Long Tail'] = sortPricePoints(longTail);
      }
      
      // Apply alphabetical ordering to group keys consistent with other groupings
      const sortedGroups: Record<string, PricePoint[]> = {};
      Object.keys(groups)
        .sort((a, b) => a.localeCompare(b))
        .forEach(categoryKey => {
          sortedGroups[categoryKey] = groups[categoryKey];
        });
      
      return sortedGroups;
    }

    if (groupBy === 'Currency') {
      const groups: Record<string, PricePoint[]> = {};
      
      filteredPricePoints.forEach(point => {
        const currency = point.currencyCode;
        if (!groups[currency]) {
          groups[currency] = [];
        }
        groups[currency].push(point);
      });
      
      // Sort each group and apply alphabetical ordering to group keys
      const sortedGroups: Record<string, PricePoint[]> = {};
      Object.keys(groups)
        .sort((a, b) => a.localeCompare(b))
        .forEach(currency => {
          sortedGroups[currency] = sortPricePoints(groups[currency]);
        });
      
      return sortedGroups;
    }

    if (groupBy === 'Validity') {
      const groups: Record<string, PricePoint[]> = {};
      
      filteredPricePoints.forEach(point => {
        // Create a validity range string for grouping
        const validFrom = point.validFrom || '';
        const validTo = point.validTo || '';
        let validityKey: string;
        
        if (!validFrom && !validTo) {
          validityKey = 'No validity specified';
        } else if (!validTo) {
          validityKey = `${validFrom} - Present`;
        } else {
          validityKey = `${validFrom} - ${validTo}`;
        }
        
        if (!groups[validityKey]) {
          groups[validityKey] = [];
        }
        groups[validityKey].push(point);
      });
      
      // Sort each group and apply alphabetical ordering to group keys
      const sortedGroups: Record<string, PricePoint[]> = {};
      Object.keys(groups)
        .sort((a, b) => a.localeCompare(b))
        .forEach(validityKey => {
          sortedGroups[validityKey] = sortPricePoints(groups[validityKey]);
        });
      
      return sortedGroups;
    }

    if (groupBy === 'Pricing rule') {
      const groups: Record<string, PricePoint[]> = {};
      
      filteredPricePoints.forEach(point => {
        const rule = point.pricingRule || 'NONE';
        // Format the rule for display
        const ruleKey = rule === 'NONE' ? 'None' : rule.charAt(0).toUpperCase() + rule.slice(1).toLowerCase();
        
        if (!groups[ruleKey]) {
          groups[ruleKey] = [];
        }
        groups[ruleKey].push(point);
      });
      
      // Sort each group and apply alphabetical ordering to group keys
      const sortedGroups: Record<string, PricePoint[]> = {};
      Object.keys(groups)
        .sort((a, b) => a.localeCompare(b))
        .forEach(ruleKey => {
          sortedGroups[ruleKey] = sortPricePoints(groups[ruleKey]);
        });
      
      return sortedGroups;
    }

    if (groupBy === 'Price type') {
      const groups: Record<string, PricePoint[]> = {};
      
      filteredPricePoints.forEach(point => {
        const priceType = point.priceType || '';
        // Format the price type for display (BASE_AMOUNT -> "Base Amount")
        const typeKey = priceType ? 
          priceType.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ') : 
          'Unspecified';
        
        if (!groups[typeKey]) {
          groups[typeKey] = [];
        }
        groups[typeKey].push(point);
      });
      
      // Sort each group and apply alphabetical ordering to group keys
      const sortedGroups: Record<string, PricePoint[]> = {};
      Object.keys(groups)
        .sort((a, b) => a.localeCompare(b))
        .forEach(typeKey => {
          sortedGroups[typeKey] = sortPricePoints(groups[typeKey]);
        });
      
      return sortedGroups;
    }

    if (groupBy === 'Region') {
      const groups: Record<string, PricePoint[]> = {};
      
      filteredPricePoints.forEach(point => {
        const region = getCurrencyRegion(point.currencyCode);
        
        if (!groups[region]) {
          groups[region] = [];
        }
        groups[region].push(point);
      });
      
      // Sort each group and apply alphabetical ordering to group keys
      const sortedGroups: Record<string, PricePoint[]> = {};
      Object.keys(groups)
        .sort((a, b) => a.localeCompare(b))
        .forEach(regionKey => {
          sortedGroups[regionKey] = sortPricePoints(groups[regionKey]);
        });
      
      return sortedGroups;
    }

    return null;
  }, [filteredPricePoints, groupBy, sortOrder]);

  return {
    // Filter controls
    searchQuery,
    setSearchQuery,
    currencyFilter,
    setCurrencyFilter,
    currencyFilters,
    setCurrencyFilters,
    statusFilter,
    setStatusFilter,
    statusFilters,
    setStatusFilters,
    categoryFilters,
    setCategoryFilters,
    currencyOptions,
    statusOptions,
    categoryOptions,
    
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