import React, { useEffect } from 'react';
import { Typography, Space, Table, Tabs } from 'antd';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockProducts } from '../utils/mock-data';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { useLayout } from '../context/LayoutContext';
import { usePricePointFilters } from '../hooks/usePricePointFilters';
import { toSentenceCase, formatValidityRange } from '../utils/formatters';
import { PRICE_POINT_SORT_OPTIONS } from '../utils/tableConfigurations';
import {
  PageHeader,
  StatusTag,
  PageSection,
  AttributeDisplay,
  AttributeGroup,
  SalesChannelDisplay,
  OverrideIndicator,
  OverrideComparison,
  FilterBar
} from '../components';
import PricePointTable from '../components/pricing/PricePointTable';
import CopyableId from '../components/shared/CopyableId';
import { Tag as SkuIcon, AlertCircle } from 'lucide-react';

const { Title } = Typography;

const SkuDetail: React.FC = () => {
  const { productId, skuId } = useParams<{ productId: string; skuId: string }>();
  const { setProductName, setSkuId } = useBreadcrumb();
  const { setMaxWidth } = useLayout();
  const navigate = useNavigate();

  const product = mockProducts.find(p => p.id === productId);
  const sku = product?.skus.find(s => s.id === skuId);

  useEffect(() => {
    // Set wider max-width for detail pages to accommodate data tables
    setMaxWidth('1200px');

    return () => {
      setMaxWidth('1024px'); // Reset to default width
    };
  }, [setMaxWidth]);

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
                <StatusTag status={sku.status} />
              </AttributeDisplay>
            </AttributeGroup>
          </PageSection>

          {/* Configuration Section */}
          <PageSection title={toSentenceCase("Configuration")}>
            <AttributeGroup>
              <AttributeDisplay label="Sales Channel" layout="horizontal">
                <SalesChannelDisplay channel={sku.salesChannel} />
              </AttributeDisplay>
              
              <AttributeDisplay label="Billing Cycle" layout="horizontal">
                {sku.billingCycle}
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
          currencyOptions,
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
                  <CopyableId id={priceGroup.id || ''} size="small" />
                </AttributeDisplay>
                
                {priceGroup.status && (
                  <AttributeDisplay label="Status" layout="horizontal">
                    <StatusTag status={priceGroup.status} />
                  </AttributeDisplay>
                )}
                
                {(priceGroup.validFrom || priceGroup.validTo) && (
                  <AttributeDisplay label="Effective Period" layout="horizontal">
                    {formatValidityRange(priceGroup.validFrom, priceGroup.validTo)}
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
                search={{
                  placeholder: "Search by currency...",
                  onChange: setPricePointSearchQuery,
                }}
                filters={[
                  {
                    placeholder: "All currencies",
                    options: currencyOptions,
                    multiSelect: true,
                    multiValue: currencyFilters,
                    onMultiChange: (values: string[]) => setCurrencyFilters(values),
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
                    options: ['None', 'Category'],
                  },
                }}
                displayMode="inline"
                filterSize="large"
                searchAndViewSize="large"
              />
              <PricePointTable 
                pricePoints={filteredPricePoints} 
                groupedPricePoints={groupedPricePointsData}
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
                <div className="content-panel">
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
                    <div className="content-panel" style={{ marginTop: '8px' }}>
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

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <PageHeader
        icon={<SkuIcon />}
        iconSize={16}
        entityType="SKU"
        title={sku.id}
        onBack={() => navigate(-1)}
        tagContent={<StatusTag status={sku.status} />}
        subtitle={<CopyableId id={sku.id} size="small" />}
      />

      <Tabs defaultActiveKey="overview" items={tabItems} />
    </Space>
  );
};

export default SkuDetail; 