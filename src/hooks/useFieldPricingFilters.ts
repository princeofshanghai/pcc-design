import { useState, useMemo, useEffect, useRef } from 'react';
import type { PricePoint } from '../utils/types';
import { formatValidityRange } from '../utils/formatters';
import { generateDynamicOptionsWithCounts } from '../utils/filterUtils';

export const useFieldPricingFilters = (initialPricePoints: PricePoint[]) => {
  console.log('🎛️ useFieldPricingFilters - Starting with:', initialPricePoints?.length || 0, 'price points');

  // Basic null check only - let formatValidityRange handle edge cases like original logic
  const safeInitialPricePoints = (initialPricePoints || []).filter((point): point is PricePoint => {
    return point != null && typeof point === 'object';
  });

  console.log('🎛️ useFieldPricingFilters - After filtering nulls:', safeInitialPricePoints.length, 'valid price points');
  
  // Simplified filter states - only what field pricing needs
  const [currencyFilters, setCurrencyFilters] = useState<string[]>([]);
  const [tierFilters, setTierFilters] = useState<string[]>([]);
  
  // Helper function to extract dates from validity period strings
  const extractDates = (period: string) => {
    if (period === 'Present') return { startDate: new Date(), endDate: null, isPresent: true };
    
    const match = period.match(/^(.+?) - (.+)$/);
    if (match && match[1] && match[2]) {
      const startDate = new Date(match[1]);
      const endDate = match[2] === 'present' ? null : new Date(match[2]);
      return { startDate, endDate, isPresent: match[2] === 'present' };
    }
    console.warn('🎛️ Could not parse validity period:', period);
    return { startDate: new Date(0), endDate: new Date(0), isPresent: false };
  };
  
  // Helper to get the newest validity period for default selection
  const getNewestValidityPeriod = useMemo(() => {
    if (safeInitialPricePoints.length === 0) {
      console.log('🎛️ No price points available for validity period calculation');
      return null;
    }
    
    const validityGroups: Record<string, PricePoint[]> = {};
    // Match original logic exactly - process all points, let formatValidityRange handle edge cases
    safeInitialPricePoints.forEach(point => {
      try {
        const validityKey = formatValidityRange(point.validFrom, point.validTo);
        if (!validityGroups[validityKey]) {
          validityGroups[validityKey] = [];
        }
        validityGroups[validityKey].push(point);
      } catch (error) {
        console.warn('🎛️ Error processing price point validity:', error, point);
      }
    });

    const sortedPeriods = Object.keys(validityGroups).sort((a, b) => {
      const datesA = extractDates(a);
      const datesB = extractDates(b);
      
      // First, sort by start date (newest first)
      const startDiff = datesB.startDate.getTime() - datesA.startDate.getTime();
      if (startDiff !== 0) return startDiff;
      
      // If start dates are the same, prioritize "present" periods over fixed end dates
      if (datesA.isPresent && !datesB.isPresent) return -1; // A (present) comes first
      if (!datesA.isPresent && datesB.isPresent) return 1;  // B (present) comes first
      
      // If both have fixed end dates, sort by end date (newest first)
      if (!datesA.isPresent && !datesB.isPresent && datesA.endDate && datesB.endDate) {
        return datesB.endDate.getTime() - datesA.endDate.getTime();
      }
      
      return 0; // Equal priority
    });

    console.log('🎛️ getNewestValidityPeriod - all periods found:', Object.keys(validityGroups));
    console.log('🎛️ getNewestValidityPeriod - sorted periods (newest first):', sortedPeriods);
    console.log('🎛️ getNewestValidityPeriod - selected newest:', sortedPeriods[0] || null);

    return sortedPeriods[0] || null;
  }, [safeInitialPricePoints]);

  // Validity filter - defaults to newest period, no "All periods" option
  const [validityFilter, setValidityFilter] = useState<string>('');
  const previousValidityFilter = useRef<string>('');
  
  // Update validity filter when newest period changes
  useEffect(() => {
    if (getNewestValidityPeriod && !validityFilter) {
      console.log('🎛️ Hook - setting initial validity period:', getNewestValidityPeriod);
      setValidityFilter(getNewestValidityPeriod);
    }
  }, [getNewestValidityPeriod, validityFilter]);

  // Clear currency and tier filters when validity period changes (but not on initial load)
  useEffect(() => {
    if (validityFilter && previousValidityFilter.current && validityFilter !== previousValidityFilter.current) {
      setCurrencyFilters([]);
      setTierFilters([]);
      console.log('🎛️ Hook - cleared currency/tier filters due to validity change from', previousValidityFilter.current, 'to', validityFilter);
    }
    previousValidityFilter.current = validityFilter;
  }, [validityFilter]);

  // Generate filter options dynamically based on selected validity period
  const { currencyOptions, tierOptions, validityOptions } = useMemo(() => {
    console.log('🎛️ Hook - generating options from:', safeInitialPricePoints.length, 'price points');
    
    // Filter price points by validity period first (if one is selected)
    const validityFilteredPoints = validityFilter 
      ? safeInitialPricePoints.filter(point => {
          try {
            const pointValidity = formatValidityRange(point.validFrom, point.validTo);
            return pointValidity === validityFilter;
          } catch (error) {
            return false;
          }
        })
      : safeInitialPricePoints;

    console.log('🎛️ Hook - after validity filtering:', validityFilteredPoints.length, 'points for validity:', validityFilter);
    
    // Extract currencies from validity-filtered points
    const currencies = Array.from(new Set(
      validityFilteredPoints
        .map(point => point.currencyCode)
        .filter((currency): currency is string => Boolean(currency))
    )).sort();
    console.log('🎛️ Hook - found currencies in selected period:', currencies);

    // Extract pricing tiers from validity-filtered points
    const tiers = Array.from(new Set(
      validityFilteredPoints
        .map(point => point.pricingTier)
        .filter((tier): tier is string => Boolean(tier && tier.trim()))
    )).sort();
    console.log('🎛️ Hook - found tiers in selected period:', tiers);

    // Get all unique validity periods (no "All periods" option)
    const validityGroups: Record<string, PricePoint[]> = {};
    // Match original logic - process all points, let formatValidityRange handle edge cases
    safeInitialPricePoints.forEach(point => {
      try {
        const validityKey = formatValidityRange(point.validFrom, point.validTo);
        if (!validityGroups[validityKey]) {
          validityGroups[validityKey] = [];
        }
        validityGroups[validityKey].push(point);
      } catch (error) {
        console.warn('🎛️ Hook - validity error:', error, point);
      }
    });
    console.log('🎛️ Hook - validity groups:', Object.keys(validityGroups));

    const currencyOptionsWithCounts = currencies.map(currency => ({
      value: currency as string,
      label: currency as string,
      count: validityFilteredPoints.filter(point => point.currencyCode === currency).length
    }));

    const tierOptionsWithCounts = tiers.map(tier => ({
      value: tier as string,
      label: tier as string,
      count: validityFilteredPoints.filter(point => point.pricingTier === tier).length
    }));

    // Sort validity options with refined logic: newest start date first, then "present" over fixed end dates
    const sortedValidityKeys = Object.keys(validityGroups).sort((a, b) => {
      const datesA = extractDates(a);
      const datesB = extractDates(b);
      
      // First, sort by start date (newest first)
      const startDiff = datesB.startDate.getTime() - datesA.startDate.getTime();
      if (startDiff !== 0) return startDiff;
      
      // If start dates are the same, prioritize "present" periods over fixed end dates
      if (datesA.isPresent && !datesB.isPresent) return -1; // A (present) comes first
      if (!datesA.isPresent && datesB.isPresent) return 1;  // B (present) comes first
      
      // If both have fixed end dates, sort by end date (newest first)
      if (!datesA.isPresent && !datesB.isPresent && datesA.endDate && datesB.endDate) {
        return datesB.endDate.getTime() - datesA.endDate.getTime();
      }
      
      return 0; // Equal priority
    });
    
    console.log('🎛️ Hook - sorted validity keys (newest first):', sortedValidityKeys);

    const validityOptionsWithCounts = sortedValidityKeys.map(validityKey => ({
      value: validityKey as string,
      label: validityKey as string,
      count: validityGroups[validityKey].length
    }));

    return {
      currencyOptions: currencyOptionsWithCounts,
      tierOptions: tierOptionsWithCounts,
      validityOptions: validityOptionsWithCounts,
    };
  }, [safeInitialPricePoints, validityFilter]);

  // Apply filters to get filtered price points
  const filteredPricePoints = useMemo(() => {
    let filtered = [...safeInitialPricePoints];

    // Validity filter - always applied (required)
    if (validityFilter) {
      filtered = filtered.filter(point => {
        try {
          const pointValidity = formatValidityRange(point.validFrom, point.validTo);
          return pointValidity === validityFilter;
        } catch (error) {
          console.warn('🎛️ Error filtering by validity:', error, point);
          return false;
        }
      });
    }

    // Currency filters - match original logic
    if (currencyFilters.length > 0) {
      filtered = filtered.filter(point => currencyFilters.includes(point.currencyCode));
    }

    // Tier filters - match original logic
    if (tierFilters.length > 0) {
      filtered = filtered.filter(point => point.pricingTier && tierFilters.includes(point.pricingTier));
    }

    return filtered;
  }, [safeInitialPricePoints, validityFilter, currencyFilters, tierFilters]);

  // Debug logging for development
  console.log('🎛️ Field Pricing Filters:');
  console.log('- Validity options:', validityOptions.map(opt => opt.value));
  console.log('- Current validity:', validityFilter);
  console.log('- Currency options:', currencyOptions.map(opt => opt.value));
  console.log('- Tier options:', tierOptions.map(opt => opt.value));
  console.log('- Filtered points:', filteredPricePoints.length, '/', safeInitialPricePoints.length);

  return {
    // Filter states
    currencyFilters,
    setCurrencyFilters,
    tierFilters,
    setTierFilters,
    validityFilter,
    setValidityFilter,
    
    // Options for UI
    currencyOptions,
    tierOptions,
    validityOptions,
    
    // Results
    filteredPricePoints,
  };
};
