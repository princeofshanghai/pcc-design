import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Typography, Space, Tag, Tabs } from 'antd';
import { mockProducts } from '../utils/mock-data';
import { useSkuFilters } from '../hooks/useSkuFilters';
import type { Region, SalesChannel, Status } from '../utils/types';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { useLayout } from '../context/LayoutContext';
import {
  PageHeader,
  SkuListTable,
  GroupedSkuListTable,
  DigitalGoodsTable,
  AttributeDisplay,
  PageSection,
  AttributeGroup,
  StatusTag,
  BillingModelDisplay,
  LobTag,
  CategoryTag,
  CountTag,
  FilterBar
} from '../components';
import { toSentenceCase } from '../utils/formatters';
import { Box } from 'lucide-react';

const { Title } = Typography;

const SKU_SORT_OPTIONS = ['None', 'Effective Date'];
const SKU_GROUP_BY_OPTIONS = ['None', 'Price Group', 'Effective Date', 'LIX', 'Status', 'Region', 'Sales Channel', 'Billing Cycle'];

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
  const location = useLocation();
  const product = mockProducts.find(p => p.id === productId);
  const navigate = useNavigate();

  // Check for URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const priceGroupFilter = searchParams.get('priceGroupFilter');

  // New hook for SKU filtering
  const {
    setSearchQuery,
    regionFilter, setRegionFilter, regionOptions,
    channelFilter, setChannelFilter, channelOptions,
    statusFilter, setStatusFilter, statusOptions,
    billingCycleFilter, setBillingCycleFilter, billingCycleOptions,
    sortOrder, setSortOrder,
    groupBy, setGroupBy,
    sortedSkus,
    groupedSkus,
    skuCount,
  } = useSkuFilters(product?.skus || []);

  const clearAllSkuFilters = () => {
    setRegionFilter(null);
    setChannelFilter(null);
    setStatusFilter(null);
    setBillingCycleFilter(null);
  };

  // Apply price group filtering if specified in URL
  const finalSortedSkus = priceGroupFilter ? 
    sortedSkus.filter(sku => sku.price.id === priceGroupFilter) : 
    sortedSkus;

  const finalGroupedSkus = priceGroupFilter ? 
    (groupedSkus ? Object.entries(groupedSkus).reduce((acc, [key, skus]) => {
      const filtered = skus.filter(sku => sku.price.id === priceGroupFilter);
      if (filtered.length > 0) {
        acc[key] = filtered;
      }
      return acc;
    }, {} as Record<string, any[]>) : null) : 
    groupedSkus;

  const finalSkuCount = priceGroupFilter ? finalSortedSkus.length : skuCount;

  useEffect(() => {
    // Set the max-width for this page
    setMaxWidth('1024px');

    // Reset the max-width when the component unmounts
    return () => {
      setMaxWidth('1024px'); // Reset to default width
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
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          <PageSection title={toSentenceCase('General')}>
            <AttributeGroup>
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
            </AttributeGroup>
          </PageSection>

          <PageSection
            title={
              <Space>
                <span>{toSentenceCase('SKUs')}</span>
                <CountTag count={finalSkuCount} />
                {priceGroupFilter && (
                  <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                    (filtered by price group: {priceGroupFilter})
                  </Typography.Text>
                )}
              </Space>
            }
          >
            <FilterBar
              search={{
                placeholder: "Search by SKU ID...",
                onChange: setSearchQuery,
              }}
              onClearAll={clearAllSkuFilters}
              filters={[
                {
                  placeholder: toSentenceCase("All Regions"),
                  options: regionOptions,
                  value: regionFilter,
                  onChange: (value) => setRegionFilter(value as Region ?? null),
                },
                {
                  placeholder: toSentenceCase("All Channels"),
                  options: channelOptions,
                  value: channelFilter,
                  onChange: (value) => setChannelFilter(value as SalesChannel ?? null),
                },
                {
                  placeholder: toSentenceCase("All Cycles"),
                  options: billingCycleOptions,
                  value: billingCycleFilter,
                  onChange: (value) => setBillingCycleFilter(value as string ?? null),
                },
                {
                  placeholder: toSentenceCase("All Statuses"),
                  options: statusOptions,
                  value: statusFilter,
                  onChange: (value) => setStatusFilter(value as Status ?? null),
                },
              ]}
              viewOptions={{
                sortOrder: {
                  value: sortOrder,
                  setter: setSortOrder,
                  options: SKU_SORT_OPTIONS,
                },
                groupBy: {
                  value: groupBy,
                  setter: setGroupBy,
                  options: SKU_GROUP_BY_OPTIONS,
                },
              }}
            />
            {finalGroupedSkus ? (
              <GroupedSkuListTable groupedSkus={finalGroupedSkus} product={product} groupBy={groupBy} />
            ) : (
              <SkuListTable skus={finalSortedSkus} product={product} />
            )}
          </PageSection>

          {product.digitalGoods && product.digitalGoods.length > 0 && (
            <PageSection title={toSentenceCase('Digital Goods')}>
              <DigitalGoodsTable digitalGoods={product.digitalGoods} />
            </PageSection>
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
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          <PageSection title={toSentenceCase('Configuration')}>
            <AttributeGroup>
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
            </AttributeGroup>
          </PageSection>

          {product.tags && product.tags.length > 0 && (
            <PageSection title={toSentenceCase('Tags')}>
              <AttributeGroup>
                {Object.entries(groupedTags).map(([type, values]) => (
                  <AttributeDisplay layout="horizontal" key={type} label={toSentenceCase(type)}>
                    <Space size={[0, 8]} wrap>
                      {values.map(value => <Tag key={value}>{value}</Tag>)}
                    </Space>
                  </AttributeDisplay>
                ))}
              </AttributeGroup>
            </PageSection>
          )}

          <PageSection title="Links">
            <AttributeGroup>
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
            </AttributeGroup>
          </PageSection>

          <PageSection title="Visibility">
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Visible on Billing Emails?">{renderValue(product.isVisibleOnBillingEmails, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Visible on Renewal Emails?">{renderValue(product.isVisibleOnRenewalEmails, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Cancellable?">{renderValue(product.isCancellable, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Eligible for Amendment?">{renderValue(product.isEligibleForAmendment, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Eligible for Robo-Refund?">{renderValue(product.isEligibleForRoboRefund, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Primary for Pricing?">{renderValue(product.isPrimaryProductForPricing, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Primary for Grace Period?">{renderValue(product.isPrimaryForGracePeriod, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Primary for Contract Aggregation?">{renderValue(product.isPrimaryForContractAggregation, true)}</AttributeDisplay>
            </AttributeGroup>
          </PageSection>
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