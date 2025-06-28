import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Space, Row, Col, Tag } from 'antd';
import { mockProducts } from '../utils/mock-data';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { useLayout } from '../context/LayoutContext';
import PageHeader from '../components/PageHeader';
import SkuListTable from '../components/SkuListTable';
import AttributeDisplay from '../components/AttributeDisplay';
import CopyableId from '../components/CopyableId';

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
    setMaxWidth('1400px');

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

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <PageHeader 
        title={product.name}
        subtitle={product.description}
      />
      <Row gutter={32}>
        <Col span={6}>
          <div style={{ position: 'sticky', top: 100 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              
              <Title level={5} style={{ marginBottom: 0 }}>Core Details</Title>
              <Row gutter={[16, 24]}>
                <Col span={12}><AttributeDisplay label="Product ID"><CopyableId id={product.id}/></AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="LOB">{product.lob}</AttributeDisplay></Col>
                <Col span={24}><AttributeDisplay label="Category">{product.category}</AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Billing Model">{product.billingModel}</AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Status"><Tag>{product.status}</Tag></AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Seat Type">{product.seatType}</AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Is Bundle?">{renderValue(product.isBundle, true)}</AttributeDisplay></Col>
              </Row>

              <Title level={5} style={{ marginBottom: 0 }}>Configuration</Title>
              <Row gutter={[16, 24]}>
                <Col span={24}><AttributeDisplay label="Tax Class">{product.taxClass}</AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Grace Period (Free-Paid)">{product.paymentFailureFreeToPaidGracePeriod} days</AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Grace Period (Paid-Paid)">{product.paymentFailurePaidToPaidGracePeriod} days</AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Seat Min">{product.seatMin}</AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Seat Max">{product.seatMax}</AttributeDisplay></Col>
                <Col span={24}><AttributeDisplay label="Digital Goods">{renderValue(product.digitalGoods)}</AttributeDisplay></Col>
              </Row>

              {product.tags && product.tags.length > 0 && (
                <>
                  <Title level={5} style={{ marginBottom: 0 }}>Tags</Title>
                  <AttributeDisplay label="Product Tags">
                    <Space size={[0, 8]} wrap>
                      {product.tags.map(tag => <Tag key={tag.type}>{tag.type}: {tag.value}</Tag>)}
                    </Space>
                  </AttributeDisplay>
                </>
              )}

              <Title level={5} style={{ marginBottom: 0 }}>Links</Title>
              <Row gutter={[16, 24]}>
                <Col span={24}><AttributeDisplay label="Product URL"><a href={product.productUrl} target="_blank" rel="noopener noreferrer">{product.productUrl}</a></AttributeDisplay></Col>
                <Col span={24}><AttributeDisplay label="Terms of Service"><a href={product.termsOfServiceUrl} target="_blank" rel="noopener noreferrer">{product.termsOfServiceUrl}</a></AttributeDisplay></Col>
                <Col span={24}><AttributeDisplay label="How to Cancel"><a href={product.howToCancelUrl} target="_blank" rel="noopener noreferrer">{product.howToCancelUrl}</a></AttributeDisplay></Col>
                <Col span={24}><AttributeDisplay label="Help Center"><a href={product.helpCenterUrl} target="_blank" rel="noopener noreferrer">{product.helpCenterUrl}</a></AttributeDisplay></Col>
                <Col span={24}><AttributeDisplay label="Contact Us"><a href={product.contactUsUrl} target="_blank" rel="noopener noreferrer">{product.contactUsUrl}</a></AttributeDisplay></Col>
              </Row>

              <Title level={5} style={{ marginBottom: 0 }}>Miscellaneous</Title>
              <Row gutter={[16, 24]}>
                <Col span={12}><AttributeDisplay label="Visible on Billing Emails?">{renderValue(product.isVisibleOnBillingEmails, true)}</AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Visible on Renewal Emails?">{renderValue(product.isVisibleOnRenewalEmails, true)}</AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Cancellable?">{renderValue(product.isCancellable, true)}</AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Eligible for Amendment?">{renderValue(product.isEligibleForAmendment, true)}</AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Eligible for Robo-Refund?">{renderValue(product.isEligibleForRoboRefund, true)}</AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Primary for Pricing?">{renderValue(product.isPrimaryProductForPricing, true)}</AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Primary for Grace Period?">{renderValue(product.isPrimaryForGracePeriod, true)}</AttributeDisplay></Col>
                <Col span={12}><AttributeDisplay label="Primary for Contract Aggregation?">{renderValue(product.isPrimaryForContractAggregation, true)}</AttributeDisplay></Col>
              </Row>

            </Space>
          </div>
        </Col>
        <Col span={18}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>SKU Configurations ({product.skus.length})</Title>
            <SkuListTable skus={product.skus} />
          </Space>
        </Col>
      </Row>
    </Space>
  );
};

export default ProductDetail; 