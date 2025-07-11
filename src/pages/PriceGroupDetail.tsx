import React, { useEffect } from 'react';
import { Typography, Space, List } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../utils/mock-data';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import PageHeader from '../components/PageHeader';
import StatusTag from '../components/StatusTag';
import DetailSection from '../components/DetailSection';
import AttributeDisplay from '../components/AttributeDisplay';
import CountTag from '../components/CountTag';
import SkuListTable from '../components/SkuListTable';
import { formatCurrency, formatEffectiveDateRange } from '../utils/formatters';
import { DollarSign } from 'lucide-react';
import type { PricePoint } from '../utils/types';

const { Title } = Typography;

const PriceGroupDetail: React.FC = () => {
  const { productId, priceGroupId } = useParams<{ productId: string; priceGroupId: string }>();
  const { setProductName, setPriceGroupId } = useBreadcrumb();
  const navigate = useNavigate();

  const product = mockProducts.find(p => p.id === productId);
  
  // Find all SKUs that use this price group
  const skusWithPriceGroup = product?.skus.filter(sku => sku.price.id === priceGroupId) || [];
  
  // Get the price group data from the first SKU (all SKUs with same price group have same price data)
  const priceGroup = skusWithPriceGroup[0]?.price;

  useEffect(() => {
    if (product) {
      setProductName(product.name);
    }
    if (priceGroupId) {
      setPriceGroupId(priceGroupId);
    }

    return () => {
      setProductName(null);
      setPriceGroupId(null);
    };
  }, [product, priceGroupId, setProductName, setPriceGroupId]);

  if (!product) {
    return (
      <div>
        <Title level={2}>Product Not Found</Title>
        <p>The requested product could not be found.</p>
      </div>
    );
  }

  if (!priceGroup || skusWithPriceGroup.length === 0) {
    return (
      <div>
        <Title level={2}>Price Group Not Found</Title>
        <p>The requested price group could not be found in this product.</p>
      </div>
    );
  }

  // Group core currencies vs others
  const coreCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SGD', 'HKD'];
  const corePoints = priceGroup.pricePoints.filter(p => coreCurrencies.includes(p.currencyCode));
  const otherPoints = priceGroup.pricePoints.filter(p => !coreCurrencies.includes(p.currencyCode));

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <PageHeader
        preTitle={
          <Space size="small">
            <DollarSign size={14} />
            <span>Price Group</span>
          </Space>
        }
        title={priceGroupId!}
        onBack={() => navigate(`/product/${product.id}`)}
        tagContent={priceGroup.status && <StatusTag status={priceGroup.status} />}
        subtitle={formatEffectiveDateRange(priceGroup.startDate, priceGroup.endDate)}
      />

      {/* Price Group Information */}
      <DetailSection title="Price Group Details">
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <AttributeDisplay label="Price Group ID" layout="horizontal">
            <Typography.Text code>{priceGroup.id}</Typography.Text>
          </AttributeDisplay>
          
          {priceGroup.status && (
            <AttributeDisplay label="Status" layout="horizontal">
              <StatusTag status={priceGroup.status} />
            </AttributeDisplay>
          )}
          
          {(priceGroup.startDate || priceGroup.endDate) && (
            <AttributeDisplay label="Effective Period" layout="horizontal">
              {formatEffectiveDateRange(priceGroup.startDate, priceGroup.endDate)}
            </AttributeDisplay>
          )}
        </Space>
      </DetailSection>

      {/* Price Points */}
      <DetailSection 
        title={
          <Space align="center" size="small">
            <span>Price Points</span>
            <CountTag count={priceGroup.pricePoints.length} />
            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
              currencies
            </Typography.Text>
          </Space>
        }
      >
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
      </DetailSection>

      {/* SKUs Using This Price Group */}
      <DetailSection 
        title={
          <Space>
            <span>SKUs Using This Price Group</span>
            <CountTag count={skusWithPriceGroup.length} />
          </Space>
        } 
        noBodyPadding
      >
        <SkuListTable skus={skusWithPriceGroup} product={product} />
      </DetailSection>
    </Space>
  );
};

export default PriceGroupDetail; 