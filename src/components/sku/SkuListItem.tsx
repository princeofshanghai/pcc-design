import React from 'react';
import { Card, Space, Typography } from 'antd';
import type { Sku } from '../../utils/types';
import StatusTag from '../attributes/StatusTag';
import CopyableId from '../shared/CopyableId';
import { getChannelIcon } from '../../utils/channelIcons';

interface SkuListItemProps {
  sku: Sku;
}

const SkuListItem: React.FC<SkuListItemProps> = ({ sku }) => {
  return (
    <Card size="small" style={{ marginBottom: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {getChannelIcon(sku.salesChannel)}
            <Typography.Text>{sku.salesChannel}</Typography.Text>
          </div>
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