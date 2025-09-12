import { useState, useMemo, useEffect } from 'react';
import type { PricePoint } from '../utils/types';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { categorizePricePoints, toSentenceCase, formatValidityRange } from '../utils/formatters';
import { generateDynamicOptionsWithCounts } from '../utils/filterUtils';
import { getCurrencyRegion } from '../utils/regionUtils';


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
  const [seatFilters, setSeatFilters] = useState<string[]>([]);
  const [tierFilters, setTierFilters] = useState<string[]>([]);
  
  // New date-based validity filtering states
  const [validityMode, setValidityMode] = useState<'current' | 'custom'>('current');
  const [customValidityDate, setCustomValidityDate] = useState<Dayjs | null>(null);

  // Compute the selected date for filtering
  const selectedValidityDate = useMemo(() => {
    if (validityMode === 'current') {
      return new Date(); // Today
    } else {
      return customValidityDate ? customValidityDate.toDate() : new Date();
    }
  }, [validityMode, customValidityDate]);
  
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

  // Get unique seat (quantity range) options with counts
  const seatOptions = useMemo(() => {
    const optionsWithCounts = generateDynamicOptionsWithCounts(
      initialPricePoints,
      point => {
        // Format quantity range for display
        if (!point.minQuantity && !point.maxQuantity) {
          return 'No limit';
        }
        
        const min = point.minQuantity || 1;
        const max = point.maxQuantity;
        
        if (!max) {
          return `${min}+ seats`;
        }
        
        if (min === max) {
          return `${min} seat${min === 1 ? '' : 's'}`;
        }
        
        return `${min}-${max} seats`;
      },
      range => range
    );
    
    // Sort seat options by minimum quantity (fewest to most seats)
    const sortedOptions = optionsWithCounts.sort((a, b) => {
      // Extract min quantity from the seat range text
      const getMinQuantity = (rangeText: string): number => {
        if (rangeText === 'No limit') return 0;
        
        // Match patterns like "1-3 seats", "251+ seats", "1 seat"
        const match = rangeText.match(/^(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };
      
      const minA = getMinQuantity(a.label);
      const minB = getMinQuantity(b.label);
      
      return minA - minB;
    });
    
    return sortedOptions.map(option => ({
      value: option.value,
      label: `${option.label} (${option.count})`
    }));
  }, [initialPricePoints]);

  // Get unique tier (pricing tier) options with counts
  const tierOptions = useMemo(() => {
    const optionsWithCounts = generateDynamicOptionsWithCounts(
      initialPricePoints,
      point => point.pricingTier || 'Unspecified',
      tier => tier === 'Unspecified' ? 'No tier' : tier
    );
    return optionsWithCounts.map(option => ({
      value: option.value,
      label: `${option.label} (${option.count})`
    }));
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

    // Apply seat (quantity range) filters
    if (seatFilters.length > 0) {
      filtered = filtered.filter(point => {
        // Format quantity range for comparison
        let pointSeatRange;
        if (!point.minQuantity && !point.maxQuantity) {
          pointSeatRange = 'No limit';
        } else {
          const min = point.minQuantity || 1;
          const max = point.maxQuantity;
          
          if (!max) {
            pointSeatRange = `${min}+ seats`;
          } else if (min === max) {
            pointSeatRange = `${min} seat${min === 1 ? '' : 's'}`;
          } else {
            pointSeatRange = `${min}-${max} seats`;
          }
        }
        
        return seatFilters.includes(pointSeatRange);
      });
    }

    // Apply tier (pricing tier) filters
    if (tierFilters.length > 0) {
      filtered = filtered.filter(point => {
        const tier = point.pricingTier || 'Unspecified';
        return tierFilters.includes(tier);
      });
    }

    // Apply date-based validity filter
    filtered = filtered.filter(point => {
      const validFrom = point.validFrom ? new Date(point.validFrom) : new Date('1900-01-01');
      const validTo = point.validTo ? new Date(point.validTo) : null;
      
      // Price point is active on selected date if:
      // 1. It started before or on the selected date
      // 2. It hasn't expired yet (no end date) OR it expires after the selected date
      return validFrom <= selectedValidityDate && 
             (validTo === null || validTo >= selectedValidityDate);
    });

    return filtered;
  }, [initialPricePoints, searchQuery, currencyFilter, currencyFilters, statusFilter, statusFilters, categoryFilters, regionFilters, seatFilters, tierFilters, selectedValidityDate]);

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

    if (groupBy === 'Seats') {
      const groups: Record<string, PricePoint[]> = {};
      
      filteredPricePoints.forEach(point => {
        // Use the same formatting logic as the seat filter options
        let seatRange;
        if (!point.minQuantity && !point.maxQuantity) {
          seatRange = 'No limit';
        } else {
          const min = point.minQuantity || 1;
          const max = point.maxQuantity;
          
          if (!max) {
            seatRange = `${min}+ seats`;
          } else if (min === max) {
            seatRange = `${min} seat${min === 1 ? '' : 's'}`;
          } else {
            seatRange = `${min}-${max} seats`;
          }
        }
        
        if (!groups[seatRange]) {
          groups[seatRange] = [];
        }
        groups[seatRange].push(point);
      });
      
      // Sort each group and apply logical ordering to group keys (by quantity)
      const sortedGroups: Record<string, PricePoint[]> = {};
      Object.keys(groups)
        .sort((a, b) => {
          // Custom sort for seat ranges - "No limit" goes last
          if (a === 'No limit') return 1;
          if (b === 'No limit') return -1;
          
          // Extract numbers for proper numerical sorting
          const getMinQuantity = (range: string): number => {
            if (range.includes('+')) {
              return parseInt(range.match(/(\d+)\+/)?.[1] || '0', 10);
            }
            if (range.includes('-')) {
              return parseInt(range.match(/(\d+)-/)?.[1] || '0', 10);
            }
            // Single seat format
            return parseInt(range.match(/(\d+) seat/)?.[1] || '0', 10);
          };
          
          return getMinQuantity(a) - getMinQuantity(b);
        })
        .forEach(seatRange => {
          sortedGroups[seatRange] = sortPricePoints(groups[seatRange]);
        });
      
      return sortedGroups;
    }

    if (groupBy === 'Tier') {
      const groups: Record<string, PricePoint[]> = {};
      
      filteredPricePoints.forEach(point => {
        const tier = point.pricingTier || 'No tier';
        
        if (!groups[tier]) {
          groups[tier] = [];
        }
        groups[tier].push(point);
      });
      
      // Sort each group and apply alphabetical ordering to group keys
      const sortedGroups: Record<string, PricePoint[]> = {};
      Object.keys(groups)
        .sort((a, b) => {
          // Put "No tier" last
          if (a === 'No tier') return 1;
          if (b === 'No tier') return -1;
          return a.localeCompare(b);
        })
        .forEach(tierKey => {
          sortedGroups[tierKey] = sortPricePoints(groups[tierKey]);
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
    seatFilters,
    setSeatFilters,
    tierFilters,
    setTierFilters,
    validityMode,
    setValidityMode,
    customValidityDate,
    setCustomValidityDate,
    selectedValidityDate,
    currencyOptions,
    statusOptions,
    categoryOptions,
    regionOptions,
    seatOptions,
    tierOptions,
    
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