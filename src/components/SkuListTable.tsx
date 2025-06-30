import React from 'react';
import { Table, Space, Tooltip, theme } from 'antd';
import type { Sku, Status, SalesChannel } from '../utils/types';
import CopyableId from './CopyableId';
import StatusTag from './StatusTag';
import SalesChannelDisplay from './SalesChannelDisplay';
import type { ColumnsType } from 'antd/es/table';
import { formatCurrency, toSentenceCase } from '../utils/formatting';
import CountTag from './CountTag';

interface SkuListTableProps {
  skus: Sku[];
}

const SkuListTable: React.FC<SkuListTableProps> = ({ skus }) => {
  const { token } = theme.useToken();
  const columns: ColumnsType<Sku> = [
    {
      title: toSentenceCase('SKU ID'),
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <CopyableId id={id} />,
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
      key: 'effectiveDate',
      render: (_: any, sku: Sku) => {
        const { startDate, endDate } = sku.price;

        if (!startDate && !endDate) {
          return 'Always';
        }

        const formatDate = (dateString: string) =>
          new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

        if (startDate && endDate) {
          return `${formatDate(startDate)} – ${formatDate(endDate)}`;
        }
        if (startDate) {
          return `From ${formatDate(startDate)}`;
        }
        if (endDate) {
          return `Until ${formatDate(endDate)}`;
        }
        return 'N/A';
      },
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
      title: 'Lix Key',
      dataIndex: 'lix',
      key: 'lix',
      render: (lix) => {
        if (!lix) {
          return null;
        }
        return (
          <Tooltip
            title={
              <span style={{ fontFamily: token.fontFamilyCode, letterSpacing: '-0.5px' }}>
                {lix.treatment}
              </span>
            }
          >
            <span style={{ fontFamily: token.fontFamilyCode, letterSpacing: '-0.5px' }}>
              {lix.key}
            </span>
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

  return <Table columns={columns} dataSource={skus} rowKey="id" pagination={false} size="small" />;
};

export default SkuListTable; 