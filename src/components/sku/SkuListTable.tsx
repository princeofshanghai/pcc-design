import React from 'react';
import { Table, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import type { Sku, Status, Product } from '../../utils/types';
import CopyableId from '../shared/CopyableId';
import StatusTag from '../attributes/StatusTag';
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
    title: getColumnLabel('name'),
    dataIndex: 'name',
    key: 'name',
    // Name column always visible and has minimum width
    fixed: 'left',
    width: 280,
    render: (name: string, record: Sku) => (
      <ExperimentalTableCell lixKey={record.lix?.key} lixTreatment={record.lix?.treatment}>
        <div>
          <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            {name}
            {record.lix?.key && (
              <ExperimentalBadge 
                lixKey={record.lix.key} 
                lixTreatment={record.lix.treatment} 
                variant="compact" 
              />
            )}
          </div>
          <div>
            <Space size="small" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <CopyableId id={record.id} size="small" />
              {hasSkuOverrides(record, product) && <OverrideIndicator />}
            </Space>
          </div>
        </div>
      </ExperimentalTableCell>
    ),
    className: 'table-col-first',
  },
  {
    title: getColumnLabel('validity'),
    key: 'effectiveDates',
    width: 160,
    // Hide on screens smaller than 1024px (desktop)
    responsive: ['lg' as Breakpoint],
    render: (_: any, sku: Sku) => formatValidityRange(sku.priceGroup.validFrom, sku.priceGroup.validTo),
  },
  ...(hidePriceGroupColumn ? [] : [{
    title: getColumnLabel('priceGroup'),
    key: 'priceGroupId',
    width: 180,
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
            {sku.priceGroup.name}
          </Typography.Link>
        </div>
      );
    },
  }]),

  {
    title: getColumnLabel('lix'),
    key: 'experimental',
    width: 140,
    // Hide on screens smaller than 1024px (desktop)
    responsive: ['lg' as Breakpoint],
    render: (_: any, sku: Sku) => {
      if (!sku.lix?.key) return null;
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
    title: getColumnLabel('status'),
    dataIndex: 'status',
    key: 'status',
    width: 100,
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
        columns={columns}
        dataSource={skus}
        rowKey="id"
        pagination={false}
        // Enable horizontal scrolling for responsive behavior
        scroll={{ x: 'max-content' }}
        // Use smaller size on mobile devices
        size={window.innerWidth < 768 ? 'small' : 'middle'}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/product/${product.id}/sku/${record.id}`);
          },
          style: { cursor: 'pointer' },
          onMouseEnter: (e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.backgroundColor = '';
          },
        })}
      />
    </div>
  );
};

export default SkuListTable; 