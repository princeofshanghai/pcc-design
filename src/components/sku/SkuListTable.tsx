import React from 'react';
import { Table, Typography, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Sku, Status, Product, SalesChannel, BillingCycle, ColumnVisibility, ColumnOrder } from '../../utils/types';
import CopyableId from '../shared/CopyableId';
import StatusTag from '../attributes/StatusTag';
import OverrideIndicator from '../pricing/OverrideIndicator';
import InfoPopover from '../shared/InfoPopover';
import { getChannelIcon } from '../../utils/channelIcons';
import { ChevronRight } from 'lucide-react';

import type { ColumnsType } from 'antd/es/table';
import type { Breakpoint } from 'antd/es/_util/responsiveObserver';
import { toSentenceCase, formatColumnTitles, formatCustomerNumber, generateFakePercentageChange } from '../../utils/formatters';
import { SKU_COLUMNS, DEFAULT_SKU_COLUMNS } from '../../utils/tableConfigurations';

const { Text } = Typography;

interface SkuListTableProps {
  skus: Sku[];
  product: Product;
  visibleColumns?: ColumnVisibility;
  columnOrder?: ColumnOrder;
  currentTab?: string; // Add current tab to remember where we came from
}

// Helper function to check if a SKU has any overrides
const hasSkuOverrides = (sku: Sku, product: Product): boolean => {
  // Helper function to check if an attribute is overridden
  const isOverridden = (skuValue: any) => {
    return skuValue !== undefined && skuValue !== null;
  };

  if (isOverridden(sku.taxClass) && sku.taxClass !== product.taxClass) return true;
  if ((isOverridden(sku.seatMin) && sku.seatMin !== product.seatMin) || 
      (isOverridden(sku.seatMax) && sku.seatMax !== product.seatMax)) return true;
  if (isOverridden(sku.paymentFailureFreeToPaidGracePeriod) && 
      sku.paymentFailureFreeToPaidGracePeriod !== product.paymentFailureFreeToPaidGracePeriod) return true;
  if (isOverridden(sku.paymentFailurePaidToPaidGracePeriod) && 
      sku.paymentFailurePaidToPaidGracePeriod !== product.paymentFailurePaidToPaidGracePeriod) return true;
  if (isOverridden(sku.features) && 
      JSON.stringify(sku.features) !== JSON.stringify(product.features)) return true;

  return false;
};

// Create a helper to get column label from centralized config
const getColumnLabel = (key: string): string => {
  const column = SKU_COLUMNS.find(col => col.key === key);
  return column?.label || toSentenceCase(key);
};

