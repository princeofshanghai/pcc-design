import React, { useMemo, useState, useEffect } from 'react';
import { Table, Space, Typography, Dropdown, Button, Modal, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Ellipsis } from 'lucide-react';
import type { PriceGroup, Sku, ColumnVisibility, ColumnOrder } from '../../utils/types';
import { formatCurrency, toSentenceCase, formatColumnTitles } from '../../utils/formatters';
import { PRICE_GROUP_COLUMNS } from '../../utils/tableConfigurations';

import GroupHeader from '../shared/GroupHeader';
import CopyableId from '../shared/CopyableId';
import PriceGroupStatusTag from '../attributes/PriceGroupStatusTag';
import SalesChannelDisplay from '../attributes/SalesChannelDisplay';
import BillingCycleDisplay from '../attributes/BillingCycleDisplay';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface PriceGroupTableProps {
  priceGroups: Array<{ priceGroup: PriceGroup; skus: Sku[] }>;
  groupedPriceGroups?: Record<string, Array<{ priceGroup: PriceGroup; skus: Sku[] }>> | null;
  productId: string;
  visibleColumns?: ColumnVisibility;
  columnOrder?: ColumnOrder;
  currentTab?: string; // Add current tab to remember where we came from
}

type TableRow = {
  priceGroup: PriceGroup;
  skus: Sku[];
} | {
  isGroupHeader: true;
  key: string;
  title: string;
  count: number;
  groupKey: string;
};



