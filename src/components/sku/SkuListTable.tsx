import React from 'react';
import { Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import type { Sku, Status, Product, SalesChannel, BillingCycle } from '../../utils/types';
import CopyableId from '../shared/CopyableId';
import StatusTag from '../attributes/StatusTag';
import SalesChannelDisplay from '../attributes/SalesChannelDisplay';
import BillingCycleDisplay from '../attributes/BillingCycleDisplay';
import OverrideIndicator from '../pricing/OverrideIndicator';
import { ExperimentalBadge, ExperimentalTableCell } from '../configuration/ExperimentalBadge';
import type { ColumnsType } from 'antd/es/table';
import type { Breakpoint } from 'antd/es/_util/responsiveObserver';
import { toSentenceCase, formatValidityRange, formatColumnTitles } from '../../utils/formatters';
import { SKU_COLUMNS } from '../../utils/tableConfigurations';

const { Text } = Typography;

interface SkuListTableProps {
  skus: Sku[];
  product: Product;
  hidePriceGroupColumn?: boolean;
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

export const getSkuTableColumns = (product: Product, navigate: (path: string) => void, hidePriceGroupColumn: boolean = false): ColumnsType<Sku> => formatColumnTitles([
  {
    title: getColumnLabel('id'),
    dataIndex: 'id',
    key: 'id',
    // ID column always visible
    fixed: 'left',
    minWidth: 150,
    render: (_: string, record: Sku) => (
      <ExperimentalTableCell lixKey={record.lix?.key} lixTreatment={record.lix?.treatment}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <CopyableId id={record.id} variant="prominent" />
            </div>
            {hasSkuOverrides(record, product) && <OverrideIndicator />}
            {record.lix?.key && (
              <ExperimentalBadge 
                lixKey={record.lix.key} 
                lixTreatment={record.lix.treatment} 
                variant="compact" 
              />
            )}
          </div>
        </div>
      </ExperimentalTableCell>
    ),
    className: 'table-col-first',
  },
  {
    title: getColumnLabel('channel'),
    dataIndex: 'salesChannel',
    key: 'channel',
    render: (channel: SalesChannel) => <SalesChannelDisplay channel={channel} />,
  },
  {
    title: getColumnLabel('billingCycle'),
    dataIndex: 'billingCycle',
    key: 'billingCycle',
    render: (billingCycle: BillingCycle) => <BillingCycleDisplay billingCycle={billingCycle} />,
  },
  ...(hidePriceGroupColumn ? [] : [{
    title: getColumnLabel('priceGroup'),
    key: 'priceGroupId',
    // Hide on screens smaller than 768px (tablet)
    responsive: ['md' as Breakpoint],
    render: (_: any, sku: Sku) => {
      if (!sku.priceGroup.id) return 'N/A';
      return (
        <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <Typography.Link
            onClick={() => {
              navigate(`/product/${product.id}/price-group/${sku.priceGroup.id}`);
            }}
          >
            {sku.priceGroup.id}
          </Typography.Link>
        </div>
      );
    },
  }]),

  {
    title: getColumnLabel('lix'),
    key: 'experimental',
    // Hide on screens smaller than 1024px (desktop)
    responsive: ['lg' as Breakpoint],
    render: (_: any, sku: Sku) => {
      if (!sku.lix?.key) {
        return (
          <Text type="secondary" style={{ color: '#999' }}>-</Text>
        );
      }
      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
            <FlaskConical size={12} color="#fa8c16" />
            <Text style={{ fontFamily: 'monospace', letterSpacing: '-0.02em' }}>{sku.lix.key}</Text>
          </div>
          {sku.lix.treatment && (
            <div>
              <Text type="secondary" style={{ fontSize: '13px', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>{sku.lix.treatment}</Text>
            </div>
          )}
        </div>
      );
    },
  },
  {
    title: getColumnLabel('validity'),
    key: 'effectiveDates',
    // Hide on screens smaller than 1024px (desktop)
    responsive: ['lg' as Breakpoint],
    render: (_: any, sku: Sku) => formatValidityRange(sku.priceGroup.validFrom, sku.priceGroup.validTo),
  },
  {
    title: getColumnLabel('status'),
    dataIndex: 'status',
    key: 'status',
    // Status is important, keep visible on all screens
    render: (status: Status) => <StatusTag status={status} />, 
  },
]);

const SkuListTable: React.FC<SkuListTableProps> = ({ skus, product, hidePriceGroupColumn = false }) => {
  const navigate = useNavigate();
  const columns = getSkuTableColumns(product, navigate, hidePriceGroupColumn);

  return (
    <div className="content-panel">
      <Table
        size="small"
        columns={columns}
        dataSource={skus}
        rowKey="id"
        pagination={false}
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/product/${product.id}/sku/${record.id}`);
          },
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default SkuListTable; 