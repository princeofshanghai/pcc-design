import React, { useState, useMemo } from 'react';
import { Table, Input, Typography, theme, Tabs, Space, Tag, DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import InfoPopover from '../../shared/InfoPopover';

const { Text } = Typography;

interface FieldPriceMatrixProps {
  selectedContext: {
    channel: string;
    billingCycle: string;
    priceGroupAction: string | null; // 'create' or 'update'
    existingPriceGroup: any | null; // Selected existing price group for updates
    lixKey?: string;
    lixTreatment?: string;
  };
  product: any;
  onPriceChange?: (currency: string, seatRange: string, pricingTier: string, newPrice: string | null) => void;
}

interface MatrixCellData {
  key: string;
  seatRangeKey: string;
  seatRangeDisplay: string;
  currentPrices: Record<string, number | null>; // tier -> price
  newPrices: Record<string, string>; // tier -> input value
  calculatedChanges: Record<string, { amount: number; percentage: number } | null>; // tier -> change
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
  'USD': 'US Dollar',
  'EUR': 'Euro',
  'GBP': 'British Pound',
  'JPY': 'Japanese Yen',
  'CAD': 'Canadian Dollar',
  'AUD': 'Australian Dollar',
  'SGD': 'Singapore Dollar',
  'HKD': 'Hong Kong Dollar',
  'CNY': 'Chinese Yuan',
  'INR': 'Indian Rupee',
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

const FieldPriceMatrix: React.FC<FieldPriceMatrixProps> = ({
  selectedContext,
  product,
  onPriceChange
}) => {
  const { token } = theme.useToken();
  const [priceInputs, setPriceInputs] = useState<Record<string, Record<string, Record<string, string>>>>({});
  const [activeTabKey, setActiveTabKey] = useState<string>('');
  const [undoState, setUndoState] = useState<Record<string, Record<string, Record<string, string>>> | null>(null);
  
  // Validity date state
  const [validityStartDate, setValidityStartDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [validityEndDate, setValidityEndDate] = useState<dayjs.Dayjs | null>(null);

  // Extract real data from product for Field channel
  const { currencies, seatRanges, pricingTiers, priceData } = useMemo(() => {
    let sourcePriceGroup = null;
    let shouldIncludePriceData = false;

    if (selectedContext.priceGroupAction === 'update' && selectedContext.existingPriceGroup) {
      // Updating existing price group: use the selected price group's data
      sourcePriceGroup = selectedContext.existingPriceGroup;
      shouldIncludePriceData = true;
    } else if (selectedContext.priceGroupAction === 'create') {
      // Creating new price group: find ANY existing Field price group to extract structure
      const anyFieldSku = product?.skus?.find((sku: any) => sku.salesChannel === 'Field');
      if (anyFieldSku?.priceGroup) {
        sourcePriceGroup = anyFieldSku.priceGroup;
        shouldIncludePriceData = false; // Structure only, no current prices
      }
    }

    if (!sourcePriceGroup?.pricePoints) {
      return { currencies: [], seatRanges: [], pricingTiers: [], priceData: {} };
    }

    const pricePoints = sourcePriceGroup.pricePoints;

    // Find the latest validity range (assume it's the one without validTo or the latest validFrom)
    const latestValidityDate = Math.max(...pricePoints
      .map((pp: any) => pp.validFrom ? new Date(pp.validFrom).getTime() : 0)
      .filter((time: number) => time > 0)
    );
    
    const currentPricePoints = pricePoints.filter((pp: any) => {
      const validFrom = pp.validFrom ? new Date(pp.validFrom).getTime() : 0;
      return validFrom === latestValidityDate;
    });

    // Extract unique currencies
    const uniqueCurrencies = [...new Set(currentPricePoints.map((pp: any) => String(pp.currencyCode)))];
    
    // Extract unique pricing tiers (convert null to 'NULL_TIER' for consistency)
    const uniqueTiers = [...new Set(currentPricePoints.map((pp: any) => String(pp.pricingTier || 'NULL_TIER')))];
    
    // Extract unique seat ranges
    const uniqueRanges = [...new Set(currentPricePoints.map((pp: any) => {
      const min = pp.minQuantity || 1;
      const max = pp.maxQuantity;
      
      if (!max) {
        return `${min}+`;
      }
      
      if (min === max) {
        return `${min}`;
      }
      
      return `${min}-${max}`;
    }))];

    // Sort seat ranges by numeric value
    const sortedSeatRanges = uniqueRanges.sort((a, b) => {
      const parseRange = (key: string) => {
        if (key.includes('+')) return [parseInt(key.replace('+', '')), Infinity];
        if (key.includes('-')) {
          const [min, max] = key.split('-').map(Number);
          return [min, max];
        }
        const num = parseInt(key);
        return [num, num];
      };

      const [aMin] = parseRange(a as string);
      const [bMin] = parseRange(b as string);
      
      return aMin - bMin;
    });

    // Create seat range objects with display names
    const seatRangeObjects = sortedSeatRanges.map(key => ({
      key: key as string,
      display: key as string
    }));

    // Sort currencies in the specified order: USD, CAD, GBP, EUR, AUD, HKD, INR, SGD, CNY
    const currencyOrder = ['USD', 'CAD', 'GBP', 'EUR', 'AUD', 'HKD', 'INR', 'SGD', 'CNY'];
    const sortedCurrencies = uniqueCurrencies.sort((a, b) => {
      const aStr = a as string;
      const bStr = b as string;
      const aIndex = currencyOrder.indexOf(aStr);
      const bIndex = currencyOrder.indexOf(bStr);
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return aStr.localeCompare(bStr);
    });

    // Sort pricing tiers (NULL_TIER first, then others)
    const tierOrder = ['NULL_TIER', 'STFF', 'CORP EM', 'GVT', 'CORP BASE PRICE', 'CORP TIER 1', 'CORP TIER 1 DSC', 'CORP TIER 2'];
    const sortedTiers = uniqueTiers.sort((a, b) => {
      const aStr = a as string;
      const bStr = b as string;
      const aIndex = tierOrder.indexOf(aStr);
      const bIndex = tierOrder.indexOf(bStr);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return aStr.localeCompare(bStr);
    });

    // Build price data lookup: currency -> seatRange -> tier -> price
    // Only include actual price data if we're updating an existing price group
    const priceDataLookup: Record<string, Record<string, Record<string, number>>> = {};
    
    if (shouldIncludePriceData) {
      currentPricePoints.forEach((pp: any) => {
        const currency = pp.currencyCode;
        const tier = pp.pricingTier || 'NULL_TIER';
        const min = pp.minQuantity || 1;
        const max = pp.maxQuantity;
        
        let seatRangeKey;
        if (!max) {
          seatRangeKey = `${min}+`;
        } else if (min === max) {
          seatRangeKey = `${min}`;
        } else {
          seatRangeKey = `${min}-${max}`;
        }

        if (!priceDataLookup[currency]) {
          priceDataLookup[currency] = {};
        }
        if (!priceDataLookup[currency][seatRangeKey]) {
          priceDataLookup[currency][seatRangeKey] = {};
        }
        
        priceDataLookup[currency][seatRangeKey][tier] = pp.amount; // Use actual amount from data
      });
    }

    return {
      currencies: sortedCurrencies as string[],
      seatRanges: seatRangeObjects,
      pricingTiers: sortedTiers as string[],
      priceData: priceDataLookup
    };
  }, [product, selectedContext.channel, selectedContext.billingCycle, selectedContext.priceGroupAction, selectedContext.existingPriceGroup]);

  // Check if all prices are new (no current prices exist)
  const allPricesAreNew = useMemo(() => {
    return currencies.every(currency => 
      seatRanges.every(seatRange => 
        pricingTiers.every(tier => 
          priceData[currency]?.[seatRange.key]?.[tier] === undefined
        )
      )
    );
  }, [currencies, seatRanges, pricingTiers, priceData]);

  // Set initial active tab when currencies are loaded
  React.useEffect(() => {
    if (currencies.length > 0 && !activeTabKey) {
      setActiveTabKey(currencies[0]);
    }
  }, [currencies, activeTabKey]);

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
          Object.entries(undoState).forEach(([currency, seatRanges]) => {
            Object.entries(seatRanges).forEach(([seatRange, tiers]) => {
              Object.entries(tiers).forEach(([tier, value]) => {
                handlePriceInputBlur(currency, seatRange, tier, value);
              });
            });
          });
        }, 10);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undoState]);

  // Get existing price from real data
  const getExistingPrice = (currency: string, seatRange: string, tier: string): number | null => {
    // Only return existing prices if we're updating an existing price group
    if (selectedContext.priceGroupAction !== 'update') return null;
    
    return priceData[currency]?.[seatRange]?.[tier] || null;
  };

  // Create matrix data for a specific currency
  const createMatrixData = (currency: string): MatrixCellData[] => {
    // Get the tiers that have data for this currency
    const tiersWithDataForCurrency = pricingTiers.filter(tier => {
      return seatRanges.some(seatRange => {
        return priceData[currency]?.[seatRange.key]?.[tier] !== undefined;
      });
    });

    return seatRanges.map(seatRange => {
      const currentPrices: Record<string, number | null> = {};
      const newPrices: Record<string, string> = {};
      const calculatedChanges: Record<string, { amount: number; percentage: number } | null> = {};

      // Only process tiers that have data for this currency
      tiersWithDataForCurrency.forEach(tier => {
        const currentPrice = getExistingPrice(currency, seatRange.key, tier);
        const inputValue = priceInputs[currency]?.[seatRange.key]?.[tier] || '';
        const newPriceValue = parseUserInput(inputValue);

        currentPrices[tier] = currentPrice;
        newPrices[tier] = inputValue;

        if (currentPrice !== null && newPriceValue !== null) {
          const changeAmount = newPriceValue - currentPrice;
          const changePercentage = currentPrice === 0 ? 0 : (changeAmount / currentPrice) * 100;
          calculatedChanges[tier] = {
            amount: changeAmount,
            percentage: changePercentage
          };
        } else {
          calculatedChanges[tier] = null;
        }
      });

      return {
        key: `${currency}-${seatRange.key}`,
        seatRangeKey: seatRange.key,
        seatRangeDisplay: seatRange.display,
        currentPrices,
        newPrices,
        calculatedChanges
      };
    });
  };

  const handlePriceInputChange = (currency: string, seatRange: string, tier: string, value: string) => {
    setPriceInputs(prev => ({
      ...prev,
      [currency]: {
        ...prev[currency],
        [seatRange]: {
          ...prev[currency]?.[seatRange],
          [tier]: value
        }
      }
    }));
  };

  const handlePriceInputBlur = (currency: string, seatRange: string, tier: string, value: string) => {
    const parsedValue = parseUserInput(value);
    if (onPriceChange) {
      onPriceChange(currency, seatRange, tier, parsedValue !== null ? value : null);
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

  // Handle paste events for bulk data entry with smart 2D detection
  const handlePaste = (e: React.ClipboardEvent, startingCurrency: string, startingSeatRange: string, startingTier: string) => {
    e.preventDefault();
    
    const clipboardData = e.clipboardData?.getData('text/plain');
    if (!clipboardData) return;

    const pastedData = parseClipboardData(clipboardData);
    if (pastedData.length === 0) return;

    // Store current state for undo functionality
    setUndoState({ 
      ...priceInputs
    });

    // Detect if this is 1D (single column) or 2D (multiple columns) data
    const is2D = pastedData.some(row => row.length > 1);
    
    // Get available tiers for the current currency (only those with data)
    const availableTiers = pricingTiers.filter(tier => {
      return seatRanges.some(seatRange => {
        return priceData[startingCurrency]?.[seatRange.key]?.[tier] !== undefined;
      });
    });

    // Find starting indices
    const startingSeatIndex = seatRanges.findIndex(sr => sr.key === startingSeatRange);
    const startingTierIndex = availableTiers.findIndex(tier => tier === startingTier);
    
    if (startingSeatIndex === -1 || startingTierIndex === -1) return;

    // Prepare batch update for price inputs
    const updates: Record<string, Record<string, Record<string, string>>> = {};
    const blurEvents: Array<{ currency: string; seatRange: string; tier: string; value: string }> = [];

    // Initialize nested structure for updates
    if (!updates[startingCurrency]) {
      updates[startingCurrency] = {};
    }

    if (is2D) {
      // 2D paste: fill both horizontally (across tiers) and vertically (down seat ranges)
      pastedData.forEach((row, rowIndex) => {
        const targetSeatRangeIndex = startingSeatIndex + rowIndex;
        if (targetSeatRangeIndex >= seatRanges.length) return; // Don't go beyond available rows
        
        const targetSeatRange = seatRanges[targetSeatRangeIndex];
        
        row.forEach((cellValue, colIndex) => {
          const targetTierIndex = startingTierIndex + colIndex;
          if (targetTierIndex >= availableTiers.length) return; // Don't go beyond available columns
          
          const targetTier = availableTiers[targetTierIndex];
          const cleanedValue = cleanPastedValue(cellValue);
          
          // Ensure nested structure exists
          if (!updates[startingCurrency][targetSeatRange.key]) {
            updates[startingCurrency][targetSeatRange.key] = {};
          }
          
          updates[startingCurrency][targetSeatRange.key][targetTier] = cleanedValue;
          blurEvents.push({ 
            currency: startingCurrency, 
            seatRange: targetSeatRange.key, 
            tier: targetTier, 
            value: cleanedValue 
          });
        });
      });
    } else {
      // 1D paste: fill vertically down the seat ranges in the same tier
      const values = pastedData.map(row => row[0] || '').filter(val => val !== '');
      
      values.forEach((value, index) => {
        const targetSeatRangeIndex = startingSeatIndex + index;
        if (targetSeatRangeIndex >= seatRanges.length) return; // Don't go beyond available rows
        
        const targetSeatRange = seatRanges[targetSeatRangeIndex];
        const cleanedValue = cleanPastedValue(value);
        
        // Ensure nested structure exists
        if (!updates[startingCurrency][targetSeatRange.key]) {
          updates[startingCurrency][targetSeatRange.key] = {};
        }
        
        updates[startingCurrency][targetSeatRange.key][startingTier] = cleanedValue;
        blurEvents.push({ 
          currency: startingCurrency, 
          seatRange: targetSeatRange.key, 
          tier: startingTier, 
          value: cleanedValue 
        });
      });
    }

    // Apply all updates at once using deep merge
    setPriceInputs(prev => {
      const newState = { ...prev };
      
      Object.keys(updates).forEach(currency => {
        if (!newState[currency]) {
          newState[currency] = {};
        }
        
        Object.keys(updates[currency]).forEach(seatRange => {
          if (!newState[currency][seatRange]) {
            newState[currency][seatRange] = {};
          }
          
          Object.keys(updates[currency][seatRange]).forEach(tier => {
            newState[currency][seatRange][tier] = updates[currency][seatRange][tier];
          });
        });
      });
      
      return newState;
    });

    // Trigger blur events for calculations (slight delay to ensure state is updated)
    setTimeout(() => {
      blurEvents.forEach(({ currency, seatRange, tier, value }) => {
        handlePriceInputBlur(currency, seatRange, tier, value);
      });
    }, 10);
  };

  // Calculate changes for a specific currency (for tab indicators)
  const calculateChangesForCurrency = (currency: string): number => {
    let changeCount = 0;
    
    // Get available tiers for the current currency (only those with data)
    const availableTiers = pricingTiers.filter(tier => {
      return seatRanges.some(seatRange => {
        return priceData[currency]?.[seatRange.key]?.[tier] !== undefined;
      });
    });
    
    seatRanges.forEach(seatRange => {
      availableTiers.forEach(tier => {
        const currentPrice = priceData[currency]?.[seatRange.key]?.[tier];
        const newPriceInput = priceInputs[currency]?.[seatRange.key]?.[tier] || '';
        const newPriceValue = parseUserInput(newPriceInput);
        
        // Same logic as border warning detection - check if values differ by at least 0.01
        if (currentPrice !== null && newPriceValue !== null && 
            Math.abs(newPriceValue - currentPrice) >= 0.01) {
          changeCount++;
        }
      });
    });
    
    return changeCount;
  };

  // Create columns for the matrix table with sub-columns
  const createColumns = (currency: string): ColumnsType<MatrixCellData> => {
    const columns: ColumnsType<MatrixCellData> = [
      {
        title: 'Seats',
        dataIndex: 'seatRangeDisplay',
        key: 'seatRange',
        fixed: 'left',
        width: 80,
        className: 'table-col-first seat-range-column',
        render: (text: string) => (
          <Text style={{ 
            fontWeight: 500,
            fontSize: '13px'
          }}>
            {text}
          </Text>
        ),
      }
    ];

    // Filter to only show tiers that have data for this specific currency
    const tiersWithDataForCurrency = pricingTiers.filter(tier => {
      // Check if any seat range has data for this tier in this currency
      return seatRanges.some(seatRange => {
        return priceData[currency]?.[seatRange.key]?.[tier] !== undefined;
      });
    });

    // Add column groups for each pricing tier with Current/New sub-columns
    tiersWithDataForCurrency.forEach((tier, index) => {
      // Map tier codes to shorter display names for column headers
      const tierDisplayMap: Record<string, string> = {
        'NULL_TIER': '-',
        'CORP BASE PRICE': 'Base',
        'STFF': 'Staff',
        'CORP EM': 'EM',
        'CORP TIER 1': 'T1',
        'CORP TIER 1 DSC': 'T1D',
        'CORP TIER 2': 'T2',
        'GVT': 'Gov',
      };
      
      const tierDisplay = tierDisplayMap[tier] || tier;
      const isZebraStripe = index % 2 === 1;
      
      columns.push({
        title: tierDisplay,
        key: tier,
        className: `tier-group tier-${index} ${isZebraStripe ? 'tier-zebra' : ''}`,
        children: [
          // Only include Current price sub-column if not all prices are new
          ...(allPricesAreNew ? [] : [{
            title: 'Current',
            key: `${tier}-current`,
            width: 100,
            className: `tier-current ${isZebraStripe ? 'tier-zebra' : ''}`,
            render: (_: any, record: MatrixCellData) => {
              const currentPrice = record.currentPrices[tier];
              
              return (
                <Input
                  size="small"
                  value={currentPrice !== null ? formatCurrencyAmount(currentPrice, currency) : ''}
                  disabled={true}
                  placeholder={currentPrice === null ? 'New' : ''}
                  style={{
                    fontSize: token.fontSizeSM,
                    fontVariantNumeric: 'tabular-nums',
                    color: currentPrice !== null ? token.colorText : token.colorTextTertiary, // Use normal color for better readability
                    backgroundColor: token.colorBgContainer,
                    width: '90px',
                    cursor: 'not-allowed'
                  }}
                />
              );
            }
          }]),
          // New price sub-column
          {
            title: 'New',
            key: `${tier}-new`,
            width: 100,
            className: `tier-new ${isZebraStripe ? 'tier-zebra' : ''}`,
            render: (_, record: MatrixCellData) => {
              const newPrice = record.newPrices[tier];
              const change = record.calculatedChanges[tier];
              const currentPrice = record.currentPrices[tier];
              
              // Check if the new value differs from current price
              const newPriceValue = parseUserInput(newPrice);
              const isDifferent = currentPrice !== null && newPriceValue !== null && 
                                 Math.abs(newPriceValue - currentPrice) >= 0.01;

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {/* New price input */}
                  <Input
                    size="small"
                    value={newPrice}
                    onChange={(e) => handlePriceInputChange(currency, record.seatRangeKey, tier, e.target.value)}
                    onBlur={(e) => handlePriceInputBlur(currency, record.seatRangeKey, tier, e.target.value)}
                    onPaste={(e) => handlePaste(e, currency, record.seatRangeKey, tier)}
                    placeholder="" // Clean empty placeholder for minimal look
                    style={{
                      fontSize: token.fontSizeSM,
                      fontVariantNumeric: 'tabular-nums',
                      width: '90px',
                      borderColor: isDifferent ? token.colorWarning : undefined // Warning border for changes
                    }}
                  />

                  {/* Change indicator below new input */}
                  <div style={{ 
                    minHeight: '16px',
                    fontSize: '10px',
                    fontVariantNumeric: 'tabular-nums',
                    textAlign: 'left', // Left align with input
                    fontWeight: 500
                  }}>
                    {change && Math.abs(change.amount) >= 0.01 ? (
                      <span style={{
                        color: change.amount > 0 ? token.colorSuccess : token.colorError
                      }}>
                        {change.percentage >= 0 ? '+' : ''}{change.percentage.toFixed(1)}% {/* Remove arrows */}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            }
          }
        ]
      });
    });

    return columns;
  };

  // Create tab items for each currency
  const tabItems = currencies.map(currency => {
    const changeCount = calculateChangesForCurrency(currency);
    
    return {
      key: currency,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Currency name */}
          <InfoPopover content={currencyNames[currency] || currency} placement="top">
            <Text style={{ fontWeight: 500 }}>
              {currency}
            </Text>
          </InfoPopover>
          
          {/* Change indicator tag */}
          <Tag 
            color={changeCount > 0 ? 'warning' : 'default'}
            style={{ 
              fontSize: '11px', 
              lineHeight: '16px', 
              padding: '0 6px',
              color: changeCount > 0 ? undefined : token.colorTextSecondary // Use secondary text color for "No changes"
            }}
          >
            {changeCount > 0 ? `${changeCount} change${changeCount === 1 ? '' : 's'}` : 'No changes'}
          </Tag>
        </div>
      ),
      children: (
      <div style={{ marginTop: '8px' }}>
        {/* Dynamic context text above table */}
        <Text style={{ 
          fontSize: token.fontSizeHeading4,
          color: token.colorTextSecondary,
          marginBottom: '12px',
          display: 'block'
        }}>
          Showing {selectedContext.billingCycle.toLowerCase()} prices in {currency}
        </Text>
        
        <Table
          size="small"
          columns={createColumns(currency)}
          dataSource={createMatrixData(currency)}
          rowKey="key"
          pagination={false}
          scroll={{ x: 'max-content' }}
          bordered
          className="field-price-matrix"
          tableLayout="fixed"
        />
      </div>
      )
    };
  });

  return (
    <div style={{ marginTop: '8px' }}>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {/* Validity controls */}
        <div style={{ 
          marginBottom: '16px', 
          padding: '12px', 
          background: token.colorFillAlter,
          borderRadius: '6px'
        }}>
          <Space align="center" wrap>
            <Text style={{ fontSize: '13px', color: token.colorText, fontWeight: 500 }}>
              New prices valid from:
            </Text>
            <DatePicker
              value={validityStartDate}
              onChange={setValidityStartDate}
              size="small"
              style={{ width: '120px' }}
            />
            <Text style={{ fontSize: '13px', color: token.colorText }}>to:</Text>
            <DatePicker
              value={validityEndDate}
              onChange={setValidityEndDate}
              placeholder="Ongoing"
              size="small"
              style={{ width: '120px' }}
            />
          </Space>
        </div>

        <Tabs 
          items={tabItems}
          size="large"
          type="card"
          activeKey={activeTabKey}
          onChange={setActiveTabKey}
        />
      </Space>

      <style>{`
        .field-price-matrix .seat-range-column {
          background-color: ${token.colorFillAlter} !important;
        }
        .field-price-matrix .tier-column {
          padding: 8px 6px !important;
        }
        .field-price-matrix .ant-input {
          border: 1px solid ${token.colorBorder};
          border-radius: 4px;
          height: 26px;
        }
        .field-price-matrix .ant-input:focus {
          border-color: ${token.colorPrimary};
        }
        
        /* Consistent zebra striping - only white and gray */
        
        /* Gray zebra columns */
        .field-price-matrix .tier-zebra {
          background-color: ${token.colorFillAlter} !important;
        }
        .field-price-matrix .tier-zebra.ant-table-cell {
          background-color: ${token.colorFillAlter} !important;
        }
        .field-price-matrix .ant-table-thead > tr > th.tier-zebra {
          background-color: ${token.colorFillAlter} !important;
        }
        .field-price-matrix .ant-table-tbody > tr:hover > td.tier-zebra {
          background-color: ${token.colorFillAlter} !important;
          filter: brightness(0.98);
        }
        
        /* White non-zebra columns */
        .field-price-matrix .tier-group:not(.tier-zebra) {
          background-color: #ffffff !important;
        }
        .field-price-matrix .tier-group:not(.tier-zebra).ant-table-cell {
          background-color: #ffffff !important;
        }
        .field-price-matrix .ant-table-thead > tr > th.tier-group:not(.tier-zebra) {
          background-color: #ffffff !important;
        }
        .field-price-matrix .tier-current:not(.tier-zebra) {
          background-color: #ffffff !important;
        }
        .field-price-matrix .tier-current:not(.tier-zebra).ant-table-cell {
          background-color: #ffffff !important;
        }
        .field-price-matrix .ant-table-thead > tr > th.tier-current:not(.tier-zebra) {
          background-color: #ffffff !important;
        }
        .field-price-matrix .tier-new:not(.tier-zebra) {
          background-color: #ffffff !important;
        }
        .field-price-matrix .tier-new:not(.tier-zebra).ant-table-cell {
          background-color: #ffffff !important;
        }
        .field-price-matrix .ant-table-thead > tr > th.tier-new:not(.tier-zebra) {
          background-color: #ffffff !important;
        }
        .field-price-matrix .ant-table-tbody > tr:hover > td:not(.tier-zebra) {
          background-color: #ffffff !important;
          filter: brightness(0.98);
        }
      `}</style>
    </div>
  );
};

export default FieldPriceMatrix;
