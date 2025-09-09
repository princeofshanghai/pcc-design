import React, { useState, useMemo } from 'react';
import { Table, Input, Typography, theme, Space, DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import InfoPopover from '../../shared/InfoPopover';

const { Text } = Typography;

interface SimplePriceTableProps {
  selectedContext: {
    channel: string;
    billingCycle: string;
    priceGroupAction: string | null; // 'create' or 'update'
    existingPriceGroup: any | null; // Selected existing price group for updates
    lixKey?: string;
    lixTreatment?: string;
  };
  product: any;
  onPriceChange?: (currency: string, newPrice: string | null) => void;
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
  onPriceChange
}) => {
  const { token } = theme.useToken();
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [undoState, setUndoState] = useState<Record<string, string> | null>(null);
  
  // Validity date state
  const [validityStartDate, setValidityStartDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [validityEndDate, setValidityEndDate] = useState<dayjs.Dayjs | null>(null);

  // Extract real data from product for non-Field channels
  const { currencies, priceData } = useMemo(() => {
    let sourcePriceGroup = null;
    let shouldIncludePriceData = false;

    if (selectedContext.priceGroupAction === 'update' && selectedContext.existingPriceGroup) {
      // Updating existing price group: use the selected price group's data
      sourcePriceGroup = selectedContext.existingPriceGroup;
      shouldIncludePriceData = true;
    } else if (selectedContext.priceGroupAction === 'create') {
      // Creating new price group: find ANY existing price group with same channel to extract currency structure
      const anySimilarChannelSku = product?.skus?.find((sku: any) => sku.salesChannel === selectedContext.channel);
      if (anySimilarChannelSku?.priceGroup) {
        sourcePriceGroup = anySimilarChannelSku.priceGroup;
        shouldIncludePriceData = false; // Structure only, no current prices
      }
    }

    if (!sourcePriceGroup?.pricePoints) {
      // Return all currencies but with no price data for completely new scenarios
      const allCurrencies = [
        'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'SGD', 'HKD', 'CNY', 'INR',
        'KRW', 'THB', 'MXN', 'BRL', 'CHF', 'NOK', 'SEK', 'DKK', 'NZD', 'ZAR',
        'PLN', 'CZK', 'HUF', 'TRY', 'ILS', 'RUB', 'AED', 'SAR', 'QAR', 'KWD',
        'BHD', 'OMR', 'JOD', 'EGP', 'MAD', 'TND', 'DZD', 'NGN', 'KES', 'GHS',
        'MUR', 'BWP', 'NAD', 'ZMW', 'UGX', 'TZS', 'RWF', 'ETB', 'CLP', 'PEN',
        'COP', 'UYU', 'PYG', 'BOB', 'ARS', 'MYR', 'IDR', 'PHP', 'VND', 'TWD'
      ];
      
      return { currencies: allCurrencies, priceData: {} };
    }

    const pricePoints = sourcePriceGroup.pricePoints;

    // Find the latest validity range
    const latestValidityDate = Math.max(...pricePoints
      .map((pp: any) => pp.validFrom ? new Date(pp.validFrom).getTime() : 0)
      .filter((time: number) => time > 0)
    );
    
    const currentPricePoints = pricePoints.filter((pp: any) => {
      const validFrom = pp.validFrom ? new Date(pp.validFrom).getTime() : 0;
      return validFrom === latestValidityDate;
    });

    // Extract unique currencies from the price points
    const uniqueCurrencies = [...new Set(currentPricePoints.map((pp: any) => String(pp.currencyCode)))];
    
    // Sort currencies (prioritize main ones, then alphabetical)
    const currencyOrder = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD', 'HKD', 'CNY', 'INR', 'JPY'];
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

    // Build price data lookup: currency -> price
    // For non-Field channels, there's typically only one price per currency (no tiers/seat ranges)
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
      currencies: sortedCurrencies as string[],
      priceData: priceDataLookup
    };
  }, [product, selectedContext.channel, selectedContext.billingCycle, selectedContext.priceGroupAction, selectedContext.existingPriceGroup]);

  // Extract table data with real pricing information
  const tableData = useMemo((): PriceTableData[] => {
    return currencies.map(currency => {
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
  }, [selectedContext, priceInputs, currencies, priceData]);

  // Check if all prices are new (no current prices exist)
  const allPricesAreNew = useMemo(() => {
    return tableData.every(record => record.currentPrice === null);
  }, [tableData]);


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
  const columns: ColumnsType<PriceTableData> = [
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      width: 100,
      fixed: 'left',
      className: 'table-col-first',
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
      title: 'Current Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      width: 120,
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
            color: token.colorText // Use normal text color for better readability
          }}>
            {formatCurrencyAmount(price, record.currency)}
          </Text>
        );
      },
    }]),
    {
      title: 'New Price',
      dataIndex: 'newPrice',
      key: 'newPrice',
      width: 140,
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
      width: 120,
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

        return (
          <Text style={{ 
            color,
            fontSize: '13px',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 500,
            textAlign: 'left' // Left align change indicators
          }}>
            {sign}{percentage.toFixed(1)}% {/* Remove arrows and amount, just show percentage */}
          </Text>
        );
      },
    }])
  ];

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

        {/* Dynamic context text above table */}
        <Text style={{ 
          fontSize: token.fontSizeHeading4,
          color: token.colorTextSecondary
        }}>
          Showing {selectedContext.billingCycle.toLowerCase()} prices
        </Text>
        
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
        .simple-price-table .table-col-first {
          background-color: ${token.colorFillAlter} !important;
        }
        .simple-price-table .ant-input {
          border: 1px solid ${token.colorBorder};
          border-radius: 4px;
        }
        .simple-price-table .ant-input:focus {
          border-color: ${token.colorPrimary};
          box-shadow: 0 0 0 2px ${token.colorPrimary}1a;
        }
      `}</style>
    </div>
  );
};

export default SimplePriceTable;
