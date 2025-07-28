import React, { useMemo, useState } from 'react';
import { Table, Typography, theme, Tooltip } from 'antd';
import type { PricePoint } from '../../utils/types';
import type { ColumnVisibility, ColumnOrder } from '../../utils/types';
import { toSentenceCase, formatValidityRange, formatColumnTitles } from '../../utils/formatters';
import { PRICE_POINT_COLUMNS } from '../../utils/tableConfigurations';
import GroupHeader from '../shared/GroupHeader';
import CopyableId from '../shared/CopyableId';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface PricePointTableProps {
  pricePoints: PricePoint[];
  groupedPricePoints?: Record<string, PricePoint[]> | null;
  visibleColumns?: ColumnVisibility;
  columnOrder?: ColumnOrder;
  sortOrder?: string;
}

type TableRow = PricePoint | {
  isGroupHeader: true;
  key: string;
  title: string;
  count: number;
  groupKey: string;
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
 * Finds the matching USD price point for a given price point based on quantity ranges.
 * @param pricePoint - The price point to find a USD match for.
 * @param allPricePoints - All price points in the price group.
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

  // If there's only one USD price point, use it
  if (usdPricePoints.length === 1) {
    return usdPricePoints[0];
  }

  // Try to find a USD price point with matching quantity ranges
  const matchingUsdPoint = usdPricePoints.find(usdPoint => {
    // Check if both price points have the same quantity range
    const sameMinQuantity = (pricePoint.minQuantity || null) === (usdPoint.minQuantity || null);
    const sameMaxQuantity = (pricePoint.maxQuantity || null) === (usdPoint.maxQuantity || null);
    
    return sameMinQuantity && sameMaxQuantity;
  });

  // If we found a matching quantity range, use it
  if (matchingUsdPoint) {
    return matchingUsdPoint;
  }

  // Fallback: if no exact match, try to find a USD point with overlapping range
  const overlappingUsdPoint = usdPricePoints.find(usdPoint => {
    const priceMin = pricePoint.minQuantity || 1;
    const priceMax = pricePoint.maxQuantity || Infinity;
    const usdMin = usdPoint.minQuantity || 1;
    const usdMax = usdPoint.maxQuantity || Infinity;
    
    // Check if ranges overlap
    return priceMin <= usdMax && priceMax >= usdMin;
  });

  if (overlappingUsdPoint) {
    return overlappingUsdPoint;
  }

  // Final fallback: use the first USD price point
  return usdPricePoints[0];
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
const getCommonDates = (pricePoints: PricePoint[]): { validFrom: string; validTo?: string } => {
  if (!pricePoints || pricePoints.length === 0) return { validFrom: '' };

  // Count frequency of valid from dates
  const validFromCounts: Record<string, number> = {};
  const validToCounts: Record<string, number> = {};
  
  pricePoints.forEach(point => {
    const validFrom = point.validFrom || '';
    const validTo = point.validTo || '';
    
    validFromCounts[validFrom] = (validFromCounts[validFrom] || 0) + 1;
    validToCounts[validTo] = (validToCounts[validTo] || 0) + 1;
  });

  // Find most common dates
  const mostCommonValidFrom = Object.entries(validFromCounts).reduce((prev, current) => 
    current[1] > prev[1] ? current : prev
  )[0];
  
  const mostCommonValidTo = Object.entries(validToCounts).reduce((prev, current) => 
    current[1] > prev[1] ? current : prev
  )[0];

  return { 
    validFrom: mostCommonValidFrom,
    validTo: mostCommonValidTo || undefined
  };
};

/**
 * Sorts price points based on the selected sort order
 */
const sortPricePoints = (points: PricePoint[], sortOrder: string, allPricePoints: PricePoint[]): PricePoint[] => {
  if (!sortOrder || sortOrder === 'None') {
    return points;
  }

  const sorted = [...points];
  
  switch (sortOrder) {
    case 'Currency (A-Z)':
      return sorted.sort((a, b) => a.currencyCode.localeCompare(b.currencyCode));
    
    case 'Currency (Z-A)':
      return sorted.sort((a, b) => b.currencyCode.localeCompare(a.currencyCode));
    
    case 'Amount (Low to high)':
      return sorted.sort((a, b) => a.amount - b.amount);
    
    case 'Amount (High to low)':
      return sorted.sort((a, b) => b.amount - a.amount);
    
    case 'USD equivalent (High to low)':
      return sorted.sort((a, b) => {
        const aUsdPoint = findMatchingUsdPricePoint(a, allPricePoints);
        const bUsdPoint = findMatchingUsdPricePoint(b, allPricePoints);
        const aEquiv = aUsdPoint ? calculateUsdEquivalent(a, aUsdPoint) || 0 : 0;
        const bEquiv = bUsdPoint ? calculateUsdEquivalent(b, bUsdPoint) || 0 : 0;
        return bEquiv - aEquiv;
      });
    
    case 'USD equivalent (Low to high)':
      return sorted.sort((a, b) => {
        const aUsdPoint = findMatchingUsdPricePoint(a, allPricePoints);
        const bUsdPoint = findMatchingUsdPricePoint(b, allPricePoints);
        const aEquiv = aUsdPoint ? calculateUsdEquivalent(a, aUsdPoint) || 0 : 0;
        const bEquiv = bUsdPoint ? calculateUsdEquivalent(b, bUsdPoint) || 0 : 0;
        return aEquiv - bEquiv;
      });
    
    case 'Category':
      return sorted.sort((a, b) => {
        const aType = getCurrencyType(a.currencyCode);
        const bType = getCurrencyType(b.currencyCode);
        
        // Core currencies first, then alphabetical within each group
        if (aType !== bType) {
          return aType === 'Core' ? -1 : 1;
        }
        return a.currencyCode.localeCompare(b.currencyCode);
      });
    
    case 'Validity (Earliest to latest)':
      return sorted.sort((a, b) => {
        const aDate = new Date(a.validFrom || '').getTime();
        const bDate = new Date(b.validFrom || '').getTime();
        return aDate - bDate;
      });
    
    case 'Validity (Latest to earliest)':
      return sorted.sort((a, b) => {
        const aDate = new Date(a.validFrom || '').getTime();
        const bDate = new Date(b.validFrom || '').getTime();
        return bDate - aDate;
      });
    
    default:
      return sorted;
  }
};

const PricePointTable: React.FC<PricePointTableProps> = ({ 
  pricePoints, 
  groupedPricePoints,
  visibleColumns = {},
  columnOrder = ['id', 'currency', 'amount', 'usdEquivalent', 'validity'],
  sortOrder = 'None',
}) => {
  const { token } = theme.useToken();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Create a helper to get column label from centralized config
  const getColumnLabel = (key: string): string => {
    const column = PRICE_POINT_COLUMNS.find(col => col.key === key);
    return column?.label || toSentenceCase(key);
  };

  // Get all price points for USD equivalent calculations
  const allPricePoints = useMemo(() => {
    return groupedPricePoints 
      ? Object.values(groupedPricePoints).flat()
      : pricePoints;
  }, [pricePoints, groupedPricePoints]);

  // Find USD price point for calculations (keeping for backward compatibility)
  const usdPricePoint = useMemo(() => {
    return allPricePoints.find(point => point.currencyCode === 'USD');
  }, [allPricePoints]);



  // Check if USD Equivalent column should be visible
  const showUsdEquivalent = visibleColumns.usdEquivalent !== false && usdPricePoint;

  // Define all possible columns
  const allColumns: Record<string, any> = {
    id: visibleColumns.id === true ? {
      title: getColumnLabel('id'),
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return (
          <CopyableId id={record.id || ''} size="small" />
        );
      },
    } : null,
    currency: {
      title: getColumnLabel('currency'),
      dataIndex: 'currencyCode',
      key: 'currency',
      width: 100,
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return (
          <div>
            <Text style={{ fontWeight: 500 }}>{record.currencyCode}</Text>
          </div>
        );
      },
      className: visibleColumns.id === true ? '' : 'table-col-first',
    },
    currencyType: visibleColumns.currencyType === true ? {
      title: getColumnLabel('currencyType'),
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
      title: getColumnLabel('amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return formatAmount(record);
      },
    },
    pricingRule: visibleColumns.pricingRule !== false ? {
      title: getColumnLabel('pricingRule'),
      dataIndex: 'pricingRule',
      key: 'pricingRule',
      width: 130,
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        
        const getPricingRuleTooltip = (rule: string): string => {
          switch (rule) {
            case 'NONE':
              return 'Flat rate pricing - same price regardless of quantity';
            case 'SLAB':
              return 'Slab pricing - different price per unit for different quantity ranges';
            case 'RANGE':
              return 'Range pricing - different total price for different quantity ranges';
            case 'BLOCK':
              return 'Block pricing - fixed price per block of units';
            default:
              return 'Pricing rule not specified';
          }
        };
        
        const formatPricingRule = (rule: string): string => {
          if (!rule || rule === 'NONE') return 'None';
          return rule.charAt(0).toUpperCase() + rule.slice(1).toLowerCase();
        };
        
        const rule = record.pricingRule || 'NONE';
        return (
          <Tooltip title={getPricingRuleTooltip(rule)}>
            <Text>{formatPricingRule(rule)}</Text>
          </Tooltip>
        );
      },
    } : null,
    quantityRange: visibleColumns.quantityRange !== false ? {
      title: getColumnLabel('quantityRange'),
      key: 'quantityRange',
      width: 140,
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        
        // Format quantity range based on min/max values
        const formatQuantityRange = (pricePoint: any): string => {
          if (!pricePoint.minQuantity && !pricePoint.maxQuantity) {
            return '-';
          }
          
          const min = pricePoint.minQuantity || 1;
          const max = pricePoint.maxQuantity;
          
          if (!max) {
            return `${min}+ seats`;
          }
          
          if (min === max) {
            return `${min} seat${min === 1 ? '' : 's'}`;
          }
          
          return `${min}-${max} seats`;
        };
        
        const getQuantityRangeTooltip = (pricePoint: any): string => {
          if (!pricePoint.minQuantity && !pricePoint.maxQuantity) {
            return 'No quantity restrictions apply';
          }
          
          if (pricePoint.pricingRule === 'SLAB') {
            return 'This price applies to the specified quantity range in a slab pricing structure';
          }
          
          return 'Price applies to this quantity range';
        };
        
        const rangeText = formatQuantityRange(record);
        return (
          <Tooltip title={getQuantityRangeTooltip(record)}>
            <Text>{rangeText}</Text>
          </Tooltip>
        );
      },
    } : null,
    usdEquivalent: showUsdEquivalent ? {
      title: getColumnLabel('usdEquivalent'),
      key: 'usdEquivalent',
      width: 120,
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        const matchingUsdPoint = findMatchingUsdPricePoint(record, allPricePoints);
        const percentage = matchingUsdPoint ? calculateUsdEquivalent(record, matchingUsdPoint) : null;
        return (
          <Text style={{ color: percentage === 100 ? token.colorTextSecondary : token.colorText }}>
            {formatUsdEquivalent(percentage)}
          </Text>
        );
      },
    } : null,
    validity: visibleColumns.validity !== false ? {
      title: getColumnLabel('validity'),
      key: 'validity',
      width: 180,
      render: (_: any, record: PricePoint) => {
        const commonDates = getCommonDates(pricePoints);
        
        // Check if this record's dates match the "common" dates (indicating inheritance)
        const isInherited = 
          record.validFrom === commonDates.validFrom &&
          (record.validTo || '') === (commonDates.validTo || '');

        const validityText = formatValidityRange(record.validFrom, record.validTo);

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ 
              color: isInherited ? token.colorTextTertiary : token.colorText
            }}>
              {validityText}
            </span>
            {isInherited && (
              <Tooltip title="Inherited from Price Group">
                <span style={{ 
                  color: token.colorTextTertiary, 
                  fontSize: '10px',
                  fontStyle: 'italic'
                }}>
                  (inherited)
                </span>
              </Tooltip>
            )}
          </div>
        );
      },
    } : undefined,
  };

  // Build columns in the specified order, filtering out hidden/null columns
  const columns: ColumnsType<any> = formatColumnTitles(
    columnOrder
      .map(key => allColumns[key])
      .filter(Boolean)
  );

  const handleGroupToggle = (groupKey: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(key => key !== groupKey)
        : [...prev, groupKey]
    );
  };

  // Prepare data source with sorting applied
  const dataSource: TableRow[] = useMemo(() => {
    if (groupedPricePoints) {
      // Grouped data - sort within each group
      const result: TableRow[] = [];
      Object.entries(groupedPricePoints).forEach(([groupTitle, points]) => {
        const sortedPoints = sortPricePoints(points, sortOrder, allPricePoints);
        result.push({
          isGroupHeader: true,
          key: `header-${groupTitle}`,
          title: groupTitle,
          count: sortedPoints.length,
          groupKey: groupTitle,
        });
        // Only add group items if the group is expanded
        if (expandedGroups.includes(groupTitle)) {
          result.push(...sortedPoints);
        }
      });
      return result;
    } else {
      // Ungrouped data - sort all points
      const sortedPoints = sortPricePoints(pricePoints, sortOrder, allPricePoints);
      return sortedPoints;
    }
  }, [pricePoints, groupedPricePoints, sortOrder, allPricePoints, expandedGroups]);

  return (
    <div className="content-panel">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={record => ('isGroupHeader' in record ? record.key : `${record.currencyCode}-${record.amount}`)}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowClassName={(record) => ('isGroupHeader' in record ? 'ant-table-row-group-header' : '')}
        components={{
          body: {
            row: (props: any) => {
              if (props.children[0]?.props?.record?.isGroupHeader) {
                const { title, count, groupKey } = props.children[0].props.record;
                const isExpanded = expandedGroups.includes(groupKey);
                return (
                  <tr {...props} className="ant-table-row-group-header">
                    <td colSpan={columns.length} style={{ padding: '12px 16px', backgroundColor: '#fafafa' }}>
                      <GroupHeader 
                        title={title}
                        count={count}
                        contextType="currencies"
                        isExpanded={isExpanded}
                        onToggle={() => handleGroupToggle(groupKey)}
                        isExpandable={true}
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