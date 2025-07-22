import React, { useMemo } from 'react';
import { Table, Typography, theme } from 'antd';
import type { PricePoint } from '../../utils/types';
import type { ColumnVisibility, ColumnOrder } from '../../utils/types';
import { toSentenceCase, formatEffectiveDateRange } from '../../utils/formatters';
import GroupHeader from '../shared/GroupHeader';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface PricePointTableProps {
  pricePoints: PricePoint[];
  groupedPricePoints?: Record<string, PricePoint[]> | null;
  visibleColumns?: ColumnVisibility;
  columnOrder?: ColumnOrder;
}

type TableRow = PricePoint | {
  isGroupHeader: true;
  key: string;
  title: string;
  count: number;
};

/**
 * A list of currencies that should not have decimal places in their display.
 * Based on business context and ISO 4217 currency standards.
 */
const zeroDecimalCurrencies = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
  'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
]);

/**
 * Core currencies that are actively managed and commonly used.
 * Based on your business documentation showing core vs longtail currencies.
 */
const coreCurrencies = new Set([
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SGD', 'HKD', 'CNY', 'INR',
  'DKK', 'NOK', 'SEK', 'BRL', 'NZD', 'ZAR', 'AED', 'PLN', 'SAR', 'MXN', 'EGP', 'TRY'
]);

/**
 * Determines if a currency is core or long tail
 * @param currencyCode - The currency code to check
 * @returns "Core" or "Long tail"
 */
const getCurrencyType = (currencyCode: string): string => {
  return coreCurrencies.has(currencyCode) ? 'Core' : 'Long tail';
};

/**
 * Formats just the amount portion of a price point (without currency code).
 * @param pricePoint - The price point object to format.
 * @returns A formatted amount string.
 */
const formatAmount = (pricePoint: PricePoint): string => {
  if (zeroDecimalCurrencies.has(pricePoint.currencyCode)) {
    // No decimals for specific currencies
    return Math.round(pricePoint.amount).toString();
  }
  // Default to 2 decimal places for all other currencies
  return pricePoint.amount.toFixed(2);
};

/**
 * Calculates the USD equivalent percentage for a price point.
 * @param pricePoint - The price point to calculate for.
 * @param usdPricePoint - The USD price point to compare against.
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
    // Convert the current price point to USD using exchange rate
    // exchangeRate represents how many units of the currency = 1 USD
    const usdAmount = pricePoint.amount / pricePoint.exchangeRate;
    
    // Calculate percentage compared to USD price point
    const percentage = (usdAmount / usdPricePoint.amount) * 100;
    
    return percentage;
  }

  // Fallback: If no exchange rate available, use approximate rates for common currencies
  const approximateRates: Record<string, number> = {
    'EUR': 0.85,
    'GBP': 0.75,
    'CAD': 1.35,
    'AUD': 1.45,
    'CHF': 0.90,
    'JPY': 110.0,
    'DKK': 6.85,
    'NOK': 9.90,
    'SEK': 12.60,
    'HKD': 7.85,
    'SGD': 1.35,
    'BRL': 1.85,
    'NZD': 1.60,
    'INR': 83.0,
    'ZAR': 18.5,
    'AED': 3.67,
    'PLN': 4.15,
    'SAR': 3.75,
    'MXN': 17.5,
    'EGP': 31.0,
    'TRY': 31.5,
    // Add more common currencies as needed
    'KRW': 1300.0,
    'VND': 24000.0,
    'THB': 35.0,
    'MYR': 4.6,
    'PHP': 56.0,
  };

  const approxRate = approximateRates[pricePoint.currencyCode];
  if (approxRate) {
    // Use approximate rate for calculation
    const usdAmount = pricePoint.amount / approxRate;
    const percentage = (usdAmount / usdPricePoint.amount) * 100;
    return percentage;
  }

  // If no exchange rate or approximate rate available, we can't calculate
  return null;
};

/**
 * Formats the USD equivalent percentage for display.
 * @param percentage - The percentage value.
 * @returns A formatted percentage string.
 */
const formatUsdEquivalent = (percentage: number | null): string => {
  if (percentage === null) return '';
  if (percentage === 100) return '100%';
  
  // Show 1 decimal place for non-100% values
  return `${percentage.toFixed(1)}%`;
};

/**
 * Determines the "common" dates for this price point group for inheritance detection
 */
const getCommonDates = (pricePoints: PricePoint[]): { startDate: string; endDate?: string } => {
  if (!pricePoints || pricePoints.length === 0) return { startDate: '' };

  // Count frequency of start dates
  const startDateCounts: Record<string, number> = {};
  const endDateCounts: Record<string, number> = {};
  
  pricePoints.forEach(point => {
    const startDate = point.startDate || '';
    const endDate = point.endDate || '';
    
    startDateCounts[startDate] = (startDateCounts[startDate] || 0) + 1;
    endDateCounts[endDate] = (endDateCounts[endDate] || 0) + 1;
  });

  // Find most common dates
  const mostCommonStartDate = Object.entries(startDateCounts).reduce((prev, current) => 
    current[1] > prev[1] ? current : prev
  )[0];
  
  const mostCommonEndDate = Object.entries(endDateCounts).reduce((prev, current) => 
    current[1] > prev[1] ? current : prev
  )[0];

  return { 
    startDate: mostCommonStartDate,
    endDate: mostCommonEndDate || undefined
  };
};

