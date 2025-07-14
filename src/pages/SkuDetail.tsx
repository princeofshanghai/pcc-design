import React, { useEffect } from 'react';
import { Typography, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../utils/mock-data';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import {
  PageHeader,
  StatusTag,
  DetailSection,
  AttributeDisplay,
  PriceDetailView,
  LobTag,
  FolderTag,
  SalesChannelDisplay,
  OverrideIndicator,
  OverrideComparison
} from '../components';
import { Tag as SkuIcon, AlertCircle } from 'lucide-react';

const { Title } = Typography;

const SkuDetail: React.FC = () => {
  const { productId, skuId } = useParams<{ productId: string; skuId: string }>();
  const { setProductName, setSkuId } = useBreadcrumb();
  const navigate = useNavigate();

  const product = mockProducts.find(p => p.id === productId);
  const sku = product?.skus.find(s => s.id === skuId);

  useEffect(() => {
    if (product) {
      setProductName(product.name);
    }
    if (sku) {
      setSkuId(sku.id);
    }

    return () => {
      setProductName(null);
      setSkuId(null);
    };
  }, [product, sku, setProductName, setSkuId]);

  if (!product || !sku) {
    return (
      <div>
        <Title level={2}>SKU Not Found</Title>
        <p>The requested product or SKU could not be found.</p>
      </div>
    );
  }

  // Helper function to check if an attribute is overridden
  const isOverridden = (skuValue: any) => {
    return skuValue !== undefined && skuValue !== null;
  };

  // Function to detect all SKU overrides for summary
  const getSkuOverrides = () => {
    const overrides = [];
    
    if (isOverridden(sku.taxClass)) {
      overrides.push("Tax Class");
    }
    
    if (isOverridden(sku.seatMin) || isOverridden(sku.seatMax)) {
      overrides.push("Seat Range");
    }
    
    if (isOverridden(sku.paymentFailureFreeToPaidGracePeriod)) {
      overrides.push("Free-to-Paid Grace Period");
    }
    
    if (isOverridden(sku.paymentFailurePaidToPaidGracePeriod)) {
      overrides.push("Paid-to-Paid Grace Period");
    }
    
    if (isOverridden(sku.features)) {
      overrides.push("Features");
    }
    
    return overrides;
  };

  const skuOverrides = getSkuOverrides();

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <PageHeader
        preTitle={
          <Space size="small">
            <SkuIcon size={14} />
            <span>SKU</span>
          </Space>
        }
        title={sku.id}
        onBack={() => navigate(`/product/${product.id}`)}
        tagContent={<StatusTag status={sku.status} />}
      />

      {/* SKU Overrides Summary */}
      <DetailSection title="SKU Overrides">
        {skuOverrides.length > 0 ? (
          <Space align="center" size="small">
            <AlertCircle size={16} color="#fa8c16" />
            <Typography.Text>
              This SKU overrides: <Typography.Text strong>{skuOverrides.join(', ')}</Typography.Text>
            </Typography.Text>
          </Space>
        ) : (
          <Typography.Text type="secondary">
            This SKU uses all product defaults with no overrides.
          </Typography.Text>
        )}
      </DetailSection>

      {/* Basic SKU Information */}
      <DetailSection title="SKU Information">
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <AttributeDisplay label="Product" layout="horizontal">
            {product.name}
          </AttributeDisplay>
          
          <AttributeDisplay label="Line of Business" layout="horizontal">
            <LobTag lob={product.lob} />
          </AttributeDisplay>
          
                      <AttributeDisplay label="Folder" layout="horizontal">
              <FolderTag folder={product.folder} lob={product.lob} />
            </AttributeDisplay>
          
          <AttributeDisplay label="Status" layout="horizontal">
            <StatusTag status={sku.status} />
          </AttributeDisplay>
                </Space>
      </DetailSection>

      {/* Configuration Section */}
      <DetailSection title="Configuration">
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <AttributeDisplay label="Region" layout="horizontal">
            {sku.region}
          </AttributeDisplay>
          
          <AttributeDisplay label="Sales Channel" layout="horizontal">
            <SalesChannelDisplay channel={sku.salesChannel} />
          </AttributeDisplay>
          
          <AttributeDisplay label="Billing Cycle" layout="horizontal">
            {sku.billingCycle}
          </AttributeDisplay>
          
          <AttributeDisplay label="Revenue Recognition" layout="horizontal">
            {sku.revenueRecognition}
          </AttributeDisplay>
        </Space>
      </DetailSection>

      {/* Price Group Section */}
      <PriceDetailView sku={sku} product={product} />

      {/* Overridable Attributes Section */}
      <DetailSection title="Attributes">
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <AttributeDisplay label="Tax Class" layout="horizontal">
            <Space size="small">
              <span>{sku.taxClass || product.taxClass}</span>
              {isOverridden(sku.taxClass) && <OverrideIndicator />}
            </Space>
            {isOverridden(sku.taxClass) && (
              <OverrideComparison skuValue={sku.taxClass} productValue={product.taxClass} />
            )}
          </AttributeDisplay>

          <AttributeDisplay label="Seat Range" layout="horizontal">
            <Space size="small">
              <span>{(sku.seatMin ?? product.seatMin)} - {(sku.seatMax ?? product.seatMax)} seats</span>
              {(isOverridden(sku.seatMin) || isOverridden(sku.seatMax)) && <OverrideIndicator />}
            </Space>
            {(isOverridden(sku.seatMin) || isOverridden(sku.seatMax)) && (
              <OverrideComparison 
                skuValue={`${(sku.seatMin ?? product.seatMin)} - ${(sku.seatMax ?? product.seatMax)} seats`} 
                productValue={`${product.seatMin} - ${product.seatMax} seats`} 
              />
            )}
          </AttributeDisplay>

          <AttributeDisplay label="Free-to-Paid Grace Period" layout="horizontal">
            <Space size="small">
              <span>{(sku.paymentFailureFreeToPaidGracePeriod ?? product.paymentFailureFreeToPaidGracePeriod)} days</span>
              {isOverridden(sku.paymentFailureFreeToPaidGracePeriod) && <OverrideIndicator />}
            </Space>
            {isOverridden(sku.paymentFailureFreeToPaidGracePeriod) && (
              <OverrideComparison 
                skuValue={`${sku.paymentFailureFreeToPaidGracePeriod} days`} 
                productValue={`${product.paymentFailureFreeToPaidGracePeriod} days`} 
              />
            )}
          </AttributeDisplay>

          <AttributeDisplay label="Paid-to-Paid Grace Period" layout="horizontal">
            <Space size="small">
              <span>{(sku.paymentFailurePaidToPaidGracePeriod ?? product.paymentFailurePaidToPaidGracePeriod)} days</span>
              {isOverridden(sku.paymentFailurePaidToPaidGracePeriod) && <OverrideIndicator />}
            </Space>
            {isOverridden(sku.paymentFailurePaidToPaidGracePeriod) && (
              <OverrideComparison 
                skuValue={`${sku.paymentFailurePaidToPaidGracePeriod} days`} 
                productValue={`${product.paymentFailurePaidToPaidGracePeriod} days`} 
              />
            )}
          </AttributeDisplay>
        </Space>
      </DetailSection>

      {/* Features Section */}
      {((sku.features && sku.features.length > 0) || (product.features && product.features.length > 0)) && (
        <DetailSection 
          title={
            <Space size="small">
              <span>Features</span>
              {isOverridden(sku.features) && <OverrideIndicator />}
            </Space>
          } 
          noBodyPadding
        >
          <div style={{ padding: '16px 24px' }}>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {(sku.features && sku.features.length > 0
                ? sku.features
                : product.features || []).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
            </ul>
          </div>
          {isOverridden(sku.features) && (
            <div style={{ padding: '16px 24px', backgroundColor: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
              <OverrideComparison 
                skuValue={`${sku.features?.length || 0} features`} 
                productValue={`${product.features?.length || 0} features`} 
              />
              <div style={{ marginTop: '12px' }}>
                <Typography.Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                  Product Default Features:
                </Typography.Text>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {(product.features || []).map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DetailSection>
      )}
    </Space>
  );
};

export default SkuDetail; 