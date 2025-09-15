import React, { useEffect } from 'react';
import { Typography, Space, Table, Tabs } from 'antd';
import { useParams, Link } from 'react-router-dom';
import { mockProducts } from '../utils/mock-data';
import { useBreadcrumb } from '../context/BreadcrumbContext';

import { usePricePointFilters } from '../hooks/usePricePointFilters';
import { toSentenceCase } from '../utils/formatters';
import { PRICE_POINT_SORT_OPTIONS, PRICE_POINT_GROUP_BY_OPTIONS, getFilterPlaceholder } from '../utils/tableConfigurations';
import {
  PageHeader,
  StatusTag,
  PageSection,
  AttributeDisplay,
  AttributeGroup,
  OverrideIndicator,
  OverrideComparison,
  FilterBar,
  ChannelTag,
  BillingCycleTag
} from '../components';
import PricePointTable from '../components/pricing/PricePointTable';
import CopyableId from '../components/shared/CopyableId';
import { AlertCircle } from 'lucide-react';

const { Title } = Typography;

const SkuDetail: React.FC = () => {
  const { productId, skuId } = useParams<{ productId: string; skuId: string }>();
  const { setProductName, setSkuId, setFolderName } = useBreadcrumb();



  const product = mockProducts.find(p => p.id === productId);
  const sku = product?.skus.find(s => s.id === skuId);



  useEffect(() => {
    if (product) {
      setProductName(product.name);
      // Also set the folder name if available
      if (product.folder) {
        setFolderName(product.folder);
      }
    }
    if (sku) {
      setSkuId(sku.id);
    }

    return () => {
      setProductName(null);
      setSkuId(null);
      setFolderName(null);
    };
  }, [product, sku, setProductName, setSkuId, setFolderName]);

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

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size={48}>
          {/* SKU Overrides Summary */}
          <PageSection title={toSentenceCase("SKU Overrides")}>
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
          </PageSection>

          {/* Basic SKU Information */}
          <PageSection title={toSentenceCase("SKU Information")}>
            <AttributeGroup>
              <AttributeDisplay label="Product" layout="horizontal">
                {product.name}
              </AttributeDisplay>
              
              <AttributeDisplay label="LOB" layout="horizontal">
                {product.lob}
              </AttributeDisplay>
              
              <AttributeDisplay label="Folder" layout="horizontal">
                {product.folder}
              </AttributeDisplay>
              
              <AttributeDisplay label="Status" layout="horizontal">
                <StatusTag status={sku.status} variant="small" showIcon={false} />
              </AttributeDisplay>
            </AttributeGroup>
          </PageSection>

          {/* Configuration Section */}
          <PageSection title={toSentenceCase("Configuration")}>
            <AttributeGroup>
              <AttributeDisplay label="Sales Channel" layout="horizontal">
                <ChannelTag channel={sku.salesChannel} showIcon={false} />
              </AttributeDisplay>
              
              <AttributeDisplay label="Billing Cycle" layout="horizontal">
                <BillingCycleTag billingCycle={sku.billingCycle} showIcon={false} />
              </AttributeDisplay>
              
              <AttributeDisplay label="Revenue Recognition" layout="horizontal">
                {sku.revenueRecognition}
              </AttributeDisplay>
            </AttributeGroup>
          </PageSection>

          {/* Overridable Attributes Section */}
          <PageSection title={toSentenceCase("Attributes")}>
            <AttributeGroup>
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
            </AttributeGroup>
          </PageSection>
        </Space>
      ),
    },
    {
      key: 'pricing',
      label: 'Pricing',
      children: (() => {
        const priceGroup = sku.priceGroup;
        
        // Count how many SKUs in this product use the same price group
        const skusWithSamePriceGroup = product.skus.filter(s => s.priceGroup.id === priceGroup.id);
        const otherSkusCount = skusWithSamePriceGroup.length - 1; // Exclude current SKU

        // Use the same filtering logic as PriceGroupDetail
        const {
          setSearchQuery: setPricePointSearchQuery,
          currencyFilters,
          setCurrencyFilters,
          regionFilters,
          setRegionFilters,
          statusFilters,
          setStatusFilters,
          currencyOptions,
          statusOptions,
          regionOptions,
          sortOrder: pricePointSortOrder,
          setSortOrder,
          groupBy: pricePointGroupBy, 
          setGroupBy: setPricePointGroupBy,
          filteredPricePoints,
          groupedPricePoints: groupedPricePointsData,
        } = usePricePointFilters(priceGroup.pricePoints);

        const clearAllPricePointFilters = () => {
          setPricePointSearchQuery('');
          setCurrencyFilters([]);
          setRegionFilters([]);
          setStatusFilters([]);
        };

        return (
          <Space direction="vertical" style={{ width: '100%' }} size={48}>
            {/* Price Group Information */}
            <PageSection 
              title={toSentenceCase("Price Group")}
            >
              <AttributeGroup>
                <AttributeDisplay label="Price Group Name" layout="horizontal">
                  {priceGroup.name}
                </AttributeDisplay>

                <AttributeDisplay label="Price Group ID" layout="horizontal">
                  <CopyableId id={priceGroup.id || ''} />
                </AttributeDisplay>
                
                {priceGroup.status && (
                  <AttributeDisplay label="Status" layout="horizontal">
                    <StatusTag status={priceGroup.status} variant="small" showIcon={false} />
                  </AttributeDisplay>
                )}
                


                {otherSkusCount > 0 && (
                  <AttributeDisplay label="Other SKUs" layout="horizontal">
                    <Space align="center" size="small">
                      <Typography.Text>
                        {otherSkusCount} other SKU{otherSkusCount !== 1 ? 's' : ''} use{otherSkusCount === 1 ? 's' : ''} this price group
                      </Typography.Text>
                      <Link to={`/product/${product.id}/price-group/${priceGroup.id}`}>
                        View all
                      </Link>
                    </Space>
                  </AttributeDisplay>
                )}
              </AttributeGroup>
            </PageSection>

            {/* Price Points */}
            <PageSection 
              title={toSentenceCase("Price points")}
            >
              <FilterBar
                useCustomFilters={true}
                search={{
                  placeholder: "Search by currency or ID...",
                  onChange: setPricePointSearchQuery,
                }}
                filters={[
                  {
                    placeholder: getFilterPlaceholder('currency'),
                    options: currencyOptions,
                    multiSelect: true,
                    multiValue: currencyFilters,
                    onMultiChange: (values: string[]) => setCurrencyFilters(values),
                    // Required for TypeScript interface compatibility
                    value: null,
                    onChange: () => {},
                  },
                  {
                    placeholder: getFilterPlaceholder('region'),
                    options: regionOptions,
                    multiSelect: true,
                    multiValue: regionFilters,
                    onMultiChange: (values: any[]) => setRegionFilters(values),
                    // Required for TypeScript interface compatibility
                    value: null,
                    onChange: () => {},
                  },
                  {
                    placeholder: getFilterPlaceholder('status'),
                    options: statusOptions,
                    multiSelect: true,
                    multiValue: statusFilters,
                    onMultiChange: (values: string[]) => setStatusFilters(values),
                    // Required for TypeScript interface compatibility
                    value: null,
                    onChange: () => {},
                  },
                ]}
                onClearAll={clearAllPricePointFilters}
                viewOptions={{
                  sortOrder: {
                    value: pricePointSortOrder,
                    setter: setSortOrder,
                    options: PRICE_POINT_SORT_OPTIONS,
                  },
                  groupBy: {
                    value: pricePointGroupBy,
                    setter: setPricePointGroupBy,
                    options: PRICE_POINT_GROUP_BY_OPTIONS,
                  },
                }}

              />
              <PricePointTable 
                pricePoints={filteredPricePoints} 
                groupedPricePoints={groupedPricePointsData}
                showUsdEquivalent={false}
              />
            </PageSection>
          </Space>
        );
      })(),
    },
    {
      key: 'features',
      label: 'Features',
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size={48}>
          {/* Features Section */}
          {((sku.features && sku.features.length > 0) || (product.features && product.features.length > 0)) ? (
            <PageSection 
              title={
                <Space size="small">
                  <span>{toSentenceCase("Features")}</span>
                  {isOverridden(sku.features) && <OverrideIndicator />}
                </Space>
              }
            >
              {(sku.features && sku.features.length > 0
                ? sku.features
                : product.features || []).length > 0 ? (
                <div style={{ marginTop: '16px' }}>
                  <Table
                    columns={[{ title: '', dataIndex: 'feature', key: 'feature' }]}
                    dataSource={(sku.features && sku.features.length > 0
                      ? sku.features
                      : product.features || []).map((feature, idx) => ({ key: idx, feature }))}
                    pagination={false}
                    size="small"
                    rowKey="key"
                    showHeader={false}
                  />
                </div>
              ) : (
                <span style={{ color: '#888' }}>No features listed for this SKU.</span>
              )}
              {isOverridden(sku.features) && (
                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                  <OverrideComparison 
                    skuValue={`${sku.features?.length || 0} features`} 
                    productValue={`${product.features?.length || 0} features`} 
                  />
                  <div style={{ marginTop: '12px' }}>
                    <Typography.Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                      Product Default Features:
                    </Typography.Text>
                    <div style={{ marginTop: '8px' }}>
                      <Table
                        columns={[{ title: '', dataIndex: 'feature', key: 'feature' }]}
                        dataSource={(product.features || []).map((feature, idx) => ({ key: idx, feature }))}
                        pagination={false}
                        size="small"
                        rowKey="key"
                        showHeader={false}
                      />
                    </div>
                  </div>
                </div>
              )}
            </PageSection>
          ) : (
            <PageSection title={toSentenceCase("Features")}>
              <span style={{ color: '#888' }}>No features listed for this SKU.</span>
            </PageSection>
          )}
        </Space>
      ),
    },
  ];

  // The error is because Ant Design's <Space> component expects the `size` prop to be one of: "small", "middle", "large", or a number.
  // "medium" is not a valid value. The closest valid value is "middle".
  // So, we should change size="medium" to size="middle".

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <PageHeader
        entityType="SKU"
        title={sku.id}
        tagContent={<StatusTag status={sku.status} showIcon={false} />}
        rightAlignedId={sku.id}
        channels={[sku.salesChannel]}
        billingCycles={[sku.billingCycle]}
        lastUpdatedBy="Anthony Homan"
        lastUpdatedAt={new Date(Date.now() - 45 * 60 * 1000)} // 45 minutes ago
        onEdit={() => console.log('Edit SKU clicked')}
        compact
      />

      <Tabs defaultActiveKey="overview" items={tabItems} />
    </Space>
  );
};

export default SkuDetail; 