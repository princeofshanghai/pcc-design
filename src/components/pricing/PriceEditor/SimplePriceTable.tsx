import React, { useState, useMemo } from 'react';
import { Table, Input, Typography, theme, Space, DatePicker, Select, Button, Tooltip, Popover } from 'antd';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { X, Pencil, TriangleAlert, ChevronUp, ChevronDown } from 'lucide-react';
import InfoPopover from '../../shared/InfoPopover';
import type { PriceEditingContext } from '../../../utils/types';

const { Text } = Typography;

interface SimplePriceTableProps {
  selectedContext: PriceEditingContext;
  product: any;
  initialPriceInputs?: Record<string, string>; // For state persistence between Step 2 <-> Step 3
  initialSelectedCurrencies?: string[]; // For state persistence
  initialCurrencyOrder?: string[]; // For state persistence
  onPriceChange?: (currency: string, newPrice: string | null) => void;
  onCurrencySelectionChange?: (currencies: string[]) => void; // Currency selection changes
  onOrderChange?: (order: string[]) => void; // Currency order changes
  onHasChanges?: (hasChanges: boolean) => void; // Real-time change detection
  onGetCurrentState?: React.Ref<{
    getCurrentState: () => {
      priceInputs: Record<string, string>;
      priceData: Record<string, number>;
      validityDates: { startDate: any; endDate: any };
    };
  }>;
}

interface PriceTableData {
  key: string;
  currency: string;
  currencyName: string;
  currentPrice: number | null;
  newPrice: string;
  calculatedChange: {
    amount: number;
    percentage: number;
  } | null;
}

/**
 * A list of currencies that should not have decimal places in their display.
 */
const zeroDecimalCurrencies = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
  'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
]);

/**
 * Currency names mapping for tooltips
 */
const currencyNames: Record<string, string> = {
  'AED': 'UAE Dirham',
  'AUD': 'Australian Dollar',
  'BRL': 'Brazilian Real',
  'CAD': 'Canadian Dollar',
  'CHF': 'Swiss Franc',
  'CNY': 'Chinese Yuan',
  'DKK': 'Danish Krone',
  'EGP': 'Egyptian Pound',
  'EUR': 'Euro',
  'GBP': 'British Pound',
  'HKD': 'Hong Kong Dollar',
  'INR': 'Indian Rupee',
  'JPY': 'Japanese Yen',
  'KRW': 'South Korean Won',
  'MXN': 'Mexican Peso',
  'NOK': 'Norwegian Krone',
  'NZD': 'New Zealand Dollar',
  'PLN': 'Polish Zloty',
  'SAR': 'Saudi Riyal',
  'SEK': 'Swedish Krona',
  'SGD': 'Singapore Dollar',
  'THB': 'Thai Baht',
  'TRY': 'Turkish Lira',
  'USD': 'US Dollar',
  'ZAR': 'South African Rand',
  // Add more currencies as needed (50-60 total)
  'MYR': 'Malaysian Ringgit',
  'IDR': 'Indonesian Rupiah',
  'PHP': 'Philippine Peso',
  'TWD': 'Taiwan Dollar',
  'CZK': 'Czech Koruna',
  'HUF': 'Hungarian Forint',
  'BGN': 'Bulgarian Lev',
  'RON': 'Romanian Leu',
  'HRK': 'Croatian Kuna',
  'RUB': 'Russian Ruble',
  'UAH': 'Ukrainian Hryvnia',
  'ILS': 'Israeli Shekel',
  'QAR': 'Qatari Riyal',
  'KWD': 'Kuwaiti Dinar',
  'BHD': 'Bahraini Dinar',
  'OMR': 'Omani Rial',
  'JOD': 'Jordanian Dinar',
  'LBP': 'Lebanese Pound',
  'MAD': 'Moroccan Dirham',
  'TND': 'Tunisian Dinar',
  'DZD': 'Algerian Dinar',
  'NGN': 'Nigerian Naira',
  'KES': 'Kenyan Shilling',
  'GHS': 'Ghanaian Cedi',
  'XOF': 'West African CFA Franc',
  'XAF': 'Central African CFA Franc',
  'MUR': 'Mauritian Rupee',
  'BWP': 'Botswana Pula',
  'SZL': 'Swazi Lilangeni',
  'LSL': 'Lesotho Loti',
  'NAD': 'Namibian Dollar',
  'ZMW': 'Zambian Kwacha',
  'UGX': 'Ugandan Shilling',
  'TZS': 'Tanzanian Shilling',
  'RWF': 'Rwandan Franc',
  'ETB': 'Ethiopian Birr',
  'CLP': 'Chilean Peso',
  'PEN': 'Peruvian Sol',
  'COP': 'Colombian Peso',
  'UYU': 'Uruguayan Peso',
  'PYG': 'Paraguayan Guarani',
  'BOB': 'Bolivian Boliviano',
  'ARS': 'Argentine Peso',
  'GYD': 'Guyanese Dollar',
  'SRD': 'Surinamese Dollar',
  'FKP': 'Falkland Islands Pound',
};

/**
 * Formats currency amount with proper decimal places
 */
