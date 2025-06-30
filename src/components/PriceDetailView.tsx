import React from 'react';
import { List, Typography, Space } from 'antd';
import type { Sku, PricePoint } from '../utils/types';
import { formatCurrency } from '../utils/formatting';

interface PriceDetailViewProps {
  sku: Sku;
}

const PriceDetailView: React.FC<PriceDetailViewProps> = ({ sku }) => {
  return (
    <div style={{ padding: '0 24px 16px 24px' }}>
      <List
        header={<Typography.Text strong>Price Points</Typography.Text>}
        size="small"
        dataSource={sku.price.pricePoints}
        renderItem={(pricePoint: PricePoint) => (
          <List.Item>
            <Typography.Text>{formatCurrency(pricePoint)}</Typography.Text>
          </List.Item>
        )}
      />
    </div>
  );
};

export default PriceDetailView; 