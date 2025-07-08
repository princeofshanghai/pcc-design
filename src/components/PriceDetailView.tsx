import React from 'react';
import { List, Typography, Space } from 'antd';
import type { Sku, PricePoint } from '../utils/types';
import { formatCurrency, formatEffectiveDateRange } from '../utils/formatters';
import StatusTag from './StatusTag';
import CountTag from './CountTag';
import DetailSection from './DetailSection';

interface PriceDetailViewProps {
  sku: Sku;
}

const PriceDetailView: React.FC<PriceDetailViewProps> = ({ sku }) => {
  const { price } = sku;

  // Group core currencies (USD, EUR, GBP, CAD, etc.) vs others
  const coreCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SGD', 'HKD'];
  const corePoints = price.pricePoints.filter(p => coreCurrencies.includes(p.currencyCode));
  const otherPoints = price.pricePoints.filter(p => !coreCurrencies.includes(p.currencyCode));

  // Build title with inline status
  const priceTitle = (
    <Space align="center" size="small">
      <span>Price</span>
      {price.status && <StatusTag status={price.status} />}
    </Space>
  );

  // Build subtitle with Price ID and effective dates
  const priceSubtitle = [
    price.id && `${price.id}`,
    (price.startDate || price.endDate) && formatEffectiveDateRange(price.startDate, price.endDate)
  ].filter(Boolean).join(' • ');

  return (
    <DetailSection 
      title={priceTitle}
      subtitle={priceSubtitle}
    >
      {/* Price Points Section */}
      <div style={{ marginTop: '8px' }}>
        <Space align="center" style={{ marginBottom: '12px' }}>
          <Typography.Text strong>Price Points</Typography.Text>
          <CountTag count={price.pricePoints.length} />
          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
            currencies
          </Typography.Text>
        </Space>

        {/* Core Currencies */}
        {corePoints.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <Typography.Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              Core Currencies
            </Typography.Text>
            <List
              size="small"
              dataSource={corePoints}
              renderItem={(pricePoint: PricePoint) => (
                <List.Item style={{ padding: '4px 0', borderBottom: 'none' }}>
                  <Typography.Text>{formatCurrency(pricePoint)}</Typography.Text>
                </List.Item>
              )}
            />
          </div>
        )}

        {/* Other Currencies */}
        {otherPoints.length > 0 && (
          <div>
            <Typography.Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              Other Currencies ({otherPoints.length})
            </Typography.Text>
            <List
              size="small"
              dataSource={otherPoints}
              renderItem={(pricePoint: PricePoint) => (
                                  <List.Item style={{ padding: '2px 0', borderBottom: 'none' }}>
                    <Typography.Text>{formatCurrency(pricePoint)}</Typography.Text>
                  </List.Item>
              )}
            />
          </div>
        )}
      </div>
    </DetailSection>
  );
};

export default PriceDetailView; 