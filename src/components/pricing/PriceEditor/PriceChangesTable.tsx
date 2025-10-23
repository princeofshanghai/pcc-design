import React, { useState, useMemo } from 'react';
import { Table, Typography, theme, Space, Tag, Tooltip } from 'antd';
import { ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

// Types for the unified change data structure
interface BaseChange {
  id: string;
  currency: string;
  currencyName: string;
  currentPrice: number | null;
  newPrice: number;
  change: {
    amount: number;
    percentage: number;
  };
  validity: string;
  status: 'new' | 'updated' | 'unchanged';
}

interface SimpleChange extends BaseChange {
  type: 'simple';
  context: 'Base price';
}

interface FieldChange extends BaseChange {
  type: 'field';
  context: string; // e.g., "1-100 seats, Premium"
  seatRange: string;
  tier: string;
}

type UnifiedChange = SimpleChange | FieldChange;

interface PriceChangesTableProps {
  changes: UnifiedChange[];
  title?: string;
  showSummary?: boolean;
  showFiltering?: boolean;
  mode?: 'review' | 'gtm'; // Different contexts
  onEdit?: (changeId: string) => void;
  className?: string;
  // SKU context information
  skuContext?: {
    action: 'create' | 'update';
    productName: string;
    channel: string;
    billingCycle: string;
    skuIds?: string[]; // For update mode - multiple SKUs can use same price group
  };
}

const PriceChangesTable: React.FC<PriceChangesTableProps> = ({
  changes,
  title = "Review price changes",
  showSummary = true,
  className = '',
  skuContext
}) => {
  const { token } = theme.useToken();
  const [expandedCurrencies, setExpandedCurrencies] = useState<Set<string>>(new Set());

  // Group changes by currency for field products, keep flat for simple products
  const groupedData = useMemo(() => {
    const hasFieldChanges = changes.some(change => change.type === 'field');
    
    if (!hasFieldChanges) {
      // Simple products: return flat structure
      return changes;
    }

    // Field products: group by currency
    const grouped = changes.reduce((acc, change) => {
      if (!acc[change.currency]) {
        acc[change.currency] = {
          currency: change.currency,
          currencyName: change.currencyName,
          changes: [],
          summary: {
            totalChanges: 0,
            newCount: 0,
            updatedCount: 0
          }
        };
      }
      acc[change.currency].changes.push(change);
      acc[change.currency].summary.totalChanges++;
      if (change.status === 'new') acc[change.currency].summary.newCount++;
      if (change.status === 'updated') acc[change.currency].summary.updatedCount++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }, [changes]);


  // Format currency amounts
  const formatAmount = (amount: number, currency: string): string => {
    const zeroDecimalCurrencies = new Set(['JPY', 'KRW', 'VND', 'CLP', 'PYG', 'RWF', 'UGX', 'XAF', 'XOF', 'XPF']);
    
    if (zeroDecimalCurrencies.has(currency)) {
      return Math.round(amount).toLocaleString();
    }
    return amount.toFixed(2);
  };

  // Format change indicators
  const formatChange = (change: { amount: number; percentage: number }) => {
    const isIncrease = change.amount > 0;
    const isDecrease = change.amount < 0;
    const isLarge = Math.abs(change.percentage) > 10;
    
    let color = token.colorTextSecondary;
    if (isIncrease) color = token.colorSuccess;
    if (isDecrease) color = token.colorError;
    
    const sign = isIncrease ? '+' : '';
    const percentage = change.percentage.toFixed(1);
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {isLarge && (
          <Tooltip title="Change is more than 10%">
            <AlertTriangle size={12} color={token.colorWarning} />
          </Tooltip>
        )}
        <Text style={{ 
          color, 
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums' 
        }}>
          {sign}{percentage}%
        </Text>
      </div>
    );
  };


  // Toggle currency expansion (for field products)
  const toggleCurrencyExpansion = (currency: string) => {
    const newExpanded = new Set(expandedCurrencies);
    if (newExpanded.has(currency)) {
      newExpanded.delete(currency);
    } else {
      newExpanded.add(currency);
    }
    setExpandedCurrencies(newExpanded);
  };

  // Define columns based on whether we have field changes
  const hasFieldChanges = changes.some(change => change.type === 'field');

  // Determine if we should hide comparison columns (for new price groups)
  const isCreateMode = skuContext?.action === 'create';

  const simpleColumns: ColumnsType<UnifiedChange> = [
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      width: 100,
      fixed: 'left',
      onHeaderCell: () => ({
        style: {
          backgroundColor: token.colorFillAlter,
        },
      }),
      render: (currency: string, record: UnifiedChange) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Text>{currency}</Text>
          {record.status === 'new' && (
            <Tag 
              color="green"
              style={{ 
                fontSize: token.fontSizeSM,
                lineHeight: 1.2,
                padding: '1px 6px'
              }}
            >
              New
            </Tag>
          )}
        </div>
      ),
    },
    // Only show Current Price column for update mode
    ...(!isCreateMode ? [{
      title: 'Current price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      width: 120,
      render: (price: number | null, record: UnifiedChange) => {
        if (price === null) {
          return (
            <Text style={{ 
              color: token.colorTextTertiary,
              fontStyle: 'italic'
            }}>
              —
            </Text>
          );
        }
        return (
          <Text style={{ 
            fontVariantNumeric: 'tabular-nums',
            color: token.colorTextSecondary 
          }}>
            {formatAmount(price, record.currency)}
          </Text>
        );
      },
    }] : []),
    {
      title: 'New price',
      dataIndex: 'newPrice',
      key: 'newPrice',
      width: 120,
      render: (price: number, record: UnifiedChange) => (
        <Text style={{ 
          fontVariantNumeric: 'tabular-nums'
        }}>
          {formatAmount(price, record.currency)}
        </Text>
      ),
    },
    // Only show Change column for update mode
    ...(!isCreateMode ? [{
      title: 'Change',
      dataIndex: 'change',
      key: 'change',
      width: 100,
      render: (change: { amount: number; percentage: number }, record: UnifiedChange) => {
        if (record.currentPrice === null) {
          return <Text style={{ color: token.colorTextTertiary }}>—</Text>;
        }
        return formatChange(change);
      },
    }] : []),
    {
      title: 'Validity',
      dataIndex: 'validity',
      key: 'validity',
      width: 150,
      render: (validity: string) => (
        <Text style={{ 
          color: token.colorTextSecondary 
        }}>
          {validity}
        </Text>
      ),
    },
    // Remove per-row edit buttons - using global edit button instead
  ];

  // Render the table content
  const renderTable = () => {
    if (hasFieldChanges) {
      // Field products: Show grouped/expandable structure
      return (
        <div className="field-changes-table">
          {groupedData.map((group: any) => {
            const isExpanded = expandedCurrencies.has(group.currency);
            
            return (
              <div key={group.currency} style={{ marginBottom: '16px' }}>
                {/* Currency header row */}
                <div 
                  onClick={() => toggleCurrencyExpansion(group.currency)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: token.colorFillAlter,
                    border: `1px solid ${token.colorBorder}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginBottom: isExpanded ? '8px' : 0
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Text>
                        {group.currency}
                      </Text>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text style={{ color: token.colorTextSecondary }}>
                      {group.summary.totalChanges} changes
                    </Text>
                    {group.summary.newCount > 0 && (
                      <Tag 
                        color="green"
                        style={{ 
                          fontSize: token.fontSizeSM,
                          lineHeight: 1.2,
                          padding: '1px 6px'
                        }}
                      >
                        +{group.summary.newCount} New
                      </Tag>
                    )}
                    {group.summary.updatedCount > 0 && (
                      <Tag 
                        color="orange"
                        style={{ 
                          fontSize: token.fontSizeSM,
                          lineHeight: 1.2,
                          padding: '1px 6px'
                        }}
                      >
                        {group.summary.updatedCount} Updated
                      </Tag>
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <Table
                    size="small"
                    columns={[
                      {
                        title: 'Seats and tier',
                        dataIndex: 'context',
                        key: 'context',
                        render: (context: string, record: any) => (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Text>
                              {context}
                            </Text>
                            {record.status === 'new' && (
                              <Tag 
                                color="green"
                                style={{ 
                                  fontSize: token.fontSizeSM,
                                  lineHeight: 1.2,
                                  padding: '1px 6px'
                                }}
                              >
                                New
                              </Tag>
                            )}
                          </div>
                        ),
                      },
                      // Use filtered columns that respect create/update mode
                      ...simpleColumns.slice(1).filter(col => {
                        // In create mode, exclude Current Price and Change columns
                        if (isCreateMode) {
                          return col.key !== 'currentPrice' && col.key !== 'change';
                        }
                        return true;
                      })
                    ]}
                    dataSource={group.changes}
                    rowKey="id"
                    pagination={false}
                    bordered={false}
                    style={{ 
                      border: `1px solid ${token.colorBorder}`,
                      borderRadius: '6px'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      );
    } else {
      // Simple products: Show flat table
      return (
        <Table
          size="middle"
          columns={simpleColumns}
          dataSource={groupedData as UnifiedChange[]}
          rowKey="id"
          pagination={false}
          bordered
          scroll={{ x: 'max-content' }}
          className="unified-changes-table"
          style={{ borderBottom: `1px solid ${token.colorBorder}` }}
        />
      );
    }
  };

  return (
    <div className={className}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Title level={3} style={{ 
            marginBottom: showSummary ? '8px' : '24px',
            fontSize: token.fontSizeHeading2 
          }}>
            {title}
          </Title>
        </div>

        {/* SKU Context Info */}
        {showSummary && skuContext && (
          <div style={{ marginBottom: '16px' }}>
            <Text>
              {skuContext.action === 'create' 
                ? `A new SKU with this price group will be created for ${skuContext.productName}`
                : `Existing SKUs (${skuContext.skuIds?.join(', ') || 'Unknown'}) for ${skuContext.productName} will be updated`
              }
            </Text>
          </div>
        )}


        {/* Table */}
        {renderTable()}
      </Space>

      <style>{`
        .unified-changes-table .ant-table-thead > tr > th:first-child {
          position: sticky;
          left: 0;
          z-index: 1;
          background: ${token.colorBgContainer};
        }
        
        .unified-changes-table .ant-table-tbody > tr > td:first-child {
          position: sticky;
          left: 0;
          z-index: 1;
          background: ${token.colorBgContainer};
        }
        
        .field-changes-table .ant-table-small .ant-table-tbody > tr > td {
          padding: 8px 12px;
        }
      `}</style>
    </div>
  );
};

export default PriceChangesTable;