const PricePointTable: React.FC<PricePointTableProps> = ({ 
  pricePoints, 
  groupedPricePoints,
  visibleColumns = {},
  columnOrder = ['currency', 'currencyType', 'amount', 'usdEquivalent', 'effectiveDate'],
}) => {
  const { token } = theme.useToken();

  // Find USD price point for calculations
  const usdPricePoint = useMemo(() => {
    const allPoints = groupedPricePoints 
      ? Object.values(groupedPricePoints).flat()
      : pricePoints;
    return allPoints.find(point => point.currencyCode === 'USD');
  }, [pricePoints, groupedPricePoints]);

  // Get common dates for inheritance detection
  const commonDates = useMemo(() => {
    const allPoints = groupedPricePoints 
      ? Object.values(groupedPricePoints).flat()
      : pricePoints;
    return getCommonDates(allPoints);
  }, [pricePoints, groupedPricePoints]);

  // Check if USD Equivalent column should be visible
  const showUsdEquivalent = visibleColumns.usdEquivalent !== false && usdPricePoint;

  // Define all possible columns
  const allColumns: Record<string, any> = {
    currency: {
      title: toSentenceCase('Currency'),
      dataIndex: 'currencyCode',
      key: 'currency',
      width: 160,
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return (
          <div>
            <Text style={{ fontWeight: 500 }}>{record.currencyCode}</Text>
          </div>
        );
      },
      className: 'table-col-first',
    },
    currencyType: visibleColumns.currencyType === true ? {
      title: 'Currency Type',
      dataIndex: 'currencyCode',
      key: 'currencyType',
      width: 120,
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return (
          <Text style={{ fontWeight: 500 }}>{getCurrencyType(record.currencyCode)}</Text>
        );
      },
    } : null,
    amount: {
      title: toSentenceCase('Amount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return formatAmount(record);
      },
    },
    usdEquivalent: showUsdEquivalent ? {
      title: 'USD Equivalent',
      key: 'usdEquivalent',
      width: 140,
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        const percentage = calculateUsdEquivalent(record, usdPricePoint);
        return (
          <Text style={{ color: percentage === 100 ? token.colorTextSecondary : token.colorText }}>
            {formatUsdEquivalent(percentage)}
          </Text>
        );
      },
    } : null,
    effectiveDate: visibleColumns.effectiveDate !== false ? {
      title: 'Effective Date',
      key: 'effectiveDate',
      width: 180,
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        
        // Check if this price point's dates match the common dates (inherited)
        const isInherited = (
          record.startDate === commonDates.startDate && 
          (record.endDate || '') === (commonDates.endDate || '')
        );
        
        const effectiveDateText = formatEffectiveDateRange(record.startDate, record.endDate);
        
        return (
          <Text style={{ 
            color: isInherited ? token.colorTextSecondary : token.colorText 
          }}>
            {effectiveDateText}
          </Text>
        );
      },
    } : null,
  };

  // Build columns in the specified order, filtering out hidden/null columns
  const columns: ColumnsType<any> = columnOrder
    .map(key => allColumns[key])
    .filter(Boolean);

  // Prepare data source
  const dataSource: TableRow[] = useMemo(() => {
    if (groupedPricePoints) {
      // Grouped data
      const result: TableRow[] = [];
      Object.entries(groupedPricePoints).forEach(([groupTitle, points]) => {
        result.push({
          isGroupHeader: true,
          key: `header-${groupTitle}`,
          title: groupTitle,
          count: points.length,
        });
        result.push(...points);
      });
      return result;
    } else {
      // Ungrouped data
      return pricePoints;
    }
  }, [pricePoints, groupedPricePoints]);

  return (
    <div className="content-panel">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={record => ('isGroupHeader' in record ? record.key : `${record.currencyCode}-${record.amount}`)}
        pagination={false}
        size="small"
        rowClassName={(record) => ('isGroupHeader' in record ? 'ant-table-row-group-header' : '')}
        components={{
          body: {
            row: (props: any) => {
              if (props.children[0]?.props?.record?.isGroupHeader) {
                const { title, count } = props.children[0].props.record;
                return (
                  <tr {...props} className="ant-table-row-group-header">
                    <td colSpan={columns.length} style={{ padding: '12px 16px', backgroundColor: '#fafafa' }}>
                      <GroupHeader 
                        title={title}
                        count={count}
                        contextType="currencies"
                      />
                    </td>
                  </tr>
                );
              }
              return <tr {...props} />;
            },
          },
        }}
      />
    </div>
  );
};

export default PricePointTable; 