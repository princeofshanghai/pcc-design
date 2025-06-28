import React, { useState } from 'react';
import { Table, Tag, Space, Modal } from 'antd';
import type { Sku, Status } from '../utils/types';
import CopyableId from './CopyableId';
import StatusTag from './StatusTag';
import type { ColumnsType } from 'antd/es/table';
import { formatCurrency, toSentenceCase } from '../utils/formatting';

interface SkuListTableProps {
  skus: Sku[];
}

const SkuListTable: React.FC<SkuListTableProps> = ({ skus }) => {
  const columns: ColumnsType<Sku> = [
    {
      title: toSentenceCase('SKU ID'),
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <CopyableId id={id} />,
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
      render: (channel: string) => <Tag>{channel}</Tag>,
    },
    {
      title: toSentenceCase('Billing Cycle'),
      dataIndex: 'billingCycle',
      key: 'billingCycle',
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
              <Tag style={{ borderRadius: '12px' }}>
                +{otherPricePointsCount}
              </Tag>
            )}
          </Space>
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