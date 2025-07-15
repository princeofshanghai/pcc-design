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

const PricePointTable: React.FC<PricePointTableProps> = ({ 
  pricePoints, 
  groupedPricePoints, 
}) => {
  const { token } = theme.useToken();

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