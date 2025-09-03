import React, { useMemo } from 'react';
import { Table, Typography, theme, Space } from 'antd';
import type { PricePoint } from '../../utils/types';
import { formatColumnTitles, formatValidityRange } from '../../utils/formatters';
import InfoPopover from '../shared/InfoPopover';
import type { ColumnsType } from 'antd/es/table';

const { Text, Title } = Typography;

interface PivotTableProps {
  pricePoints: PricePoint[];
  validityFilter?: string | null;
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

interface PivotTableData {
  seatRangeKey: string;
  seatRangeDisplay: string;
  tier: string;
  [key: string]: any; // For currency-tier combinations
}

const PivotTable: React.FC<PivotTableProps> = ({ 
  pricePoints,
  validityFilter,
}) => {
  const { token } = theme.useToken();

  // Group price points by validity period when "All periods" is selected
  const validityGroupedData = useMemo(() => {
    if (validityFilter !== 'All periods') {
      // Single period - return as single group
      return [{
        validityPeriod: validityFilter || 'Current',
        pricePoints: pricePoints
      }];
    }

    // Multiple periods - group by validity period
    const groups: Record<string, PricePoint[]> = {};
    pricePoints.forEach(pp => {
      const period = formatValidityRange(pp.validFrom, pp.validTo);
      if (!groups[period]) {
        groups[period] = [];
      }
      groups[period].push(pp);
    });

    // Convert to array and sort by period (newest first)
    return Object.entries(groups)
      .map(([period, points]) => ({ validityPeriod: period, pricePoints: points }))
      .sort((a, b) => {
        // Sort by validity period - newest first
        // "Present" should come first, then dates in descending order
        if (a.validityPeriod === 'Present') return -1;
        if (b.validityPeriod === 'Present') return 1;
        
        // Parse dates and sort newest first
        const parseDate = (period: string) => {
          const match = period.match(/(\w+ \d+, \d+)/);
          return match ? new Date(match[1]) : new Date(0);
        };
        
        return parseDate(b.validityPeriod).getTime() - parseDate(a.validityPeriod).getTime();
      });
  }, [pricePoints, validityFilter]);

  // Transform price points into pivot structure for a single validity period
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
    currencies.forEach(currency => {
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
            <div style={{ textAlign: 'center' }}>
              {tierDisplay}
            </div>
          ),
          dataIndex: `${currency}-${tier}`,
          key: `${currency}-${tier}`,
          width: 100,
          align: 'right' as const,
          render: (_: any, record: PivotTableData) => {
            const pricePoint = record[`${currency}-${tier}`];
            if (!pricePoint) {
              return (
                <Text style={{ 
                  color: token.colorTextTertiary,
                  fontSize: '12px'
                }}>-</Text>
              );
            }

            return (
              <InfoPopover 
                content={`${currency} ${formatAmount(pricePoint)} - ${tier} (${pricePoint.status})`}
                placement="top"
              >
                <Text style={{ 
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: '12px',
                  color: pricePoint.status === 'Active' ? token.colorText : token.colorTextSecondary,
                  cursor: 'help'
                }}>
                  {formatAmount(pricePoint)}
                </Text>
              </InfoPopover>
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
                fontSize: '13px'
              }}>
                {currency}
              </Text>
            </InfoPopover>
          </div>
        ),
        key: currency,
        children: tierColumns,
        className: 'pivot-currency-column',
        align: 'center' as const,
      });
    });

    return formatColumnTitles(cols);
  };

  // Render single table for a validity period
  const renderPivotTable = (periodData: { validityPeriod: string; pricePoints: PricePoint[] }, index: number) => {
    const pivotData = createPivotData(periodData.pricePoints);
    const columns = createColumns(pivotData.currencies, pivotData.tiers);
    
    return (
      <div key={`period-${index}`}>
        {validityFilter === 'All periods' && (
          <Title 
            level={3} 
            style={{ 
              fontSize: token.fontSizeHeading3,
              marginBottom: '16px',
              marginTop: index === 0 ? '16px' : '32px',
              fontWeight: 500,
            }}
          >
            {periodData.validityPeriod}
          </Title>
        )}
        <Table
          size="middle"
          columns={columns}
          dataSource={pivotData.pivotRows}
          rowKey={(record) => `${periodData.validityPeriod}-${record.seatRangeKey}-${record.tier}`}
          pagination={false}
          scroll={{ x: 'max-content' }}
          bordered
          className="pivot-table"
          tableLayout="fixed"
        />
      </div>
    );
  };

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
      `}</style>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {validityGroupedData.map((periodData, index) => renderPivotTable(periodData, index))}
      </Space>
    </div>
  );
};

export default PivotTable;
