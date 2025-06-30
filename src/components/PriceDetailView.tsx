import React from 'react';
import { List, Typography, Space } from 'antd';
import type { Sku, PricePoint } from '../utils/types';
import { formatCurrency } from '../utils/formatting';
import AttributeDisplay from './AttributeDisplay';

interface PriceDetailViewProps {
  sku: Sku;
}

const PriceDetailView: React.FC<PriceDetailViewProps> = ({ sku }) => {
  return (
    <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <AttributeDisplay label="Tax Class" tooltip="The tax classification for this SKU.">
          {sku.taxClass}
        </AttributeDisplay>

        <List
          header={<Typography.Text strong>Price Points</Typography.Text>}
          size="small"
          dataSource={sku.price.pricePoints}
          renderItem={(pricePoint: PricePoint) => (
            <List.Item style={{ padding: '8px 0' }}>
              <Typography.Text>{formatCurrency(pricePoint)}</Typography.Text>
            </List.Item>
          )}
          bordered
        />
      </Space>
    </div>
  );
};

export default PriceDetailView; 