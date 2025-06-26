import React from 'react';
import { Card, Space, Tag, Typography } from 'antd';
import type { Sku } from '../utils/types';
import StatusTag from './StatusTag';
import CopyableId from './CopyableId';

const { Text } = Typography;

interface SkuListItemProps {
  sku: Sku;
}

const SkuListItem: React.FC<SkuListItemProps> = ({ sku }) => {
  return (
    <Card size="small" style={{ marginBottom: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>{sku.region}</Text>
          <StatusTag status={sku.status} />
        </Space>
        <Space size={[0, 8]} wrap>
          <Tag>{sku.salesChannel}</Tag>
          <Tag>{sku.billingCycle}</Tag>
        </Space>
        <CopyableId id={sku.id} />
      </Space>
    </Card>
  );
};

export default SkuListItem; 