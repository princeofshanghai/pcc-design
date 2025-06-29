import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Space, Tag, Tabs } from 'antd';
import { mockProducts } from '../utils/mock-data';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { useLayout } from '../context/LayoutContext';
import PageHeader from '../components/PageHeader';
import SkuListTable from '../components/SkuListTable';
import AttributeDisplay from '../components/AttributeDisplay';
import DetailSection from '../components/DetailSection';
import DigitalGoodsTable from '../components/DigitalGoodsTable';
import StatusTag from '../components/StatusTag';
import { toSentenceCase } from '../utils/formatting';
import BillingModelDisplay from '../components/BillingModelDisplay';
import LobTag from '../components/LobTag';
import CategoryTag from '../components/CategoryTag';
import CountTag from '../components/CountTag';

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
  const navigate = useNavigate();

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

  const groupedTags = (product.tags || []).reduce((acc, tag) => {
    if (!acc[tag.type]) {
      acc[tag.type] = [];
    }
    acc[tag.type].push(tag.value);
    return acc;
  }, {} as Record<string, string[]>);

  const tabItems = [
    {
      key: 'details',
      label: 'Details',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <DetailSection title={toSentenceCase('General')}>
            <AttributeDisplay
              layout="horizontal"
              label="Product Name"
              tooltip="The public-facing name that appears on invoices."
            >
              {product.name}
            </AttributeDisplay>
            <AttributeDisplay
              layout="horizontal"
              label="Description"
              tooltip="The public-facing description that appears on invoices."
            >
              {product.description}
            </AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Billing Model">
              <BillingModelDisplay model={product.billingModel} />
            </AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Is Bundle?">{renderValue(product.isBundle, true)}</AttributeDisplay>
          </DetailSection>

          <DetailSection
            title={
              <Space>
                <span>{toSentenceCase('SKUs')}</span>
                <CountTag count={product.skus.length} />
              </Space>
            }
            subtitle={`SKUs associated with ${product.name}.`}
            noBodyPadding
          >
            <SkuListTable skus={product.skus} />
          </DetailSection>

          {product.digitalGoods && product.digitalGoods.length > 0 && (
            <DetailSection
              title={toSentenceCase('Digital Goods')}
              subtitle="Digital goods are the features that customers can access for this product."
              noBodyPadding
            >
              <DigitalGoodsTable product={product} />
            </DetailSection>
          )}
        </Space>
      ),
    },
    {
      key: 'offers',
      label: 'Offers',
      children: <div>NOTE* This should show offers applicable to this product</div>,
    },
    {
      key: 'bundles',
      label: 'Bundles',
      children: <div>NOTE* This shows bundles that this product is a part of</div>,
    },
    {
      key: 'other',
      label: 'Other',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <DetailSection title={toSentenceCase('Configuration')}>
            <AttributeDisplay layout="horizontal" label="Tax Class">{product.taxClass}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Grace Period (Free-Paid)">{product.paymentFailureFreeToPaidGracePeriod} days</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Grace Period (Paid-Paid)">{product.paymentFailurePaidToPaidGracePeriod} days</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Seat Type">{product.seatType}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Seat Min">{product.seatMin}</AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Seat Max">{product.seatMax}</AttributeDisplay>
          </DetailSection>

          {product.tags && product.tags.length > 0 && (
            <DetailSection title={toSentenceCase('Tags')}>
              {Object.entries(groupedTags).map(([type, values]) => (
                <AttributeDisplay layout="horizontal" key={type} label={toSentenceCase(type)}>
                  <Space size={[0, 8]} wrap>
                    {values.map(value => <Tag key={value}>{value}</Tag>)}
                  </Space>
                </AttributeDisplay>
              ))}
            </DetailSection>
          )}

          <DetailSection title="Links">
            <AttributeDisplay layout="horizontal" label="Product URL"><a href={product.productUrl} target="_blank" rel="noopener noreferrer">{product.productUrl}</a></AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Terms of Service"><a href={product.termsOfServiceUrl} target="_blank" rel="noopener noreferrer">{product.termsOfServiceUrl}</a></AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="How to Cancel"><a href={product.howToCancelUrl} target="_blank" rel="noopener noreferrer">{product.howToCancelUrl}</a></AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Help Center"><a href={product.helpCenterUrl} target="_blank" rel="noopener noreferrer">{product.helpCenterUrl}</a></AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Contact Us"><a href={product.contactUsUrl} target="_blank" rel="noopener noreferrer">{product.contactUsUrl}</a></AttributeDisplay>
          </DetailSection>

          <DetailSection title="Visibility">
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
    },
    {
      key: 'activity',
      label: 'Activity',
      children: <div>NOTE* This should show activity for this product. List of activities with link to change request</div>,
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <PageHeader
        preTitle="Product"
        title={product.name}
        onBack={() => navigate('/')}
        tagContent={<StatusTag status={product.status} />}
        subtitle={
          <Space>
            <LobTag lob={product.lob} />
            <CategoryTag category={product.category} lob={product.lob} />
          </Space>
        }
      />

      <Tabs defaultActiveKey="details" items={tabItems} />
    </Space>
  );
};

export default ProductDetail; 