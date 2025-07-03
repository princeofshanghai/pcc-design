import React from 'react';
import { List, Typography, Space, Descriptions } from 'antd';
import { ArrowRight } from 'lucide-react';
import type { Sku, PricePoint, Product } from '../utils/types';
import { formatCurrency, toSentenceCase } from '../utils/formatters';

interface PriceDetailViewProps {
  sku: Sku;
  product: Product;
}

const PriceDetailView: React.FC<PriceDetailViewProps> = ({ sku, product }) => {
  const overrides = [];

  if (sku.taxClass && sku.taxClass !== product.taxClass) {
    overrides.push({
      label: 'Tax Class',
      productValue: product.taxClass,
      skuValue: sku.taxClass,
    });
  }

  if (sku.paymentFailureFreeToPaidGracePeriod && sku.paymentFailureFreeToPaidGracePeriod !== product.paymentFailureFreeToPaidGracePeriod) {
    overrides.push({
      label: 'Grace Period (Free-Paid)',
      productValue: `${product.paymentFailureFreeToPaidGracePeriod} days`,
      skuValue: `${sku.paymentFailureFreeToPaidGracePeriod} days`,
    });
  }

  if (sku.paymentFailurePaidToPaidGracePeriod && sku.paymentFailurePaidToPaidGracePeriod !== product.paymentFailurePaidToPaidGracePeriod) {
    overrides.push({
      label: 'Grace Period (Paid-Paid)',
      productValue: `${product.paymentFailurePaidToPaidGracePeriod} days`,
      skuValue: `${sku.paymentFailurePaidToPaidGracePeriod} days`,
    });
  }

  if (sku.seatMin && sku.seatMin !== product.seatMin) {
    overrides.push({
      label: 'Seat Min',
      productValue: product.seatMin,
      skuValue: sku.seatMin,
    });
  }

  if (sku.seatMax && sku.seatMax !== product.seatMax) {
    overrides.push({
      label: 'Seat Max',
      productValue: product.seatMax,
      skuValue: sku.seatMax,
    });
  }

  // Naive array comparison. For more complex scenarios, a deep equals would be better.
  if (sku.digitalGoods && JSON.stringify(sku.digitalGoods) !== JSON.stringify(product.digitalGoods)) {
     overrides.push({
      label: 'Digital Goods',
      productValue: product.digitalGoods?.join(', ') || 'None',
      skuValue: sku.digitalGoods?.join(', ') || 'None',
    });
  }
  
  return (
    <div style={{ padding: '0 24px 16px 24px', background: '#fafafa' }}>
      {overrides.length > 0 && (
        <div style={{ padding: '16px 0' }}>
          <Typography.Text strong>Overrides</Typography.Text>
          <Descriptions
            bordered
            column={1}
            size="small"
            style={{ marginTop: '8px' }}
            items={overrides.map(o => ({
              key: o.label,
              label: toSentenceCase(o.label),
              children: (
                <Space align="center">
                  <Typography.Text delete>{o.productValue}</Typography.Text>
                  <ArrowRight size={14} color="#888" />
                  <Typography.Text>{o.skuValue}</Typography.Text>
                </Space>
              ),
            }))}
          />
        </div>
      )}
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