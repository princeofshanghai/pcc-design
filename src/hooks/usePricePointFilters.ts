import { useState, useMemo, useEffect } from 'react';
import type { PricePoint } from '../utils/types';
import { categorizePricePoints, toSentenceCase, formatValidityRange } from '../utils/formatters';
import { generateDynamicOptionsWithCounts } from '../utils/filterUtils';
import { getCurrencyRegion } from '../utils/regionUtils';
import { getDefaultValidityFilter } from '../utils/channelConfigurations';


export const usePricePointFilters = (initialPricePoints: PricePoint[], channels?: string[]) => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Multi-select filters
  const [currencyFilters, setCurrencyFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [regionFilters, setRegionFilters] = useState<string[]>([]);
  // Helper to get the newest validity period for default selection
  const getNewestValidityPeriod = useMemo(() => {
    if (initialPricePoints.length === 0) return 'All periods';
    
    const validityGroups: Record<string, PricePoint[]> = {};
    initialPricePoints.forEach(point => {
      const validityKey = formatValidityRange(point.validFrom, point.validTo);
      if (!validityGroups[validityKey]) {
        validityGroups[validityKey] = [];
      }
      validityGroups[validityKey].push(point);
    });

    const extractDates = (period: string) => {
      if (period === 'Present') return { startDate: new Date(), endDate: null, isPresent: true };
      
      const match = period.match(/^(.+?) - (.+)$/);
      if (match) {
        const startDate = new Date(match[1]);
        const endDate = match[2] === 'present' ? null : new Date(match[2]);
        return { startDate, endDate, isPresent: match[2] === 'present' };
      }
      return { startDate: new Date(0), endDate: new Date(0), isPresent: false };
    };

    const sortedPeriods = Object.keys(validityGroups).sort((a, b) => {
      const datesA = extractDates(a);
      const datesB = extractDates(b);
      
      const startDiff = datesB.startDate.getTime() - datesA.startDate.getTime();
      if (startDiff !== 0) return startDiff;
      
      if (datesA.isPresent && !datesB.isPresent) return -1;
      if (!datesA.isPresent && datesB.isPresent) return 1;
      
      if (datesA.endDate && datesB.endDate) {
        return datesB.endDate.getTime() - datesA.endDate.getTime();
      }
      
      return 0;
    });

    return sortedPeriods[0] || 'All periods';
  }, [initialPricePoints]);

  // Get the default validity filter based on channel configuration
  const getDefaultValidityFilterValue = useMemo(() => {
    const channelDefault = getDefaultValidityFilter(channels || []);
    
    // Debug: Log channel configuration for troubleshooting
    console.log('usePricePointFilters - Channels:', channels, 'Channel default:', channelDefault, 'Newest period:', getNewestValidityPeriod);
    
    if (channelDefault === 'most-recent') {
      return getNewestValidityPeriod;
    } else {
      return 'All periods';
    }
  }, [channels, getNewestValidityPeriod]);

  const [validityFilter, setValidityFilterInternal] = useState<string>(''); // Will be set by useEffect
  const [hasUserSelectedValidity, setHasUserSelectedValidity] = useState(false); // Track if user has manually selected
  
  // Reset user selection flag when price points data completely changes (e.g., new price group)
  useEffect(() => {
    // Reset the flag when we get completely new data (different price points)
    setHasUserSelectedValidity(false);
  }, [initialPricePoints]);

  // Set default validity filter when data changes or channel config changes
  useEffect(() => {
    // Only set if we have actual data, a valid default value, AND user hasn't manually selected
    if (initialPricePoints.length > 0 && getDefaultValidityFilterValue && !hasUserSelectedValidity) {
      console.log('usePricePointFilters - Setting validity filter to:', getDefaultValidityFilterValue, 'for channels:', channels);
      setValidityFilterInternal(getDefaultValidityFilterValue);
    }
  }, [getDefaultValidityFilterValue, initialPricePoints.length, channels, hasUserSelectedValidity]);

  // Wrapper function for manual validity filter changes
  const setValidityFilter = (value: string) => {
    setValidityFilterInternal(value);
    setHasUserSelectedValidity(true); // Mark that user has made a manual selection
  };
  
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

  // Get unique region options with counts
  const regionOptions = useMemo(() => {
    const optionsWithCounts = generateDynamicOptionsWithCounts(
      initialPricePoints,
      point => getCurrencyRegion(point.currencyCode),
      region => toSentenceCase(region)
    );
    return optionsWithCounts.map(option => ({
      value: option.value,
      label: `${option.label} (${option.count})`
    }));
  }, [initialPricePoints]);

  // Get unique validity period options with counts
  const validityOptions = useMemo(() => {
    // Group price points by validity period and count them
    const validityGroups: Record<string, PricePoint[]> = {};
    
    initialPricePoints.forEach(point => {
      const validityKey = formatValidityRange(point.validFrom, point.validTo);
      if (!validityGroups[validityKey]) {
        validityGroups[validityKey] = [];
      }
      validityGroups[validityKey].push(point);
    });

    // Helper function to extract dates and compare periods
    const extractDates = (period: string) => {
      if (period === 'Present') return { startDate: new Date(), endDate: null, isPresent: true };
      
      const match = period.match(/^(.+?) - (.+)$/);
      if (match) {
        const startDate = new Date(match[1]);
        const endDate = match[2] === 'present' ? null : new Date(match[2]);
        return { startDate, endDate, isPresent: match[2] === 'present' };
      }
      return { startDate: new Date(0), endDate: new Date(0), isPresent: false };
    };

    // Sort validity periods: newest to oldest, with present end dates first for same start dates
    const sortedValidityPeriods = Object.keys(validityGroups).sort((a, b) => {
      const datesA = extractDates(a);
      const datesB = extractDates(b);
      
      // First, compare by start date (newest first)
      const startDiff = datesB.startDate.getTime() - datesA.startDate.getTime();
      
      if (startDiff !== 0) {
        return startDiff;
      }
      
      // If same start date, "present" end dates come first
      if (datesA.isPresent && !datesB.isPresent) return -1;
      if (!datesA.isPresent && datesB.isPresent) return 1;
      
      // If both have specific end dates, newer end date comes first
      if (datesA.endDate && datesB.endDate) {
        return datesB.endDate.getTime() - datesA.endDate.getTime();
      }
      
      return 0;
    });

    // Create options array with individual validity periods first
    const options = [];
    
    sortedValidityPeriods.forEach((period, index) => {
      const isLatest = index === 0; // First item is the latest
      options.push({
        label: `${period} (${validityGroups[period].length})`,
        value: period,
        isLatest // Add flag for the UI to show "Latest" tag
      });
    });

    // Add "All periods" at the bottom with divider info
    options.push({
      label: `All periods (${initialPricePoints.length})`,
      value: 'All periods',
      showDivider: true // Flag to show divider above this option
    });

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

    // Apply region filters
    if (regionFilters.length > 0) {
      filtered = filtered.filter(point => {
        const region = getCurrencyRegion(point.currencyCode);
        return regionFilters.includes(region);
      });
    }

    // Apply validity filter
    if (validityFilter && validityFilter !== 'All periods') {
      // Filter to show only price points matching the selected validity period
      filtered = filtered.filter(point => {
        const pointValidityPeriod = formatValidityRange(point.validFrom, point.validTo);
        return pointValidityPeriod === validityFilter;
      });
    }

    return filtered;
  }, [initialPricePoints, searchQuery, currencyFilter, currencyFilters, statusFilter, statusFilters, categoryFilters, regionFilters, validityFilter]);

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
        // Use the same formatting as the Validity column
        const validityKey = formatValidityRange(point.validFrom, point.validTo);
        
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

    if (groupBy === 'Status') {
      const groups: Record<string, PricePoint[]> = {};
      
      filteredPricePoints.forEach(point => {
        const status = point.status || 'Unspecified';
        // Format the status for display
        const statusKey = toSentenceCase(status);
        
        if (!groups[statusKey]) {
          groups[statusKey] = [];
        }
        groups[statusKey].push(point);
      });
      
      // Sort each group and apply alphabetical ordering to group keys
      const sortedGroups: Record<string, PricePoint[]> = {};
      Object.keys(groups)
        .sort((a, b) => a.localeCompare(b))
        .forEach(statusKey => {
          sortedGroups[statusKey] = sortPricePoints(groups[statusKey]);
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
    regionFilters,
    setRegionFilters,
    validityFilter,
    setValidityFilter,
    currencyOptions,
    statusOptions,
    categoryOptions,
    regionOptions,
    validityOptions,
    
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