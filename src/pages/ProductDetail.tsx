import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Typography, Space, Tag, Tabs, Table, Button, Modal, Steps, Row, Col } from 'antd';
import { mockProducts } from '../utils/mock-data';
import PriceGroupTable from '../components/pricing/PriceGroupTable';
import { useSkuFilters } from '../hooks/useSkuFilters';
import { usePriceGroupFilters } from '../hooks/usePriceGroupFilters';
import type { SalesChannel, Status, ConfigurationRequest } from '../utils/types';
import type { ChangeRequestSubmissionResult } from '../utils/configurationUtils';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { useLayout } from '../context/LayoutContext';
import {
  PageHeader,
  SkuListTable,
  GroupedSkuListTable,
  AttributeDisplay,
  PageSection,
  AttributeGroup,
  StatusTag,
  BillingModelDisplay,
  CountTag,
  FilterBar,
  ChangeRequestForm,
  ChangeRequestPreview,
  ActivityFeedItem
} from '../components';
import { toSentenceCase } from '../utils/formatters';
import { Box, Plus, ArrowLeft, Check } from 'lucide-react';

const { Title } = Typography;
const { Step } = Steps;

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
  
  // Configuration workflow state
  const [isConfigurationModalOpen, setIsConfigurationModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [configurationData, setConfigurationData] = useState<Partial<ConfigurationRequest> | null>(null);

  // Check for URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const priceGroupFilter = searchParams.get('priceGroupFilter');

  // SKU filtering hook
  const {
    setSearchQuery,
    channelFilter, setChannelFilter, channelOptions,
    statusFilter, setStatusFilter, statusOptions,
    billingCycleFilter, setBillingCycleFilter, billingCycleOptions,
    lixKeyFilter, setLixKeyFilter, lixKeyOptions,
    featuresFilter, setFeaturesFilter, featuresOptions,
    sortOrder, setSortOrder,
    groupBy, setGroupBy,
    sortedSkus,
    groupedSkus,
    skuCount,
  } = useSkuFilters(product?.skus || [], product);

  // Price Group filtering hook
  const {
    setSearchQuery: setPriceGroupSearchQuery,
    channelFilter: priceGroupChannelFilter, 
    setChannelFilter: setPriceGroupChannelFilter,
    billingCycleFilter: priceGroupBillingCycleFilter, 
    setBillingCycleFilter: setPriceGroupBillingCycleFilter,
    groupBy: priceGroupGroupBy, 
    setGroupBy: setPriceGroupGroupBy,
    filteredPriceGroups,
    groupedPriceGroups,
    channelOptions: priceGroupChannelOptions,
    billingCycleOptions: priceGroupBillingCycleOptions,
  } = usePriceGroupFilters(product?.skus || []);

  const clearAllPriceGroupFilters = () => {
    setPriceGroupSearchQuery('');
    setPriceGroupChannelFilter(null);
    setPriceGroupBillingCycleFilter(null);
  };

  const clearAllSkuFilters = () => {
    setChannelFilter(null);
    setStatusFilter(null);
    setBillingCycleFilter(null);
    setLixKeyFilter(null);
    setFeaturesFilter(null);
  };

  // Apply price group filtering if specified in URL
  const finalSortedSkus = priceGroupFilter ? 
    sortedSkus.filter(sku => sku.priceGroup.id === priceGroupFilter) : 
    sortedSkus;

  const finalGroupedSkus = priceGroupFilter ? 
    (groupedSkus ? Object.entries(groupedSkus).reduce((acc, [key, skus]) => {
      const filtered = skus.filter(sku => sku.priceGroup.id === priceGroupFilter);
      if (filtered.length > 0) {
        acc[key] = filtered;
      }
      return acc;
    }, {} as Record<string, any[]>) : null) : 
    groupedSkus;

  const finalSkuCount = priceGroupFilter ? finalSortedSkus.length : skuCount;

  useEffect(() => {
    // Set a wider max-width for product detail pages to accommodate data tables
    setMaxWidth('1200px');

    // Reset to default width when component unmounts
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
      key: 'overview',
      label: 'Overview',
      children: (
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          <PageSection title={toSentenceCase('General')}>
            <AttributeGroup>
              <AttributeDisplay
                layout="horizontal"
                label="Product Name"
              >
                {product.name}
              </AttributeDisplay>
              <AttributeDisplay
                layout="horizontal"
                label="Description"
              >
                {product.description}
              </AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Billing Model">
                <BillingModelDisplay model={product.billingModel} />
              </AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Is Bundle?">{renderValue(product.isBundle, true)}</AttributeDisplay>
            </AttributeGroup>
          </PageSection>
          {/* New Bundled in section */}
          <PageSection title={toSentenceCase('Bundled in')}>
            <span style={{ color: '#888' }}>NOTE* This shows bundles that this product is a part of</span>
          </PageSection>
          {/* New Offers section */}
          <PageSection title={toSentenceCase('Offers')}>
            <span style={{ color: '#888' }}>NOTE* This should show offers applicable to this product</span>
          </PageSection>
          {/* Moved Configuration section from Other tab */}
          <PageSection title={toSentenceCase('Configuration')}>
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Tax Class">{product.taxClass}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Grace Period (Free-Paid)">{product.paymentFailureFreeToPaidGracePeriod} days</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Grace Period (Paid-Paid)">{product.paymentFailurePaidToPaidGracePeriod} days</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Seat Type">{product.seatType}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Seat Min">{product.seatMin}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Seat Max">{product.seatMax}</AttributeDisplay>
            </AttributeGroup>
          </PageSection>
          {/* Moved Tags section from Other tab */}
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
          {/* Moved Links section from Other tab */}
          <PageSection title="Links">
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Post-Purchase URL">
                <a href={product.postPurchaseLandingUrl} target="_blank" rel="noopener noreferrer">
                  {product.postPurchaseLandingUrl}
                </a>
              </AttributeDisplay>
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
          {/* Moved Visibility section from Other tab */}
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
    // New Pricing tab
    {
      key: 'pricing',
      label: 'Pricing',
      children: (
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          <PageSection 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Price groups</span>
                <CountTag count={filteredPriceGroups.length} />
              </div>
            }
            actions={
              <Button 
                icon={<Plus size={16} />}
                onClick={() => setIsConfigurationModalOpen(true)}
                size="large"
              >
                Add price group
              </Button>
            }
          >
            <FilterBar
              search={{
                placeholder: "Search by ID or Name...",
                onChange: setPriceGroupSearchQuery,
              }}
              filters={[
                {
                  placeholder: "All Channels",
                  options: priceGroupChannelOptions,
                  value: priceGroupChannelFilter,
                  onChange: setPriceGroupChannelFilter,
                },
                {
                  placeholder: "All Billing Cycles",
                  options: priceGroupBillingCycleOptions,
                  value: priceGroupBillingCycleFilter,
                  onChange: setPriceGroupBillingCycleFilter,
                },
              ]}
              onClearAll={clearAllPriceGroupFilters}
              viewOptions={{
                groupBy: {
                  value: priceGroupGroupBy,
                  setter: setPriceGroupGroupBy,
                  options: ['None', 'Channel', 'Billing Cycle'],
                },
              }}
              displayMode="drawer"
              filterSize="middle"
              searchAndViewSize="large"
            />
            <PriceGroupTable 
              priceGroups={filteredPriceGroups} 
              groupedPriceGroups={groupedPriceGroups}
              groupBy={priceGroupGroupBy}
              productId={product.id} 
            />
          </PageSection>
        </Space>
      ),
    },
    {
      key: 'features',
      label: 'Features',
      children: (
        <PageSection title={toSentenceCase('Features')}>
          {product.features && product.features.length > 0 ? (
            <div className="content-panel">
              <Table
                columns={[{ title: '', dataIndex: 'feature', key: 'feature' }]}
                dataSource={product.features.map((feature, idx) => ({ key: idx, feature }))}
                pagination={false}
                size="small"
                rowKey="key"
                showHeader={false}
              />
            </div>
          ) : (
            <span style={{ color: '#888' }}>No features listed for this product.</span>
          )}
        </PageSection>
      ),
    },
    // New SKUs tab (second to last)
    {
      key: 'skus',
      label: 'SKUs',
      children: (
                  <PageSection
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{toSentenceCase('SKUs')}</span>
                <CountTag count={finalSkuCount} />
                {priceGroupFilter && (
                  <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                    (filtered by price group: {priceGroupFilter})
                  </Typography.Text>
                )}
              </div>
            }
        >
          <FilterBar
            search={{
              placeholder: "Search by SKU ID or Name...",
              onChange: setSearchQuery,
            }}
            onClearAll={clearAllSkuFilters}
            filters={[
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
                placeholder: toSentenceCase("All Lix Keys"),
                options: lixKeyOptions,
                value: lixKeyFilter,
                onChange: (value) => setLixKeyFilter(value as string ?? null),
              },
              {
                placeholder: toSentenceCase("All Features"),
                options: featuresOptions,
                value: featuresFilter,
                onChange: (value) => setFeaturesFilter(value as 'Standard' | 'Overrides' ?? null),
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
            displayMode="drawer"
            filterSize="middle"
            searchAndViewSize="large"
          />
          {finalGroupedSkus ? (
            <GroupedSkuListTable groupedSkus={finalGroupedSkus} product={product} groupBy={groupBy} />
          ) : (
            <SkuListTable skus={finalSortedSkus} product={product} />
          )}
        </PageSection>
      ),
    },
    {
      key: 'experiments',
      label: 'Experiments',
      children: (
        <PageSection title="Experiments">
          <span style={{ color: '#888' }}>NOTE* This should show experiments related to this product</span>
        </PageSection>
      ),
    },
    {
      key: 'activity',
      label: 'Activity',
      children: (
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          {/* Needs Attention Section */}
          <PageSection 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🔥 {toSentenceCase('Needs Attention')}</span>
                {(() => {
                  const pendingRequests = product.configurationRequests?.filter(request => 
                    ['Draft', 'Pending Review', 'In EI'].includes(request.status)
                  ) || [];
                  return pendingRequests.length > 0 && (
                    <CountTag count={pendingRequests.length} />
                  );
                })()}
              </div>
            }
          >
            {(() => {
              const pendingRequests = product.configurationRequests?.filter(request => 
                ['Draft', 'Pending Review', 'In EI'].includes(request.status)
              ) || [];
              
              return pendingRequests.length > 0 ? (
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  {pendingRequests.map((request) => (
                    <ActivityFeedItem
                      key={request.id}
                      request={request}
                      onViewDetails={(requestId) => {
                        navigate(`/product/${product.id}/configuration/${requestId}`);
                      }}
                    />
                  ))}
                </Space>
              ) : (
                <span style={{ color: '#888' }}>No pending change requests for this product.</span>
              );
            })()}
          </PageSection>
          
          {/* Recent Activity Section */}
          <PageSection title={`📅 ${toSentenceCase('Recent Activity')}`}>
            {product.configurationRequests && product.configurationRequests.length > 0 ? (
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                {product.configurationRequests.map((request) => (
                  <ActivityFeedItem
                    key={request.id}
                    request={request}
                    onViewDetails={(requestId) => {
                      navigate(`/product/${product.id}/configuration/${requestId}`);
                    }}
                  />
                ))}
              </Space>
            ) : (
              <span style={{ color: '#888' }}>No activity found for this product.</span>
            )}
          </PageSection>
        </Space>
      ),
    },
  ];

  // Handle configuration workflow steps
  const handleFormSubmit = (formData: Partial<ConfigurationRequest>) => {
    setConfigurationData(formData);
    setCurrentStep(1); // Move to preview step
  };

  const handleConfigurationSuccess = (result: ChangeRequestSubmissionResult) => {
    // Just log the success - let the form's success modal handle the user interaction
    console.log('Configuration created successfully:', result);
    
    // The form's success modal will handle navigation and modal closure
    // Don't close the modal here - let the user interact with the success modal first
  };

  const handlePrevious = () => {
    setCurrentStep(0);
  };

  const handleConfirmConfiguration = () => {
    // TODO: In a real app, this would save the configuration
    console.log('Configuration confirmed:', configurationData);
    setIsConfigurationModalOpen(false);
    setCurrentStep(0);
    setConfigurationData(null);
  };

  const handleModalClose = () => {
    setIsConfigurationModalOpen(false);
    setCurrentStep(0);
    setConfigurationData(null);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <PageHeader
        icon={<Box />}
        iconSize={24}
        title={product.name}
        onBack={() => navigate(-1)}
        tagContent={<StatusTag status={product.status} />}
      />

      <Tabs defaultActiveKey="details" items={tabItems} />
      
      {/* Configuration Creation Modal */}
      <Modal
        title={
          <div>
            <div style={{ marginBottom: '16px' }}>Add price group</div>
            <Steps current={currentStep} size="small">
              <Step title="Configure" />
              <Step title="Preview" />
            </Steps>
          </div>
        }
        open={isConfigurationModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={1200}
        zIndex={1100}
        destroyOnClose={true}
      >
        {currentStep === 0 && (
          <Row gutter={24}>
            <Col span={14}>
                             <ChangeRequestForm 
                 product={product}
                 onCancel={handleModalClose}
                 onSubmit={handleFormSubmit}
                 onFieldChange={(formData: any) => setConfigurationData(formData)}
                 onSuccess={handleConfigurationSuccess}
               />
            </Col>
            <Col span={10}>
              <ChangeRequestPreview 
                product={product}
                configurationData={configurationData || {}}
                isRealTimeUpdate={true}
              />
            </Col>
          </Row>
        )}
        
        {currentStep === 1 && configurationData && (
          <div>
            <ChangeRequestPreview 
              product={product}
              configurationData={configurationData}
            />
            <div style={{ 
              marginTop: '24px', 
              paddingTop: '16px', 
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Button 
                icon={<ArrowLeft size={16} />}
                onClick={handlePrevious}
              >
                Previous
              </Button>
              <Button 
                type="primary"
                icon={<Check size={16} />}
                onClick={handleConfirmConfiguration}
              >
                                  Create Change Request
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Space>
  );
};

export default ProductDetail; 