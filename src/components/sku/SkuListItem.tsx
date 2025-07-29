import React from 'react';
import { Card, Space } from 'antd';
import type { Sku } from '../../utils/types';
import StatusTag from '../attributes/StatusTag';
import CopyableId from '../shared/CopyableId';
import SalesChannelDisplay from '../attributes/SalesChannelDisplay';
import BillingCycleDisplay from '../attributes/BillingCycleDisplay';

interface SkuListItemProps {
  sku: Sku;
}

const SkuListItem: React.FC<SkuListItemProps> = ({ sku }) => {
  return (
    <Card size="small" style={{ marginBottom: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SalesChannelDisplay channel={sku.salesChannel} />
          <StatusTag status={sku.status} />
        </Space>
        <Space size={[0, 8]} wrap>
                      <BillingCycleDisplay billingCycle={sku.billingCycle} />
        </Space>
        <CopyableId id={sku.id} />
      </Space>
    </Card>
  );
};

export default SkuListItem; 