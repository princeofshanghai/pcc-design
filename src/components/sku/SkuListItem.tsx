import React from 'react';
import { Card, Space, Typography } from 'antd';
import type { Sku } from '../../utils/types';
import StatusTag from '../attributes/StatusTag';
import CopyableId from '../shared/CopyableId';
import SalesChannelDisplay from '../attributes/SalesChannelDisplay';

interface SkuListItemProps {
  sku: Sku;
}

const SkuListItem: React.FC<SkuListItemProps> = ({ sku }) => {
  return (
    <Card size="small" style={{ marginBottom: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SalesChannelDisplay channel={sku.salesChannel} variant="small" />
          <StatusTag status={sku.status} variant="small" />
        </Space>
        <Space size={[0, 8]} wrap>
          <Typography.Text>{sku.billingCycle}</Typography.Text>
        </Space>
        <CopyableId id={sku.id} />
      </Space>
    </Card>
  );
};

export default SkuListItem; 