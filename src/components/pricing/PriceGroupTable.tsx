import React, { useMemo, useState, useEffect } from 'react';
import { Table, Space, Typography, Tag, Dropdown, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Ellipsis } from 'lucide-react';
import type { PriceGroup, Sku, ColumnVisibility, ColumnOrder, PricePoint } from '../../utils/types';
import { formatCurrency, toSentenceCase, formatColumnTitles, formatValidityRange } from '../../utils/formatters';
import { PRICE_GROUP_COLUMNS } from '../../utils/tableConfigurations';

import GroupHeader from '../shared/GroupHeader';
import CopyableId from '../shared/CopyableId';
import { ExperimentalBadge } from '../configuration/ExperimentalBadge';
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

/**
 * Determines the overall validity range for a price group based on its price points
 */
const getValidityRange = (pricePoints: PricePoint[]): string => {
  if (!pricePoints || pricePoints.length === 0) return 'N/A';

  const validFromDates = pricePoints
    .map(p => p.validFrom)
    .filter((date): date is string => Boolean(date))
    .map(date => new Date(date).getTime());
    
  const validToDates = pricePoints
    .filter(p => p.status === 'Active')  // Only look at active price points for business validity
    .map(p => p.validTo)
    .filter((date): date is string => Boolean(date))
    .map(date => new Date(date).getTime());

  if (validFromDates.length === 0) return 'No validity data';

  const earliestFrom = new Date(Math.min(...validFromDates));
  const latestTo = validToDates.length > 0 ? 
    new Date(Math.max(...validToDates)) : null;

  // Check if all price points have same validity
  const uniqueValidityPeriods = new Set(
    pricePoints.map(p => `${p.validFrom}-${p.validTo || ''}`)
  );

  const baseRange = formatValidityRange(
    earliestFrom.toISOString(), 
    latestTo?.toISOString()
  );

  // Add indicator if there are mixed validity periods
  if (uniqueValidityPeriods.size > 1) {
    return `${baseRange} (${uniqueValidityPeriods.size} periods)`;
  }

  return baseRange;
};

const PriceGroupTable: React.FC<PriceGroupTableProps> = ({ 
  priceGroups, 
  groupedPriceGroups, 
  productId,
  visibleColumns = {},
  columnOrder = ['name', 'channel', 'billingCycle', 'usdPrice', 'currencies', 'lix', 'validity'],
  currentTab = 'pricing', // Default to pricing since that's where this table is typically used
}) => {
  const navigate = useNavigate();

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
    name: visibleColumns.name !== false ? {
      title: getColumnLabel('name'),
      dataIndex: 'name',
      key: 'name',
      minWidth: 200,
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        
        // Find experimental SKUs in this price group
        const experimentalSkus = record.skus.filter((sku: Sku) => sku.lix?.key);
        const firstExperimentalSku = experimentalSkus[0];
        
        const getPriceGroupTooltipContent = () => {
          if (!firstExperimentalSku) return null;
          
          return (
            <div style={{ maxWidth: 300 }}>
              <Space direction="vertical" size={4}>
                <Text strong style={{ color: 'white' }}>This price group is part of a SKU experiment</Text>
                <div style={{ marginTop: 8 }}>
                  <Text style={{ color: 'white', fontSize: '13px' }}>
                    <strong>SKU:</strong> {firstExperimentalSku.id}
                  </Text>
                  <div>
                    <Text style={{ color: 'white', fontSize: '13px' }}>
                      <strong>LIX Key:</strong> {firstExperimentalSku.lix.key}
                    </Text>
                  </div>
                  {firstExperimentalSku.lix.treatment && (
                    <div>
                      <Text style={{ color: 'white', fontSize: '13px' }}>
                        <strong>Treatment:</strong> {firstExperimentalSku.lix.treatment}
                      </Text>
                    </div>
                  )}
                  {experimentalSkus.length > 1 && (
                    <div style={{ marginTop: 4 }}>
                      <Text style={{ color: 'white', fontSize: '13px' }}>
                        +{experimentalSkus.length - 1} more experimental SKU{experimentalSkus.length - 1 > 1 ? 's' : ''}
                      </Text>
                    </div>
                  )}
                </div>
              </Space>
            </div>
          );
        };
        
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 500 }}>
              {record.priceGroup.name || '-'}
            </span>
            {firstExperimentalSku && (
              <ExperimentalBadge 
                lixKey={firstExperimentalSku.lix.key} 
                lixTreatment={firstExperimentalSku.lix.treatment} 
                variant="compact"
                customTooltipContent={getPriceGroupTooltipContent()}
              />
            )}
          </div>
        );
      },
    } : null,
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
            {uniqueChannels.map((channel: any) => {
              const isMobileChannel = channel === 'iOS' || channel === 'GPB';
              return (
                <Space key={channel} size={4}>
                  <SalesChannelDisplay channel={channel} />
                  {isMobileChannel && (
                    <Tag 
                      style={{ fontSize: '11px', margin: 0, padding: '0 6px', lineHeight: '18px' }}
                    >
                      ext_prod_id
                    </Tag>
                  )}
                </Space>
              );
            })}
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
              <BillingCycleDisplay key={billingCycle} billingCycle={billingCycle} />
            ))}
          </Space>
        );
      },
    } : null,
    usdPrice: visibleColumns.usdPrice !== false ? {
      title: getColumnLabel('usdPrice'),
      dataIndex: 'usdPrice',
      key: 'usdPrice',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        const usd = record.priceGroup.pricePoints.find((p: any) => p.currencyCode === 'USD');
        return usd ? formatCurrency(usd) : (
          <Text type="secondary">No USD price</Text>
        );
      },
    } : null,
    currencies: visibleColumns.currencies !== false ? {
      title: getColumnLabel('currencies'),
      dataIndex: 'currencies',
      key: 'currencies',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return record.priceGroup.pricePoints.length;
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
          return <Text type="secondary">-</Text>;
        }
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Text style={{ fontWeight: 500 }}>
              {skuWithLix.lix.key}
            </Text>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              {skuWithLix.lix.treatment}
            </Text>
          </div>
        );
      },
    } : null,
    validity: visibleColumns.validity !== false ? {
      title: getColumnLabel('validity'),
      dataIndex: 'validity',
      key: 'validity',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return getValidityRange(record.priceGroup.pricePoints);
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
                  <p style={{ marginTop: 8, fontSize: '13px', color: '#666' }}>
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
    <div className="content-panel">
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