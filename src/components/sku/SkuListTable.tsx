import React from 'react';
import { Table, Space, Tooltip, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Sku, Status, SalesChannel, Product } from '../../utils/types';
import CopyableId from '../shared/CopyableId';
import StatusTag from '../attributes/StatusTag';
import SalesChannelDisplay from '../attributes/SalesChannelDisplay';
import OverrideIndicator from '../pricing/OverrideIndicator';
import { ExperimentalBadge, ExperimentalTableCell } from '../configuration/ExperimentalBadge';
import { PriceGroupTableCell } from '../configuration/PriceGroupLink';
import { ChangeRequestOrigin } from '../configuration/ChangeRequestOrigin';
import type { ColumnsType } from 'antd/es/table';
import { toSentenceCase, formatEffectiveDateRange } from '../../utils/formatters';

const { Text } = Typography;

interface SkuListTableProps {
  skus: Sku[];
  product: Product;
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

export const getSkuTableColumns = (product: Product): ColumnsType<Sku> => [
  {
    title: toSentenceCase('Name'),
    dataIndex: 'name',
    key: 'name',
    render: (name: string, record: Sku) => (
      <ExperimentalTableCell lixKey={record.lix?.key} lixTreatment={record.lix?.treatment}>
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div>
            <Space size="small" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <Text type="secondary" style={{ fontSize: '13px' }}>{record.id}</Text>
              <CopyableId id={record.id} showId={false} />
              {hasSkuOverrides(record, product) && <OverrideIndicator />}
            </Space>
          </div>
        </div>
      </ExperimentalTableCell>
    ),
    className: 'table-col-first',
  },
  {
    title: toSentenceCase('Effective Date'),
    key: 'effectiveDates',
    render: (_: any, sku: Sku) => formatEffectiveDateRange(sku.priceGroup.startDate, sku.priceGroup.endDate),
  },
  {
    title: toSentenceCase('Price group'),
    key: 'priceGroupId',
    render: (_: any, sku: Sku) => {
      if (!sku.priceGroup.id) return 'N/A';
      return (
        <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <PriceGroupTableCell
            priceGroup={sku.priceGroup}
            product={product}
            onViewPriceGroup={(priceGroupId) => {
              // Navigate to price group detail page
              window.location.href = `/product/${product.id}/price-group/${priceGroupId}`;
            }}
          />
        </div>
      );
    },
  },
  {
    title: toSentenceCase('Origin'),
    key: 'origin',
    render: (_: any, sku: Sku) => {
      if (!sku.origin) return null;
      return (
        <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <ChangeRequestOrigin
            origin={sku.origin}
            createdBy={sku.createdBy}
            createdDate={sku.createdDate}
            requestId={sku.configurationRequestId}
            variant="compact"
            onViewRequest={(requestId: string) => {
              // TODO: Navigate to change request detail page
              console.log('View request:', requestId);
            }}
          />
        </div>
      );
    },
  },
  {
    title: toSentenceCase('Experimental'),
    key: 'experimental',
    render: (_: any, sku: Sku) => {
      if (!sku.lix?.key) return null;
      return (
        <ExperimentalBadge 
          lixKey={sku.lix.key} 
          lixTreatment={sku.lix.treatment}
          variant="default"
        />
      );
    },
  },
  {
    title: toSentenceCase('Features'),
    key: 'features',
    render: (_: any, sku: Sku) => {
      const isStandard = JSON.stringify(sku.features ?? product.features) === JSON.stringify(product.features);
      return (
        <Tooltip title={
          'Standard: Features are the same as the product. Overrides: Features are different from the product.'
        }>
          <span>{isStandard ? 'Standard' : 'Overrides'}</span>
        </Tooltip>
      );
    },
  },
  {
    title: toSentenceCase('Status'),
    dataIndex: 'status',
    key: 'status',
    render: (status: Status) => <StatusTag status={status} />, 
  },
];

const SkuListTable: React.FC<SkuListTableProps> = ({ skus, product }) => {
  const navigate = useNavigate();
  const columns = getSkuTableColumns(product);

  return (
    <div className="content-panel">
      <Table
        columns={columns}
        dataSource={skus}
        rowKey="id"
        pagination={false}
        size="small"
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