import React from 'react';
import { Table, Space, Tooltip } from 'antd';
import type { Sku, Status, SalesChannel, Product } from '../../utils/types';
import CopyableId from '../shared/CopyableId';
import StatusTag from '../attributes/StatusTag';
import SalesChannelDisplay from '../attributes/SalesChannelDisplay';
import OverrideIndicator from '../pricing/OverrideIndicator';
import { ExperimentalBadge, ExperimentalTableCell } from '../configuration/ExperimentalBadge';
import { PriceGroupTableCell } from '../configuration/PriceGroupLink';
import { ConfigurationOrigin } from '../configuration/ConfigurationOrigin';
import type { ColumnsType } from 'antd/es/table';
import { toSentenceCase, formatEffectiveDateRange } from '../../utils/formatters';
import { Link } from 'react-router-dom';

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
    title: toSentenceCase('ID'),
    dataIndex: 'id',
    key: 'id',
    render: (id: string, record: Sku) => (
      <ExperimentalTableCell lixKey={record.lix?.key} lixTreatment={record.lix?.treatment}>
        <Space>
          <Link to={`/product/${product.id}/sku/${id}`}>{id}</Link>
          <CopyableId id={id} showId={false} />
          {hasSkuOverrides(record, product) && <OverrideIndicator />}
        </Space>
      </ExperimentalTableCell>
    ),
    className: 'table-col-first',
  },
  {
    title: toSentenceCase('Name'),
    dataIndex: 'name',
    key: 'name',
    render: (name: string, record: Sku) => (
      <ExperimentalTableCell lixKey={record.lix?.key} lixTreatment={record.lix?.treatment}>
        {name}
      </ExperimentalTableCell>
    ),
  },
  {
    title: toSentenceCase('Channel'),
    dataIndex: 'salesChannel',
    key: 'salesChannel',
    render: (channel: SalesChannel) => <SalesChannelDisplay channel={channel} />, 
  },
  {
    title: toSentenceCase('Billing Cycle'),
    dataIndex: 'billingCycle',
    key: 'billingCycle',
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
        <PriceGroupTableCell
          priceGroup={sku.priceGroup}
          product={product}
          onViewPriceGroup={(priceGroupId) => {
            // Navigate to price group detail page
            window.location.href = `/product/${product.id}/price-group/${priceGroupId}`;
          }}
        />
      );
    },
  },
  {
    title: toSentenceCase('Origin'),
    key: 'origin',
    render: (_: any, sku: Sku) => {
      if (!sku.origin) return null;
      return (
        <ConfigurationOrigin
          origin={sku.origin}
          createdBy={sku.createdBy}
          createdDate={sku.createdDate}
          requestId={sku.configurationRequestId}
          variant="compact"
          onViewRequest={(requestId: string) => {
            // TODO: Navigate to configuration request detail page
            console.log('View request:', requestId);
          }}
        />
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
  const columns = getSkuTableColumns(product);

  return (
    <div className="content-panel">
      <Table
        columns={columns}
        dataSource={skus}
        rowKey="id"
        pagination={false}
        size="small"
      />
    </div>
  );
};

export default SkuListTable; 