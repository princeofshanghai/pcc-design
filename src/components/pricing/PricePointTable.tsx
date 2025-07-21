import React, { useMemo } from 'react';
import { Table, Space, Typography, theme } from 'antd';
import type { PricePoint } from '../../utils/types';
import { toSentenceCase } from '../../utils/formatters';
import CountTag from '../attributes/CountTag';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface PricePointTableProps {
  pricePoints: PricePoint[];
  groupedPricePoints?: Record<string, PricePoint[]> | null;
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

  // If no exchange rate is available, we can't calculate the equivalent
  if (!pricePoint.exchangeRate) {
    return null;
  }

  // Convert the current price point to USD using exchange rate
  // exchangeRate represents how many units of the currency = 1 USD
  const usdAmount = pricePoint.amount / pricePoint.exchangeRate;
  
  // Calculate percentage compared to USD price point
  const percentage = (usdAmount / usdPricePoint.amount) * 100;
  
  return percentage;
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

const PricePointTable: React.FC<PricePointTableProps> = ({ 
  pricePoints, 
  groupedPricePoints, 
}) => {
  const { token } = theme.useToken();

  // Find USD price point for calculations
  const usdPricePoint = useMemo(() => {
    const allPoints = groupedPricePoints 
      ? Object.values(groupedPricePoints).flat()
      : pricePoints;
    return allPoints.find(point => point.currencyCode === 'USD');
  }, [pricePoints, groupedPricePoints]);

  // Table columns
  const columns: ColumnsType<any> = [
    {
      title: toSentenceCase('Currency'),
      dataIndex: 'currencyCode',
      key: 'currencyCode',
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
    {
      title: toSentenceCase('Amount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return formatAmount(record);
      },
    },
    // Only show USD Equivalent column if USD price point exists
    ...(usdPricePoint ? [{
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
    }] : []),
  ];

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
                      <Space>
                        <Text style={{ fontSize: token.fontSizeHeading3, fontWeight: 500 }}>{title}</Text>
                        <CountTag count={count} />
                      </Space>
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