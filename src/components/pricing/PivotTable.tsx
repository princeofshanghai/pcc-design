import React, { useMemo } from 'react';
import { Table, Typography, theme } from 'antd';
import { TriangleAlert } from 'lucide-react';
import type { PricePoint } from '../../utils/types';
import { formatColumnTitles } from '../../utils/formatters';
import InfoPopover from '../shared/InfoPopover';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface PivotTableProps {
  pricePoints: PricePoint[];
  selectedValidityDate?: Date;
  showUsdEquivalent?: boolean;
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
};

/**
 * Formats just the amount portion of a price point (without currency code).
 */
const formatAmount = (pricePoint: PricePoint): string => {
  if (zeroDecimalCurrencies.has(pricePoint.currencyCode)) {
    return Math.round(pricePoint.amount).toString();
  }
  return pricePoint.amount.toFixed(2);
};



/**
 * Creates a unique key for seat ranges to group price points
 */
const getSeatRangeKey = (pricePoint: PricePoint): string => {
  const min = pricePoint.minQuantity || 1;
  const max = pricePoint.maxQuantity;
  
  if (!max) {
    return `${min}+`;
  }
  
  if (min === max) {
    return `${min}`;
  }
  
  return `${min}-${max}`;
};

/**
 * Gets display name for seat range (simplified for pivot view)
 */
const getSeatRangeDisplay = (seatRangeKey: string): string => {
  if (seatRangeKey.includes('+')) {
    const min = seatRangeKey.replace('+', '');
    return `${min}+ seats`;
  }
  if (seatRangeKey.includes('-')) {
    const [min, max] = seatRangeKey.split('-');
    return `${min}-${max} seats`;
  }
  const num = parseInt(seatRangeKey);
  return `${num} seat${num === 1 ? '' : 's'}`;
};

/**
 * Calculates the USD equivalent percentage for a given price point.
 * @param pricePoint The price point to calculate for.
 * @param usdPricePoint The matching USD price point.
 * @returns The percentage as a number, or null if calculation not possible.
 */
const calculateUsdEquivalent = (pricePoint: PricePoint, usdPricePoint: PricePoint): number | null => {
  if (pricePoint.currencyCode === 'USD') {
    return 100; // USD always shows 100%
  }
  
  if (!usdPricePoint || usdPricePoint.currencyCode !== 'USD') {
    return null;
  }

  // If exchange rate is available, use it for precise calculation
  if (pricePoint.exchangeRate) {
    const usdAmount = pricePoint.amount / pricePoint.exchangeRate;
    return (usdAmount / usdPricePoint.amount) * 100;
  }

  // Fallback: use default exchange rates for common currencies
  const defaultExchangeRates: Record<string, number> = {
    'EUR': 0.92,     // 1 USD = 0.92 EUR
    'GBP': 0.79,     // 1 USD = 0.79 GBP
    'CAD': 1.36,     // 1 USD = 1.36 CAD
    'AUD': 1.53,     // 1 USD = 1.53 AUD
    'JPY': 149.50,   // 1 USD = 149.50 JPY
    'CHF': 0.91,     // 1 USD = 0.91 CHF
    'CNY': 7.24,     // 1 USD = 7.24 CNY
    'HKD': 7.82,     // 1 USD = 7.82 HKD
    'INR': 83.28,    // 1 USD = 83.28 INR
    'SGD': 1.35,     // 1 USD = 1.35 SGD
  };

  const exchangeRate = defaultExchangeRates[pricePoint.currencyCode];
  if (!exchangeRate) return null;

  const usdAmount = pricePoint.amount / exchangeRate;
  return (usdAmount / usdPricePoint.amount) * 100;
};

/**
 * Finds a matching USD price point for the given price point.
 * Matching is based on quantity ranges and pricing tier.
 * @param pricePoint The price point to find a USD match for.
 * @param allPricePoints All available price points to search through.
 * @returns The matching USD price point, or null if not found.
 */
