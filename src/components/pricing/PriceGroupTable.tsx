import React, { useMemo, useState, useEffect } from 'react';
import { Table, Typography, Dropdown, Button, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Ellipsis, ChevronRight } from 'lucide-react';
import PriceEditorModal from './PriceEditor/PriceEditorModal';
import type { PriceGroup, Sku, ColumnVisibility, ColumnOrder } from '../../utils/types';
import { toSentenceCase, formatColumnTitles } from '../../utils/formatters';
import { PRICE_GROUP_COLUMNS, DEFAULT_PRICE_GROUP_COLUMNS } from '../../utils/tableConfigurations';
import { getColumnTitleWithTooltip } from '../../utils/tableHelpers';

import GroupHeader from '../shared/GroupHeader';
import CopyableId from '../shared/CopyableId';
import PriceGroupStatusTag from '../attributes/PriceGroupStatusTag';
import VerticalSeparator from '../shared/VerticalSeparator';
import InfoPopover from '../shared/InfoPopover';
import { getChannelIcon } from '../../utils/channelIcons';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface PriceGroupTableProps {
  priceGroups: Array<{ priceGroup: PriceGroup; skus: Sku[] }>;
  groupedPriceGroups?: Record<string, Array<{ priceGroup: PriceGroup; skus: Sku[] }>> | null;
  productId: string;
  productName?: string; // Add product name for Price Editor Modal
  product?: any; // Add full product data for Price Editor Modal
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
  productName = '',
  product,
  visibleColumns = {},
  columnOrder = DEFAULT_PRICE_GROUP_COLUMNS,
  currentTab = 'pricing', // Default to pricing since that's where this table is typically used
}) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  // Price Editor Modal state
  const [priceEditorModalOpen, setPriceEditorModalOpen] = useState(false);
  const [selectedPriceGroupForEdit, setSelectedPriceGroupForEdit] = useState<any>(null);
  const [priceEditorMode, setPriceEditorMode] = useState<'edit' | 'clone'>('edit');

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
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        
        return (
          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <CopyableId id={record.priceGroup.id || ''} variant="table" />
          </div>
        );
      },
      className: 'table-col-first',
    },

    channel: visibleColumns.channel === true ? {
      title: getColumnLabel('channel'),
      dataIndex: 'channel',
      key: 'channel',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        // Get all unique channels from SKUs using this price group
        const uniqueChannels = [...new Set(record.skus.map((sku: Sku) => sku.salesChannel))];
        return (
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {uniqueChannels.map((channel: any, index: number) => (
              <React.Fragment key={channel}>
                {index > 0 && <VerticalSeparator />}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {getChannelIcon(channel)}
                  {channel}
                </span>
              </React.Fragment>
            ))}
          </div>
        );
      },
    } : null,
    billingCycle: visibleColumns.billingCycle === true ? {
      title: getColumnLabel('billingCycle'),
      dataIndex: 'billingCycle',
      key: 'billingCycle',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        // Get all unique billing cycles from SKUs using this price group
        const uniqueBillingCycles = [...new Set(record.skus.map((sku: Sku) => sku.billingCycle))];
        return (
          <Typography.Text>
            {uniqueBillingCycles.join(', ')}
          </Typography.Text>
        );
      },
    } : null,
    price: visibleColumns.price === true ? {
      title: getColumnTitleWithTooltip(getColumnLabel('price'), 'The default price before any discounts or offers are applied.'),
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
        
        // Look for USD first
        const usdPrice = activePricePoints.find((p: any) => p.currencyCode === 'USD');
        
        // Format currency with tabular-nums only for the numeric part
        const formatPriceWithTabularNums = (pricePoint: any) => {
          const zeroDecimalCurrencies = new Set([
            'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
            'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
          ]);
          
          const amount = zeroDecimalCurrencies.has(pricePoint.currencyCode) 
            ? Math.round(pricePoint.amount) 
            : pricePoint.amount.toFixed(2);
          
          return (
            <span style={{ fontWeight: 500 }}>
              {pricePoint.currencyCode}{' '}
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{amount}</span>
            </span>
          );
        };
        
        if (usdPrice) {
          // If USD exists, show USD price with additional count
          const additionalActivePricePoints = activePricePoints.length - 1;
          return (
            <div>
              {formatPriceWithTabularNums(usdPrice)}
              {additionalActivePricePoints > 0 && (
                <span style={{ color: token.colorTextSecondary }}> +{additionalActivePricePoints} more</span>
              )}
            </div>
          );
        } else {
          // If no USD, just show count of non-USD price points
          const count = activePricePoints.length;
          return (
            <Text style={{ color: token.colorText, fontWeight: 500 }}>
              {count} non-USD price point{count === 1 ? '' : 's'}
            </Text>
          );
        }
      },
    } : null,

    lix: visibleColumns.lix === true ? {
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
        
        const lixKey = skuWithLix.lix.key;
        
        const tooltipContent = (
          <div>
            <div><strong>LIX Key:</strong> {skuWithLix.lix.key}</div>
            <div><strong>Treatment:</strong> {skuWithLix.lix.treatment}</div>
          </div>
        );
        
        return (
          <InfoPopover content={tooltipContent} placement="topLeft">
            <div style={{ cursor: 'pointer' }}>
              <Text>{lixKey}</Text>
              <Text style={{ color: token.colorTextSecondary }}> ({skuWithLix.lix.treatment})</Text>
            </div>
          </InfoPopover>
        );
      },
    } : null,
    status: visibleColumns.status === true ? {
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
  // Include all possible columns that are visible, not just those in columnOrder
  const allVisibleColumnKeys = Object.keys(allColumnsMap).filter(key => {
    const column = allColumnsMap[key];
    return column !== null && column !== undefined;
  });
  
  // Create ordered list: first use columnOrder, then append any missing visible columns
  const orderedColumnKeys = [
    ...columnOrder.filter(key => allVisibleColumnKeys.includes(key)),
    ...allVisibleColumnKeys.filter(key => !columnOrder.includes(key))
  ];
  
  const baseColumns: ColumnsType<any> = formatColumnTitles(
    orderedColumnKeys
      .map(key => allColumnsMap[key])
      .filter(Boolean)
  );

  // Helper function to handle edit price points
  const handleEditPricePoints = (record: any) => {
    // Extract channels and billing cycles for the selected price group
    const uniqueChannels = [...new Set(record.skus.map((sku: Sku) => sku.salesChannel))];
    const uniqueBillingCycles = [...new Set(record.skus.map((sku: Sku) => sku.billingCycle))];
    
    // Get LIX information from first SKU
    const firstSku = record.skus[0];
    const lixKey = firstSku?.lix?.key;
    const lixTreatment = firstSku?.lix?.treatment;
    
    // Set up state for editing selected price group
    const priceGroupEditData = {
      priceGroup: record.priceGroup,
      channels: uniqueChannels,
      billingCycles: uniqueBillingCycles,
      lixKey: lixKey || undefined,
      lixTreatment: lixTreatment || undefined,
    };
    
    setSelectedPriceGroupForEdit(priceGroupEditData);
    setPriceEditorMode('edit');
    setPriceEditorModalOpen(true);
  };

  // Helper function to handle clone price group
  const handleClonePriceGroup = (record: any) => {
    // Extract channels and billing cycles for the selected price group
    const uniqueChannels = [...new Set(record.skus.map((sku: Sku) => sku.salesChannel))];
    const uniqueBillingCycles = [...new Set(record.skus.map((sku: Sku) => sku.billingCycle))];
    
    // Get LIX information from first SKU
    const firstSku = record.skus[0];
    const lixKey = firstSku?.lix?.key;
    const lixTreatment = firstSku?.lix?.treatment;
    
    // Set up state for cloning - will start at Step 1 with clone pre-selected
    const priceGroupCloneData = {
      // Pre-fill context defaults from source price group (user can modify in Step 1)
      channel: uniqueChannels[0],
      billingCycle: uniqueBillingCycles[0], 
      lixKey: lixKey || undefined,
      lixTreatment: lixTreatment || undefined,
      // Set the price group to clone from
      clonePriceGroup: record.priceGroup,
    };
    
    setSelectedPriceGroupForEdit(priceGroupCloneData);
    setPriceEditorMode('clone');
    setPriceEditorModalOpen(true);
  };

  // Create overflow menu for each row
  const createRowMenu = (record: any) => {
    if ('isGroupHeader' in record) return { items: [] };

    return {
      items: [
        {
          key: 'edit',
          label: 'Edit price points in price group',
          onClick: () => handleEditPricePoints(record),
        },
        {
          key: 'clone',
          label: 'Clone price group to create new one',
          onClick: () => handleClonePriceGroup(record),
        },
      ],
    };
  };

  // Combined action column (3-dot menu + chevron in single column)
  const actionColumn = {
    title: '', // No column title
    key: 'actions',
    fixed: 'right' as const,
    width: 64,
    className: 'table-action-column',
    render: (_: any, record: any) => {
      if ('isGroupHeader' in record) return null;

      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px', // Small gap between 3-dot menu and chevron
          height: '100%',
        }}>
          {/* 3-dot menu */}
          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <Dropdown menu={createRowMenu(record)} trigger={['click']} placement="bottomRight">
              <Button 
                size="small"
                type="text"
                style={{ 
                  border: 'none',
                  background: 'transparent',
                  padding: '0',
                  height: '24px',
                  width: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: '1'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%'
                }}>
                  <Ellipsis size={16} />
                </div>
              </Button>
            </Dropdown>
          </div>
          
          {/* Chevron */}
          <ChevronRight 
            size={16} 
            style={{ 
              color: token.colorTextTertiary,
            }} 
          />
        </div>
      );
    },
  };

  // Combine base columns with single action column (contains both 3-dot menu and chevron)
  const columns: ColumnsType<any> = [...baseColumns, actionColumn];

  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Only reset expanded groups when the group structure actually changes (not just sorting within groups)
  useEffect(() => {
    if (groupedPriceGroups) {
      const currentGroupKeys = Object.keys(groupedPriceGroups);
      
      // Check if expanded groups still exist in the new structure
      setExpandedGroups(prevExpanded => 
        prevExpanded.filter(groupKey => currentGroupKeys.includes(groupKey))
      );
    } else {
      // When switching from grouped to ungrouped, clear expanded groups
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
        size="large"
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
            const navigationUrl = `/product/${productId}/price-group/${record.priceGroup.id}?from=${currentTab}`;
            console.log('Navigating to:', navigationUrl, 'Price group data:', record.priceGroup);
            navigate(navigationUrl);
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

      {/* Price Editor Modal */}
      {product && (
        <PriceEditorModal
          open={priceEditorModalOpen}
          onClose={() => {
            setPriceEditorModalOpen(false);
            setSelectedPriceGroupForEdit(null);
          }}
          productName={productName}
          productId={productId}
          product={product}
          directEditMode={priceEditorMode === 'edit'} // Edit: skip Step 1, Clone: start at Step 1
          initialCreationMethod={priceEditorMode === 'clone' ? 'clone' : null} // Pre-select clone method
          prefilledContext={selectedPriceGroupForEdit ? (
            priceEditorMode === 'edit' ? {
              // Edit mode: full context for Step 2
              channel: selectedPriceGroupForEdit.channels[0],
              billingCycle: selectedPriceGroupForEdit.billingCycles[0],
              priceGroupAction: 'update',
              existingPriceGroup: selectedPriceGroupForEdit.priceGroup,
              lixKey: selectedPriceGroupForEdit.lixKey,
              lixTreatment: selectedPriceGroupForEdit.lixTreatment,
            } : {
              // Clone mode: pre-fill defaults for Step 1 (user can modify)
              channel: selectedPriceGroupForEdit.channel,
              billingCycle: selectedPriceGroupForEdit.billingCycle,
              lixKey: selectedPriceGroupForEdit.lixKey,
              lixTreatment: selectedPriceGroupForEdit.lixTreatment,
              clonePriceGroup: selectedPriceGroupForEdit.clonePriceGroup,
            }
          ) : undefined}
        />
      )}
    </div>
  );
};

export default PriceGroupTable; 