export const getSkuTableColumns = (
  product: Product, 
  navigate: (path: string) => void, 
  visibleColumns: ColumnVisibility = {},
  columnOrder: ColumnOrder = DEFAULT_SKU_COLUMNS
): ColumnsType<Sku> => {
  const { token } = theme.useToken();

  // Define all possible columns
  const allColumnsMap: Record<string, any> = {
    id: {
      title: getColumnLabel('id'),
      dataIndex: 'id',
      key: 'id',
      // ID column always visible
      fixed: 'left',
      render: (_: string, record: Sku) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <CopyableId id={record.id} variant="table" />
            </div>
            {hasSkuOverrides(record, product) && <OverrideIndicator />}
          </div>
        </div>
      ),
      className: 'table-col-first',
    },
    priceGroup: visibleColumns.priceGroup === true ? {
      title: getColumnLabel('priceGroup'),
      key: 'priceGroupId',
      // Hide on screens smaller than 768px (tablet)
      responsive: ['md' as Breakpoint],
      render: (_: any, sku: Sku) => {
        if (!sku.priceGroup.id) return 'N/A';
        
        // First row: Price display (same logic as PriceGroupTable)
        const activePricePoints = sku.priceGroup.pricePoints?.filter((p: any) => p.status === 'Active') || [];
        
        let priceDisplay = null;
        if (activePricePoints.length === 0) {
          priceDisplay = (
            <Text style={{ color: token.colorTextSecondary }}>No active price points</Text>
          );
        } else {
          // Look for USD first
          const usdPrice = activePricePoints.find((p: any) => p.currencyCode === 'USD');
          
          if (usdPrice) {
            // If USD exists, show USD price with additional count
            const additionalActivePricePoints = activePricePoints.length - 1;
            
            // Format currency with tabular-nums only for the numeric part
            const zeroDecimalCurrencies = new Set([
              'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
              'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
            ]);
            
            const amount = zeroDecimalCurrencies.has(usdPrice.currencyCode) 
              ? Math.round(usdPrice.amount) 
              : usdPrice.amount.toFixed(2);
            
            priceDisplay = (
              <div>
                <span style={{ fontWeight: 500 }}>
                  {usdPrice.currencyCode}{' '}
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{amount}</span>
                </span>
                {additionalActivePricePoints > 0 && (
                  <span style={{ color: token.colorTextSecondary }}> +{additionalActivePricePoints} more</span>
                )}
              </div>
            );
          } else {
            // If no USD, show count of non-USD price points
            const count = activePricePoints.length;
            priceDisplay = (
              <Text style={{ color: token.colorText, fontWeight: 500 }}>
                {count} non-USD price point{count === 1 ? '' : 's'}
              </Text>
            );
          }
        }

        return (
          <div>
            {/* First row: Price display */}
            {priceDisplay}
            
            {/* Second row: Clickable Price ID with arrow */}
            <div 
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              style={{ marginTop: '4px' }}
            >
              <Typography.Link
                onClick={() => {
                  navigate(`/product/${product.id}/price-group/${sku.priceGroup.id}`);
                }}
                style={{ 
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Price {sku.priceGroup.id}
                <ChevronRight size={12} />
              </Typography.Link>
            </div>
          </div>
        );
      },
    } : null,

    channel: visibleColumns.channel === true ? {
      title: getColumnLabel('channel'),
      dataIndex: 'salesChannel',
      key: 'channel',
      render: (channel: SalesChannel) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {getChannelIcon(channel)}
          <Typography.Text>{channel}</Typography.Text>
        </div>
      ),
    } : null,
    billingCycle: visibleColumns.billingCycle === true ? {
      title: getColumnLabel('billingCycle'),
      dataIndex: 'billingCycle',
      key: 'billingCycle',
      render: (billingCycle: BillingCycle) => <Typography.Text>{billingCycle}</Typography.Text>,
    } : null,
    lix: visibleColumns.lix === true ? {
      title: getColumnLabel('lix'),
      key: 'experimental',
      // Hide on screens smaller than 1024px (desktop)
      responsive: ['lg' as Breakpoint],
      render: (_: any, sku: Sku) => {
        if (!sku.lix?.key) {
          return <Text style={{ color: token.colorTextSecondary }}>-</Text>;
        }
        
        const lixKey = sku.lix.key;
        
        const tooltipTitle = `LIX Key: ${sku.lix.key}\nTreatment: ${sku.lix.treatment}`;
        
        return (
          <InfoPopover content={tooltipTitle} placement="top">
            <div style={{ cursor: 'pointer' }}>
              <Text>{lixKey}</Text>
              <Text style={{ color: token.colorTextSecondary }}> | </Text>
              <Text style={{ color: token.colorTextSecondary }}>{sku.lix.treatment}</Text>
            </div>
          </InfoPopover>
        );
      },
    } : null,
    status: visibleColumns.status === true ? {
      title: getColumnLabel('status'),
      dataIndex: 'status',
      key: 'status',
      // Status is important, keep visible on all screens
      render: (status: Status) => <StatusTag status={status} variant="small" />, 
    } : null,

    customers: visibleColumns.customers === true ? {
      title: getColumnLabel('customers'),
      key: 'customers',
      // Hide on screens smaller than 1024px (desktop)
      responsive: ['lg' as Breakpoint],
      render: (_: any, sku: Sku) => {
        // Determine if this SKU should show contracts or subscriptions based on channel
        const isFieldChannel = sku.salesChannel === 'Field';
        const customerCount = isFieldChannel ? 
          (sku.activeContracts || 0) :
          (sku.subscriptions || 0);
        
        const isActive = sku.status === 'Active';
        const percentageChange = generateFakePercentageChange(isActive);
        
        return (
          <InfoPopover content="Updated a week ago" placement="top">
            <div>
              {/* First row: Number + percentage change indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 500 }}>
                  {formatCustomerNumber(customerCount)}
                </span>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '2px',
                  color: percentageChange.isPositive ? token.colorSuccess : token.colorError,
                  fontSize: '12px'
                }}>
                  {percentageChange.isPositive ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {percentageChange.value.toFixed(1)}%
                </div>
              </div>
              
              {/* Second row: Secondary text */}
              <Typography.Text style={{ 
                fontSize: token.fontSizeSM, 
                color: token.colorTextSecondary 
              }}>
                {isFieldChannel ? 'contracts' : 'subscriptions'}
              </Typography.Text>
            </div>
          </InfoPopover>
        );
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
  
  const baseColumns = formatColumnTitles(
    orderedColumnKeys
      .map(key => allColumnsMap[key])
      .filter(Boolean)
  );

  // Action column (always visible, fixed to right) - visual indicator for clickability
  const actionColumn = {
    title: '', // No column title
    key: 'actions',
    fixed: 'right' as const,
    width: 48,
    className: 'table-action-column',
    render: (_: any, _record: Sku) => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
        <ChevronRight 
          size={16} 
          style={{ 
            color: token.colorTextTertiary,
          }} 
        />
      </div>
    ),
  };

  // Combine base columns with action column
  return [...baseColumns, actionColumn];
};

const SkuListTable: React.FC<SkuListTableProps> = ({ 
  skus, 
  product, 
  visibleColumns = {},
  columnOrder = DEFAULT_SKU_COLUMNS,
  currentTab = 'skus' 
}) => {
  const navigate = useNavigate();
  const columns = getSkuTableColumns(product, navigate, visibleColumns, columnOrder);

  return (
    <div style={{ marginTop: '16px' }}>
      <Table
        size="middle"
        columns={columns}
        dataSource={skus}
        rowKey="id"
        pagination={false}
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => {
            // Include current tab in URL so back navigation knows where to return
            navigate(`/product/${product.id}/sku/${record.id}?from=${currentTab}`);
          },
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default SkuListTable; 