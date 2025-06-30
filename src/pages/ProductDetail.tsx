import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Space, Tag, Tabs, List } from 'antd';
import { mockProducts } from '../utils/mock-data';
import type { Region, SalesChannel, Status } from '../utils/types';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { useLayout } from '../context/LayoutContext';
import PageHeader from '../components/PageHeader';
import SkuListTable from '../components/SkuListTable';
import AttributeDisplay from '../components/AttributeDisplay';
import DetailSection from '../components/DetailSection';
import StatusTag from '../components/StatusTag';
import { toSentenceCase } from '../utils/formatting';
import BillingModelDisplay from '../components/BillingModelDisplay';
import LobTag from '../components/LobTag';
import CategoryTag from '../components/CategoryTag';
import CountTag from '../components/CountTag';
import FilterDropdown from '../components/FilterDropdown';
import { Box } from 'lucide-react';

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

  // State for filters
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<SalesChannel | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<string | null>(null);

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

  // --- Filtering Logic ---
  const regionOptions = [...new Set(product.skus.map(sku => sku.region))].map(r => ({ value: r, label: toSentenceCase(r) }));
  const channelOptions = [...new Set(product.skus.map(sku => sku.salesChannel))].map(c => ({ value: c, label: toSentenceCase(c) }));
  const statusOptions = [...new Set(product.skus.map(sku => sku.status))].map(s => ({ value: s, label: toSentenceCase(s) }));
  const billingCycleOptions = [...new Set(product.skus.map(sku => sku.billingCycle))].map(bc => ({ value: bc, label: toSentenceCase(bc) }));

  const filteredSkus = product.skus.filter(sku => {
    return (
      (selectedRegion === null || sku.region === selectedRegion) &&
      (selectedChannel === null || sku.salesChannel === selectedChannel) &&
      (selectedBillingCycle === null || sku.billingCycle === selectedBillingCycle) &&
      (selectedStatus === null || sku.status === selectedStatus)
    );
  });
  // --- End Filtering Logic ---

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
        <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '1rem' }}>
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

          <div>
            <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <Title level={3} style={{ margin: 0 }}>
                <Space>
                  <span>{toSentenceCase('SKUs')}</span>
                  <CountTag count={filteredSkus.length} />
                </Space>
              </Title>
              <Space>
                <FilterDropdown
                  placeholder={toSentenceCase("All Regions")}
                  options={regionOptions}
                  value={selectedRegion}
                  onChange={(value) => setSelectedRegion((value as Region) ?? null)}
                  style={{ width: 140 }}
                  dropdownStyle={{ minWidth: 220 }}
                />
                <FilterDropdown
                  placeholder={toSentenceCase("All Channels")}
                  options={channelOptions}
                  value={selectedChannel}
                  onChange={(value) => setSelectedChannel((value as SalesChannel) ?? null)}
                  style={{ width: 140 }}
                  dropdownStyle={{ minWidth: 220 }}
                />
                <FilterDropdown
                  placeholder={toSentenceCase("All Cycles")}
                  options={billingCycleOptions}
                  value={selectedBillingCycle}
                  onChange={(value) => setSelectedBillingCycle(value as string ?? null)}
                  style={{ width: 140 }}
                  dropdownStyle={{ minWidth: 220 }}
                />
                <FilterDropdown
                  placeholder={toSentenceCase("All Statuses")}
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus((value as Status) ?? null)}
                  style={{ width: 140 }}
                  dropdownStyle={{ minWidth: 220 }}
                />
              </Space>
            </Space>
            <SkuListTable skus={filteredSkus} product={product} />
          </div>

          {product.digitalGoods && product.digitalGoods.length > 0 && (
            <div>
              <Title level={3} style={{ margin: '2rem 0 1rem 0' }}>{toSentenceCase('Digital Goods')}</Title>
              <div className="content-panel">
                <List
                  size="small"
                  dataSource={product.digitalGoods}
                  renderItem={item => <List.Item style={{paddingLeft: '24px', paddingRight: '24px'}}>{item}</List.Item>}
                />
              </div>
            </div>
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
            <AttributeDisplay layout="horizontal" label="Post-Purchase URL">
              <a href={product.postPurchaseLandingUrl} target="_blank" rel="noopener noreferrer">
                {product.postPurchaseLandingUrl}
              </a>
            </AttributeDisplay>
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
            <AttributeDisplay layout="horizontal" label="Refund Policy"><a href={product.refundPolicyUrl} target="_blank" rel="noopener noreferrer">{product.refundPolicyUrl}</a></AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Help Center"><a href={product.helpCenterUrl} target="_blank" rel="noopener noreferrer">{product.helpCenterUrl}</a></AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Contact Us"><a href={product.contactUsUrl} target="_blank" rel="noopener noreferrer">{product.contactUsUrl}</a></AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Account Link"><a href={product.accountLink} target="_blank" rel="noopener noreferrer">{product.accountLink}</a></AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="CTA Link"><a href={product.ctaLink} target="_blank" rel="noopener noreferrer">{product.ctaLink}</a></AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="CTA URL"><a href={product.ctaUrl} target="_blank" rel="noopener noreferrer">{product.ctaUrl}</a></AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Confirmation CTA URL"><a href={product.confirmationCtaUrl} target="_blank" rel="noopener noreferrer">{product.confirmationCtaUrl}</a></AttributeDisplay>
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
        preTitle={
          <Space size="small">
            <Box size={14} />
            <span>Product</span>
          </Space>
        }
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