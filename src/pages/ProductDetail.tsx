import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Space, Row, Col, Tag, Tabs } from 'antd';
import { mockProducts } from '../utils/mock-data';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { useLayout } from '../context/LayoutContext';
import PageHeader from '../components/PageHeader';
import SkuListTable from '../components/SkuListTable';
import AttributeDisplay from '../components/AttributeDisplay';
import CopyableId from '../components/CopyableId';
import DetailSection from '../components/DetailSection';
import DigitalGoodsTable from '../components/DigitalGoodsTable';
import StatusTag from '../components/StatusTag';

const { Title } = Typography;

const renderValue = (value: any, isBoolean = false) => {
  if (isBoolean) {
    return value ? 'Yes' : 'No';
  }
  if (Array.isArray(value)) {
    return (
      <Space direction="vertical" size={0}>
        {value.map(item => <span key={item}>- {item}</span>)}
      </Space>
    );
  }
  return value;
};

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { setProductName } = useBreadcrumb();
  const { setMaxWidth } = useLayout();
  const product = mockProducts.find(p => p.id === productId);

  useEffect(() => {
    // Set the max-width for this page
    setMaxWidth('1024px');

    // Reset the max-width when the component unmounts
    return () => {
      setMaxWidth('1024px'); // Or your default width
    };
  }, [setMaxWidth]);

  useEffect(() => {
    if (product) {
      setProductName(product.name);
    }
    // Clear the product name when the component unmounts
    return () => {
      setProductName(null);
    };
  }, [product, setProductName]);

  if (!product) {
    return <Title level={2}>Product not found</Title>;
  }

  const tabItems = [
    {
      key: 'details',
      label: 'Details',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <DetailSection title="Core Details">
            <AttributeDisplay layout="horizontal" label="LOB">{product.lob}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Category">{product.category}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Billing Model">{product.billingModel}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Seat Type">{product.seatType}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Is Bundle?">{renderValue(product.isBundle, true)}</AttributeDisplay>
          </DetailSection>

          <DetailSection title={`SKU Configurations (${product.skus.length})`}>
            <SkuListTable skus={product.skus} />
          </DetailSection>

          {product.digitalGoods && product.digitalGoods.length > 0 && (
            <DetailSection title="Digital Goods">
              <DigitalGoodsTable product={product} />
            </DetailSection>
          )}
        </Space>
      ),
    },
    {
      key: 'other',
      label: 'Other',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <DetailSection title="Configuration">
            <AttributeDisplay layout="horizontal" label="Tax Class">{product.taxClass}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Grace Period (Free-Paid)">{product.paymentFailureFreeToPaidGracePeriod} days</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Grace Period (Paid-Paid)">{product.paymentFailurePaidToPaidGracePeriod} days</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Seat Min">{product.seatMin}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Seat Max">{product.seatMax}</AttributeDisplay>
          </DetailSection>

          {product.tags && product.tags.length > 0 && (
            <DetailSection title="Tags">
              <AttributeDisplay label="Product Tags">
                <Space size={[0, 8]} wrap>
                  {product.tags.map(tag => <Tag key={tag.type}>{tag.type}: {tag.value}</Tag>)}
                </Space>
              </AttributeDisplay>
            </DetailSection>
          )}

          <DetailSection title="Links">
            <AttributeDisplay layout="horizontal" label="Product URL"><a href={product.productUrl} target="_blank" rel="noopener noreferrer">{product.productUrl}</a></AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Terms of Service"><a href={product.termsOfServiceUrl} target="_blank" rel="noopener noreferrer">{product.termsOfServiceUrl}</a></AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="How to Cancel"><a href={product.howToCancelUrl} target="_blank" rel="noopener noreferrer">{product.howToCancelUrl}</a></AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Help Center"><a href={product.helpCenterUrl} target="_blank" rel="noopener noreferrer">{product.helpCenterUrl}</a></AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Contact Us"><a href={product.contactUsUrl} target="_blank" rel="noopener noreferrer">{product.contactUsUrl}</a></AttributeDisplay>
          </DetailSection>

          <DetailSection title="Miscellaneous">
            <AttributeDisplay layout="horizontal" label="Visible on Billing Emails?">{renderValue(product.isVisibleOnBillingEmails, true)}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Visible on Renewal Emails?">{renderValue(product.isVisibleOnRenewalEmails, true)}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Cancellable?">{renderValue(product.isCancellable, true)}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Eligible for Amendment?">{renderValue(product.isEligibleForAmendment, true)}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Eligible for Robo-Refund?">{renderValue(product.isEligibleForRoboRefund, true)}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Primary for Pricing?">{renderValue(product.isPrimaryProductForPricing, true)}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Primary for Grace Period?">{renderValue(product.isPrimaryForGracePeriod, true)}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Primary for Contract Aggregation?">{renderValue(product.isPrimaryForContractAggregation, true)}</AttributeDisplay>
          </DetailSection>
        </Space>
      ),
    }
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <PageHeader 
        title={product.name}
        subtitle={product.description}
        tagContent={<StatusTag status={product.status} />}
        actions={<CopyableId id={product.id} size="medium" />}
      />
      <Tabs defaultActiveKey="details" items={tabItems} />
    </Space>
  );
};

export default ProductDetail; 