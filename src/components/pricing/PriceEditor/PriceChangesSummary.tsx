import React from 'react';
import { Typography, Space, Table, theme, Popover, Collapse } from 'antd';
import { TriangleAlert } from 'lucide-react';
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
  priceGroupAction: 'create' | 'update';
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
  priceGroupAction
}) => {
  const { token } = theme.useToken();

  // Note: The "No price changes to review" case is no longer reachable since 
  // Step 1's Continue button is disabled when hasRealTimeChanges is false

  // Generate summary text based on mode
  const getSummaryText = () => {
    const pricePointCount = isFieldChannel ? 
      (changes as FieldPriceChange[]).length : 
      (changes as PriceChange[]).length;

    if (priceGroupAction === 'create') {
      return `This will create a new price group and new SKU with ${pricePointCount} new price point${pricePointCount === 1 ? '' : 's'}.`;
    } else {
      return `This will update the existing price group by expiring ${pricePointCount} price point${pricePointCount === 1 ? '' : 's'} and replacing them with ${pricePointCount} new one${pricePointCount === 1 ? '' : 's'} (existing SKU unchanged).`;
    }
  };

  const summaryText = React.useMemo(() => getSummaryText(), [priceGroupAction, isFieldChannel, changes]);

  if (isFieldChannel) {
    // Field channel: Collapsible Currency → Tier approach
    const fieldChanges = changes as FieldPriceChange[];
    
    // Helper function to check if change is large (>10%)
    const isLargeChange = (change: FieldPriceChange): boolean => {
      if (change.currentPrice === null || change.currentPrice === 0) return false;
      const percentChange = Math.abs(change.change.percentage);
      return percentChange > 10;
    };
    
    // Group changes by currency, then by tier
    const changesByCurrency = fieldChanges.reduce((acc, change) => {
      if (!acc[change.currency]) {
        acc[change.currency] = {
          currencyName: change.currencyName,
          validity: change.validity,
          tiers: {}
        };
      }
      
      if (!acc[change.currency].tiers[change.tier]) {
        acc[change.currency].tiers[change.tier] = [];
      }
      
      acc[change.currency].tiers[change.tier].push(change);
      return acc;
    }, {} as Record<string, { 
      currencyName: string; 
      validity: string; 
      tiers: Record<string, FieldPriceChange[]> 
    }>);

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Main heading */}
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>
            Review changes
          </Title>
        </div>

        {/* Summary section */}
        <div>
          <Title level={5} style={{ marginBottom: '12px', color: token.colorText }}>
            Summary
          </Title>
          <Text style={{ 
            color: token.colorTextSecondary, 
            fontSize: token.fontSize,
            display: 'block',
            marginBottom: '24px'
          }}>
            {summaryText}
          </Text>
        </div>

        {/* Price changes section */}
        <div>
          <Title level={5} style={{ marginBottom: '16px', color: token.colorText }}>
            Price changes
          </Title>
          <Text style={{ color: token.colorTextSecondary, display: 'block', marginBottom: '16px' }}>
            {fieldChanges.length} price change{fieldChanges.length === 1 ? '' : 's'} for {productName}
          </Text>

          <Collapse 
            size="small"
            style={{ backgroundColor: 'transparent' }}
            items={Object.entries(changesByCurrency).map(([currency, group]) => {
              const totalChanges = Object.values(group.tiers).flat().length;
              const largeChanges = Object.values(group.tiers).flat().filter(isLargeChange);
              const largeChangeCount = largeChanges.length;
              
              return {
                key: currency,
                label: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text style={{ fontWeight: 500, fontSize: token.fontSize }}>
                      {currency} ({totalChanges} changes)
                    </Text>
                    <Text style={{ fontSize: token.fontSize, color: token.colorTextSecondary, fontWeight: 'normal' }}>
                      {group.validity}
                    </Text>
                    {largeChangeCount > 0 && (
                      <Popover 
                        content="New price is more than 10% of current"
                        placement="top"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: token.colorWarning }}>
                          <TriangleAlert size={14} />
                          <Text style={{ fontSize: token.fontSize, color: token.colorWarning, fontWeight: 'normal' }}>
                            {largeChangeCount} large changes
                          </Text>
                        </div>
                      </Popover>
                    )}
                  </div>
                ),
                children: (
                  <div style={{ 
                    borderLeft: `1px solid ${token.colorBorderSecondary}`,
                    marginLeft: '12px',
                    paddingLeft: '12px'
                  }}>
                    <Collapse 
                      size="small"
                      ghost
                      items={Object.entries(group.tiers).map(([tier, tierChanges], tierIndex, tierArray) => {
                        const tierLargeChanges = tierChanges.filter(isLargeChange);
                        const tierLargeCount = tierLargeChanges.length;
                        
                        return {
                          key: tier,
                          label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Text style={{ fontWeight: 500, fontSize: token.fontSize }}>
                                {tier === 'NULL_TIER' ? 'Base' : tier} ({tierChanges.length} changes)
                              </Text>
                              {tierLargeCount > 0 && (
                                <Popover 
                                  content="New price is more than 10% of current"
                                  placement="top"
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: token.colorWarning }}>
                                    <TriangleAlert size={12} />
                                    <Text style={{ fontSize: token.fontSize, color: token.colorWarning, fontWeight: 'normal' }}>
                                      {tierLargeCount} large changes
                                    </Text>
                                  </div>
                                </Popover>
                              )}
                            </div>
                          ),
                          children: (
                            <div style={{ 
                              marginBottom: tierIndex < tierArray.length - 1 ? '16px' : '0',
                              borderBottom: tierIndex < tierArray.length - 1 ? `1px solid ${token.colorBorderSecondary}` : 'none',
                              paddingBottom: tierIndex < tierArray.length - 1 ? '16px' : '0'
                            }}>
                              {tierChanges.map((item, index) => (
                                <div 
                                  key={`${item.seatRange}-${item.tier}-${index}`}
                                  style={{ 
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 0',
                                    borderBottom: index < tierChanges.length - 1 ? `1px solid ${token.colorBorderSecondary}` : 'none'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Text style={{ fontSize: token.fontSize, fontWeight: 'normal' }}>
                                      {item.seatRange} seats
                                    </Text>
                                    {isLargeChange(item) && (
                                      <Popover 
                                        content="New price is more than 10% of current"
                                        placement="top"
                                      >
                                        <TriangleAlert size={12} color={token.colorWarning} />
                                      </Popover>
                                    )}
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <Space size="small" align="center">
                                      {priceGroupAction === 'update' && item.currentPrice !== null && (
                                        <Text style={{ 
                                          color: token.colorTextTertiary,
                                          fontSize: token.fontSize,
                                          fontWeight: 'normal',
                                          textDecoration: 'line-through',
                                          fontVariantNumeric: 'tabular-nums'
                                        }}>
                                          {formatCurrencyAmount(item.currentPrice, currency)}
                                        </Text>
                                      )}
                                      <Text style={{ 
                                        fontWeight: 'normal',
                                        fontSize: token.fontSize,
                                        fontVariantNumeric: 'tabular-nums'
                                      }}>
                                        {formatCurrencyAmount(item.newPrice, currency)}
                                      </Text>
                                      {priceGroupAction === 'update' && (
                                        <Text style={{ 
                                          color: item.change.amount > 0 ? token.colorSuccess : token.colorError,
                                          fontSize: token.fontSize,
                                          fontWeight: 'normal'
                                        }}>
                                          {item.change.amount > 0 ? '+' : ''}{item.change.percentage.toFixed(1)}%
                                        </Text>
                                      )}
                                    </Space>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        };
                      })}
                    />
                  </div>
                )
              };
            })}
          />
        </div>
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
        render: (currency: string) => (
          <Text style={{ fontWeight: 500, fontSize: token.fontSize }}>
            {currency}
          </Text>
        ),
      },
      // Only include Current column for update mode
      ...(priceGroupAction === 'update' ? [{
        title: 'Current',
        dataIndex: 'currentPrice',
        key: 'currentPrice',
        width: 100,
        render: (price: number | null, record: PriceChange) => {
          if (price === null) {
            return (
            <Text style={{ 
              color: token.colorTextTertiary,
              fontSize: token.fontSize,
              fontStyle: 'italic',
              fontWeight: 400
            }}>
              New
            </Text>
            );
          }
          
          return (
            <Text style={{ 
              color: token.colorTextTertiary,
              fontSize: token.fontSize,
              textDecoration: 'line-through',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 400
            }}>
              {formatCurrencyAmount(price, record.currency)}
            </Text>
          );
        },
      }] : []),
      {
        title: 'New',
        dataIndex: 'newPrice',
        key: 'newPrice',
        width: 100,
        render: (price: number, record: PriceChange) => (
          <Text style={{ 
            fontWeight: 400,
            fontSize: token.fontSize,
            fontVariantNumeric: 'tabular-nums'
          }}>
            {formatCurrencyAmount(price, record.currency)}
          </Text>
        ),
      },
      // Only include Change column for update mode
      ...(priceGroupAction === 'update' ? [{
        title: 'Change',
        dataIndex: 'change',
        key: 'change',
        width: 100,
        render: (change: { amount: number; percentage: number }) => (
          <Text style={{ 
            color: change.amount > 0 ? token.colorSuccess : token.colorError,
            fontSize: token.fontSize,
            fontWeight: 400
          }}>
            {change.amount > 0 ? '+' : ''}{change.percentage.toFixed(1)}%
          </Text>
        ),
      }] : []),
      {
        title: 'Validity',
        dataIndex: 'validity',
        key: 'validity',
        render: (validity: string) => (
          <Text style={{ fontSize: token.fontSize, color: token.colorTextSecondary, fontWeight: 400 }}>
            {validity}
          </Text>
        ),
      },
    ];

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Main heading */}
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>
            Review changes
          </Title>
        </div>

        {/* Summary section */}
        <div>
          <Title level={5} style={{ marginBottom: '12px', color: token.colorText }}>
            Summary
          </Title>
          <Text style={{ 
            color: token.colorTextSecondary, 
            fontSize: token.fontSize,
            display: 'block',
            marginBottom: '24px'
          }}>
            {summaryText}
          </Text>
        </div>

        {/* Price changes section */}
        <div>
          <Title level={5} style={{ marginBottom: '16px', color: token.colorText }}>
            Price changes
          </Title>
          <Text style={{ color: token.colorTextSecondary, display: 'block', marginBottom: '16px' }}>
            {nonFieldChanges.length} price change{nonFieldChanges.length === 1 ? '' : 's'} for {productName}
          </Text>

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
            border-bottom: 1px solid ${token.colorBorder} !important;
          }
        `}</style>
        </div>
      </Space>
    );
  }
};

export default PriceChangesSummary;
