import React, { useEffect, useState, useMemo } from 'react';
import { Typography, Space, Button, Modal, Tooltip, Tag, Alert, theme } from 'antd';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mockProducts } from '../utils/mock-data';
import { loadProductWithPricing } from '../utils/demoDataLoader';
import { useBreadcrumb } from '../context/BreadcrumbContext';

import { usePricePointFilters } from '../hooks/usePricePointFilters';
import type { ColumnConfig, ColumnVisibility, ColumnOrder } from '../utils/types';
import {
  PageHeader,
  PriceGroupStatusTag,
  PageSection,
  FilterBar,
  AttributeDisplay,
  AttributeGroup,
  SalesChannelDisplay,
  BillingCycleDisplay,
  BillingModelDisplay
} from '../components';


import PricePointTable from '../components/pricing/PricePointTable';
import { toSentenceCase } from '../utils/formatters';
import { 
  PRICE_POINT_COLUMNS, 
  PRICE_POINT_SORT_OPTIONS,
  DEFAULT_PRICE_POINT_COLUMNS
} from '../utils/tableConfigurations';
import { DollarSign, Download } from 'lucide-react';

const { Title } = Typography;

const PriceGroupDetail: React.FC = () => {
  const { token } = theme.useToken();
  const { productId, priceGroupId } = useParams<{ productId: string; priceGroupId: string }>();
  const { setProductName, setPriceGroupId, setPriceGroupName } = useBreadcrumb();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the tab we came from (for smart back navigation)
  const searchParams = new URLSearchParams(location.search);
  const fromTab = searchParams.get('from') || 'overview';

  const [product, setProduct] = useState(mockProducts.find(p => p.id === productId));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load enhanced product data with price groups from JSON files
  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      setError(null);
      loadProductWithPricing(productId)
        .then(enhancedProduct => {
          console.log('Enhanced product loaded:', enhancedProduct);
          if (enhancedProduct) {
            setProduct(enhancedProduct);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error loading product with pricing:', err);
          setError(err.message || 'Failed to load product data');
          setIsLoading(false);
        });
    }
  }, [productId]);
  
  // Find all SKUs that use this price group
  const skusWithPriceGroup = product?.skus.filter(sku => sku.priceGroup.id === priceGroupId) || [];
  
  console.log('PriceGroupDetail - productId:', productId, 'priceGroupId:', priceGroupId);
  console.log('Product SKUs:', product?.skus.map(sku => ({ id: sku.id, priceGroupId: sku.priceGroup.id })));
  console.log('Matching SKUs:', skusWithPriceGroup.length);
  
  // Get the price group data from the first SKU (all SKUs with same price group have same price data)
  const priceGroup = skusWithPriceGroup[0]?.priceGroup;

  // IMPORTANT: All hooks must be called before any conditional returns
  // Price point filtering hook - must always be called even if priceGroup is null
  const {
    setSearchQuery: setPricePointSearchQuery,
    currencyFilters,
    setCurrencyFilters,
    statusFilters,
    setStatusFilters,
    categoryFilters,
    setCategoryFilters,
    currencyOptions,
    statusOptions,
    categoryOptions,
    sortOrder: pricePointSortOrder,
    setSortOrder: setPricePointSortOrder,
    groupBy: pricePointGroupBy,
    setGroupBy: setPricePointGroupBy,
    filteredPricePoints,
    groupedPricePoints: groupedPricePointsData,
  } = usePricePointFilters(priceGroup?.pricePoints || []);

  // Default column visibility configuration for PricePointTable
  const pricePointDefaultVisibility = useMemo(() => {
    const defaultVisibility: ColumnVisibility = {};
    PRICE_POINT_COLUMNS.forEach(col => {
      // Show region and category (currencyType) by default
      // Hide pricingRule, quantityRange, and priceType by default
      // ID column is now visible by default to match PriceGroupTable pattern
      if (col.key === 'pricingRule' || col.key === 'quantityRange' || col.key === 'priceType') {
        defaultVisibility[col.key] = false;
      } else {
        defaultVisibility[col.key] = true;
      }
    });
    return defaultVisibility;
  }, []);

  // Column visibility state for PricePointTable
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>(() => {
    return pricePointDefaultVisibility;
  });

  // Column order state for PricePointTable - use default order from table configurations
  const [columnOrder, setColumnOrder] = useState<ColumnOrder>(
    DEFAULT_PRICE_POINT_COLUMNS
  );



  // Column configuration for PricePointTable - use centralized configuration
  const columnOptions: ColumnConfig[] = PRICE_POINT_COLUMNS;

  // Sort options for PricePointTable - use centralized configuration
  const sortOptions = PRICE_POINT_SORT_OPTIONS;



  useEffect(() => {
    if (product) {
      setProductName(product.name);
    }
    if (priceGroupId) {
      setPriceGroupId(priceGroupId);
    }
    if (priceGroup) {
      setPriceGroupName(priceGroup.name || null);
    }

    return () => {
      setProductName(null);
      setPriceGroupId(null);
      setPriceGroupName(null);
    };
  }, [product, priceGroupId, setProductName, setPriceGroupId, priceGroup, setPriceGroupName]);

  if (isLoading) {
    return (
      <div>
        <Title level={2}>Loading...</Title>
        <p>Loading price group data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title level={2}>Error Loading Data</Title>
        <p>{error}</p>
        <p>Please check the browser console for more details.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Title level={2}>Product Not Found</Title>
        <p>The requested product could not be found.</p>
      </div>
    );
  }

  if (!priceGroup || skusWithPriceGroup.length === 0) {
    return (
      <div>
        <Title level={2}>Price Group Not Found</Title>
        <p>The requested price group could not be found in this product.</p>
        <p>Available price groups: {product.skus.map(sku => sku.priceGroup.id).join(', ')}</p>
      </div>
    );
  }

  // Helper function for clearing filters

  const clearAllPricePointFilters = () => {
    setPricePointSearchQuery('');
    setCurrencyFilters([]);
    setStatusFilters([]);
    setCategoryFilters([]);
  };

  // Extract unique channels and billing cycles from associated SKUs
  const uniqueChannels = [...new Set(skusWithPriceGroup.map(sku => sku.salesChannel))];
  const uniqueBillingCycles = [...new Set(skusWithPriceGroup.map(sku => sku.billingCycle))];
  
  // Check if this price group has mobile channels (iOS or GPB)
  const hasMobileChannels = uniqueChannels.some(channel => channel === 'iOS' || channel === 'GPB');
  
  // Check if this price group is exclusively mobile channels (iOS and/or GPB only)
  const isMobileOnlyPriceGroup = uniqueChannels.length > 0 && 
    uniqueChannels.every(channel => channel === 'iOS' || channel === 'GPB');
  
  // Mock app data for mobile channels - based on actual app store listings
  const getAppInfo = (channel: string) => {
    switch (channel) {
      case 'iOS':
        return {
          name: 'LinkedIn: Network & Job Finder', // From App Store
          icon: 'https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg'
        };
      case 'GPB':
        return {
          name: 'LinkedIn: Jobs & Business News', // From Google Play Store  
          icon: 'https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg'
        };
      default:
        return null;
    }
  };
  
  // Get app info for mobile channels
  const appInfo = hasMobileChannels ? 
    uniqueChannels
      .filter(channel => channel === 'iOS' || channel === 'GPB')
      .map(channel => ({ channel, ...getAppInfo(channel) }))
      .filter(info => info.name && info.icon) 
    : [];
  
  // Get LIX key and treatment from the first SKU's lix property
  const firstSku = skusWithPriceGroup[0];
  const lixKey = firstSku?.lix?.key;
  const lixTreatment = firstSku?.lix?.treatment;
  
  // Find other price groups with the same LIX key (excluding current one)
  const otherPriceGroupsInExperiment = lixKey ? 
    product?.skus
      .filter(sku => sku.lix?.key === lixKey && sku.priceGroup.id !== priceGroupId)
      .map(sku => sku.priceGroup)
      .filter((priceGroup, index, self) => 
        // Remove duplicates based on price group ID
        index === self.findIndex(pg => pg.id === priceGroup.id)
      ) || []
    : [];
  




  return (
    <Space direction="vertical" style={{ width: '100%' }} size={48}>
      <PageHeader
        icon={<DollarSign />}
        iconSize={14}
        entityType="Price group"
        title={priceGroup.name || `Price group for ${product.name}`}
        tagContent={<PriceGroupStatusTag priceGroup={priceGroup} />}
        rightAlignedId={priceGroup.id || ''}
        compact
      />

      {/* Details Section */}
      <PageSection title={toSentenceCase('Details')}>
        <AttributeGroup>
          <AttributeDisplay layout="horizontal" label="Configuration">
            <Space size={4}>
              {product?.billingModel && (
                <BillingModelDisplay model={product.billingModel} variant="small" />
              )}
              {uniqueChannels.map(channel => (
                <SalesChannelDisplay key={channel} channel={channel} variant="small" />
              ))}
              {uniqueBillingCycles.map(cycle => (
                <BillingCycleDisplay key={cycle} billingCycle={cycle} variant="small" />
              ))}
            </Space>
          </AttributeDisplay>
          
          {appInfo.length > 0 && (
            <AttributeDisplay layout="horizontal" label="App">
              <Space size="small">
                {appInfo.map(app => (
                  <Space key={app.channel} size={6} align="center">
                    <img 
                      src={app.icon} 
                      alt={`${app.name} icon`}
                      style={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '4px',
                        objectFit: 'cover'
                      }}
                    />
                    <span>{app.name}</span>
                  </Space>
                ))}
              </Space>
            </AttributeDisplay>
          )}
          
          {hasMobileChannels && (
            <AttributeDisplay layout="horizontal" label="External product identifier">
              <Tag 
                style={{ fontSize: '11px', margin: 0, padding: '0 6px', lineHeight: '18px' }}
              >
                ext_prod_id
              </Tag>
            </AttributeDisplay>
          )}

          <AttributeDisplay layout="horizontal" label="Tax">
            <span style={{ 
              fontSize: token.fontSize,
              color: token.colorText
            }}>
              {isMobileOnlyPriceGroup ? 'Tax inclusive' : 'Tax exclusive'}
            </span>
          </AttributeDisplay>

          <AttributeDisplay layout="horizontal" label="Experiment">
            {(lixKey || lixTreatment) ? (
              <Space size="small" align="center">
                {lixKey && (
                  <Tooltip title="LIX Key" mouseEnterDelay={0.5}>
                    <span style={{ 
                      fontSize: token.fontSize,
                      color: token.colorText,
                      cursor: 'default'
                    }}>
                      {lixKey}
                    </span>
                  </Tooltip>
                )}
                {lixKey && lixTreatment && <span>/</span>}
                {lixTreatment && (
                  <Tooltip title="LIX Treatment" mouseEnterDelay={0.5}>
                    <span style={{ 
                      fontSize: token.fontSize,
                      color: token.colorText,
                      cursor: 'default'
                    }}>
                      {lixTreatment}
                    </span>
                  </Tooltip>
                )}
              </Space>
            ) : (
              <span style={{ color: token.colorTextTertiary }}>None</span>
            )}
          </AttributeDisplay>
          {otherPriceGroupsInExperiment.length > 0 && (
            <AttributeDisplay layout="horizontal" label="Other prices in experiment">
              <Space size="small" wrap>
                {otherPriceGroupsInExperiment.map(pg => (
                  <a
                    key={pg.id}
                    href={`/product/${productId}/price-group/${pg.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/product/${productId}/price-group/${pg.id}`);
                    }}
                    style={{
                      color: token.colorPrimary,
                      textDecoration: 'none',
                      fontSize: '13px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    {pg.id}
                  </a>
                ))}
              </Space>
            </AttributeDisplay>
          )}
        </AttributeGroup>
      </PageSection>

      {/* Price Points */}
      <PageSection 
        title={toSentenceCase("Price points")}
      >
        {!isMobileOnlyPriceGroup && (
          <FilterBar
            useCustomFilters={true}
            search={{
              placeholder: "Search by currency or ID...",
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
              {
                placeholder: "All statuses",
                options: statusOptions,
                multiSelect: true,
                multiValue: statusFilters,
                onMultiChange: (values: string[]) => setStatusFilters(values),
                // Required for TypeScript interface compatibility
                value: null,
                onChange: () => {},
              },

              {
                placeholder: "All categories",
                options: categoryOptions,
                multiSelect: true,
                multiValue: categoryFilters,
                onMultiChange: (values: string[]) => setCategoryFilters(values),
                // Required for TypeScript interface compatibility
                value: null,
                onChange: () => {},
              },
            ]}
            onClearAll={clearAllPricePointFilters}
            viewOptions={{
              sortOrder: {
                value: pricePointSortOrder,
                setter: setPricePointSortOrder,
                options: sortOptions,
              },
              groupBy: {
                value: pricePointGroupBy,
                setter: setPricePointGroupBy,
                options: ['None', 'Category', 'Currency', 'Pricing rule', 'Price type', 'Validity'],
              },
              columnOptions,
              visibleColumns,
              setVisibleColumns,
              columnOrder,
              setColumnOrder,
              defaultVisibleColumns: pricePointDefaultVisibility,
              defaultColumnOrder: DEFAULT_PRICE_POINT_COLUMNS,
            }}
            displayMode="inline"
            rightActions={[
              <Button 
                key="export"
                icon={<Download size={16} />}
                size="middle"
                style={{
                  height: '28px',
                  minHeight: '28px',
                }}
                onClick={() => {
                  Modal.info({
                    title: 'Export Price Points',
                    content: (
                      <div>
                        <p>This would export all price point data for <strong>{priceGroup?.name}</strong> to CSV format.</p>
                        <p style={{ marginTop: 8, fontSize: '13px', color: token.colorTextSecondary }}>
                          Includes: Price point IDs, currencies, amounts, pricing rules, quantity ranges, USD equivalents, and validity periods.
                        </p>
                      </div>
                    ),
                    okText: 'Got it',
                    width: 400,
                  });
                }}
              >
                Export
              </Button>
            ]}
          />
        )}
        {isMobileOnlyPriceGroup ? (
          <Alert
            type="info"
            showIcon
            message="Price points are managed externally"
            description={
              <div>
                <p>
                  To view price points for mobile subscriptions, visit the respective app store platforms 
                  and search for the subscription that matches the <strong>External product identifier</strong> shown above.
                </p>
                <div style={{ marginTop: 12 }}>
                  <Space direction="vertical" size={4}>
                    {uniqueChannels.includes('iOS') && (
                      <div>
                        <strong>Apple App Store Connect:</strong>{' '}
                        <a 
                          href="https://appstoreconnect.apple.com/apps/subscriptions" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: token.colorPrimary }}
                        >
                          appstoreconnect.apple.com/apps/subscriptions
                        </a>
                      </div>
                    )}
                    {uniqueChannels.includes('GPB') && (
                      <div>
                        <strong>Google Play Console:</strong>{' '}
                        <a 
                          href="https://play.google.com/console/billing/subscriptions" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: token.colorPrimary }}
                        >
                          play.google.com/console/billing/subscriptions
                        </a>
                      </div>
                    )}
                  </Space>
                </div>
              </div>
            }
            style={{ marginTop: 16 }}
          />
        ) : (
          <PricePointTable 
            pricePoints={filteredPricePoints} 
            groupedPricePoints={groupedPricePointsData}
            visibleColumns={visibleColumns}
            columnOrder={columnOrder}
            sortOrder={pricePointSortOrder}
            isTaxInclusive={isMobileOnlyPriceGroup}
          />
        )}
      </PageSection>
    </Space>
  );
};

export default PriceGroupDetail; 