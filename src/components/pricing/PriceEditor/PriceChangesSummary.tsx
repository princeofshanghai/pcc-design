import React from 'react';
import { Typography, Space, Table, Card, theme, Tag } from 'antd';
import { AlertCircle } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface PriceChange {
  currency: string;
  currencyName: string;
  currentPrice: number | null;
  newPrice: number;
  change: {
    amount: number;
    percentage: number;
  };
  validity: string;
}

interface FieldPriceChange {
  currency: string;
  currencyName: string;
  seatRange: string;
  tier: string;
  currentPrice: number | null;
  newPrice: number;
  change: {
    amount: number;
    percentage: number;
  };
  validity: string;
}

interface PriceChangesSummaryProps {
  productName: string;
  isFieldChannel: boolean;
  changes: PriceChange[] | FieldPriceChange[];
  hasChanges: boolean;
}

/**
 * Formats currency amount with proper decimal places
 */
const formatCurrencyAmount = (amount: number, currencyCode: string): string => {
  const zeroDecimalCurrencies = new Set([
    'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
    'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
  ]);
  
  if (zeroDecimalCurrencies.has(currencyCode)) {
    return Math.round(amount).toLocaleString();
  }
  return amount.toFixed(2);
};

const PriceChangesSummary: React.FC<PriceChangesSummaryProps> = ({
  productName,
  isFieldChannel,
  changes,
  hasChanges
}) => {
  const { token } = theme.useToken();

  if (!hasChanges) {
    return (
      <div style={{ 
        padding: '32px',
        textAlign: 'center',
        background: token.colorFillAlter,
        borderRadius: '8px'
      }}>
        <AlertCircle size={48} color={token.colorTextTertiary} style={{ marginBottom: '16px' }} />
        <Title level={4} style={{ color: token.colorTextSecondary, marginBottom: '8px' }}>
          No Price Changes to Review
        </Title>
        <Text style={{ color: token.colorTextTertiary }}>
          Make some price changes in the previous step to continue.
        </Text>
      </div>
    );
  }

  if (isFieldChannel) {
    // Field channel: Grouped cards approach
    const fieldChanges = changes as FieldPriceChange[];
    
    // Group changes by currency
    const changesByCurrency = fieldChanges.reduce((acc, change) => {
      if (!acc[change.currency]) {
        acc[change.currency] = {
          currencyName: change.currencyName,
          validity: change.validity,
          items: []
        };
      }
      acc[change.currency].items.push(change);
      return acc;
    }, {} as Record<string, { currencyName: string; validity: string; items: FieldPriceChange[] }>);

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ marginBottom: '8px' }}>
            Review Your Price Changes
          </Title>
          <Text style={{ color: token.colorTextSecondary }}>
            {fieldChanges.length} price change{fieldChanges.length === 1 ? '' : 's'} for {productName}
          </Text>
        </div>

        {Object.entries(changesByCurrency).map(([currency, group]) => (
          <Card 
            key={currency}
            title={
              <Space align="center">
                <Text style={{ fontWeight: 500, fontSize: '14px' }}>
                  {currency} - {group.currencyName}
                </Text>
                <Tag style={{ fontSize: '11px' }}>
                  {group.validity}
                </Tag>
              </Space>
            }
            size="small"
            style={{ 
              borderColor: token.colorBorder,
              borderRadius: '6px'
            }}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {group.items.map((item, index) => (
                <div 
                  key={`${item.seatRange}-${item.tier}-${index}`}
                  style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < group.items.length - 1 ? `1px solid ${token.colorBorderSecondary}` : 'none'
                  }}
                >
                  <div>
                    <Text style={{ fontSize: '13px', fontWeight: 500 }}>
                      {item.seatRange} seats • {item.tier === 'NULL_TIER' ? 'Base' : item.tier}
                    </Text>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Space size="small" align="center">
                      {item.currentPrice !== null && (
                        <Text style={{ 
                          color: token.colorTextTertiary,
                          fontSize: '13px',
                          textDecoration: 'line-through'
                        }}>
                          {formatCurrencyAmount(item.currentPrice, currency)}
                        </Text>
                      )}
                      <Text style={{ 
                        fontWeight: 500,
                        fontSize: '13px'
                      }}>
                        {formatCurrencyAmount(item.newPrice, currency)}
                      </Text>
                      <Text style={{ 
                        color: item.change.amount > 0 ? token.colorSuccess : token.colorError,
                        fontSize: '13px',
                        fontWeight: 500
                      }}>
                        {item.change.amount > 0 ? '+' : ''}{item.change.percentage.toFixed(1)}%
                      </Text>
                    </Space>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        ))}
      </Space>
    );
  } else {
    // Non-field channels: Clean table approach
    const nonFieldChanges = changes as PriceChange[];
    
    const columns: ColumnsType<PriceChange> = [
      {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency',
        width: 90,
        render: (currency: string, record: PriceChange) => (
          <div>
            <Text style={{ fontWeight: 500, fontSize: '13px' }}>
              {currency}
            </Text>
            <br />
            <Text style={{ color: token.colorTextTertiary, fontSize: '11px' }}>
              {record.currencyName}
            </Text>
          </div>
        ),
      },
      {
        title: 'Current',
        dataIndex: 'currentPrice',
        key: 'currentPrice',
        width: 100,
        render: (price: number | null, record: PriceChange) => {
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
              color: token.colorTextTertiary,
              fontSize: '13px',
              textDecoration: 'line-through'
            }}>
              {formatCurrencyAmount(price, record.currency)}
            </Text>
          );
        },
      },
      {
        title: 'New',
        dataIndex: 'newPrice',
        key: 'newPrice',
        width: 100,
        render: (price: number, record: PriceChange) => (
          <Text style={{ 
            fontWeight: 500,
            fontSize: '13px'
          }}>
            {formatCurrencyAmount(price, record.currency)}
          </Text>
        ),
      },
      {
        title: 'Change',
        dataIndex: 'change',
        key: 'change',
        width: 100,
        render: (change: { amount: number; percentage: number }) => (
          <Text style={{ 
            color: change.amount > 0 ? token.colorSuccess : token.colorError,
            fontSize: '13px',
            fontWeight: 500
          }}>
            {change.amount > 0 ? '+' : ''}{change.percentage.toFixed(1)}%
          </Text>
        ),
      },
      {
        title: 'Validity',
        dataIndex: 'validity',
        key: 'validity',
        render: (validity: string) => (
          <Tag style={{ fontSize: '11px' }}>
            {validity}
          </Tag>
        ),
      },
    ];

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ marginBottom: '8px' }}>
            Review Your Price Changes
          </Title>
          <Text style={{ color: token.colorTextSecondary }}>
            {nonFieldChanges.length} price change{nonFieldChanges.length === 1 ? '' : 's'} for {productName}
          </Text>
        </div>

        <Table
          columns={columns}
          dataSource={nonFieldChanges}
          rowKey="currency"
          pagination={false}
          size="small"
          bordered
          className="price-changes-summary-table"
          style={{
            backgroundColor: token.colorBgContainer,
          }}
        />

        <style>{`
          .price-changes-summary-table .ant-table-thead > tr > th {
            background-color: ${token.colorFillAlter};
            color: ${token.colorTextSecondary};
            font-weight: 500;
            font-size: ${token.fontSizeSM}px;
          }
          .price-changes-summary-table .ant-table-tbody > tr > td {
            border-bottom: 1px solid ${token.colorBorderSecondary};
          }
          .price-changes-summary-table .ant-table-tbody > tr:last-child > td {
            border-bottom: 1px solid ${token.colorBorder};
          }
        `}</style>
      </Space>
    );
  }
};

export default PriceChangesSummary;
