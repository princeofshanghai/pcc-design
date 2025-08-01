import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Typography, Space, Table, Button, Modal, Steps, Row, Col, Badge, Tabs, Alert } from 'antd';
import { mockProducts } from '../utils/mock-data';
import PriceGroupTable from '../components/pricing/PriceGroupTable';
import { useSkuFilters } from '../hooks/useSkuFilters';
import { usePriceGroupFilters } from '../hooks/usePriceGroupFilters';
import type { SalesChannel, Status, ConfigurationRequest, ColumnConfig, ColumnVisibility, ColumnOrder } from '../utils/types';
import type { ChangeRequestSubmissionResult } from '../utils/configurationUtils';
import { useBreadcrumb } from '../context/BreadcrumbContext';

import {
  PageHeader,
  SkuListTable,
  GroupedSkuListTable,
  AttributeDisplay,
  PageSection,
  AttributeGroup,
  StatusTag,
  BillingModelDisplay,
  FilterBar,
  ChangeRequestForm,
  ChangeRequestPreview,
  ActivityFeedItem} from '../components';
import { toSentenceCase } from '../utils/formatters';
import { 
  PRICE_GROUP_COLUMNS, 
  PRICE_GROUP_SORT_OPTIONS, 
  SKU_SORT_OPTIONS,
  SKU_GROUP_BY_OPTIONS,
  PRICE_GROUP_GROUP_BY_OPTIONS} from '../utils/tableConfigurations';
import { Box, ArrowLeft, Check } from 'lucide-react';