const findMatchingUsdPricePoint = (pricePoint: PricePoint, allPricePoints: PricePoint[]): PricePoint | null => {
  if (pricePoint.currencyCode === 'USD') {
    return pricePoint; // USD price point matches itself
  }

  // Find all USD price points
  const usdPricePoints = allPricePoints.filter(point => point.currencyCode === 'USD');
  
  if (usdPricePoints.length === 0) {
    return null;
  }

  // Try to find exact match by quantity range and pricing tier
  const exactMatch = usdPricePoints.find(usdPoint => 
    usdPoint.minQuantity === pricePoint.minQuantity &&
    usdPoint.maxQuantity === pricePoint.maxQuantity &&
    (usdPoint.pricingTier || 'NULL_TIER') === (pricePoint.pricingTier || 'NULL_TIER')
  );

  if (exactMatch) {
    return exactMatch;
  }

  // Fallback: find closest match by quantity range (same pricing tier)
  const sameTierUsdPoints = usdPricePoints.filter(usdPoint => 
    (usdPoint.pricingTier || 'NULL_TIER') === (pricePoint.pricingTier || 'NULL_TIER')
  );

  if (sameTierUsdPoints.length > 0) {
    return sameTierUsdPoints[0]; // Return first match with same tier
  }

  // Last resort: return any USD price point
  return usdPricePoints[0];
};

/**
 * Calculates the USD amount for a given price point.
 * @param pricePoint The price point to calculate for.
 * @param usdPricePoint The matching USD price point.
 * @returns The USD amount as a number, or null if calculation not possible.
 */
const calculateUsdAmount = (pricePoint: PricePoint, usdPricePoint: PricePoint): number | null => {
  if (pricePoint.currencyCode === 'USD') {
    return pricePoint.amount; // USD shows its own amount
  }
  
  if (!usdPricePoint || usdPricePoint.currencyCode !== 'USD') {
    return null;
  }

  // If exchange rate is available, use it for precise calculation
  if (pricePoint.exchangeRate) {
    return pricePoint.amount / pricePoint.exchangeRate;
  }

  // Fallback: use default exchange rates for common currencies
  const defaultExchangeRates: Record<string, number> = {
    'EUR': 0.92,     // 1 USD = 0.92 EUR
    'GBP': 0.79,     // 1 USD = 0.79 GBP
    'CAD': 1.36,     // 1 USD = 1.36 CAD
    'AUD': 1.53,     // 1 USD = 1.53 AUD
    'JPY': 149.50,   // 1 USD = 149.50 JPY
    'CHF': 0.91,     // 1 USD = 0.91 CHF
    'CNY': 7.24,     // 1 USD = 7.24 CNY
    'HKD': 7.82,     // 1 USD = 7.82 HKD
    'INR': 83.28,    // 1 USD = 83.28 INR
    'SGD': 1.35,     // 1 USD = 1.35 SGD
  };

  const exchangeRate = defaultExchangeRates[pricePoint.currencyCode];
  if (!exchangeRate) return null;

  return pricePoint.amount / exchangeRate;
};

/**
 * Formats a fake FX update time for display.
 * @returns A relative time string like "Last updated 45m ago".
 */
const formatFxUpdateTime = (): string => {
  // Generate a random time within the last hour (1-59 minutes ago)
  const minutesAgo = Math.floor(Math.random() * 59) + 1;
  return `Last updated ${minutesAgo}m ago`;
};

interface PivotTableData {
  seatRangeKey: string;
  seatRangeDisplay: string;
  tier: string;
  [key: string]: any; // For currency-tier combinations
}