const formatCurrencyAmount = (amount: number, currencyCode: string): string => {
  if (zeroDecimalCurrencies.has(currencyCode)) {
    return Math.round(amount).toLocaleString();
  }
  return amount.toFixed(2);
};

/**
 * Parse user input to number, handling different decimal formats
 */
const parseUserInput = (value: string): number | null => {
  if (!value || value.trim() === '') return null;
  
  // Remove commas and extra spaces
  const cleanValue = value.replace(/,/g, '').trim();
  const parsed = parseFloat(cleanValue);
  
  if (isNaN(parsed) || parsed < 0) return null;
  
  return parsed;
};

const SimplePriceTable: React.FC<SimplePriceTableProps> = ({
  selectedContext,
  product,
  initialPriceInputs,
  initialSelectedCurrencies,
  initialCurrencyOrder,
  onPriceChange,
  onCurrencySelectionChange,
  onOrderChange,
  onHasChanges,
  onGetCurrentState
}) => {
  const { token } = theme.useToken();
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>(initialPriceInputs || {});
  const [undoState, setUndoState] = useState<Record<string, string> | null>(null);
  
  // Custom currency ordering state - use props for persistence
  const [currencyOrder, setCurrencyOrder] = useState<string[]>(initialCurrencyOrder || []);
  
  // All available currencies for the multiselect dropdown
  const allAvailableCurrencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'SGD', 'HKD', 'CNY', 'INR',
    'KRW', 'THB', 'MXN', 'BRL', 'CHF', 'NOK', 'SEK', 'DKK', 'NZD', 'ZAR',
    'PLN', 'CZK', 'HUF', 'TRY', 'ILS', 'RUB', 'AED', 'SAR', 'QAR', 'KWD',
    'BHD', 'OMR', 'JOD', 'EGP', 'MAD', 'TND', 'DZD', 'NGN', 'KES', 'GHS',
    'MUR', 'BWP', 'NAD', 'ZMW', 'UGX', 'TZS', 'RWF', 'ETB', 'CLP', 'PEN',
    'COP', 'UYU', 'PYG', 'BOB', 'ARS', 'MYR', 'IDR', 'PHP', 'VND', 'TWD'
  ];
  
  // Currency selection state - use props for persistence  
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(initialSelectedCurrencies || ['USD']); // USD by default
  
  // Validity date state (for display purposes only - actual management is in parent)
  const validityStartDate: dayjs.Dayjs | null = dayjs().add(7, 'day');
  const validityEndDate: dayjs.Dayjs | null = null;
  
  // Individual currency validity overrides
  const [currencyValidityOverrides, setCurrencyValidityOverrides] = useState<Record<string, {
    startDate: dayjs.Dayjs | null;
    endDate: dayjs.Dayjs | null;
  }>>({});

  // Extract real data from product for non-Field channels
  const { currencies, priceData, existingCurrencies } = useMemo(() => {
    let sourcePriceGroup = null;
    let shouldIncludePriceData = false;

    if (selectedContext.priceGroupAction === 'update' && selectedContext.existingPriceGroup) {
      // Updating existing price group: use the selected price group's data
      sourcePriceGroup = selectedContext.existingPriceGroup;
      shouldIncludePriceData = true;
      
      // Debug logging for troubleshooting
      console.log('🔍 SimplePriceTable DEBUG - existingPriceGroup:', selectedContext.existingPriceGroup);
      console.log('🔍 SimplePriceTable DEBUG - pricePoints:', selectedContext.existingPriceGroup?.pricePoints);
    } else if (selectedContext.priceGroupAction === 'create') {
      // Creating new price group: use user-selected currencies with USD-first + alphabetical sorting
      const sortedSelectedCurrencies = [...selectedCurrencies].sort((a, b) => {
        if (a === 'USD') return -1;      // USD always first
        if (b === 'USD') return 1;       // USD always first
        return a.localeCompare(b);       // Everything else A-Z
      });
      
      return {
        currencies: sortedSelectedCurrencies,
        priceData: {},
        existingCurrencies: []
      };
    }

    if (!sourcePriceGroup?.pricePoints) {
      // Fallback for edit mode without valid price group - use USD-first + alphabetical sorting
      const sortedFallbackCurrencies = [...selectedCurrencies].sort((a, b) => {
        if (a === 'USD') return -1;      // USD always first
        if (b === 'USD') return 1;       // USD always first
        return a.localeCompare(b);       // Everything else A-Z
      });
      
      return {
        currencies: sortedFallbackCurrencies,
        priceData: {},
        existingCurrencies: []
      };
    }

    const pricePoints = sourcePriceGroup.pricePoints;

    // Filter price points that are active today (matches "Active today" filter logic)
    const today = new Date();
    console.log('🔍 SimplePriceTable DEBUG - all pricePoints:', pricePoints);
    console.log('🔍 SimplePriceTable DEBUG - filtering for active today:', today);
    
    const currentPricePoints = pricePoints.filter((pp: any) => {
      const validFrom = new Date(pp.validFrom);
      const validUntil = pp.validUntil ? new Date(pp.validUntil) : null;
      
      // Price point is active today if:
      // 1. It started before or on today
      // 2. It hasn't expired yet (no end date) OR it expires after today
      return validFrom <= today && (validUntil === null || validUntil >= today);
    });
    
    console.log('🔍 SimplePriceTable DEBUG - filtered currentPricePoints:', currentPricePoints);

    // Extract unique currencies from the price points
    const uniqueCurrencies = [...new Set(currentPricePoints.map((pp: any) => String(pp.currencyCode)))];
    
    console.log('🔍 SimplePriceTable DEBUG - extracted uniqueCurrencies:', uniqueCurrencies);
    
    // For edit mode: separate new and existing currencies, sort each group, then combine
    const newCurrencies = selectedCurrencies.filter(currency => !uniqueCurrencies.includes(currency));
    
    // Sort new currencies (USD first, then A-Z)
    const sortedNewCurrencies = newCurrencies.sort((a, b) => {
      if (a === 'USD') return -1;      // USD always first
      if (b === 'USD') return 1;       // USD always first
      return a.localeCompare(b);       // Everything else A-Z
    });
    
    // Sort existing currencies (USD first, then A-Z) 
    const sortedExistingCurrencies = uniqueCurrencies.sort((a, b) => {
      const aStr = a as string;
      const bStr = b as string;
      if (aStr === 'USD') return -1;      // USD always first
      if (bStr === 'USD') return 1;       // USD always first
      return aStr.localeCompare(bStr);    // Everything else A-Z
    });
    
    // Combine: new currencies first, then existing currencies
    const finalSortedCurrencies = [...sortedNewCurrencies, ...sortedExistingCurrencies];

    // Build price data lookup: currency -> price
    // Only include actual price data if we're updating an existing price group
    const priceDataLookup: Record<string, number> = {};
    
    if (shouldIncludePriceData) {
      currentPricePoints.forEach((pp: any) => {
        const currency = pp.currencyCode;
        // Use actual amount from data
        priceDataLookup[currency] = pp.amount;
      });
    }

    return {
      currencies: finalSortedCurrencies as string[],
      priceData: priceDataLookup,
      existingCurrencies: sortedExistingCurrencies as string[]
    };
  }, [product, selectedContext.channel, selectedContext.billingCycle, selectedContext.priceGroupAction, selectedContext.existingPriceGroup, selectedCurrencies]);

  // Extract table data with real pricing information
  const tableData = useMemo((): PriceTableData[] => {
    // Use custom order if available, otherwise use standard sorting
    const displayOrder = currencyOrder.length > 0 ? currencyOrder : currencies;
    
    return displayOrder.map(currency => {
      const currentPrice = selectedContext.priceGroupAction !== 'update' ? null : (priceData[currency] || null);
      const newPriceInput = priceInputs[currency] || '';
      const newPriceValue = parseUserInput(newPriceInput);
      
      let calculatedChange = null;
      if (currentPrice !== null && newPriceValue !== null) {
        const changeAmount = newPriceValue - currentPrice;
        const changePercentage = currentPrice === 0 ? 0 : (changeAmount / currentPrice) * 100;
        calculatedChange = {
          amount: changeAmount,
          percentage: changePercentage
        };
      }

      return {
        key: currency,
        currency,
        currencyName: currencyNames[currency] || currency,
        currentPrice,
        newPrice: newPriceInput,
        calculatedChange
      };
    });
  }, [selectedContext, priceInputs, currencies, priceData, currencyOrder]);

  // Real-time change detection
  React.useEffect(() => {
    if (!onHasChanges) return;

    let hasAnyChanges = false;

    // Check if any price input differs from current price
    currencies.forEach(currency => {
      const currentPrice = selectedContext.priceGroupAction === 'update' ? priceData[currency] : null;
      const newPriceInput = priceInputs[currency] || '';
      const newPriceValue = parseUserInput(newPriceInput);

      // For create mode, any non-empty input is a change
      if (selectedContext.priceGroupAction === 'create' && newPriceValue !== null) {
        hasAnyChanges = true;
      }
      
      // For update mode, check if values differ significantly for existing currencies
      if (selectedContext.priceGroupAction === 'update' && 
          currentPrice !== null && newPriceValue !== null && 
          Math.abs(newPriceValue - currentPrice) >= 0.01) {
        hasAnyChanges = true;
      }
      
      // For update mode, also check for new currencies with amounts (this was the bug!)
      if (selectedContext.priceGroupAction === 'update' && 
          !existingCurrencies.includes(currency) && newPriceValue !== null) {
        hasAnyChanges = true;
      }
    });

    onHasChanges(hasAnyChanges);
  }, [priceInputs, currencies, priceData, selectedContext.priceGroupAction, existingCurrencies, onHasChanges]);

  // Initialize selectedCurrencies for edit mode
  React.useEffect(() => {
    if (selectedContext.priceGroupAction === 'update' && existingCurrencies.length > 0) {
      // For edit mode, start with existing currencies (only set once to avoid infinite loop)
      setSelectedCurrencies(prev => {
        if (prev.length === 1 && prev[0] === 'USD') {
          // Only update if still in default state
          return existingCurrencies;
        }
        return prev;
      });
    }
  }, [selectedContext.priceGroupAction, existingCurrencies]);

  // Initialize selectedCurrencies for clone mode
  React.useEffect(() => {
    if (selectedContext.priceGroupAction === 'create' && selectedContext.clonePriceGroup?.pricePoints) {
      // For clone mode, extract currencies from the cloned price group (sorting will be applied in useMemo)
      const cloneCurrencies = [...new Set(selectedContext.clonePriceGroup.pricePoints.map((pp: any) => String(pp.currency || pp.currencyCode)))].filter(Boolean) as string[];
      
      setSelectedCurrencies(prev => {
        if (prev.length === 1 && prev[0] === 'USD' && cloneCurrencies.length > 0) {
          // Only update if still in default state and we have clone currencies
          return cloneCurrencies;
        }
        return prev;
      });
    }
  }, [selectedContext.priceGroupAction, selectedContext.clonePriceGroup]);

  // Expose method to get current state when needed (called by parent on demand)
  React.useImperativeHandle(onGetCurrentState, () => ({
    getCurrentState: () => ({
      priceInputs,
      priceData,
      validityDates: { startDate: validityStartDate, endDate: validityEndDate }
    })
  }), [priceInputs, priceData, validityStartDate, validityEndDate]);

  // Check if all prices are new (no current prices exist)
  const allPricesAreNew = useMemo(() => {
    return tableData.every(record => record.currentPrice === null);
  }, [tableData]);


  // Currency reordering functions
  const moveCurrencyUp = (currency: string) => {
    const currentOrder = currencyOrder.length > 0 ? currencyOrder : currencies;
    const currentIndex = currentOrder.indexOf(currency);
    
    if (currentIndex > 0) {
      const newOrder = [...currentOrder];
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
      setCurrencyOrder(newOrder);
      onOrderChange?.(newOrder); // Notify parent
    }
  };

  const moveCurrencyDown = (currency: string) => {
    const currentOrder = currencyOrder.length > 0 ? currencyOrder : currencies;
    const currentIndex = currentOrder.indexOf(currency);
    
    if (currentIndex < currentOrder.length - 1) {
      const newOrder = [...currentOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
      setCurrencyOrder(newOrder);
      onOrderChange?.(newOrder); // Notify parent
    }
  };

  // Currency selection handlers
  const handleCurrencySelect = (selectedValues: string[]) => {
    setSelectedCurrencies(selectedValues);
    onCurrencySelectionChange?.(selectedValues); // Notify parent
    
    // When new currencies are added, insert them at the top of the custom order
    if (currencyOrder.length > 0) {
      const newCurrencies = selectedValues.filter(currency => !currencyOrder.includes(currency));
      if (newCurrencies.length > 0) {
        const newOrder = [...newCurrencies, ...currencyOrder];
        setCurrencyOrder(newOrder);
        onOrderChange?.(newOrder); // Notify parent
      }
    }
  };

  const handleCurrencyRemove = (currencyToRemove: string) => {
    const newSelectedCurrencies = selectedCurrencies.filter(currency => currency !== currencyToRemove);
    const newCurrencyOrder = currencyOrder.filter(currency => currency !== currencyToRemove);
    
    setSelectedCurrencies(newSelectedCurrencies);
    setCurrencyOrder(newCurrencyOrder);
    
    // Notify parent
    onCurrencySelectionChange?.(newSelectedCurrencies);
    onOrderChange?.(newCurrencyOrder);
    
    // Also remove any price inputs and validity overrides for this currency
    setPriceInputs(prev => {
      const newInputs = { ...prev };
      delete newInputs[currencyToRemove];
      return newInputs;
    });
    setCurrencyValidityOverrides(prev => {
      const newOverrides = { ...prev };
      delete newOverrides[currencyToRemove];
      return newOverrides;
    });
  };

  // Get actual validity dates for existing currencies
  const getExistingValidityDates = (currency: string): { startDate: dayjs.Dayjs | null; endDate: dayjs.Dayjs | null } | null => {
    if (selectedContext.priceGroupAction !== 'update' || !selectedContext.existingPriceGroup?.pricePoints) {
      return null;
    }

    // Find the price point for this currency with the latest validity date
    const pricePoints = selectedContext.existingPriceGroup.pricePoints;
    const currencyPricePoints = pricePoints.filter((pp: any) => String(pp.currencyCode) === currency);
    
    if (currencyPricePoints.length === 0) {
      return null;
    }

    // Find the latest validity range (same logic as used elsewhere)
    const latestValidityDate = Math.max(...currencyPricePoints
      .map((pp: any) => pp.validFrom ? new Date(pp.validFrom).getTime() : 0)
      .filter((time: number) => time > 0)
    );
    
    const latestPricePoint = currencyPricePoints.find((pp: any) => {
      const validFrom = pp.validFrom ? new Date(pp.validFrom).getTime() : 0;
      return validFrom === latestValidityDate;
    });

    if (!latestPricePoint) {
      return null;
    }

    return {
      startDate: latestPricePoint.validFrom ? dayjs(latestPricePoint.validFrom) : null,
      endDate: latestPricePoint.validUntil ? dayjs(latestPricePoint.validUntil) : null
    };
  };


  // Check if this currency has actual price changes
  const hasActualPriceChanges = (currency: string): boolean => {
    if (selectedContext.priceGroupAction === 'create') {
      const newPriceInput = priceInputs[currency] || '';
      const newPriceValue = parseUserInput(newPriceInput);
      return newPriceValue !== null; // Any non-empty input in create mode is a change
    }
    
    // For update mode, check if current price differs from new input
    const currentPrice = priceData[currency];
    const newPriceInput = priceInputs[currency] || '';
    const newPriceValue = parseUserInput(newPriceInput);
    
    if (!existingCurrencies.includes(currency)) {
      // New currency = has changes if there's any input
      return newPriceValue !== null;
    }
    
    // Existing currency = has changes if values differ significantly
    if (currentPrice !== null && newPriceValue !== null) {
      return Math.abs(newPriceValue - currentPrice) >= 0.01;
    }
    
    return false;
  };

  // Validity period management
  const isUsingDefaults = (currency: string): boolean => {
    // If user has manually overridden, not using defaults
    if (currencyValidityOverrides[currency]) {
      return false;
    }
    
    // New currencies should always use global defaults (even without input yet)
    if (!existingCurrencies.includes(currency)) {
      return true;
    }
    
    // Existing currencies only use defaults if they have actual price changes
    return hasActualPriceChanges(currency);
  };

  const handleValidityPeriodEdit = (currency: string) => {
    const isDefaults = isUsingDefaults(currency);
    
    if (isDefaults) {
      // For currencies showing "using defaults", always initialize with current global defaults
      console.log('🔍 Edit with current global defaults for', currency, ':', {
        startDate: validityStartDate,
        endDate: validityEndDate
      });
      setCurrencyValidityOverrides(prev => ({
        ...prev,
        [currency]: {
          startDate: validityStartDate,
          endDate: validityEndDate
        }
      }));
    } else {
      // For currencies with existing custom dates, use those existing dates
      const existingDates = getExistingValidityDates(currency);
      console.log('🔍 Edit existing custom dates for', currency, ':', existingDates);
      setCurrencyValidityOverrides(prev => ({
        ...prev,
        [currency]: {
          startDate: existingDates?.startDate || validityStartDate,
          endDate: existingDates?.endDate || validityEndDate
        }
      }));
    }
  };

  const handleValidityPeriodCancel = (currency: string) => {
    // Remove the override to revert back to defaults
    setCurrencyValidityOverrides(prev => {
      const newOverrides = { ...prev };
      delete newOverrides[currency];
      return newOverrides;
    });
  };

  const updateCurrencyValidityDate = (currency: string, field: 'startDate' | 'endDate', value: dayjs.Dayjs | null) => {
    setCurrencyValidityOverrides(prev => ({
      ...prev,
      [currency]: {
        ...prev[currency],
        [field]: value
      }
    }));
  };

  const handlePriceInputChange = (currency: string, value: string) => {
    setPriceInputs(prev => ({
      ...prev,
      [currency]: value
    }));
  };

  const handlePriceInputBlur = (currency: string, value: string) => {
    const parsedValue = parseUserInput(value);
    if (onPriceChange) {
      onPriceChange(currency, parsedValue !== null ? value : null);
    }
  };

  // Parse clipboard data for copy-paste functionality
  const parseClipboardData = (text: string): string[][] => {
    const rows = text.trim().split('\n');
    return rows.map(row => row.split('\t').map(cell => cell.trim()));
  };

  // Clean pasted cell value
  const cleanPastedValue = (cellValue: string): string => {
    const trimmed = cellValue.trim();
    if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') {
      return ''; // Empty input - user can fill manually
    }
    
    const parsed = parseFloat(trimmed.replace(/,/g, ''));
    if (isNaN(parsed)) {
      return ''; // Invalid number - skip this cell
    }
    
    return trimmed; // Valid - use as-is
  };

  // Handle keyboard shortcuts (like Ctrl+Z for undo)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && undoState) {
        e.preventDefault();
        // Restore previous state
        setPriceInputs(undoState);
        setUndoState(null);
        
        // Trigger blur events for restored values
        setTimeout(() => {
          Object.entries(undoState).forEach(([currency, value]) => {
            handlePriceInputBlur(currency, value);
          });
        }, 10);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undoState]);

  // Handle paste events for bulk data entry
  const handlePaste = (e: React.ClipboardEvent, startingCurrency: string) => {
    e.preventDefault();
    
    const clipboardData = e.clipboardData?.getData('text/plain');
    if (!clipboardData) return;

    const pastedData = parseClipboardData(clipboardData);
    if (pastedData.length === 0) return;

    // Find the starting currency index
    const startingIndex = currencies.findIndex(currency => currency === startingCurrency);
    if (startingIndex === -1) return;

    // Extract single column of values (ignore additional columns for SimplePriceTable)
    const values = pastedData.map(row => row[0] || '').filter(val => val !== '');
    
    // Calculate how many currencies we can fill (don't go beyond available currencies)
    const availableCurrencies = currencies.slice(startingIndex);
    const valuesToApply = values.slice(0, availableCurrencies.length);

    // Store current state for undo functionality
    setUndoState({ ...priceInputs });

    // Prepare batch update for price inputs
    const updates: Record<string, string> = {};
    const blurEvents: Array<{ currency: string; value: string }> = [];

    valuesToApply.forEach((value, index) => {
      const targetCurrency = availableCurrencies[index];
      const cleanedValue = cleanPastedValue(value);
      
      updates[targetCurrency] = cleanedValue;
      blurEvents.push({ currency: targetCurrency, value: cleanedValue });
    });

    // Apply all updates at once
    setPriceInputs(prev => ({
      ...prev,
      ...updates
    }));

    // Trigger blur events for calculations (slight delay to ensure state is updated)
    setTimeout(() => {
      blurEvents.forEach(({ currency, value }) => {
        handlePriceInputBlur(currency, value);
      });
    }, 10);
  };

  // Define columns dynamically based on whether all prices are new
  // Date validation helper
  const validateDateRange = (startDate: dayjs.Dayjs | null, endDate: dayjs.Dayjs | null): string | null => {
    if (!startDate || !endDate) return null;
    if (endDate.isBefore(startDate)) {
      return 'End date cannot be before start date';
    }
    return null;
  };

  const columns: ColumnsType<PriceTableData> = [
    // Reorder column - leftmost, minimal styling
    {
      title: '',
      key: 'reorder',
      width: 24,
      fixed: 'left',
      className: 'reorder-column',
      render: (_: any, record: PriceTableData, index: number) => {
        const displayOrder = currencyOrder.length > 0 ? currencyOrder : currencies;
        const isFirst = index === 0;
        const isLast = index === displayOrder.length - 1;
        
        return (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '2px'
          }}>
            <Button
              type="text"
              size="small"
              icon={<ChevronUp size={14} />}
              onClick={() => moveCurrencyUp(record.currency)}
              disabled={isFirst}
              style={{
                width: '20px',
                height: '16px',
                padding: 0,
                minWidth: '20px',
                color: isFirst ? token.colorTextQuaternary : token.colorTextSecondary
              }}
            />
            <Button
              type="text"
              size="small"
              icon={<ChevronDown size={14} />}
              onClick={() => moveCurrencyDown(record.currency)}
              disabled={isLast}
              style={{
                width: '20px',
                height: '16px',
                padding: 0,
                minWidth: '20px',
                color: isLast ? token.colorTextQuaternary : token.colorTextSecondary
              }}
            />
          </div>
        );
      },
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      width: 70,
      fixed: 'left',
      className: 'table-col-currency',
      render: (currency: string, record: PriceTableData) => (
        <InfoPopover content={record.currencyName} placement="right">
          <Text style={{ 
            fontWeight: 500,
            fontSize: '13px'
          }}>
            {currency}
          </Text>
        </InfoPopover>
      ),
    },
    // Only include Current Price column if not all prices are new
    ...(allPricesAreNew ? [] : [{
      title: 'Current',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      width: 90,
      render: (price: number | null, record: PriceTableData) => {
        if (price === null) {
          return (
            <Text style={{ 
              color: token.colorTextTertiary,
              fontSize: '13px',
              fontStyle: 'italic'
            }}>
              New
            </Text>
          );
        }
        
        return (
          <Text style={{ 
            fontVariantNumeric: 'tabular-nums',
            fontSize: '13px',
            color: token.colorTextSecondary
          }}>
            {formatCurrencyAmount(price, record.currency)}
          </Text>
        );
      },
    }]),
    {
      title: selectedContext.priceGroupAction === 'create' ? 'Amount' : 'New',
      dataIndex: 'newPrice',
      key: 'newPrice',
      width: 100,
      render: (value: string, record: PriceTableData) => {
        // Check if the new value differs from current price
        const newPriceValue = parseUserInput(value);
        const isDifferent = record.currentPrice !== null && newPriceValue !== null && 
                           Math.abs(newPriceValue - record.currentPrice) >= 0.01;

        return (
          <Input
            size="small"
            value={value}
            onChange={(e) => handlePriceInputChange(record.currency, e.target.value)}
            onBlur={(e) => handlePriceInputBlur(record.currency, e.target.value)}
            onPaste={(e) => handlePaste(e, record.currency)}
            placeholder="" // Clean empty placeholder for minimal look
            style={{
              fontSize: '13px',
              fontVariantNumeric: 'tabular-nums',
              borderColor: isDifferent ? token.colorWarning : undefined // Warning border for changes
            }}
          />
        );
      },
    },
    // Only include Change column if not all prices are new
    ...(allPricesAreNew ? [] : [{
      title: 'Change',
      dataIndex: 'calculatedChange',
      key: 'change',
      width: 100,
      render: (change: { amount: number; percentage: number } | null, _record: PriceTableData) => {
        if (!change || Math.abs(change.amount) < 0.01) {
          return (
            <Text style={{ 
              color: token.colorTextTertiary,
              fontSize: '13px'
            }}>
              —
            </Text>
          );
        }

        const isIncrease = change.amount > 0;
        const isDecrease = change.amount < 0;
        
        let color = token.colorTextSecondary;
        if (isIncrease) color = token.colorSuccess;
        if (isDecrease) color = token.colorError;

        const sign = isIncrease ? '+' : '-';
        const percentage = Math.abs(change.percentage);
        const isLargeChange = percentage > 10;

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isLargeChange && (
              <Popover 
                content="New price is more than 10% of current"
                placement="top"
              >
                <TriangleAlert size={12} color={token.colorWarning} />
              </Popover>
            )}
            <Text style={{ 
              color,
              fontSize: '13px',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 500,
              textAlign: 'left' // Left align change indicators
            }}>
              {sign}{percentage.toFixed(1)}% {/* Remove arrows and amount, just show percentage */}
            </Text>
          </div>
        );
      },
    }]),
    // Validity column
    {
      title: 'Validity',
      key: 'validityPeriod',
      width: 200,
      render: (_: any, record: PriceTableData) => {
        const currency = record.currency;
        const isDefaults = isUsingDefaults(currency);
        const override = currencyValidityOverrides[currency];
        const existingDates = getExistingValidityDates(currency);
        
        if (override) {
          // Show individual date pickers for user overrides
          const validationError = validateDateRange(override.startDate, override.endDate);
          const hasError = !!validationError;
          
          return (
            <div style={{ width: '100%' }}>
              <Space size={4} style={{ width: '100%' }}>
                <DatePicker
                  value={override.startDate}
                  onChange={(date) => updateCurrencyValidityDate(currency, 'startDate', date)}
                  size="small"
                  format="MMM D, YYYY"
                  placeholder="Start"
                  status={hasError ? "error" : undefined}
                />
                <Text style={{ fontSize: '11px', color: token.colorTextTertiary }}>to</Text>
                <DatePicker
                  value={override.endDate}
                  onChange={(date) => updateCurrencyValidityDate(currency, 'endDate', date)}
                  size="small"
                  format="MMM D, YYYY"
                  placeholder="present"
                  allowClear
                  status={hasError ? "error" : undefined}
                />
                <Button
                  type="text"
                  size="small"
                  icon={<X size={12} />}
                  onClick={() => handleValidityPeriodCancel(currency)}
                  style={{
                    color: token.colorTextTertiary,
                    padding: '2px',
                    height: '20px',
                    width: '20px',
                    minWidth: '20px'
                  }}
                  title="Cancel and use default dates"
                />
              </Space>
              {hasError && (
                <Text style={{ 
                  color: token.colorError, 
                  fontSize: token.fontSizeSM,
                  display: 'block',
                  marginTop: '2px'
                }}>
                  {validationError}
                </Text>
              )}
            </div>
          );
        } else if (isDefaults) {
          // Show actual default dates with pencil icon (for new currencies and existing currencies with changes)
          const startText = validityStartDate?.format('MMM D, YYYY') || 'Not set';
          const endText = 'present'; // validityEndDate is always null for defaults
          
          return (
            <div
              onClick={() => handleValidityPeriodEdit(currency)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                padding: '2px 0'
              }}
            >
              <Text style={{
                fontSize: token.fontSize,
                color: token.colorTextTertiary
              }}>
                {startText} - {endText}
              </Text>
              <Pencil 
                size={12} 
                style={{ 
                  color: token.colorPrimary,
                  flexShrink: 0
                }} 
              />
            </div>
          );
        } else if (existingDates) {
          // Show actual dates for existing currencies
          const startText = existingDates.startDate?.format('MMM D, YYYY') || 'Not set';
          const endText = existingDates.endDate?.format('MMM D, YYYY') || 'present';
          const hasChanges = hasActualPriceChanges(currency);
          
          if (hasChanges) {
            // Currency has changes - show clickable dates that can be edited
            return (
              <Button
                type="link"
                size="small"
                onClick={() => handleValidityPeriodEdit(currency)}
                style={{
                  fontSize: token.fontSize,
                  color: token.colorText,
                  padding: 0,
                  height: 'auto',
                  textAlign: 'left'
                }}
              >
                {startText} - {endText}
              </Button>
            );
          } else {
            // Currency unchanged - show grayed out, non-editable dates
            return (
              <Text style={{
                fontSize: token.fontSize,
                color: token.colorTextTertiary
              }}>
                {startText} - {endText}
              </Text>
            );
          }
        } else {
          // Fallback - should not happen
          return (
            <Text style={{ fontSize: token.fontSize, color: token.colorTextTertiary }}>
              No dates
            </Text>
          );
        }
      },
    },
    // Add remove button column - always show but conditionally disable
    {
      title: '',
      key: 'remove',
      width: 24,
      fixed: 'right' as const,
      className: 'remove-action-column',
      render: (_: any, record: PriceTableData) => {
        const isExistingCurrency = selectedContext.priceGroupAction === 'update' && 
                                  existingCurrencies.includes(record.currency);
        
        if (isExistingCurrency) {
          // Disabled button with tooltip for existing currencies
          return (
            <Tooltip title="Can't remove existing price points" placement="left">
              <Button
                type="text"
                size="small"
                icon={<X size={14} />}
                disabled
                style={{
                  color: token.colorTextQuaternary,
                  border: 'none',
                  padding: '4px',
                  height: '24px',
                  width: '24px',
                  cursor: 'not-allowed'
                }}
              />
            </Tooltip>
          );
        }
        
        // Enabled button for new currencies (or all currencies in create mode)
        return (
          <Button
            type="text"
            size="small"
            icon={<X size={14} />}
            onClick={() => handleCurrencyRemove(record.currency)}
            className="remove-currency-btn"
            style={{
              color: token.colorError, // Use danger/error color
              border: 'none',
              padding: '4px',
              height: '24px',
              width: '24px'
            }}
          />
        );
      },
    }
  ];

  return (
    <div style={{ marginTop: '8px' }}>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>

        {/* Currency selection dropdown */}
        <div style={{ marginBottom: '16px' }}>
          <Text style={{ fontSize: token.fontSizeHeading3, color: token.colorText, fontWeight: 500, marginBottom: '8px', display: 'block' }}>
            Add currencies:
          </Text>
          <Select
            mode="multiple"
            value={selectedContext.priceGroupAction === 'create' ? selectedCurrencies : selectedCurrencies.filter(c => !existingCurrencies.includes(c))}
            onChange={(newValues: string[]) => {
              if (selectedContext.priceGroupAction === 'create') {
                handleCurrencySelect(newValues);
              } else {
                // For edit mode, combine existing with new selections
                const combinedCurrencies = [...existingCurrencies, ...newValues];
                handleCurrencySelect([...new Set(combinedCurrencies)]);
              }
            }}
            placeholder="Search and select currencies..."
            style={{ width: '100%' }}
            size="middle"
            showSearch
            filterOption={(input, option) => 
              (option?.value as string).toLowerCase().includes(input.toLowerCase())
            }
            dropdownStyle={{ maxHeight: '300px' }}
            dropdownRender={(menu) => (
              <div>
                {selectedContext.priceGroupAction === 'update' && (
                  <div style={{
                    padding: '8px 12px',
                    fontSize: token.fontSize,
                    color: token.colorTextSecondary,
                    borderBottom: `1px solid ${token.colorBorder}`,
                    marginBottom: '4px'
                  }}>
                    Showing only currencies that do not already exist in this price group.
                  </div>
                )}
                {menu}
              </div>
            )}
            options={allAvailableCurrencies
              .sort() // Sort alphabetically A-Z
              .filter(currency => selectedContext.priceGroupAction === 'create' || !existingCurrencies.includes(currency))
              .map(currency => ({
                value: currency,
                label: currency
              }))
            }
          />
        </div>

        {/* Explanatory text for Current column */}
        {selectedContext.priceGroupAction === 'update' && (
          <Text style={{ 
            fontSize: token.fontSize,
            color: token.colorTextSecondary,
            display: 'block',
            marginBottom: '12px'
          }}>
            Current column shows prices active today - these are what you're changing from.
          </Text>
        )}
        
        <Table
          size="small"
          columns={columns}
          dataSource={tableData}
          rowKey="key"
          pagination={false}
          bordered
          className="simple-price-table"
          tableLayout="fixed"
        />
      </Space>

      <style>{`
        /* Reorder column styling - minimal, no divider */
        .simple-price-table .reorder-column {
          background-color: ${token.colorFillAlter} !important;
          border-right: none !important;
          padding: 4px 2px !important;
          text-align: center;
        }
        .simple-price-table .ant-table-thead > tr > th.reorder-column {
          border-right: none !important;
        }
        
        .simple-price-table .table-col-currency {
          background-color: ${token.colorFillAlter} !important;
          border-left: none !important;
        }
        .simple-price-table .ant-table-thead > tr > th.table-col-currency {
          border-left: none !important;
        }
        .simple-price-table .ant-table-tbody > tr > td.table-col-currency {
          border-left: none !important;
        }
        
        .simple-price-table .ant-input {
          border: 1px solid ${token.colorBorder};
          border-radius: 4px;
        }
        .simple-price-table .ant-input:focus {
          border-color: ${token.colorPrimary};
          box-shadow: 0 0 0 2px ${token.colorPrimary}1a;
        }
        
        /* Ensure last row has bottom border */
        .simple-price-table .ant-table-tbody > tr:last-child > td {
          border-bottom: 1px solid ${token.colorBorder} !important;
        }
        
        
        /* Style the remove action cells */
        .simple-price-table .ant-table-tbody > tr > td.remove-action-column {
          padding: 8px 2px !important;
          text-align: center;
          border-left: none !important;
        }
        
        /* Remove the right border from the column before the remove action column */
        .simple-price-table .ant-table-thead > tr > th:nth-last-child(2) {
          border-right: none !important;
        }
        .simple-price-table .ant-table-tbody > tr > td:nth-last-child(2) {
          border-right: none !important;
        }
        
        /* Also remove left border from remove action header */
        .simple-price-table .ant-table-thead > tr > th.remove-action-column {
          border-left: none !important;
        }
        
        /* Remove button hover effects */
        .simple-price-table .remove-currency-btn:hover {
          background-color: ${token.colorErrorBg} !important;
          color: ${token.colorErrorHover} !important;
        }
      `}</style>
    </div>
  );
};

export default SimplePriceTable;