const PriceGroupTable: React.FC<PriceGroupTableProps> = ({ 
  priceGroups, 
  groupedPriceGroups, 
  productId,
  visibleColumns = {},
  columnOrder = ['channel', 'billingCycle', 'price', 'lix', 'status'],
  currentTab = 'pricing', // Default to pricing since that's where this table is typically used
}) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  // Create a helper to get column label from centralized config
  const getColumnLabel = (key: string): string => {
    const column = PRICE_GROUP_COLUMNS.find(col => col.key === key);
    return column?.label || toSentenceCase(key);
  };

  // Define all possible columns
  const allColumnsMap: Record<string, any> = {
    id: {
      title: getColumnLabel('id'),
      dataIndex: 'id',
      key: 'id',
      // ID column always visible
      fixed: 'left',
      minWidth: 150,
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        
        return (
          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <CopyableId id={record.priceGroup.id || ''} variant="prominent" />
          </div>
        );
      },
      className: 'table-col-first',
    },

    channel: visibleColumns.channel !== false ? {
      title: getColumnLabel('channel'),
      dataIndex: 'channel',
      key: 'channel',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        // Get all unique channels from SKUs using this price group
        const uniqueChannels = [...new Set(record.skus.map((sku: Sku) => sku.salesChannel))];
        return (
          <Space size="small">
            {uniqueChannels.map((channel: any) => (
              <SalesChannelDisplay key={channel} channel={channel} variant="small" />
            ))}
          </Space>
        );
      },
    } : null,
    billingCycle: visibleColumns.billingCycle !== false ? {
      title: getColumnLabel('billingCycle'),
      dataIndex: 'billingCycle',
      key: 'billingCycle',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        // Get all unique billing cycles from SKUs using this price group
        const uniqueBillingCycles = [...new Set(record.skus.map((sku: Sku) => sku.billingCycle))];
        return (
          <Space size="small">
            {uniqueBillingCycles.map((billingCycle: any) => (
              <BillingCycleDisplay key={billingCycle} billingCycle={billingCycle} variant="small" />
            ))}
          </Space>
        );
      },
    } : null,
    price: visibleColumns.price !== false ? {
      title: getColumnLabel('price'),
      dataIndex: 'price',
      key: 'price',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        
        // Filter for active price points only
        const activePricePoints = record.priceGroup.pricePoints.filter((p: any) => p.status === 'Active');
        
        if (activePricePoints.length === 0) {
          return (
            <Text style={{ color: token.colorTextSecondary }}>No active price points</Text>
          );
        }
        
        // Priority order: USD → EUR → CAD → alphabetical
        const priorities = ['USD', 'EUR', 'CAD'];
        let displayPrice = null;
        
        // Try priority currencies first
        for (const currency of priorities) {
          displayPrice = activePricePoints.find((p: any) => p.currencyCode === currency);
          if (displayPrice) break;
        }
        
        // Fall back to first alphabetically if no priority currency found
        if (!displayPrice) {
          const sortedActive = activePricePoints.sort((a: any, b: any) => 
            a.currencyCode.localeCompare(b.currencyCode)
          );
          displayPrice = sortedActive[0];
        }
        
        // Calculate additional active currencies (total active - 1 displayed)
        const additionalActiveCurrencies = activePricePoints.length - 1;
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <div>{formatCurrency(displayPrice)}</div>
            {additionalActiveCurrencies > 0 && (
              <Text style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary }}>
                +{additionalActiveCurrencies} active currenc{additionalActiveCurrencies !== 1 ? 'ies' : 'y'}
              </Text>
            )}
          </div>
        );
      },
    } : null,

    lix: visibleColumns.lix !== false ? {
      title: getColumnLabel('lix'),
      dataIndex: 'lix',
      key: 'lix',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        
        // Find the first SKU with LIX data
        const skuWithLix = record.skus.find((sku: Sku) => sku.lix?.key);
        
        if (!skuWithLix) {
          return <Text style={{ color: token.colorTextSecondary }}>-</Text>;
        }
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <Text>
              {skuWithLix.lix.key}
            </Text>
            <Text style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary }}>
              {skuWithLix.lix.treatment}
            </Text>
          </div>
        );
      },
    } : null,
    status: visibleColumns.status !== false ? {
      title: getColumnLabel('status'),
      dataIndex: 'status',
      key: 'status',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return <PriceGroupStatusTag priceGroup={record.priceGroup} variant="small" />;
      },
    } : null,
  };

  // Build columns in the specified order, filtering out hidden/null columns
  const baseColumns: ColumnsType<any> = formatColumnTitles(
    columnOrder
      .map(key => allColumnsMap[key])
      .filter(Boolean)
  );

  // Create overflow menu for each row
  const createRowMenu = (record: any) => {
    if ('isGroupHeader' in record) return { items: [] };

    return {
      items: [
        {
          key: 'view',
          label: 'View price',
          onClick: () => {
            navigate(`/product/${productId}/price-group/${record.priceGroup.id}?from=${currentTab}`);
          },
        },
        {
          key: 'clone',
          label: 'Clone price',
          onClick: () => {
            Modal.info({
              title: 'Clone Price',
              content: (
                <div>
                  <p>This would create a copy of price group <strong>{record.priceGroup.id}</strong>.</p>
                  <p style={{ marginTop: 8, fontSize: '13px', color: token.colorTextSecondary }}>
                    You would be able to modify the cloned price group with different settings.
                  </p>
                </div>
              ),
              okText: 'Got it',
              width: 400,
            });
          },
        },
      ],
    };
  };

  // Action column (always visible, fixed to right)
  const actionColumn = {
    title: '', // No column title
    key: 'actions',
    fixed: 'right' as const,
    width: 48,
    render: (_: any, record: any) => {
      if ('isGroupHeader' in record) return null;

      return (
        <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <Dropdown menu={createRowMenu(record)} trigger={['click']} placement="bottomRight">
            <Button 
              icon={<Ellipsis size={16} />} 
              size="small"
              type="text"
              style={{ 
                border: 'none',
                background: 'transparent',
                padding: '4px',
                height: '24px',
                width: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            />
          </Dropdown>
        </div>
      );
    },
  };

  // Combine base columns with action column
  const columns: ColumnsType<any> = [...baseColumns, actionColumn];

  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Auto-expand all groups when groupedPriceGroups changes (i.e., when grouping is applied)
  useEffect(() => {
    if (groupedPriceGroups) {
      const allGroupKeys = Object.keys(groupedPriceGroups);
      setExpandedGroups(allGroupKeys);
    } else {
      setExpandedGroups([]);
    }
  }, [groupedPriceGroups]);

  // Prepare data source
  const dataSource: TableRow[] = useMemo(() => {
    if (groupedPriceGroups) {
      // Grouped data
      const result: TableRow[] = [];
      Object.entries(groupedPriceGroups).forEach(([groupTitle, groups]) => {
        result.push({
          isGroupHeader: true,
          key: `header-${groupTitle}`,
          title: groupTitle,
          count: groups.length,
          groupKey: groupTitle,
        });
        // Only add group items if the group is expanded
        if (expandedGroups.includes(groupTitle)) {
          result.push(...groups);
        }
      });
      return result;
    } else {
      // Ungrouped data
      return priceGroups;
    }
  }, [priceGroups, groupedPriceGroups, expandedGroups]);

  const handleGroupToggle = (groupKey: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(key => key !== groupKey)
        : [...prev, groupKey]
    );
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <Table
        size="small"
        columns={columns}
        dataSource={dataSource}
        rowKey={record => ('isGroupHeader' in record ? record.key : record.priceGroup.id || Math.random().toString())}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowClassName={(record) => ('isGroupHeader' in record ? 'ant-table-row-group-header' : '')}
        onRow={(record) => ({
          onClick: () => {
            if ('isGroupHeader' in record) return;
            // Include current tab in URL so back navigation knows where to return
            navigate(`/product/${productId}/price-group/${record.priceGroup.id}?from=${currentTab}`);
          },
          style: { cursor: 'isGroupHeader' in record ? 'default' : 'pointer' },
        })}
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
                        contextType="price groups"
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

export default PriceGroupTable; 