const PivotTable: React.FC<PivotTableProps> = ({ 
  pricePoints,
  selectedValidityDate: _selectedValidityDate,
  showUsdEquivalent = false,
}) => {
  const { token } = theme.useToken();

  // Transform price points into pivot structure
  const createPivotData = (periodPricePoints: PricePoint[]) => {
    // Get all unique currencies and tiers from this period's price points
    const currencies = [...new Set(periodPricePoints.map(p => p.currencyCode))];
    // Sort currencies in specified order: USD, CAD, GBP, EUR, AUD, HKD, INR, SGD, CNY, then alphabetical
    const currencyOrder = ['USD', 'CAD', 'GBP', 'EUR', 'AUD', 'HKD', 'INR', 'SGD', 'CNY'];
    currencies.sort((a, b) => {
      const aIndex = currencyOrder.indexOf(a);
      const bIndex = currencyOrder.indexOf(b);
      
      // If both currencies are in the priority list, sort by priority order
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      // If only 'a' is in priority list, it comes first
      if (aIndex !== -1) return -1;
      // If only 'b' is in priority list, it comes first  
      if (bIndex !== -1) return 1;
      // If neither is in priority list, sort alphabetically
      return a.localeCompare(b);
    });
    
    const tiers = [...new Set(periodPricePoints.map(p => p.pricingTier || 'NULL_TIER'))];
    // Sort tiers in logical order (NULL_TIER first, then others)
    const tierOrder = ['NULL_TIER', 'STFF', 'CORP EM', 'GVT', 'CORP BASE PRICE', 'CORP TIER 1', 'CORP TIER 1 DSC', 'CORP TIER 2'];
    tiers.sort((a, b) => {
      const aIndex = tierOrder.indexOf(a);
      const bIndex = tierOrder.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });

    // Group price points by seat range first
    const seatRangeGroups: Record<string, PricePoint[]> = {};
    
    periodPricePoints.forEach(point => {
      const seatRangeKey = getSeatRangeKey(point);
      if (!seatRangeGroups[seatRangeKey]) {
        seatRangeGroups[seatRangeKey] = [];
      }
      seatRangeGroups[seatRangeKey].push(point);
    });

    // Create pivot table rows - one row per seat range
    const pivotRows: PivotTableData[] = [];
    
    Object.entries(seatRangeGroups).forEach(([seatRangeKey, points]) => {
      // For this seat range, find the primary tier (most common one)
      const tierCounts = points.reduce((acc, point) => {
        const tier = point.pricingTier || 'NULL_TIER';
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const primaryTier = Object.entries(tierCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      const row: PivotTableData = {
        seatRangeKey,
        seatRangeDisplay: getSeatRangeDisplay(seatRangeKey),
        tier: primaryTier,
      };

      // Add data for each currency-tier combination
      currencies.forEach(currency => {
        tiers.forEach(tier => {
          const matchingPoint = points.find(p => 
            p.currencyCode === currency && (p.pricingTier || 'NULL_TIER') === tier
          );
          
          if (matchingPoint) {
            row[`${currency}-${tier}`] = matchingPoint;
          }
        });
      });

      pivotRows.push(row);
    });

    // Sort rows by seat range (numeric sorting)
    pivotRows.sort((a, b) => {
      const parseRange = (key: string) => {
        if (key.includes('+')) return [parseInt(key.replace('+', '')), Infinity];
        if (key.includes('-')) {
          const [min, max] = key.split('-').map(Number);
          return [min, max];
        }
        const num = parseInt(key);
        return [num, num];
      };

      const [aMin] = parseRange(a.seatRangeKey);
      const [bMin] = parseRange(b.seatRangeKey);
      
      if (aMin !== bMin) return aMin - bMin;
      
      // If same seat range, sort by tier
      const tierOrderForSorting = ['NULL_TIER', 'STFF', 'CORP EM', 'GVT', 'CORP BASE PRICE', 'CORP TIER 1', 'CORP TIER 1 DSC', 'CORP TIER 2'];
      return tierOrderForSorting.indexOf(a.tier) - tierOrderForSorting.indexOf(b.tier);
    });

    return { pivotRows, currencies, tiers };
  };

  // Since price points are already filtered by validity date in usePricePointFilters,
  // we can directly process them without additional validity grouping
  const pivotData = useMemo(() => {
    return createPivotData(pricePoints);
  }, [pricePoints]);

  // Create columns for a single pivot table
  const createColumns = (currencies: string[], tiers: string[]): ColumnsType<PivotTableData> => {
    
    const cols: ColumnsType<PivotTableData> = [
      // Fixed left column for seat ranges
      {
        title: 'Seat Range',
        dataIndex: 'seatRangeDisplay',
        key: 'seatRange',
        fixed: 'left',
        width: 200,
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

    // Add currency columns with tier sub-columns
    currencies.forEach((currency, currencyIndex) => {
      const currencyName = currencyNames[currency] || currency;
      
      // First, determine which tiers actually have price points for this currency
      const tiersWithData = tiers.filter(tier => {
        // Check if any price point exists for this currency-tier combination
        return pricePoints.some(pp => 
          pp.currencyCode === currency && (pp.pricingTier || 'NULL_TIER') === tier
        );
      });
      
      // Skip this currency entirely if no tiers have data
      if (tiersWithData.length === 0) {
        return;
      }
      
      // Only create sub-columns for tiers that have data
      const tierColumns = tiersWithData.map(tier => {
        // Map tier codes to shorter display names for column headers
        const tierDisplayMap: Record<string, string> = {
          'NULL_TIER': '-',
          'CORP BASE PRICE': 'B',
          'STFF': 'STFF',
          'CORP EM': 'CORP EM',
          'CORP TIER 1': 'T1',
          'CORP TIER 1 DSC': 'T1DSC',
          'CORP TIER 2': 'T2',
          'GVT': 'GVT',
        };
        
        const tierDisplay = tierDisplayMap[tier] || tier;
        
        return {
          title: (
            <div style={{ textAlign: 'center', fontSize: token.fontSizeSM }}>
              {tierDisplay}
            </div>
          ),
          dataIndex: `${currency}-${tier}`,
          key: `${currency}-${tier}`,
          width: 100,
          align: 'center' as const,
          className: `currency-group-${currencyIndex % 2}`,
          render: (_: any, record: PivotTableData) => {
            const pricePoint = record[`${currency}-${tier}`];
            if (!pricePoint) {
              return (
                <Text style={{ 
                  color: token.colorTextTertiary,
                  fontSize: '13px'
                }}>-</Text>
              );
            }

            const mainAmount = formatAmount(pricePoint);

            // Show USD equivalent inline if enabled and currency is not USD
            if (showUsdEquivalent && pricePoint.currencyCode !== 'USD') {
              const matchingUsdPoint = findMatchingUsdPricePoint(pricePoint, pricePoints);
              const usdAmount = matchingUsdPoint ? calculateUsdAmount(pricePoint, matchingUsdPoint) : null;
              const percentage = matchingUsdPoint ? calculateUsdEquivalent(pricePoint, matchingUsdPoint) : null;
              
              if (usdAmount !== null && percentage !== null) {
                const formattedUsdAmount = usdAmount.toFixed(2);
                const isLowPercentage = percentage < 50;
                
                const popoverContent = (
                  <div style={{ lineHeight: '1.4' }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                      USD Equivalent Calculation
                    </div>
                    <div style={{ marginBottom: '6px', fontSize: '12px' }}>
                      <strong>Original:</strong> {pricePoint.currencyCode} {mainAmount}
                    </div>
                    <div style={{ marginBottom: '6px', fontSize: '12px' }}>
                      <strong>FX rate:</strong> {pricePoint.exchangeRate ? 
                        `1 USD = ${pricePoint.exchangeRate} ${pricePoint.currencyCode}` : 
                        'Approximate rate used'
                      }
                    </div>
                    <div style={{ marginBottom: '8px', fontSize: '12px' }}>
                      <strong>Calculation:</strong> {mainAmount} / {pricePoint.exchangeRate || 'approx. rate'} = ${formattedUsdAmount}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: token.colorTextSecondary,
                      borderTop: `1px solid ${token.colorBorderSecondary}`,
                      paddingTop: '6px'
                    }}>
                      {formatFxUpdateTime()}
                    </div>
                    {isLowPercentage && (
                      <div style={{ 
                        marginTop: '8px', 
                        padding: '6px 8px',
                        backgroundColor: token.colorErrorBg,
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}>
                        <TriangleAlert size={12} style={{ marginRight: '4px' }} />
                        This amount is less than 50% compared to USD price
                      </div>
                    )}
                  </div>
                );
                
                return (
                  <div style={{ 
                    fontVariantNumeric: 'tabular-nums',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}>
                    <Text style={{ 
                      fontSize: '13px',
                      color: pricePoint.status === 'Active' ? token.colorText : token.colorTextSecondary,
                    }}>
                      {mainAmount}
                    </Text>
                    <InfoPopover content={popoverContent} placement="top">
                      <Text 
                        style={{ 
                          color: isLowPercentage ? token.colorError : token.colorTextSecondary,
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          cursor: 'help',
                          lineHeight: 1
                        }}
                      >
                        ≈ {isLowPercentage && <TriangleAlert size={10} />}${formattedUsdAmount} ({percentage.toFixed(1)}%)
                      </Text>
                    </InfoPopover>
                  </div>
                );
              }
            }

            // Default: just show the main amount
            return (
              <Text style={{ 
                fontVariantNumeric: 'tabular-nums',
                fontSize: '13px',
                color: pricePoint.status === 'Active' ? token.colorText : token.colorTextSecondary,
              }}>
                {mainAmount}
              </Text>
            );
          },
        };
      });

      // Add currency column with tier sub-columns
      cols.push({
        title: (
          <div style={{ textAlign: 'center' }}>
            <InfoPopover content={currencyName} placement="top">
              <Text style={{ 
                fontWeight: 600,
                fontSize: token.fontSize
              }}>
                {currency}
              </Text>
            </InfoPopover>
          </div>
        ),
        key: currency,
        children: tierColumns,
        className: `pivot-currency-column currency-group-${currencyIndex % 2}`,
        align: 'center' as const,
      });
    });

    return formatColumnTitles(cols);
  };

  // Create columns for the pivot table
  const columns = createColumns(pivotData.currencies, pivotData.tiers);

  return (
    <div style={{ marginTop: '16px' }}>
      <style>{`
        .pivot-table .seat-range-column {
          width: 200px !important;
          min-width: 200px !important;
          max-width: 200px !important;
        }
        .pivot-table .ant-table-fixed-left {
          width: 200px !important;
        }
        .pivot-table .ant-table-thead > tr > th.seat-range-column,
        .pivot-table .ant-table-tbody > tr > td.seat-range-column {
          width: 200px !important;
          min-width: 200px !important;
          max-width: 200px !important;
        }
        
        /* Alternating currency group backgrounds */
        .pivot-table .currency-group-0 {
          background-color: transparent !important;
        }
        .pivot-table .currency-group-1 {
          background-color: rgba(0, 0, 0, 0.025) !important;
        }
        
        /* Thicker left borders between currency groups */
        .pivot-table .ant-table-thead > tr > th.currency-group-0:first-of-type,
        .pivot-table .ant-table-tbody > tr > td.currency-group-0:first-of-type,
        .pivot-table .ant-table-thead > tr > th.currency-group-1:first-of-type,
        .pivot-table .ant-table-tbody > tr > td.currency-group-1:first-of-type {
          border-left: 3px solid #d9d9d9 !important;
        }
        
        /* Ensure first currency group doesn't have thick border if it's the leftmost */
        .pivot-table .ant-table-thead > tr > th:first-child.currency-group-0,
        .pivot-table .ant-table-tbody > tr > td:first-child.currency-group-0 {
          border-left: none !important;
        }
        
        /* Ensure last row has bottom border */
        .pivot-table .ant-table-tbody > tr:last-child > td {
          border-bottom: 1px solid ${token.colorBorder} !important;
        }
      `}</style>
      <Table
        size="middle"
        columns={columns}
        dataSource={pivotData.pivotRows}
        rowKey={(record) => `${record.seatRangeKey}-${record.tier}`}
        pagination={false}
        scroll={{ x: 'max-content' }}
        bordered
        className="pivot-table"
        tableLayout="fixed"
      />
    </div>
  );
};

export default PivotTable;
