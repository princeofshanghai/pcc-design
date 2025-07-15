import React from 'react';
import { List, Typography, Space, Button } from 'antd';
import type { Sku, PricePoint, Product } from '../../utils/types';
import { formatCurrency, formatEffectiveDateRange } from '../../utils/formatters';
import StatusTag from '../attributes/StatusTag';
import CountTag from '../attributes/CountTag';
import PageSection from '../layout/PageSection';
import AttributeDisplay from '../attributes/AttributeDisplay';
import { Link } from 'react-router-dom';

interface PriceDetailViewProps {
  sku: Sku;
  product: Product;
}

const PriceDetailView: React.FC<PriceDetailViewProps> = ({ sku, product }) => {
  const price = sku.priceGroup;

  // Count how many SKUs in this product use the same price group
  const skusWithSamePriceGroup = product.skus.filter(s => s.priceGroup.id === price.id);
  const otherSkusCount = skusWithSamePriceGroup.length - 1; // Exclude current SKU

  // Group core currencies (USD, EUR, GBP, CAD, etc.) vs others
  const coreCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SGD', 'HKD'];
  const corePoints = price.pricePoints.filter((p: PricePoint) => coreCurrencies.includes(p.currencyCode));
  const otherPoints = price.pricePoints.filter((p: PricePoint) => !coreCurrencies.includes(p.currencyCode));

  // Build title with inline status
  const priceTitle = (
    <Space align="center" size="small">
      <span>Price Group</span>
      {price.status && <StatusTag status={price.status} />}
    </Space>
  );

  // Build subtitle with Price Group ID and effective dates
  const priceSubtitle = [
    price.id && `${price.id}`,
    (price.startDate || price.endDate) && formatEffectiveDateRange(price.startDate, price.endDate)
  ].filter(Boolean).join(' • ');

  return (
    <Space direction="vertical" size={48} style={{ width: '100%' }}>
      <PageSection 
        title={priceTitle}
        subtitle={priceSubtitle}
      >
        <div className="content-panel">
          {/* Price Group Information */}
          <div style={{ marginBottom: '24px' }}>
            <AttributeDisplay label="Price Group ID" layout="horizontal">
              <Typography.Text code>{price.id}</Typography.Text>
            </AttributeDisplay>
          </div>

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
        </div>
      </PageSection>

      {/* SKUs using this price group section */}
      {otherSkusCount > 0 && (
        <PageSection 
          title={
            <Space>
              <span>SKUs using this price group</span>
              <CountTag count={otherSkusCount + 1} />
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                total SKUs
              </Typography.Text>
            </Space>
          }
          actions={
            <Link to={`/product/${product.id}?priceGroupFilter=${price.id}`}>
              <Button type="primary">
                View all SKUs
              </Button>
            </Link>
          }
        >
          <div className="content-panel">
            <Typography.Text type="secondary">
              {otherSkusCount + 1} SKU{otherSkusCount !== 0 ? 's' : ''} use{otherSkusCount === 0 ? 's' : ''} this price group. 
              Click "View all SKUs" to see them in the product's SKU tab with this price group pre-filtered.
            </Typography.Text>
          </div>
        </PageSection>
      )}
    </Space>
  );
};

export default PriceDetailView; 