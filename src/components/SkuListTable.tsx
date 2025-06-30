import React from 'react';
import { Table, Space, Tooltip } from 'antd';
import type { Sku, Status, SalesChannel, Product } from '../utils/types';
import CopyableId from './CopyableId';
import StatusTag from './StatusTag';
import SalesChannelDisplay from './SalesChannelDisplay';
import type { ColumnsType } from 'antd/es/table';
import { formatCurrency, toSentenceCase, formatEffectiveDateRange } from '../utils/formatting';
import CountTag from './CountTag';
import PriceDetailView from './PriceDetailView';
import { FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SkuListTableProps {
  skus: Sku[];
  product: Product;
}

const SkuListTable: React.FC<SkuListTableProps> = ({ skus, product }) => {
  const columns: ColumnsType<Sku> = [
    {
      title: toSentenceCase('SKU ID'),
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Space>
          <Link to={`/product/${product.id}/sku/${id}`}>{id}</Link>
          <CopyableId id={id} showId={false} />
        </Space>
      ),
      className: 'table-col-first',
    },
    {
      title: toSentenceCase('Region'),
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: toSentenceCase('Sales Channel'),
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
      dataIndex: 'price',
      key: 'effectiveDates',
      render: (price: Sku['price']) => formatEffectiveDateRange(price.startDate, price.endDate),
    },
    {
      title: toSentenceCase('Amount'),
      key: 'amount',
      render: (_: any, sku: Sku) => {
        const usdPrice = sku.price.pricePoints.find(p => p.currencyCode === 'USD');

        if (!usdPrice) {
          return 'N/A';
        }

        const otherPricePointsCount = sku.price.pricePoints.length - 1;

        return (
          <Space>
            <span>{formatCurrency(usdPrice)}</span>
            {otherPricePointsCount > 0 && (
              <CountTag count={otherPricePointsCount} />
            )}
          </Space>
        );
      },
    },
    {
      title: toSentenceCase('LIX'),
      key: 'lix',
      render: (_: any, sku: Sku) => {
        if (!sku.lix) {
          return null;
        }

        return (
          <Tooltip title={`Treatment: ${sku.lix.treatment}`}>
            <Space>
              <FlaskConical size={14} />
              <span>{sku.lix.key}</span>
            </Space>
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

  return (
    <div className="content-panel">
      <Table
        columns={columns}
        dataSource={skus}
        rowKey="id"
        pagination={false}
        size="small"
        expandable={{
          expandedRowRender: (record) => (
            <PriceDetailView sku={record} product={product} />
          ),
          rowExpandable: (record) => record.id !== 'Not Expandable',
        }}
      />
    </div>
  );
};

export default SkuListTable; 