const { Title } = Typography;
const { Step } = Steps;


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
  const location = useLocation();
  const product = mockProducts.find(p => p.id === productId);
  const navigate = useNavigate();
  
  // Configuration workflow state
  const [isConfigurationModalOpen, setIsConfigurationModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [configurationData, setConfigurationData] = useState<Partial<ConfigurationRequest> | null>(null);
  
  // Alert dismissal state
  const [skuAlertDismissed, setSkuAlertDismissed] = useState(false);
  const [featuresAlertDismissed, setFeaturesAlertDismissed] = useState(false);
  const [activityAlertDismissed, setActivityAlertDismissed] = useState(false);
  const [pricingAlertDismissed, setPricingAlertDismissed] = useState(false);

  // Check for URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const priceGroupFilter = searchParams.get('priceGroupFilter');

  // SKU filtering hook
  const {
    setSearchQuery,
    channelFilters, setChannelFilters, channelOptions,
    statusFilter, setStatusFilter, statusOptions,
    billingCycleFilter, setBillingCycleFilter, billingCycleOptions,
    lixKeyFilter, setLixKeyFilter, lixKeyOptions,

    sortOrder, setSortOrder,
    groupBy, setGroupBy,
    sortedSkus,
    groupedSkus,
  } = useSkuFilters(product?.skus || [], product);

  // Price Group filtering hook
  const {
    setSearchQuery: setPriceGroupSearchQuery,
        channelFilters: priceGroupChannelFilters,
    setChannelFilters: setPriceGroupChannelFilters,
    billingCycleFilter: priceGroupBillingCycleFilter, 
    setBillingCycleFilter: setPriceGroupBillingCycleFilter,
    groupBy: priceGroupGroupBy, 
    setGroupBy: setPriceGroupGroupBy,
    sortOrder: priceGroupSortOrder, 
    setSortOrder: setPriceGroupSortOrder,
    filteredPriceGroups,
    groupedPriceGroups,
    channelOptions: priceGroupChannelOptions,
    billingCycleOptions: priceGroupBillingCycleOptions,
  } = usePriceGroupFilters(product?.skus || []);

  // Default column visibility configuration for PriceGroupTable
  const priceGroupDefaultVisibility = useMemo(() => {
    const defaultVisibility: ColumnVisibility = {};
    PRICE_GROUP_COLUMNS.forEach(col => {
      // Hide Name column by default
      if (col.key === 'name') {
        defaultVisibility[col.key] = false;
      } else {
        defaultVisibility[col.key] = true;
      }
    });
    return defaultVisibility;
  }, []);

  // Column visibility state for PriceGroupTable
  const [priceGroupVisibleColumns, setPriceGroupVisibleColumns] = useState<ColumnVisibility>(() => {
    return priceGroupDefaultVisibility;
  });

  // Column order state for PriceGroupTable
  const [priceGroupColumnOrder, setPriceGroupColumnOrder] = useState<ColumnOrder>(
    PRICE_GROUP_COLUMNS.map(col => col.key)
  );

  // Column configuration for PriceGroupTable - use centralized configuration
  const priceGroupColumnOptions: ColumnConfig[] = PRICE_GROUP_COLUMNS;

  const clearAllPriceGroupFilters = () => {
    setPriceGroupSearchQuery('');
    setPriceGroupChannelFilters([]);
    setPriceGroupBillingCycleFilter(null);
  };

  const clearAllSkuFilters = () => {
    setChannelFilters([]);
    setStatusFilter(null);
    setBillingCycleFilter(null);
    setLixKeyFilter(null);

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
      key: 'overview',
      label: 'Overview',
      children: (
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          <PageSection title={toSentenceCase('Overview')}>
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Name">{product.name}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Description">{product.description}</AttributeDisplay>
            </AttributeGroup>
          </PageSection>
        </Space>
      ),
    },
    // SKUs tab (moved to be second)
    {
      key: 'skus',
      label: 'SKUs',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {!skuAlertDismissed && (
            <Alert
              message="Note from Charles (design): Post-MVP Feature - Work in Progress"
              description="This SKU management interface is part of post-MVP development. Please ignore for current epic."
              type="warning"
              showIcon
              closable
              onClose={() => setSkuAlertDismissed(true)}
            />
          )}
          <PageSection
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{toSentenceCase('SKUs')}</span>
                {priceGroupFilter && (
                  <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                    (filtered by price: {priceGroupFilter})
                  </Typography.Text>
                )}
              </div>
            }
        >
          <FilterBar
            filterSize="middle"
            searchAndViewSize="middle"
            search={{
              placeholder: "Search by SKU ID or Name...",
              onChange: setSearchQuery,
            }}
            onClearAll={clearAllSkuFilters}
            filters={[
              {
                placeholder: "All channels",
                options: channelOptions,
                value: channelFilters.length === 1 ? channelFilters[0] : null,
                onChange: (value) => {
                  if (value) {
                    setChannelFilters([value as SalesChannel]);
                  } else {
                    setChannelFilters([]);
                  }
                },
                multiSelect: true,
                multiValue: channelFilters,
                onMultiChange: (values: string[]) => setChannelFilters(values as SalesChannel[]),
              },
              {
                placeholder: "All cycles",
                options: billingCycleOptions,
                value: billingCycleFilter,
                onChange: (value) => setBillingCycleFilter(value as string ?? null),
              },
              {
                placeholder: "All LIX keys",
                options: lixKeyOptions,
                value: lixKeyFilter,
                onChange: (value) => setLixKeyFilter(value as string ?? null),
              },

              {
                placeholder: "All statuses",
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
            displayMode="inline"
          />
          {finalGroupedSkus ? (
            <GroupedSkuListTable groupedSkus={finalGroupedSkus} product={product} />
          ) : (
            <SkuListTable skus={finalSortedSkus} product={product} />
          )}
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
          {!pricingAlertDismissed && (
            <Alert
              message="Note from Charles (design): MVP vs Future State"
              description="SKU column is future state, replace column with LIX for MVP"
              type="info"
              showIcon
              closable
              onClose={() => setPricingAlertDismissed(true)}
            />
          )}
          <PageSection 
            title="Price groups"
          >
            <FilterBar
              filterSize="middle"
              searchAndViewSize="middle"
              search={{
                placeholder: "Search by ID or Name...",
                onChange: setPriceGroupSearchQuery,
              }}
              filters={[
                {
                  placeholder: "All channels",
                  options: priceGroupChannelOptions,
                  multiSelect: true,
                  multiValue: priceGroupChannelFilters,
                  onMultiChange: (values: string[]) => setPriceGroupChannelFilters(values as SalesChannel[]),
                  // Required for TypeScript interface compatibility
                  value: null,
                  onChange: () => {},
                },
                {
                  placeholder: "All billing cycles",
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
                  options: PRICE_GROUP_GROUP_BY_OPTIONS,
                },
                sortOrder: {
                  value: priceGroupSortOrder,
                  setter: setPriceGroupSortOrder,
                  options: PRICE_GROUP_SORT_OPTIONS,
                },
                columnOptions: priceGroupColumnOptions,
                visibleColumns: priceGroupVisibleColumns,
                setVisibleColumns: setPriceGroupVisibleColumns,
                columnOrder: priceGroupColumnOrder,
                setColumnOrder: setPriceGroupColumnOrder,
                defaultVisibleColumns: priceGroupDefaultVisibility,
              }}
              displayMode="inline"
            />
            <PriceGroupTable 
              priceGroups={filteredPriceGroups} 
              groupedPriceGroups={groupedPriceGroups}
              productId={product.id}
              visibleColumns={priceGroupVisibleColumns}
              columnOrder={priceGroupColumnOrder}
            />
          </PageSection>
        </Space>
      ),
    },
    {
      key: 'features',
      label: 'Features',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {!featuresAlertDismissed && (
            <Alert
              message="Note from Charles (design): Post-MVP Feature - Work in Progress"
              description="This feature management interface is part of post-MVP development. Please ignore for current epic."
              type="warning"
              showIcon
              closable
              onClose={() => setFeaturesAlertDismissed(true)}
            />
          )}
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
        </Space>
      ),
    },
    // Configurations tab
    {
      key: 'configurations',
      label: 'Configurations',
      children: (
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          {/* Product Setup Section */}
          <PageSection title={toSentenceCase('Product Setup')}>
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Billing Model">
                <BillingModelDisplay model={product.billingModel} />
              </AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Is Bundle?">{renderValue(product.isBundle, true)}</AttributeDisplay>
            </AttributeGroup>
          </PageSection>
          
          {/* Business Rules Section */}
          <PageSection title={toSentenceCase('Business Rules')}>
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Tax Class">{product.taxClass}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Grace Period (Free-Paid)">{product.paymentFailureFreeToPaidGracePeriod} days</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Grace Period (Paid-Paid)">{product.paymentFailurePaidToPaidGracePeriod} days</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Seat Type">{product.seatType}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Seat Min">{product.seatMin}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Seat Max">{product.seatMax}</AttributeDisplay>
            </AttributeGroup>
          </PageSection>
          
          {/* Visibility Controls Section */}
          <PageSection title={toSentenceCase('Visibility Controls')}>
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
          
          {/* Links & Resources Section */}
          <PageSection title={toSentenceCase('Links & Resources')}>
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
        </Space>
      ),
    },
    {
      key: 'activity',
      label: (() => {
        const pendingRequests = product.configurationRequests?.filter(request => 
          ['Draft', 'Pending Review', 'In EI'].includes(request.status)
        ) || [];
        
        return pendingRequests.length > 0 ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Badge count={pendingRequests.length} size="small" offset={[4, 0]}>
              Activity
            </Badge>
          </div>
        ) : (
          'Activity'
        );
      })(),
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {!activityAlertDismissed && (
            <Alert
              message="Note from Charles (design): Post-MVP Feature - Work in Progress"
              description="This activity tracking interface is part of post-MVP development. Please ignore for current epic."
              type="warning"
              showIcon
              closable
              onClose={() => setActivityAlertDismissed(true)}
            />
          )}
          <Space direction="vertical" size={48} style={{ width: '100%' }}>
            {/* Needs Attention Section */}
            <PageSection 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🔥 {toSentenceCase('Needs Attention')}</span>

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

  // Extract unique channels and billing cycles from all SKUs
  const uniqueChannels = [...new Set(product.skus.map(sku => sku.salesChannel))];
  const uniqueBillingCycles = [...new Set(product.skus.map(sku => sku.billingCycle))];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <PageHeader
        icon={<Box />}
        iconSize={16}
        entityType="Product"
        title={product.name}
        onBack={() => navigate(-1)}
        tagContent={<StatusTag status={product.status} />}
        rightAlignedId={product.id}
        channels={uniqueChannels}
        billingCycles={uniqueBillingCycles}
        lastUpdatedBy="Charles Hu"
        lastUpdatedAt={new Date(Date.now() - 2 * 60 * 60 * 1000)} // 2 hours ago
        compact
      />

      <Tabs
        defaultActiveKey="overview"
        items={tabItems}
      />
      
      {/* Configuration Creation Modal */}
      <Modal
        title={
          <div>
            <div style={{ marginBottom: '16px' }}>Add prices</div>
            <Steps current={currentStep} size="small">
              <Step title="Details" />
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
                product={product!}
                onCancel={handleModalClose}
                onSubmit={handleFormSubmit}
                onFieldChange={(formData: any) => setConfigurationData(formData)}
                onSuccess={handleConfigurationSuccess}
              />
            </Col>
            <Col span={10}>
              <ChangeRequestPreview 
                product={product!}
                configurationData={configurationData ?? {}}
                isRealTimeUpdate={true}
              />
            </Col>
          </Row>
        )}
        
        {currentStep === 1 && configurationData && (
          <div>
            <ChangeRequestPreview 
              product={product!}
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
                Submit Change Request
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Space>
  );
};

export default ProductDetail; 