import React from 'react';
import { Card, Space } from 'antd';
import type { Sku } from '../../utils/types';
import StatusTag from '../attributes/StatusTag';
import CopyableId from '../shared/CopyableId';
import ChannelTag from '../attributes/ChannelTag';
import BillingCycleTag from '../attributes/BillingCycleTag';

interface SkuListItemProps {
  sku: Sku;
}

const SkuListItem: React.FC<SkuListItemProps> = ({ sku }) => {
  return (
    <Card size="small" style={{ marginBottom: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ChannelTag channel={sku.salesChannel} variant="small" showIcon={false} />
          <StatusTag status={sku.status} variant="small" showIcon={false} />
        </Space>
        <Space size={[0, 8]} wrap>
          <BillingCycleTag billingCycle={sku.billingCycle} variant="small" showIcon={false} />
        </Space>
        <CopyableId id={sku.id} />
      </Space>
    </Card>
  );
};

export default SkuListItem; 